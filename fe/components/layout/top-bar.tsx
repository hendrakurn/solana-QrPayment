import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@/components/icons";
import { Wordmark } from "./wordmark";

export interface TopBarProps {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  back?: string;
  className?: string;
  /** Show centered SolPay wordmark instead of title text. */
  showWordmark?: boolean;
  /** Fixed (glass) variant pins the bar to the top with backdrop blur. */
  variant?: "fixed" | "inline";
}

export function TopBar({
  title,
  subtitle,
  leading,
  trailing,
  back,
  className,
  showWordmark,
  variant = "inline",
}: TopBarProps) {
  const showBack = Boolean(back);
  const isFixed = variant === "fixed";

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 min-h-14 w-full",
        isFixed
          ? "fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-background/80 backdrop-blur-xl"
          : "",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-3",
          isFixed ? "max-w-[480px] px-edge py-3" : "",
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <Link
              href={back!}
              aria-label="Kembali"
              className="size-10 -ml-1 inline-flex items-center justify-center rounded-pill text-foreground hover:bg-white/5 cursor-pointer"
            >
              <ChevronLeftIcon />
            </Link>
          ) : (
            leading
          )}

          {title && !showWordmark ? (
            <div className="min-w-0">
              <h1 className="text-body font-semibold tracking-tight text-foreground truncate">
                {title}
              </h1>
              {subtitle ? (
                <p className="text-caption text-foreground-subtle truncate">{subtitle}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        {showWordmark ? (
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <Wordmark size="sm" />
          </div>
        ) : null}

        <div className="flex items-center gap-2">{trailing}</div>
      </div>
    </header>
  );
}
