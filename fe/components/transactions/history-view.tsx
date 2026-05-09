"use client";

import { useMemo, useState } from "react";
import type { Transaction, TransactionStatus } from "@/types";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchIcon, HistoryIcon } from "@/components/icons";
import { formatDateLong, getDateGroup } from "@/lib/format";
import { TransactionGroup } from "./transaction-group";

type Filter = "all" | TransactionStatus;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "success", label: "Success" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

export function HistoryView({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const filtered = transactions.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q)
      );
    });

    const buckets = new Map<string, { label: string; items: Transaction[] }>();
    for (const tx of filtered) {
      const group = getDateGroup(tx.occurredAt);
      const key =
        group === "today"
          ? "today"
          : group === "yesterday"
          ? "yesterday"
          : tx.occurredAt.toDateString();
      const label =
        group === "today"
          ? "Today"
          : group === "yesterday"
          ? "Yesterday"
          : formatDateLong(tx.occurredAt);
      const bucket = buckets.get(key) ?? { label, items: [] };
      bucket.items.push(tx);
      buckets.set(key, bucket);
    }
    return Array.from(buckets.values());
  }, [transactions, filter, query]);

  return (
    <div className="flex flex-col gap-5">
      <label className="relative block">
        <span className="sr-only">Search transactions</span>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-foreground-subtle" />
        <input
          type="search"
          placeholder="Search transactions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-touch w-full rounded-xl border border-border-strong/60 bg-surface pl-12 pr-4 text-body text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </label>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-edge px-edge">
        {filters.map((f) => (
          <Chip
            key={f.id}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="size-5" />}
          title="No transactions yet"
          description="Try adjusting the filter or search term."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map((group) => (
            <TransactionGroup
              key={group.label}
              label={group.label}
              transactions={group.items}
            />
          ))}
        </div>
      )}
    </div>
  );
}
