"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { entranceBlurUp, entranceReducedMotion, staggerContainer } from "./motion-tokens";

/**
 * Wraps any block in the SolPay entrance variant. Pass `stagger` to make
 * children inherit the stagger timing — direct child motion components will
 * pick up the variant via `variants={...}` propagation.
 *
 * IntersectionObserver via `whileInView` triggers at the spec's 10% threshold.
 */
export interface MotionSectionProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "whileInView"> {
  stagger?: boolean;
  /** Mount-triggered (true) instead of viewport-triggered. Useful for above-the-fold content. */
  immediate?: boolean;
  as?: "div" | "section" | "article" | "ul" | "header" | "footer" | "main";
}

export function MotionSection({
  stagger,
  immediate,
  as = "div",
  ...rest
}: MotionSectionProps) {
  const reduce = useReducedMotion();
  const variants = stagger
    ? staggerContainer
    : reduce
      ? entranceReducedMotion
      : entranceBlurUp;

  // The motion factory uses an indexer; cast to the expected key.
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, amount: 0.1 } })}
      variants={variants}
      {...rest}
    />
  );
}

/**
 * Children of a MotionSection-with-stagger should use this so the timing
 * inherits from the parent container.
 */
type MotionItemTag =
  | "div"
  | "li"
  | "article"
  | "section"
  | "header"
  | "footer"
  | "ul"
  | "p"
  | "button";

export function MotionItem({
  as = "div",
  ...rest
}: Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate"> & {
  as?: MotionItemTag;
  type?: "button" | "submit" | "reset";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      variants={reduce ? entranceReducedMotion : entranceBlurUp}
      {...rest}
    />
  );
}
