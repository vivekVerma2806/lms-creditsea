import { useState } from "react";
import { Info } from "lucide-react";

export default function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(180);

  const interestRate = 0.12; // 12% p.a.
  const interest = (amount * interestRate * tenure) / 365;
  const totalRepayment = amount + interest;

  // Donut chart calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const interestRatio = interest / totalRepayment;
  const interestOffset = circumference * (1 - interestRatio);
  const principalOffset = circumference;

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-lg shadow-gray-150/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        
        {/* Sliders Area (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-gray-700 font-semibold text-sm">Loan Amount</label>
              <span className="text-blue-600 font-extrabold text-xl">₹{amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="500000"
              step="10000"
              className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-gray-700 font-semibold text-sm">Tenure (Repayment Period)</label>
              <span className="text-blue-600 font-extrabold text-xl">{tenure} Days</span>
            </div>
            <input
              type="range"
              min="30"
              max="365"
              step="1"
              className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
              <span>30 Days</span>
              <span>365 Days</span>
            </div>
          </div>

          {/* Jargon Glossary */}
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-800">Principal</h5>
                <p className="text-[11px] text-gray-500 leading-normal mt-0.5">The raw amount you borrow from us before interest is added.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-800">Tenure</h5>
                <p className="text-[11px] text-gray-500 leading-normal mt-0.5">The duration in days allocated for settling your outstanding loan balance.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-800">Interest (Simple)</h5>
                <p className="text-[11px] text-gray-500 leading-normal mt-0.5">A flat 12% annual rate applied only on the principal amount, without compounding.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-gray-800">NBFC Partner</h5>
                <p className="text-[11px] text-gray-500 leading-normal mt-0.5">Meghdoot Mercantile Pvt Ltd acts as our regulatory lending partner.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Chart Area (5 cols) */}
        <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-6 flex flex-col items-center justify-center border border-gray-100">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Donut */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
              {/* Underlay Circle (Principal representation, blue-500) */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="transparent"
                stroke="#2563eb"
                strokeWidth="16"
              />
              {/* Overlay Arc (Interest representation, amber-500) */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray={circumference}
                strokeDashoffset={interestOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-gray-400 text-xs font-semibold uppercase">Total Due</p>
              <p className="text-gray-900 font-extrabold text-lg mt-0.5">₹{Math.round(totalRepayment).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 w-full space-y-3.5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-blue-600 rounded-md"></div>
                <span className="text-gray-600">Principal</span>
              </div>
              <span className="text-gray-900">₹{amount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-amber-500 rounded-md"></div>
                <span className="text-gray-600">Interest (12% p.a.)</span>
              </div>
              <span className="text-gray-950">₹{Math.round(interest).toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
