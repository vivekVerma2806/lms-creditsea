import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Check, 
  ShieldCheck, 
  Lock, 
  Building2, 
  FileText,
  Clock,
  Percent
} from "lucide-react";
import NumberTicker from "./presets/NumberTicker";
import TextEffect from "./presets/TextEffect";

/**
 * HeroSection Component
 * Sourced from minimal.gallery / 21st.dev / component.gallery / motion-primitives / microkit.co
 * 
 * Composition:
 * - Desktop: Compact, first-fold balanced 2-column layout (no excessive vertical padding).
 * - Left: Eyebrow -> Dominant Editorial Headline -> Clear Product Copy -> Primary/Secondary CTAs -> Trust Strip.
 * - Right: One unified, institutional Financial Instrument voucher combining the custom architectural vault
 *   engraving with live facility parameters and statutory escrow metadata.
 */
export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-28 lg:pb-16 border-b border-[#DDD9D0] bg-[#F6F4EF] overflow-hidden">
      {/* Subtle Background Architectural Hairline Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#DDD9D0_1px,transparent_1px),linear-gradient(to_bottom,#DDD9D0_1px,transparent_1px)] bg-[size:48px_48px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* ================= LEFT COLUMN: EDITORIAL ANCHOR (7 cols) ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* 1. Small Institutional Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#DDD9D0] rounded text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68] animate-pulse" />
              <span>Regulated Capital Allocation Platform</span>
              <span className="text-[#DDD9D0]">|</span>
              <span className="text-[#171717] font-medium">RBI NBFC Partner</span>
            </div>

            {/* 2. Large Editorial Headline with TextEffect preset */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-serif font-medium text-[#171717] tracking-tight leading-[1.08]">
              <TextEffect per="word" delay={0.1}>Credit structured with</TextEffect> <br className="hidden sm:inline" />
              <span className="italic font-serif text-[#111111]">
                <TextEffect per="word" delay={0.25}>absolute clarity.</TextEffect>
              </span>
            </h1>

            {/* 3. Concise Supporting Paragraph */}
            <p className="text-sm sm:text-base text-[#6F6B63] font-light max-w-xl leading-relaxed">
              Direct short-term credit facilities up to <strong className="font-medium text-[#171717]">₹5,00,000</strong> for verified salaried professionals. Predictable 12% simple interest, automated underwriting in 10 minutes, and direct NBFC escrow settlement.
            </p>

            {/* 4. Primary and Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                to="/auth/register"
                className="group px-6 py-3 bg-[#111111] hover:bg-[#222222] text-white rounded font-mono text-xs uppercase tracking-wider transition-all duration-200 border border-[#111111] hover:border-[#B49A68] shadow-sm flex items-center justify-center gap-2 active:translate-y-px"
              >
                <span>Apply for Credit</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
              
              <a
                href="#calculator"
                className="px-6 py-3 bg-white hover:bg-[#EEEBE4] border border-[#DDD9D0] hover:border-[#171717] text-[#171717] rounded font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:translate-y-px"
              >
                <span>Facility Calculator</span>
              </a>
            </div>

            {/* 5. Supporting Trust Indicators Strip */}
            <div className="pt-5 border-t border-[#DDD9D0] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#6F6B63]">
              <span className="flex items-center gap-1.5 font-medium text-[#171717]">
                <Check className="w-3.5 h-3.5 text-[#476353]" /> 12% Flat Simple Interest
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#171717]">
                <Check className="w-3.5 h-3.5 text-[#476353]" /> Zero Pre-Payment Penalty
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#171717]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B49A68]" /> Meghdoot Mercantile (RBI NBFC)
              </span>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: UNIFIED FINANCIAL INSTRUMENT (5 cols) ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 relative"
          >
            {/* ONE Composed Institutional Financial Instrument */}
            <div className="bg-white border border-[#DDD9D0] hover:border-[#B49A68] transition-colors duration-300 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              
              {/* Instrument Top Spec Bar */}
              <div className="bg-[#F6F4EF] px-5 py-3 border-b border-[#DDD9D0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#476353]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717] font-semibold">
                    Prime Facility Instrument
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6F6B63] bg-white px-2 py-0.5 rounded border border-[#DDD9D0]">
                  REF: CS-PRIME-FACILITY
                </span>
              </div>

              {/* Bespoke Architectural Rupee Vault Engraving */}
              <div className="relative p-5 bg-[#F6F4EF]/50 border-b border-[#DDD9D0] flex items-center justify-center">
                <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-lg border border-[#DDD9D0] overflow-hidden bg-white shadow-xs">
                  <img
                    src="/creditsea_hero_vault.jpg"
                    alt="CreditSea Indian Institutional Credit Vault Engraving"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Telemetry Stamp */}
                <div className="absolute bottom-7 right-7 bg-white/95 backdrop-blur-xs border border-[#DDD9D0] rounded p-2.5 shadow-sm text-left font-mono space-y-0.5">
                  <div className="text-[9px] uppercase tracking-wider text-[#969188]">Max Credit Limit</div>
                  <div className="text-xs font-semibold text-[#171717] tabular-nums">₹5,00,000</div>
                  <div className="text-[9px] text-[#476353] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#476353]" /> Instant BRE Audit
                  </div>
                </div>
              </div>

              {/* Financial Parameters Matrix */}
              <div className="p-5 space-y-3.5 text-xs text-left">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#EEEBE4]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#969188] block">Statutory APR</span>
                    <span className="font-serif font-medium text-sm text-[#171717] mt-0.5 block tabular-nums">
                      12.0% Simple Interest
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#969188] block">Decision Latency</span>
                    <span className="font-serif font-medium text-sm text-[#476353] mt-0.5 block tabular-nums flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> &lt; 10 Minutes
                    </span>
                  </div>
                </div>

                {/* Escrow Custody Rail Metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6F6B63]">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#B49A68]" />
                    <span>Meghdoot Mercantile Pvt Ltd (NBFC)</span>
                  </div>
                  <span className="text-[#171717] font-medium">HDFC Escrow</span>
                </div>
              </div>

              {/* Bottom Quick-Action Footer */}
              <div className="px-5 py-2.5 bg-[#F6F4EF] border-t border-[#DDD9D0] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#476353] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> End-to-End Escrow Protection
                </span>
                <Link
                  to="/apply"
                  className="text-[#111111] hover:text-[#B49A68] font-semibold uppercase tracking-wider flex items-center gap-1"
                >
                  Verify Limits &rarr;
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
