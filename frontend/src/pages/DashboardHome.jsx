import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../lib/api";
import NumberTicker from "../components/presets/NumberTicker";
import InstitutionalGauge from "../components/presets/InstitutionalGauge";
import BlurFade from "../components/presets/BlurFade";
import { AnimatedList } from "../components/presets/AnimatedList";
import CardSpotlight from "../components/presets/CardSpotlight";
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  Send, 
  CreditCard, 
  ArrowUpRight, 
  RefreshCw,
  Wallet,
  Coins,
  Building,
  Target
} from "lucide-react";

/**
 * DashboardHome
 * Sourced from vibeprompts.dev / 21st.dev / Magic UI / component.gallery
 * Institutional executive command platform with live tickers, gauge, and animated feed
 */
export default function DashboardHome() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.stats);
      setRecentPayments(res.data.recentPayments || []);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Unable to load live portfolio statistics. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setName(localStorage.getItem("name") || "Executive");
    setRole(localStorage.getItem("role") || "Staff");
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 text-[#171717]">
      {/* Executive Command Banner */}
      <BlurFade delay={0.05} yOffset={6}>
        <div className="bg-[#111111] text-[#F6F4EF] rounded-lg p-8 border border-[#222222] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#B49A68]">
                Capital Portfolio Command
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-medium tracking-tight text-white">
              Welcome back, {name}
            </h1>
            <p className="text-xs text-[#969188] font-light mt-1">
              CreditSea Loan Management System · Active Capital Allocation & Underwriting Telemetry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-2"
              title="Refresh Real-time KPIs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#B49A68] ${loading ? 'animate-spin' : ''}`} />
              Sync Ledger
            </button>
            <div className="px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded text-xs font-mono text-[#DDD9D0]">
              Role: <span className="text-[#B49A68]">{role}</span>
            </div>
          </div>
        </div>
      </BlurFade>

      {error && (
        <div className="p-4 bg-[#FBEAEA] border border-[#E8C2C2] text-[#874F4F] rounded text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="underline text-[#874F4F]">Retry Sync</button>
        </div>
      )}

      {/* Primary Institutional KPI Cards with NumberTicker */}
      <BlurFade delay={0.1} yOffset={8}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Disbursed Capital */}
          <CardSpotlight className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Disbursed Capital</span>
              <Wallet className="w-4 h-4 text-[#B49A68]" />
            </div>
            <div>
              <div className="text-2xl font-serif font-medium text-[#171717]">
                {loading ? "..." : (
                  <NumberTicker value={stats?.totalDisbursedCapital || 0} prefix="₹" delay={0.1} />
                )}
              </div>
              <p className="text-xs text-[#6F6B63] font-light mt-1 flex items-center gap-1">
                <span className="font-mono text-[#171717]">{(stats?.disbursed?.count || 0) + (stats?.closed?.count || 0)}</span> lifetime loans funded
              </p>
            </div>
          </CardSpotlight>

          {/* Card 2: Total Collections */}
          <CardSpotlight className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Recovered Capital</span>
              <Coins className="w-4 h-4 text-[#476353]" />
            </div>
            <div>
              <div className="text-2xl font-serif font-medium text-[#476353]">
                {loading ? "..." : (
                  <NumberTicker value={stats?.totalCollectedCapital || 0} prefix="₹" delay={0.15} />
                )}
              </div>
              <p className="text-xs text-[#6F6B63] font-light mt-1 flex items-center gap-1">
                <span className="font-mono text-[#476353] font-medium">{stats?.closed?.count || 0}</span> accounts fully settled
              </p>
            </div>
          </CardSpotlight>

          {/* Card 3: Active Balance Due */}
          <CardSpotlight className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Active Balance Due</span>
              <CreditCard className="w-4 h-4 text-[#A17E43]" />
            </div>
            <div>
              <div className="text-2xl font-serif font-medium text-[#171717]">
                {loading ? "..." : (
                  <NumberTicker value={stats?.totalOutstandingBalance || 0} prefix="₹" delay={0.2} />
                )}
              </div>
              <p className="text-xs text-[#6F6B63] font-light mt-1 flex items-center gap-1">
                Across <span className="font-mono text-[#A17E43] font-medium">{stats?.disbursed?.count || 0}</span> active credit lines
              </p>
            </div>
          </CardSpotlight>

          {/* Card 4: Portfolio Recovery Rate with InstitutionalGauge preset */}
          <CardSpotlight className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63] block">Recovery Ratio</span>
              <div className="text-2xl font-serif font-medium text-[#171717]">
                {loading ? "..." : `${stats?.recoveryRate || 0}%`}
              </div>
              <span className="text-[11px] text-[#476353] font-mono block">Sub-1% NPA Threshold</span>
            </div>
            <InstitutionalGauge
              percentage={stats?.recoveryRate || 98}
              size={56}
              strokeWidth={4}
              showPercent={false}
              color="#476353"
            />
          </CardSpotlight>
        </div>
      </BlurFade>

      {/* Operational Pipeline Workflows */}
      <BlurFade delay={0.15} yOffset={10}>
        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#DDD9D0] pb-4">
            <div>
              <h2 className="text-base font-serif font-medium text-[#171717]">
                Operational Desk Pipeline
              </h2>
              <p className="text-xs text-[#6F6B63] font-light mt-0.5">
                Current lifecycle distribution across origination, underwriting, escrow, and collection desks.
              </p>
            </div>
            <span className="text-xs font-mono text-[#6F6B63]">
              Total Facilities: <strong className="text-[#171717] font-mono">{stats?.totalLoans || 0}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sales Desk */}
            <Link 
              to="/dashboard/sales" 
              className="group p-5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Originated Leads</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#969188] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">{stats?.totalLeads || 0}</div>
                <div className="text-[11px] text-[#6F6B63] font-light mt-0.5">Registered borrower accounts</div>
              </div>
            </Link>

            {/* Sanction Desk */}
            <Link 
              to="/dashboard/sanction" 
              className="group p-5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A17E43]"></span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Underwriting Queue</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#969188] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <div className="text-2xl font-serif font-medium text-[#A17E43] tabular-nums">{stats?.pending?.count || 0} Pending</div>
                <div className="text-[11px] text-[#6F6B63] font-light mt-0.5">
                  Vol: ₹{(stats?.pending?.amount || 0).toLocaleString()} in audit
                </div>
              </div>
            </Link>

            {/* Disbursement Desk */}
            <Link 
              to="/dashboard/disbursement" 
              className="group p-5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Sanctioned Escrow</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#969188] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <div className="text-2xl font-serif font-medium text-[#111111] tabular-nums">{stats?.approved?.count || 0} Ready</div>
                <div className="text-[11px] text-[#6F6B63] font-light mt-0.5">
                  Vol: ₹{(stats?.approved?.amount || 0).toLocaleString()} pending release
                </div>
              </div>
            </Link>

            {/* Collection Desk */}
            <Link 
              to="/dashboard/collection" 
              className="group p-5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#476353]"></span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Active Servicing</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#969188] group-hover:text-[#171717] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div>
                <div className="text-2xl font-serif font-medium text-[#476353] tabular-nums">{stats?.disbursed?.count || 0} Active</div>
                <div className="text-[11px] text-[#6F6B63] font-light mt-0.5">
                  Due: ₹{(stats?.disbursed?.outstanding || 0).toLocaleString()}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </BlurFade>

      {/* Recent Ledger Activity & Regulatory BRE Overview */}
      <BlurFade delay={0.2} yOffset={10}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Repayment Ledger with AnimatedList preset (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDD9D0] pb-3">
              <h3 className="text-base font-serif font-medium text-[#171717]">
                Live Reconciled Escrow Receipts
              </h3>
              <Link to="/dashboard/collection" className="text-xs font-mono text-[#B49A68] hover:underline">
                Collection Desk &rarr;
              </Link>
            </div>

            {recentPayments.length === 0 ? (
              <p className="text-xs text-[#6F6B63] py-8 text-center font-light">No settlement transactions logged yet.</p>
            ) : (
              <AnimatedList delay={1500} className="w-full">
                {recentPayments.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="w-full p-3.5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded flex items-center justify-between transition text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-white border border-[#DDD9D0] flex items-center justify-center font-mono text-[10px] font-bold text-[#476353]">
                        UTR
                      </div>
                      <div>
                        <div className="font-mono font-medium text-[#171717]">{p.utr}</div>
                        <div className="text-[11px] font-mono text-[#6F6B63]">
                          PAN: {p.loanId?.borrowerId?.pan || "RECONCILED"} · {new Date(p.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-[#476353] tabular-nums">
                        +₹{p.amount.toLocaleString()}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-[#476353]">Credited</span>
                    </div>
                  </div>
                ))}
              </AnimatedList>
            )}
          </div>

          {/* Regulatory & Safety Box (5 cols) */}
          <div className="lg:col-span-5 bg-[#111111] text-[#F6F4EF] border border-[#222222] rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#B49A68]" />
              <h3 className="font-serif font-medium text-white text-base">
                Business Rule Engine (BRE)
              </h3>
            </div>
            <div className="space-y-4 text-xs font-light leading-relaxed">
              <div className="bg-[#1A1A1A] p-4 border border-[#333333] rounded space-y-2">
                <p className="text-white font-mono text-[11px] uppercase tracking-wider">Mandatory Underwriting Constraints:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#DDD9D0]">
                  <li>Applicant Age: 23 to 50 Years strictly enforced</li>
                  <li>Monthly Salary Threshold: Minimum ₹25,000 net</li>
                  <li>Employment Verification: Salaried / Valid GST Profile</li>
                  <li>KYC Documents: Cryptographic verification of PAN & Aadhaar</li>
                </ul>
              </div>
              <div className="flex gap-3 text-[#969188]">
                <ShieldCheck className="w-5 h-5 text-[#B49A68] shrink-0 mt-0.5" />
                <p>
                  All operations strictly follow RBI fair-practices code under Meghdoot Mercantile Private Limited (NBFC Partner). Escrow funds held in scheduled commercial banks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
