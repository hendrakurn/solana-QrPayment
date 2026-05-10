import { Program, Idl } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { deriveVaultPda } from "./pda";

export interface VaultState {
  authority: PublicKey;
  idrxMint: PublicKey;
  vaultTokenAccount: PublicKey;
  totalReceived: BN;
  totalSettled: BN;
  totalRefunded: BN;
  paymentCount: BN;
  bump: number;
}

/**
 * Fetches the global Vault PDA. Throws if the vault hasn't been initialized
 * yet — the caller (Pay flow) should surface a "vault not initialized" message
 * and link to the bootstrap docs.
 */
export async function fetchVault(program: Program<Idl>): Promise<{
  vaultPda: PublicKey;
  vault: VaultState;
}> {
  const [vaultPda] = deriveVaultPda();
  // `Program<Idl>` doesn't statically know account names, so go through the
  // record namespace. Account-name casing matches the IDL (`Vault` →
  // `program.account.vault`).
  const accounts = program.account as unknown as Record<
    string,
    { fetch: (addr: PublicKey) => Promise<unknown> }
  >;
  const vault = (await accounts.vault.fetch(vaultPda)) as VaultState;
  return { vaultPda, vault };
}
