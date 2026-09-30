import React from "react";

/**
 * Badge Component
 * Preset source: ui.shadcn.com / component.gallery
 * Adapted to CreditSea: Restrained status badge with live pulse dot indicator and institutional financial semantics
 */
export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = true,
  className = "",
}) {
  const variantStyles = {
    success: "bg-[#476353]/10 text-[#476353] border-[#476353]/30",
    pending: "bg-[#A17E43]/10 text-[#A17E43] border-[#A17E43]/30",
    danger: "bg-[#874F4F]/10 text-[#874F4F] border-[#874F4F]/30",
    gold: "bg-[#B49A68]/15 text-[#B49A68] border-[#B49A68]/40",
    neutral: "bg-[#EEEBE4] text-[#6F6B63] border-[#DDD9D0]",
    obsidian: "bg-[#111111] text-white border-[#222222]",
  };

  const dotColors = {
    success: "bg-[#476353]",
    pending: "bg-[#A17E43]",
    danger: "bg-[#874F4F]",
    gold: "bg-[#B49A68]",
    neutral: "bg-[#6F6B63]",
    obsidian: "bg-[#B49A68]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-2.5 py-1 text-[10px]",
    lg: "px-3 py-1.5 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider font-semibold ${
        variantStyles[variant] || variantStyles.neutral
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dotColors[variant] || dotColors.neutral
          }`}
        />
      )}
      {children}
    </span>
  );
}
