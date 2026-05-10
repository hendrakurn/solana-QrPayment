"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { WalletName } from "@solana/wallet-adapter-base";
import { truncateAddress } from "@/lib/format";

/**
 * Custom Connect button that bypasses WalletMultiButton (whose default styling
 * clashes with the SolPay brand). Triggers the wallet-adapter modal via
 * useWalletModal — Phantom is registered in SolanaProvider.
 */
export function ConnectButton() {
  const { publicKey, disconnect, connecting, connected, wallet, wallets, select, connect } =
    useWallet();
  const { setVisible } = useWalletModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  async function handleConnect() {
    const phantom = wallets.find((entry) => entry.adapter.name === "Phantom");

    if (!phantom) {
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

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  if (!connected || !publicKey) {
    return (
      <button
        type="button"
        disabled={connecting}
        onClick={() => {
          void handleConnect();
        }}
        className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-body-sm font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft active:bg-primary-deep cursor-pointer transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {connecting ? "Connecting…" : "Connect Phantom"}
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-pill border border-border-strong/60 bg-surface-2 px-3 text-body-sm font-medium text-foreground hover:bg-surface-3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <span aria-hidden className="size-2 rounded-pill bg-success" />
        <span className="tabular-nums">{truncateAddress(publicKey.toBase58(), 4, 4)}</span>
      </button>
      {menuOpen && (
        <div
          role="menu"
          className="absolute left-0 top-12 z-50 w-48 rounded-xl border border-border-strong/60 bg-surface-3 p-1 shadow-[var(--shadow-card)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              navigator.clipboard.writeText(publicKey.toBase58()).catch(() => {});
              setMenuOpen(false);
            }}
            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-body-sm text-foreground hover:bg-surface-4 cursor-pointer"
          >
            Copy address
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              disconnect().catch(() => {});
              setMenuOpen(false);
            }}
            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-body-sm text-danger hover:bg-surface-4 cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
