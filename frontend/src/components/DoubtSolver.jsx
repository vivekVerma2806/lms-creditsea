import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ShieldCheck, Sparkles } from "lucide-react";

export default function DoubtSolver() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your CreditSea Assistant. How can I help you today? I can answer questions about eligibility, interest rates, salary slips, and our NBFC partner.",
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

  const getAIResponse = (text) => {
    const query = text.toLowerCase();

    if (query.includes("eligib") || query.includes("qualify") || query.includes("salary") || query.includes("age") || query.includes("work")) {
      return "To qualify for a CreditSea loan: \n• You must be between 23 and 50 years old.\n• Your monthly salary must be ₹25,000 or above.\n• You must be employed (Salaried or Self-Employed; unemployed applicants are not eligible).\n• You must have a valid PAN card.";
    }

    if (query.includes("document") || query.includes("upload") || query.includes("slip") || query.includes("pdf") || query.includes("file") || query.includes("size") || query.includes("limit")) {
      return "For document verification:\n• You need to upload your latest salary slip.\n• Accepted formats: PDF, JPG, JPEG, and PNG.\n• Maximum file size limit is 5MB.";
    }

    if (query.includes("interest") || query.includes("rate") || query.includes("percent") || query.includes("emi") || query.includes("charge") || query.includes("fee")) {
      return "Our loan rates are highly transparent:\n• We charge flat Simple Interest of 12% p.a.\n• Formula: Interest = (Principal × 12% × Tenure in days) ÷ 365.\n• No hidden charges, compounding, or prepayment penalties!";
    }

    if (query.includes("nbfc") || query.includes("partner") || query.includes("rbi") || query.includes("safe") || query.includes("escrow") || query.includes("meghdoot") || query.includes("legal")) {
      return "CreditSea operates in complete compliance with RBI guidelines. Our RBI-registered NBFC partner is Meghdoot Mercantile Private Limited. Disbursements and repayments are routed securely via an Escrow account.";
    }

    if (query.includes("amount") || query.includes("limit") || query.includes("max") || query.includes("min") || query.includes("range")) {
      return "You can apply for credit lines ranging from ₹50,000 up to ₹5,00,000, with flexible repayment tenures from 30 days up to 365 days.";
    }

    return "I'm not sure I understand that query completely. Feel free to ask about: \n• 'What is the eligibility criteria?'\n• 'What documents do I need to upload?'\n• 'What are the interest rates?'\n• 'Who is your NBFC lending partner?'";
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiText = getAIResponse(text);
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    }, 600);

    setInput("");
  };

  const suggestions = [
    { label: "Eligibility check", query: "What is the loan eligibility criteria?" },
    { label: "Document limits", query: "What are the salary slip file upload rules?" },
    { label: "Interest & Fees", query: "What are the interest rates?" },
    { label: "NBFC License", query: "Is this RBI registered? Who is your partner?" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-55">
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl shadow-blue-400/50 hover:scale-105 transition-all duration-300 group"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm tracking-wide">Ask AI Doubt Solver</span>
          <MessageSquare className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform duration-200" />
        </button>
      )}

      {/* Chat bubble window */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-3xl border border-gray-150 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-650 text-white flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">Doubt Solver AI</h3>
                <p className="text-[10px] text-blue-100 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-300 inline" /> NBFC Verified Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="p-3 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
            {suggestions.map((sug) => (
              <button
                key={sug.label}
                onClick={() => handleSend(sug.query)}
                className="text-[11px] font-bold text-gray-650 bg-gray-50 hover:bg-blue-50 hover:text-blue-650 px-3 py-1.5 rounded-full border border-gray-200 transition duration-150"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about eligibility, interest, NBFC..."
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            />
            <button
              onClick={() => handleSend(input)}
              className="p-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
