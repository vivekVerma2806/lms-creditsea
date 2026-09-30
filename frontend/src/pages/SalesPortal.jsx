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
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";

export default function SalesPortal() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sales Lead Pipeline</h1>
        <p className="text-gray-500 text-sm mt-1">Audit incoming borrower registrations, track onboarding status, and drive conversion</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Top statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-150 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Registered Leads</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{leads.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">KYC Completed</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{kycCount} Profiles</p>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loan Applications</p>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">{loanAppliedCount} Leads</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Pipeline Filter:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Registered Leads ({leads.length})</option>
            <option value="PROFILE_DONE">KYC Completed ({kycCount})</option>
            <option value="LOAN_APPLIED">Loan Applied ({loanAppliedCount})</option>
            <option value="NO_PROFILE">Registered Only ({leads.length - kycCount})</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-gray-900">Registered Borrower Pipeline</h2>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
            Showing {filteredLeads.length} of {leads.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Fetching leads pipeline...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150 text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Borrower Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Account</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Income Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pipeline Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {filteredLeads.map((lead) => {
                  const profile = lead.profile;
                  const loan = lead.latestLoan;

                  return (
                    <tr key={lead._id} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-650 text-xs font-black uppercase">
                          {lead.name ? lead.name.charAt(0) : "B"}
                        </div>
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold text-xs">
                        <Mail className="w-3.5 h-3.5 text-gray-400 inline mr-1" />
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {profile?.pan ? (
                          <span className="font-mono font-bold text-gray-900 uppercase tracking-wider">
                            {profile.pan}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Pending KYC</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {profile?.monthlySalary ? (
                          <div>
                            <div className="font-bold text-gray-900">₹{profile.monthlySalary.toLocaleString()}/mo</div>
                            <div className="text-[11px] text-gray-400 font-semibold mt-0.5">{profile.employmentMode}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">No salary data</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {loan ? (
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border ${
                              loan.status === 'Approved' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              loan.status === 'Disbursed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              loan.status === 'Closed' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                              loan.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {loan.status === 'Disbursed' ? 'Active Loan' : loan.status}
                            </span>
                            <div className="text-[11px] text-gray-500 font-semibold mt-0.5">
                              ₹{loan.amount.toLocaleString()} ({loan.tenure}d)
                            </div>
                          </div>
                        ) : profile ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                            KYC Ready (No Loan)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-gray-50 text-gray-500 border border-gray-200">
                            Registered Only
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 inline mr-1" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No registered leads match the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
