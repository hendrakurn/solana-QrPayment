import Link from "next/link";
import { QrIcon } from "@/components/icons";

export function TapToPay() {
  return (
    <section
      aria-label="Tap to pay"
      className="flex flex-col items-center justify-center py-4"
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient glow — yellow + purple blend */}
        <span
          aria-hidden
          className="absolute size-72 rounded-pill bg-gradient-to-br from-accent-yellow/8 to-accent-purple/12 blur-3xl"
        />
        {/* Outer ring — yellow pulse */}
        <span
          aria-hidden
          className="absolute size-64 rounded-pill border border-accent-yellow/18 animate-tap-pulse"
        />
        {/* Inner ring — purple */}
        <span
          aria-hidden
          className="absolute size-56 rounded-pill border border-accent-purple/25"
        />

        <Link
          href="/pay/scan"
          className="relative inline-flex size-48 flex-col items-center justify-center gap-2.5 rounded-pill bg-gradient-to-br from-accent-purple via-[#8520e8] to-accent-yellow text-white shadow-[0_0_40px_rgba(238,159,10,0.30),0_22px_80px_rgba(82,32,216,0.50)] cursor-pointer transition-all duration-[var(--duration-fast)] active:scale-95 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-yellow/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-pill bg-accent-purple/30 animate-tap-pulse"
          />
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
