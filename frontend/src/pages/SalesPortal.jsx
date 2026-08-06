import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/api";
import { Users, Calendar, Mail, FileCheck } from "lucide-react";

export default function SalesPortal() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/dashboard/sales/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeads(res.data.leads);
      } catch (err) {
        console.error("Error fetching leads", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-950">Sales Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Audit registered borrowers and application leads</p>
      </div>

      {/* Top statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-150 rounded-3xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Total Registered Leads</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{leads.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" />
          <h2 className="font-extrabold text-base text-gray-900">Borrower Leads List</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xs font-bold">Fetching leads list...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Borrower Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 bg-white text-sm">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-650 text-xs font-black uppercase">
                        {lead.name.charAt(0)}
                      </div>
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold flex-items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-400 inline mr-1" />
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold">
                      <Calendar className="w-4 h-4 text-gray-400 inline mr-1" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 font-medium">No registered leads found in the database.</td>
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
