"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import {
  cardHover,
  cardHoverSpring,
  entranceBlurUp,
  entranceReducedMotion,
} from "./motion-tokens";

/**
 * Interactive card surface. Composes:
 *  - blur-slide-up entrance (viewport-triggered, once, 10% amount)
 *  - whileHover spring lift (y:-7, scale:1.018)
 *  - whileTap subtle press
 *
 * Reduced-motion users get opacity fade only — no transform, no blur.
 */
export interface MotionCardProps
  extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "whileInView" | "whileHover" | "whileTap"> {
  /** Render as a `motion.a` for links. Otherwise renders motion.div. */
  as?: "div" | "a" | "article" | "li" | "button";
  hover?: boolean;
}

export function MotionCard({
  as = "div",
  hover = true,
  ...rest
}: MotionCardProps) {
  const reduce = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={reduce ? entranceReducedMotion : entranceBlurUp}
      whileHover={!hover || reduce ? undefined : cardHover}
      whileTap={!hover || reduce ? undefined : { scale: 0.99 }}
      transition={cardHoverSpring}
      {...rest}
    />
  );
}
