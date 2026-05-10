import { cn } from "@/lib/utils";

export function ScannerFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative size-72 rounded-xl border border-accent-yellow/40",
        "shadow-[var(--shadow-scanner-mask)]",
        className,
      )}
    >
      <Bracket position="tl" />
      <Bracket position="tr" />
      <Bracket position="bl" />
      <Bracket position="br" />

      {/* Scanning laser */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 mx-3 h-[2px] -translate-y-px bg-accent-yellow opacity-90 shadow-[var(--shadow-scanner-laser)] animate-scan-line"
      />
    </div>
  );
}

const positions = {
  tl: "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl -mt-[2px] -ml-[2px]",
  tr: "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl -mt-[2px] -mr-[2px]",
  bl: "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl -mb-[2px] -ml-[2px]",
  br: "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl -mb-[2px] -mr-[2px]",
} as const;

function Bracket({ position }: { position: keyof typeof positions }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute size-10 border-accent-yellow shadow-[var(--shadow-scanner-corner)]",
        positions[position],
      )}
    />
  );
}
