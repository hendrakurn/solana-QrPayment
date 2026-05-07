import Link from "next/link";
import { CheckIcon, ZapIcon, ArrowUpRightIcon } from "@/components/icons";
import { mockPaymentDraft } from "@/data/payment";
import { mockWallets } from "@/data/wallets";
import { formatRupiah, formatStable } from "@/lib/format";

export default function SuccessPage() {
  const wallet = mockWallets.find((w) => w.id === mockPaymentDraft.recommendedWalletId)!;
  const totalIdr = mockPaymentDraft.amountIdr + mockPaymentDraft.feeIdr;
  const totalStable = totalIdr / mockPaymentDraft.rate;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-edge text-center">
        <div className="relative mb-8 flex items-center justify-center">
          <span className="absolute size-44 rounded-pill bg-success/15 blur-2xl" />
          <span className="absolute size-32 rounded-pill border border-success/30 animate-tap-pulse" />
          <span className="relative inline-flex size-24 items-center justify-center rounded-pill bg-success text-background shadow-[0_18px_40px_-10px_rgba(31,210,134,0.55)] animate-pop">
            <CheckIcon className="size-12" />
          </span>
        </div>

        <h1 className="text-display font-semibold tracking-tight text-foreground animate-rise">
          Pembayaran berhasil
        </h1>
        <p className="mt-2 max-w-[32ch] text-body text-foreground-muted animate-rise">
          {mockPaymentDraft.merchant.name} telah menerima settlement Rupiah lewat
          jalur QRIS resmi.
        </p>

        <div className="mt-8 w-full max-w-sm rounded-xl border border-border-strong/60 bg-surface p-5 text-left animate-rise">
          <div className="flex items-baseline justify-between">
            <span className="text-caption uppercase tracking-[0.18em] text-foreground-muted">
              Total dibayar
            </span>
            <span className="text-caption text-foreground-subtle">QRIS · Solana Pay</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-section text-primary font-semibold">Rp</span>
            <span className="text-display font-semibold tabular-nums leading-none text-foreground">
              {formatRupiah(totalIdr).replace("Rp", "").trim()}
            </span>
          </div>
          <p className="mt-1 text-body-sm text-foreground-muted tabular-nums">
            {formatStable(totalStable, wallet.symbol)} dari {wallet.label}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-pill bg-success/14 px-3 py-1.5 text-caption font-medium text-success">
            <ZapIcon className="size-3.5" />
            Diselesaikan dalam 6,2 detik
          </div>
        </div>
      </main>

      <footer className="px-edge pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3">
        <div className="mx-auto flex w-full max-w-[440px] flex-col gap-3">
          <Link
            href="/"
            className="inline-flex h-tap w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-body font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft cursor-pointer transition-colors"
          >
            Kembali ke beranda
          </Link>
          <Link
            href="/history"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-strong/60 bg-surface px-5 text-body-sm font-semibold text-foreground hover:bg-surface-2 cursor-pointer transition-colors"
          >
            Lihat di riwayat
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
