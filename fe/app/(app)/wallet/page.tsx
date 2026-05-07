import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { SectionTitle } from "@/components/ui/section-title";
import { WalletList } from "@/components/wallet/wallet-list";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import {
  PlusIcon,
  SparklesIcon,
  RefreshIcon,
  TrendUpIcon,
  ArrowDownLeftIcon,
} from "@/components/icons";
import { mockUser } from "@/data/user";
import { mockWallets, totalFiatBalance } from "@/data/wallets";
import { formatRupiah, formatPercent } from "@/lib/format";

export default function WalletPage() {
  const total = totalFiatBalance(mockWallets);
  const trend = mockWallets.reduce((s, w) => s + w.trend24h * w.fiatValue, 0) / total;
  const positive = trend >= 0;

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          leading={
            <Link href="/settings" aria-label="Buka pengaturan">
              <Avatar initials={mockUser.avatarSeed} />
            </Link>
          }
          trailing={
            <IconButton
              variant="ghost"
              label="Segarkan saldo"
              icon={<RefreshIcon className="size-5 text-primary" />}
            />
          }
        />
      </MotionItem>

      <MotionItem as="section" className="flex flex-col items-center justify-center text-center py-2">
        <p className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
          Total Balance
        </p>
        <h2 className="mt-1 text-display-lg font-semibold tabular-nums tracking-tight">
          {formatRupiah(total)}
        </h2>
        <div
          className={`mt-3 inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-caption font-medium ${
            positive
              ? "bg-primary/12 text-primary"
              : "bg-danger/14 text-danger"
          }`}
        >
          <TrendUpIcon className="size-3.5" />
          {formatPercent(trend * 100)} hari ini
        </div>
      </MotionItem>

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
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border-strong/60 bg-surface-3 py-4 hover:bg-surface-bright cursor-pointer transition-colors active:scale-[0.98]"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-pill bg-surface-4 text-primary">
            <ArrowDownLeftIcon className="size-5 -rotate-45" />
          </span>
          <span className="text-body font-semibold text-foreground">Tukar Aset</span>
        </button>
      </MotionItem>

      <MotionItem
        as="section"
        className="rounded-xl border border-accent-purple/30 bg-gradient-to-br from-accent-purple/12 via-surface to-surface p-3.5 flex items-start gap-3"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-accent-purple-soft shrink-0">
          <SparklesIcon className="size-5" />
        </span>
        <p className="text-body-sm leading-5 text-foreground-muted">
          <span className="text-foreground font-semibold">Tip AI:</span> alokasi{" "}
          70% USDC + 30% USDT mengoptimalkan rate harian dan biaya bridge untuk pola QRIS-mu.
        </p>
      </MotionItem>

      <MotionItem>
        <SectionTitle title="Dompetku" caption={`${mockWallets.length} stablecoin di Solana`} />
      </MotionItem>

      <MotionItem>
        <WalletList wallets={mockWallets} />
      </MotionItem>

      <MotionItem>
        <Link
          href="/wallet/add"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface/50 py-4 text-body font-semibold text-foreground-muted hover:bg-surface hover:text-foreground hover:border-foreground-subtle cursor-pointer transition-colors"
        >
          <PlusIcon className="size-5" />
          Tambah dompet baru
        </Link>
      </MotionItem>
    </MotionSection>
  );
}
