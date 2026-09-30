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
  Coins, 
  CheckCircle2,
  FileSpreadsheet,
  Building
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
      setSuccess(`Remittance of ₹${payAmt.toLocaleString()} successfully logged. Facility Status: ${res.data.loanStatus}`);
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
    <div className="space-y-8 text-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#DDD9D0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
              Portfolio Servicing Desk
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#171717]">
            Collection & Amortization Recovery
          </h1>
          <p className="text-sm text-[#6F6B63] font-light mt-1">
            Monitor live amortization balances, reconcile bank UTR receipts, and verify loan clearance status.
          </p>
        </div>

        <span className="text-xs font-mono text-[#6F6B63] bg-white border border-[#DDD9D0] px-3 py-1.5 rounded">
          Active Servicing Accounts: <strong className="text-[#476353] font-mono">{filteredLoans.length}</strong>
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

      {/* Search Bar */}
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

        <div className="text-xs font-mono text-[#6F6B63] flex items-center gap-2">
          <Building className="w-3.5 h-3.5 text-[#B49A68]" />
          <span>Statutory Escrow Bank: HDFC Bank / Meghdoot Mercantile</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#DDD9D0] rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-[#6F6B63] mt-3">Accessing Collection Accounts...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#6F6B63] font-light bg-[#F6F4EF]">
            No loans currently require active recovery collections.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
              <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
                <tr>
                  <th className="px-4 py-3">Facility Ref</th>
                  <th className="px-4 py-3">Borrower & PAN</th>
                  <th className="px-4 py-3">Sanctioned Principal</th>
                  <th className="px-4 py-3">Total Obligation</th>
                  <th className="px-4 py-3">Remitted</th>
                  <th className="px-4 py-3">Outstanding Balance</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
                {filteredLoans.map((loan) => {
                  const b = loan.borrowerId;
                  const u = b?.userId;
                  const balance = loan.totalRepayment - loan.amountPaid;

                  return (
                    <tr key={loan._id} className="hover:bg-[#F6F4EF] transition">
                      <td className="px-4 py-3.5 font-mono text-[#6F6B63]">
                        #{loan._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-[#171717]">{u?.name || "N/A"}</div>
                        <div className="text-[11px] font-mono text-[#6F6B63] mt-0.5">
                          PAN: {b?.pan || "PENDING"} · {u?.email || ""}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#171717] tabular-nums">
                        ₹{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#171717] tabular-nums font-semibold">
                        ₹{Math.round(loan.totalRepayment).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#476353] tabular-nums font-semibold">
                        ₹{Math.round(loan.amountPaid).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`font-mono font-semibold tabular-nums ${balance <= 0 ? "text-[#476353]" : "text-[#874F4F]"}`}>
                          ₹{Math.round(balance).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenLedger(loan)}
                            className="px-2.5 py-1.5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1"
                          >
                            <History className="w-3.5 h-3.5 text-[#6F6B63]" /> Receipts
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setAmount(Math.round(balance));
                            }}
                            className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1"
                          >
                            <Coins className="w-3.5 h-3.5 text-[#B49A68]" /> Credit Remittance
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

      {/* Credit Repayment Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handlePayment} className="bg-white max-w-md w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-2xl relative space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-[#DDD9D0] pb-4">
              <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#111111]">
                <Coins className="w-5 h-5 text-[#B49A68]" />
              </div>
              <div>
                <h3 className="text-base font-serif font-medium text-[#171717]">Reconcile Escrow Remittance</h3>
                <p className="text-xs text-[#6F6B63]">Direct settlement credit into NBFC escrow pool</p>
              </div>
            </div>

            <div className="bg-[#F6F4EF] rounded p-4 border border-[#DDD9D0] text-xs font-medium space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6F6B63]">Borrower:</span>
                <span className="text-[#171717] font-semibold">{selectedLoan.borrowerId?.userId?.name || "Client"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6B63]">Principal Sanction:</span>
                <span className="text-[#171717] tabular-nums">₹{selectedLoan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[#DDD9D0] pt-2">
                <span className="text-[#171717] font-semibold">Remaining Due:</span>
                <span className="text-[#874F4F] font-mono font-bold text-sm tabular-nums">
                  ₹{Math.round(selectedLoan.totalRepayment - selectedLoan.amountPaid).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                  Bank UTR / IMPS Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CMS2948201948 or UPI Ref"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                  Credited Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedLoan.totalRepayment - selectedLoan.amountPaid}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDD9D0] rounded text-sm font-semibold tabular-nums focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                className="px-4 py-2 border border-[#DDD9D0] text-[#6F6B63] rounded font-mono uppercase tracking-wider transition"
                disabled={submittingPayment}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#111111] hover:bg-[#222222] text-white rounded font-mono uppercase tracking-wider transition"
                disabled={submittingPayment}
              >
                {submittingPayment ? "Reconciling..." : "Log Repayment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ledger Receipts Modal */}
      {viewingLedgerLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-xl relative space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#DDD9D0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#476353] bg-[#EFEFE9] px-2 py-0.5 rounded border border-[#CCD8D0]">
                  Reconciled Escrow Receipts
                </span>
                <h3 className="text-lg font-serif font-medium text-[#171717] mt-2">
                  Advance #{viewingLedgerLoan._id.slice(-6).toUpperCase()} Payment Ledger
                </h3>
                <p className="text-xs text-[#6F6B63]">Client: {viewingLedgerLoan.borrowerId?.userId?.name || "Borrower"}</p>
              </div>
              <button
                onClick={() => setViewingLedgerLoan(null)}
                className="p-1.5 text-[#6F6B63] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            {loadingLedger ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-[#6F6B63] mt-3 font-mono">Retrieving entries...</p>
              </div>
            ) : ledgerPayments.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6F6B63] bg-[#F6F4EF] rounded border border-dashed border-[#DDD9D0]">
                No payment transactions recorded for this advance yet.
              </div>
            ) : (
              <div className="border border-[#DDD9D0] rounded overflow-hidden">
                <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
                  <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">UTR Reference</th>
                      <th className="px-4 py-3">Credited Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
                    {ledgerPayments.map((p, idx) => (
                      <tr key={p._id} className="hover:bg-[#F6F4EF]">
                        <td className="px-4 py-3 text-[#969188] font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-medium">{p.utr}</td>
                        <td className="px-4 py-3 font-semibold text-[#476353] tabular-nums">₹{p.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#6F6B63]">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-mono uppercase text-[#476353] bg-[#EFEFE9] px-2 py-0.5 rounded border border-[#CCD8D0]">
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
                className="px-5 py-2 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#222222] transition"
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
