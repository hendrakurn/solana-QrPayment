"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Avatar } from "@/components/layout/avatar";
import { ConnectButton } from "@/components/wallet/connect-button";

/**
 * Slot for the leading element of the top bar: shows ConnectButton when no wallet
 * is connected, swaps to the Avatar (linking to /settings) once Phantom is connected.
 *
 * Avatar initials derive from the connected pubkey for now (first 2 chars). When
 * a real profile system lands, swap with `mockUser.avatarSeed` from a hook.
 */
export function TopBarLeading() {
  const { connected, publicKey } = useWallet();

  if (connected && publicKey) {
    const initials = publicKey.toBase58().slice(0, 2);
    return (
      <Link
        href="/settings"
        aria-label="Buka pengaturan"
        className="cursor-pointer rounded-pill"
      >
        <Avatar initials={initials} />
      </Link>
    );
  }

  return <ConnectButton />;
}
