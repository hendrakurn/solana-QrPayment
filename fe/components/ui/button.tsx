import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
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
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      data-loading={loading || undefined}
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
    </button>
  );
});
