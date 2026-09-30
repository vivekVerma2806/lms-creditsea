import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  ShieldCheck, 
  ChevronRight, 
  UploadCloud, 
  Check, 
  ChevronLeft, 
  HelpCircle,
  FileCheck,
  Building2,
  Lock,
  ArrowUpRight
} from "lucide-react";

export default function ApplyFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Profile State
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employmentMode, setEmploymentMode] = useState("Salaried");

  // Step 2: Upload State
  const [salarySlip, setSalarySlip] = useState(null);

  // Step 3: Config State
  const [amount, setAmount] = useState(150000);
  const [tenure, setTenure] = useState(90);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side BRE checks
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 23 || age > 50) {
      setError("Regulatory Criteria: Applicant age must be between 23 and 50 years.");
      setLoading(false);
      return;
    }
    if (Number(monthlySalary) < 25000) {
      setError("Underwriting Threshold: Monthly net take-home salary must be at least ₹25,000.");
      setLoading(false);
      return;
    }
    if (employmentMode === "Unemployed") {
      setError("Underwriting Threshold: Active employment required for facility allocation.");
      setLoading(false);
      return;
    }
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan.toUpperCase())) {
      setError("PAN Validation: Permanent Account Number must match Indian Income Tax format (e.g. ABCDE1234F).");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/borrower/profile`,
        { pan: pan.toUpperCase(), dob, monthlySalary: Number(monthlySalary), employmentMode },
        { headers: getHeaders() }
      );
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!salarySlip) {
      setError("Please attach a valid salary slip document to proceed.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("salarySlip", salarySlip);
      await axios.post(`${API_URL}/api/borrower/upload-slip`, formData, {
        headers: { 
          ...getHeaders(), 
          "Content-Type": "multipart/form-data" 
        },
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading document. Accepted formats: PDF, JPG, PNG under 5MB.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${API_URL}/api/borrower/loan`,
        { amount: Number(amount), tenure: Number(tenure) },
        { headers: getHeaders() }
      );
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting loan facility request.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 financial calculations
  const interestRate = 0.12;
  const simpleInterest = (amount * interestRate * tenure) / 365;
  const totalRepayment = amount + simpleInterest;

  const stepsList = [
    { num: 1, title: "Identity & KYC" },
    { num: 2, title: "Income Verification" },
    { num: 3, title: "Facility Terms" },
    { num: 4, title: "Sanction Queue" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl w-full mx-auto px-4">
          
          {/* Header Title */}
          <div className="text-left mb-8 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B49A68] font-bold">
              Facility Onboarding
            </span>
            <h1 className="text-3xl font-black text-[#171717] tracking-tight">
              Credit Facility Application
            </h1>
            <p className="text-xs text-[#6F6B63]">
              Underwritten by automated Business Rule Engine (BRE) under RBI guidelines
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-10 bg-white border border-[#DDD9D0] rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-4 gap-2">
              {stepsList.map((s) => {
                const isCurrent = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition ${
                        isCompleted ? "bg-[#476353] text-white" :
                        isCurrent ? "bg-[#111111] text-[#F6F4EF]" :
                        "bg-[#EEEBE4] text-[#969188]"
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:inline ${
                        isCurrent ? "text-[#171717]" : "text-[#6F6B63]"
                      }`}>
                        {s.title}
                      </span>
                    </div>
                    <div className={`h-1 w-full rounded-full transition-all duration-300 ${
                      isCompleted ? "bg-[#476353]" :
                      isCurrent ? "bg-[#B49A68]" :
                      "bg-[#EEEBE4]"
                    }`}></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-7 md:p-9 border border-[#DDD9D0] relative">
            {error && (
              <div className="mb-6 p-3.5 bg-[#874F4F]/10 border border-[#874F4F]/30 text-[#874F4F] rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            {/* STEP 1: Personal & KYC */}
            {step === 1 && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="border-b border-[#EEEBE4] pb-4">
                  <h2 className="text-lg font-bold text-[#171717] tracking-tight">Step 1 — Identity & Income Profile</h2>
                  <p className="text-xs text-[#6F6B63] mt-0.5">Please provide your government tax identification and monthly income parameters.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-[#B49A68] transition"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                    />
                    <span className="text-[10px] text-[#969188] font-mono mt-1 block">Format: 5 letters, 4 digits, 1 letter</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    <span className="text-[10px] text-[#969188] font-mono mt-1 block">Required Age Window: 23 to 50 years</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                      Net Monthly Take-Home Salary (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={25000}
                      placeholder="e.g. 55000"
                      className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition tabular-nums"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(e.target.value)}
                    />
                    <span className="text-[10px] text-[#969188] font-mono mt-1 block">Minimum regulatory threshold: ₹25,000/mo</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                      Employment Classification
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
                      value={employmentMode}
                      onChange={(e) => setEmploymentMode(e.target.value)}
                    >
                      <option value="Salaried">Salaried (Private or Public Sector)</option>
                      <option value="Self-Employed">Self-Employed Professional</option>
                      <option value="Unemployed">Unemployed (Not Eligible)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#EEEBE4]">
                  <Link
                    to="/borrower/dashboard"
                    className="px-4 py-2 text-xs font-semibold text-[#6F6B63] hover:text-[#171717] transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
                  >
                    <span>{loading ? "Verifying..." : "Save & Proceed"}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#B49A68]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Income Document Upload */}
            {step === 2 && (
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="border-b border-[#EEEBE4] pb-4">
                  <h2 className="text-lg font-bold text-[#171717] tracking-tight">Step 2 — Proof of Income Document</h2>
                  <p className="text-xs text-[#6F6B63] mt-0.5">Attach your most recent salary slip or banking statement for underwriting verification.</p>
                </div>

                <div className="border border-dashed border-[#B8B2A8] hover:border-[#171717] rounded-xl p-10 text-center bg-[#F6F4EF] transition relative cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => e.target.files && setSalarySlip(e.target.files[0])}
                  />
                  
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#DDD9D0] flex items-center justify-center text-[#111111]">
                      <UploadCloud className="w-6 h-6 text-[#B49A68]" />
                    </div>
                    <div>
                      {salarySlip ? (
                        <div className="space-y-1">
                          <p className="font-bold text-xs text-[#171717] flex items-center justify-center gap-1">
                            <FileCheck className="w-4 h-4 text-[#476353]" />
                            {salarySlip.name}
                          </p>
                          <p className="text-[10px] text-[#476353] font-mono">Document Ready for Transmittal</p>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-xs text-[#171717]">Select Document or Drag File Here</p>
                          <p className="text-[11px] text-[#6F6B63] mt-1 font-mono">Supported Formats: PDF, JPG, PNG (Max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#EEEBE4]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-[#6F6B63] hover:text-[#171717] flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
                  >
                    <span>{loading ? "Uploading Document..." : "Verify & Continue"}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#B49A68]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Loan Structuring & Summary Review */}
            {step === 3 && (
              <form onSubmit={handleLoanSubmit} className="space-y-6">
                <div className="border-b border-[#EEEBE4] pb-4">
                  <h2 className="text-lg font-bold text-[#171717] tracking-tight">Step 3 — Structure Loan Facility</h2>
                  <p className="text-xs text-[#6F6B63] mt-0.5">Select your desired advance volume and repayment schedule.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-[#6F6B63] uppercase tracking-wider">Principal Advance</span>
                      <span className="font-extrabold text-xl text-[#171717] tabular-nums">₹{amount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="10000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-[#969188] mt-1">
                      <span>₹50,000</span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-[#6F6B63] uppercase tracking-wider">Facility Tenure</span>
                      <span className="font-extrabold text-xl text-[#171717] tabular-nums">{tenure} Days</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-[#969188] mt-1">
                      <span>30 Days (1 Month)</span>
                      <span>365 Days (12 Months)</span>
                    </div>
                  </div>
                </div>

                {/* Review Facility Terms Card */}
                <div className="bg-[#F6F4EF] rounded-xl p-5 border border-[#DDD9D0] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD9D0]">
                    <span className="text-xs font-bold text-[#171717]">Credit Facility Statement</span>
                    <span className="text-[10px] font-mono text-[#476353]">Fixed 12% APR</span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-[#6F6B63]">
                    <div className="flex justify-between">
                      <span>Principal Disbursable:</span>
                      <span className="font-semibold text-[#171717] tabular-nums">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Simple Interest ({tenure} days):</span>
                      <span className="font-semibold text-[#B49A68] tabular-nums">₹{Math.round(simpleInterest).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#DDD9D0] pt-2 text-[#171717] font-bold text-sm">
                      <span>Total Repayment Obligation:</span>
                      <span className="tabular-nums">₹{Math.round(totalRepayment).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#EEEBE4]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-[#6F6B63] hover:text-[#171717] flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
                  >
                    <span>{loading ? "Transmitting Application..." : "Submit for Sanction Audit"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Success / Confirmation */}
            {step === 4 && (
              <div className="text-center py-8 space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#476353]/10 border border-[#476353]/20 text-[#476353] flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#476353] font-bold">
                    Transmission Acknowledged
                  </span>
                  <h2 className="text-2xl font-black text-[#171717] tracking-tight">Application Logged in Sanction Queue</h2>
                  <p className="text-xs text-[#6F6B63] max-w-md mx-auto leading-relaxed">
                    Your credit request of <strong className="text-[#171717]">₹{amount.toLocaleString()}</strong> has been submitted to the Sanction Desk for underwriting verification.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate("/borrower/dashboard")}
                    className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg transition"
                  >
                    Open Client Workspace &rarr;
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
