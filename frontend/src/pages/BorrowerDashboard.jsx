import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FileText, 
  Calendar, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  LogOut, 
  Info, 
  ShieldCheck, 
  CreditCard,
  History,
  Download,
  Printer,
  Award,
  Wallet,
  Building,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { API_URL } from "../lib/api";
import InstitutionalGauge from "../components/presets/InstitutionalGauge";
import NumberTicker from "../components/presets/NumberTicker";
import BlurFade from "../components/presets/BlurFade";
import CircleLoader from "../components/presets/CircleLoader";
import Badge from "../components/presets/Badge";

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
          colorClass: "bg-[#FBF6ED] text-[#A17E43] border-[#EBDCBF]",
          icon: Clock,
        };
      case "Approved":
        return {
          label: "Sanctioned (Ready for Payout)",
          colorClass: "bg-[#F5F2EB] text-[#111111] border-[#B49A68]",
          icon: CheckCircle2,
        };
      case "Disbursed":
        return {
          label: "Active (Funded)",
          colorClass: "bg-[#EFEFE9] text-[#476353] border-[#CCD8D0]",
          icon: CheckCircle2,
        };
      case "Closed":
        return {
          label: "Settled (Fully Closed)",
          colorClass: "bg-[#EEEBE4] text-[#6F6B63] border-[#DDD9D0]",
          icon: CheckCircle2,
        };
      case "Rejected":
        return {
          label: "Declined",
          colorClass: "bg-[#FBEAEA] text-[#874F4F] border-[#E8C2C2]",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          colorClass: "bg-[#EEEBE4] text-[#6F6B63] border-[#DDD9D0]",
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

  const handleRepaySubmit = async (e) => {
    e.preventDefault();
    if (!repayingLoan) return;

    const payAmt = Number(amountInput);
    const balance = repayingLoan.totalRepayment - repayingLoan.amountPaid;
    if (isNaN(payAmt) || payAmt <= 0) {
      setError("Please input a valid repayment amount greater than 0");
      return;
    }
    if (payAmt > balance) {
      setError(`Repayment cannot exceed the remaining balance of ₹${Math.round(balance).toLocaleString()}`);
      return;
    }
    if (!utrInput.trim()) {
      setError("Please specify the transaction UTR or Wire Reference ID");
      return;
    }

    setSubmittingRepay(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/borrower/loans/${repayingLoan._id}/repay`,
        { amount: payAmt, utr: utrInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Remittance of ₹${payAmt.toLocaleString()} successfully credited. Account Status: ${res.data.loanStatus}`);
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
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Institutional Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-[#DDD9D0] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#6F6B63]">
                  Client Facility Management
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-[#171717]">
                Borrower Portfolio Desk
              </h1>
              <p className="text-sm text-[#6F6B63] mt-1 font-light">
                Monitor sanctioned capital facilities, manage settlements, and retrieve statutory certificates.
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[#DDD9D0] rounded text-xs font-mono uppercase tracking-wider text-[#6F6B63] hover:text-[#171717] hover:border-[#171717] transition flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-[#EFEFE9] border border-[#CCD8D0] text-[#476353] rounded text-xs font-medium flex items-center justify-between">
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className="text-[#476353] font-bold">✕</button>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-[#FBEAEA] border border-[#E8C2C2] text-[#874F4F] rounded text-xs font-medium flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-[#874F4F] font-bold">✕</button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-28">
              <CircleLoader size={48} strokeWidth={3} label="Accessing Ledger Data..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Actions & Credentials Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Apply New Facility Card */}
                <div className="bg-white border border-[#DDD9D0] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-serif font-medium text-[#171717]">
                      Facility Application
                    </h2>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F6F4EF] text-[#6F6B63] border border-[#DDD9D0]">
                      Primary Desk
                    </span>
                  </div>
                  
                  {hasActiveOrPendingLoan ? (
                    <div className="space-y-4">
                      <div className="bg-[#FBF6ED] border border-[#EBDCBF] text-[#A17E43] p-4 rounded text-xs leading-relaxed">
                        An active credit exposure or pending underwriting request is already registered under your customer profile. Additional facilities may be requested upon settlement.
                      </div>
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-[#EEEBE4] text-[#969188] rounded text-xs font-mono uppercase tracking-wider cursor-not-allowed border border-[#DDD9D0]"
                      >
                        Application Restricted
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-[#6F6B63] leading-relaxed font-light">
                        Submit institutional loan documents for algorithmic underwriting review. Decisions rendered within 10 operational minutes.
                      </p>
                      <Link
                        to="/apply"
                        className="w-full py-3 px-4 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 group"
                      >
                        <span>Initiate Application</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Identity Verification Status Card */}
                <div className="bg-white border border-[#DDD9D0] rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[#6F6B63]">
                      Institutional KYC Status
                    </h3>
                    {profileExists ? (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EFEFE9] text-[#476353] border border-[#CCD8D0] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FBF6ED] text-[#A17E43] border border-[#EBDCBF]">
                        Pending Profile
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6F6B63] leading-relaxed font-light">
                    {profileExists
                      ? "Aadhaar, PAN, and primary banking mandate are verified under RBI regulations."
                      : "Complete your identity dossier to accelerate credit approvals and higher sanction limits."}
                  </p>
                  {!profileExists && (
                    <Link
                      to="/apply"
                      className="inline-flex items-center gap-1 text-xs font-mono text-[#B49A68] hover:underline pt-1"
                    >
                      Complete Dossier <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Statutory Virtual Escrow Account Card */}
                <div className="bg-[#111111] text-[#F6F4EF] border border-[#222222] rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B49A68]">
                      Dedicated Escrow Remittance
                    </span>
                    <Building className="w-4 h-4 text-[#B49A68]" />
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#969188]">NBFC Escrow Partner</div>
                      <div className="font-serif text-sm font-medium text-white">Meghdoot Mercantile Pvt Ltd</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222222]">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#969188]">Virtual IFSC</div>
                        <div className="font-mono text-xs font-medium text-white">HDFC0000060</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#969188]">Settlement Mode</div>
                        <div className="font-mono text-xs font-medium text-white">RTGS / NEFT / IMPS</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#969188] border-t border-[#222222] pt-3 font-light leading-relaxed">
                    Quote your 6-digit loan reference number in remittance remarks for instant automated ledger clearing.
                  </div>
                </div>

              </div>

              {/* Loan Applications & Credit Portfolio (8 cols) */}
              <div className="lg:col-span-8">
                <div className="bg-white border border-[#DDD9D0] rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-[#DDD9D0] gap-2 mb-6">
                    <div>
                      <h2 className="text-lg font-serif font-medium text-[#171717]">
                        Active Credit Facilities & Historical Ledger
                      </h2>
                      <p className="text-xs text-[#6F6B63] mt-0.5 font-light">
                        Real-time outstanding balance, repayment schedules, and statutory discharge certificates.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#6F6B63] self-start sm:self-auto">
                      Total Records: {loans.length}
                    </span>
                  </div>

                  {loans.length === 0 ? (
                    <div className="text-center py-20 bg-[#F6F4EF] border border-dashed border-[#DDD9D0] rounded-lg">
                      <FileText className="w-10 h-10 text-[#969188] mx-auto mb-3 stroke-[1.2]" />
                      <h3 className="text-sm font-serif font-medium text-[#171717]">No Credit Facilities Recorded</h3>
                      <p className="text-xs text-[#6F6B63] mt-1 max-w-sm mx-auto font-light">
                        You have not initiated any borrowing applications yet. Begin by submitting a structured application.
                      </p>
                      <Link
                        to="/apply"
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#222222] transition"
                      >
                        Apply for Capital
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {loans.map((loan) => {
                        const statusConfig = getStatusConfig(loan.status);
                        const StatusIcon = statusConfig.icon;
                        const balance = loan.totalRepayment - loan.amountPaid;
                        const progress = Math.min(100, Math.round((loan.amountPaid / loan.totalRepayment) * 100));

                        return (
                          <div
                            key={loan._id}
                            className="border border-[#DDD9D0] rounded-lg p-5 hover:border-[#B49A68] transition bg-white space-y-4"
                          >
                            {/* Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEEBE4] pb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#171717] font-mono text-xs font-bold">
                                  #{loan._id.slice(-4).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-xs font-mono text-[#6F6B63] tracking-wide">
                                    FACILITY REF: CS-LMS-{loan._id.slice(-6).toUpperCase()}
                                  </div>
                                  <div className="text-xs text-[#969188] font-light">
                                    Registered: {new Date(loan.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                  </div>
                                </div>
                              </div>

                              <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded border ${statusConfig.colorClass}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </span>
                            </div>

                            {/* Financial Matrix */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1 text-xs">
                              <div>
                                <div className="text-[10px] font-mono uppercase text-[#969188]">Sanctioned Capital</div>
                                <div className="text-sm font-semibold text-[#171717] tabular-nums mt-0.5">
                                  ₹{loan.amount.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-mono uppercase text-[#969188]">Agreed Tenure</div>
                                <div className="text-sm font-semibold text-[#171717] tabular-nums mt-0.5">
                                  {loan.tenure} Days
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-mono uppercase text-[#969188]">Total Obligation</div>
                                <div className="text-sm font-semibold text-[#171717] tabular-nums mt-0.5">
                                  ₹{Math.round(loan.totalRepayment).toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] font-mono uppercase text-[#969188]">Outstanding Balance</div>
                                <div className={`text-sm font-semibold tabular-nums mt-0.5 ${balance <= 0 ? "text-[#476353]" : "text-[#874F4F]"}`}>
                                  ₹{Math.round(balance).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Repayment Progress for Active Disbursed Loans with InstitutionalGauge */}
                            {loan.status === "Disbursed" && (
                              <div className="bg-[#F6F4EF] rounded p-4 border border-[#DDD9D0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <InstitutionalGauge
                                  percentage={progress}
                                  size={52}
                                  strokeWidth={4}
                                  color="#476353"
                                  label="Amortization Settlement"
                                  sublabel={`₹${Math.round(loan.amountPaid).toLocaleString()} remitted of ₹${Math.round(loan.totalRepayment).toLocaleString()}`}
                                />
                                <div className="text-right sm:text-right w-full sm:w-auto">
                                  <span className="text-[10px] font-mono uppercase text-[#969188] block">Balance Outstanding</span>
                                  <span className="font-mono text-sm font-semibold text-[#874F4F] tabular-nums">
                                    ₹{Math.round(balance).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="text-xs text-[#969188] font-light">
                                Statutory interest accrued at 12% APR simple interest.
                              </div>

                              <div className="flex items-center gap-2">
                                {loan.status === "Approved" && (
                                  <button
                                    onClick={() => setDocumentModal({ type: 'SANCTION', loan })}
                                    className="px-3 py-1.5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#B49A68]" /> Sanction Notice
                                  </button>
                                )}

                                {loan.status === "Disbursed" && (
                                  <>
                                    <button
                                      onClick={() => openLedger(loan)}
                                      className="px-3 py-1.5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                                    >
                                      <History className="w-3.5 h-3.5 text-[#6F6B63]" /> Receipts
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRepayingLoan(loan);
                                        setAmountInput(Math.round(balance));
                                        setShowRepayModal(true);
                                      }}
                                      className="px-3.5 py-1.5 bg-[#111111] hover:bg-[#222222] text-white rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                                    >
                                      <CreditCard className="w-3.5 h-3.5 text-[#B49A68]" /> Remit Settlement
                                    </button>
                                  </>
                                )}

                                {loan.status === "Closed" && (
                                  <>
                                    <button
                                      onClick={() => openLedger(loan)}
                                      className="px-3 py-1.5 bg-[#F6F4EF] hover:bg-[#EEEBE4] border border-[#DDD9D0] text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                                    >
                                      <History className="w-3.5 h-3.5 text-[#6F6B63]" /> Receipts
                                    </button>
                                    <button
                                      onClick={() => setDocumentModal({ type: 'NOC', loan })}
                                      className="px-3.5 py-1.5 bg-[#EFEFE9] hover:bg-[#E2E6DF] text-[#476353] border border-[#CCD8D0] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
                                    >
                                      <Award className="w-3.5 h-3.5" /> Discharge NOC
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {loan.status === "Rejected" && loan.rejectionReason && (
                              <div className="text-xs bg-[#FBEAEA] text-[#874F4F] border border-[#E8C2C2] rounded p-3 font-medium">
                                <strong>Adverse Underwriting Assessment:</strong> {loan.rejectionReason}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleRepaySubmit} className="bg-white max-w-md w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-xl relative space-y-5 animate-scaleUp">
            <div className="flex items-center gap-3 border-b border-[#DDD9D0] pb-4">
              <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#111111]">
                <CreditCard className="w-5 h-5 text-[#B49A68]" />
              </div>
              <div>
                <h3 className="text-base font-serif font-medium text-[#171717]">Record Facility Repayment</h3>
                <p className="text-xs text-[#6F6B63]">Direct settlement credit into NBFC escrow pool</p>
              </div>
            </div>

            <div className="bg-[#F6F4EF] rounded p-4 border border-[#DDD9D0] text-xs font-medium space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6F6B63]">Principal Sanction:</span>
                <span className="text-[#171717] tabular-nums font-semibold">₹{repayingLoan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6F6B63]">Cumulative Settled:</span>
                <span className="text-[#476353] tabular-nums font-semibold">₹{Math.round(repayingLoan.amountPaid).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[#DDD9D0] pt-2">
                <span className="text-[#171717] font-semibold">Outstanding Balance:</span>
                <span className="text-[#874F4F] font-mono font-bold text-sm tabular-nums">
                  ₹{Math.round(repayingLoan.totalRepayment - repayingLoan.amountPaid).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                  Bank UTR / IMPS Reference Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CMS2948201948 or UPI Ref"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                  Remittance Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={repayingLoan.totalRepayment - repayingLoan.amountPaid}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDD9D0] rounded text-sm font-semibold tabular-nums focus:outline-none focus:border-[#111111]"
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
                className="px-4 py-2 border border-[#DDD9D0] text-[#6F6B63] hover:text-[#171717] rounded font-mono uppercase tracking-wider transition"
                disabled={submittingRepay}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#111111] hover:bg-[#222222] text-white rounded font-mono uppercase tracking-wider transition"
                disabled={submittingRepay}
              >
                {submittingRepay ? "Confirming..." : "Record Settlement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Ledger / History Modal */}
      {viewingLedgerLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-xl relative space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#DDD9D0] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#476353] bg-[#EFEFE9] px-2 py-0.5 rounded border border-[#CCD8D0]">
                  Official Escrow Receipts
                </span>
                <h3 className="text-lg font-serif font-medium text-[#171717] mt-2">
                  Credit Facility ₹{viewingLedgerLoan.amount.toLocaleString()} Settlement Ledger
                </h3>
                <p className="text-xs text-[#6F6B63]">Audited ledger records certified by NBFC accounts</p>
              </div>
              <button
                onClick={() => setViewingLedgerLoan(null)}
                className="p-1.5 text-[#6F6B63] hover:text-[#171717] rounded"
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
                No payment credits have been logged against this facility yet.
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
                            Reconciled
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

      {/* Document Modal (Sanction Letter or NOC) */}
      {documentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full rounded-lg p-6 md:p-8 border border-[#DDD9D0] shadow-2xl relative space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#DDD9D0] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#F6F4EF] border border-[#DDD9D0] flex items-center justify-center text-[#111111]">
                  <FileText className="w-5 h-5 text-[#B49A68]" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-medium text-[#171717]">
                    {documentModal.type === 'SANCTION' ? 'Statutory Loan Sanction Letter' : 'No Objection Certificate (NOC)'}
                  </h3>
                  <p className="text-xs text-[#6F6B63]">Meghdoot Mercantile Pvt Ltd (RBI Registered NBFC)</p>
                </div>
              </div>
              <button
                onClick={() => setDocumentModal(null)}
                className="p-1.5 text-[#6F6B63] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            {/* Document Body with Institutional Styling */}
            <div className="p-6 bg-[#F6F4EF] border border-[#DDD9D0] rounded space-y-4 text-xs font-serif text-[#171717] leading-relaxed">
              <div className="flex justify-between text-[11px] font-mono text-[#6F6B63] border-b border-[#DDD9D0] pb-2">
                <span>REF: CS-LMS-{documentModal.loan._id.slice(-6).toUpperCase()}</span>
                <span>DATE: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>

              {documentModal.type === 'SANCTION' ? (
                <>
                  <p className="font-serif font-medium text-sm text-[#171717]">Subject: Credit Advance Sanction & Facility Terms Confirmation</p>
                  <p className="font-light">
                    This document serves as formal confirmation that your short-term credit application of <strong className="font-medium">₹{documentModal.loan.amount.toLocaleString()}</strong> has satisfied credit underwriting criteria and is approved for escrow disbursement.
                  </p>
                  <div className="bg-white p-4 rounded border border-[#DDD9D0] font-sans text-xs space-y-1.5">
                    <div className="flex justify-between"><span>Sanctioned Capital:</span> <strong className="tabular-nums">₹{documentModal.loan.amount.toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span>Amortization Term:</span> <strong className="tabular-nums">{documentModal.loan.tenure} Days</strong></div>
                    <div className="flex justify-between"><span>Annualized Rate (APR):</span> <strong>12.0% Simple Interest</strong></div>
                    <div className="flex justify-between border-t border-[#EEEBE4] pt-1"><span>Total Repayment Obligation:</span> <strong className="tabular-nums">₹{Math.round(documentModal.loan.totalRepayment).toLocaleString()}</strong></div>
                  </div>
                  <p className="text-[11px] text-[#6F6B63] font-light">
                    Funds will be released directly through authorized RBI RTGS/NEFT settlement rails upon digital acceptance.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif font-medium text-sm text-[#476353]">Subject: Certificate of Debt Discharge & Full Closure (NOC)</p>
                  <p className="font-light">
                    This certifies that all outstanding financial obligations arising from credit advance <strong className="font-medium">₹{documentModal.loan.amount.toLocaleString()}</strong> have been <strong className="text-[#476353] font-medium">RECONCILED IN FULL AND DISCHARGED</strong>.
                  </p>
                  <div className="bg-white p-4 rounded border border-[#DDD9D0] font-sans text-xs space-y-1.5">
                    <div className="flex justify-between"><span>Total Settled to NBFC:</span> <strong className="tabular-nums">₹{Math.round(documentModal.loan.totalRepayment).toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span>Remaining Liabilities:</span> <strong className="text-[#476353] tabular-nums">₹0.00 (Zero Balance)</strong></div>
                    <div className="flex justify-between border-t border-[#EEEBE4] pt-1"><span>Account Status:</span> <strong className="text-[#476353]">Closed & Archived</strong></div>
                  </div>
                  <p className="text-[11px] text-[#6F6B63] font-light">
                    No further dues or hypothecations remain against this facility. Certified for regulatory reporting to CIBIL, Equifax, and CRIF High Mark.
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#DDD9D0] text-[#171717] hover:border-[#171717] rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print Copy
              </button>
              <button
                onClick={() => setDocumentModal(null)}
                className="px-5 py-2 bg-[#111111] text-white text-xs font-mono uppercase tracking-wider rounded hover:bg-[#222222] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
