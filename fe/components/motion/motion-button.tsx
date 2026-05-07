"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { buttonHover, buttonHoverSpring, buttonTap } from "./motion-tokens";

/**
 * A drop-in replacement for `<button>` that adds the SolPay press spring
 * (whileHover scale:1.05 / whileTap scale:0.97). Used by the existing Button,
 * IconButton, and any inline CTAs that need consistent press feedback.
 *
 * Reduced-motion users get no transform; the button still acts on press.
 */
export type MotionButtonProps = HTMLMotionProps<"button"> & {
  type?: "button" | "submit" | "reset";
};

export function MotionButton(props: MotionButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={props.type ?? "button"}
      whileHover={reduce ? undefined : buttonHover}
      whileTap={reduce ? undefined : buttonTap}
      transition={buttonHoverSpring}
      {...props}
    />
  );
}

/** Same but for `<a>` elements (Link uses motion.a via custom). */
export function MotionAnchor(props: HTMLMotionProps<"a">) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      whileHover={reduce ? undefined : buttonHover}
      whileTap={reduce ? undefined : buttonTap}
      transition={buttonHoverSpring}
      {...props}
    />
  );
}
