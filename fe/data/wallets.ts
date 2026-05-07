import type { Wallet } from "@/types";

const now = Date.now();

export const mockWallets: Wallet[] = [
  {
    id: "w-usdc-main",
    symbol: "USDC",
    network: "Solana",
    label: "Main USDC",
    balance: 2480.55,
    fiatValue: 38_745_000,
    apr: 4.8,
    trend24h: 0.02,
    lastUsedAt: new Date(now - 1000 * 60 * 32),
    useCount: 142,
    isDefault: true,
    address: "9xQeWvG816bUx9EPJL2N7cKqGgCqkj3gKxFh1Gmwz3KH",
  },
  {
    id: "w-usdt",
    symbol: "USDT",
    network: "Solana",
    label: "Tether",
    balance: 612.18,
    fiatValue: 9_558_700,
    apr: 4.1,
    trend24h: -0.01,
    lastUsedAt: new Date(now - 1000 * 60 * 60 * 26),
    useCount: 47,
    address: "7c1nFL2dJp29zG8sR8Vy2yqkz72v3rHq4cJ3D2qNWC9D",
  },
  {
    id: "w-pyusd",
    symbol: "PYUSD",
    network: "Solana",
    label: "PayPal USD",
    balance: 320.0,
    fiatValue: 4_996_800,
    apr: 5.2,
    trend24h: 0.05,
    lastUsedAt: new Date(now - 1000 * 60 * 60 * 24 * 4),
    useCount: 12,
    address: "5dC9P8nFw3vR8q2yX9hLmZ8K4tHyR6cNqGwH1xT2yPzA",
  },
  {
    id: "w-usdg",
    symbol: "USDG",
    network: "Solana",
    label: "Global Dollar",
    balance: 75.4,
    fiatValue: 1_178_000,
    apr: 6.0,
    trend24h: 0.12,
    lastUsedAt: new Date(now - 1000 * 60 * 60 * 24 * 14),
    useCount: 3,
    address: "Hh3K9gT8d2vRqW1pY4xLmN7cF2yJ8sZ1gQ3tH9xK4mPn",
  },
];

export function totalFiatBalance(wallets: Wallet[]): number {
  return wallets.reduce((sum, w) => sum + w.fiatValue, 0);
}

export function findWallet(id: string): Wallet | undefined {
  return mockWallets.find((w) => w.id === id);
}
