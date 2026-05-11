import { Program, Idl, BN } from "@coral-xyz/anchor";
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  Transaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { IDRX_MINT, IDRX_DECIMALS } from "./config";
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
  amountIdrxRaw: string;
  amountIdr: number;
}

export class TokenAccountMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenAccountMismatchError";
  }
}

/**
 * Sends `create_payment` to the on-chain solpay program.
 *
 * Behavior:
 *  - Fetches the global Vault PDA. Throws if the vault is not initialized.
 *  - If the connected wallet has no IDRX associated token account, bundles a
 *    `createAssociatedTokenAccountInstruction` as a pre-instruction so the
 *    user only sees ONE wallet popup for the whole flow.
 *  - Generates a fresh payment-record keypair for each attempt so concurrent
 *    or repeated payments cannot collide on the same account address.
 *  - Adds a small priority fee (1000 microLamports/CU) for resilience during
 *    devnet congestion.
 *  - Simulates the transaction client-side BEFORE sending to the wallet so
 *    that failures surface as a readable error in our UI instead of the
 *    wallet's "funds may be lost" simulation warning.
 */
export async function executePayment(p: PayParams): Promise<PayResult> {
  const conn = p.program.provider.connection;

  // 1. Read vault state and allocate a unique payment record for this attempt
  const { vaultPda, vault } = await fetchVault(p.program);
  const paymentRecord = Keypair.generate();

  const vaultAta = await getAssociatedTokenAddress(IDRX_MINT, vaultPda, true);
  const payerAta = await getAssociatedTokenAddress(IDRX_MINT, p.payer);

  if (!vault.idrxMint.equals(IDRX_MINT)) {
    throw new TokenAccountMismatchError(
      `Vault mint mismatch: app uses ${IDRX_MINT.toBase58()} but vault expects ${vault.idrxMint.toBase58()}. Restart the frontend after fixing NEXT_PUBLIC_IDRX_MINT or reinitialize the vault.`,
    );
  }

  if (!vault.vaultTokenAccount.equals(vaultAta)) {
    throw new TokenAccountMismatchError(
      `Vault token account mismatch: app derived ${vaultAta.toBase58()} but vault stores ${vault.vaultTokenAccount.toBase58()}. Reinitialize the vault for the active IDRX mint.`,
    );
  }

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

  // 3. Build instruction args (raw u64 = human × 10^2)
  const amountIdrxRaw = new BN(Math.round(p.amountIdrx * 10 ** IDRX_DECIMALS));
  const amountIdrBn = new BN(p.amountIdr);

  // 4. Build unsigned transaction with blockhash + feePayer
  const tx = await p.program.methods
    .createPayment(amountIdrxRaw, amountIdrBn, p.merchantId, p.xenditReference)
    .accounts({
      payer: p.payer,
      vault: vaultPda,
      vaultTokenAccount: vaultAta,
      payerTokenAccount: payerAta,
      idrxMint: IDRX_MINT,
      paymentRecord: paymentRecord.publicKey,
    })
    .preInstructions(preInstructions)
    .transaction();

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = p.payer;
  tx.partialSign(paymentRecord);

  // 5. Simulate before asking wallet to sign.
  //    This catches program errors early so our UI shows a readable message
  //    instead of the wallet's generic "simulation failed" warning.
  const sim = await conn.simulateTransaction(tx);
  if (sim.value.err) {
    const logs = sim.value.logs ?? [];
    const anchorLog = logs.find((l) => l.includes("AnchorError") || l.includes("Error Code:"));
    const programFailed = logs.find((l) => l.includes("failed to complete") || l.includes("Custom"));
    const detail = anchorLog ?? programFailed ?? JSON.stringify(sim.value.err);
    throw new SimulationError(detail, logs);
  }

  // 6. Sign via wallet adapter and broadcast
  const signedTx = await p.signTransaction(tx);
  const sig = await conn.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");

  return {
    signature: sig,
    paymentPda: paymentRecord.publicKey.toBase58(),
    amountIdrxRaw: amountIdrxRaw.toString(),
    amountIdr: p.amountIdr,
  };
}

export class SimulationError extends Error {
  logs: string[];
  constructor(message: string, logs: string[]) {
    super(message);
    this.name = "SimulationError";
    this.logs = logs;
  }
}
