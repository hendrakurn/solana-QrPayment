"use client";

import { useSyncExternalStore, useState, type ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TopBar } from "@/components/layout/top-bar";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { UserIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletPickerModal } from "./wallet-picker-modal";

const subscribe = () => () => {};

function useHasHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

function DisconnectedState() {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
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
            <p className="mt-1 text-body-sm text-foreground-muted">
              Choose a wallet to use SolPay
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex h-tap items-center justify-center gap-2 rounded-xl bg-primary px-8 text-body font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft cursor-pointer transition-colors"
          >
            Connect Wallet
          </button>
        </MotionItem>
      </MotionSection>
      <WalletPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
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
