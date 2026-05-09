import { formatRupiah, formatStable } from "@/lib/format";
import type { StablecoinSymbol } from "@/types";

export interface TotalBreakdownProps {
  amountIdr: number;
  feeIdr: number;
  rate: number;
  symbol: StablecoinSymbol;
}

export function TotalBreakdown({ amountIdr, feeIdr, rate, symbol }: TotalBreakdownProps) {
  const totalIdr = amountIdr + feeIdr;
  const totalStable = totalIdr / rate;

  return (
    <div className="rounded-xl border border-border-strong/60 bg-surface p-4 flex flex-col gap-3">
      <Row label="Subtotal" value={formatRupiah(amountIdr)} />
      <Row
        label="Network fee"
        value={formatRupiah(feeIdr)}
        valueAccent="text-tertiary"
      />
      <Row
        label="Conversion rate"
        value={`Rp ${rate.toLocaleString("id-ID")}/${symbol}`}
      />
      <span aria-hidden className="h-px w-full bg-border-strong/60 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-body font-semibold text-foreground">Total to pay</span>
        <div className="text-right">
          <p className="text-body font-semibold tabular-nums text-foreground">
            {formatStable(totalStable, symbol)}
          </p>
          <p className="text-caption text-foreground-subtle tabular-nums">
            ≈ {formatRupiah(totalIdr)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueAccent,
}: {
  label: string;
  value: string;
  valueAccent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-body-sm text-foreground-muted">{label}</span>
      <span
        className={`text-body-sm font-medium tabular-nums ${
          valueAccent ?? "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
