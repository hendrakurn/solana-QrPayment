import { cn } from "@/lib/utils";

/**
 * SolPay wordmark with the signature blue glow used across screens.
 * Rendered as plain text so it inherits font-weight and letter-spacing from
 * the global typography scale.
 */
export function Wordmark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-body font-semibold",
    md: "text-section font-semibold tracking-tight",
    lg: "text-display font-semibold tracking-tight",
  };
  return (
    <span className={cn("text-primary text-glow-primary", sizes[size], className)}>
      SolPay
    </span>
  );
}
