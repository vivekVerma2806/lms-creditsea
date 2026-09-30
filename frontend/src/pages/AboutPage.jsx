import Header from "../components/Header";
import Footer from "../components/Footer";
import { ShieldCheck, Award, Target, Users, Building2, Check, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        {/* Header Hero */}
        <section className="max-w-4xl mx-auto px-4 text-left py-12 border-b border-[#DDD9D0]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-bold">
            Institutional Principles
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#171717] mt-3 tracking-tight">
            Institutional discipline in short-term credit.
          </h1>
          <p className="text-base text-[#6F6B63] mt-4 leading-relaxed font-normal">
            CreditSea was founded to eliminate predatory lending practices, opaque variable compounding, and excessive friction from short-term personal credit. We provide regulated, fixed-rate liquidity under strict RBI guidelines.
          </p>
        </section>

        {/* Regulatory Governance Framework */}
        <section className="max-w-4xl mx-auto px-4 py-16 border-b border-[#DDD9D0]">
          <div className="bg-white rounded-xl p-8 border border-[#DDD9D0] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#EEEBE4]">
              <div className="w-9 h-9 rounded-lg bg-[#111111] flex items-center justify-center text-[#B49A68]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#171717]">Regulatory Lending Framework</h2>
                <p className="text-xs text-[#6F6B63] font-mono">Meghdoot Mercantile Private Limited (NBFC Partner)</p>
              </div>
            </div>

            <p className="text-xs text-[#6F6B63] leading-relaxed">
              CreditSea operates strictly as a digital lending interface (DLI) partnering with Meghdoot Mercantile Private Limited, an established Non-Banking Financial Company (NBFC) registered with the Reserve Bank of India.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3.5 bg-[#F6F4EF] rounded-lg border border-[#DDD9D0]">
                <span className="text-[10px] font-mono uppercase text-[#6F6B63] block">Registration Body</span>
                <span className="font-bold text-[#171717] mt-0.5 block">Reserve Bank of India (RBI)</span>
              </div>
              <div className="p-3.5 bg-[#F6F4EF] rounded-lg border border-[#DDD9D0]">
                <span className="text-[10px] font-mono uppercase text-[#6F6B63] block">Escrow Mechanism</span>
                <span className="font-bold text-[#171717] mt-0.5 block">Direct HDFC Bank Escrow</span>
              </div>
            </div>

            <div className="text-[11px] text-[#6F6B63] pt-2 space-y-1 font-mono">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#476353]" />
                Full compliance with RBI Digital Lending Directions (2022)
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#476353]" />
                Zero third-party pass-through of borrower funds
              </div>
            </div>
          </div>
        </section>

        {/* Operating Pillars */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-[#171717] mb-8 tracking-tight">Our Core Standards</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-[#DDD9D0] flex gap-5 items-start">
              <span className="text-sm font-mono font-bold text-[#B49A68] mt-0.5">01</span>
              <div>
                <h3 className="text-base font-bold text-[#171717]">Algorithmic Credit Evaluation</h3>
                <p className="text-xs text-[#6F6B63] mt-1.5 leading-relaxed">
                  Our Business Rule Engine evaluates verified banking and salary data in seconds, ensuring credit limits match net discretionary income without overburdening borrowers.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#DDD9D0] flex gap-5 items-start">
              <span className="text-sm font-mono font-bold text-[#B49A68] mt-0.5">02</span>
              <div>
                <h3 className="text-base font-bold text-[#171717]">Fixed 12% APR (Simple Interest)</h3>
                <p className="text-xs text-[#6F6B63] mt-1.5 leading-relaxed">
                  No compounding interest, no hidden spread, and no prepayment penalties. Borrowers only pay for the exact tenure the funds are deployed.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#DDD9D0] flex gap-5 items-start">
              <span className="text-sm font-mono font-bold text-[#B49A68] mt-0.5">03</span>
              <div>
                <h3 className="text-base font-bold text-[#171717]">Zero Predatory Debt Traps</h3>
                <p className="text-xs text-[#6F6B63] mt-1.5 leading-relaxed">
                  We enforce a strict one-active-loan rule per client. Borrowers cannot roll over loans into multiple compounding tranches.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
