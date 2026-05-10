"use client";

import { useIdrxBalance } from "@/lib/solana/use-usdc-balance";
import { BalanceCard } from "@/components/home/balance-card";
import { Skeleton } from "@/components/ui/skeleton";

export function BalanceCardLive() {
  const { uiAmount, loading, error } = useIdrxBalance();

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

  // 1 IDRX = 1 IDR
  const totalIdr = Math.round(uiAmount);

  return <BalanceCard totalIdr={totalIdr} walletCount={1} trend24h={0} />;
}
