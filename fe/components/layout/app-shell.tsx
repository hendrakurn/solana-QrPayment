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
    <div className="min-h-dvh w-full bg-transparent">
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
      {/* Progressive gradient fade — softens content-to-navbar transition */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-36">
        <div className="mx-auto h-full w-full max-w-canvas bg-gradient-to-t from-background via-background/75 to-transparent" />
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
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_65%_-5%,rgba(82,32,216,0.38),transparent_60%),radial-gradient(50%_40%_at_-5%_95%,rgba(82,32,216,0.22),transparent_55%),radial-gradient(40%_35%_at_50%_50%,rgba(28,28,29,0.60),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,9,21,0.0),rgba(0,9,21,0.80))]" />
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
    <div className="min-h-dvh w-full bg-transparent text-foreground">
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
