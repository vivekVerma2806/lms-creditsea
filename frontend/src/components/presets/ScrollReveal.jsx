import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * ScrollReveal Component
 * Preset source: motion-primitives.com / kinetics.colorion.co
 * Adapted to CreditSea: Restrained viewport-triggered reveal with physical spring easing
 */
export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = 24,
  duration = 0.5,
  delay = 0,
  once = true,
  margin = "-60px",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const initialOffset = directions[direction] || directions.up;

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: initialOffset.x,
        y: initialOffset.y,
        filter: "blur(2px)",
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, x: initialOffset.x, y: initialOffset.y, filter: "blur(2px)" }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Restrained financial institution spring curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
