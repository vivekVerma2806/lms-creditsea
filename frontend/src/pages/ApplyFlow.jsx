import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../lib/api";
import { ShieldCheck, ChevronRight, UploadCloud, CheckCircle2, ChevronLeft, HelpCircle } from "lucide-react";

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
  const [amount, setAmount] = useState(100000);
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

    // Client-side BRE checks before request
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 23 || age > 50) {
      setError("Eligibility Check Failed: Age must be between 23 and 50 years.");
      setLoading(false);
      return;
    }
    if (Number(monthlySalary) < 25000) {
      setError("Eligibility Check Failed: Monthly salary must be ₹25,005 or higher.");
      setLoading(false);
      return;
    }
    if (employmentMode === "Unemployed") {
      setError("Eligibility Check Failed: Unemployed applicants cannot apply.");
      setLoading(false);
      return;
    }
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan.toUpperCase())) {
      setError("Eligibility Check Failed: Invalid PAN number format (Format: ABCDE1234F).");
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
      setError("Please select a valid file to upload");
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
      setError(err.response?.data?.message || "Error uploading salary slip. Make sure it is an image or PDF under 5MB.");
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
      setError(err.response?.data?.message || "Error submitting loan request.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 live simple interest calculator
  const interestRate = 0.12;
  const simpleInterest = (amount * interestRate * tenure) / 365;
  const totalRepayment = amount + simpleInterest;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-16">
      <div className="max-w-3xl w-full mx-auto px-4">
        
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {["Profile Details", "Salary Upload", "Configure Loan", "Done"].map((label, i) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${step > i ? "bg-blue-600 text-white border-blue-650" : "bg-white text-gray-400 border-gray-200"}`}>
                  {i + 1}
                </div>
                <span className={`mt-2.5 text-xs font-bold ${step > i ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-150 relative overflow-hidden">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">{error}</div>}

          {/* STEP 1: Details */}
          {step === 1 && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-950">Personal Details</h2>
                <p className="text-gray-500 text-xs mt-1">Provide your profile info to verify eligibility criteria.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">PAN Number</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase text-sm"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Monthly Net Salary (₹)</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    placeholder="e.g. 45000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Employment Mode</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    value={employmentMode}
                    onChange={(e) => setEmploymentMode(e.target.value)}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/borrower/dashboard")}
                  className="px-6 py-3 border border-gray-250 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-750 text-white font-extrabold rounded-2xl flex items-center gap-1 text-sm shadow-md shadow-blue-200 transition disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Continue"} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: File Upload */}
          {step === 2 && (
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-950">Upload Documents</h2>
                <p className="text-gray-500 text-xs mt-1">Please upload your latest salary slip. Maximum file size is 5MB.</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-3xl p-12 text-center bg-gray-50/50 hover:bg-blue-50/10 transition relative group cursor-pointer">
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => e.target.files && setSalarySlip(e.target.files[0])}
                />
                
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition duration-200 text-blue-600">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    {salarySlip ? (
                      <p className="font-extrabold text-sm text-blue-600">{salarySlip.name}</p>
                    ) : (
                      <>
                        <p className="font-bold text-gray-800 text-sm">Drag and drop file here, or click to browse</p>
                        <p className="text-[11px] text-gray-400 mt-1 font-semibold">Supports PDF, JPG, PNG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-250 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 text-sm transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-750 text-white font-extrabold rounded-2xl text-sm shadow-md shadow-blue-200 transition disabled:opacity-60"
                >
                  {loading ? "Uploading slip..." : "Continue"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Config sliders */}
          {step === 3 && (
            <form onSubmit={handleLoanSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-955">Configure Loan</h2>
                <p className="text-gray-500 text-xs mt-1">Adjust your advance capital amount and repayment tenure.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase">Principal Loan Amount</label>
                    <span className="font-extrabold text-lg text-blue-650">₹{amount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="10000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 font-semibold mt-1">
                    <span>₹50K</span>
                    <span>₹5L</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase">Tenure in Days</label>
                    <span className="font-extrabold text-lg text-blue-650">{tenure} Days</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="365"
                    step="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 font-semibold mt-1">
                    <span>30 Days</span>
                    <span>365 Days</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-3">
                  <HelpCircle className="w-4.5 h-4.5 text-blue-600" /> Repayment Summary (Simple Interest - 12% p.a.)
                </h4>
                
                <div className="space-y-2 text-xs font-semibold text-blue-900">
                  <div className="flex justify-between">
                    <span className="text-blue-755">Principal Advance:</span>
                    <span>₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-755">Daily Interest (12%):</span>
                    <span>₹{Math.round(simpleInterest).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-extrabold text-sm text-blue-950">
                    <span>Total Outstanding Repayment:</span>
                    <span>₹{Math.round(totalRepayment).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-250 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 text-sm transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-750 text-white font-extrabold rounded-2xl text-sm shadow-md shadow-blue-200 transition disabled:opacity-60"
                >
                  {loading ? "Submitting Advance..." : "Apply Now"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-gray-950">Application Completed!</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Your credit request has been logged successfully and sent to our Sanction Desk. You can track audits in real-time.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/borrower/dashboard")}
                  className="px-8 py-3 bg-gray-950 hover:bg-gray-800 text-white font-bold rounded-2xl transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
