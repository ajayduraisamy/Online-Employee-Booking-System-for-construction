import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DashboardLayout from "./layouts/DashboardLayout";

// Dashboards
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";

// Admin Pages
import Users from "./pages/admin/Users";
import Projects from "./pages/admin/Projects";
import Bookings from "./pages/admin/Bookings";
import AdminAssignments from "./pages/admin/AdminAssignments";

// Manager Pages
import ManagerProjects from "./pages/manager/Projects";
import ManagerEmployees from "./pages/manager/Employees";
import ManagerBookings from "./pages/manager/Bookings";
import ManagerAssignments from "./pages/manager/Assignments";

// Client Pages
import ClientBookings from "./pages/client/MyBookings";

import ClientCreateBooking from "./pages/client/CreateBooking";

// Employee Pages
import MyTasks from "./pages/employee/MyTasks";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD LAYOUT */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* DASHBOARDS */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="manager" element={<ManagerDashboard />} />
          <Route path="employee" element={<EmployeeDashboard />} />
          <Route path="client" element={<ClientDashboard />} />

          {/* ADMIN SUB-PAGES */}
          
          <Route path="admin/users" element={<Users />} />

          <Route path="admin/projects" element={<Projects />} />
          <Route path="admin/bookings" element={<Bookings />} />
          <Route path="admin/assignments" element={<AdminAssignments />} />

          {/* MANAGER SUB-PAGES */}
          <Route path="manager/projects" element={<ManagerProjects />} />
          <Route path="manager/employees" element={<ManagerEmployees />} />
          <Route path="manager/bookings" element={<ManagerBookings />} />
          <Route path="manager/assignments" element={<ManagerAssignments />} />


          {/* CLIENT SUB-PAGES */}
          <Route path="client/bookings" element={<ClientBookings />} />

          <Route path="client/book" element={<ClientCreateBooking />} />


          {/* EMPLOYEE SUB-PAGES */}

          
          <Route path="employee/tasks" element={<MyTasks />} />

        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
