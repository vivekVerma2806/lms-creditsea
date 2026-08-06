import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Borrower Routes */}
        <Route path="/borrower/dashboard" element={<BorrowerDashboard />} />
        <Route path="/apply" element={<ApplyFlow />} />

        {/* Executive Staff Routes */}
        <Route path="/dashboard" element={<ExecutiveLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="sales" element={<SalesPortal />} />
          <Route path="sanction" element={<SanctionPortal />} />
          <Route path="disbursement" element={<DisbursementPortal />} />
          <Route path="collection" element={<CollectionPortal />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
