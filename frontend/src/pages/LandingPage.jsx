import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoanCalculator from "../components/LoanCalculator";
import DoubtSolver from "../components/DoubtSolver";
import { ShieldCheck, Award, Target, Users, Zap, CheckCircle2, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info (7 cols) */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-blue-600" /> Instant Sanctions in under 10 minutes
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-950 tracking-tight leading-none">
                Salaried Cash Advances Made <span className="bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent">Simple.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-650 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Get up to ₹5,00,000 disbursed directly into your bank account. Powered by a real-time rules engine and regulated RBI NBFC terms.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/auth/register"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition shadow-xl shadow-blue-200 hover:-translate-y-0.5 duration-200"
                >
                  Apply Online <ChevronRight className="w-5 h-5" />
                </Link>
                <a
                  href="#calculator"
                  className="px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-extrabold rounded-2xl flex items-center justify-center transition hover:-translate-y-0.5 duration-200"
                >
                  Estimate EMI
                </a>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 pt-4 border-t border-gray-100/80">
                <span className="flex items-center gap-2 text-sm text-gray-650 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Zero hidden fees
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-650 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> 100% paperless
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-650 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> RBI NBFC Escrow
                </span>
              </div>
            </div>

            {/* Right Graphics (5 cols) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-72 sm:w-80 md:w-96 lg:w-full max-w-sm relative">
                <img
                  src="/loan_hero.png"
                  alt="Loan Management Hero"
                  className="w-full h-auto drop-shadow-2xl animate-float"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NBFC Disclosure Section */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase mb-4">
            <ShieldCheck className="w-4 h-4" /> RBI COMPLIANCE STATUS
          </div>
          <p className="text-gray-650 font-semibold text-base">
            CreditSea operates as a direct financial matching platform. All credits are approved, disbursed, and settled by our licensed partner:
          </p>
          <p className="text-lg font-black text-blue-700 mt-2">
            Meghdoot Mercantile Private Limited (RBI Registered Escrow Account)
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">Our Core Pillars</h2>
          <p className="text-lg text-gray-500 font-medium">
            We build simple products to take the stress out of short-term credit requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-150/30 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Evaluation</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Our automated Business Rule Engine (BRE) processes details in real-time, verifying eligibility and bank statements instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-150/30 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Terms</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Zero hidden charges, zero compound interest. A flat 12% simple interest rate calculated daily for complete control.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-150/30 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-650 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Beginner Friendly</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              We remove complex banking jargon. Manage and follow your loan statuses with clean, easy-to-read dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">Interactive EMI Calculator</h2>
            <p className="text-lg text-gray-500 font-medium">
              Compute your simple interest returns. Adjust your principal and days to visualize total costs.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-b border-gray-100">
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-1">₹500Cr+</p>
            <p className="text-xs font-semibold text-gray-500 uppercase">Disbursed</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-1">2 Lakhs+</p>
            <p className="text-xs font-semibold text-gray-500 uppercase">Happy Customers</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-1">10 Minutes</p>
            <p className="text-xs font-semibold text-gray-500 uppercase">Setup Time</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600 mb-1">98.5%</p>
            <p className="text-xs font-semibold text-gray-500 uppercase">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Floating Doubt Solver chatbot */}
      <DoubtSolver />

      <Footer />
    </div>
  );
}
