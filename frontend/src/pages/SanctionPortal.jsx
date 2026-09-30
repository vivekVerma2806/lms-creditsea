import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { Tabs } from "../components/presets/Tabs";
import CircleLoader from "../components/presets/CircleLoader";
import Badge from "../components/presets/Badge";
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
  CheckCircle2,
  Clock,
  Building
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
    if (!confirm("Confirm sanction and credit approval for this applicant?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/sanction/loans/${id}`, 
        { status: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Loan successfully approved and transferred to Escrow Disbursement Desk.");
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
      setSuccess("Loan marked as Adverse/Rejected with audit reason logged.");
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
    <div className="space-y-8 text-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#DDD9D0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
              Underwriting Desk
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#171717]">
            Sanction & Risk Audit Queue
          </h1>
          <p className="text-sm text-[#6F6B63] font-light mt-1">
            Evaluate applicant credit eligibility, review uploaded KYC credentials, and issue sanction decisions.
          </p>
        </div>

        <span className="text-xs font-mono text-[#6F6B63] bg-white border border-[#DDD9D0] px-3 py-1.5 rounded">
          Pending Audit: <strong className="text-[#A17E43] font-mono">{filteredLoans.length}</strong>
        </span>
      </div>

      {success && (
        <div className="p-4 bg-[#EFEFE9] border border-[#CCD8D0] text-[#476353] rounded text-xs font-medium flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-[#476353] font-bold">✕</button>
        </div>
      )}
      {error && (
        <div className="p-4 bg-[#FBEAEA] border border-[#E8C2C2] text-[#874F4F] rounded text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-[#874F4F] font-bold">✕</button>
        </div>
      )}

      {/* Control Bar: Search & Filter */}
      <div className="bg-white rounded-lg p-4 border border-[#DDD9D0] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#969188] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PAN, applicant name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Tabs
            tabs={[
              { id: "ALL", label: "All Applicants" },
              { id: "Salaried", label: "Salaried" },
              { id: "Self-Employed", label: "Self-Employed" }
            ]}
            activeTab={employmentFilter}
            onChange={setEmploymentFilter}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#DDD9D0] rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <CircleLoader size={44} strokeWidth={3} label="Accessing Sanction Queue..." />
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#6F6B63] font-light bg-[#F6F4EF]">
            No loan applications currently awaiting underwriting review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
              <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
                <tr>
                  <th className="px-4 py-3">Applicant & PAN</th>
                  <th className="px-4 py-3">Monthly Net Income</th>
                  <th className="px-4 py-3">Requested Facility</th>
                  <th className="px-4 py-3">Tenure</th>
                  <th className="px-4 py-3">KYC Dossier</th>
                  <th className="px-4 py-3">Applied Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
                {filteredLoans.map((loan) => {
                  const b = loan.borrowerId;
                  const u = b?.userId;
                  const age = calculateAge(b?.dob);

                  return (
                    <tr key={loan._id} className="hover:bg-[#F6F4EF] transition">
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-[#171717]">{u?.name || "N/A"}</div>
                        <div className="text-[11px] font-mono text-[#6F6B63] mt-0.5">
                          PAN: {b?.pan || "PENDING"} {age ? `· Age: ${age}y` : ""}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold tabular-nums">₹{(b?.monthlySalary || 0).toLocaleString()}</div>
                        <div className="text-[11px] text-[#6F6B63] capitalize">{b?.employmentMode || "Salaried"}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold tabular-nums text-[#171717]">
                        ₹{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#6F6B63]">
                        {loan.tenure} Days
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EFEFE9] text-[#476353] border border-[#CCD8D0]">
                          <ShieldCheck className="w-3 h-3" /> Complete
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#6F6B63]">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectingLoan(loan)}
                            className="px-2.5 py-1.5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#B49A68]" /> Inspect
                          </button>
                          <button
                            onClick={() => handleApprove(loan._id)}
                            className="px-2.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 text-[#B49A68]" /> Sanction
                          </button>
                          <button
                            onClick={() => {
                              setRejectingLoanId(loan._id);
                              setRejectionReason("");
                            }}
                            className="px-2 py-1.5 border border-[#DDD9D0] text-[#874F4F] hover:bg-[#FBEAEA] rounded text-xs font-mono uppercase tracking-wider transition"
                          >
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Application Dossier Modal */}
      {inspectingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#DDD9D0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#B49A68] bg-[#FBF6ED] px-2 py-0.5 rounded border border-[#EBDCBF]">
                  Underwriting Assessment
                </span>
                <h3 className="text-xl font-serif font-medium text-[#171717] mt-2">
                  Dossier: {inspectingLoan.borrowerId?.userId?.name || "Applicant"}
                </h3>
                <p className="text-xs text-[#6F6B63]">
                  Facility Request: ₹{inspectingLoan.amount.toLocaleString()} for {inspectingLoan.tenure} Days
                </p>
              </div>
              <button
                onClick={() => setInspectingLoan(null)}
                className="p-1.5 text-[#6F6B63] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            {/* Assessment Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">PAN Reference</div>
                <div className="font-mono font-medium text-[#171717] mt-0.5">{inspectingLoan.borrowerId?.pan || "N/A"}</div>
              </div>
              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Applicant Age</div>
                <div className="font-mono font-medium text-[#171717] mt-0.5">{calculateAge(inspectingLoan.borrowerId?.dob) || "N/A"} Years</div>
              </div>
              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Monthly Salary</div>
                <div className="font-semibold text-[#171717] mt-0.5 tabular-nums">₹{(inspectingLoan.borrowerId?.monthlySalary || 0).toLocaleString()}</div>
              </div>
              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Employer / Business</div>
                <div className="font-medium text-[#171717] mt-0.5">{inspectingLoan.borrowerId?.employerName || "Private Firm"}</div>
              </div>
              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Employment Mode</div>
                <div className="font-medium text-[#171717] mt-0.5">{inspectingLoan.borrowerId?.employmentMode || "Salaried"}</div>
              </div>
              <div className="p-3 bg-[#F6F4EF] rounded border border-[#DDD9D0]">
                <div className="text-[10px] font-mono uppercase text-[#6F6B63]">Total Repayable</div>
                <div className="font-semibold text-[#171717] mt-0.5 tabular-nums">₹{Math.round(inspectingLoan.totalRepayment).toLocaleString()}</div>
              </div>
            </div>

            {/* Document Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Uploaded Financial Artifacts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inspectingLoan.borrowerId?.salarySlipUrl ? (
                  <a
                    href={inspectingLoan.borrowerId.salarySlipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded text-xs flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#B49A68]" />
                      Salary Slip / Bank Proof
                    </span>
                    <Download className="w-3.5 h-3.5 text-[#6F6B63]" />
                  </a>
                ) : (
                  <div className="p-3 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs text-[#969188] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#969188]" />
                    Salary Slip Not Attached
                  </div>
                )}

                {inspectingLoan.borrowerId?.kycDocUrl ? (
                  <a
                    href={inspectingLoan.borrowerId.kycDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] rounded text-xs flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#476353]" />
                      PAN / Identity Document
                    </span>
                    <Download className="w-3.5 h-3.5 text-[#6F6B63]" />
                  </a>
                ) : (
                  <div className="p-3 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs text-[#969188] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#969188]" />
                    Direct KYC Document
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#DDD9D0]">
              <button
                onClick={() => {
                  setRejectingLoanId(inspectingLoan._id);
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-[#DDD9D0] text-[#874F4F] hover:bg-[#FBEAEA] rounded text-xs font-mono uppercase tracking-wider transition"
              >
                Decline Application
              </button>
              <button
                onClick={() => handleApprove(inspectingLoan._id)}
                className="px-5 py-2 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#B49A68]" />
                Approve & Sanction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleRejectSubmit} className="bg-white max-w-md w-full rounded-lg p-6 border border-[#DDD9D0] shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-medium text-[#874F4F]">
              Record Adverse Risk Underwriting Assessment
            </h3>
            <p className="text-xs text-[#6F6B63] font-light">
              Specify the statutory reason for declining this credit advance. This will be officially logged in the client audit trail.
            </p>

            <textarea
              required
              rows={3}
              placeholder="e.g. Salary below regulatory threshold or ambiguous KYC proof"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-[#DDD9D0] rounded text-xs focus:outline-none focus:border-[#111111]"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingLoanId(null)}
                className="px-4 py-2 border border-[#DDD9D0] text-[#6F6B63] rounded text-xs font-mono uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#874F4F] hover:bg-[#723E3E] text-white rounded text-xs font-mono uppercase tracking-wider"
              >
                Confirm Decline
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
