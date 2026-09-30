import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoanCalculator from "../components/LoanCalculator";
import DoubtSolver from "../components/DoubtSolver";
import HeroEditorialGraphic from "../components/HeroEditorialGraphic";
import { 
  ShieldCheck, 
  ArrowUpRight, 
  ChevronRight, 
  Check, 
  FileText, 
  Clock, 
  Percent, 
  Building2,
  Lock
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-[#DDD9D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Editorial Typography (7 cols) */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              {/* Category Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#DDD9D0] rounded-full text-[11px] font-mono uppercase tracking-wider text-[#6F6B63]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
                Regulated Capital Allocation Platform
              </div>
              
              {/* Hero Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#171717] tracking-tight leading-[1.08]">
                Credit structured with absolute clarity.
              </h1>
              
              {/* Supporting Statement */}
              <p className="text-base sm:text-lg text-[#6F6B63] max-w-xl leading-relaxed font-normal">
                Direct short-term liquidity up to ₹5,00,000 for verified salaried professionals. Regulated simple-interest terms powered by automated underwriting.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/auth/register"
                  className="px-6 py-3.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition duration-150 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Apply for Credit Facility</span>
                  <ArrowUpRight className="w-4 h-4 text-[#B49A68]" />
                </Link>
                <a
                  href="#calculator"
                  className="px-6 py-3.5 bg-white border border-[#DDD9D0] hover:border-[#B8B2A8] text-[#171717] font-semibold text-xs rounded-lg transition duration-150 flex items-center justify-center gap-2"
                >
                  <span>Facility Calculator</span>
                </a>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-6 border-t border-[#DDD9D0]/70 flex flex-wrap gap-x-8 gap-y-2.5 text-xs text-[#6F6B63]">
                <span className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#476353]" /> 12% Flat Simple Interest
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#476353]" /> Zero Pre-Payment Penalty
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#476353]" /> RBI Regulated NBFC Partner
                </span>
              </div>
            </div>

            {/* Right Column: Custom Bespoke Financial Graphic (5 cols) */}
            <div className="lg:col-span-5 relative">
              <HeroEditorialGraphic />
            </div>

          </div>
        </div>
      </section>

      {/* Institutional Trust & NBFC Compliance Banner */}
      <section className="bg-[#EEEBE4] border-b border-[#DDD9D0] py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white border border-[#DDD9D0] flex items-center justify-center text-[#B49A68] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#171717] block">
                  Regulated Lending Partner · Meghdoot Mercantile Private Limited
                </span>
                <span className="text-[11px] text-[#6F6B63] font-mono">
                  Registered Non-Banking Financial Company (NBFC) under Reserve Bank of India (RBI) Regulations
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-[#6F6B63]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#476353]" /> Escrow Account Protected
              </span>
              <span>•</span>
              <span>CIN: U65923CT1995PTC009412</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Statistics */}
      <section className="py-16 border-b border-[#DDD9D0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#DDD9D0] text-left">
            <div className="pt-4 md:pt-0 md:px-6 first:pl-0">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                Disbursed Volume
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#171717] mt-1 tabular-nums tracking-tight">
                ₹500 Cr+
              </div>
              <p className="text-xs text-[#969188] mt-1">Direct liquidity disbursed across India</p>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                Verified Borrowers
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#171717] mt-1 tabular-nums tracking-tight">
                2,00,000+
              </div>
              <p className="text-xs text-[#969188] mt-1">Salaried profiles underwritten</p>
            </div>

            <div className="pt-4 md:pt-0 md:px-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                Decision Latency
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#171717] mt-1 tabular-nums tracking-tight">
                &lt; 10 Min
              </div>
              <p className="text-xs text-[#969188] mt-1">Automated Business Rule Engine (BRE)</p>
            </div>

            <div className="pt-4 md:pt-0 md:px-6 last:pr-0">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                Repayment Compliance
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#476353] mt-1 tabular-nums tracking-tight">
                98.5%
              </div>
              <p className="text-xs text-[#969188] mt-1">On-time facility closure rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#DDD9D0]">
        <div className="max-w-2xl mb-14 text-left space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-bold">
            Operational Principles
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#171717] tracking-tight">
            Built for certainty, not speculation.
          </h2>
          <p className="text-sm text-[#6F6B63] font-normal leading-relaxed">
            Every advance issued by CreditSea is grounded in strict underwriting discipline, contractual transparency, and zero predatory fee structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white p-7 rounded-xl border border-[#DDD9D0] space-y-4 hover:border-[#B8B2A8] transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717]">
              <Clock className="w-5 h-5 text-[#B49A68]" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">Algorithmic Underwriting</h3>
            <p className="text-xs text-[#6F6B63] leading-relaxed">
              Our automated Business Rule Engine evaluates verified salary slips, PAN credentials, and net monthly income in under 10 minutes without manual friction.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#171717] flex items-center gap-1">
              BRE Criteria: Age 23–50 · Min ₹25K Salary
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-7 rounded-xl border border-[#DDD9D0] space-y-4 hover:border-[#B8B2A8] transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717]">
              <Percent className="w-5 h-5 text-[#B49A68]" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">Fixed Simple Interest</h3>
            <p className="text-xs text-[#6F6B63] leading-relaxed">
              We apply a flat 12% annual simple interest rate. Zero compounding interest, zero hidden platform charges, and zero early settlement penalties.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#171717] flex items-center gap-1">
              Formula: (Principal × 12% × Days) ÷ 365
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-7 rounded-xl border border-[#DDD9D0] space-y-4 hover:border-[#B8B2A8] transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717]">
              <Building2 className="w-5 h-5 text-[#B49A68]" />
            </div>
            <h3 className="text-lg font-bold text-[#171717]">Partner Escrow Settlement</h3>
            <p className="text-xs text-[#6F6B63] leading-relaxed">
              Disbursements and repayments route directly through dedicated escrow accounts operated by Meghdoot Mercantile Pvt Ltd (RBI-registered NBFC).
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#171717] flex items-center gap-1">
              Escrow Protocol · HDFC Bank Partner
            </div>
          </div>

        </div>
      </section>

      {/* Facility Calculator Section */}
      <section id="calculator" className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 text-left space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-bold">
            Interactive Planning Tool
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#171717] tracking-tight">
            Calculate your facility terms.
          </h2>
          <p className="text-sm text-[#6F6B63] font-normal leading-relaxed">
            Adjust principal and tenure to review the transparent simple-interest repayment breakdown before submitting an application.
          </p>
        </div>

        <LoanCalculator />
      </section>

      {/* Institutional Knowledge Desk widget */}
      <DoubtSolver />

      <Footer />
    </div>
  );
}
