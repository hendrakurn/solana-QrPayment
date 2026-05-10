"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { WalletName } from "@solana/wallet-adapter-base";
import { TopBar } from "@/components/layout/top-bar";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { UserIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

const subscribe = () => () => {};

function useHasHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function DisconnectedState() {
  const { wallets, wallet, select, connect } = useWallet();
  const { setVisible } = useWalletModal();

  const phantom = wallets.find((w) => w.adapter.name === "Phantom");
  const canConnectDirect =
    phantom &&
    phantom.readyState !== WalletReadyState.NotDetected &&
    phantom.readyState !== WalletReadyState.Unsupported;

  async function handleConnect() {
    if (!phantom || !canConnectDirect) {
      setVisible(true);
      return;
    }

    try {
      if (wallet?.adapter.name !== "Phantom") {
        select("Phantom" as WalletName);
        await phantom.adapter.connect();
        return;
      }

      await connect();
    } catch {
      // User rejected or Phantom aborted; keep UI in disconnected state.
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
          onClick={() => {
            void handleConnect();
          }}
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
  const mounted = useHasHydrated();
  const { connected, connecting } = useWallet();

  if (!mounted || connecting) return <LoadingState />;
  if (!connected) return <DisconnectedState />;
  return <>{children}</>;
}
