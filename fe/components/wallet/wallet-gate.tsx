"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { WalletName } from "@solana/wallet-adapter-base";
import { TopBar } from "@/components/layout/top-bar";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { UserIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

function DisconnectedState() {
  const { select, wallets } = useWallet();
  const { setVisible } = useWalletModal();

  const phantom = wallets.find((w) => w.adapter.name === "Phantom");
  const canConnectDirect =
    phantom &&
    phantom.readyState !== WalletReadyState.NotDetected &&
    phantom.readyState !== WalletReadyState.Unsupported;

  function handleConnect() {
    if (canConnectDirect) {
      // Bypass modal — select Phantom, autoConnect effect fires adapter.connect()
      // which triggers the Phantom extension popup directly
      select("Phantom" as WalletName);
    } else {
      // Phantom not installed — open modal (shows "Get Phantom" install link)
      setVisible(true);
    }
  }

  const label = canConnectDirect ? "Connect Phantom" : "Get Phantom";
  const sub = canConnectDirect
    ? "Connect your Phantom wallet to use SolPay"
    : "Install Phantom extension to use SolPay";

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar showWordmark />
      </MotionItem>
      <MotionItem
        as="section"
        className="flex flex-col items-center justify-center text-center gap-6 py-16"
      >
        <span className="inline-flex size-24 items-center justify-center rounded-3xl border border-border-strong/60 bg-surface-2 text-foreground-muted">
          <UserIcon className="size-12" />
        </span>
        <div>
          <h2 className="text-section font-semibold text-accent-yellow">Connect Wallet</h2>
          <p className="mt-1 text-body-sm text-foreground-muted">{sub}</p>
        </div>
        <button
          type="button"
          onClick={handleConnect}
          className="inline-flex h-tap items-center justify-center gap-2 rounded-xl bg-primary px-8 text-body font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft cursor-pointer transition-colors"
        >
          {label}
        </button>
      </MotionItem>
    </MotionSection>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center min-h-14">
        <Skeleton className="h-6 w-28 mx-auto" />
      </div>
      <div className="flex flex-col items-center gap-4 py-16">
        <Skeleton className="size-24 rounded-3xl" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-48 rounded-xl" />
      </div>
    </div>
  );
}

export function WalletGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { connected, connecting } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || connecting) return <LoadingState />;
  if (!connected) return <DisconnectedState />;
  return <>{children}</>;
}
