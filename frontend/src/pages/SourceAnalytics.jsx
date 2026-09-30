import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  Globe, 
  Share2, 
  Building2, 
  Layers, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  PieChart,
  BarChart2
} from "lucide-react";

export default function SourceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState("ALL");

  const sources = [
    { 
      name: "Direct Institutional Portal", 
      type: "Web / Mobile Web",
      volume: "1,420", 
      sanctioned: "890", 
      conversion: "62.7%", 
      capitalDisbursed: "₹18.4 Cr", 
      avgTicket: "₹45,000",
      npaRatio: "0.4%", 
      quality: "Tier 1 Prime" 
    },
    { 
      name: "Meghdoot NBFC API Rail", 
      type: "Partner Integration",
      volume: "850", 
      sanctioned: "612", 
      conversion: "72.0%", 
      capitalDisbursed: "₹12.2 Cr", 
      avgTicket: "₹65,000",
      npaRatio: "0.6%", 
      quality: "Tier 1 Prime" 
    },
    { 
      name: "Corporate Salary Alliances", 
      type: "B2B Payroll Tie-up",
      volume: "640", 
      sanctioned: "540", 
      conversion: "84.3%", 
      capitalDisbursed: "₹9.8 Cr", 
      avgTicket: "₹55,000",
      npaRatio: "0.2%", 
      quality: "Ultra Prime" 
    },
    { 
      name: "DSA Broker Network", 
      type: "Certified Sourcing Agents",
      volume: "510", 
      sanctioned: "295", 
      conversion: "57.8%", 
      capitalDisbursed: "₹6.4 Cr", 
      avgTicket: "₹38,000",
      npaRatio: "1.1%", 
      quality: "Standard" 
    },
  ];

  return (
    <div className="space-y-8 text-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#DDD9D0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
              Acquisition & Channel Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#171717]">
            Source & Origination Channel Analytics
          </h1>
          <p className="text-sm text-[#6F6B63] font-light mt-1">
            Deep-dive audit into credit application origination channels, partner APIs, underwriting conversion, and credit quality.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#DDD9D0] rounded p-1">
          {["ALL", "DIRECT", "API", "CORPORATE"].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition ${
                selectedChannel === ch
                  ? "bg-[#111111] text-white"
                  : "text-[#6F6B63] hover:text-[#171717]"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Total Originated Leads</span>
          <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">3,420</div>
          <p className="text-xs text-[#476353] font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.8% MoM Origination
          </p>
        </div>

        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Blended Underwriting Conv.</span>
          <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">68.3%</div>
          <p className="text-xs text-[#6F6B63] font-light">Algorithmic BRE Pass Rate</p>
        </div>

        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Originated Capital</span>
          <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">₹46.8 Cr</div>
          <p className="text-xs text-[#6F6B63] font-light">Disbursed via Escrow Rails</p>
        </div>

        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Blended Sourcing CAC</span>
          <div className="text-2xl font-serif font-medium text-[#476353] tabular-nums">₹412 / Acct</div>
          <p className="text-xs text-[#6F6B63] font-light">Sub-benchmark acquisition</p>
        </div>
      </div>

      {/* Channel Attribution Matrix */}
      <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#DDD9D0] gap-2">
          <div>
            <h2 className="text-base font-serif font-medium text-[#171717]">
              Origination Channel Performance Breakdown
            </h2>
            <p className="text-xs text-[#6F6B63] font-light mt-0.5">
              Comparative matrix of applicant volume, underwriting conversion, and portfolio credit quality.
            </p>
          </div>
          <span className="text-xs font-mono text-[#6F6B63]">
            Active Channels: 4 Sourcing Rails
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
            <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
              <tr>
                <th className="px-4 py-3">Sourcing Rail</th>
                <th className="px-4 py-3">Channel Type</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Sanctioned</th>
                <th className="px-4 py-3">Conversion Rate</th>
                <th className="px-4 py-3">Disbursed Volume</th>
                <th className="px-4 py-3">Avg Ticket</th>
                <th className="px-4 py-3">Portfolio NPA</th>
                <th className="px-4 py-3">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
              {sources.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#F6F4EF] transition">
                  <td className="px-4 py-3.5 font-medium">{s.name}</td>
                  <td className="px-4 py-3.5 text-[#6F6B63]">{s.type}</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums">{s.volume}</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums text-[#476353]">{s.sanctioned}</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums font-semibold">{s.conversion}</td>
                  <td className="px-4 py-3.5 font-mono font-medium">{s.capitalDisbursed}</td>
                  <td className="px-4 py-3.5 font-mono text-[#6F6B63]">{s.avgTicket}</td>
                  <td className="px-4 py-3.5 font-mono text-[#476353]">{s.npaRatio}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EFEFE9] text-[#476353] border border-[#CCD8D0]">
                      <ShieldCheck className="w-3 h-3" />
                      {s.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Security Notice */}
      <div className="bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-white border border-[#DDD9D0] flex items-center justify-center text-[#111111]">
            <ShieldCheck className="w-4 h-4 text-[#B49A68]" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#171717]">Data Privacy & Partner Security Mandate</h4>
            <p className="text-xs text-[#6F6B63] font-light">
              All partner sourcing APIs adhere to ISO 27001 standards and RBI Digital Lending Guidelines. Zero PII is shared with unauthorized third parties.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#6F6B63] px-3 py-1 rounded bg-white border border-[#DDD9D0] shrink-0 hidden sm:inline-block">
          Audit Grade: SOC2 Type II
        </span>
      </div>
    </div>
  );
}
