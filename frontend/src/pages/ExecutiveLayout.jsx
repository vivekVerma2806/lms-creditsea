import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  Send, 
  CreditCard, 
  LogOut, 
  ShieldAlert,
  Target,
  BarChart3,
  Building,
  ChevronRight,
  ShieldCheck,
  Clock
} from "lucide-react";

export default function ExecutiveLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("name");
    
    if (!token) {
      navigate("/auth/login");
      return;
    }
    if (userRole === "Borrower") {
      navigate("/borrower/dashboard");
      return;
    }
    setRole(userRole);
    setName(userName || "");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  if (!role) return null;

  const navItems = [
    { label: "Executive Command", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Sales", "Sanction", "Disbursement", "Collection"] },
    { label: "Sales & Leads", href: "/dashboard/sales", icon: Users, roles: ["Admin", "Sales"] },
    { label: "Credit Sanction", href: "/dashboard/sanction", icon: CheckCircle, roles: ["Admin", "Sanction"] },
    { label: "Capital Disbursement", href: "/dashboard/disbursement", icon: Send, roles: ["Admin", "Disbursement"] },
    { label: "Collection & Recovery", href: "/dashboard/collection", icon: CreditCard, roles: ["Admin", "Collection"] },
    { label: "Capital Targets", href: "/dashboard/target", icon: Target, roles: ["Admin", "Sales", "Sanction", "Disbursement", "Collection"] },
    { label: "Source Telemetry", href: "/dashboard/source", icon: BarChart3, roles: ["Admin", "Sales"] },
  ];

  // Helper for breadcrumbs
  const getDeskTitle = () => {
    const p = location.pathname;
    if (p === "/dashboard") return "Operations Control Center";
    if (p.includes("/sales")) return "Sales Lead Pipeline";
    if (p.includes("/sanction")) return "Underwriting & Sanction Audit";
    if (p.includes("/disbursement")) return "Capital Disbursement Escrow";
    if (p.includes("/collection")) return "Collection & Amortization Recovery";
    if (p.includes("/target")) return "Capital Targets & Quota Desk";
    if (p.includes("/source")) return "Origination Channels & Telemetry";
    return "Institutional Desk";
  };

  return (
    <div className="min-h-screen bg-[#F6F4EF] flex text-[#171717]">
      {/* Obsidian Structural Sidebar (20% visual weight) */}
      <aside className="w-64 bg-[#111111] border-r border-[#222222] flex flex-col fixed inset-y-0 left-0 text-[#969188] z-20">
        
        {/* Monogram Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#222222]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-md bg-white p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <img src="/creditsea_logo_mark.png" alt="CreditSea" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-semibold text-white tracking-wider">
                Credit<span className="text-[#B49A68]">Sea</span>
              </span>
              <span className="text-[8.5px] font-mono tracking-widest text-[#B49A68] uppercase">
                Institutional Desk
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <div className="px-3 mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#6F6B63]">
            <span>Operational Desks</span>
            <span className="text-[#B49A68]">{role}</span>
          </div>
          
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-mono tracking-wider transition ${
                    isActive
                      ? "bg-[#1A1A1A] text-white border-l-2 border-[#B49A68] pl-3"
                      : "text-[#969188] hover:bg-[#1A1A1A] hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#B49A68]" : "text-[#6F6B63]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
        </div>

        {/* Regulatory Underwriting Badge */}
        <div className="px-4 py-3 bg-[#161616] border-t border-[#222222] text-[10px] font-mono text-[#6F6B63] space-y-1">
          <div className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-3 h-3 text-[#B49A68]" />
            <span>Meghdoot NBFC Core</span>
          </div>
          <p className="font-light text-[#969188]">Authorized RBI Banking Rail</p>
        </div>

        {/* User profile & Log Out */}
        <div className="p-4 border-t border-[#222222] space-y-2">
          <div className="px-2 py-1">
            <p className="text-[10px] font-mono text-[#6F6B63] uppercase">Logged In Staff</p>
            <p className="text-xs font-medium text-white truncate mt-0.5">{name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-2 text-[#874F4F] hover:text-[#B47070] font-mono text-xs rounded transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace (Warm Ivory) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Operational Status Bar */}
        <header className="h-16 bg-[#F6F4EF] border-b border-[#DDD9D0] px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6F6B63]">
            <Link to="/dashboard" className="hover:text-[#171717]">LMS Operations</Link>
            <ChevronRight className="w-3 h-3 text-[#969188]" />
            <span className="text-[#171717] font-medium">{getDeskTitle()}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2 text-[#476353] bg-[#EFEFE9] px-2.5 py-1 rounded border border-[#CCD8D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#476353] animate-pulse"></span>
              <span>BRE Engine 2.4 Active</span>
            </div>
            <span className="text-[#6F6B63]">Escrow IFSC: HDFC0000060</span>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
