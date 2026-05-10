import type { Wallet } from "@/types";

const now = Date.now();

export const mockWallets: Wallet[] = [
  {
    id: "w-idrx-main",
    symbol: "IDRX",
    network: "Solana",
    label: "Main IDRX",
    balance: 2_480_550,
    fiatValue: 2_480_550,
    apr: 4.8,
    trend24h: 0.02,
    lastUsedAt: new Date(now - 1000 * 60 * 32),
    useCount: 142,
    isDefault: true,
    address: "9xQeWvG816bUx9EPJL2N7cKqGgCqkj3gKxFh1Gmwz3KH",
  },
];

export function totalFiatBalance(wallets: Wallet[]): number {
  return wallets.reduce((sum, w) => sum + w.fiatValue, 0);
}

export function findWallet(id: string): Wallet | undefined {
  return mockWallets.find((w) => w.id === id);
}
