import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { TokenMark } from "@/components/ui/token-mark";
import { Badge } from "@/components/ui/badge";
import { ChevronRightIcon, ShieldCheckIcon, SparklesIcon } from "@/components/icons";
import type { StablecoinSymbol } from "@/types";

const supported: { symbol: StablecoinSymbol; name: string; apr: string; tag?: string }[] = [
  { symbol: "USDC", name: "USD Coin", apr: "4.8% APR", tag: "Paling populer" },
  { symbol: "USDT", name: "Tether", apr: "4.1% APR" },
  { symbol: "PYUSD", name: "PayPal USD", apr: "5.2% APR", tag: "Yield baru" },
  { symbol: "USDG", name: "Global Dollar", apr: "6.0% APR" },
];

export default function AddWalletPage() {
  return (
    <div className="flex flex-col gap-6">
      <TopBar back="/wallet" title="Tambah dompet" subtitle="Pilih stablecoin Solana" />

      <article className="rounded-xl border border-border-strong/60 bg-gradient-to-b from-surface-3 to-surface-2 p-4 flex items-start gap-3 shadow-[var(--shadow-card)]">
        <span className="inline-flex size-10 items-center justify-center rounded-pill bg-primary/15 text-primary shrink-0">
          <ShieldCheckIcon className="size-5" />
        </span>
        <div>
          <p className="text-body font-semibold text-foreground">Aman by-default</p>
          <p className="mt-0.5 text-body-sm text-foreground-muted leading-5">
            Setiap dompet dibuat di smart account non-custodial dengan recovery
            biometrik. Kamu memegang kendali penuh.
          </p>
        </div>
      </article>

      <ul className="flex flex-col gap-2.5">
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
      </ul>

      <article className="rounded-xl border border-border bg-surface-1 p-4 flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-[#cdbcff]">
          <SparklesIcon className="size-5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-foreground">Impor dompet eksternal</p>
          <p className="text-caption text-foreground-subtle">
            Phantom, Backpack, Solflare, atau seed phrase. Disimpan terenkripsi.
          </p>
        </div>
        <Link
          href="/wallet"
          className="inline-flex items-center justify-center rounded-pill bg-white/10 px-3 py-1.5 text-caption font-semibold text-foreground hover:bg-white/16 cursor-pointer"
        >
          Hubungkan
        </Link>
      </article>
    </div>
  );
}
