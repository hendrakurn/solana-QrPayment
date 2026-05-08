import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import { SOLPAY_IDL } from "./idl";

/**
 * Builds an Anchor Program client bound to the connected wallet. Returns null
 * when the wallet hasn't authorized signing yet.
 *
 * IMPORTANT: Anchor 0.32 requires the 2-arg constructor `new Program(idl, provider)`.
 * The legacy 3-arg form `new Program(idl, programId, provider)` throws
 * `TypeError: Cannot read properties of undefined (reading 'size')` in 0.32.
 * programId is read from `idl.address` — we hot-patched contracts/idl/solpay.json
 * line 2 so this matches `declare_id!` in lib.rs.
 */
export function getSolpayProgram(
  connection: Connection,
  wallet: WalletContextState,
): Program<Idl> | null {
  if (!wallet.publicKey || !wallet.signTransaction) return null;

  const provider = new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions:
        wallet.signAllTransactions ?? (async (txs) => txs),
    },
    { commitment: "confirmed" },
  );

  return new Program(SOLPAY_IDL, provider);
}
