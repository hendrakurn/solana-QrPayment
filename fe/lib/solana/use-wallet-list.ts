"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Wallet } from "@/types";
import { useIdrxBalance } from "./use-usdc-balance";

export interface WalletListState {
  wallets: Wallet[];
  totalIdr: number;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

/**
 * Builds the wallet list shown on /wallet.
 * Returns empty list when no wallet is connected.
 */
export function useWalletList(): WalletListState {
  const { publicKey, connected } = useWallet();
  const { uiAmount, loading, error } = useIdrxBalance();

  const wallets = useMemo<Wallet[]>(() => {
    if (!publicKey) return [];
    const live: Wallet = {
      id: "w-idrx",
      symbol: "IDRX",
      network: "Solana",
      label: "IDRX",
      balance: uiAmount,
      fiatValue: Math.round(uiAmount),
      apr: 4.8,
      trend24h: 0,
      lastUsedAt: new Date(),
      useCount: 0,
      isDefault: true,
      address: publicKey.toBase58(),
    };
    return [live];
  }, [publicKey, uiAmount]);

  const totalIdr = wallets.reduce((sum, w) => sum + w.fiatValue, 0);

  return { wallets, totalIdr, loading, error, connected };
}
