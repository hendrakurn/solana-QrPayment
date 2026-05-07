"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons";
import {
  overlayBackdrop,
  overlayPresence,
} from "@/components/motion/motion-tokens";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={overlayBackdrop}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={reduce ? overlayBackdrop : overlayPresence}
            className={cn(
              "relative w-full max-w-canvas bg-surface-2 border border-border rounded-t-2xl sm:rounded-2xl shadow-[var(--shadow-card-strong)]",
              className,
            )}
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex-1">
                {title ? (
                  <>
                    <span className="block sm:hidden mx-auto h-1 w-10 rounded-pill bg-white/15 mb-3" />
                    <h3 className="text-body font-semibold text-foreground">{title}</h3>
                  </>
                ) : (
                  <span className="block sm:hidden mx-auto h-1 w-10 rounded-pill bg-white/15" />
                )}
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={onClose}
                className="size-9 inline-flex items-center justify-center rounded-pill hover:bg-white/5 cursor-pointer text-foreground-muted hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="px-5 pb-6 max-h-[calc(80vh-80px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
