import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { TopBarLeading } from "@/components/layout/top-bar-leading";
import { BalanceCardLive } from "@/components/home/balance-card-live";
import { TapToPay } from "@/components/home/tap-to-pay";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { mockTransactions } from "@/data/transactions";

export default function HomePage() {
  const recent = mockTransactions.slice(0, 2);

  return (
    <MotionSection stagger immediate className="flex flex-col gap-8">
      <MotionItem>
        <TopBar showWordmark leading={<TopBarLeading />} />
      </MotionItem>

      <MotionItem>
        <BalanceCardLive />
      </MotionItem>

      <MotionItem>
        <TapToPay />
      </MotionItem>

      <MotionItem as="section" className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-caption uppercase tracking-[0.16em] text-foreground-subtle font-medium">
            Recent
          </span>
          <Link
            href="/history"
            className="text-caption font-medium text-primary hover:text-primary-soft cursor-pointer transition-colors"
          >
            See all
          </Link>
        </div>
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
