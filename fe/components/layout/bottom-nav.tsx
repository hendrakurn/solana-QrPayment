"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HomeIcon, WalletIcon, HistoryIcon } from "@/components/icons";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  match: (path: string) => boolean;
}

const items: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon className="size-5" />,
    match: (p) => p === "/",
  },
  {
    href: "/wallet",
    label: "Wallet",
    icon: <WalletIcon className="size-5" />,
    match: (p) => p.startsWith("/wallet"),
  },
  {
    href: "/history",
    label: "History",
    icon: <HistoryIcon className="size-5" />,
    match: (p) => p.startsWith("/history"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 px-4 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-canvas-inner items-center justify-around rounded-2xl border border-white/8 bg-surface-low/85 px-3 py-2 backdrop-blur-xl shadow-[var(--shadow-nav)]">
        {items.map((item) => (
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
          ? "text-accent-yellow drop-shadow-[var(--shadow-glow-nav-active)]"
          : "text-foreground-subtle hover:text-foreground",
      )}
    >
      {item.icon}
      <span className="text-nav font-medium leading-none tracking-tight">{item.label}</span>
    </Link>
  );
}
