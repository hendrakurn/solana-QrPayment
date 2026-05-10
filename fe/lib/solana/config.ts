import { PublicKey } from "@solana/web3.js";

export const SOLANA_CLUSTER = "devnet" as const;

export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export const SOLPAY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SOLPAY_PROGRAM_ID ??
    "35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ",
);

// IDRX: Indonesian Rupiah stablecoin on Solana (1 IDRX = 1 IDR)
// Devnet: create via `spl-token create-token --decimals 2`
export const IDRX_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_IDRX_MINT ??
    "FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM",
);
export const IDRX_DECIMALS = 2;

// PDA seeds — match contracts/programs/solpay/src/instructions/*
export const VAULT_SEED = Buffer.from("vault");
export const PAYMENT_SEED = Buffer.from("payment");
