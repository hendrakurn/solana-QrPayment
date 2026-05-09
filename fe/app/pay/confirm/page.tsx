"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CloseIcon, SparklesIcon } from "@/components/icons";
import { Wordmark } from "@/components/layout/wordmark";
import { MerchantCard } from "@/components/pay/merchant-card";
import { AmountDisplay } from "@/components/pay/amount-display";
import { WalletSelector } from "@/components/pay/wallet-selector";
import { TotalBreakdown } from "@/components/pay/total-breakdown";
import { SlideToPay } from "@/components/pay/slide-to-pay";
import { ConnectButton } from "@/components/wallet/connect-button";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { usePaymentDraft } from "@/lib/payment/draft-store";
import { useLastPaymentStore } from "@/lib/payment/last-payment-store";
import { useUsdcBalance } from "@/lib/solana/use-usdc-balance";
import { getSolpayProgram } from "@/lib/solana/program";
import { executePayment } from "@/lib/solana/pay";
import { parseSolpayError } from "@/lib/solana/errors";
import type { Wallet } from "@/types";

export default function ConfirmPage() {
  const router = useRouter();
  const draft = usePaymentDraft((s) => s.draft);
  const setLastPayment = useLastPaymentStore((s) => s.set);
  const { connection } = useConnection();
  const wallet = useWallet();
  const { uiAmount: balanceUsdc, loading: balLoading } = useUsdcBalance();

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Bumping this remounts <SlideToPay/> so the user can re-attempt after a failure
  // (the slider locks itself after `confirmed` and has no external reset prop).
  const [resetKey, setResetKey] = useState(0);

  // Single-wallet list (USDC only) so the existing WalletSelector UI stays
  // intact. Other stablecoins are surfaced as "Segera hadir" on /wallet.
  const usdcWallet = useMemo<Wallet | null>(() => {
    if (!wallet.publicKey) return null;
    return {
      id: "w-usdc",
      symbol: "USDC",
      network: "Solana Devnet",
      label: "USDC Devnet",
      balance: balanceUsdc,
      fiatValue: Math.round(balanceUsdc * draft.rate),
      apr: 4.8,
      trend24h: 0,
      lastUsedAt: new Date(),
      useCount: 0,
      isDefault: true,
      address: wallet.publicKey.toBase58(),
    };
  }, [wallet.publicKey, balanceUsdc, draft.rate]);

  const program = useMemo(
    () => getSolpayProgram(connection, wallet),
    // Stable deps: avoid object identity churn on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connection, wallet.publicKey?.toBase58(), wallet.connected],
  );

  const amountUsdcRequired = draft.amountIdr / draft.rate;
  const totalIdr = draft.amountIdr + draft.feeIdr;
  const totalUsdcRequired = totalIdr / draft.rate;
  const connected = wallet.connected && !!wallet.publicKey;
  const insufficientBalance =
    connected && !balLoading && balanceUsdc < totalUsdcRequired;
  const slideDisabled =
    !connected || !program || insufficientBalance || busy || balLoading;

  async function handleConfirm() {
    setError(null);
    if (!program || !wallet.publicKey) {
      setError("Hubungkan dompet Phantom dulu.");
      setResetKey((k) => k + 1);
      return;
    }
    if (insufficientBalance) {
      setError("Saldo USDC tidak cukup. Top-up dulu di halaman Wallet.");
      setResetKey((k) => k + 1);
      return;
    }

    setBusy(true);
    try {
      const result = await executePayment({
        program,
        sendTransaction: wallet.sendTransaction,
        payer: wallet.publicKey,
        amountUsdc: totalUsdcRequired,
        amountIdr: totalIdr,
        merchantId: (draft.merchant.qrisId || draft.merchant.name || "MERCHANT").slice(0, 32),
        xenditReference: crypto.randomUUID(),
      });

      setLastPayment({
        signature: result.signature,
        paymentPda: result.paymentPda,
        draft,
        amountUsdc: totalUsdcRequired,
        symbol: "USDC",
        timestamp: Date.now(),
      });

      router.push("/pay/success");
    } catch (e) {
      setError(parseSolpayError(e));
      setResetKey((k) => k + 1);
      setBusy(false);
    }
  }

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

      <MotionSection
        as="main"
        stagger
        immediate
        className="flex-1 flex flex-col gap-6 px-edge pt-6 pb-40"
      >
        <MotionItem>
          <MerchantCard merchant={draft.merchant} />
        </MotionItem>

        <MotionItem>
          <AmountDisplay
            amountIdr={draft.amountIdr}
            helper={`≈ ${amountUsdcRequired.toFixed(2)} USDC`}
          />
        </MotionItem>

        <MotionItem as="section" className="flex flex-col gap-3">
          <h3 className="text-body font-semibold text-foreground">Sumber dana</h3>

          {!connected ? (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-border-strong/60 bg-surface p-4">
              <p className="text-body-sm text-foreground-muted">
                Hubungkan dompet Phantom untuk membayar dengan USDC kamu.
              </p>
              <ConnectButton />
            </div>
          ) : usdcWallet ? (
            <WalletSelector
              wallets={[usdcWallet]}
              selectedId="w-usdc"
              recommendedId="w-usdc"
              onChange={() => {}}
            />
          ) : null}
        </MotionItem>

        <MotionItem
          as="article"
          className="flex items-start gap-3 rounded-xl border border-accent-purple/30 bg-gradient-to-br from-accent-purple/15 via-surface to-surface p-3.5"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-accent-purple-soft shrink-0">
            <SparklesIcon className="size-5" />
          </span>
          <p className="text-body-sm leading-5 text-foreground-muted">
            <span className="text-foreground font-semibold">SolPay AI:</span>{" "}
            USDC memberi rate paling kompetitif di Solana devnet untuk
            transaksi ini.
          </p>
        </MotionItem>

        <MotionItem>
          <TotalBreakdown
            amountIdr={draft.amountIdr}
            feeIdr={draft.feeIdr}
            rate={draft.rate}
            symbol="USDC"
          />
        </MotionItem>

        {insufficientBalance && (
          <MotionItem
            as="div"
            className="rounded-xl border border-warning/40 bg-warning/10 p-3.5 text-body-sm text-warning"
          >
            Saldo USDC kamu tidak cukup ({balanceUsdc.toFixed(2)} USDC) untuk
            pembayaran ini ({totalUsdcRequired.toFixed(2)} USDC).{" "}
            <Link href="/wallet/add" className="font-semibold underline">
              Top-up dulu
            </Link>
            .
          </MotionItem>
        )}

        {error && (
          <MotionItem
            as="div"
            role="alert"
            className="rounded-xl border border-danger/40 bg-danger/10 p-3.5 text-body-sm text-danger"
          >
            {error}
          </MotionItem>
        )}
      </MotionSection>

      {/* Sticky bottom — slide-to-pay (preserved interaction) */}
      <footer className="fixed inset-x-0 bottom-0 z-30 px-edge pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)] border-t border-white/8 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-canvas-inner">
          <SlideToPay
            key={resetKey}
            label={`Geser untuk bayar Rp ${totalIdr.toLocaleString("id-ID")}`}
            confirmedLabel="Memproses pembayaran…"
            disabled={slideDisabled}
            onConfirm={handleConfirm}
          />
          <p className="mt-3 text-center text-caption text-foreground-subtle">
            {connected
              ? `Devnet · ${draft.merchant.name}`
              : "Hubungkan Phantom dulu sebelum membayar"}
          </p>
        </div>
      </footer>
    </div>
  );
}
