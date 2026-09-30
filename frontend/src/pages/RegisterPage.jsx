import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../lib/api";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name || "");
      
      navigate("/borrower/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check details or use another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F4EF] py-12 px-4 sm:px-6 lg:px-8 text-[#171717]">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-xl border border-[#DDD9D0] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
        
        {/* Header Monogram */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex flex-col items-center justify-center gap-2 group">
            <img
              src="/creditsea_logo_mark.png"
              alt="CreditSea"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
            <div className="flex flex-col items-center">
              <div className="flex items-baseline">
                <span className="font-serif text-2xl font-bold text-[#171717] tracking-tight leading-none">
                  Credit<span className="text-[#B49A68]">Sea</span>
                </span>
                <span className="text-[9px] font-mono text-[#B49A68] ml-0.5 relative -top-1 font-semibold">™</span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.26em] text-[#6F6B63] mt-1.5 font-semibold leading-none">
                Capital Platform
              </span>
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#171717] tracking-tight">Open Client Account</h1>
            <p className="text-xs text-[#6F6B63] mt-1 font-normal">
              Register your credentials to initiate automated credit onboarding
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-[#874F4F]/10 border border-[#874F4F]/30 text-[#874F4F] rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
              Legal Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. rahul@example.com"
              className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
              Secure Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition font-mono"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition duration-150 flex items-center justify-center gap-1.5 disabled:opacity-60 shadow-sm"
            >
              <span>{loading ? "Creating Profile..." : "Create Client Account"}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#EEEBE4] text-center text-xs text-[#6F6B63]">
          Already have an active account?{" "}
          <Link to="/auth/login" className="font-semibold text-[#171717] hover:underline">
            Sign In &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
