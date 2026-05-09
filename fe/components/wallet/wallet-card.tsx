import Link from "next/link";
import type { Wallet } from "@/types";
import { TokenMark } from "@/components/ui/token-mark";
import { TrendUpIcon, TrendDownIcon } from "@/components/icons";
import { formatRupiah, formatStable, formatPercent, truncateAddress } from "@/lib/format";

export function WalletCard({ wallet }: { wallet: Wallet }) {
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

