export default function HeroEditorialGraphic() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background architectural framing elements */}
      <div className="absolute -inset-2 bg-gradient-to-b from-[#EEEBE4] to-[#F6F4EF] rounded-2xl border border-[#DDD9D0] transform rotate-1 -z-10 opacity-70"></div>
      
      {/* Main Financial Instrument Card */}
      <div className="bg-white border border-[#DDD9D0] rounded-xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEBE4]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#111111] flex items-center justify-center">
              <span className="text-white font-mono text-xs font-bold tracking-tight">CS</span>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                Facility Ref · CS-FAC-2026-X
              </span>
              <span className="text-xs font-semibold text-[#171717]">
                Meghdoot Mercantile Escrow
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[#476353]/10 text-[#476353] border border-[#476353]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#476353]"></span>
            Active Facility
          </span>
        </div>

        {/* Primary Amount Section */}
        <div className="space-y-1">
          <div className="text-[11px] uppercase tracking-wider font-medium text-[#6F6B63]">
            Approved Liquidity Line
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#171717] tracking-tight tabular-nums">
              ₹5,00,000
            </span>
            <span className="text-xs font-mono text-[#B49A68] font-semibold">
              INR
            </span>
          </div>
          <div className="text-xs text-[#6F6B63] font-medium pt-0.5">
            Underwritten via real-time Business Rule Engine (BRE)
          </div>
        </div>

        {/* Financial Distribution Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-[#6F6B63]">
            <span>Principal Allocation: 100%</span>
            <span>Fixed APR: 12.00%</span>
          </div>
          <div className="w-full h-1.5 bg-[#EEEBE4] rounded-full overflow-hidden flex">
            <div className="bg-[#111111] h-full w-[82%]"></div>
            <div className="bg-[#B49A68] h-full w-[18%]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#969188]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#111111]"></span> Net Disbursable
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#B49A68]"></span> Simple Interest Reserve
            </span>
          </div>
        </div>

        {/* Calibrated Specs Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#EEEBE4] text-left">
          <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#DDD9D0]/60">
            <span className="text-[10px] font-mono uppercase text-[#6F6B63] block">Disbursement</span>
            <span className="text-xs font-bold text-[#171717] mt-0.5 block tabular-nums">T+10 Min</span>
          </div>
          <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#DDD9D0]/60">
            <span className="text-[10px] font-mono uppercase text-[#6F6B63] block">Compounding</span>
            <span className="text-xs font-bold text-[#476353] mt-0.5 block">Zero (0%)</span>
          </div>
          <div className="p-3 bg-[#F6F4EF] rounded-lg border border-[#DDD9D0]/60">
            <span className="text-[10px] font-mono uppercase text-[#6F6B63] block">Regulatory</span>
            <span className="text-xs font-bold text-[#171717] mt-0.5 block">RBI Reg.</span>
          </div>
        </div>

        {/* Institutional Verification Footer */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-[#6F6B63] font-mono border-t border-[#EEEBE4]/60">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#B49A68]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            256-Bit Encrypted Protocol
          </span>
          <span className="text-[#969188]">Meghdoot NBFC</span>
        </div>

      </div>
    </div>
  );
}
