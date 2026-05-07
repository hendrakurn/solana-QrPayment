import Link from "next/link";
import type { Transaction } from "@/types";
import { formatRupiah, formatStable, formatTime } from "@/lib/format";
import { TokenMark } from "@/components/ui/token-mark";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const statusLabel = {
  success: "Sukses",
  pending: "Menunggu",
  failed: "Gagal",
} as const;

const statusToneText = {
  success: "text-foreground-muted",
  pending: "text-warning",
  failed: "text-danger",
} as const;

/**
 * Stitch-style transaction row — card-on-card with token avatar, merchant +
 * time/status caption, and tabular amounts on the right. Failed rows render a
 * subtle red rail on the leading edge and strike through the amount.
 */
export function TransactionRow({
  transaction,
  href,
}: {
  transaction: Transaction;
  href?: string;
}) {
  const Tag = href ? Link : "div";
  const props = href ? { href } : {};
  const failed = transaction.status === "failed";

  return (
    <Tag
      {...(props as { href: string })}
      className={cn(
        "relative flex items-center gap-4 rounded-xl border border-border-strong/60 bg-surface p-3.5 cursor-pointer hover:bg-surface-2 hover:border-border-strong transition-colors overflow-hidden",
      )}
    >
      {failed ? (
        <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-danger" />
      ) : null}

      <TokenMark symbol={transaction.symbol} size="lg" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-semibold text-foreground">
          {transaction.merchant}
        </p>
        <p className="mt-0.5 text-caption text-foreground-subtle truncate">
          {formatTime(transaction.occurredAt)} ·{" "}
          <span className={statusToneText[transaction.status]}>
            {statusLabel[transaction.status]}
          </span>{" "}
          · {transaction.category}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p
          className={cn(
            "text-body font-semibold tabular-nums",
            failed ? "text-foreground/60 line-through" : "text-foreground",
          )}
        >
          -{formatRupiah(transaction.amountIdr)}
        </p>
        <p className="text-caption text-foreground-subtle tabular-nums">
          {formatStable(transaction.amountUsd, transaction.symbol)}
        </p>
      </div>

      {href ? (
        <ChevronRightIcon className="size-4 text-foreground-subtle shrink-0" />
      ) : null}
    </Tag>
  );
}
