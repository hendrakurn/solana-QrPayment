import { PublicKey } from "@solana/web3.js";

export const SOLANA_CLUSTER = "devnet" as const;

export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export const SOLPAY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SOLPAY_PROGRAM_ID ??
    "35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ",
);

export const USDC_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT ??
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);
export const USDC_DECIMALS = 6;

// PDA seeds — match contracts/programs/solpay/src/instructions/*
export const VAULT_SEED = Buffer.from("vault");
export const PAYMENT_SEED = Buffer.from("payment");
