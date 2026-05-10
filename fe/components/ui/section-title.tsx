import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  title: string;
  caption?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionTitle({ title, caption, action, className }: SectionTitleProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-body font-semibold text-accent-yellow tracking-tight">{title}</h2>
        {caption ? (
          <p className="text-caption text-foreground-subtle mt-0.5">{caption}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
