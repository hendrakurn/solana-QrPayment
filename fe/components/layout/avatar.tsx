import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  size = 40,
  className,
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex items-center justify-center rounded-pill text-body-sm font-semibold text-white bg-gradient-to-br from-primary via-primary-soft to-accent-purple shadow-[0_4px_16px_-4px_rgba(0,136,255,0.55)]",
        className,
      )}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
