import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BlurFade from "../components/presets/BlurFade";
import { ArrowLeft, ShieldCheck } from "lucide-react";

/**
 * NotFoundPage
 * Presets source: 404s.design / 21st.dev
 * Features custom editorial line art and high-trust guidance
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6">
        <BlurFade delay={0.1} yOffset={12}>
          <div className="max-w-2xl w-full text-center space-y-6 bg-white border border-[#DDD9D0] rounded-xl p-8 md:p-12 shadow-sm">
            
            {/* Custom Editorial 404 Illustration */}
            <div className="max-w-xs mx-auto border border-[#DDD9D0] rounded-lg overflow-hidden bg-[#F6F4EF]">
              <img
                src="/not_found_editorial.jpg"
                alt="CreditSea 404 Archway Illustration"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono tracking-widest uppercase text-[#B49A68] font-semibold">
                Statutory Code 404 · Facility Record Unlocated
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-[#171717]">
                Page Not Found. Your Journey Remains Secure.
              </h1>
              <p className="text-xs sm:text-sm text-[#6F6B63] font-light max-w-md mx-auto leading-relaxed">
                The requested URL, statutory certificate, or desk record does not exist or has been archived under NBFC audit compliance rules.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#B49A68] group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Public Desk</span>
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-[#F6F4EF] border border-[#DDD9D0] text-[#171717] hover:border-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center justify-center"
              >
                Access Staff Portal
              </Link>
            </div>

            <div className="pt-6 border-t border-[#DDD9D0] flex items-center justify-center gap-2 text-[11px] font-mono text-[#969188]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A68]" />
              RBI Registered NBFC Escalations: grievance@creditsea.com
            </div>
          </div>
        </BlurFade>
      </main>

      <Footer />
    </div>
  );
}
