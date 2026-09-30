import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import InstitutionalGauge from "./presets/InstitutionalGauge";
import InteractiveToggle from "./presets/InteractiveToggle";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(150000);
  const [tenure, setTenure] = useState(90);
  const [detailedMode, setDetailedMode] = useState(false);

  const annualInterestRate = 0.12; // 12% flat APR (simple interest)
  const interestAmount = (amount * annualInterestRate * tenure) / 365;
  const totalRepayment = amount + interestAmount;
  const dailyCost = interestAmount / tenure;

  const principalRatio = (amount / totalRepayment) * 100;
  const interestRatio = (interestAmount / totalRepayment) * 100;
  const limitUtilization = (amount / 500000) * 100;

  return (
    <div className="bg-white border border-[#DDD9D0] rounded-xl p-6 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Sliders Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6F6B63]">
                Principal Advance
              </span>
              <span className="text-2xl font-extrabold text-[#171717] tabular-nums tracking-tight">
                ₹{amount.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-[#969188] mb-3">Allocated liquidity disbursed directly to your account.</p>
            <input
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#969188] mt-2">
              <span>Min ₹50,000</span>
              <span>Max ₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6F6B63]">
                Facility Tenure
              </span>
              <span className="text-2xl font-extrabold text-[#171717] tabular-nums tracking-tight">
                {tenure} <span className="text-sm font-medium text-[#6F6B63]">Days</span>
              </span>
            </div>
            <p className="text-[11px] text-[#969188] mb-3">Structured settlement period with zero early-closure penalties.</p>
            <input
              type="range"
              min="30"
              max="365"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#969188] mt-2">
              <span>30 Days (1 Mo)</span>
              <span>365 Days (12 Mos)</span>
            </div>
          </div>

          {/* Institutional Lending Disclosures */}
          <div className="pt-6 border-t border-[#EEEBE4] grid grid-cols-2 gap-4 text-left">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase text-[#6F6B63]">Rate Model</span>
              <div className="text-xs font-semibold text-[#171717]">12.00% Simple Interest p.a.</div>
              <p className="text-[10px] text-[#969188]">Zero compounding fees or variable rate spread.</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase text-[#6F6B63]">Daily Cost</span>
              <div className="text-xs font-semibold text-[#171717] tabular-nums">
                ₹{dailyCost.toFixed(2)} / day
              </div>
              <p className="text-[10px] text-[#969188]">Calculated only for days principal remains active.</p>
            </div>
          </div>

          {/* Institutional Utilization Gauge & Interactive Toggle */}
          <div className="pt-5 border-t border-[#EEEBE4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <InstitutionalGauge
              percentage={limitUtilization}
              size={54}
              strokeWidth={4}
              color="#B49A68"
              trackColor="#DDD9D0"
              label="Facility Utilization"
              sublabel="₹5,00,000 Maximum Cap"
            />
            <InteractiveToggle
              checked={detailedMode}
              onChange={setDetailedMode}
              label="Daily Accrual View"
              description="Simple vs day-by-day"
            />
          </div>
        </div>

        {/* Calculation Summary Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#F6F4EF] rounded-xl p-6 border border-[#DDD9D0] flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD9D0]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">
                Facility Statement
              </span>
              <span className="text-[10px] font-mono text-[#476353] bg-[#476353]/10 border border-[#476353]/20 px-2 py-0.5 rounded">
                BRE Pre-Qualified
              </span>
            </div>

            {/* Total Payable Dominant Metric */}
            <div className="py-5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#6F6B63] font-medium block">
                Total Repayment Obligation
              </span>
              <div className="text-3xl md:text-4xl font-black text-[#171717] tracking-tight mt-1 tabular-nums">
                ₹{Math.round(totalRepayment).toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-[#6F6B63] mt-1">
                Due upon maturity ({tenure} days)
              </div>
            </div>

            {/* Visual Distribution Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full h-2 bg-[#DDD9D0] rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#111111] h-full transition-all duration-300"
                  style={{ width: `${principalRatio}%` }}
                ></div>
                <div 
                  className="bg-[#B49A68] h-full transition-all duration-300"
                  style={{ width: `${interestRatio}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-[#6F6B63] pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#111111]"></span> Principal: {principalRatio.toFixed(1)}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#B49A68]"></span> Interest: {interestRatio.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Detailed Line Items */}
            <div className="mt-5 space-y-2.5 text-xs border-t border-[#DDD9D0] pt-4">
              <div className="flex justify-between text-[#6F6B63]">
                <span>Principal Disbursable:</span>
                <span className="font-semibold text-[#171717] tabular-nums">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6F6B63]">
                <span>Interest Charge (12% p.a.):</span>
                <span className="font-semibold text-[#B49A68] tabular-nums">₹{Math.round(interestAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6F6B63]">
                <span>Origination / Platform Fee:</span>
                <span className="font-semibold text-[#476353]">₹0 (Waived)</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <Link
              to="/apply"
              className="w-full py-3 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition duration-150 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Lock Facility & Apply</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#969188] font-mono mt-2.5">
              <ShieldCheck className="w-3 h-3 text-[#B49A68]" /> Regulated NBFC Escrow Disbursal
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
