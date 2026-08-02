import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
                <span className="text-white font-bold text-sm -rotate-45">CS</span>
              </div>
              <span className="font-extrabold text-xl text-white">CreditSea</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Making credit accessible, quick, and transparent for salaried individuals across India.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/calculators" className="hover:text-white transition">EMI Calculator</Link></li>
              <li><Link to="/apply" className="hover:text-white transition">Apply for Loan</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Our Process</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact & Support</Link></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Partner Column */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Lending Partner</h4>
            <div className="bg-gray-800/50 border border-gray-800 rounded-2xl p-4 flex gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs text-white font-bold leading-tight">Meghdoot Mercantile Private Limited</p>
                <p className="text-[10px] text-gray-500 mt-1">RBI Registered NBFC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-850 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Innotech CreditSea. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">RBI Fair Practices Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
