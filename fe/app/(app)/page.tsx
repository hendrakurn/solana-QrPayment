import { TopBar } from "@/components/layout/top-bar";
import { TopBarLeading } from "@/components/layout/top-bar-leading";
import { BalanceCardLive } from "@/components/home/balance-card-live";
import { TapToPay } from "@/components/home/tap-to-pay";
import { RecentTransactions } from "@/components/home/recent-transactions";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";

export default function HomePage() {
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

      <MotionItem>
        <RecentTransactions />
      </MotionItem>
    </MotionSection>
  );
}
