import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { TopBarLeading } from "@/components/layout/top-bar-leading";
import { IconButton } from "@/components/ui/icon-button";
import { SectionTitle } from "@/components/ui/section-title";
import { SearchIcon } from "@/components/icons";
import { BalanceCardLive } from "@/components/home/balance-card-live";
import { TapToPay } from "@/components/home/tap-to-pay";
import { AiSuggestion } from "@/components/home/ai-suggestion";
import { QuickActions } from "@/components/home/quick-actions";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { mockTransactions } from "@/data/transactions";
import { formatRupiah } from "@/lib/format";

export default function HomePage() {
  const recent = mockTransactions.slice(0, 3);

  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          leading={<TopBarLeading />}
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
        <BalanceCardLive />
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
