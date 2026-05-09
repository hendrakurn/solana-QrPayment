import { formatRupiah } from "@/lib/format";

export interface BalanceCardProps {
  totalIdr: number;
  walletCount: number;
  trend24h: number;
}

export function BalanceCard({ totalIdr }: BalanceCardProps) {
  return (
    <section
      aria-label="Total stablecoin balance"
      className="flex flex-col items-center justify-center text-center"
    >
      <span className="text-caption uppercase tracking-[0.2em] text-foreground-subtle font-medium">
        Available Balance
      </span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-section text-foreground-muted font-medium">Rp</span>
        <span className="text-display-xl font-semibold tabular-nums tracking-tight text-foreground leading-none">
          {formatRupiah(totalIdr).replace("Rp", "").trim()}
        </span>
      </div>
    </section>
  );
}
