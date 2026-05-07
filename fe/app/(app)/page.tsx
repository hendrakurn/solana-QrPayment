import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { SectionTitle } from "@/components/ui/section-title";
import { SearchIcon } from "@/components/icons";
import { BalanceCard } from "@/components/home/balance-card";
import { TapToPay } from "@/components/home/tap-to-pay";
import { AiSuggestion } from "@/components/home/ai-suggestion";
import { QuickActions } from "@/components/home/quick-actions";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { mockUser } from "@/data/user";
import { mockWallets, totalFiatBalance } from "@/data/wallets";
import { mockTransactions } from "@/data/transactions";
import { formatRupiah } from "@/lib/format";

export default function HomePage() {
  const total = totalFiatBalance(mockWallets);
  const trend = mockWallets.reduce((s, w) => s + w.trend24h * w.fiatValue, 0) / total;
  const recent = mockTransactions.slice(0, 3);

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          leading={
            <Link
              href="/settings"
              aria-label="Buka pengaturan"
              className="cursor-pointer rounded-pill"
            >
              <Avatar initials={mockUser.avatarSeed} />
            </Link>
          }
          trailing={
            <IconButton
              variant="ghost"
              label="Cari transaksi"
              icon={<SearchIcon className="size-5 text-primary" />}
            />
          }
        />
      </MotionItem>

      <MotionItem>
        <BalanceCard totalIdr={total} walletCount={mockWallets.length} trend24h={trend} />
      </MotionItem>

      <MotionItem>
        <TapToPay />
      </MotionItem>

      <MotionItem>
        <AiSuggestion
          title="USDC memberi rate terbaik untuk QRIS"
          body={`Rate aktif Rp 15.640/USDC. Hemat sekitar ${formatRupiah(120)} per transaksi vs USDT.`}
        />
      </MotionItem>

      <MotionItem as="section" className="flex flex-col gap-3">
        <SectionTitle
          title="Cepat bayar lagi"
          caption="Merchant yang paling sering kamu pakai"
        />
        <QuickActions />
      </MotionItem>

      <MotionItem as="section" className="flex flex-col gap-2">
        <SectionTitle
          title="Aktivitas terbaru"
          action={
            <Link
              href="/history"
              className="text-body-sm font-medium text-primary hover:text-primary-soft cursor-pointer"
            >
              Lihat semua
            </Link>
          }
        />
        <ul className="flex flex-col gap-2">
          {recent.map((tx) => (
            <li key={tx.id}>
              <TransactionRow transaction={tx} href={`/history#${tx.id}`} />
            </li>
          ))}
        </ul>
      </MotionItem>
    </MotionSection>
  );
}
