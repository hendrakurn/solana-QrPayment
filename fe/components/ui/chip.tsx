import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  iconLeft?: ReactNode;
}

export function Chip({ active, className, iconLeft, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-pill px-3.5 text-body-sm font-medium cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        active
          ? "bg-primary text-white border border-primary shadow-[var(--shadow-glow-soft)]"
          : "bg-surface-2 text-foreground-muted border border-border-strong/60 hover:bg-surface-3 hover:text-foreground",
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
    </button>
  );
}
