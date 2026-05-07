"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRightIcon, LockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Slide-to-pay control for confirming a sensitive action.
 *
 * IMPORTANT: This is one of the strongest UX elements in the app. The pointer-
 * driven gesture, the >92% threshold commit, the confirmed lockout, and
 * keyboard fallback are all preserved. Only the visual styling is refreshed
 * here to align with the Stitch dark-fintech aesthetic (gradient track, glow,
 * rounded-xl shape).
 */
export function SlideToPay({
  label = "Geser untuk bayar",
  confirmedLabel = "Memproses…",
  onConfirm,
  disabled,
}: {
  label?: string;
  confirmedLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const startX = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (confirmed) return;
    setProgress(0);
  }, [confirmed]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || confirmed) return;
    startX.current = e.clientX - progress;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null || confirmed) return;
    const track = trackRef.current;
    if (!track) return;
    const max = track.clientWidth - 56;
    const next = Math.max(0, Math.min(max, e.clientX - startX.current));
    setProgress(next);
  };

  const onPointerUp = () => {
    const track = trackRef.current;
    startX.current = null;
    if (!track) return;
    const max = track.clientWidth - 56;
    if (progress > max * 0.92) {
      setProgress(max);
      setConfirmed(true);
      onConfirm();
    } else {
      reset();
    }
  };

  useEffect(() => {
    if (confirmed) return;
    const onUp = () => reset();
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [confirmed, reset]);

  const onKey = (e: React.KeyboardEvent) => {
    if (disabled || confirmed) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setConfirmed(true);
      onConfirm();
    }
  };

  return (
    <div
      ref={trackRef}
      role="button"
      aria-label={label}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKey}
      className={cn(
        "relative h-tap w-full select-none rounded-xl overflow-hidden",
        "border bg-surface-3 shadow-[var(--shadow-glow-soft)]",
        disabled
          ? "border-border-strong/60 opacity-60"
          : "border-primary/40 cursor-grab active:cursor-grabbing",
      )}
    >
      {/* Filled progress with gradient — visually communicates how far user has slid */}
      <div
        aria-hidden
        style={{ width: progress + 56 }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-deep via-primary to-primary-soft transition-[width] duration-100"
      />

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-body font-semibold tracking-tight text-foreground">
        {confirmed ? null : <LockIcon className="size-4 text-foreground" />}
        {confirmed ? confirmedLabel : label}
      </div>

      {/* Sliding thumb */}
      <div
        aria-hidden
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ transform: `translateX(${progress}px)` }}
        className="absolute top-1 left-1 z-10 flex size-12 items-center justify-center rounded-pill bg-white text-primary shadow-[0_4px_18px_rgba(0,0,0,0.45)] cursor-grab active:cursor-grabbing"
      >
        {confirmed ? (
          <span className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin-soft" />
        ) : (
          <ChevronRightIcon className="size-5" />
        )}
      </div>
    </div>
  );
}
