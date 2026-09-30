import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  Check, 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye, 
  User, 
  Mail, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function SanctionPortal() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("ALL");
  const [inspectingLoan, setInspectingLoan] = useState(null);
  const [rejectingLoanId, setRejectingLoanId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/sanction/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching sanction loans", err);
      setError("Failed to fetch pending loans for sanction review.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve and sanction this loan advance?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/sanction/loans/${id}`, 
        { status: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Loan successfully approved and forwarded to Disbursement Desk!");
      setInspectingLoan(null);
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve loan");
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/sanction/loans/${rejectingLoanId}`, 
        { status: "Rejected", rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Loan successfully marked as Rejected.");
      setRejectingLoanId(null);
      setInspectingLoan(null);
      setRejectionReason("");
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject loan");
    }
  };

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const pan = (loan.borrowerId?.pan || "").toLowerCase();
      const name = (loan.borrowerId?.userId?.name || "").toLowerCase();
      const email = (loan.borrowerId?.userId?.email || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || pan.includes(q) || name.includes(q) || email.includes(q);
      const matchesEmp = employmentFilter === "ALL" || loan.borrowerId?.employmentMode === employmentFilter;

      return matchesSearch && matchesEmp;
    });
  }, [loans, searchQuery, employmentFilter]);

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    const diff = Date.now() - new Date(dobString).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sanction Audit Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Audit applicant creditworthiness, verify KYC documents, and approve credit lines</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-900 font-extrabold">✕</button>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-900 font-extrabold">✕</button>
        </div>
      )}

      {/* Control Bar: Search & Filter */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PAN, applicant name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Employment:</span>
          </div>
          <select
            value={employmentFilter}
            onChange={(e) => setEmploymentFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Profiles ({loans.length})</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
          </select>
        </div>
      </div>

      {/* Sanction Audit Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-gray-900">Pending Sanction Audit Queue</h2>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
            Showing {filteredLoans.length} of {loans.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Loading audit queue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150 text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applicant & Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">PAN & Age</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Salary</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Requested Advance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Salary Slip</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {filteredLoans.map((loan) => {
                  const borrower = loan.borrowerId;
                  const user = borrower?.userId;
                  const age = calculateAge(borrower?.dob);
                  const isAgeCompliant = age >= 23 && age <= 50;

                  return (
                    <tr key={loan._id} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{user?.name || "Applicant"}</div>
                        <div className="text-xs text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {user?.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-gray-900 uppercase tracking-wider">{borrower?.pan || "N/A"}</div>
                        <div className="text-[11px] text-gray-500 font-semibold mt-0.5 flex items-center gap-1">
                          <span>Age: {age ? `${age} yrs` : "N/A"}</span>
                          {age && (
                            isAgeCompliant ? (
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">BRE Pass</span>
                            ) : (
                              <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">BRE Flag</span>
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">₹{(borrower?.monthlySalary || 0).toLocaleString()}</div>
                        <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                          {borrower?.employmentMode || "Salaried"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-blue-650">₹{loan.amount.toLocaleString()}</div>
                        <div className="text-[11px] text-gray-450 mt-0.5 font-bold">
                          Tenure: {loan.tenure} Days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {borrower?.salarySlipUrl ? (
                          <a
                            href={`${API_URL}${borrower.salarySlipUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold transition"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Slip <Download className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-gray-350" /> No Slip Uploaded
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInspectingLoan(loan)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                            title="Detailed Audit View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(loan._id)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition"
                            title="Sanction & Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setRejectingLoanId(loan._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-xl transition"
                            title="Reject Advance"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No matching advances requiring sanction review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Loan Audit Drawer Modal */}
      {inspectingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Underwriting Audit
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {inspectingLoan.borrowerId?.userId?.name || "Applicant Profile"}
                </h3>
                <p className="text-xs text-gray-400 font-medium">{inspectingLoan.borrowerId?.userId?.email}</p>
              </div>
              <button
                onClick={() => setInspectingLoan(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Loan Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-400 font-bold uppercase">Requested Amount</span>
                <div className="text-2xl font-black text-blue-600 mt-1">₹{inspectingLoan.amount.toLocaleString()}</div>
                <div className="text-[11px] text-gray-500 font-semibold mt-0.5">Tenure: {inspectingLoan.tenure} days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-xs text-gray-400 font-bold uppercase">Total Repayment Due</span>
                <div className="text-2xl font-black text-gray-800 mt-1">₹{Math.round(inspectingLoan.totalRepayment).toLocaleString()}</div>
                <div className="text-[11px] text-gray-500 font-semibold mt-0.5">12% APR Simple Interest</div>
              </div>
            </div>

            {/* KYC & Underwriting Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">KYC & Compliance Verification</h4>
              
              <div className="bg-white border border-gray-150 rounded-2xl p-4 divide-y divide-gray-100 text-xs font-semibold">
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500">Permanent Account Number (PAN):</span>
                  <span className="font-mono font-bold uppercase text-gray-900">{inspectingLoan.borrowerId?.pan}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500">Date of Birth & Age:</span>
                  <span className="font-bold text-gray-900">
                    {new Date(inspectingLoan.borrowerId?.dob).toLocaleDateString()} ({calculateAge(inspectingLoan.borrowerId?.dob)} years)
                  </span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500">Verified Monthly Salary:</span>
                  <span className="font-bold text-emerald-600">₹{(inspectingLoan.borrowerId?.monthlySalary || 0).toLocaleString()}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500">Employment Mode:</span>
                  <span className="font-bold text-gray-900">{inspectingLoan.borrowerId?.employmentMode}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-gray-500">Salary Slip Document:</span>
                  {inspectingLoan.borrowerId?.salarySlipUrl ? (
                    <a
                      href={`${API_URL}${inspectingLoan.borrowerId.salarySlipUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Attached Document
                    </a>
                  ) : (
                    <span className="text-red-500 font-bold">No Document Provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons in Drawer */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setRejectingLoanId(inspectingLoan._id);
                }}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-2xl border border-red-200 transition"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => handleApprove(inspectingLoan._id)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-200 transition"
              >
                Approve & Sanction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingLoanId && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleRejectSubmit} className="bg-white max-w-md w-full rounded-3xl p-6 border border-gray-150 shadow-2xl relative space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Specify Rejection Reason
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Audit Rejection Details</label>
              <textarea
                required
                rows={4}
                placeholder="e.g. Inconsistent salary documentation or unverified PAN card details..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingLoanId(null);
                  setRejectionReason("");
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
              >
                Confirm Reject
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
