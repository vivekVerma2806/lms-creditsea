import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BorrowerDashboard from "./pages/BorrowerDashboard";
import ApplyFlow from "./pages/ApplyFlow";
import ExecutiveLayout from "./pages/ExecutiveLayout";
import DashboardHome from "./pages/DashboardHome";
import SalesPortal from "./pages/SalesPortal";
import SanctionPortal from "./pages/SanctionPortal";
import DisbursementPortal from "./pages/DisbursementPortal";
import CollectionPortal from "./pages/CollectionPortal";
import TargetAnalytics from "./pages/TargetAnalytics";
import SourceAnalytics from "./pages/SourceAnalytics";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Institutional Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Borrower Self-Service Flow */}
        <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
        <Route path="/apply" element={<ApplyFlow />} />

        {/* Executive Staff Operations Desks */}
        <Route path="/dashboard" element={<ExecutiveLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="sales" element={<SalesPortal />} />
          <Route path="sanction" element={<SanctionPortal />} />
          <Route path="disbursement" element={<DisbursementPortal />} />
          <Route path="collection" element={<CollectionPortal />} />
          <Route path="target" element={<TargetAnalytics />} />
          <Route path="source" element={<SourceAnalytics />} />
        </Route>

        {/* Institutional 404 Handlers */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
