import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { Send, Calendar, ShieldCheck, CheckCircle } from "lucide-react";

export default function DisbursementPortal() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/dashboard/disbursement/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data.loans);
    } catch (err) {
      console.error("Error fetching approved loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleDisburse = async (id) => {
    if (!confirm("Are you sure you want to release and disburse funds for this loan?")) return;
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/dashboard/disbursement/loans/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLoans();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to disburse loan funds");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-955">Disbursement Desk</h1>
        <p className="text-gray-500 text-sm mt-1">Disburse capital lines to approved credit advances</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">{error}</div>}

      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="font-extrabold text-base text-gray-900">Approved Loan Disbursement Queue</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Loading disbursement queue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Approved Capital</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Sanctioned Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {loans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 uppercase">
                      {loan.borrowerId?.pan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-extrabold text-blue-650">₹{loan.amount.toLocaleString()}</div>
                      <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                        Tenure: {loan.tenure} Days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold">
                      <Calendar className="w-4 h-4 text-gray-400 inline mr-1" />
                      {new Date(loan.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDisburse(loan._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-750 border border-blue-200 rounded-xl text-xs font-extrabold transition shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Release Funds
                      </button>
                    </td>
                  </tr>
                ))}
                {loans.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">No approved advances ready for disbursement.</td>
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
