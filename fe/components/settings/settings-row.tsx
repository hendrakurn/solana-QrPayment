import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface SettingsRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  description?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  destructive?: boolean;
  as?: "button" | "div";
}

export function SettingsRow({
  icon,
  label,
  value,
  description,
  onClick,
  trailing,
  destructive,
  as = "button",
}: SettingsRowProps) {
  const Tag: "button" | "div" = as;
  const interactive = as === "button";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-left",
        interactive && "cursor-pointer hover:bg-surface-2 transition-colors",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-pill shrink-0",
          destructive
            ? "bg-danger/15 text-danger"
            : "bg-surface-3 text-primary",
        )}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-body font-semibold",
            destructive ? "text-danger" : "text-foreground",
          )}
        >
          {label}
        </p>
        {description ? (
          <p className="text-caption text-foreground-subtle truncate">{description}</p>
        ) : null}
      </div>
      {value ? (
        <span className="text-body-sm text-foreground-muted truncate max-w-[40%]">
          {value}
        </span>
      ) : null}
      {trailing ?? (interactive ? <ChevronRightIcon className="size-4 text-foreground-subtle" /> : null)}
    </Tag>
  );
}
