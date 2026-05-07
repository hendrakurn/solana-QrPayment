import Link from "next/link";
import { mockRecentMerchants } from "@/data/transactions";
import { formatRupiah } from "@/lib/format";

const palette = [
  "from-primary/30 to-primary/0 text-primary",
  "from-accent-yellow/30 to-accent-yellow/0 text-accent-yellow",
  "from-accent-purple/40 to-accent-purple/0 text-accent-purple-soft",
  "from-success/30 to-success/0 text-success",
];

export function QuickActions() {
  return (
    <ul className="flex gap-3 overflow-x-auto scrollbar-none -mx-edge px-edge snap-x snap-mandatory">
      {mockRecentMerchants.map((merchant, index) => (
        <li key={merchant.name} className="snap-start shrink-0">
          <Link
            href="/pay/scan"
            className="block w-36 rounded-xl border border-border-strong/60 bg-surface p-3 hover:border-border-strong hover:bg-surface-2 cursor-pointer transition-colors"
          >
            <span
              aria-hidden
              className={`inline-flex size-10 items-center justify-center rounded-pill bg-gradient-to-br ${palette[index % palette.length]}`}
            >
              <span className="text-body font-semibold">{merchant.name[0]}</span>
            </span>
            <p className="mt-3 truncate text-body-sm font-semibold text-foreground">
              {merchant.name}
            </p>
            <p className="text-caption text-foreground-subtle">{merchant.category}</p>
            <p className="mt-2 text-caption font-medium text-foreground-muted tabular-nums">
              {formatRupiah(merchant.lastAmount)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
