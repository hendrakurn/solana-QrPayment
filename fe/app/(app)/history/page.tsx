import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { HistoryView } from "@/components/transactions/history-view";
import { SortIcon, SparklesIcon } from "@/components/icons";
import { mockUser } from "@/data/user";
import { mockTransactions } from "@/data/transactions";
import { formatRupiah } from "@/lib/format";

export default function HistoryPage() {
  const total = mockTransactions
    .filter((t) => t.status === "success")
    .reduce((s, t) => s + t.amountIdr, 0);

  const successCount = mockTransactions.filter((t) => t.status === "success").length;

  return (
    <div className="flex flex-col gap-6">
      <TopBar
        showWordmark
        leading={
          <Link href="/settings" aria-label="Buka pengaturan">
            <Avatar initials={mockUser.avatarSeed} />
          </Link>
        }
        trailing={
          <IconButton
            label="Urutkan"
            variant="ghost"
            icon={<SortIcon className="size-5 text-primary" />}
          />
        }
      />

      <header className="flex flex-col gap-1">
        <h2 className="text-section font-semibold tracking-tight text-foreground">
          Transaksi
        </h2>
        <p className="text-body-sm text-foreground-muted">
          {successCount} pembayaran sukses · {formatRupiah(total)} bulan ini
        </p>
      </header>

      <article className="rounded-xl border border-accent-purple/30 bg-gradient-to-br from-accent-purple/12 via-surface to-surface p-3.5 flex items-start gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-[#cdbcff] shrink-0">
          <SparklesIcon className="size-5" />
        </span>
        <p className="text-body-sm leading-5 text-foreground-muted">
          <span className="text-foreground font-semibold">Insight AI:</span> kategori{" "}
          <span className="text-foreground">Food &amp; Drinks</span> menyumbang
          45% pengeluaranmu pekan ini · 98% sukses.
        </p>
      </article>

      <HistoryView transactions={mockTransactions} />
    </div>
  );
}
