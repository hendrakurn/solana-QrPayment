import Link from "next/link";
import { QrIcon } from "@/components/icons";

/**
 * Hero focal point — modeled on the Stitch SolPay Home V2 composition: a large
 * 192px round action-blue button with `tap-glow` shadow and a contactless icon.
 * The CTA is wrapped by concentric pulses so it reads as the "Shazam" moment.
 */
export function TapToPay() {
  return (
    <section
      aria-label="Tap to pay"
      className="flex flex-col items-center justify-center py-2"
    >
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden
          className="absolute size-72 rounded-pill bg-primary/15 blur-3xl"
        />
        <span
          aria-hidden
          className="absolute size-60 rounded-pill border border-primary/15 animate-tap-pulse"
        />
        <span
          aria-hidden
          className="absolute size-52 rounded-pill border border-primary/20"
        />

        <Link
          href="/pay/scan"
          className="relative inline-flex size-44 flex-col items-center justify-center gap-2 rounded-pill bg-primary text-white shadow-[var(--shadow-glow-tap)] cursor-pointer transition-transform duration-[var(--duration-fast)] active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden
            className="absolute inset-1 rounded-pill bg-gradient-to-br from-white/25 via-transparent to-black/20"
          />
          <QrIcon className="relative size-12" />
          <span className="relative text-caption font-semibold uppercase tracking-[0.18em]">
            Tap to Pay
          </span>
        </Link>
      </div>

      <p className="mt-6 max-w-[28ch] text-body-sm leading-5 text-foreground-muted text-center">
        Pindai QRIS apa pun. SolPay AI memilih dompet terbaik secara otomatis,
        konfirmasi &lt; 10 detik.
      </p>
    </section>
  );
}
