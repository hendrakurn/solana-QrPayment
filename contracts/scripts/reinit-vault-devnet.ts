/**
 * Closes the existing Vault PDA and reinitializes it with the IDRX mint.
 *
 * Usage:
 *   ANCHOR_WALLET=./wallet.json \
 *   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
 *     pnpm exec ts-node scripts/reinit-vault-devnet.ts
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
  console.log("IDRX mint:  ", IDRX_MINT.toBase58());

  const program = new Program(idl, provider);

  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    PROGRAM_ID,
  );
  const vaultAta = await getAssociatedTokenAddress(IDRX_MINT, vaultPda, true);

  console.log("Vault PDA:  ", vaultPda.toBase58());
  console.log("New ATA:    ", vaultAta.toBase58());

  // Step 1: close existing vault
  const existing = await provider.connection.getAccountInfo(vaultPda);
  if (existing) {
    console.log("\nClosing existing vault…");
    const closeSig = await program.methods
      .closeVault()
      .accounts({
        authority: provider.wallet.publicKey,
        vault: vaultPda,
      })
      .rpc({ commitment: "confirmed", skipPreflight: true });
    console.log("Closed. Tx:", closeSig);
  } else {
    console.log("\nNo existing vault found, skipping close.");
  }

  // Step 2: initialize with IDRX mint (build + sign manually to avoid Anchor provider quirks)
  console.log("\nInitializing vault with IDRX mint…");
  const initTx = await program.methods
    .initializeVault()
    .accounts({
      authority: provider.wallet.publicKey,
      vault: vaultPda,
      idrxMint: IDRX_MINT,
      vaultTokenAccount: vaultAta,
    })
    .transaction();

  const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash("confirmed");
  initTx.recentBlockhash = blockhash;
  initTx.feePayer = provider.wallet.publicKey;

  const signed = await provider.wallet.signTransaction(initTx);
  const initSig = await provider.connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });
  await provider.connection.confirmTransaction({ signature: initSig, blockhash, lastValidBlockHeight }, "confirmed");

  console.log("Done. Tx:", initSig);
  console.log("Explorer:", `https://explorer.solana.com/tx/${initSig}?cluster=devnet`);

  // Verify
  const v = await (program.account as any).vault.fetch(vaultPda);
  console.log("\nVault state:");
  console.log("  authority:     ", (v as any).authority.toBase58());
  console.log("  idrxMint:      ", (v as any).idrxMint.toBase58());
  console.log("  tokenAccount:  ", (v as any).vaultTokenAccount.toBase58());
  console.log("  paymentCount:  ", (v as any).paymentCount.toString());
}

main().catch((e) => {
  console.error("\n[reinit-vault-devnet] FAILED:");
  console.error(e);
  process.exit(1);
});
