import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  ShieldCheck, 
  ShieldAlert, 
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
  Coins
} from "lucide-react";

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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/10 text-blue-200 border border-white/10">
              Operations Control Center
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Welcome back, {name}!
          </h1>
          <p className="text-blue-100 text-sm mt-1 font-medium">
            CreditSea Loan Management System · Portfolio Performance & Desk Workflows
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition border border-white/10 flex items-center gap-2 text-xs font-bold"
            title="Refresh Real-time KPIs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-2xl text-xs font-black uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-amber-300" /> Authorized {role} Access
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="underline text-red-800">Try Again</button>
        </div>
      )}

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Disbursed Capital */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Disbursed Capital</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {loading ? "..." : `₹${(stats?.totalDisbursedCapital || 0).toLocaleString()}`}
            </h3>
            <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1">
              <span className="text-blue-600 font-bold">{(stats?.disbursed?.count || 0) + (stats?.closed?.count || 0)}</span> lifetime loans funded
            </p>
          </div>
        </div>

        {/* Card 2: Total Collections */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Repayments Recovered</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-600 tracking-tight">
              {loading ? "..." : `₹${(stats?.totalCollectedCapital || 0).toLocaleString()}`}
            </h3>
            <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">{stats?.closed?.count || 0}</span> loans completely settled
            </p>
          </div>
        </div>

        {/* Card 3: Active Balance Due */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Balance Due</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-amber-600 tracking-tight">
              {loading ? "..." : `₹${(stats?.totalOutstandingBalance || 0).toLocaleString()}`}
            </h3>
            <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1">
              Across <span className="text-amber-600 font-bold">{stats?.disbursed?.count || 0}</span> active credit lines
            </p>
          </div>
        </div>

        {/* Card 4: Portfolio Recovery Rate */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recovery Ratio</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-purple-600 tracking-tight">
              {loading ? "..." : `${stats?.recoveryRate || 0}%`}
            </h3>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats?.recoveryRate || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Pipeline Workflows */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Operational Desk Pipeline
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Real-time breakdown of loan stages across all organizational desks</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            Total Loans Managed: <strong className="text-gray-900">{stats?.totalLoans || 0}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sales Desk Pipeline */}
          <Link 
            to="/dashboard/sales" 
            className="group p-5 bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-gray-700 uppercase">Sales (Leads)</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{stats?.totalLeads || 0}</div>
              <div className="text-[11px] text-gray-400 font-semibold mt-0.5">Registered borrower accounts</div>
            </div>
          </Link>

          {/* Sanction Desk Pipeline */}
          <Link 
            to="/dashboard/sanction" 
            className="group p-5 bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border border-amber-100 hover:border-amber-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-700 uppercase">Sanction Queue</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">{stats?.pending?.count || 0} Pending</div>
              <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Vol: ₹{(stats?.pending?.amount || 0).toLocaleString()} in audit
              </div>
            </div>
          </Link>

          {/* Disbursement Desk Pipeline */}
          <Link 
            to="/dashboard/disbursement" 
            className="group p-5 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-xs font-bold text-gray-700 uppercase">Ready to Disburse</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-600">{stats?.approved?.count || 0} Sanctioned</div>
              <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Vol: ₹{(stats?.approved?.amount || 0).toLocaleString()} ready for release
              </div>
            </div>
          </Link>

          {/* Collection Desk Pipeline */}
          <Link 
            to="/dashboard/collection" 
            className="group p-5 bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-gray-700 uppercase">Active Collection</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{stats?.disbursed?.count || 0} Active</div>
              <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Due: ₹{(stats?.disbursed?.outstanding || 0).toLocaleString()}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity & Regulatory Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Repayment Ledger Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-150 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Coins className="w-4.5 h-4.5 text-blue-600" />
              Latest Repayment Transactions
            </h3>
            <Link to="/dashboard/collection" className="text-xs font-extrabold text-blue-600 hover:underline">
              View Collection Desk &rarr;
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No payment transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="pb-2 font-bold uppercase">UTR Reference</th>
                    <th className="pb-2 font-bold uppercase">PAN / Account</th>
                    <th className="pb-2 font-bold uppercase">Amount Settled</th>
                    <th className="pb-2 font-bold uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {recentPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 font-mono font-bold text-gray-900">{p.utr}</td>
                      <td className="py-3 uppercase font-semibold text-gray-600">{p.loanId?.borrowerId?.pan || "N/A"}</td>
                      <td className="py-3 font-extrabold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3 text-gray-400">{new Date(p.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Regulatory & Safety Box (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-950 text-indigo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Regulatory Compliance (BRE)
          </h3>
          <div className="space-y-4 text-xs font-semibold leading-relaxed">
            <div className="bg-indigo-950/40 p-4 border border-indigo-800/40 rounded-2xl space-y-2">
              <p className="text-white font-bold">Business Rule Engine (BRE) Parameters:</p>
              <ul className="list-disc pl-4 space-y-1 text-indigo-300">
                <li>Applicant Age: 23 to 50 Years</li>
                <li>Salary Level: Minimum ₹25,000 / month</li>
                <li>Employment Status: Salaried / Self-Employed</li>
                <li>Files Format: PDF, JPG, PNG under 5MB</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
              <p className="text-indigo-300">
                Our operations comply fully with RBI guidelines. All transactions are securely routed through NBFC partner escrow mechanisms under Meghdoot Mercantile Private Limited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
