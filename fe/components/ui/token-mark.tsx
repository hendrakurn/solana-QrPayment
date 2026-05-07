import type { StablecoinSymbol } from "@/types";
import { cn } from "@/lib/utils";

const palette: Record<StablecoinSymbol, { bg: string; ring: string; text: string }> = {
  USDC: {
    bg: "bg-[#2775ca]/20",
    ring: "ring-[#2775ca]/40",
    text: "text-[#5ba6ff]",
  },
  USDT: {
    bg: "bg-[#26a17b]/20",
    ring: "ring-[#26a17b]/40",
    text: "text-[#34c397]",
  },
  PYUSD: {
    bg: "bg-[#0070ba]/20",
    ring: "ring-[#0070ba]/40",
    text: "text-[#5fb1ff]",
  },
  USDG: {
    bg: "bg-accent-yellow/15",
    ring: "ring-accent-yellow/40",
    text: "text-accent-yellow",
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
