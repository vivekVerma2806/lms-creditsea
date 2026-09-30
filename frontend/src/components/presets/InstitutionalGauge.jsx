import React from "react";

/**
 * InstitutionalGauge Component
 * Preset source: circleloaders.dominikakissi.com / microkit.co
 * Adapted to CreditSea: Restrained circular progress indicator with champagne gold stroke
 */
export default function InstitutionalGauge({
  percentage = 0,
  size = 72,
  strokeWidth = 5,
  color = "#B49A68",
  trackColor = "#DDD9D0",
  label = "",
  sublabel = "",
  showPercent = true,
  className = "",
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Path */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {showPercent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs font-semibold text-[#171717] tabular-nums">
              {Math.round(clamped)}%
            </span>
          </div>
        )}
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-medium text-[#171717]">{label}</span>}
          {sublabel && <span className="text-[11px] text-[#6F6B63] font-light">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
