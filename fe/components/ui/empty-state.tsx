import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 px-6 py-10 rounded-lg border border-dashed border-border bg-white/2",
        className,
      )}
    >
      <div className="size-12 rounded-pill bg-primary/12 text-primary inline-flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-body font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="max-w-[28ch] text-body-sm text-foreground-muted leading-5">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
