import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InstitutionalGauge from "../components/presets/InstitutionalGauge";
import BlurFade from "../components/presets/BlurFade";
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

/**
 * ApplyFlow Component
 * Sourced from component.gallery / 21st.dev / Magic UI
 * Multi-step private banking onboarding with KYC verification & term configuration
 */
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

    const formData = new FormData();
    formData.append("salarySlip", salarySlip);

    try {
      await axios.post(`${API_URL}/api/borrower/upload-slip`, formData, {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading document.");
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
        `${API_URL}/api/borrower/loan-request`,
        { amount, tenure },
        { headers: getHeaders() }
      );
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting loan facility request.");
    } finally {
      setLoading(false);
    }
  };

  // Financial calculations
  const interestRate = 0.12;
  const simpleInterest = (amount * interestRate * tenure) / 365;
  const totalRepayment = amount + simpleInterest;

  const stepsList = [
    { num: 1, title: "Identity & KYC" },
    { num: 2, title: "Income Verification" },
    { num: 3, title: "Facility Terms" },
    { num: 4, title: "Sanction Queue" },
  ];

  const progressPercentage = step * 25;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
          
          {/* Header & Circular Gauge Indicator */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-6 border-b border-[#DDD9D0]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A68]"></span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#6F6B63]">
                  Regulatory Credit Onboarding
                </span>
              </div>
              <h1 className="text-3xl font-serif font-medium text-[#171717] tracking-tight">
                Capital Facility Application
              </h1>
              <p className="text-xs text-[#6F6B63] font-light mt-1">
                Underwritten by automated Business Rule Engine (BRE) under Reserve Bank of India guidelines.
              </p>
            </div>

            <InstitutionalGauge
              percentage={progressPercentage}
              size={64}
              strokeWidth={4}
              label={`Step ${step} of 4`}
              sublabel={stepsList[step - 1].title}
            />
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-8 bg-white border border-[#DDD9D0] rounded-lg p-4">
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
                      <span className={`text-xs font-mono hidden sm:inline ${
                        isCurrent ? "text-[#171717] font-semibold" : "text-[#6F6B63]"
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
          <div className="bg-white rounded-lg p-6 sm:p-9 border border-[#DDD9D0] shadow-sm relative">
            {error && (
              <div className="mb-6 p-4 bg-[#FBEAEA] border border-[#E8C2C2] text-[#874F4F] rounded text-xs font-medium">
                {error}
              </div>
            )}

            {/* STEP 1: Personal & KYC */}
            {step === 1 && (
              <BlurFade delay={0.05} yOffset={6}>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-[#DDD9D0] pb-4">
                    <div>
                      <h2 className="text-base font-serif font-medium text-[#171717]">Step 1 — Identity & Income Profile</h2>
                      <p className="text-xs text-[#6F6B63] font-light mt-0.5">Please provide statutory tax credentials and net monthly remuneration.</p>
                    </div>
                    <div className="max-w-[120px] shrink-0 border border-[#DDD9D0] rounded overflow-hidden hidden md:block">
                      <img src="/kyc_audit.jpg" alt="KYC Verification Motif" className="w-full h-auto object-cover" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                        Permanent Account Number (PAN)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs font-mono uppercase focus:outline-none focus:border-[#111111]"
                      />
                      <span className="text-[10px] text-[#969188] font-mono mt-1 block">Indian Income Tax Ten-Digit Alphanumeric</span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                        Date of Birth (DOB)
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
                      />
                      <span className="text-[10px] text-[#969188] font-mono mt-1 block">BRE Rule: Age must be between 23 and 50 years</span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                        Net Monthly Take-Home (₹)
                      </label>
                      <input
                        type="number"
                        required
                        min="25000"
                        placeholder="e.g. 50000"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
                      />
                      <span className="text-[10px] text-[#969188] font-mono mt-1 block">Minimum Net Salary: ₹25,000 / month</span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-1.5">
                        Employment Mode
                      </label>
                      <select
                        value={employmentMode}
                        onChange={(e) => setEmploymentMode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded text-xs font-mono focus:outline-none focus:border-[#111111]"
                      >
                        <option value="Salaried">Salaried (Private / Govt Enterprise)</option>
                        <option value="Self-Employed">Self-Employed (Proprietorship / GST)</option>
                      </select>
                      <span className="text-[10px] text-[#969188] font-mono mt-1 block">Underwriting classification</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-[#DDD9D0]">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#6F6B63]">
                      <Lock className="w-3.5 h-3.5 text-[#476353]" /> Encrypted Data Protection
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-mono uppercase tracking-wider rounded transition flex items-center gap-1.5"
                    >
                      <span>{loading ? "Verifying Record..." : "Continue to Documents"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
                    </button>
                  </div>
                </form>
              </BlurFade>
            )}

            {/* STEP 2: Income Verification Document */}
            {step === 2 && (
              <BlurFade delay={0.05} yOffset={6}>
                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <div className="border-b border-[#DDD9D0] pb-4">
                    <h2 className="text-base font-serif font-medium text-[#171717]">Step 2 — Financial Documentation</h2>
                    <p className="text-xs text-[#6F6B63] font-light mt-0.5">Attach recent salary slip or 3-month bank statement for algorithmic verification.</p>
                  </div>

                  <div className="border-2 border-dashed border-[#DDD9D0] hover:border-[#B49A68] rounded-lg p-8 text-center bg-[#F6F4EF] transition">
                    <input
                      type="file"
                      id="slipUpload"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setSalarySlip(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="slipUpload" className="cursor-pointer space-y-3 block">
                      <div className="w-12 h-12 rounded-full bg-white border border-[#DDD9D0] flex items-center justify-center mx-auto text-[#111111]">
                        <UploadCloud className="w-6 h-6 text-[#B49A68]" />
                      </div>
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#171717] block">
                          {salarySlip ? salarySlip.name : "Select Salary Proof Document"}
                        </span>
                        <span className="text-[11px] text-[#6F6B63] font-light mt-1 block">
                          PDF, PNG, JPG accepted · Max 5MB file payload
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-[#DDD9D0]">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-[#DDD9D0] text-[#6F6B63] hover:text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !salarySlip}
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-mono uppercase tracking-wider rounded transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span>{loading ? "Validating Cryptographic Hash..." : "Attach & Configure Terms"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
                    </button>
                  </div>
                </form>
              </BlurFade>
            )}

            {/* STEP 3: Facility Terms & Duration */}
            {step === 3 && (
              <BlurFade delay={0.05} yOffset={6}>
                <form onSubmit={handleLoanSubmit} className="space-y-6">
                  <div className="border-b border-[#DDD9D0] pb-4">
                    <h2 className="text-base font-serif font-medium text-[#171717]">Step 3 — Capital Quantum & Tenure</h2>
                    <p className="text-xs text-[#6F6B63] font-light mt-0.5">Select your desired credit advance facility amount and amortization term.</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Principal Facility</span>
                        <span className="font-serif text-2xl font-medium text-[#171717] tabular-nums">₹{amount.toLocaleString()}</span>
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
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#6F6B63]">Facility Tenure</span>
                        <span className="font-serif text-2xl font-medium text-[#171717] tabular-nums">{tenure} Days</span>
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
                  <div className="bg-[#F6F4EF] rounded p-5 border border-[#DDD9D0] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#DDD9D0]">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#171717]">Credit Facility Statement</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EFEFE9] text-[#476353] border border-[#CCD8D0]">
                        Fixed 12% APR Simple
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#6F6B63]">Principal Sanction:</span>
                        <span className="font-mono text-[#171717] tabular-nums">₹{amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6F6B63]">Accrued Interest ({tenure} days):</span>
                        <span className="font-mono text-[#B49A68] tabular-nums">₹{Math.round(simpleInterest).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-[#DDD9D0] pt-2 text-[#171717] font-semibold text-sm">
                        <span>Total Repayment Obligation:</span>
                        <span className="font-mono tabular-nums">₹{Math.round(totalRepayment).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-[#DDD9D0]">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-[#DDD9D0] text-[#6F6B63] hover:text-[#171717] rounded text-xs font-mono uppercase tracking-wider transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-mono uppercase tracking-wider rounded transition flex items-center gap-1.5 disabled:opacity-60"
                    >
                      <span>{loading ? "Transmitting..." : "Submit to Sanction Queue"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
                    </button>
                  </div>
                </form>
              </BlurFade>
            )}

            {/* STEP 4: Success / Confirmation */}
            {step === 4 && (
              <BlurFade delay={0.05} yOffset={6}>
                <div className="text-center py-8 space-y-6">
                  {/* Generated Loan Clearance Illustration */}
                  <div className="max-w-xs mx-auto border border-[#DDD9D0] rounded-lg overflow-hidden bg-[#F6F4EF]">
                    <img src="/sanction_clearance.jpg" alt="Official Sanction Clearance Motif" className="w-full h-auto object-cover" />
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#476353] bg-[#EFEFE9] px-2.5 py-1 rounded border border-[#CCD8D0]">
                      Dossier Transmitted to Underwriting Desk
                    </span>
                    <h2 className="text-2xl font-serif font-medium text-[#171717] tracking-tight">
                      Application Logged in Sanction Queue
                    </h2>
                    <p className="text-xs text-[#6F6B63] max-w-md mx-auto leading-relaxed font-light">
                      Your credit facility request of <strong className="text-[#171717]">₹{amount.toLocaleString()}</strong> has been routed to the Sanction Desk. Risk verification will conclude in 10 minutes.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate("/borrower/dashboard")}
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-mono uppercase tracking-wider rounded transition"
                    >
                      Open Client Portfolio Desk &rarr;
                    </button>
                  </div>
                </div>
              </BlurFade>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
