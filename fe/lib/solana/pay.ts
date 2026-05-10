import { Program, Idl, BN } from "@coral-xyz/anchor";
import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { IDRX_MINT, IDRX_DECIMALS } from "./config";
import { derivePaymentPda } from "./pda";
import { fetchVault } from "./vault";

export interface PayParams {
  program: Program<Idl>;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  payer: PublicKey;
  /** Human units, e.g. 2000 means 2000 IDRX (= Rp 2.000). Scaled by 10^2 internally. */
  amountIdrx: number;
  /** Whole rupiah, e.g. 42500. */
  amountIdr: number;
  /** Max 32 chars per the program's PaymentRecord struct. */
  merchantId: string;
  /** Max 64 chars. For MVP non-Xendit, pass `crypto.randomUUID()`. */
  xenditReference: string;
}

export interface PayResult {
  signature: string;
  paymentPda: string;
  paymentCount: number;
  amountIdrxRaw: string;
  amountIdr: number;
}

/**
 * Sends `create_payment` to the on-chain solpay program.
 *
 * Behavior:
 *  - Fetches the global Vault PDA to read the current `payment_count` and
 *    derive the next PaymentRecord PDA. Throws if the vault is not initialized.
 *  - If the connected wallet has no IDRX associated token account, bundles a
 *    `createAssociatedTokenAccountInstruction` as a pre-instruction so the
 *    user only sees ONE Phantom popup for the whole flow.
 *  - Adds a small priority fee (1000 microLamports/CU) for resilience during
 *    devnet congestion.
 *  - Skips an explicit `simulateTransaction` call: doing one with Anchor's
 *    `MethodsBuilder.simulate()` triggers a second Phantom signature popup,
 *    which degrades UX. The default RPC preflight (run server-side after
 *    Phantom signs) covers program-level rejections.
 *
 * Race note: between fetching `payment_count` and the program executing,
 * another payer could increment the counter, causing the `init` constraint to
 * fail. Acceptable for MVP — user retries. A future fix is per-user nonce
 * seeds in the PaymentRecord PDA.
 */
export async function executePayment(p: PayParams): Promise<PayResult> {
  const conn = p.program.provider.connection;

  // 1. Read vault state and derive the PaymentRecord PDA
  const { vaultPda, vault } = await fetchVault(p.program);
  const paymentCount = vault.paymentCount;
  const [paymentPda] = derivePaymentPda(vaultPda, paymentCount);

  const vaultAta = await getAssociatedTokenAddress(IDRX_MINT, vaultPda, true);
  const payerAta = await getAssociatedTokenAddress(IDRX_MINT, p.payer);

  // 2. Pre-instructions: priority fee + (optional) ATA creation if missing
  const preInstructions: TransactionInstruction[] = [
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
  ];

  const payerAtaInfo = await conn.getAccountInfo(payerAta);
  if (!payerAtaInfo) {
    preInstructions.push(
      createAssociatedTokenAccountInstruction(
        p.payer,
        payerAta,
        p.payer,
        IDRX_MINT,
      ),
    );
  }

  // 3. Build instruction args (raw u64 = human × 10^6)
  const amountIdrxRaw = new BN(Math.round(p.amountIdrx * 10 ** IDRX_DECIMALS));
  const amountIdrBn = new BN(p.amountIdr);

  // 4. Build unsigned transaction, explicitly set feePayer + blockhash,
  //    then sign via the wallet adapter (always the current active account)
  //    and send as a raw transaction — bypassing the stale-provider issue
  //    where AnchorProvider.sendAndConfirm used a captured (old) publicKey.
  const tx = await p.program.methods
    .createPayment(amountIdrxRaw, amountIdrBn, p.merchantId, p.xenditReference)
    .accounts({
      payer: p.payer,
      vault: vaultPda,
      vaultTokenAccount: vaultAta,
      payerTokenAccount: payerAta,
      usdcMint: IDRX_MINT,
      paymentRecord: paymentPda,
    })
    .preInstructions(preInstructions)
    .transaction();

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = p.payer;

  const signedTx = await p.signTransaction(tx);
  const sig = await conn.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");

  return {
    signature: sig,
    paymentPda: paymentPda.toBase58(),
    paymentCount: paymentCount.toNumber(),
    amountIdrxRaw: amountIdrxRaw.toString(),
    amountIdr: p.amountIdr,
  };
}
