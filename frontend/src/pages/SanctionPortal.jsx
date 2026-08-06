import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { Check, X, FileText, Download, ShieldCheck, AlertCircle } from "lucide-react";

export default function SanctionPortal() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingLoanId, setRejectingLoanId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/sanction/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching sanction loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve/sanction this loan?")) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/sanction/loans/${id}`, 
        { status: "Approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve loan");
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/sanction/loans/${rejectingLoanId}`, 
        { status: "Rejected", rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectingLoanId(null);
      setRejectionReason("");
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject loan");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-955">Sanction Audit Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Audit creditworthiness documents and sanction credit lines</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">{error}</div>}

      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="font-extrabold text-base text-gray-900">Pending Sanction Audit Queue</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Loading audit queue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Net Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Requested Loan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Salary Document</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 uppercase">{loan.borrowerId?.pan}</div>
                      <div className="text-[11px] text-gray-400 font-bold mt-0.5">
                        DOB: {new Date(loan.borrowerId?.dob).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">₹{loan.borrowerId?.monthlySalary?.toLocaleString()}</div>
                      <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                        {loan.borrowerId?.employmentMode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-extrabold text-blue-650">₹{loan.amount.toLocaleString()}</div>
                      <div className="text-[11px] text-gray-450 mt-0.5 font-bold">
                        Tenure: {loan.tenure} Days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loan.borrowerId?.salarySlipUrl ? (
                        <a
                          href={`${API_URL}${loan.borrowerId.salarySlipUrl}`}
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(loan._id)}
                          className="p-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl transition"
                          title="Sanction & Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setRejectingLoanId(loan._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-xl transition"
                          title="Reject Advance"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No pending advances requiring sanction review.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingLoanId && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleRejectSubmit} className="bg-white max-w-md w-full rounded-3xl p-6 border border-gray-150 shadow-2xl relative animate-scaleUp space-y-4">
            <h3 className="text-lg font-bold text-gray-950">Specify Rejection Reason</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Audit Rejection Details</label>
              <textarea
                required
                rows={4}
                placeholder="e.g. Salary slip mismatch or PAN document invalid..."
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
                className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-750 transition"
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
