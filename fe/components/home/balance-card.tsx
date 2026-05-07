import { TrendUpIcon, TrendDownIcon } from "@/components/icons";
import { formatRupiah, formatPercent } from "@/lib/format";

export interface BalanceCardProps {
  totalIdr: number;
  walletCount: number;
  trend24h: number;
}

/**
 * Hero balance display — large centered figure with a tonal pill underneath
 * mirroring the Stitch home composition. Information density is intentionally
 * minimal so the eye lands on the Tap-to-Pay action immediately after.
 */
export function BalanceCard({ totalIdr, walletCount, trend24h }: BalanceCardProps) {
  const positive = trend24h >= 0;
  return (
    <section
      aria-label="Total saldo stablecoin"
      className="flex flex-col items-center justify-center text-center"
    >
      <span className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
        Available Balance
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-section text-foreground-muted font-medium">Rp</span>
        <span className="text-display-xl font-semibold tabular-nums tracking-tight text-foreground leading-none">
          {formatRupiah(totalIdr).replace("Rp", "").trim()}
        </span>
      </div>
      <div className="mt-3 inline-flex items-center gap-2 rounded-pill border border-border-strong bg-surface-2 px-3 py-1.5">
        <span className="inline-flex size-5 items-center justify-center rounded-pill bg-primary text-[10px] font-bold text-white">
          $
        </span>
        <span className="text-caption text-foreground">
          {walletCount} dompet stablecoin
        </span>
        <span aria-hidden className="size-1 rounded-pill bg-border-strong" />
        <span
          className={`inline-flex items-center gap-1 text-caption font-medium ${
            positive ? "text-success" : "text-danger"
          }`}
        >
          {positive ? (
            <TrendUpIcon className="size-3.5" />
          ) : (
            <TrendDownIcon className="size-3.5" />
          )}
          {formatPercent(trend24h * 100)}
        </span>
      </div>
    </section>
  );
}
