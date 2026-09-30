import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * BlurFade Component
 * Preset source: Magic UI / 21st.dev / motion-primitives
 * Provides restrained physical entrance transitions without distracting motion
 */
export default function BlurFade({
  children,
  className = "",
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 8,
  inView = true,
  inViewMargin = "-50px",
  blur = "4px",
}) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };

  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="hidden"
      variants={combinedVariants}
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
