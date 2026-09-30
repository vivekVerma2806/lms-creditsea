import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Menu, X, ArrowUpRight } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Institutional Principles", href: "/about" },
    { label: "Facility Calculator", href: "/calculators" },
    { label: "Contact & Desk", href: "/contact" },
  ];

  const getDashboardLink = () => {
    if (role === "Borrower") return "/borrower/dashboard";
    return "/dashboard";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F6F4EF]/90 backdrop-blur-md border-b border-[#DDD9D0] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Minimalist Institutional Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#171717] flex items-center justify-center transition-transform group-hover:scale-95 duration-200">
              <span className="text-[#F6F4EF] font-mono text-xs font-bold tracking-tight">CS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[#171717] tracking-tight leading-none">
                CreditSea
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6F6B63] mt-0.5">
                Capital Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs font-semibold tracking-wide transition-colors duration-150 py-1 border-b-2 ${
                    isActive 
                      ? "text-[#171717] border-[#B49A68]" 
                      : "text-[#6F6B63] border-transparent hover:text-[#171717] hover:border-[#DDD9D0]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 bg-white border border-[#DDD9D0] text-[#171717] font-semibold text-xs rounded-lg hover:border-[#B49A68] hover:bg-[#F6F4EF] transition flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#B49A68]" />
                  <span>{role === "Borrower" ? "Client Workspace" : `${role} Desk`}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#6F6B63] hover:text-[#874F4F] hover:bg-[#EEEBE4] rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-[#6F6B63] hover:text-[#171717] font-semibold text-xs transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4.5 py-2 bg-[#111111] hover:bg-[#222222] text-[#F6F4EF] font-semibold text-xs rounded-lg border border-[#111111] hover:border-[#B49A68] transition duration-150 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Apply for Credit</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A68]" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171717] hover:bg-[#EEEBE4] rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F4EF] border-b border-[#DDD9D0]">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-[#171717] hover:bg-[#EEEBE4] rounded-lg transition"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#DDD9D0] flex flex-col gap-2.5">
              {isLoggedIn ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-white border border-[#DDD9D0] text-[#171717] text-center font-semibold text-xs rounded-lg"
                  >
                    Open Workspace
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2.5 text-[#874F4F] text-center font-semibold text-xs hover:bg-[#EEEBE4] rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 border border-[#DDD9D0] text-[#171717] text-center font-semibold text-xs rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-[#111111] text-[#F6F4EF] text-center font-semibold text-xs rounded-lg"
                  >
                    Apply for Credit
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
