import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import ShimmerButton from "./ShimmerButton";
import NumberTicker from "./NumberTicker";

/**
 * EditorialCTA Component
 * Preset source: cta.gallery / 21st.dev / minimal.gallery
 * Adapted to CreditSea: Architectural frame with live capital ticker and instant allocation call-to-action
 */
export default function EditorialCTA({
  maxLimit = 500000,
  rate = "12.0%",
  className = "",
}) {
  return (
    <section className={`py-16 bg-[#111111] text-[#F6F4EF] relative overflow-hidden ${className}`}>
      {/* Subtle architectural background grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#B49A68 1px, transparent 1px), linear-gradient(to right, #B49A68 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="border border-[#2A2A2A] rounded-2xl p-8 sm:p-12 lg:p-14 bg-[#141414]/90 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222222] border border-[#333333] text-[10px] font-mono tracking-widest uppercase text-[#B49A68]">
                <ShieldCheck className="w-3.5 h-3.5" />
                RBI Registered Lending Infrastructure
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Access your verified credit line today.
              </h2>
              <p className="text-xs sm:text-sm text-[#969188] font-light max-w-lg leading-relaxed">
                Direct short-term personal liquidity with transparent simple interest. No compounding traps, no hidden deductions, and direct NBFC settlement.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-[#DDD9D0]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A68]" />
                  Zero Prepayment Penalty
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A68]" />
                  Automated BRE in 10 Mins
                </span>
              </div>
            </div>

            {/* Right Action & Metrics */}
            <div className="lg:col-span-5 flex flex-col sm:items-end justify-center space-y-5 border-t lg:border-t-0 lg:border-l border-[#2A2A2A] pt-6 lg:pt-0 lg:pl-10">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F6B63] block">
                  Maximum Instant Facility
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  <NumberTicker value={maxLimit} prefix="₹" />
                </div>
                <span className="text-[11px] font-mono text-[#B49A68] block mt-0.5">
                  Predictable {rate} Simple APR
                </span>
              </div>

              <div className="w-full sm:w-auto">
                <Link to="/apply" className="block">
                  <ShimmerButton className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold tracking-wider">
                    Initiate Credit Verification
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </ShimmerButton>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
