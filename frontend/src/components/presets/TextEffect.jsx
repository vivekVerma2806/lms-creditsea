import { motion } from "framer-motion";
import React from "react";

/**
 * TextEffect Component
 * Preset source: motion-primitives.com / text-effects.colorion.co
 * Adapted to CreditSea: Staggered word/character entrance animation with restrained financial institution easing
 */
export default function TextEffect({
  children,
  per = "word",
  as: Component = "span",
  className = "",
  delay = 0,
  duration = 0.35,
}) {
  if (typeof children !== "string") {
    return <Component className={className}>{children}</Component>;
  }

  const items = per === "char" ? children.split("") : children.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === "char" ? 0.02 : 0.06,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1], // Restrained cubic-bezier curve from kinetics.colorion.co
      },
    },
  };

  return (
    <Component className={`inline-block ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
      >
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block"
          >
            {item}
            {per === "word" && index < items.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
