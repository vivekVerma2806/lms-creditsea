import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  Send, 
  Calendar, 
  ShieldCheck, 
  CheckCircle, 
  Search, 
  Mail, 
  User, 
  Wallet,
  AlertCircle
} from "lucide-react";

export default function DisbursementPortal() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisburseLoan, setSelectedDisburseLoan] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/disbursement/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching approved loans", err);
      setError("Failed to fetch loans awaiting disbursement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDisburseConfirm = async () => {
    if (!selectedDisburseLoan) return;
    setError("");
    setSuccess("");
    setProcessing(true);
    
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/disbursement/loans/${selectedDisburseLoan._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Funds of ₹${selectedDisburseLoan.amount.toLocaleString()} successfully released to ${selectedDisburseLoan.borrowerId?.userId?.name || "the borrower"}!`);
      setSelectedDisburseLoan(null);
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to disburse loan funds");
    } finally {
      setProcessing(false);
    }
  };

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const pan = (loan.borrowerId?.pan || "").toLowerCase();
      const name = (loan.borrowerId?.userId?.name || "").toLowerCase();
      const email = (loan.borrowerId?.userId?.email || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      return !q || pan.includes(q) || name.includes(q) || email.includes(q);
    });
  }, [loans, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Disbursement Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Review sanctioned loans, verify escrow payout parameters, and release capital</p>
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

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PAN, borrower name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs font-bold text-gray-500">
          Awaiting Payout: <strong className="text-indigo-600">{filteredLoans.length} Loans</strong>
        </div>
      </div>

      {/* Disbursement Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-gray-900">Approved Loan Disbursement Queue</h2>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
            Total Capital in Queue: ₹{loans.reduce((acc, l) => acc + (l.amount || 0), 0).toLocaleString()}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Loading disbursement queue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150 text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Borrower Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Account</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sanctioned Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sanctioned Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {filteredLoans.map((loan) => {
                  const borrower = loan.borrowerId;
                  const user = borrower?.userId;

                  return (
                    <tr key={loan._id} className="hover:bg-indigo-50/20 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{user?.name || "Borrower"}</div>
                        <div className="text-xs text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {user?.email || "No email"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-900 uppercase">
                        {borrower?.pan || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-indigo-650">₹{loan.amount.toLocaleString()}</div>
                        <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                          Tenure: {loan.tenure} Days · Repayable: ₹{Math.round(loan.totalRepayment).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold text-xs">
                        <Calendar className="w-4 h-4 text-gray-400 inline mr-1" />
                        {new Date(loan.updatedAt || loan.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDisburseLoan(loan)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-extrabold transition shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" /> Release Funds
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No approved advances ready for disbursement.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedDisburseLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative space-y-5 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Wallet className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">Authorize Capital Release</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Confirm fund disbursement to the borrower's registered bank account.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 text-xs font-semibold space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Applicant:</span>
                <span className="font-bold text-gray-900">{selectedDisburseLoan.borrowerId?.userId?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PAN Account:</span>
                <span className="font-mono font-bold text-gray-900">{selectedDisburseLoan.borrowerId?.pan}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500 font-bold">Disbursement Amount:</span>
                <span className="text-base font-black text-indigo-600">₹{selectedDisburseLoan.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 p-3.5 rounded-2xl text-xs font-medium leading-relaxed">
              Once authorized, the funds will be wired via the Meghdoot Mercantile Escrow partner and the loan will become active immediately.
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedDisburseLoan(null)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisburseConfirm}
                className="px-5 py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
                disabled={processing}
              >
                {processing ? "Releasing Funds..." : "Confirm & Release"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
