import type { Variants, Transition } from "framer-motion";

/**
 * Single source of truth for all Framer Motion variants used across SolPay.
 * Per the audit's animation step:
 *  - Entrance: blur-slide-up (premium fintech feel — never plain opacity fade)
 *  - Hover/tap: spring-driven, no opacity-only changes
 *  - Reduced motion fallback handled at the consumer site via `useReducedMotion`
 *
 * NOTE: timings here are exactly the values from the spec; do not nudge.
 */

const ENTRANCE_DURATION = 0.7;
const ENTRANCE_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const STAGGER_PER_INDEX = 0.09;

/** Premium blur-slide-up entrance for any section/card/heading. */
export const entranceBlurUp: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 28 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE },
  },
};

/**
 * Reduced-motion fallback — keeps duration but drops blur/transform.
 * Consumers swap variants when `useReducedMotion()` returns true.
 */
export const entranceReducedMotion: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE },
  },
};

/** Stagger container for lists/grids. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER_PER_INDEX,
      delayChildren: 0.05,
    },
  },
};

/** Spring tuned for cards: subtle lift + scale. */
export const cardHoverSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 22,
};

export const cardHover = { y: -7, scale: 1.018 };
export const cardInnerHover = { y: -3, transition: { delay: 0.15 } };

/** Spring tuned for buttons: snappier than card hover. */
export const buttonHoverSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

export const buttonHover = { scale: 1.05 };
export const buttonTap = { scale: 0.97 };

/**
 * AnimatePresence variants for modals/sheets — entering with scale+blur and
 * exiting with slight upward slide so toggle direction is felt.
 */
export const overlayPresence: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)", y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
    y: -6,
    transition: { duration: 0.2 },
  },
};

export const overlayBackdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
