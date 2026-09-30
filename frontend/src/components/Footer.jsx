import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#969188] pt-16 pb-12 border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#222222]">
          
          {/* Brand & Mission (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#222222] border border-[#333333] flex items-center justify-center">
                <span className="text-[#F6F4EF] font-mono text-xs font-bold">CS</span>
              </div>
              <span className="font-bold text-base text-[#F6F4EF] tracking-tight">CreditSea</span>
            </Link>
            <p className="text-xs text-[#6F6B63] leading-relaxed max-w-sm">
              CreditSea operates an institutional-grade credit management and underwriting interface. We partner with regulated Non-Banking Financial Companies (NBFCs) to deliver structured short-term liquidity to verified salaried professionals.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#222222] text-[#B49A68] text-[10px] font-mono border border-[#333333]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
                RBI Regulated Partner Infrastructure
              </span>
            </div>
          </div>

          {/* Product Facilities (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F6F4EF]">Facilities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/apply" className="hover:text-[#F6F4EF] transition">Direct Cash Advance</Link></li>
              <li><Link to="/calculators" className="hover:text-[#F6F4EF] transition">Facility Calculator</Link></li>
              <li><Link to="/about" className="hover:text-[#F6F4EF] transition">Underwriting Criteria</Link></li>
              <li><Link to="/auth/login" className="hover:text-[#F6F4EF] transition">Client Workspace</Link></li>
            </ul>
          </div>

          {/* Governance & Institutional (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F6F4EF]">Governance & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-[#F6F4EF] transition">RBI Fair Practices Code</a></li>
              <li><a href="#" className="hover:text-[#F6F4EF] transition">Privacy & Data Security Policy</a></li>
              <li><a href="#" className="hover:text-[#F6F4EF] transition">Loan Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-[#F6F4EF] transition">Grievance Redressal Mechanism</a></li>
            </ul>
          </div>

          {/* Regulatory Partner Box (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F6F4EF]">Lending Institution</h4>
            <div className="bg-[#181818] border border-[#2a2a2a] rounded-lg p-3.5 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#B49A68] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#F6F4EF] leading-snug">
                    Meghdoot Mercantile Pvt Ltd
                  </p>
                  <p className="text-[10px] text-[#6F6B63] font-mono mt-0.5">
                    RBI Registered Non-Banking Financial Company (NBFC)
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-[#6F6B63] leading-normal pt-1 border-t border-[#222222]">
                All credit decisions, disbursements, and repayments are settled directly through Meghdoot Mercantile escrow accounts in compliance with RBI guidelines.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[11px] text-[#6F6B63]">
          <p>© {new Date().getFullYear()} CreditSea Platform. All institutional rights reserved.</p>
          <div className="flex flex-wrap gap-5 font-mono text-[10px]">
            <span>CIN: U65923CT1995PTC009412</span>
            <span>Interest Structure: 12% Flat APR</span>
            <span>Escrow: HDFC Bank Ltd</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
