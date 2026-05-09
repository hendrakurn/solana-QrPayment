"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Avatar } from "@/components/layout/avatar";

export function TopBarLeading() {
  const { connected, publicKey, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const initials = publicKey.toBase58().slice(0, 2);
    return (
      <Link
        href="/wallet"
        aria-label="Open wallet"
        className="cursor-pointer rounded-pill"
      >
        <Avatar initials={initials} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={connecting}
      onClick={() => setVisible(true)}
      className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-body-sm font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft active:bg-primary-deep cursor-pointer transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {connecting ? "Connecting…" : "Connect Phantom"}
    </button>
  );
}
