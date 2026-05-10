"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { Avatar } from "@/components/layout/avatar";

export function TopBarLeading() {
  const { publicKey } = useWallet();
  const initials = publicKey?.toBase58().slice(0, 2) ?? "?";

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
