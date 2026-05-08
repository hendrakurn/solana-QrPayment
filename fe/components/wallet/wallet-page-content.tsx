"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { TopBarLeading } from "@/components/layout/top-bar-leading";
import { IconButton } from "@/components/ui/icon-button";
import { SectionTitle } from "@/components/ui/section-title";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletList } from "@/components/wallet/wallet-list";
import { ConnectButton } from "@/components/wallet/connect-button";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import {
  PlusIcon,
  SparklesIcon,
  RefreshIcon,
  ArrowDownLeftIcon,
} from "@/components/icons";
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
              label="Segarkan saldo"
              icon={<RefreshIcon className="size-5 text-primary" />}
              onClick={() => refetch()}
            />
          }
        />
      </MotionItem>

      <MotionItem
        as="section"
        className="flex flex-col items-center justify-center text-center py-2"
      >
        <p className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
          Total Balance
        </p>

        {!connected ? (
          <>
            <p className="mt-2 max-w-[34ch] text-body-sm text-foreground-muted">
              Hubungkan dompet Phantom untuk melihat saldo stablecoin kamu.
            </p>
            <div className="mt-3">
              <ConnectButton />
            </div>
          </>
        ) : loading && totalIdr === 0 ? (
          <Skeleton className="mt-2 h-12 w-60" />
        ) : error ? (
          <p className="mt-2 max-w-[34ch] text-body-sm text-danger">
            Saldo tidak bisa dimuat: {error}
          </p>
        ) : (
          <>
            <h2 className="mt-1 text-display-lg font-semibold tabular-nums tracking-tight">
              {formatRupiah(totalIdr)}
            </h2>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-primary/12 px-3 py-1 text-caption font-medium text-primary">
              {wallets.filter((w) => !w.comingSoon).length} dompet aktif
            </div>
          </>
        )}
      </MotionItem>

      {connected && (
        <MotionItem as="section" className="grid grid-cols-2 gap-3">
          <Link
            href="/wallet/add"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border-strong/60 bg-surface-3 py-4 hover:bg-surface-bright cursor-pointer transition-colors active:scale-[0.98]"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-pill bg-primary-container text-on-primary-container">
              <PlusIcon className="size-5" />
            </span>
            <span className="text-body font-semibold text-foreground">Tambah Saldo</span>
          </Link>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border-strong/60 bg-surface-3 py-4 opacity-50 cursor-not-allowed"
            title="Segera hadir"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-pill bg-surface-4 text-primary">
              <ArrowDownLeftIcon className="size-5 -rotate-45" />
            </span>
            <span className="text-body font-semibold text-foreground">Tukar Aset</span>
          </button>
        </MotionItem>
      )}

      <MotionItem
        as="section"
        className="rounded-xl border border-accent-purple/30 bg-gradient-to-br from-accent-purple/12 via-surface to-surface p-3.5 flex items-start gap-3"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-accent-purple-soft shrink-0">
          <SparklesIcon className="size-5" />
        </span>
        <p className="text-body-sm leading-5 text-foreground-muted">
          <span className="text-foreground font-semibold">Tip AI:</span> SolPay
          MVP saat ini menerima pembayaran dalam <span className="text-foreground">USDC</span>.
          Stablecoin lain akan menyusul setelah audit program.
        </p>
      </MotionItem>

      <MotionItem>
        <SectionTitle
          title="Dompetku"
          caption={
            connected
              ? `${wallets.filter((w) => !w.comingSoon).length} aktif · ${
                  wallets.filter((w) => w.comingSoon).length
                } segera hadir`
              : "Hubungkan dompet untuk mulai"
          }
        />
      </MotionItem>

      {connected && wallets.length > 0 && (
        <MotionItem>
          <WalletList wallets={wallets} />
        </MotionItem>
      )}

      {connected && (
        <MotionItem>
          <Link
            href="/wallet/add"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface/50 py-4 text-body font-semibold text-foreground-muted hover:bg-surface hover:text-foreground hover:border-foreground-subtle cursor-pointer transition-colors"
          >
            <PlusIcon className="size-5" />
            Tambah dompet baru
          </Link>
        </MotionItem>
      )}
    </MotionSection>
  );
}
