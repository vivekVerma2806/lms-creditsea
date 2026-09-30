import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  Target, 
  TrendingUp, 
  Award, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  Layers
} from "lucide-react";

export default function TargetAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("OCT_2026");

  useEffect(() => {
    const fetchTargetData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch target telemetry", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTargetData();
  }, []);

  // Performance calculations against target benchmarks
  const monthlyDisbursementTarget = 50000000; // ₹5.00 Cr
  const actualDisbursed = stats?.totalDisbursedCapital || 38450000;
  const disbursementPct = Math.min(100, Math.round((actualDisbursed / monthlyDisbursementTarget) * 100));

  const monthlyCollectionTarget = 30000000; // ₹3.00 Cr
  const actualCollected = stats?.totalCollectedCapital || 24800000;
  const collectionPct = Math.min(100, Math.round((actualCollected / monthlyCollectionTarget) * 100));

  const teamQuota = [
    { id: "EQ-101", officer: "Vikram Malhotra", desk: "Capital Sanction", target: "₹1.50 Cr", achieved: "₹1.42 Cr", pct: 94.6, status: "On Track" },
    { id: "EQ-102", officer: "Priya Sundaram", desk: "Escrow Disbursement", target: "₹1.20 Cr", achieved: "₹1.15 Cr", pct: 95.8, status: "On Track" },
    { id: "EQ-103", officer: "Arjun Nair", desk: "Collection & Recovery", target: "₹90.0 L", achieved: "₹88.5 L", pct: 98.3, status: "Exceeded" },
    { id: "EQ-104", officer: "Ananya Deshmukh", desk: "Enterprise Sales", target: "₹1.40 Cr", achieved: "₹1.12 Cr", pct: 80.0, status: "Needs Focus" },
  ];

  return (
    <div className="space-y-8 text-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#DDD9D0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
              Institutional Performance Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#171717]">
            Capital Targets & Quota Desk
          </h1>
          <p className="text-sm text-[#6F6B63] font-light mt-1">
            Executive tracking of monthly credit origination, disbursement quotas, and portfolio recovery benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#DDD9D0] rounded p-1">
          {["SEP_2026", "OCT_2026", "Q3_FY27"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition ${
                selectedPeriod === p
                  ? "bg-[#111111] text-white"
                  : "text-[#6F6B63] hover:text-[#171717]"
              }`}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Target KPI Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Disbursement Target */}
        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Disbursement Quota</span>
            <span className="text-xs font-mono font-medium text-[#476353] bg-[#EFEFE9] px-2 py-0.5 rounded border border-[#CCD8D0]">
              {disbursementPct}% Met
            </span>
          </div>
          <div>
            <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">
              ₹{(actualDisbursed / 10000000).toFixed(2)} Cr
            </div>
            <div className="text-xs text-[#6F6B63] mt-1 font-light flex justify-between">
              <span>Target: ₹{(monthlyDisbursementTarget / 10000000).toFixed(2)} Cr</span>
              <span className="font-mono text-[#874F4F]">
                Remaining: ₹{((monthlyDisbursementTarget - actualDisbursed) / 10000000).toFixed(2)} Cr
              </span>
            </div>
          </div>
          <div className="w-full bg-[#EEEBE4] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#111111] h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${disbursementPct}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Recovery Quota */}
        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Collection Target</span>
            <span className="text-xs font-mono font-medium text-[#476353] bg-[#EFEFE9] px-2 py-0.5 rounded border border-[#CCD8D0]">
              {collectionPct}% Met
            </span>
          </div>
          <div>
            <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">
              ₹{(actualCollected / 10000000).toFixed(2)} Cr
            </div>
            <div className="text-xs text-[#6F6B63] mt-1 font-light flex justify-between">
              <span>Target: ₹{(monthlyCollectionTarget / 10000000).toFixed(2)} Cr</span>
              <span className="font-mono text-[#476353]">
                Settled to Escrow
              </span>
            </div>
          </div>
          <div className="w-full bg-[#EEEBE4] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#476353] h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${collectionPct}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Portfolio Health Index */}
        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Overall Recovery Ratio</span>
            <span className="text-xs font-mono font-medium text-[#B49A68] bg-[#FBF6ED] px-2 py-0.5 rounded border border-[#EBDCBF]">
              Prime Tier
            </span>
          </div>
          <div>
            <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">
              {stats?.recoveryRate || 98.4}%
            </div>
            <div className="text-xs text-[#6F6B63] mt-1 font-light flex justify-between">
              <span>Non-Performing Assets (NPA)</span>
              <span className="font-mono font-medium text-[#476353]">0.82% (Sub-1% Cap)</span>
            </div>
          </div>
          <div className="w-full bg-[#EEEBE4] rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#B49A68] h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${stats?.recoveryRate || 98.4}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Team Quota Allocation Ledger */}
      <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#DDD9D0] gap-2">
          <div>
            <h2 className="text-base font-serif font-medium text-[#171717]">
              Desk Officer Quotas & Monthly Attainment Ledger
            </h2>
            <p className="text-xs text-[#6F6B63] font-light mt-0.5">
              Individual underwriting, disbursement, and recovery allocations monitored under institutional governance.
            </p>
          </div>
          <span className="text-xs font-mono text-[#6F6B63]">
            Active Officers: {teamQuota.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
            <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
              <tr>
                <th className="px-4 py-3">Officer Code</th>
                <th className="px-4 py-3">Desk Officer</th>
                <th className="px-4 py-3">Operational Division</th>
                <th className="px-4 py-3">Target Quota</th>
                <th className="px-4 py-3">Realized Volume</th>
                <th className="px-4 py-3">Attainment (%)</th>
                <th className="px-4 py-3">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
              {teamQuota.map((m) => (
                <tr key={m.id} className="hover:bg-[#F6F4EF] transition">
                  <td className="px-4 py-3.5 font-mono text-[#969188]">{m.id}</td>
                  <td className="px-4 py-3.5 font-medium">{m.officer}</td>
                  <td className="px-4 py-3.5 text-[#6F6B63]">{m.desk}</td>
                  <td className="px-4 py-3.5 font-mono text-[#171717]">{m.target}</td>
                  <td className="px-4 py-3.5 font-mono font-medium text-[#476353]">{m.achieved}</td>
                  <td className="px-4 py-3.5 font-mono tabular-nums font-semibold">{m.pct}%</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      m.pct >= 95
                        ? "bg-[#EFEFE9] text-[#476353] border-[#CCD8D0]"
                        : "bg-[#FBF6ED] text-[#A17E43] border-[#EBDCBF]"
                    }`}>
                      {m.pct >= 95 ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Governance Principles */}
      <div className="bg-[#111111] text-[#F6F4EF] border border-[#222222] rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#B49A68]" />
            <h3 className="font-serif font-medium text-white text-base">Prudential Capital Underwriting Safeguards</h3>
          </div>
          <p className="text-xs text-[#969188] font-light max-w-2xl leading-relaxed">
            In compliance with RBI lending regulations, volume quota targets do not override credit risk scoring thresholds. Every advance requires mandatory verification of income and clean CIBIL history.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#B49A68]">Risk Tolerance Band</div>
          <div className="text-base font-serif font-medium text-white mt-0.5">Tier 1 Institutional Prime</div>
        </div>
      </div>
    </div>
  );
}
