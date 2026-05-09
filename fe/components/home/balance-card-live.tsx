"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useUsdcBalance } from "@/lib/solana/use-usdc-balance";
import { BalanceCard } from "@/components/home/balance-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectButton } from "@/components/wallet/connect-button";

const RATE_IDR_PER_USDC = 15_640;

export function BalanceCardLive() {
  const { connected, publicKey } = useWallet();
  const { uiAmount, loading, error } = useUsdcBalance();

  if (!connected || !publicKey) {
    return (
      <section
        aria-label="Total stablecoin balance"
        className="flex flex-col items-center justify-center text-center gap-4 py-2"
      >
        <span className="text-caption uppercase tracking-[0.2em] text-foreground-subtle font-medium">
          Available Balance
        </span>
        <ConnectButton />
      </section>
    );
  }

  if (loading && uiAmount === 0 && !error) {
    return (
      <section
        aria-label="Loading balance"
        className="flex flex-col items-center justify-center text-center gap-3"
      >
        <span className="text-caption uppercase tracking-[0.2em] text-foreground-subtle font-medium">
          Available Balance
        </span>
        <Skeleton className="h-14 w-56" />
      </section>
    );
  }

  const totalIdr = Math.round(uiAmount * RATE_IDR_PER_USDC);

  return <BalanceCard totalIdr={totalIdr} walletCount={1} trend24h={0} />;
}
