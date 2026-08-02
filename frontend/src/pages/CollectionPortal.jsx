import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { CreditCard, Calendar, Plus, ShieldCheck, Check } from "lucide-react";

export default function CollectionPortal() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/collection/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching collection loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/dashboard/collection/payments`, 
        { loanId: selectedLoan._id, utr, amount: Number(amount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSelectedLoan(null);
      setUtr("");
      setAmount("");
      setSuccess("Payment UTR verified and recorded successfully!");
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log payment");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-955">Collection Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Audit repayments, match transaction UTR receipts, and close balances</p>
      </div>

      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-bold">{success}</div>}
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">{error}</div>}

      {/* Record Payment Form Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handlePayment} className="bg-white max-w-md w-full rounded-3xl p-6 border border-gray-150 shadow-2xl relative space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-955 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> Record Repayment
            </h3>

            <div className="bg-gray-55 rounded-2xl p-3 border border-gray-150 text-xs font-semibold text-gray-600">
              <div>PAN: <strong className="text-gray-900 uppercase">{selectedLoan.borrowerId?.pan}</strong></div>
              <div className="mt-1">Remaining Balance: <strong className="text-red-655">₹{Math.round(selectedLoan.totalRepayment - selectedLoan.amountPaid).toLocaleString()}</strong></div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Transaction UTR Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 234109847123"
                  className="w-full px-4 py-2.5 border border-gray-305 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Amount Paid (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2.5 border border-gray-305 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-750 transition"
              >
                Log Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collection Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="font-extrabold text-base text-gray-900">Active Outstanding Advances</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Loading active list...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total Due</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Settled</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Balance Due</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {loans.map((loan) => {
                  const balance = loan.totalRepayment - loan.amountPaid;
                  return (
                    <tr key={loan._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 uppercase">
                        {loan.borrowerId?.pan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        ₹{Math.round(loan.totalRepayment).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                        ₹{Math.round(loan.amountPaid).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                        ₹{Math.round(balance).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLoan(loan)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" /> Record Payment
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No active disbursed loans requiring collection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
