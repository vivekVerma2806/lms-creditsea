import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ShieldCheck, HelpCircle } from "lucide-react";

export default function DoubtSolver() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "system",
      text: "CreditSea Inquiries Desk.\nHow may we assist you regarding underwriting rules, 12% simple interest terms, or NBFC regulatory procedures?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const getInstitutionalAnswer = (text) => {
    const q = text.toLowerCase();

    if (q.includes("eligib") || q.includes("qualify") || q.includes("salary") || q.includes("age") || q.includes("criteria")) {
      return "Credit Qualification Criteria:\n• Age: 23 to 50 years at application date\n• Net Monthly Salary: Minimum ₹25,000 (verified by salary slip)\n• Employment: Salaried or Self-Employed\n• Documentation: Valid PAN and latest bank statement/salary slip.";
    }

    if (q.includes("document") || q.includes("upload") || q.includes("slip") || q.includes("pdf")) {
      return "Document Verification Protocol:\n• Upload your latest monthly salary slip\n• Permitted formats: PDF, JPG, PNG under 5MB\n• Document must display net take-home salary, employee name, and employer details.";
    }

    if (q.includes("interest") || q.includes("rate") || q.includes("apr") || q.includes("emi") || q.includes("charge") || q.includes("fee")) {
      return "Transparent Interest Structure:\n• Fixed Simple Interest: 12.00% p.a.\n• Calculation: (Principal × 12% × Days) ÷ 365\n• Zero compounding fees, zero pre-payment penalties, zero platform subscription fees.";
    }

    if (q.includes("nbfc") || q.includes("partner") || q.includes("rbi") || q.includes("escrow") || q.includes("meghdoot")) {
      return "Regulatory Lending Disclosures:\n• Lending Partner: Meghdoot Mercantile Private Limited\n• Status: RBI-registered Non-Banking Financial Company (NBFC)\n• All funds are disbursed from and repaid into regulated partner escrow accounts.";
    }

    if (q.includes("limit") || q.includes("amount") || q.includes("tenure") || q.includes("range")) {
      return "Facility Parameters:\n• Principal limits: ₹50,000 to ₹5,00,000\n• Tenure flexibility: 30 days to 365 days\n• Instant re-application available once current active balance is settled.";
    }

    return "For inquiries regarding your specific account or loan status, please consult your Client Workspace or contact support@creditsea.com. You may also ask about:\n• Eligibility rules\n• Interest calculation\n• Document verification\n• NBFC regulatory disclosures";
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const answer = getInstitutionalAnswer(text);
      setMessages((prev) => [...prev, { sender: "system", text: answer }]);
    }, 400);

    setInput("");
  };

  const topics = [
    { label: "Eligibility Criteria", query: "What are the eligibility criteria?" },
    { label: "Interest & Fees", query: "How is interest calculated?" },
    { label: "Document Formats", query: "What documents are required?" },
    { label: "NBFC Disclosure", query: "Who is the regulatory lending partner?" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] rounded-lg border border-[#333333] hover:border-[#B49A68] shadow-lg transition-all duration-200 group text-xs font-semibold"
        >
          <HelpCircle className="w-4 h-4 text-[#B49A68]" />
          <span>Inquiries Desk</span>
        </button>
      )}

      {/* Dialog Window */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-xl border border-[#DDD9D0] shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-[#111111] text-[#F6F4EF] flex justify-between items-center border-b border-[#222222]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-white p-0.5 flex items-center justify-center shadow-sm">
                <img src="/creditsea_logo_mark.png" alt="CreditSea" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-tight text-white">CreditSea Inquiries Desk</h3>
                <p className="text-[10px] font-mono text-[#969188]">Institutional Guidance</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#969188] hover:text-white rounded hover:bg-[#222222] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F6F4EF] text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#111111] text-[#F6F4EF]"
                      : "bg-white text-[#171717] border border-[#DDD9D0] shadow-sm font-medium"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick topic pills */}
          <div className="p-2.5 bg-white border-t border-[#EEEBE4] flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <button
                key={t.label}
                onClick={() => handleSend(t.query)}
                className="text-[10px] font-medium text-[#6F6B63] bg-[#F6F4EF] hover:bg-[#EEEBE4] hover:text-[#171717] px-2.5 py-1 rounded border border-[#DDD9D0] transition"
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-2.5 bg-white border-t border-[#EEEBE4] flex gap-2">
            <input
              type="text"
              placeholder="Ask an underwriting or terms question..."
              className="flex-1 px-3 py-2 text-xs bg-[#F6F4EF] border border-[#DDD9D0] rounded-lg focus:outline-none focus:border-[#B49A68] transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            />
            <button
              onClick={() => handleSend(input)}
              className="p-2 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] rounded-lg transition shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
