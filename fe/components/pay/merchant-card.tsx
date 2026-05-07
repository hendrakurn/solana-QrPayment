import type { MerchantInfo } from "@/types";
import { ShieldCheckIcon } from "@/components/icons";

/**
 * Merchant header — Stitch Confirm V2 composition: caption above, large round
 * avatar, merchant name, verified line with primary check, and a tonal QRIS
 * reference line. Sits above the amount hero.
 */
export function MerchantCard({ merchant }: { merchant: MerchantInfo }) {
  return (
    <section className="flex flex-col items-center text-center">
      <p className="text-body-sm text-foreground-muted">Membayar ke</p>

      <div className="mt-2 inline-flex size-16 items-center justify-center rounded-pill border border-border-strong bg-surface-3 text-section font-semibold text-primary shadow-[var(--shadow-card)]">
        {merchant.name[0]}
      </div>

      <h2 className="mt-3 text-section font-semibold tracking-tight text-foreground">
        {merchant.name}
      </h2>

      <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-body-sm text-foreground-muted">
        <ShieldCheckIcon className="size-4 text-primary" />
        {merchant.verified ? "Merchant terverifikasi" : "Belum terverifikasi"} ·{" "}
        <span className="font-mono tabular-nums text-foreground-subtle">
          {merchant.qrisId}
        </span>
      </p>
    </section>
  );
}
