import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "purple";

const tones: Record<Tone, string> = {
  neutral: "bg-white/5 text-foreground-muted border-white/10",
  primary: "bg-primary/14 text-primary border-primary/30",
  success: "bg-success/14 text-success border-success/30",
  warning: "bg-warning/12 text-warning border-warning/30",
  danger: "bg-danger/14 text-danger border-danger/30",
  purple: "bg-accent-purple/18 text-[#bba6ff] border-accent-purple/35",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  iconLeft?: ReactNode;
}

export function Badge({
  tone = "neutral",
  iconLeft,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-caption font-medium",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {iconLeft ? <span className="-ml-0.5">{iconLeft}</span> : null}
      {children}
    </span>
  );
}
