"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { TopBarLeading } from "@/components/layout/top-bar-leading";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletList } from "@/components/wallet/wallet-list";
import { ConnectButton } from "@/components/wallet/connect-button";
import { MintUsdcButton } from "@/components/wallet/mint-usdc-button";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { RefreshIcon } from "@/components/icons";
import { useWalletList } from "@/lib/solana/use-wallet-list";
import { useUsdcBalance } from "@/lib/solana/use-usdc-balance";
import { formatRupiah } from "@/lib/format";

export function WalletPageContent() {
  const { wallets, totalIdr, loading, error, connected } = useWalletList();
  const { refetch } = useUsdcBalance();

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          leading={<TopBarLeading />}
          trailing={
            <IconButton
              variant="ghost"
              label="Refresh balance"
              icon={<RefreshIcon className="size-5 text-primary" />}
              onClick={() => refetch()}
            />
          }
        />
      </MotionItem>

      {/* Balance hero */}
      <MotionItem
        as="section"
        className="flex flex-col items-center justify-center text-center py-4"
      >
        <p className="text-caption uppercase tracking-[0.2em] text-foreground-subtle font-medium">
          Total Balance
        </p>

        {!connected ? (
          <div className="mt-4 flex flex-col items-center gap-3">
            <p className="text-body-sm text-foreground-muted">
              Connect your wallet to view balance
            </p>
            <ConnectButton />
          </div>
        ) : loading && totalIdr === 0 ? (
          <Skeleton className="mt-3 h-12 w-60" />
        ) : error ? (
          <p className="mt-3 max-w-[34ch] text-body-sm text-danger">
            {error}
          </p>
        ) : (
          <h2 className="mt-2 text-display-xl font-semibold tabular-nums tracking-tight">
            {formatRupiah(totalIdr)}
          </h2>
        )}
      </MotionItem>

      {/* Devnet USDC faucet — primary CTA for judges */}
      {connected && (
        <MotionItem>
          <MintUsdcButton onSuccess={() => refetch()} />
        </MotionItem>
      )}

      {/* Wallet list */}
      {connected && wallets.length > 0 && (
        <MotionItem>
          <WalletList wallets={wallets} />
        </MotionItem>
      )}

      {/* Add wallet */}
      {connected && (
        <MotionItem>
          <Link
            href="/wallet/add"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong/60 bg-transparent py-4 text-body-sm font-medium text-foreground-subtle hover:bg-surface hover:text-foreground hover:border-border-strong cursor-pointer transition-colors"
          >
            + Add stablecoin
          </Link>
        </MotionItem>
      )}
    </MotionSection>
  );
}
