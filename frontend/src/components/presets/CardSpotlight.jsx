import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

/**
 * CardSpotlight Component
 * Preset source: ui.aceternity.com / 21st.dev / glass.samasante.com
 * Adapted to CreditSea: Radial cursor spotlight with champagne-gold reflection on warm ivory/white cards
 */
export default function CardSpotlight({
  children,
  className = "",
  radius = 320,
  color = "rgba(180, 154, 104, 0.12)",
  ...props
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group/spotlight relative overflow-hidden rounded-xl border border-[#DDD9D0] bg-white transition-all duration-300 hover:border-[#B49A68]/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${color},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
