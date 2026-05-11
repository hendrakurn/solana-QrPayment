import { PublicKey } from "@solana/web3.js";
import { SOLPAY_PROGRAM_ID, VAULT_SEED } from "./config";

export function deriveVaultPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([VAULT_SEED], SOLPAY_PROGRAM_ID);
}
