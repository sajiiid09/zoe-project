"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const MotionSection = ({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      className={className}
      variants={fadeUp}
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.section>
  );
};

export const MotionCard = ({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.article
      className={className}
      variants={fadeUp}
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.2, 0.8, 0.2, 1], delay }}
      whileHover={prefersReducedMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.article>
  );
};

export const MotionTableRow = ({
  children,
  delay = 0,
}: PropsWithChildren<{ delay?: number }>) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.tr
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.tr>
  );
};
