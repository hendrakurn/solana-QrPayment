"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Wallet } from "@/types";
import { useUsdcBalance } from "./use-usdc-balance";

/**
 * Hardcoded USDC→IDR rate for MVP. Matches the rate used elsewhere
 * (BalanceCardLive, mockPaymentDraft) so totals stay consistent.
 */
const RATE_IDR_PER_USDC = 15_640;


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
  const { uiAmount, loading, error } = useUsdcBalance();

  const wallets = useMemo<Wallet[]>(() => {
    if (!publicKey) return [];
    const usdcFiat = Math.round(uiAmount * RATE_IDR_PER_USDC);
    const live: Wallet = {
      id: "w-usdc",
      symbol: "USDC",
      network: "Solana",
      label: "USDC",
      balance: uiAmount,
      fiatValue: usdcFiat,
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
