import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send, ShieldCheck, Check } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Facility Inquiries",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Facility Inquiries",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#171717]">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B49A68] font-bold">
              Direct Communication
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#171717] mt-2 tracking-tight">
              Support & Inquiries Desk
            </h1>
            <p className="text-sm sm:text-base text-[#6F6B63] mt-2 leading-relaxed">
              Direct support for facility underwriting, payment receipt matching, and institutional partner coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Details (4 cols) */}
            <div className="lg:col-span-4 bg-[#111111] rounded-xl p-7 text-[#F6F4EF] space-y-6 border border-[#222222]">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Operational Desk</h2>
                <p className="text-xs text-[#969188] mt-0.5">Meghdoot Mercantile Partner Coordination</p>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B49A68] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#969188] block text-[10px] uppercase font-mono">Toll-Free Desk</span>
                    <span className="font-semibold text-white text-sm tabular-nums">+91 1800 123 4567</span>
                    <span className="text-[10px] text-[#6F6B63] block">Mon–Sat, 09:30–18:00 IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B49A68] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#969188] block text-[10px] uppercase font-mono">Direct Email</span>
                    <span className="font-semibold text-white text-sm">support@creditsea.com</span>
                    <span className="text-[10px] text-[#6F6B63] block">24h Institutional Response Latency</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B49A68] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#969188] block text-[10px] uppercase font-mono">Registered Office</span>
                    <span className="font-medium text-[#DDD9D0] leading-relaxed block text-xs">
                      SO-11, 3rd Floor, Magneto Offizo,<br />
                      Magneto The Mall, Labhandi,<br />
                      Raipur, Chhattisgarh 492001
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#222222] text-[10px] font-mono text-[#6F6B63] space-y-1">
                <div>Escrow Bank: HDFC Bank Ltd</div>
                <div>Grievance Officer: compliance@creditsea.com</div>
              </div>
            </div>

            {/* Contact Form (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-[#DDD9D0] rounded-xl p-7 md:p-9 shadow-sm">
              <h2 className="text-lg font-bold text-[#171717] mb-6 tracking-tight">Transmit Secure Inquiry</h2>

              {submitted ? (
                <div className="bg-[#476353]/10 border border-[#476353]/30 text-[#476353] p-8 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#476353] text-white flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">Inquiry Dispatched</h3>
                  <p className="text-xs text-[#6F6B63] max-w-sm mx-auto">
                    Your inquiry has been logged into our support ticketing system. An underwriting officer will review your notes shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option value="Facility Inquiries">Facility Inquiries</option>
                        <option value="Underwriting Status">Underwriting Status</option>
                        <option value="Disbursement Verification">Disbursement Verification</option>
                        <option value="Repayment & UTR Clearance">Repayment & UTR Clearance</option>
                        <option value="Regulatory / NBFC Compliance">Regulatory / NBFC Compliance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6F6B63] uppercase tracking-wider mb-1.5">
                      Inquiry Notes
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-3.5 py-2.5 bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#B49A68] transition resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify your application reference or question details..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition duration-150 flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5 text-[#B49A68]" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
