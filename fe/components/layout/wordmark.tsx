import { cn } from "@/lib/utils";

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
    <span className={cn("text-accent-yellow", sizes[size], className)}>
      SolPay
    </span>
  );
}
