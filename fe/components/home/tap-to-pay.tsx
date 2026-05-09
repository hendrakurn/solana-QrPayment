import Link from "next/link";
import { QrIcon } from "@/components/icons";

export function TapToPay() {
  return (
    <section
      aria-label="Tap to pay"
      className="flex flex-col items-center justify-center py-4"
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient glow */}
        <span
          aria-hidden
          className="absolute size-72 rounded-pill bg-primary/10 blur-3xl"
        />
        {/* Outer ring pulse */}
        <span
          aria-hidden
          className="absolute size-64 rounded-pill border border-primary/12 animate-tap-pulse"
        />
        {/* Inner ring */}
        <span
          aria-hidden
          className="absolute size-56 rounded-pill border border-primary/18"
        />

        <Link
          href="/pay/scan"
          className="relative inline-flex size-48 flex-col items-center justify-center gap-2.5 rounded-pill bg-primary text-white shadow-[var(--shadow-glow-tap)] cursor-pointer transition-all duration-[var(--duration-fast)] active:scale-95 hover:scale-[1.03] hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden
            className="absolute inset-1 rounded-pill bg-gradient-to-br from-white/20 via-transparent to-black/15"
          />
          <QrIcon className="relative size-14" />
          <span className="relative text-body-sm font-semibold uppercase tracking-[0.2em] opacity-90">
            Tap to Pay
          </span>
        </Link>
      </div>

      <p className="mt-8 max-w-[26ch] text-body-sm leading-relaxed text-foreground-subtle text-center">
        Scan any QRIS code — confirmed in under 10 seconds.
      </p>
    </section>
  );
}
