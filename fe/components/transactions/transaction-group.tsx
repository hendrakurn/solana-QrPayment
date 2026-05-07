import type { Transaction } from "@/types";
import { TransactionRow } from "./transaction-row";
import { formatRupiah } from "@/lib/format";

export function TransactionGroup({
  label,
  transactions,
}: {
  label: string;
  transactions: Transaction[];
}) {
  const total = transactions
    .filter((t) => t.status !== "failed")
    .reduce((s, t) => s + t.amountIdr + t.feeIdr, 0);

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between px-1">
        <h3 className="text-caption font-semibold uppercase tracking-[0.16em] text-foreground-muted">
          {label}
        </h3>
        <p className="text-caption text-foreground-subtle tabular-nums">
          {formatRupiah(total)}
        </p>
      </header>
      <ul className="flex flex-col gap-2">
        {transactions.map((tx) => (
          <li key={tx.id} id={tx.id}>
            <TransactionRow transaction={tx} />
          </li>
        ))}
      </ul>
    </section>
  );
}
