import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import Sidebar from "../../components/Sidebar";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        api.get("/admin/dashboard").then((res) => setStats(res.data));
    }, []);

    return (
        <div className="flex">

            {/* SIDEBAR WITH CONTROL */}
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            {/* MAIN CONTENT */}
            <div
                className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"
                    }`}
            >
                <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                    <Card title="Employees" value={stats.employees} />
                    <Card title="Managers" value={stats.managers} />
                    <Card title="Active Bookings Today" value={stats.active_bookings_today} />
                    <Card title="Open Sites" value={stats.open_sites} />
                    <Card title="Pending Approvals" value={stats.pending_approvals} />
                    <Card title="Overtime Hours" value={stats.overtime_hours} />
                    <Card title="Payroll Estimate" value={stats.payroll_estimate} />
                </div>
            </div>

        </div>
    );
}

function Card({ title, value }: any) {
    return (
        <div className="bg-white p-5 shadow rounded border border-gray-200">
            <p className="text-gray-600">{title}</p>
            <h2 className="text-xl font-bold">{value ?? 0}</h2>
        </div>
    );
}
