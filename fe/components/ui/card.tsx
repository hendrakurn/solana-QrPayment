import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "elevated" | "outline" | "subtle";

/**
 * Card surfaces match the Stitch tonal scale:
 *  - default  → surface-secondary card (#1C1C1D) with outline-variant border
 *  - elevated → surface-container-high (#262a32) with strong shadow
 *  - outline  → transparent with subtle border (header sections)
 *  - subtle   → surface-container-low (#181c23) — quieter inline blocks
 */
const tones: Record<Tone, string> = {
  default: "bg-surface border border-border-strong/60 shadow-[var(--shadow-card)]",
  elevated:
    "bg-gradient-to-b from-surface-3 to-surface-2 border border-border-strong shadow-[var(--shadow-card-strong)]",
  outline: "bg-transparent border border-border-strong/60",
  subtle: "bg-surface-1 border border-border/80",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  inset?: boolean;
}

export function Card({ tone = "default", inset, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        tones[tone],
        inset && "p-5",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-2", className)} {...rest} />;
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-t border-border-strong/50 flex items-center gap-3",
        className,
      )}
      {...rest}
    />
  );
}
