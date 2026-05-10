/**
 * One-time devnet bootstrap: initializes the global Vault PDA and its USDC ATA.
 *
 * Usage:
 *   ANCHOR_WALLET=./wallet.json \
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *     pnpm exec ts-node scripts/init-vault-devnet.ts
 *
 * The wallet provided becomes `vault.authority` — the only key allowed to
 * `confirm_payment` and `refund_payment` going forward. Idempotent: if the
 * vault already exists on devnet, the script logs and exits without sending.
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID ?? "35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ");
const IDRX_MINT = new PublicKey(process.env.IDRX_MINT ?? "FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM");

const __dirname = dirname(fileURLToPath(import.meta.url));
const idlPath = resolve(__dirname, "../idl/solpay.json");
const idl = JSON.parse(readFileSync(idlPath, "utf-8"));

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  console.log("Cluster:    ", provider.connection.rpcEndpoint);
  console.log("Authority:  ", provider.wallet.publicKey.toBase58());
  console.log("Program ID: ", PROGRAM_ID.toBase58());
  console.log("IDRX mint:  ", IDRX_MINT.toBase58());

  // Anchor 0.32: 2-arg constructor — programId read from idl.address
  const program = new Program(idl, provider);

  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    PROGRAM_ID,
  );
  const vaultAta = await getAssociatedTokenAddress(IDRX_MINT, vaultPda, true);

  console.log("Vault PDA:  ", vaultPda.toBase58());
  console.log("Vault ATA:  ", vaultAta.toBase58());

  const existing = await provider.connection.getAccountInfo(vaultPda);
  if (existing) {
    console.log("\nVault already initialized — nothing to do.");
    const v = await (program.account as any).vault.fetch(vaultPda);
    console.log("authority:      ", (v as any).authority.toBase58());
    console.log("tokenMint:      ", (v as any).usdcMint.toBase58());
    console.log("paymentCount:   ", (v as any).paymentCount.toString());
    console.log("totalReceived:  ", (v as any).totalReceived.toString());
    return;
  }

  console.log("\nVault not found — sending initialize_vault…");
  const sig = await program.methods
    .initializeVault()
    .accounts({
      authority: provider.wallet.publicKey,
      vault: vaultPda,
      usdcMint: IDRX_MINT,
      vaultTokenAccount: vaultAta,
    })
    .rpc({ commitment: "confirmed" });

  console.log("\nDone.");
  console.log("Tx:         ", sig);
  console.log(
    "Explorer:   ",
    `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
  );
}

main().catch((e) => {
  console.error("\n[init-vault-devnet] FAILED:");
  console.error(e);
  process.exit(1);
});
