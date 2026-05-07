"use client";

import { useMemo, useState } from "react";
import type { Wallet, WalletSort } from "@/types";
import { Chip } from "@/components/ui/chip";
import { SortIcon, ZapIcon, ClockIcon, TrendUpIcon } from "@/components/icons";
import { WalletCard } from "./wallet-card";

const sortConfig: { id: WalletSort; label: string; icon: React.ReactNode }[] = [
  { id: "frequent", label: "Sering dipakai", icon: <ZapIcon className="size-3.5" /> },
  { id: "amount", label: "Nominal", icon: <TrendUpIcon className="size-3.5" /> },
  { id: "recent", label: "Terbaru", icon: <ClockIcon className="size-3.5" /> },
];

export function WalletList({ wallets }: { wallets: Wallet[] }) {
  const [sort, setSort] = useState<WalletSort>("frequent");

  const sorted = useMemo(() => {
    const arr = [...wallets];
    switch (sort) {
      case "frequent":
        arr.sort((a, b) => b.useCount - a.useCount);
        break;
      case "amount":
        arr.sort((a, b) => b.fiatValue - a.fiatValue);
        break;
      case "recent":
        arr.sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime());
        break;
    }
    return arr;
  }, [wallets, sort]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-edge px-edge">
        <span className="inline-flex items-center gap-1.5 text-caption text-foreground-subtle shrink-0">
          <SortIcon className="size-3.5" /> Urut
        </span>
        {sortConfig.map((opt) => (
          <Chip
            key={opt.id}
            active={sort === opt.id}
            onClick={() => setSort(opt.id)}
            iconLeft={opt.icon}
          >
            {opt.label}
          </Chip>
        ))}
      </div>

      <ul className="flex flex-col gap-2.5">
        {sorted.map((w) => (
          <li key={w.id} id={w.id}>
            <WalletCard wallet={w} />
          </li>
        ))}
      </ul>
    </div>
  );
}
