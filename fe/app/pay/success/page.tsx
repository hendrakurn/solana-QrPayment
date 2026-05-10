"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckIcon, ZapIcon, ArrowUpRightIcon } from "@/components/icons";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { useLastPaymentStore } from "@/lib/payment/last-payment-store";
import { SOLANA_CLUSTER } from "@/lib/solana/config";
import { formatRupiah, formatStable, truncateAddress } from "@/lib/format";

export default function SuccessPage() {
  const last = useLastPaymentStore((s) => s.last);

  // Defensive: if user navigates here directly without a recent payment,
  // bounce back to home rather than showing stale data.
  useEffect(() => {
    if (!last) return;
    // No-op: keep the page if there's a payment to display
  }, [last]);

  if (!last) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-edge text-center gap-4">
        <p className="text-body text-foreground-muted">
          No recent payment to display.
        </p>
        <Link
          href="/"
          className="inline-flex h-tap items-center justify-center gap-2 rounded-xl bg-primary px-6 text-body font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft cursor-pointer transition-colors"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const totalIdr = last.draft.amountIdr + last.draft.feeIdr;
  const totalStable = last.amountIdrx;
  const explorerUrl = `https://explorer.solana.com/tx/${last.signature}?cluster=${SOLANA_CLUSTER}`;

  return (
    <div className="flex min-h-dvh flex-col">
      <MotionSection
        as="main"
        stagger
        immediate
        className="flex flex-1 flex-col items-center justify-center px-edge text-center"
      >
        {/* Animated check mark — pure CSS so it doesn't mix with Framer on same element */}
        <div className="relative mb-8 flex items-center justify-center">
          <span className="absolute size-44 rounded-pill bg-success/15 blur-2xl" />
          <span className="absolute size-32 rounded-pill border border-success/30 animate-tap-pulse" />
          <span className="relative inline-flex size-24 items-center justify-center rounded-pill bg-success text-background shadow-[var(--shadow-glow-success)] animate-pop">
            <CheckIcon className="size-12" />
          </span>
        </div>

        <MotionItem
          as="div"
          className="text-display font-semibold tracking-tight text-accent-yellow"
        >
          <h1>Payment sent</h1>
        </MotionItem>

        <MotionItem
          as="p"
          className="mt-2 max-w-[34ch] text-body text-foreground-muted"
        >
          IDRX has been sent to the SolPay vault. IDR settlement to{" "}
          {last.draft.merchant.name} will follow via QRIS.
        </MotionItem>

        <MotionItem
          as="article"
          className="mt-8 w-full max-w-sm rounded-xl border border-border-strong/60 bg-surface p-5 text-left"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-caption uppercase tracking-[0.18em] text-foreground-muted">
              Total paid
            </span>
            <span className="text-caption text-foreground-subtle">
              QRIS · Solana
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-section text-primary font-semibold">Rp</span>
            <span className="text-display font-semibold tabular-nums leading-none text-foreground">
              {formatRupiah(totalIdr).replace("Rp", "").trim()}
            </span>
          </div>
          <p className="mt-1 text-body-sm text-foreground-muted tabular-nums">
            {formatStable(totalStable, last.symbol)}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-pill bg-success/14 px-3 py-1.5 text-caption font-medium text-success">
            <ZapIcon className="size-3.5" />
            Written on-chain
          </div>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-caption">
            <dt className="text-foreground-subtle">Tx</dt>
            <dd className="font-mono tabular-nums text-foreground truncate">
              {truncateAddress(last.signature, 6, 6)}
            </dd>
            <dt className="text-foreground-subtle">Record</dt>
            <dd className="font-mono tabular-nums text-foreground truncate">
              {truncateAddress(last.paymentPda, 4, 4)}
            </dd>
          </dl>
        </MotionItem>
      </MotionSection>

      <footer className="px-edge pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3">
        <div className="mx-auto flex w-full max-w-canvas-inner flex-col gap-3">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-strong/60 bg-surface px-5 text-body-sm font-semibold text-foreground hover:bg-surface-2 cursor-pointer transition-colors"
          >
            View on Solana Explorer
            <ArrowUpRightIcon className="size-4" />
          </a>
          <Link
            href="/"
            className="inline-flex h-tap w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-body font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft cursor-pointer transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/history"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-strong/60 bg-surface px-5 text-body-sm font-semibold text-foreground hover:bg-surface-2 cursor-pointer transition-colors"
          >
            View in history
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
