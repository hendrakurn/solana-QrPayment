"use client";

import { useEffect, useRef } from "react";
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Remember the trigger element so we can return focus on close.
    previouslyFocused.current = document.activeElement as HTMLElement;

    // Move focus into the dialog on open.
    const dialog = dialogRef.current;
    requestAnimationFrame(() => {
      const focusables = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusables?.[0]?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Trap Tab inside the dialog.
      if (e.key === "Tab" && dialog) {
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // Return focus to the element that opened the sheet.
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Tutup"
            tabIndex={-1}
            onClick={onClose}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={overlayBackdrop}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            ref={dialogRef}
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
                    <span
                      aria-hidden
                      className="block sm:hidden mx-auto h-1 w-10 rounded-pill bg-white/15 mb-3"
                    />
                    <h3 className="text-body font-semibold text-foreground">{title}</h3>
                  </>
                ) : (
                  <span
                    aria-hidden
                    className="block sm:hidden mx-auto h-1 w-10 rounded-pill bg-white/15"
                  />
                )}
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={onClose}
                className="size-11 inline-flex items-center justify-center rounded-pill hover:bg-white/5 cursor-pointer text-foreground-muted hover:text-foreground"
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
