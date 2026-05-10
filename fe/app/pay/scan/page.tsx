"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { ScannerFrame } from "@/components/scanner/scanner-frame";
import { Sheet } from "@/components/ui/sheet";
import {
  CloseIcon,
  FlashIcon,
  UploadIcon,
  HelpIcon,
  AlertIcon,
  RefreshIcon,
} from "@/components/icons";
import { usePaymentDraft } from "@/lib/payment/draft-store";
import { useQrScanner } from "@/lib/scanner/use-qr-scanner";
import { parseQrisPayload } from "@/lib/scanner/parse-qris";
import { cn } from "@/lib/utils";

export default function ScanPage() {
  const router = useRouter();
  const setDraft = usePaymentDraft((s) => s.setDraft);
  const [helpOpen, setHelpOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigatedRef = useRef(false);

  const handleDecode = useCallback(
    (payload: string) => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      const draft = parseQrisPayload(payload);
      setDraft(draft);
      setTimeout(() => router.push("/pay/confirm"), 220);
    },
    [router, setDraft],
  );

  const {
    videoRef,
    canvasRef,
    status,
    error,
    torchSupported,
    torchOn,
    setTorch,
    decodeImageFile,
    restart,
  } = useQrScanner({ onDecode: handleDecode });

  const detected = status === "detected";

  async function handleUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ok = await decodeImageFile(file);
    if (!ok) {
      setUploadError("QR code in image could not be read. Try a clearer photo.");
    }
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden text-foreground select-none">

      {/* ── Live camera feed (body gradient shows as base when inactive) ── */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
          status === "scanning" || detected ? "opacity-100" : "opacity-0",
        )}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Vignette so overlay text stays readable over camera */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50"
      />

      {/* Top action bar */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-10 pt-[calc(env(safe-area-inset-top)+24px)]">
        <Link
          href="/"
          aria-label="Close scanner"
          className="size-12 inline-flex items-center justify-center rounded-pill border border-white/20 bg-background/40 backdrop-blur-md text-foreground hover:border-white/35 cursor-pointer shadow-lg active:scale-95 transition-transform"
        >
          <CloseIcon />
        </Link>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          aria-label="Scanning help"
          className="size-12 inline-flex items-center justify-center rounded-pill border border-accent-yellow/40 bg-background/40 backdrop-blur-md text-accent-yellow hover:border-accent-yellow/60 cursor-pointer shadow-lg active:scale-95 transition-transform"
        >
          <HelpIcon />
        </button>
      </div>

      {/* Scanner overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <ScannerFrame
          className={cn(
            "transition-colors duration-300",
            detected && "border-success/80",
          )}
        />

        <div className="mt-12 flex flex-col items-center gap-3 pointer-events-auto z-20 text-center">
          <h1 className="text-display font-semibold tracking-tight text-accent-yellow">
            {detected ? "QR Detected" : "Scan QRIS to Pay"}
          </h1>
          <span
            className={cn(
              "rounded-pill border px-4 py-1.5 text-body-sm backdrop-blur-sm",
              detected
                ? "border-success/40 bg-success/15 text-success"
                : status === "requesting"
                  ? "border-white/15 bg-background/40 text-foreground-muted"
                  : "border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow",
            )}
          >
            {detected
              ? "Loading payment details…"
              : status === "requesting"
                ? "Starting camera…"
                : "Place the code inside the frame"}
          </span>
        </div>
      </div>

      {/* Permission / hardware error overlay */}
      {status === "error" && error && (
        <div className="absolute inset-x-0 top-1/2 z-40 -translate-y-1/2 px-edge">
          <div className="mx-auto max-w-canvas-inner rounded-xl border border-danger/40 bg-surface-2/95 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-pill bg-danger/20 text-danger">
                <AlertIcon className="size-5" />
              </span>
              <div className="flex-1">
                <h2 className="text-body font-semibold text-accent-yellow">
                  Cannot open camera
                </h2>
                <p className="mt-1 text-body-sm text-foreground-muted">
                  {error.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigatedRef.current = false;
                      void restart();
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-pill bg-gradient-to-r from-accent-purple to-accent-yellow px-4 text-body-sm font-semibold text-white hover:brightness-110 cursor-pointer transition-all"
                  >
                    <RefreshIcon className="size-4" />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-pill border border-accent-yellow/40 bg-accent-yellow/10 px-4 text-body-sm font-semibold text-accent-yellow hover:bg-accent-yellow/20 cursor-pointer transition-colors"
                  >
                    <UploadIcon className="size-4" />
                    Upload QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom action panel */}
      <div className="absolute inset-x-0 bottom-0 z-30 pt-12 pb-[calc(env(safe-area-inset-bottom)+32px)] px-edge bg-gradient-to-t from-background/90 via-background/50 to-transparent">
        {uploadError && (
          <div
            role="alert"
            className="mx-auto mb-4 max-w-canvas-inner rounded-xl border border-warning/40 bg-warning/10 p-3 text-body-sm text-warning"
          >
            {uploadError}
          </div>
        )}

        <div className="flex justify-center gap-12">
          <ActionCircle
            label="Upload QR"
            icon={<UploadIcon className="size-7" />}
            onClick={() => fileInputRef.current?.click()}
          />
          <ActionCircle
            label={torchOn ? "Flash Off" : "Flash"}
            icon={<FlashIcon className="size-7" />}
            onClick={() => setTorch(!torchOn)}
            active={torchOn}
            disabled={!torchSupported}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadChange}
        />

        <p className="mt-8 text-center text-caption text-foreground-subtle">
          {torchSupported
            ? "Auto scanning · point at a QRIS code"
            : "Auto scanning · flash not available on this device"}
        </p>
      </div>

      <Sheet open={helpOpen} onClose={() => setHelpOpen(false)} title="Scanning tips">
        <ul className="space-y-3 text-body-sm text-foreground-muted">
          {[
            "Make sure the QR is inside the frame and not blurry.",
            "Enable flash if the lighting is poor.",
            "For dynamic QRIS, wait until the cashier displays the code.",
            "Can't scan directly? Use the \"Upload QR\" button to pick a QR photo from your gallery.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="size-6 mt-0.5 inline-flex shrink-0 items-center justify-center rounded-pill bg-accent-yellow/15 text-accent-yellow text-caption font-semibold">
                {i + 1}
              </span>
              <p>{tip}</p>
            </li>
          ))}
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
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex flex-col items-center gap-2 transition-transform",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer active:scale-95",
      )}
    >
      <span
        className={cn(
          "inline-flex size-16 items-center justify-center rounded-pill border backdrop-blur-md shadow-lg transition-colors",
          active
            ? "bg-accent-yellow text-background border-accent-yellow"
            : "bg-background/40 border-accent-yellow/35 text-accent-yellow group-hover:border-accent-yellow/55 group-hover:bg-background/55",
        )}
      >
        {icon}
      </span>
      <span className="text-caption text-foreground-muted group-hover:text-accent-yellow transition-colors">
        {label}
      </span>
    </button>
  );
}
