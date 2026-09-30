import React from "react";

/**
 * ShimmerButton Component
 * Preset source: 21st.dev / Magic UI / CTA Gallery
 * Adapted to CreditSea: Restrained champagne-gold border perimeter highlight
 */
export default function ShimmerButton({
  shimmerColor = "#B49A68",
  shimmerSize = "0.08em",
  shimmerDuration = "3s",
  borderRadius = "6px",
  background = "#111111",
  className = "",
  children,
  onClick,
  disabled = false,
  ...props
}) {
  return (
    <button
      style={{
        "--spread": "90deg",
        "--shimmer-color": shimmerColor,
        "--radius": borderRadius,
        "--speed": shimmerDuration,
        "--cut": shimmerSize,
        "--bg": background,
      }}
      disabled={disabled}
      onClick={onClick}
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-[#222222] px-6 py-3 font-mono text-xs uppercase tracking-wider text-white [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:border-[#B49A68] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {/* Spark container */}
      <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]">
        <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>
      
      {/* Content wrapper */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Backdrop */}
      <div className="absolute inset-[1px] -z-20 rounded-[inherit] bg-[#111111] transition-colors group-hover:bg-[#1A1A1A]" />
    </button>
  );
}
