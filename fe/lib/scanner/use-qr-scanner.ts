"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export type ScannerStatus =
  | "idle"
  | "requesting"
  | "scanning"
  | "detected"
  | "error";

export interface ScannerError {
  kind: "permission" | "no-camera" | "unsupported" | "unknown";
  message: string;
}

interface Options {
  /** Called with the decoded QR payload. Returning false keeps scanning. */
  onDecode: (payload: string) => boolean | void;
  enabled?: boolean;
}

/**
 * Wires a <video> element to the user's rear camera and runs jsQR on each
 * animation frame. The hook owns the MediaStream lifecycle so callers only
 * mount the returned ref and read state. Stream is fully released on unmount
 * or when `enabled` flips to false.
 */
export function useQrScanner({ onDecode, enabled = true }: Options) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onDecodeRef = useRef(onDecode);
  const restartTickRef = useRef(0);
  const [restartTick, setRestartTick] = useState(0);

  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [error, setError] = useState<ScannerError | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    let rafId: number | null = null;
    let stream: MediaStream | null = null;

    const cleanup = () => {
      stopped = true;
      if (rafId != null) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const video = videoRef.current;
      if (video) video.srcObject = null;
    };

    const tick = () => {
      if (stopped) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Downscale to ~480px on the long edge — jsQR is CPU-bound and
      // full HD frames eat ~30ms per scan on mid-range phones.
      const target = 480;
      const scale = Math.min(1, target / Math.max(w, h));
      const cw = Math.round(w * scale);
      const ch = Math.round(h * scale);
      if (canvas.width !== cw) canvas.width = cw;
      if (canvas.height !== ch) canvas.height = ch;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      ctx.drawImage(video, 0, 0, cw, ch);
      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, cw, ch);
      } catch {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const code = jsQR(imageData.data, cw, ch, {
        inversionAttempts: "dontInvert",
      });
      if (code && code.data) {
        const consumed = onDecodeRef.current(code.data);
        if (consumed !== false) {
          setStatus("detected");
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const run = async () => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setStatus("error");
        setError({
          kind: "unsupported",
          message: "This browser does not support camera access.",
        });
        return;
      }
      setStatus("requesting");
      setError(null);
      setTorchOn(false);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (stopped) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const track = stream.getVideoTracks()[0];
        const caps =
          (track && "getCapabilities" in track
            ? (track.getCapabilities() as MediaTrackCapabilities & {
                torch?: boolean;
              })
            : undefined) || {};
        setTorchSupported(Boolean(caps.torch));

        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.muted = true;
        try {
          await video.play();
        } catch {
          // Autoplay can reject if the user navigated away mid-request; the
          // unmount path will clean up regardless.
        }
        if (stopped) return;
        setStatus("scanning");
        rafId = requestAnimationFrame(tick);
      } catch (err) {
        if (stopped) return;
        const e = err as DOMException;
        if (
          e?.name === "NotAllowedError" ||
          e?.name === "SecurityError" ||
          e?.name === "PermissionDeniedError"
        ) {
          setError({
            kind: "permission",
            message:
              "Camera access denied. Enable camera permission in browser settings and try again.",
          });
        } else if (
          e?.name === "NotFoundError" ||
          e?.name === "OverconstrainedError"
        ) {
          setError({
            kind: "no-camera",
            message: "No rear camera found on this device.",
          });
        } else {
          setError({
            kind: "unknown",
            message: e?.message || "Failed to start camera.",
          });
        }
        setStatus("error");
      }
    };

    void run();
    return cleanup;
  }, [enabled, restartTick]);

  const setTorch = useCallback(async (on: boolean) => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({
        advanced: [
          { torch: on } as MediaTrackConstraintSet & { torch: boolean },
        ],
      });
      setTorchOn(on);
    } catch {
      setTorchSupported(false);
    }
  }, []);

  const decodeImageFile = useCallback(async (file: File): Promise<boolean> => {
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) return false;
    const off =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(bitmap.width, bitmap.height)
        : null;
    const canvas =
      off ||
      Object.assign(document.createElement("canvas"), {
        width: bitmap.width,
        height: bitmap.height,
      });
    const ctx = canvas.getContext("2d") as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null;
    if (!ctx) return false;
    ctx.drawImage(bitmap, 0, 0);
    const data = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    const code = jsQR(data.data, data.width, data.height);
    if (code && code.data) {
      onDecodeRef.current(code.data);
      return true;
    }
    return false;
  }, []);

  const restart = useCallback(() => {
    restartTickRef.current += 1;
    setRestartTick(restartTickRef.current);
  }, []);

  return {
    videoRef,
    canvasRef,
    status,
    error,
    torchSupported,
    torchOn,
    setTorch,
    decodeImageFile,
    restart,
  };
}
