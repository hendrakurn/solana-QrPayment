"use client";

import type { Wallet } from "@/types";
import { WalletRow } from "./wallet-row";

/**
 * Inline list of wallet options (vs. previous sheet) — matches the Stitch
 * Confirm V2 pattern where users see options at a glance without an extra tap.
 * The previous Sheet-based selector was redundant because we only support a
 * handful of stablecoins.
 */
export function WalletSelector({
  wallets,
  selectedId,
  recommendedId,
  onChange,
}: {
  wallets: Wallet[];
  selectedId: string;
  recommendedId?: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {wallets.map((wallet) => (
        <WalletRow
          key={wallet.id}
          wallet={wallet}
          selected={wallet.id === selectedId}
          recommended={wallet.id === recommendedId}
          onSelect={() => onChange(wallet.id)}
        />
      ))}
    </div>
  );
}
