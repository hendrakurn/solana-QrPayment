"use client";

import Link from "next/link";
import { useState } from "react";
import { ScannerFrame } from "@/components/scanner/scanner-frame";
import { Sheet } from "@/components/ui/sheet";
import {
  CloseIcon,
  FlashIcon,
  UploadIcon,
  HelpIcon,
  SparklesIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export default function ScanPage() {
  const [flash, setFlash] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background text-foreground select-none">
      {/* Camera-feed simulation: layered radial + soft hue suggests live preview */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(255,255,255,0.06), transparent 70%), radial-gradient(50% 40% at 80% 20%, rgba(238,159,10,0.08), transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(82,32,216,0.08), transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      {/* Top action bar — just close, glassy */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-edge pt-[calc(env(safe-area-inset-top)+16px)]">
        <Link
          href="/"
          aria-label="Tutup pemindai"
          className="size-12 inline-flex items-center justify-center rounded-pill border border-white/15 bg-surface-3/60 backdrop-blur-md text-foreground hover:bg-surface-3/80 cursor-pointer shadow-lg active:scale-95 transition-transform"
        >
          <CloseIcon />
        </Link>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="Bantuan pemindaian"
          className="size-12 inline-flex items-center justify-center rounded-pill border border-white/15 bg-surface-3/60 backdrop-blur-md text-foreground hover:bg-surface-3/80 cursor-pointer shadow-lg active:scale-95 transition-transform"
        >
          <HelpIcon />
        </button>
      </div>

      {/* Scanner overlay — frame and guidance, centered */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <ScannerFrame />

        <div className="mt-12 flex flex-col items-center gap-3 pointer-events-auto z-20 text-center">
          <h1 className="text-display font-semibold tracking-tight text-foreground">
            Scan QRIS to Pay
          </h1>
          <span className="rounded-pill border border-white/15 bg-surface-3/50 backdrop-blur-sm px-4 py-1.5 text-body-sm text-primary">
            Tempatkan kode di dalam bingkai
          </span>
        </div>
      </div>

      {/* Bottom action panel */}
      <div className="absolute inset-x-0 bottom-0 z-30 pt-12 pb-[calc(env(safe-area-inset-bottom)+32px)] px-edge bg-gradient-to-t from-background via-background/85 to-transparent">
        <div className="flex justify-center gap-12">
          <ActionCircle
            label="Unggah QR"
            icon={<UploadIcon className="size-7" />}
            onClick={() => {}}
          />
          <ActionCircle
            label={flash ? "Matikan Flash" : "Flash"}
            icon={<FlashIcon className="size-7" />}
            onClick={() => setFlash((f) => !f)}
            active={flash}
          />
        </div>

        <Link
          href="/pay/confirm"
          className="mt-8 inline-flex h-tap w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-body font-semibold text-white shadow-[var(--shadow-glow-soft)] hover:bg-primary-soft active:bg-primary-deep cursor-pointer transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <SparklesIcon className="size-4" />
          Simulasi: tampilkan QRIS terdeteksi
        </Link>
      </div>

      <Sheet open={helpOpen} onClose={() => setHelpOpen(false)} title="Tips pemindaian">
        <ul className="space-y-3 text-body-sm text-foreground-muted">
          <li className="flex gap-3">
            <span className="size-6 mt-0.5 inline-flex items-center justify-center rounded-pill bg-primary/15 text-primary text-caption font-semibold">
              1
            </span>
            <p>Pastikan QR berada di dalam bingkai dan tidak buram.</p>
          </li>
          <li className="flex gap-3">
            <span className="size-6 mt-0.5 inline-flex items-center justify-center rounded-pill bg-primary/15 text-primary text-caption font-semibold">
              2
            </span>
            <p>Aktifkan flash bila pencahayaan kurang.</p>
          </li>
          <li className="flex gap-3">
            <span className="size-6 mt-0.5 inline-flex items-center justify-center rounded-pill bg-primary/15 text-primary text-caption font-semibold">
              3
            </span>
            <p>Untuk QRIS dinamis, tunggu sampai kasir menampilkan kode.</p>
          </li>
        </ul>
      </Sheet>
    </div>
  );
}

function ActionCircle({
  label,
  icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
    >
      <span
        className={cn(
          "inline-flex size-16 items-center justify-center rounded-pill border backdrop-blur-md shadow-lg transition-colors",
          active
            ? "bg-accent-yellow text-background border-accent-yellow"
            : "bg-surface-3/80 border-white/15 text-primary group-hover:bg-surface-3",
        )}
      >
        {icon}
      </span>
      <span className="text-caption text-foreground-muted group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
}
