"use client";

import Link from "next/link";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentHistory } from "@/lib/solana/use-history";

const RECENT_LIMIT = 2;

/**
 * Home → "Recent" block. Same on-chain source of truth as /history (the
 * shared `usePaymentHistory` hook), capped to the 2 newest entries. Renders
 * concise inline states for not-connected / loading / error / empty so the
 * home layout doesn't grow when there's nothing to show.
 */
export function RecentTransactions() {
  const { transactions, loading, error, walletConnected } = usePaymentHistory();
  const recent = transactions.slice(0, RECENT_LIMIT);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-caption uppercase tracking-[0.16em] text-accent-yellow font-medium">
          Recent
        </span>
        <Link
          href="/history"
          className="text-caption font-medium text-primary hover:text-primary-soft cursor-pointer transition-colors"
        >
          See all
        </Link>
      </div>

      {!walletConnected ? (
        <p className="px-0.5 text-caption text-foreground-subtle">
          Connect your wallet to see recent payments.
        </p>
      ) : loading && recent.length === 0 ? (
        <ul className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: RECENT_LIMIT }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-16 w-full" />
            </li>
          ))}
        </ul>
      ) : error ? (
        <p className="px-0.5 text-caption text-danger">
          Couldn&apos;t load recent payments.
        </p>
      ) : recent.length === 0 ? (
        <p className="px-0.5 text-caption text-foreground-subtle">
          No payments yet — scan a QRIS to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((tx) => (
            <li key={tx.id}>
              <TransactionRow
                transaction={tx}
                href={`/history#${tx.id}`}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
