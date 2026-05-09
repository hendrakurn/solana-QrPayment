import type { StablecoinSymbol } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Stablecoin avatar with brand-correct hue. Uses centralized `--color-coin-*`
 * tokens from globals.css so the per-issuer hex (#2775CA for USDC, #26A17B for
 * USDT, etc.) lives in exactly one place.
 */
const palette: Record<StablecoinSymbol, { bg: string; ring: string; text: string }> = {
  USDC: {
    bg: "bg-coin-usdc/20",
    ring: "ring-coin-usdc/40",
    text: "text-coin-usdc-tint",
  },
};

export interface TokenMarkProps {
  symbol: StablecoinSymbol;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "size-8 text-caption",
  md: "size-10 text-body-sm",
  lg: "size-12 text-body",
};

export function TokenMark({ symbol, size = "md", className }: TokenMarkProps) {
  const c = palette[symbol];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center rounded-pill ring-1 font-semibold",
        c.bg,
        c.ring,
        c.text,
        sizeMap[size],
        className,
      )}
    >
      {symbol === "USDC" ? "C" : symbol[0]}
    </span>
  );
}
