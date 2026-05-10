import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { WalletGate } from "@/components/wallet/wallet-gate";

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppShell>
        <WalletGate>{children}</WalletGate>
      </AppShell>
      <BottomNav />
    </>
  );
}
