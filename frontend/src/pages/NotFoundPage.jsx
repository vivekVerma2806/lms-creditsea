import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, FileQuestion, ShieldCheck } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] mb-2">
            <FileQuestion className="w-8 h-8 text-[#B49A68] stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono tracking-widest uppercase text-[#6F6B63]">
              Error Code 404 · Unresolved Resource
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight text-[#171717]">
              Facility Record Not Located
            </h1>
            <p className="text-sm text-[#6F6B63] font-light max-w-md mx-auto leading-relaxed">
              The financial document, desk portal, or ledger address requested does not exist or has been archived under statutory compliance guidelines.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B49A68]" />
              <span>Return to Institutional Desk</span>
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#DDD9D0] text-[#171717] hover:border-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center justify-center"
            >
              Inquire with Grievance Officer
            </Link>
          </div>

          <div className="pt-8 border-t border-[#DDD9D0] flex items-center justify-center gap-2 text-xs font-mono text-[#969188]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B49A68]" />
            Meghdoot Mercantile NBFC Escrow Banking Rail
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
