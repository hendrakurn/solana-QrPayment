"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CloseIcon, SparklesIcon } from "@/components/icons";
import { Wordmark } from "@/components/layout/wordmark";
import { MerchantCard } from "@/components/pay/merchant-card";
import { AmountDisplay } from "@/components/pay/amount-display";
import { WalletSelector } from "@/components/pay/wallet-selector";
import { TotalBreakdown } from "@/components/pay/total-breakdown";
import { SlideToPay } from "@/components/pay/slide-to-pay";
import { mockWallets } from "@/data/wallets";
import { mockPaymentDraft } from "@/data/payment";

export default function ConfirmPage() {
  const router = useRouter();
  const [walletId, setWalletId] = useState(mockPaymentDraft.recommendedWalletId);
  const wallet = mockWallets.find((w) => w.id === walletId)!;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar — glassy, with wordmark center */}
      <header className="relative z-30 flex items-center justify-between px-edge pt-[calc(env(safe-area-inset-top)+16px)] pb-3 border-b border-white/8 bg-background/85 backdrop-blur-xl">
        <Link
          href="/pay/scan"
          aria-label="Kembali ke pemindai"
          className="size-10 inline-flex items-center justify-center rounded-pill border border-border-strong bg-surface-2 text-foreground hover:bg-surface-3 cursor-pointer"
        >
          <CloseIcon />
        </Link>
        <Wordmark size="sm" />
        <div className="size-10" />
      </header>

      <main className="flex-1 flex flex-col gap-6 px-edge pt-6 pb-40">
        <MerchantCard merchant={mockPaymentDraft.merchant} />

        <AmountDisplay
          amountIdr={mockPaymentDraft.amountIdr}
          helper={`≈ ${(mockPaymentDraft.amountIdr / mockPaymentDraft.rate).toFixed(2)} ${wallet.symbol}`}
        />

        <section className="flex flex-col gap-3">
          <h3 className="text-body font-semibold text-foreground">Pilih sumber dana</h3>
          <WalletSelector
            wallets={mockWallets}
            selectedId={walletId}
            recommendedId={mockPaymentDraft.recommendedWalletId}
            onChange={setWalletId}
          />
        </section>

        <article className="flex items-start gap-3 rounded-xl border border-accent-purple/30 bg-gradient-to-br from-accent-purple/15 via-surface to-surface p-3.5">
          <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-accent-purple-soft shrink-0">
            <SparklesIcon className="size-5" />
          </span>
          <p className="text-body-sm leading-5 text-foreground-muted">
            <span className="text-foreground font-semibold">SolPay AI:</span>{" "}
            {wallet.symbol} memberi rate paling kompetitif untuk transaksi ini
            dan tetap menjaga posisi yield-mu di Solana.
          </p>
        </article>

        <TotalBreakdown
          amountIdr={mockPaymentDraft.amountIdr}
          feeIdr={mockPaymentDraft.feeIdr}
          rate={mockPaymentDraft.rate}
          symbol={wallet.symbol}
        />
      </main>

      {/* Sticky bottom — slide-to-pay (preserved interaction) */}
      <footer className="fixed inset-x-0 bottom-0 z-30 px-edge pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)] border-t border-white/8 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-canvas-inner">
          <SlideToPay
            label={`Geser untuk bayar Rp ${mockPaymentDraft.amountIdr.toLocaleString("id-ID")}`}
            confirmedLabel="Memproses pembayaran…"
            onConfirm={() => {
              setTimeout(() => router.push("/pay/success"), 700);
            }}
          />
          <p className="mt-3 text-center text-caption text-foreground-subtle">
            Dilindungi oleh autentikasi biometrik · KYC level 2
          </p>
        </div>
      </footer>
    </div>
  );
}
