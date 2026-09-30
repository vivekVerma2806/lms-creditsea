import React from "react";

/**
 * CircleLoader Component
 * Preset source: circleloaders.dominikakissi.com
 * Adapted to CreditSea: Minimalist dual-ring concentric SVG loader with champagne-gold stroke
 */
export default function CircleLoader({
  size = 40,
  strokeWidth = 2.5,
  color = "#B49A68",
  trackColor = "#DDD9D0",
  className = "",
  label = "",
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-90 animate-spin"
          viewBox={`0 0 ${size} ${size}`}
          style={{ animationDuration: "1.4s" }}
        >
          {/* Static Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          {/* Dynamic Active Segment */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.65}
            strokeLinecap="round"
          />
        </svg>
      </div>
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F6B63]">
          {label}
        </span>
      )}
    </div>
  );
}
