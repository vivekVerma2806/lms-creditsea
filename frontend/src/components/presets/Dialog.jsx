import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Dialog / Modal Component
 * Preset source: ui.shadcn.com / component.gallery
 * Adapted to CreditSea: Private-banking institutional backdrop blur with warm ivory / obsidian accents
 */
export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg rounded-xl border border-[#DDD9D0] bg-white p-6 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-[#6F6B63] transition hover:bg-[#EEEBE4] hover:text-[#171717]"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ className = "", children }) {
  return <div className={`mb-4 flex flex-col space-y-1.5 ${className}`}>{children}</div>;
}

export function DialogTitle({ className = "", children }) {
  return (
    <h2 className={`font-serif text-xl font-bold tracking-tight text-[#171717] ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className = "", children }) {
  return (
    <p className={`text-xs text-[#6F6B63] font-light leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function DialogFooter({ className = "", children }) {
  return (
    <div className={`mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-[#EEEBE4] ${className}`}>
      {children}
    </div>
  );
}
