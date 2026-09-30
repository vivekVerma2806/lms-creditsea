import React from "react";
import { motion } from "framer-motion";

/**
 * Tabs Component
 * Preset source: ui.shadcn.com / component.gallery
 * Adapted to CreditSea: Minimalist segmented control with animated obsidian/champagne-gold slider pill
 */
export function Tabs({ tabs, activeTab, onChange, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg border border-[#DDD9D0] bg-[#EEEBE4]/60 p-1 ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative rounded-md px-3.5 py-1.5 text-xs font-mono tracking-wider transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-[#6F6B63] hover:text-[#171717]"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 rounded-md bg-[#111111] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive
                      ? "bg-[#B49A68] text-white"
                      : "bg-[#DDD9D0] text-[#171717]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
