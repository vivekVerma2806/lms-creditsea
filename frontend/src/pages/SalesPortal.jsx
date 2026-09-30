import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  Users, 
  Calendar, 
  Mail, 
  FileCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  Eye,
  ShieldCheck
} from "lucide-react";

export default function SalesPortal() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [inspectingLead, setInspectingLead] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/dashboard/sales/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeads(res.data.leads || []);
      } catch (err) {
        console.error("Error fetching leads", err);
        setError("Failed to fetch registered borrower leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const name = (lead.name || "").toLowerCase();
      const email = (lead.email || "").toLowerCase();
      const pan = (lead.profile?.pan || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || pan.includes(q);

      let matchesFilter = true;
      if (statusFilter === "PROFILE_DONE") {
        matchesFilter = !!lead.profile;
      } else if (statusFilter === "NO_PROFILE") {
        matchesFilter = !lead.profile;
      } else if (statusFilter === "LOAN_APPLIED") {
        matchesFilter = !!lead.latestLoan;
      }

      return matchesSearch && matchesFilter;
    });
  }, [leads, searchQuery, statusFilter]);

  const kycCount = leads.filter(l => !!l.profile).length;
  const loanAppliedCount = leads.filter(l => !!l.latestLoan).length;

  return (
    <div className="space-y-8 text-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#DDD9D0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
              Acquisition & Conversion Desk
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#171717]">
            Sales Lead Pipeline
          </h1>
          <p className="text-sm text-[#6F6B63] font-light mt-1">
            Track borrower registrations, monitor identity profile completion, and accelerate credit facility origination.
          </p>
        </div>

        <span className="text-xs font-mono text-[#6F6B63] bg-white border border-[#DDD9D0] px-3 py-1.5 rounded">
          Total Leads Registered: <strong className="text-[#171717] font-mono">{leads.length}</strong>
        </span>
      </div>

      {error && (
        <div className="p-4 bg-[#FBEAEA] border border-[#E8C2C2] text-[#874F4F] rounded text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Top statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Total Inbound Leads</span>
            <Users className="w-4 h-4 text-[#B49A68]" />
          </div>
          <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">{leads.length}</div>
          <p className="text-xs text-[#6F6B63] font-light">Direct and Partner API origination</p>
        </div>

        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">KYC Completed Profiles</span>
            <ShieldCheck className="w-4 h-4 text-[#476353]" />
          </div>
          <div className="text-2xl font-serif font-medium text-[#476353] tabular-nums">{kycCount}</div>
          <p className="text-xs text-[#6F6B63] font-light">PAN & Salary Slip Verified</p>
        </div>

        <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Active Loan Requests</span>
            <CreditCard className="w-4 h-4 text-[#111111]" />
          </div>
          <div className="text-2xl font-serif font-medium text-[#171717] tabular-nums">{loanAppliedCount}</div>
          <p className="text-xs text-[#6F6B63] font-light">Submitted to underwriting queue</p>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white rounded-lg p-4 border border-[#DDD9D0] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#969188] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-[#6F6B63] shrink-0">Filter:</span>
          {[
            { id: "ALL", label: "All" },
            { id: "PROFILE_DONE", label: "KYC Verified" },
            { id: "NO_PROFILE", label: "Pending Profile" },
            { id: "LOAN_APPLIED", label: "Applied Loan" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition shrink-0 ${
                statusFilter === tab.id
                  ? "bg-[#111111] text-white"
                  : "bg-[#F6F4EF] border border-[#DDD9D0] text-[#6F6B63] hover:text-[#171717]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-[#DDD9D0] rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-[#6F6B63] mt-3">Accessing Lead Pipeline...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#6F6B63] font-light bg-[#F6F4EF]">
            No lead records matching the selected search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
              <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
                <tr>
                  <th className="px-4 py-3">Lead Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Tax PAN</th>
                  <th className="px-4 py-3">Monthly Income</th>
                  <th className="px-4 py-3">Onboarding State</th>
                  <th className="px-4 py-3">Facility Status</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
                {filteredLeads.map((lead) => {
                  const prof = lead.profile;
                  const loan = lead.latestLoan;

                  return (
                    <tr key={lead._id} className="hover:bg-[#F6F4EF] transition">
                      <td className="px-4 py-3.5 font-medium">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3.5 text-[#6F6B63] font-mono">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        {prof?.pan || <span className="text-[#969188]">Unregistered</span>}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums">
                        {prof?.monthlySalary ? `₹${prof.monthlySalary.toLocaleString()}` : <span className="text-[#969188]">-</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        {prof ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EFEFE9] text-[#476353] border border-[#CCD8D0]">
                            <CheckCircle2 className="w-3 h-3" /> Dossier Complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FBF6ED] text-[#A17E43] border border-[#EBDCBF]">
                            <Clock className="w-3 h-3" /> Needs Follow-up
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {loan ? (
                          <span className="font-mono text-xs font-semibold tabular-nums text-[#171717]">
                            ₹{loan.amount.toLocaleString()} ({loan.status})
                          </span>
                        ) : (
                          <span className="text-[#969188] text-[11px] font-light">No Application</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setInspectingLead(lead)}
                          className="px-2.5 py-1 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B49A68]" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Lead Modal */}
      {inspectingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-2xl relative space-y-5 animate-scaleUp">
            <div className="flex justify-between items-start border-b border-[#DDD9D0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B49A68] bg-[#FBF6ED] px-2 py-0.5 rounded border border-[#EBDCBF]">
                  Lead Detail Record
                </span>
                <h3 className="text-xl font-serif font-medium text-[#171717] mt-2">
                  {inspectingLead.name}
                </h3>
                <p className="text-xs text-[#6F6B63] font-mono">{inspectingLead.email}</p>
              </div>
              <button
                onClick={() => setInspectingLead(null)}
                className="p-1.5 text-[#6F6B63] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                  <div className="text-[10px] font-mono uppercase text-[#6F6B63]">PAN Verification</div>
                  <div className="font-mono font-medium text-[#171717] mt-0.5">{inspectingLead.profile?.pan || "Not Provided"}</div>
                </div>
                <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                  <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Monthly Salary</div>
                  <div className="font-semibold text-[#171717] mt-0.5 tabular-nums">
                    {inspectingLead.profile?.monthlySalary ? `₹${inspectingLead.profile.monthlySalary.toLocaleString()}` : "Not Disclosed"}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Employer Profile</div>
                <div className="font-medium text-[#171717] mt-0.5">
                  {inspectingLead.profile?.employerName || "Individual / Self-Employed"}
                </div>
              </div>

              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Latest Application State</div>
                <div className="font-medium text-[#171717] mt-0.5">
                  {inspectingLead.latestLoan ? (
                    <span>Advance of ₹{inspectingLead.latestLoan.amount.toLocaleString()} ({inspectingLead.latestLoan.status})</span>
                  ) : (
                    <span className="text-[#969188]">No loan applications initiated by user yet.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingLead(null)}
                className="px-5 py-2 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#222222] transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
