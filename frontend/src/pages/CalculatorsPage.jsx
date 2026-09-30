import Header from "../components/Header";
import Footer from "../components/Footer";
import LoanCalculator from "../components/LoanCalculator";
import { HelpCircle, ShieldCheck } from "lucide-react";

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl mb-12 text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-bold">
              Facility Planning
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#171717] mt-2 tracking-tight">
              Facility Terms Calculator
            </h1>
            <p className="text-sm sm:text-base text-[#6F6B63] mt-2 leading-relaxed">
              Model advance allocations, examine daily interest accrual, and review exact settlement schedules prior to application submission.
            </p>
          </div>

          {/* Calculator Component */}
          <LoanCalculator />

          {/* Institutional Calculation Disclosure */}
          <div className="max-w-5xl mx-auto mt-14 p-7 bg-white border border-[#DDD9D0] rounded-xl text-left space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EEEBE4]">
              <ShieldCheck className="w-5 h-5 text-[#B49A68]" />
              <h3 className="text-base font-bold text-[#171717]">
                Regulatory Interest Calculation Methodology
              </h3>
            </div>
            
            <p className="text-xs text-[#6F6B63] leading-relaxed">
              In accordance with Reserve Bank of India Fair Practice Code directions, all CreditSea advances employ a strict <strong>Simple Interest method</strong>. Interest accrues solely on the active principal balance without monthly or daily compounding.
            </p>

            <div className="bg-[#F6F4EF] p-3.5 rounded-lg font-mono text-xs text-[#171717] border border-[#DDD9D0] inline-block">
              Daily Interest = (Principal × 12.00% × Tenure in Days) ÷ 365
            </div>

            <p className="text-[11px] text-[#969188] leading-normal">
              Illustration: An approved advance of ₹1,00,000 for 90 days accrues exactly (₹1,00,000 × 0.12 × 90) ÷ 365 = ₹2,958.90 simple interest. The total repayment obligation upon maturity is ₹1,02,959. No account maintenance or platform subscription fees are deducted.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
