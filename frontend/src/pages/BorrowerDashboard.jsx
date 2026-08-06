import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FileText, Calendar, PlusCircle, CheckCircle, Clock, AlertTriangle, LogOut, Info, ShieldAlert } from "lucide-react";
import { API_URL } from "../lib/api";

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState("");
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

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
          label: "Sanctioned (Approved)",
          colorClass: "bg-emerald-50 text-emerald-750 border-emerald-250",
          icon: CheckCircle,
        };
      case "Disbursed":
        return {
          label: "Active (Funded)",
          colorClass: "bg-green-50 text-green-800 border-green-200",
          icon: CheckCircle,
        };
      case "Closed":
        return {
          label: "Settled (Closed)",
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
          colorClass: "bg-gray-55 text-gray-700 border-gray-200",
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
    setSelectedLoan(loan);
    setShowRepayModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Title Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1a253c] tracking-tight">Borrower Dashboard</h1>
              <p className="text-gray-500 text-base mt-1">Manage and track your cash advance applications</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4.5 h-4.5" />
              Sign Out
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-505 mt-4 font-bold">Retrieving accounts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Actions Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-3.5">Apply for Credit</h2>
                  
                  {hasActiveOrPendingLoan ? (
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs leading-relaxed">
                        You have an active or pending loan application under evaluation. You can apply for a new advance once your active balance is settled or closed.
                      </div>
                      <button
                        disabled
                        className="w-full py-4 px-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200 text-sm"
                      >
                        <PlusCircle className="w-5 h-5" /> Apply New Loan
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Need quick cash? Submit a new application form to get started. Verification takes less than 10 minutes.
                      </p>
                      <Link
                        to="/apply"
                        className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-200 text-sm"
                      >
                        <PlusCircle className="w-5 h-5" /> Apply New Loan
                      </Link>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-blue-600" /> Need Assistance?
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed mb-4">
                    If you have questions about interest rates, document uploads, or payment status, feel free to contact our Collections and Sanction team.
                  </p>
                  <Link to="/contact" className="text-xs font-extrabold text-blue-650 hover:underline">
                    Get Support &rarr;
                  </Link>
                </div>
              </div>

              {/* Loans List Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    My Applications
                  </h2>

                  {loans.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-bold text-gray-700 text-lg mb-1">No Loan Applications Yet</h3>
                      <p className="text-xs text-gray-550 max-w-sm mx-auto mb-6">
                        You haven't submitted any loan requests. Click "Apply New Loan" to start your profile.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {loans.map((loan) => {
                        const config = getStatusConfig(loan.status);
                        const StatusIcon = config.icon;
                        const balance = loan.totalRepayment - loan.amountPaid;

                        return (
                          <div
                            key={loan._id}
                            className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
                          >
                            <div className="space-y-3 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="text-2xl font-extrabold text-gray-955">
                                  ₹{loan.amount.toLocaleString()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${config.colorClass} flex items-center gap-1`}>
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {config.label}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 font-semibold">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  Applied on: {new Date(loan.createdAt).toLocaleDateString()}
                                </span>
                                <span>
                                  Tenure: <strong>{loan.tenure} days</strong>
                                </span>
                              </div>

                              {loan.status === "Disbursed" && (
                                <div className="mt-2 text-xs bg-gray-50 rounded-xl p-3 border border-gray-150 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Total Repayable:</span>
                                    <span className="font-bold text-gray-800">₹{Math.round(loan.totalRepayment).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Amount Settled:</span>
                                    <span className="font-bold text-green-600">₹{Math.round(loan.amountPaid).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-gray-200 pt-1">
                                    <span className="text-gray-655 font-bold">Remaining Balance:</span>
                                    <span className="font-extrabold text-red-600">₹{Math.round(balance).toLocaleString()}</span>
                                  </div>
                                </div>
                              )}

                              {loan.status === "Rejected" && loan.rejectionReason && (
                                <div className="mt-2 text-xs bg-red-50 text-red-700 border border-red-100 rounded-xl p-3 font-semibold">
                                  <strong>Reason for rejection:</strong> {loan.rejectionReason}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center shrink-0">
                              {loan.status === "Pending" && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl font-bold border border-blue-100">
                                  Under Review
                                </span>
                              )}
                              {loan.status === "Approved" && (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl font-bold border border-emerald-100">
                                  Sanctioned
                                </span>
                              )}
                              {loan.status === "Disbursed" && (
                                <button
                                  onClick={() => openRepay(loan)}
                                  className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition shadow-md shadow-blue-100"
                                >
                                  Repay Balance
                                </button>
                              )}
                              {loan.status === "Closed" && (
                                <span className="text-xs text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl font-bold border border-gray-150">
                                  Paid Off
                                </span>
                              )}
                            </div>
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

      {/* Repay Modal */}
      {showRepayModal && selectedLoan && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 md:p-8 border border-gray-150 shadow-2xl relative animate-scaleUp">
            <h3 className="text-xl font-bold text-gray-950 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-6 h-6 text-blue-600" /> Repayment Instructions
            </h3>
            
            <div className="space-y-4 text-sm leading-relaxed text-gray-650">
              <p>
                To settle your outstanding balance of <strong className="text-red-650">₹{Math.round(selectedLoan.totalRepayment - selectedLoan.amountPaid).toLocaleString()}</strong>, please transfer the amount to our licensed NBFC escrow account:
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-4 font-mono text-xs text-gray-700 space-y-2 border border-gray-150">
                <div><strong>Account Name:</strong> Meghdoot Mercantile Escrow A/C</div>
                <div><strong>Bank Name:</strong> HDFC Bank Ltd</div>
                <div><strong>Account Number:</strong> 50200087451296</div>
                <div><strong>IFSC Code:</strong> HDFC0000240</div>
                <div><strong>Branch:</strong> Raipur, Chhattisgarh</div>
              </div>

              <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-xs space-y-1">
                <p className="font-bold">Important Notice:</p>
                <p>After transferring the funds via IMPS, NEFT, or UPI, please note your 12-digit UTR transaction number.</p>
                <p className="mt-1">Provide the UTR and amount to our Collections desk (+91 1800 123 4567) or support@creditsea.com. Once audited, your loan will be closed immediately.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRepayModal(false)}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
