import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  CreditCard, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  Search, 
  History, 
  Mail, 
  Coins, 
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";

export default function CollectionPortal() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [viewingLedgerLoan, setViewingLedgerLoan] = useState(null);
  const [ledgerPayments, setLedgerPayments] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/collection/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching collection loans", err);
      setError("Failed to fetch active collection loans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleOpenLedger = async (loan) => {
    setViewingLedgerLoan(loan);
    setLoadingLedger(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/loans/${loan._id}/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLedgerPayments(res.data.payments || []);
    } catch (err) {
      console.error("Error fetching ledger", err);
      setError("Failed to fetch payment ledger for this advance.");
    } finally {
      setLoadingLedger(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;
    setError("");
    setSuccess("");
    setSubmittingPayment(true);

    const payAmt = Number(amount);
    const balance = selectedLoan.totalRepayment - selectedLoan.amountPaid;
    if (payAmt > balance) {
      setError(`Payment cannot exceed remaining balance of ₹${Math.round(balance).toLocaleString()}`);
      setSubmittingPayment(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/dashboard/collection/payments`, 
        { loanId: selectedLoan._id, utr, amount: payAmt }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSelectedLoan(null);
      setUtr("");
      setAmount("");
      setSuccess(`Payment of ₹${payAmt.toLocaleString()} successfully logged! Loan status: ${res.data.loanStatus}`);
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log payment");
    } finally {
      setSubmittingPayment(false);
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
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Collection Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Audit active repayments, verify UTR transactions, and inspect borrower ledgers</p>
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
          Active Disbursed Accounts: <strong className="text-emerald-600">{filteredLoans.length} Loans</strong>
        </div>
      </div>

      {/* Collection Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-gray-900">Active Outstanding Advances</h2>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
            Total Outstanding: ₹{Math.round(loans.reduce((acc, l) => acc + Math.max(0, l.totalRepayment - l.amountPaid), 0)).toLocaleString()}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Loading active collection accounts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150 text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Borrower</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Account</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Repayment</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Settled & Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Remaining Balance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {filteredLoans.map((loan) => {
                  const borrower = loan.borrowerId;
                  const user = borrower?.userId;
                  const balance = Math.max(0, loan.totalRepayment - loan.amountPaid);
                  const progress = Math.min(100, Math.round((loan.amountPaid / loan.totalRepayment) * 100));

                  return (
                    <tr key={loan._id} className="hover:bg-emerald-50/20 transition">
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
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        ₹{Math.round(loan.totalRepayment).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-emerald-600">₹{Math.round(loan.amountPaid).toLocaleString()}</div>
                        <div className="w-28 bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-extrabold text-red-600">
                        ₹{Math.round(balance).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenLedger(loan)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                            title="View Transaction History"
                          >
                            <History className="w-3.5 h-3.5" /> Ledger
                          </button>
                          <button
                            onClick={() => setSelectedLoan(loan)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Log Payment
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredLoans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No active disbursed loans requiring collection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Form Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handlePayment} className="bg-white max-w-md w-full rounded-3xl p-6 border border-gray-150 shadow-2xl relative space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> Record Repayment Receipt
            </h3>

            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-150 text-xs font-semibold text-gray-600 space-y-1">
              <div>Borrower: <strong className="text-gray-900">{selectedLoan.borrowerId?.userId?.name}</strong></div>
              <div>PAN: <strong className="text-gray-900 uppercase font-mono">{selectedLoan.borrowerId?.pan}</strong></div>
              <div className="text-red-600 pt-1 border-t border-gray-200 mt-1">
                Outstanding Balance: <strong>₹{Math.round(selectedLoan.totalRepayment - selectedLoan.amountPaid).toLocaleString()}</strong>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Transaction UTR Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR169823487123"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Amount Paid (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedLoan.totalRepayment - selectedLoan.amountPaid}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedLoan(null);
                  setUtr("");
                  setAmount("");
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                disabled={submittingPayment}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                disabled={submittingPayment}
              >
                {submittingPayment ? "Recording..." : "Verify & Log Payment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Ledger / History Modal */}
      {viewingLedgerLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative space-y-6 animate-scaleUp max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Repayment Transaction Ledger
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {viewingLedgerLoan.borrowerId?.userId?.name || "Borrower"} · <span className="font-mono text-base uppercase">{viewingLedgerLoan.borrowerId?.pan}</span>
                </h3>
                <p className="text-xs text-gray-400 font-medium">Complete record of verified UTR credits for this loan advance</p>
              </div>
              <button
                onClick={() => setViewingLedgerLoan(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Repayment Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Total Due</span>
                <div className="text-lg font-black text-gray-900 mt-0.5">₹{Math.round(viewingLedgerLoan.totalRepayment).toLocaleString()}</div>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Settled</span>
                <div className="text-lg font-black text-emerald-700 mt-0.5">₹{Math.round(viewingLedgerLoan.amountPaid).toLocaleString()}</div>
              </div>
              <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100">
                <span className="text-[11px] font-bold text-red-600 uppercase">Balance</span>
                <div className="text-lg font-black text-red-700 mt-0.5">
                  ₹{Math.max(0, Math.round(viewingLedgerLoan.totalRepayment - viewingLedgerLoan.amountPaid)).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Payments Table */}
            {loadingLedger ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-gray-400 mt-3 font-bold">Loading payment entries...</p>
              </div>
            ) : ledgerPayments.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No repayments have been recorded for this loan yet.
              </div>
            ) : (
              <div className="border border-gray-150 rounded-2xl overflow-hidden">
                <table className="min-w-full text-xs text-left divide-y divide-gray-100">
                  <thead className="bg-gray-50 font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">UTR Reference</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Transaction Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                    {ledgerPayments.map((p, idx) => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-gray-900">{p.utr}</td>
                        <td className="px-4 py-3 font-extrabold text-emerald-600">₹{p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingLedgerLoan(null)}
                className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
