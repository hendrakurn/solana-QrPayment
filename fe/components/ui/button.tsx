"use client";

import { forwardRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  buttonHover,
  buttonHoverSpring,
  buttonTap,
} from "@/components/motion/motion-tokens";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium tracking-tight cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-soft active:bg-primary-deep shadow-[var(--shadow-press-primary)]",
  secondary:
    "bg-surface-2 text-foreground border border-border hover:bg-surface-3 hover:border-border-strong",
  ghost: "bg-transparent text-foreground hover:bg-white/5",
  danger:
    "bg-danger text-white hover:bg-danger/90 shadow-[var(--shadow-press-danger)]",
  soft:
    "bg-primary/12 text-primary hover:bg-primary/18 border border-primary/20",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-body-sm",
  md: "h-12 px-5 text-body",
  lg: "h-tap px-6 text-body",
};

export interface ButtonProps
  extends Omit<
    HTMLMotionProps<"button">,
    "whileHover" | "whileTap" | "transition" | "children"
  > {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    type = "button",
    className,
    iconLeft,
    iconRight,
    loading,
    disabled,
    fullWidth,
    children,
    ...rest
  },
  ref,
) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      whileHover={reduce || disabled || loading ? undefined : buttonHover}
      whileTap={reduce || disabled || loading ? undefined : buttonTap}
      transition={buttonHoverSpring}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {loading ? (
        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin-soft" />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!loading && iconRight}
    </motion.button>
  );
});
