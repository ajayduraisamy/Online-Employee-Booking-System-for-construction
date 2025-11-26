import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";


// Admin Pages
import Bookings from "./pages/admin/Bookings";
import Employees from "./pages/admin/Employees";
import Managers from "./pages/admin/Managers";
import Payroll from "./pages/admin/Payroll";
import Reports from "./pages/admin/Reports";
import Sites from "./pages/admin/Sites";
import Users from "./pages/admin/User";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/managers" element={<Managers />} />
        <Route path="/admin/sites" element={<Sites />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/payroll" element={<Payroll />} />

      </Routes>
    </BrowserRouter>
  );
}
