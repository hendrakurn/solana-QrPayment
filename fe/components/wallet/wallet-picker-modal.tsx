"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { WalletName } from "@solana/wallet-adapter-base";
import type { Wallet as WalletAdapter } from "@solana/wallet-adapter-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

function WalletRow({ entry, onSelect }: { entry: WalletAdapter; onSelect: () => void }) {
  const installed =
    entry.readyState === WalletReadyState.Installed ||
    entry.readyState === WalletReadyState.Loadable;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-surface-3 active:bg-surface-4 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {entry.adapter.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.adapter.icon}
          alt={entry.adapter.name}
          className="size-9 rounded-lg shrink-0"
        />
      ) : (
        <span className="size-9 rounded-lg bg-surface-3 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-foreground truncate">{entry.adapter.name}</p>
        {!installed && (
          <p className="text-body-xs text-foreground-muted">Not installed</p>
        )}
      </div>
      {installed ? (
        <span className="text-body-xs font-medium text-success shrink-0">Detected</span>
      ) : (
        <span className="text-body-xs text-foreground-muted shrink-0">Install →</span>
      )}
    </button>
  );
}

export function WalletPickerModal({ open, onClose }: Props) {
  const { wallets, select, connect, connecting } = useWallet();
  const [selecting, setSelecting] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset selecting state when modal closes
  useEffect(() => {
    if (!open) setSelecting(null);
  }, [open]);

  if (!open) return null;

  const installed = wallets.filter(
    (w) =>
      w.readyState === WalletReadyState.Installed ||
      w.readyState === WalletReadyState.Loadable,
  );
  const others = wallets.filter(
    (w) =>
      w.readyState !== WalletReadyState.Installed &&
      w.readyState !== WalletReadyState.Loadable,
  );

  async function handleSelect(entry: WalletAdapter) {
    const isInstalled =
      entry.readyState === WalletReadyState.Installed ||
      entry.readyState === WalletReadyState.Loadable;

    if (!isInstalled) {
      window.open(entry.adapter.url, "_blank", "noopener,noreferrer");
      return;
    }

    setSelecting(entry.adapter.name);
    try {
      select(entry.adapter.name as WalletName);
      await connect();
      onClose();
    } catch {
      // User rejected or wallet aborted.
    } finally {
      setSelecting(null);
    }
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Select wallet"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border-strong/60 bg-surface-2 shadow-[var(--shadow-card)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border-strong/40">
          <h2 className="text-body font-semibold text-foreground">Connect Wallet</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-3 hover:text-foreground cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-3 flex flex-col gap-1 max-h-80 overflow-y-auto">
          {connecting && selecting ? (
            <div className="py-8 text-center">
              <p className="text-body-sm text-foreground-muted">
                Connecting to {selecting}…
              </p>
            </div>
          ) : (
            <>
              {installed.length === 0 && (
                <p className="px-3 py-2 text-body-sm text-foreground-muted">
                  No wallets detected. Install one below.
                </p>
              )}
              {installed.map((entry) => (
                <WalletRow
                  key={entry.adapter.name}
                  entry={entry}
                  onSelect={() => void handleSelect(entry)}
                />
              ))}
              {others.length > 0 && (
                <>
                  {installed.length > 0 && (
                    <div className="my-1 border-t border-border-strong/40" />
                  )}
                  <p className="px-3 py-1 text-body-xs font-medium text-foreground-muted uppercase tracking-wide">
                    More wallets
                  </p>
                  {others.map((entry) => (
                    <WalletRow
                      key={entry.adapter.name}
                      entry={entry}
                      onSelect={() => void handleSelect(entry)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
