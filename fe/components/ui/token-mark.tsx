import Image from "next/image";
import type { StablecoinSymbol } from "@/types";
import { cn } from "@/lib/utils";

export interface TokenMarkProps {
  symbol: StablecoinSymbol;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
};

export function TokenMark({ symbol, size = "md", className }: TokenMarkProps) {
  const px = sizeMap[size];
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-pill", className)}
      style={{ width: px, height: px }}
    >
      <Image
        src="/usdc.webp"
        alt={symbol}
        width={px}
        height={px}
        className="rounded-pill object-contain"
        priority={false}
      />
    </span>
  );
}
