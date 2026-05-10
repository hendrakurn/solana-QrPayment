/**
 * Formatting helpers for SolPay's mixed fiat/crypto display.
 * Keep all currency / number rendering routed through here so we have one place
 * to enforce locale, decimals, and consistency across screens.
 */

const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const STABLE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const COMPACT_USD = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatRupiah(amount: number): string {
  return IDR_FORMATTER.format(amount);
}

export function formatStable(amount: number, symbol = "IDRX"): string {
  return `${STABLE_FORMATTER.format(amount)} ${symbol}`;
}

export function formatUsd(amount: number): string {
  return `$${STABLE_FORMATTER.format(amount)}`;
}

export function formatCompactUsd(amount: number): string {
  return `$${COMPACT_USD.format(amount)}`;
}

export function formatPercent(value: number, opts: { signed?: boolean } = {}): string {
  const signed = opts.signed ?? true;
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export type DateGroup = "today" | "yesterday" | "earlier";

export function getDateGroup(date: Date, now: Date = new Date()): DateGroup {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  return "earlier";
}

const TIME_FMT = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const DATE_FMT_SHORT = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

const DATE_FMT_LONG = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatTime(date: Date): string {
  return TIME_FMT.format(date);
}

export function formatDateShort(date: Date): string {
  return DATE_FMT_SHORT.format(date);
}

export function formatDateLong(date: Date): string {
  return DATE_FMT_LONG.format(date);
}

export function truncateAddress(address: string, lead = 6, trail = 4): string {
  if (address.length <= lead + trail + 1) return address;
  return `${address.slice(0, lead)}…${address.slice(-trail)}`;
}
