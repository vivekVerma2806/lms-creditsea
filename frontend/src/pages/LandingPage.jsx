import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import LoanCalculator from "../components/LoanCalculator";
import DoubtSolver from "../components/DoubtSolver";
import BlurFade from "../components/presets/BlurFade";
import NumberTicker from "../components/presets/NumberTicker";
import CardSpotlight from "../components/presets/CardSpotlight";
import TextEffect from "../components/presets/TextEffect";
import EditorialCTA from "../components/presets/EditorialCTA";
import ScrollReveal from "../components/presets/ScrollReveal";
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

/**
 * LandingPage
 * Sourced from minimal.gallery / getlayers.ai / 21st.dev / Magic UI / cta.gallery / ui.aceternity.com
 * Adapted to CreditSea private-banking aesthetic
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      {/* Unified Composed Hero Section */}
      <HeroSection />

      {/* Institutional Trust & NBFC Compliance Banner */}
      <section className="bg-[#EEEBE4] border-b border-[#DDD9D0] py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white border border-[#DDD9D0] flex items-center justify-center text-[#B49A68] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#171717] block">
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

      {/* Editorial Statistics with NumberTicker preset */}
      <section className="py-16 border-b border-[#DDD9D0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurFade delay={0.1} yOffset={8}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#DDD9D0] text-left">
              <div className="pt-4 md:pt-0 md:px-6 first:pl-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                  Disbursed Volume
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-medium text-[#171717] mt-1 tracking-tight">
                  <NumberTicker value={500} prefix="₹" suffix=" Cr+" delay={0.1} />
                </div>
                <p className="text-xs text-[#969188] mt-1 font-light">Direct liquidity disbursed across India</p>
              </div>

              <div className="pt-4 md:pt-0 md:px-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                  Verified Borrowers
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-medium text-[#171717] mt-1 tracking-tight">
                  <NumberTicker value={200000} suffix="+" delay={0.15} />
                </div>
                <p className="text-xs text-[#969188] mt-1 font-light">Salaried profiles underwritten</p>
              </div>

              <div className="pt-4 md:pt-0 md:px-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                  Decision Latency
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-medium text-[#171717] mt-1 tracking-tight">
                  <span className="font-mono text-xl text-[#969188] mr-1">&lt;</span>
                  <NumberTicker value={10} suffix=" Min" delay={0.2} />
                </div>
                <p className="text-xs text-[#969188] mt-1 font-light">Automated Business Rule Engine (BRE)</p>
              </div>

              <div className="pt-4 md:pt-0 md:px-6 last:pr-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6B63] block">
                  Repayment Compliance
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-medium text-[#476353] mt-1 tracking-tight">
                  <NumberTicker value={98.5} decimalPlaces={1} suffix="%" delay={0.25} />
                </div>
                <p className="text-xs text-[#969188] mt-1 font-light">On-time facility closure rate</p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Core Principles Section with CardSpotlight preset */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#DDD9D0]">
        <ScrollReveal direction="up">
          <div className="max-w-2xl mb-14 text-left space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-semibold">
              Operational Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#171717] tracking-tight">
              <TextEffect per="word">Built for certainty, not speculation.</TextEffect>
            </h2>
            <p className="text-sm text-[#6F6B63] font-light leading-relaxed">
              Every advance issued by CreditSea is grounded in strict underwriting discipline, contractual transparency, and zero predatory fee structures.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <BlurFade delay={0.15} yOffset={8}>
            <CardSpotlight className="p-7 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717]">
                  <Clock className="w-5 h-5 text-[#B49A68]" />
                </div>
                <h3 className="text-lg font-serif font-medium text-[#171717]">Algorithmic Underwriting</h3>
                <p className="text-xs text-[#6F6B63] font-light leading-relaxed">
                  Our automated Business Rule Engine evaluates verified salary slips, PAN credentials, and net monthly income in under 10 minutes without manual friction.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EEEBE4] text-[11px] font-mono text-[#6F6B63] mt-6">
                BRE Rule: Age 23–50 · Net Salary ₹25K+
              </div>
            </CardSpotlight>
          </BlurFade>

          {/* Pillar 2 */}
          <BlurFade delay={0.2} yOffset={8}>
            <CardSpotlight className="p-7 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717]">
                  <Percent className="w-5 h-5 text-[#B49A68]" />
                </div>
                <h3 className="text-lg font-serif font-medium text-[#171717]">Fixed Simple Interest</h3>
                <p className="text-xs text-[#6F6B63] font-light leading-relaxed">
                  We apply a flat 12% annual simple interest rate. Zero compounding interest, zero hidden platform charges, and zero early settlement penalties.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EEEBE4] text-[11px] font-mono text-[#6F6B63] mt-6">
                Amortization: (P × 12% × T) ÷ 365
              </div>
            </CardSpotlight>
          </BlurFade>

          {/* Pillar 3 */}
          <BlurFade delay={0.25} yOffset={8}>
            <CardSpotlight className="p-7 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717]">
                  <Building2 className="w-5 h-5 text-[#B49A68]" />
                </div>
                <h3 className="text-lg font-serif font-medium text-[#171717]">Partner Escrow Settlement</h3>
                <p className="text-xs text-[#6F6B63] font-light leading-relaxed">
                  Disbursements and repayments route directly through dedicated escrow accounts operated by Meghdoot Mercantile Pvt Ltd (RBI-registered NBFC).
                </p>
              </div>
              <div className="pt-4 border-t border-[#EEEBE4] text-[11px] font-mono text-[#6F6B63] mt-6">
                Escrow Node · HDFC Bank Partner
              </div>
            </CardSpotlight>
          </BlurFade>

        </div>
      </section>

      {/* Facility Calculator Section */}
      <section id="calculator" className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="max-w-2xl mb-12 text-left space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-semibold">
              Interactive Planning Tool
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#171717] tracking-tight">
              <TextEffect per="word">Calculate your facility terms.</TextEffect>
            </h2>
            <p className="text-sm text-[#6F6B63] font-light leading-relaxed">
              Adjust principal and tenure to review the transparent simple-interest repayment breakdown before submitting an application.
            </p>
          </div>
        </ScrollReveal>

        <BlurFade delay={0.15} yOffset={10}>
          <LoanCalculator />
        </BlurFade>
      </section>

      {/* High-Converting Editorial CTA Section (cta.gallery / 21st.dev) */}
      <EditorialCTA />

      {/* Institutional Inquiries Desk widget */}
      <DoubtSolver />

      <Footer />
    </div>
  );
}
