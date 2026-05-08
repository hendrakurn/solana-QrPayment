import Link from "next/link";
import type { Wallet } from "@/types";
import { TokenMark } from "@/components/ui/token-mark";
import { Badge } from "@/components/ui/badge";
import { TrendUpIcon, TrendDownIcon } from "@/components/icons";
import { formatRupiah, formatStable, formatPercent, truncateAddress } from "@/lib/format";

export function WalletCard({ wallet }: { wallet: Wallet }) {
  if (wallet.comingSoon) return <ComingSoonCard wallet={wallet} />;

  const positive = wallet.trend24h >= 0;
  return (
    <Link
      href={`/wallet#${wallet.id}`}
      className="flex items-center gap-4 rounded-xl border border-border-strong/60 bg-surface p-4 hover:bg-surface-2 hover:border-border-strong cursor-pointer transition-colors active:scale-[0.99]"
    >
      <TokenMark symbol={wallet.symbol} size="lg" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body font-semibold text-foreground truncate">{wallet.label}</p>
          {wallet.isDefault ? <Badge tone="primary">Default</Badge> : null}
        </div>
        <p className="text-caption text-foreground-subtle font-mono tabular-nums truncate">
          {wallet.symbol} · {truncateAddress(wallet.address)}
        </p>
        <div className="mt-1 flex items-center gap-2 text-caption text-foreground-subtle">
          <span>APR {wallet.apr ?? 0}%</span>
          <span aria-hidden className="size-1 rounded-pill bg-border-strong" />
          <span
            className={`inline-flex items-center gap-1 ${positive ? "text-success" : "text-danger"}`}
          >
            {positive ? (
              <TrendUpIcon className="size-3.5" />
            ) : (
              <TrendDownIcon className="size-3.5" />
            )}
            {formatPercent(wallet.trend24h * 100)}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-body font-semibold tabular-nums text-foreground">
          {formatStable(wallet.balance, wallet.symbol)}
        </p>
        <p className="text-caption text-foreground-subtle tabular-nums">
          ≈ {formatRupiah(wallet.fiatValue)}
        </p>
      </div>
    </Link>
  );
}

/**
 * Non-interactive variant for stablecoins not yet supported by the on-chain
 * program (USDT/PYUSD/USDG). Same shape as the live card so the list reads
 * uniformly, but visually muted with a "Segera hadir" badge.
 */
function ComingSoonCard({ wallet }: { wallet: Wallet }) {
  return (
    <div
      aria-disabled="true"
      className="flex items-center gap-4 rounded-xl border border-border bg-surface/60 p-4 opacity-60"
    >
      <TokenMark symbol={wallet.symbol} size="lg" className="grayscale-[40%]" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body font-semibold text-foreground truncate">{wallet.label}</p>
          <Badge tone="neutral">Segera hadir</Badge>
        </div>
        <p className="text-caption text-foreground-subtle truncate">
          {wallet.symbol} · Belum tersedia di program SolPay
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-caption text-foreground-subtle">APR {wallet.apr ?? 0}%</p>
      </div>
    </div>
  );
}
