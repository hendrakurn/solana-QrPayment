import type { ReactNode } from "react";
import { AlertIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title: string;
  description?: string;
  retry?: ReactNode;
  className?: string;
}

export function ErrorState({ title, description, retry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3 px-6 py-10 rounded-lg border border-danger/30 bg-danger-soft/40",
        className,
      )}
    >
      <div className="size-12 rounded-pill bg-danger/15 text-danger inline-flex items-center justify-center">
        <AlertIcon />
      </div>
      <h3 className="text-body font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="max-w-[32ch] text-body-sm text-foreground-muted leading-5">{description}</p>
      ) : null}
      {retry ? <div className="mt-1">{retry}</div> : null}
    </div>
  );
}
