import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FileText, 
  Calendar, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  LogOut, 
  Info, 
  ShieldAlert, 
  CreditCard,
  History,
  Download,
  Printer,
  Award,
  Wallet
} from "lucide-react";
import { API_URL } from "../lib/api";

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Self-service repay state
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayingLoan, setRepayingLoan] = useState(null);
  const [utrInput, setUtrInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [submittingRepay, setSubmittingRepay] = useState(false);

  // Payment ledger state
  const [viewingLedgerLoan, setViewingLedgerLoan] = useState(null);
  const [ledgerPayments, setLedgerPayments] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  // Document modal state (Sanction letter / NOC)
  const [documentModal, setDocumentModal] = useState(null); // { type: 'SANCTION' | 'NOC', loan }

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }
      const res = await axios.get(`${API_URL}/api/borrower/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
      setProfileExists(res.data.profileExists);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [navigate]);

  const hasActiveOrPendingLoan = loans.some(
    (loan) => loan.status === "Pending" || loan.status === "Approved" || loan.status === "Disbursed"
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          label: "Applied (Under Review)",
          colorClass: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Clock,
        };
      case "Approved":
        return {
          label: "Sanctioned (Ready for Payout)",
          colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: CheckCircle,
        };
      case "Disbursed":
        return {
          label: "Active (Funded)",
          colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: CheckCircle,
        };
      case "Closed":
        return {
          label: "Settled (Fully Closed)",
          colorClass: "bg-gray-100 text-gray-700 border-gray-300",
          icon: CheckCircle,
        };
      case "Rejected":
        return {
          label: "Rejected",
          colorClass: "bg-red-50 text-red-700 border-red-200",
          icon: AlertTriangle,
        };
      default:
        return {
          label: status,
          colorClass: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Clock,
        };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const openRepay = (loan) => {
    setRepayingLoan(loan);
    const balance = Math.max(0, loan.totalRepayment - loan.amountPaid);
    setAmountInput(balance.toString());
    setUtrInput("");
    setShowRepayModal(true);
  };

  const handleRepaySubmit = async (e) => {
    e.preventDefault();
    if (!repayingLoan) return;
    setError("");
    setSuccess("");
    setSubmittingRepay(true);

    const payAmt = Number(amountInput);
    const balance = repayingLoan.totalRepayment - repayingLoan.amountPaid;
    if (payAmt <= 0 || payAmt > balance) {
      setError(`Payment amount must be between ₹1 and ₹${Math.round(balance).toLocaleString()}`);
      setSubmittingRepay(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/api/borrower/repay`, 
        { loanId: repayingLoan._id, utr: utrInput.trim(), amount: payAmt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Payment of ₹${payAmt.toLocaleString()} successfully credited! New loan status: ${res.data.loanStatus}`);
      setShowRepayModal(false);
      setRepayingLoan(null);
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit repayment");
    } finally {
      setSubmittingRepay(false);
    }
  };

  const openLedger = async (loan) => {
    setViewingLedgerLoan(loan);
    setLoadingLedger(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/borrower/loans/${loan._id}/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLedgerPayments(res.data.payments || []);
    } catch (err) {
      console.error("Error fetching ledger", err);
      setError("Failed to fetch payment receipts for this advance.");
    } finally {
      setLoadingLedger(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Title Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Borrower Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your profile, track underwriting review, and submit loan repayments
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition flex items-center gap-2 text-xs"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className="text-emerald-900 font-extrabold">✕</button>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-900 font-extrabold">✕</button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4 text-xs font-bold">Retrieving accounts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Actions Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-3.5 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" /> Apply for Credit
                  </h2>
                  
                  {hasActiveOrPendingLoan ? (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs leading-relaxed font-semibold">
                        You have an active or pending loan application under evaluation. You can apply for a new advance once your active balance is settled or closed.
                      </div>
                      <button
                        disabled
                        className="w-full py-3.5 px-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200 text-xs"
                      >
                        <PlusCircle className="w-4 h-4" /> Apply New Loan
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Need quick cash? Submit a new application form to get started. Verification takes less than 10 minutes.
                      </p>
                      <Link
                        to="/apply"
                        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-200 text-xs"
                      >
                        <PlusCircle className="w-4 h-4" /> Apply New Loan
                      </Link>
                    </div>
                  )}
                </div>

                {/* NBFC Escrow Transfer Details */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-indigo-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-indigo-400" /> Repayment Escrow Account
                  </h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    Direct wire details for settling active advances:
                  </p>
                  <div className="bg-white/10 rounded-2xl p-3.5 font-mono text-[11px] text-white space-y-1.5 border border-white/10">
                    <div><strong>A/C:</strong> Meghdoot Mercantile Escrow</div>
                    <div><strong>Bank:</strong> HDFC Bank Ltd</div>
                    <div><strong>Account No:</strong> 50200087451296</div>
                    <div><strong>IFSC:</strong> HDFC0000240</div>
                  </div>
                  <p className="text-[11px] text-indigo-300">
                    Use IMPS or UPI, then click <strong>"Repay Balance"</strong> on your loan to log your UTR receipt for instant credit!
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-blue-600" /> Need Assistance?
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed mb-4">
                    Have questions regarding your sanction terms, document uploads, or payment verification?
                  </p>
                  <Link to="/contact" className="text-xs font-extrabold text-blue-650 hover:underline">
                    Get Support &rarr;
                  </Link>
                </div>
              </div>

              {/* Loans List Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      My Loan Advances
                    </h2>
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200">
                      Total: {loans.length}
                    </span>
                  </div>

                  {loans.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-bold text-gray-700 text-lg mb-1">No Loan Applications Yet</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                        You haven't submitted any loan requests. Click "Apply New Loan" to get started.
                      </p>
                      <Link
                        to="/apply"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                      >
                        <PlusCircle className="w-4 h-4" /> Start Application
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {loans.map((loan) => {
                        const config = getStatusConfig(loan.status);
                        const StatusIcon = config.icon;
                        const balance = Math.max(0, loan.totalRepayment - loan.amountPaid);
                        const progress = Math.min(100, Math.round((loan.amountPaid / loan.totalRepayment) * 100));

                        return (
                          <div
                            key={loan._id}
                            className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl font-black text-gray-900">
                                    ₹{loan.amount.toLocaleString()}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${config.colorClass} flex items-center gap-1`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {config.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    Applied: {new Date(loan.createdAt).toLocaleDateString()}
                                  </span>
                                  <span>Tenure: <strong>{loan.tenure} days</strong></span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap items-center gap-2">
                                {loan.status === "Approved" && (
                                  <button
                                    onClick={() => setDocumentModal({ type: 'SANCTION', loan })}
                                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                  >
                                    <Download className="w-3.5 h-3.5" /> Sanction Letter
                                  </button>
                                )}
                                {loan.status === "Disbursed" && (
                                  <>
                                    <button
                                      onClick={() => openLedger(loan)}
                                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                    >
                                      <History className="w-3.5 h-3.5" /> Receipts
                                    </button>
                                    <button
                                      onClick={() => openRepay(loan)}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-emerald-200 flex items-center gap-1.5"
                                    >
                                      <CreditCard className="w-3.5 h-3.5" /> Repay Balance
                                    </button>
                                  </>
                                )}
                                {loan.status === "Closed" && (
                                  <>
                                    <button
                                      onClick={() => openLedger(loan)}
                                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                    >
                                      <History className="w-3.5 h-3.5" /> Ledger
                                    </button>
                                    <button
                                      onClick={() => setDocumentModal({ type: 'NOC', loan })}
                                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                    >
                                      <Award className="w-3.5 h-3.5" /> Download NOC
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Repayment Progress for Active Disbursed Loans */}
                            {loan.status === "Disbursed" && (
                              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-gray-500">Repayment Progress:</span>
                                  <span className="text-emerald-700">{progress}% Settled (₹{Math.round(loan.amountPaid).toLocaleString()} of ₹{Math.round(loan.totalRepayment).toLocaleString()})</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700" 
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1 text-gray-600 font-semibold">
                                  <span>Principal: ₹{loan.amount.toLocaleString()}</span>
                                  <span className="font-extrabold text-red-600">
                                    Remaining: ₹{Math.round(balance).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}

                            {loan.status === "Rejected" && loan.rejectionReason && (
                              <div className="text-xs bg-red-50 text-red-700 border border-red-100 rounded-2xl p-3.5 font-semibold">
                                <strong>Reason for rejection:</strong> {loan.rejectionReason}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Self-Service Repayment Modal */}
      {showRepayModal && repayingLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleRepaySubmit} className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Submit Repayment</h3>
                <p className="text-xs text-gray-400 font-medium">Log your wire / UPI payment to close your balance</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 text-xs font-semibold space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Loan Principal:</span>
                <span className="text-gray-900 font-bold">₹{repayingLoan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Settled So Far:</span>
                <span className="text-emerald-600 font-bold">₹{Math.round(repayingLoan.amountPaid).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5">
                <span className="text-gray-500 font-bold">Remaining Balance Due:</span>
                <span className="text-red-600 font-black text-sm">
                  ₹{Math.round(repayingLoan.totalRepayment - repayingLoan.amountPaid).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  Transaction UTR / Reference No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 331409827162 or UPI Ref"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
                  Amount Transferred (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={repayingLoan.totalRepayment - repayingLoan.amountPaid}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowRepayModal(false);
                  setRepayingLoan(null);
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                disabled={submittingRepay}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md shadow-emerald-200"
                disabled={submittingRepay}
              >
                {submittingRepay ? "Verifying..." : "Confirm Repayment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Ledger / History Modal */}
      {viewingLedgerLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative space-y-6 animate-scaleUp max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Repayment Receipts
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  Advance ₹{viewingLedgerLoan.amount.toLocaleString()} Payment Ledger
                </h3>
                <p className="text-xs text-gray-400 font-medium">History of credited repayments and UTR records</p>
              </div>
              <button
                onClick={() => setViewingLedgerLoan(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

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
                      <th className="px-4 py-3">Date</th>
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

      {/* Document Modal (Sanction Letter or NOC) */}
      {documentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative space-y-6 animate-scaleUp max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-150 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {documentModal.type === 'SANCTION' ? 'Official Loan Sanction Letter' : 'No Objection Certificate (NOC)'}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">Meghdoot Mercantile Pvt Ltd (NBFC Partner)</p>
                </div>
              </div>
              <button
                onClick={() => setDocumentModal(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4 text-xs font-serif text-gray-800 leading-relaxed">
              <div className="flex justify-between text-[11px] font-sans text-gray-500 border-b border-gray-200 pb-2">
                <span>Ref: CS-LMS-{documentModal.loan._id.slice(-6).toUpperCase()}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>

              {documentModal.type === 'SANCTION' ? (
                <>
                  <p className="font-bold text-sm font-sans text-gray-900">Subject: Credit Advance Sanction Confirmation</p>
                  <p>
                    Dear Applicant, we are pleased to confirm that your loan application of <strong className="font-sans font-bold">₹{documentModal.loan.amount.toLocaleString()}</strong> has been sanctioned and verified by our credit risk underwriting team.
                  </p>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 font-sans space-y-1">
                    <div>Sanctioned Capital: <strong>₹{documentModal.loan.amount.toLocaleString()}</strong></div>
                    <div>Tenure: <strong>{documentModal.loan.tenure} Days</strong></div>
                    <div>Annual Percentage Rate (APR): <strong>12% Simple Interest</strong></div>
                    <div>Total Repayable: <strong>₹{Math.round(documentModal.loan.totalRepayment).toLocaleString()}</strong></div>
                  </div>
                  <p className="text-[11px] text-gray-500 font-sans">
                    Disbursement will be initiated through our partner escrow account directly to your registered bank account.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-sm font-sans text-emerald-800">Subject: Loan Clearance & Debt Discharge Certificate</p>
                  <p>
                    This document certifies that the loan facility of <strong className="font-sans font-bold">₹{documentModal.loan.amount.toLocaleString()}</strong> has been <strong className="text-emerald-700 font-bold">FULLY PAID AND CLOSED</strong>.
                  </p>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 font-sans space-y-1">
                    <div>Total Settled: <strong>₹{Math.round(documentModal.loan.totalRepayment).toLocaleString()}</strong></div>
                    <div>Outstanding Dues: <strong className="text-emerald-600">₹0.00 (Zero Balance)</strong></div>
                    <div>Closure Status: <strong>Settled & Cleared</strong></div>
                  </div>
                  <p className="text-[11px] text-gray-500 font-sans">
                    No further dues or liabilities remain on this advance. This document serves as legal proof of closure.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print Certificate
              </button>
              <button
                onClick={() => setDocumentModal(null)}
                className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
