"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TopBar } from "@/components/layout/top-bar";
import { IconButton } from "@/components/ui/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletCard } from "@/components/wallet/wallet-card";
import { MintUsdcButton } from "@/components/wallet/mint-usdc-button";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { RefreshIcon, LogOutIcon } from "@/components/icons";
import { useWalletList } from "@/lib/solana/use-wallet-list";
import { useUsdcBalance } from "@/lib/solana/use-usdc-balance";
import { formatRupiah, truncateAddress } from "@/lib/format";
import { Avatar } from "@/components/layout/avatar";

export function WalletPageContent() {
  const { wallets, totalIdr, loading, error } = useWalletList();
  const { refetch } = useUsdcBalance();
  const { publicKey, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          trailing={
            <IconButton
              variant="ghost"
              label="Refresh balance"
              icon={<RefreshIcon className="size-5 text-accent-yellow" />}
              onClick={() => refetch()}
            />
          }
        />
      </MotionItem>

      {/* ── Profile hero ── */}
      <MotionItem as="section" className="flex flex-col items-center gap-3 py-2">
        <Avatar
          initials={publicKey?.toBase58().slice(0, 2) ?? "?"}
          size={72}
        />

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-caption font-mono text-foreground-subtle hover:text-foreground transition-colors cursor-pointer"
        >
          {copied
            ? "Copied!"
            : `${truncateAddress(publicKey?.toBase58() ?? "", 6, 4)} · tap to copy`}
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-pill border border-success/30 bg-success/10 px-3 py-1 text-caption text-success">
          <span aria-hidden className="size-1.5 rounded-pill bg-success" />
          Solana
        </span>
      </MotionItem>

      {/* ── Balance ── */}
      <MotionItem
        as="section"
        className="flex flex-col items-center justify-center text-center"
      >
        <p className="text-caption uppercase tracking-[0.2em] text-foreground-subtle font-medium">
          Total Balance
        </p>

        {loading && totalIdr === 0 ? (
          <Skeleton className="mt-3 h-12 w-60" />
        ) : error ? (
          <p className="mt-3 max-w-[34ch] text-body-sm text-danger">{error}</p>
        ) : (
          <h2 className="mt-2 text-display-xl font-semibold tabular-nums tracking-tight">
            {formatRupiah(totalIdr)}
          </h2>
        )}
      </MotionItem>

      {/* ── Faucet ── */}
      <MotionItem>
        <MintUsdcButton onSuccess={() => refetch()} />
      </MotionItem>

      {/* ── Wallet card ── */}
      {wallets.length > 0 && (
        <MotionItem as="ul" className="flex flex-col gap-2.5">
          {wallets.map((w) => (
            <li key={w.id} id={w.id}>
              <WalletCard wallet={w} />
            </li>
          ))}
        </MotionItem>
      )}

      {/* ── Disconnect ── */}
      <MotionItem>
        <button
          type="button"
          onClick={() => disconnect().catch(() => {})}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger/60 bg-danger/15 text-body font-semibold text-danger hover:bg-danger/25 hover:border-danger/75 cursor-pointer transition-colors"
        >
          <LogOutIcon className="size-5" />
          Disconnect Wallet
        </button>
      </MotionItem>
    </MotionSection>
  );
}
