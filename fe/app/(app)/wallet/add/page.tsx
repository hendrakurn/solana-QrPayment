import { TopBar } from "@/components/layout/top-bar";
import { TokenMark } from "@/components/ui/token-mark";
import { Badge } from "@/components/ui/badge";
import { ChevronRightIcon, ShieldCheckIcon, SparklesIcon } from "@/components/icons";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import Link from "next/link";
import type { StablecoinSymbol } from "@/types";

const supported: { symbol: StablecoinSymbol; name: string; apr: string; tag?: string }[] = [
  { symbol: "USDC", name: "USD Coin", apr: "4.8% APR", tag: "Most popular" },
];

export default function AddWalletPage() {
  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar back="/wallet" title="Add wallet" subtitle="Choose a Solana stablecoin" />
      </MotionItem>

      <MotionItem
        as="article"
        className="rounded-xl border border-border-strong/60 bg-gradient-to-b from-surface-3 to-surface-2 p-4 flex items-start gap-3 shadow-[var(--shadow-card)]"
      >
        <span className="inline-flex size-10 items-center justify-center rounded-pill bg-primary/15 text-primary shrink-0">
          <ShieldCheckIcon className="size-5" />
        </span>
        <div>
          <p className="text-body font-semibold text-foreground">Secure by default</p>
          <p className="mt-0.5 text-body-sm text-foreground-muted leading-5">
            Each wallet is created as a non-custodial smart account with biometric
            recovery. You hold full control.
          </p>
        </div>
      </MotionItem>

      <MotionItem as="ul" className="flex flex-col gap-2.5">
        {supported.map((coin) => (
          <li key={coin.symbol}>
            <button
              type="button"
              className="flex w-full items-center gap-4 rounded-xl border border-border-strong/60 bg-surface p-4 hover:bg-surface-2 hover:border-border-strong cursor-pointer transition-colors text-left active:scale-[0.99]"
            >
              <TokenMark symbol={coin.symbol} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-body font-semibold text-foreground">{coin.name}</p>
                  {coin.tag ? <Badge tone="primary">{coin.tag}</Badge> : null}
                </div>
                <p className="text-caption text-foreground-subtle">
                  {coin.symbol} · Solana · {coin.apr}
                </p>
              </div>
              <ChevronRightIcon className="size-5 text-foreground-subtle" />
            </button>
          </li>
        ))}
      </MotionItem>

      <MotionItem
        as="article"
        className="rounded-xl border border-border bg-surface-1 p-4 flex items-center gap-3"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-accent-purple-soft">
          <SparklesIcon className="size-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-foreground">Import external wallet</p>
          <p className="text-caption text-foreground-subtle">
            Phantom, Backpack, Solflare, or seed phrase. Stored encrypted.
          </p>
        </div>
        <Link
          href="/wallet"
          className="inline-flex items-center justify-center rounded-pill bg-white/10 px-3 py-1.5 text-caption font-semibold text-foreground hover:bg-white/16 cursor-pointer"
        >
          Connect
        </Link>
      </MotionItem>
    </MotionSection>
  );
}
