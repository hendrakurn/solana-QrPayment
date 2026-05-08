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
  // Latches the first decode so the rAF loop doesn't double-fire navigation.
  const navigatedRef = useRef(false);

  const handleDecode = useCallback(
    (payload: string) => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      const draft = parseQrisPayload(payload);
      setDraft(draft);
      // Tiny delay so users see the "detected" pulse before route change.
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
      setUploadError("QR pada gambar tidak bisa dibaca. Coba foto yang lebih jelas.");
    }
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background text-foreground select-none">
      {/* Live camera feed */}
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
      {/* Off-DOM canvas used by the decode loop */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Subtle dark vignette so the overlay UI stays readable on bright frames */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60"
      />

      {/* Camera placeholder while permission is pending or unavailable */}
      {status !== "scanning" && status !== "detected" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, rgba(255,255,255,0.06), transparent 70%), radial-gradient(50% 40% at 80% 20%, rgba(238,159,10,0.08), transparent 70%), radial-gradient(50% 40% at 20% 80%, rgba(82,32,216,0.08), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* Top action bar */}
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
        <ScannerFrame
          className={cn(
            "transition-colors duration-300",
            detected && "border-success/80",
          )}
        />

        <div className="mt-12 flex flex-col items-center gap-3 pointer-events-auto z-20 text-center">
          <h1 className="text-display font-semibold tracking-tight text-foreground">
            {detected ? "QR Terdeteksi" : "Scan QRIS to Pay"}
          </h1>
          <span
            className={cn(
              "rounded-pill border px-4 py-1.5 text-body-sm backdrop-blur-sm",
              detected
                ? "border-success/40 bg-success/15 text-success"
                : status === "requesting"
                  ? "border-white/15 bg-surface-3/50 text-foreground-muted"
                  : "border-white/15 bg-surface-3/50 text-primary",
            )}
          >
            {detected
              ? "Memuat detail pembayaran…"
              : status === "requesting"
                ? "Menyalakan kamera…"
                : "Tempatkan kode di dalam bingkai"}
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
                <h2 className="text-body font-semibold text-foreground">
                  Tidak bisa membuka kamera
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
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-pill bg-primary px-4 text-body-sm font-semibold text-white hover:bg-primary-soft cursor-pointer transition-colors"
                  >
                    <RefreshIcon className="size-4" />
                    Coba lagi
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-pill border border-border-strong bg-surface px-4 text-body-sm font-semibold text-foreground hover:bg-surface-3 cursor-pointer transition-colors"
                  >
                    <UploadIcon className="size-4" />
                    Unggah QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom action panel */}
      <div className="absolute inset-x-0 bottom-0 z-30 pt-12 pb-[calc(env(safe-area-inset-bottom)+32px)] px-edge bg-gradient-to-t from-background via-background/85 to-transparent">
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
            label="Unggah QR"
            icon={<UploadIcon className="size-7" />}
            onClick={() => fileInputRef.current?.click()}
          />
          <ActionCircle
            label={torchOn ? "Matikan Flash" : "Flash"}
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
            ? "Pemindaian otomatis · arahkan ke kode QRIS"
            : "Pemindaian otomatis · flash tidak tersedia di perangkat ini"}
        </p>
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
          <li className="flex gap-3">
            <span className="size-6 mt-0.5 inline-flex items-center justify-center rounded-pill bg-primary/15 text-primary text-caption font-semibold">
              4
            </span>
            <p>Tidak bisa scan langsung? Gunakan tombol &quot;Unggah QR&quot; untuk memilih foto QR dari galeri.</p>
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
