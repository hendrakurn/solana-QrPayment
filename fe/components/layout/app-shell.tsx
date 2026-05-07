import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mobile-first phone canvas. On wider screens we render the same composition
 * inside a centered phone-like frame so the experience reads correctly during
 * desktop preview without changing the underlying responsive layout.
 */
export function AppShell({
  children,
  className,
  /** When using a fixed TopBar, the shell adds top padding so content clears it. */
  withFixedTopBar,
}: {
  children: ReactNode;
  className?: string;
  withFixedTopBar?: boolean;
}) {
  return (
    <div className="min-h-dvh w-full bg-background">
      <DesktopBackdrop />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-canvas flex-col">
        <main
          className={cn(
            "flex-1 px-edge pb-[calc(112px+env(safe-area-inset-bottom))]",
            withFixedTopBar ? "pt-[calc(72px+env(safe-area-inset-top))]" : "pt-6",
            className,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * Subtle ambient gradient that only paints behind the phone canvas on tablets/
 * desktops — keeps mobile crisp and dark while providing a fintech "stage" on
 * larger displays. Pointer-events disabled so it never interferes.
 */
function DesktopBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 hidden sm:block opacity-90"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(0,136,255,0.15),transparent_60%),radial-gradient(40%_40%_at_85%_100%,rgba(82,32,216,0.18),transparent_60%),radial-gradient(35%_35%_at_15%_100%,rgba(238,159,10,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,9,21,0.0),rgba(0,9,21,0.85))]" />
    </div>
  );
}

/**
 * Full-screen surface for camera/scanner/success — opts out of the bottom nav
 * footprint so primary actions can sit at the safe-area edge.
 */
export function ImmersiveShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <div
        className={cn(
          "relative mx-auto flex min-h-dvh w-full max-w-canvas flex-col",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
