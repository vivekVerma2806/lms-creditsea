import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { 
  Send, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Mail, 
  User, 
  Wallet,
  AlertCircle,
  Building
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
      setSuccess(`Capital remittance of ₹${selectedDisburseLoan.amount.toLocaleString()} successfully released to ${selectedDisburseLoan.borrowerId?.userId?.name || "the borrower"}.`);
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
    <div className="space-y-8 text-[#171717]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#DDD9D0]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
              Escrow Operations
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-[#171717]">
            Capital Disbursement Desk
          </h1>
          <p className="text-sm text-[#6F6B63] font-light mt-1">
            Authorize scheduled RTGS/NEFT transfers from partner NBFC escrow accounts to verified borrower mandates.
          </p>
        </div>

        <span className="text-xs font-mono text-[#6F6B63] bg-white border border-[#DDD9D0] px-3 py-1.5 rounded">
          Sanctioned Pending Payout: <strong className="text-[#171717] font-mono">{filteredLoans.length}</strong>
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
          <span>Settlement Partner: Meghdoot Mercantile Escrow</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#DDD9D0] rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-[#6F6B63] mt-3">Accessing Disbursement Queue...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#6F6B63] font-light bg-[#F6F4EF]">
            All sanctioned credit advances have been disbursed to borrower escrow accounts.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left divide-y divide-[#DDD9D0]">
              <thead className="bg-[#F6F4EF] font-mono text-[11px] uppercase tracking-wider text-[#6F6B63]">
                <tr>
                  <th className="px-4 py-3">Facility Ref</th>
                  <th className="px-4 py-3">Borrower & PAN</th>
                  <th className="px-4 py-3">Sanctioned Capital</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Underwriting Status</th>
                  <th className="px-4 py-3">Sanctioned Date</th>
                  <th className="px-4 py-3 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9D0] text-[#171717]">
                {filteredLoans.map((loan) => {
                  const b = loan.borrowerId;
                  const u = b?.userId;

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
                      <td className="px-4 py-3.5 font-semibold text-sm tabular-nums text-[#171717]">
                        ₹{loan.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#6F6B63]">
                        {loan.tenure} Days
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F5F2EB] text-[#111111] border border-[#B49A68]">
                          <CheckCircle2 className="w-3 h-3 text-[#B49A68]" /> Sanctioned
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#6F6B63]">
                        {new Date(loan.updatedAt || loan.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedDisburseLoan(loan)}
                          className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-[#B49A68]" /> Release Funds
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

      {/* Disbursement Confirmation Dialog */}
      {selectedDisburseLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-2xl relative space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-[#DDD9D0] pb-4">
              <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#111111]">
                <Send className="w-5 h-5 text-[#B49A68]" />
              </div>
              <div>
                <h3 className="text-base font-serif font-medium text-[#171717]">Authorize Escrow Transfer</h3>
                <p className="text-xs text-[#6F6B63]">RTGS / Direct Bank Mandate Dispatch</p>
              </div>
            </div>

            <div className="bg-[#F6F4EF] rounded p-4 border border-[#DDD9D0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6F6B63]">Beneficiary:</span>
                <span className="font-medium text-[#171717]">{selectedDisburseLoan.borrowerId?.userId?.name || "Borrower"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6B63]">Tax PAN Reference:</span>
                <span className="font-mono text-[#171717]">{selectedDisburseLoan.borrowerId?.pan || "N/A"}</span>
              </div>
              <div className="flex justify-between border-t border-[#DDD9D0] pt-2">
                <span className="text-[#171717] font-semibold">Net Payout Amount:</span>
                <span className="font-mono font-bold text-sm text-[#476353] tabular-nums">
                  ₹{selectedDisburseLoan.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#6F6B63] leading-relaxed font-light">
              By confirming, you certify that KYC criteria have been strictly satisfied. Funds will be routed via the Meghdoot Mercantile institutional pooling escrow node.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDisburseLoan(null)}
                className="px-4 py-2 border border-[#DDD9D0] text-[#6F6B63] rounded text-xs font-mono uppercase tracking-wider"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDisburseConfirm}
                className="px-5 py-2 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                disabled={processing}
              >
                {processing ? "Authorizing Transfer..." : "Confirm & Release"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
