import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Users, CheckCircle, Send, CreditCard, LogOut, ShieldAlert } from "lucide-react";

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
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Sales", "Sanction", "Disbursement", "Collection"] },
    { label: "Sales (Leads)", href: "/dashboard/sales", icon: Users, roles: ["Admin", "Sales"] },
    { label: "Sanction", href: "/dashboard/sanction", icon: CheckCircle, roles: ["Admin", "Sanction"] },
    { label: "Disbursement", href: "/dashboard/disbursement", icon: Send, roles: ["Admin", "Disbursement"] },
    { label: "Collection", href: "/dashboard/collection", icon: CreditCard, roles: ["Admin", "Collection"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed inset-y-0 left-0 text-gray-400 z-10">
        
        {/* Header Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-850">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
              <span className="text-white font-bold text-sm -rotate-45">CS</span>
            </div>
            <span className="font-extrabold text-lg text-white">CreditSea Staff</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="px-4 mb-4 flex items-center gap-1.5 text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">
            <ShieldAlert className="w-3.5 h-3.5" /> {role} Desk
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition font-semibold text-sm ${
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              );
            })}
        </div>

        {/* User profile & Log Out */}
        <div className="p-4 border-t border-gray-850 space-y-2">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 font-bold uppercase">Log-in as:</p>
            <p className="text-sm font-bold text-gray-200 leading-normal truncate">{name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 font-bold text-sm rounded-2xl hover:bg-red-950/20 hover:text-red-300 transition duration-150"
          >
            <LogOut className="w-4.5 h-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
