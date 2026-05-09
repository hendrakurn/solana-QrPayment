import { TopBar } from "@/components/layout/top-bar";
import { Avatar } from "@/components/layout/avatar";
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
        <TopBar back="/" title="Settings" />
      </MotionItem>

      {/* Profile hero */}
      <MotionItem
        as="article"
        className="flex items-center gap-4 py-2"
      >
        <Avatar initials={mockUser.avatarSeed} size={52} />
        <div className="flex-1 min-w-0">
          <p className="text-body font-semibold text-foreground truncate">{mockUser.name}</p>
          <p className="text-caption text-foreground-subtle truncate">{mockUser.email}</p>
        </div>
      </MotionItem>

      <MotionItem><Section title="Profile">
        <SettingsRow
          icon={<UserIcon className="size-5" />}
          label="Display name"
          value={mockUser.name}
        />
        <SettingsRow
          icon={<MailIcon className="size-5" />}
          label="Email"
          value={mockUser.email}
        />
      </Section></MotionItem>

      <MotionItem><Section title="Region">
        <SettingsRow
          icon={<GlobeIcon className="size-5" />}
          label="Country"
          value={mockUser.country}
        />
        <SettingsRow
          icon={<ClockIcon className="size-5" />}
          label="Timezone"
          value={mockUser.timezone}
        />
      </Section></MotionItem>

      <MotionItem><Section title="Security & AI">
        <SettingsRow
          icon={<LockIcon className="size-5" />}
          label="Biometric lock"
          description="Active · Face ID"
        />
        <SettingsRow
          icon={<ShieldCheckIcon className="size-5" />}
          label="AI Fraud Detection"
          description="Monitors unusual transaction patterns"
        />
        <SettingsRow
          icon={<SparklesIcon className="size-5" />}
          label="AI suggestions on home"
          description="Show rate & wallet recommendations"
        />
      </Section></MotionItem>

      <MotionItem><Section title="Help">
        <SettingsRow
          icon={<HelpIcon className="size-5" />}
          label="Tips & FAQ"
          description="Quick guide to SolPay features"
        />
        <SettingsRow
          icon={<MailIcon className="size-5" />}
          label="Contact support"
          description="Average response < 1 minute"
        />
      </Section></MotionItem>

      <MotionItem
        as="button"
        type="button"
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/8 text-body font-semibold text-danger hover:bg-danger/14 cursor-pointer transition-colors"
      >
        <LogOutIcon className="size-5" />
        Sign out of SolPay
      </MotionItem>

      <MotionItem
        as="p"
        className="text-center text-caption text-foreground-subtle pt-2 pb-4"
      >
        SolPay v0.2.0 · built for the Indonesian market
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
