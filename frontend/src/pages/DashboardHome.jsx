import { useEffect, useState } from "react";
import { ShieldCheck, UserCheck, ShieldAlert, Award, FileText } from "lucide-react";

export default function DashboardHome() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "Executive");
    setRole(localStorage.getItem("role") || "Staff");
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            Welcome back, {name}!
          </h1>
          <p className="text-blue-150 text-sm mt-1 font-semibold">
            CreditSea Loan Management System - Operations Center
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl text-xs font-black uppercase text-amber-300">
          <ShieldAlert className="w-4.5 h-4.5" /> Authorized {role} Access
        </div>
      </div>

      {/* Role specific guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Desk Procedures */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" /> Operational Desk Checklist
          </h3>
          <ul className="space-y-3.5 text-xs text-gray-650 font-semibold leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
              <div>
                <strong className="text-gray-900 block">Sales (Leads)</strong>
                Verify registered borrower emails and confirm contact details during initial cold calls.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
              <div>
                <strong className="text-gray-900 block">Sanction</strong>
                Review age, net monthly income criteria (min ₹25K), and verify salary slip document matches.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
              <div>
                <strong className="text-gray-900 block">Disbursement</strong>
                Process disbursements to borrower accounts securely. Avoid double releases.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">4</span>
              <div>
                <strong className="text-gray-900 block">Collection</strong>
                Log payment receipts matching unique UTR codes. Set loans as Closed immediately on settlement.
              </div>
            </li>
          </ul>
        </div>

        {/* Regulatory & Safety Box */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-950 text-indigo-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Regulatory Compliance (BRE Rules)
          </h3>
          <div className="space-y-4 text-xs font-semibold leading-relaxed">
            <div className="bg-indigo-950/40 p-4 border border-indigo-800/40 rounded-2xl space-y-2">
              <p className="text-white font-bold">Business Rule Engine (BRE) Parameters:</p>
              <ul className="list-disc pl-4 space-y-1 text-indigo-305">
                <li>Applicant Age: 23 to 50 Years</li>
                <li>Salary Level: Minimum ₹25,000 / month</li>
                <li>Employment Status: Salaried / Self-Employed</li>
                <li>Files Format: PDF, JPG, PNG under 5MB</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
              <p className="text-indigo-305">
                Our operations comply fully with RBI guidelines. All transactions are securely routed through NBFC partner escrow mechanisms under Meghdoot Mercantile Private Limited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
