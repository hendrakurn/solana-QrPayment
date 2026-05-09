import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { HistoryView } from "@/components/transactions/history-view";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import { SortIcon } from "@/components/icons";
import { mockUser } from "@/data/user";
import { mockTransactions } from "@/data/transactions";

export default function HistoryPage() {
  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar
          showWordmark
          leading={
            <Link href="/wallet" aria-label="Open wallet">
              <Avatar initials={mockUser.avatarSeed} />
            </Link>
          }
          trailing={
            <IconButton
              label="Sort"
              variant="ghost"
              icon={<SortIcon className="size-5 text-primary" />}
            />
          }
        />
      </MotionItem>

      <MotionItem as="header">
        <h2 className="text-section font-semibold tracking-tight text-foreground">
          Transactions
        </h2>
      </MotionItem>

      <MotionItem>
        <HistoryView transactions={mockTransactions} />
      </MotionItem>
    </MotionSection>
  );
}
