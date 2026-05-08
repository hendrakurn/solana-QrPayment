"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUsdcBalance } from "@/lib/solana/use-usdc-balance";
import { BalanceCard } from "@/components/home/balance-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectButton } from "@/components/wallet/connect-button";

/**
 * Hardcoded USDC→IDR rate for MVP. Matches mockPaymentDraft.rate so the Pay
 * flow stays consistent. Swap with a CoinGecko/Pyth feed in a later phase.
 */
const RATE_IDR_PER_USDC = 15_640;

export function BalanceCardLive() {
  const { connected, publicKey } = useWallet();
  const { uiAmount, exists, loading, error } = useUsdcBalance();

  if (!connected || !publicKey) {
    return (
      <section
        aria-label="Total saldo stablecoin"
        className="flex flex-col items-center justify-center text-center gap-3 py-2"
      >
        <span className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
          Available Balance
        </span>
        <p className="max-w-[28ch] text-body-sm text-foreground-muted">
          Hubungkan dompet Phantom untuk melihat saldo USDC kamu.
        </p>
        <ConnectButton />
      </section>
    );
  }

  if (loading && uiAmount === 0 && !error) {
    return (
      <section
        aria-label="Memuat saldo"
        className="flex flex-col items-center justify-center text-center gap-3"
      >
        <span className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
          Available Balance
        </span>
        <Skeleton className="h-12 w-56" />
        <Skeleton className="h-7 w-44 rounded-pill" />
      </section>
    );
  }

  if (error) {
    return (
      <section
        aria-label="Saldo tidak tersedia"
        className="flex flex-col items-center justify-center text-center gap-2 py-2"
      >
        <span className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
          Available Balance
        </span>
        <p className="max-w-[34ch] text-body-sm text-danger">
          Saldo tidak bisa dimuat: {error}
        </p>
      </section>
    );
  }

  const totalIdr = Math.round(uiAmount * RATE_IDR_PER_USDC);

  return (
    <div className="flex flex-col items-center gap-3">
      <BalanceCard totalIdr={totalIdr} walletCount={1} trend24h={0} />

      {!exists && uiAmount === 0 && (
        <div className="mt-1 max-w-[36ch] rounded-pill border border-warning/40 bg-warning/10 px-3.5 py-1.5 text-caption text-warning text-center">
          Saldo USDC kosong di devnet. Pastikan Phantom diset ke Devnet ·{" "}
          <Link
            href="/wallet/add"
            className="font-semibold text-warning underline underline-offset-2 hover:text-foreground"
          >
            Top-up
          </Link>
        </div>
      )}
    </div>
  );
}
