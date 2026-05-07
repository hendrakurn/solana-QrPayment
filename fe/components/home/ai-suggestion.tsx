import { SparklesIcon, ArrowUpRightIcon } from "@/components/icons";

export interface AiSuggestionProps {
  title: string;
  body: string;
  cta?: string;
}

export function AiSuggestion({ title, body, cta = "Tinjau saran" }: AiSuggestionProps) {
  return (
    <article
      className="relative overflow-hidden rounded-xl border border-accent-purple/30 bg-gradient-to-br from-accent-purple/15 via-surface to-surface p-4"
      role="region"
      aria-label="Saran AI"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-accent-purple/25 blur-3xl"
      />
      <div className="relative flex items-start gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-pill bg-accent-purple/30 text-[#cdbcff] shrink-0">
          <SparklesIcon className="size-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-caption font-medium uppercase tracking-[0.16em] text-[#cdbcff]">
              SolPay AI
            </span>
            <span className="size-1 rounded-pill bg-foreground-subtle" />
            <span className="text-caption text-foreground-subtle">untukmu</span>
          </div>
          <h3 className="mt-1 text-body font-semibold leading-5 text-foreground">{title}</h3>
          <p className="mt-1 text-body-sm leading-5 text-foreground-muted">{body}</p>
        </div>
      </div>
      <button
        type="button"
        className="relative mt-3 inline-flex items-center gap-1 rounded-pill bg-white/8 px-3 py-1.5 text-caption font-medium text-foreground hover:bg-white/14 cursor-pointer transition-colors"
      >
        {cta}
        <ArrowUpRightIcon className="size-3.5" />
      </button>
    </article>
  );
}
