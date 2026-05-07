import { cn } from "@/lib/utils";

/**
 * Camera viewfinder for QRIS scanning. The dim overlay is created with a
 * very wide outer shadow on the frame itself (Stitch Scanner V2 trick),
 * eliminating the need for a separate masking element. Glowing brackets
 * and a scanning laser provide the visual rhythm.
 */
export function ScannerFrame({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative size-72 rounded-xl border border-primary/30",
        "shadow-[0_0_0_4000px_rgba(0,9,21,0.85),0_0_30px_0_rgba(0,136,255,0.25)]",
        className,
      )}
    >
      {/* Glowing corner accents */}
      <Bracket position="tl" />
      <Bracket position="tr" />
      <Bracket position="bl" />
      <Bracket position="br" />

      {/* Scanning laser */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 mx-3 h-[2px] -translate-y-px bg-primary opacity-90 shadow-[0_0_12px_3px_rgba(0,136,255,0.6)] animate-scan-line"
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
        "absolute size-10 border-primary shadow-[0_0_15px_rgba(0,136,255,0.5)]",
        positions[position],
      )}
    />
  );
}
