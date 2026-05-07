import { formatRupiah } from "@/lib/format";

export function AmountDisplay({
  amountIdr,
  helper,
}: {
  amountIdr: number;
  helper?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border-strong bg-surface p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-container/10 via-transparent to-accent-purple/10"
      />
      <div className="relative flex flex-col items-center text-center">
        <span className="text-caption uppercase tracking-[0.2em] text-foreground-muted">
          Total tagihan
        </span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-section text-primary font-semibold">Rp</span>
          <span className="text-display-lg font-semibold tabular-nums tracking-tight text-foreground leading-none">
            {formatRupiah(amountIdr).replace("Rp", "").trim()}
          </span>
        </div>
        {helper ? (
          <p className="mt-2 text-body-sm text-foreground-muted tabular-nums">{helper}</p>
        ) : null}
      </div>
    </section>
  );
}
