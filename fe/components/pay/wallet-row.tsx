import type { Wallet } from "@/types";
import { TokenMark } from "@/components/ui/token-mark";
import { formatRupiah, formatStable } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Wallet option button — selected state mirrors the Stitch Confirm V2 pattern:
 * elevated surface + primary border + 1px right indicator rail + filled check.
 */
export function WalletRow({
  wallet,
  selected,
  recommended,
  onSelect,
}: {
  wallet: Wallet;
  selected?: boolean;
  recommended?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative w-full flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left cursor-pointer transition-colors overflow-hidden",
        selected
          ? "border-primary bg-surface-3"
          : "border-border-strong/60 bg-surface hover:bg-surface-2",
      )}
    >
      {selected ? (
        <span aria-hidden className="absolute inset-y-0 right-0 w-1 bg-primary" />
      ) : null}

      <TokenMark symbol={wallet.symbol} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-body font-semibold text-foreground">{wallet.label}</p>
          {recommended ? <Badge tone="primary">Direkomendasikan</Badge> : null}
        </div>
        <p className="mt-0.5 text-caption text-foreground-subtle">
          Saldo {formatStable(wallet.balance, wallet.symbol)} · APR {wallet.apr ?? 0}%
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-body-sm font-semibold tabular-nums text-foreground">
          {formatRupiah(wallet.fiatValue)}
        </p>
        <p className="text-caption text-foreground-subtle">{wallet.network}</p>
      </div>
      <span
        className={cn(
          "ml-1 inline-flex size-6 items-center justify-center rounded-pill",
          selected
            ? "bg-primary text-white"
            : "border-2 border-border-strong",
        )}
      >
        {selected ? <CheckIcon className="size-3.5" /> : null}
      </span>
    </button>
  );
}
