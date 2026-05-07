import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "ghost" | "surface" | "primary" | "glass";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  ghost: "bg-transparent text-foreground hover:bg-white/5",
  surface:
    "bg-surface-2 text-foreground border border-border-strong/60 hover:bg-surface-3 hover:border-border-strong",
  primary: "bg-primary text-white hover:bg-primary-soft shadow-[var(--shadow-glow-soft)]",
  glass:
    "bg-surface-3/60 text-foreground border border-border-strong/40 backdrop-blur-md hover:bg-surface-3/80",
};

const sizes: Record<Size, string> = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  label: string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "surface", size = "md", className, label, icon, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-pill cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      <span className="sr-only">{label}</span>
      {icon}
    </button>
  );
});
