"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncateAddress } from "@/lib/format";
import { WalletPickerModal } from "./wallet-picker-modal";

export function ConnectButton() {
  const { publicKey, disconnect, connecting, connected, wallet } = useWallet();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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
      <>
        <button
          type="button"
          disabled={connecting}
          onClick={() => setPickerOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-body-sm font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft active:bg-primary-deep cursor-pointer transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {connecting ? "Connecting…" : "Connect Wallet"}
        </button>
        <WalletPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
      </>
    );
  }

  async function handleSwitchAccount() {
    setMenuOpen(false);
    await disconnect().catch(() => {});
    setPickerOpen(true);
  }

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 items-center gap-2 rounded-pill border border-border-strong/60 bg-surface-2 px-3 text-body-sm font-medium text-foreground hover:bg-surface-3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          {wallet?.adapter.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wallet.adapter.icon}
              alt={wallet.adapter.name}
              className="size-4 rounded-sm shrink-0"
            />
          )}
          {!wallet?.adapter.icon && (
            <span aria-hidden className="size-2 rounded-pill bg-success" />
          )}
          <span className="tabular-nums">{truncateAddress(publicKey.toBase58(), 4, 4)}</span>
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute left-0 top-12 z-50 w-52 rounded-xl border border-border-strong/60 bg-surface-3 p-1 shadow-[var(--shadow-card)]"
          >
            <div className="px-3 py-2 border-b border-border-strong/40 mb-1">
              <p className="text-body-xs text-foreground-muted">Connected via {wallet?.adapter.name}</p>
              <p className="text-body-xs font-mono text-foreground truncate">{publicKey.toBase58()}</p>
            </div>
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
              onClick={() => void handleSwitchAccount()}
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-body-sm text-foreground hover:bg-surface-4 cursor-pointer"
            >
              Switch account
            </button>
            <div className="my-1 border-t border-border-strong/40" />
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
      <WalletPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  );
}
