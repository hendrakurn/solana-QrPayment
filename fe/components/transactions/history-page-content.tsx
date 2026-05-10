"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryView } from "@/components/transactions/history-view";
import { ConnectButton } from "@/components/wallet/connect-button";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { HistoryIcon, RefreshIcon, WalletIcon } from "@/components/icons";
import { mockUser } from "@/data/user";
import { usePaymentHistory } from "@/lib/solana/use-history";

/**
 * History page content. On-chain `PaymentRecord` accounts (filtered by the
 * connected wallet's `payer`) are the only source of truth — there is no
 * mock fallback and no localStorage cache.
 */
export function HistoryPageContent() {
  const { transactions, loading, error, walletConnected, refetch } =
    usePaymentHistory();

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          leading={
            <Link href="/wallet" aria-label="Open wallet">
              <Avatar initials={mockUser.avatarSeed} />
            </Link>
          }
          trailing={
            <IconButton
              label="Refresh"
              variant="ghost"
              icon={<RefreshIcon className="size-5 text-accent-yellow" />}
              onClick={() => refetch()}
            />
          }
        />
      </MotionItem>

      <MotionItem as="header">
        <h2 className="text-section font-semibold tracking-tight text-accent-yellow">
          Transactions
        </h2>
      </MotionItem>

      <MotionItem>
        {!walletConnected ? (
          <EmptyState
            icon={<WalletIcon className="size-5" />}
            title="Connect your wallet"
            description="Your on-chain payment history will appear here once Phantom is connected."
            action={<ConnectButton />}
          />
        ) : loading && transactions.length === 0 ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-touch w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <ErrorState
            title="Couldn't load history"
            description={error}
            retry={
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-body-sm font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft cursor-pointer transition-colors"
              >
                Retry
              </button>
            }
          />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon className="size-5" />}
            title="No transactions yet"
            description="Once you scan a QRIS and pay, your on-chain receipts will show up here."
          />
        ) : (
          <HistoryView transactions={transactions} />
        )}
      </MotionItem>
    </MotionSection>
  );
}
