"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HomeIcon, WalletIcon, HistoryIcon, QrIcon } from "@/components/icons";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match: (path: string) => boolean;
}

const items: NavItem[] = [
  {
    href: "/",
    label: "Beranda",
    icon: <HomeIcon className="size-5" />,
    match: (p) => p === "/",
  },
  {
    href: "/wallet",
    label: "Dompet",
    icon: <WalletIcon className="size-5" />,
    match: (p) => p.startsWith("/wallet"),
  },
  {
    href: "/history",
    label: "Riwayat",
    icon: <HistoryIcon className="size-5" />,
    match: (p) => p.startsWith("/history"),
  },
];

/**
 * Bottom navigation with a centrally-elevated Tap-to-Pay shortcut.
 * The elevated CTA preserves the focal-first hierarchy from the spec while the
 * surrounding tabs read as quiet glass — matching the Stitch dark-fintech aesthetic.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 px-4 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[440px] items-center justify-between rounded-2xl border border-white/8 bg-surface-low/85 px-3 py-2 backdrop-blur-xl shadow-[var(--shadow-nav)]">
        {items.slice(0, 1).map((item) => (
          <NavButton key={item.href} item={item} active={item.match(pathname)} />
        ))}

        <Link
          href="/pay/scan"
          aria-label="Tap to Pay"
          className="relative -mt-7 flex size-14 items-center justify-center rounded-pill bg-primary text-white cursor-pointer transition-transform duration-[var(--duration-fast)] active:scale-95 shadow-[var(--shadow-glow-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-pill bg-primary/40 animate-tap-pulse"
          />
          <span
            aria-hidden
            className="absolute inset-1 rounded-pill bg-gradient-to-br from-white/25 via-transparent to-black/20"
          />
          <QrIcon className="relative size-6" />
        </Link>

        {items.slice(1).map((item) => (
          <NavButton key={item.href} item={item} active={item.match(pathname)} />
        ))}
      </div>
    </nav>
  );
}

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-12 w-16 flex-col items-center justify-center gap-0.5 rounded-pill cursor-pointer transition-colors",
        active
          ? "text-primary drop-shadow-[0_0_10px_rgba(0,136,255,0.5)]"
          : "text-foreground-subtle hover:text-foreground",
      )}
    >
      {item.icon}
      <span className="text-nav font-medium leading-none tracking-tight">{item.label}</span>
    </Link>
  );
}
