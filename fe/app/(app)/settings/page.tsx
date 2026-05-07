import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
import { Badge } from "@/components/ui/badge";
import { SettingsRow } from "@/components/settings/settings-row";
import { MotionSection, MotionItem } from "@/components/motion/motion-section";
import {
  MailIcon,
  UserIcon,
  GlobeIcon,
  ClockIcon,
  HelpIcon,
  ShieldCheckIcon,
  LockIcon,
  LogOutIcon,
  SparklesIcon,
} from "@/components/icons";
import { mockUser } from "@/data/user";

export default function SettingsPage() {
  return (
    <MotionSection stagger immediate className="flex flex-col gap-6">
      <MotionItem>
        <TopBar back="/" title="Pengaturan" />
      </MotionItem>

      {/* Profile hero card */}
      <MotionItem
        as="article"
        className="rounded-xl border border-border-strong bg-gradient-to-b from-surface-3 to-surface-2 p-5 flex items-center gap-4 shadow-[var(--shadow-card)]"
      >
        <Avatar initials={mockUser.avatarSeed} size={56} />
        <div className="flex-1 min-w-0">
          <p className="text-body font-semibold text-foreground truncate">{mockUser.name}</p>
          <p className="text-caption text-foreground-subtle truncate">{mockUser.email}</p>
        </div>
        <Badge tone="success">KYC Lv. 2</Badge>
      </MotionItem>

      <MotionItem><Section title="Profil">
        <SettingsRow
          icon={<UserIcon className="size-5" />}
          label="Nama tampilan"
          value={mockUser.name}
        />
        <SettingsRow
          icon={<MailIcon className="size-5" />}
          label="Email"
          value={mockUser.email}
        />
      </Section></MotionItem>

      <MotionItem><Section title="Wilayah">
        <SettingsRow
          icon={<GlobeIcon className="size-5" />}
          label="Negara"
          value={mockUser.country}
        />
        <SettingsRow
          icon={<ClockIcon className="size-5" />}
          label="Zona waktu"
          value={mockUser.timezone}
        />
      </Section></MotionItem>

      <MotionItem><Section title="Keamanan & AI">
        <SettingsRow
          icon={<LockIcon className="size-5" />}
          label="Kunci dengan biometrik"
          description="Aktif · Face ID"
        />
        <SettingsRow
          icon={<ShieldCheckIcon className="size-5" />}
          label="AI Fraud Detection"
          description="Memantau pola transaksi tidak biasa"
        />
        <SettingsRow
          icon={<SparklesIcon className="size-5" />}
          label="Saran AI di beranda"
          description="Tampilkan rekomendasi rate & wallet"
        />
      </Section></MotionItem>

      <MotionItem><Section title="Bantuan">
        <SettingsRow
          icon={<HelpIcon className="size-5" />}
          label="Tips & FAQ"
          description="Panduan singkat fitur SolPay"
        />
        <SettingsRow
          icon={<MailIcon className="size-5" />}
          label="Hubungi support"
          description="Rata-rata respons < 1 menit"
        />
      </Section></MotionItem>

      <MotionItem
        as="button"
        type="button"
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/8 text-body font-semibold text-danger hover:bg-danger/14 cursor-pointer transition-colors"
      >
        <LogOutIcon className="size-5" />
        Keluar dari SolPay
      </MotionItem>

      <MotionItem
        as="p"
        className="text-center text-caption text-foreground-subtle pt-2 pb-4"
      >
        SolPay v0.2.0 · dibangun untuk pasar Indonesia
      </MotionItem>
    </MotionSection>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="px-1 pb-2 text-caption font-semibold uppercase tracking-[0.16em] text-foreground-muted">
        {title}
      </h2>
      <div className="rounded-xl border border-border-strong/60 bg-surface overflow-hidden divide-y divide-border-strong/40">
        {children}
      </div>
    </section>
  );
}
