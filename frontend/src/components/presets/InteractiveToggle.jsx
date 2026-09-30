import React from "react";
import { motion } from "framer-motion";

/**
 * InteractiveToggle Component
 * Preset source: microkit.co / uiverse.io
 * Adapted to CreditSea: Tactile spring-animated toggle switch with champagne gold accent
 */
export default function InteractiveToggle({
  checked,
  onChange,
  label = "",
  description = "",
  disabled = false,
  className = "",
}) {
  return (
    <label
      className={`inline-flex items-center justify-between gap-4 cursor-pointer select-none ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-xs font-semibold text-[#171717] tracking-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[10px] text-[#6F6B63] font-light">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[#B49A68]" : "bg-[#DDD9D0]"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
