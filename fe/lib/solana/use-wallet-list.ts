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

const COMING_SOON: Wallet[] = [
  {
    id: "w-usdt",
    symbol: "USDT",
    network: "Solana Devnet",
    label: "Tether",
    balance: 0,
    fiatValue: 0,
    apr: 4.1,
    trend24h: 0,
    lastUsedAt: new Date(0),
    useCount: 0,
    address: "Coming soon",
    comingSoon: true,
  },
  {
    id: "w-pyusd",
    symbol: "PYUSD",
    network: "Solana Devnet",
    label: "PayPal USD",
    balance: 0,
    fiatValue: 0,
    apr: 5.2,
    trend24h: 0,
    lastUsedAt: new Date(0),
    useCount: 0,
    address: "Coming soon",
    comingSoon: true,
  },
  {
    id: "w-usdg",
    symbol: "USDG",
    network: "Solana Devnet",
    label: "Global Dollar",
    balance: 0,
    fiatValue: 0,
    apr: 6.0,
    trend24h: 0,
    lastUsedAt: new Date(0),
    useCount: 0,
    address: "Coming soon",
    comingSoon: true,
  },
];

export interface WalletListState {
  wallets: Wallet[];
  totalIdr: number;
  loading: boolean;
  error: string | null;
  connected: boolean;
}

/**
 * Builds the wallet list shown on /wallet:
 *  - one live USDC entry from the connected Phantom wallet
 *  - three placeholder entries (USDT/PYUSD/USDG) marked `comingSoon` because
 *    the on-chain program currently only accepts USDC
 *
 * Returns an empty list when no wallet is connected so the page can prompt
 * the user to connect.
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
      network: "Solana Devnet",
      label: "USDC Devnet",
      balance: uiAmount,
      fiatValue: usdcFiat,
      apr: 4.8,
      trend24h: 0,
      lastUsedAt: new Date(),
      useCount: 0,
      isDefault: true,
      address: publicKey.toBase58(),
    };
    return [live, ...COMING_SOON];
  }, [publicKey, uiAmount]);

  const totalIdr = wallets.reduce((sum, w) => sum + w.fiatValue, 0);

  return { wallets, totalIdr, loading, error, connected };
}
