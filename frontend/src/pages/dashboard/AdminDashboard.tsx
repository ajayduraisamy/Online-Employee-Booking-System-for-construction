import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Briefcase,
    Calendar,
    ArrowRight,
    Activity,
    ClipboardCheck,
    UserCog,
    UserPlus,
    RefreshCw,
    TrendingUp,
    ShieldCheck,
    LayoutDashboard
} from "lucide-react";
import { api } from "../../api/axios";

// --- Types ---
interface DashboardStats {
    users: number;
    employees: number;
    managers: number;
    clients: number;
    bookings: number;
    projects: number;
    assignments: number;
    assignments_working: number;
}

export default function AdminDashboard() {

    const [stats, setStats] = useState<DashboardStats>({
        users: 0,
        employees: 0,
        managers: 0,
        clients: 0,
        bookings: 0,
        projects: 0,
        assignments: 0,
        assignments_working: 0
    });
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const res = await api.get("/dashboard");
            setStats(res.data);
        } catch (err) {
            console.error("Failed to load dashboard stats");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                        <LayoutDashboard size={20} />
                        <span className="uppercase tracking-wider text-xs">System Administration</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Admin Overview
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg max-w-2xl">
                        Monitor system performance, user growth, and project lifecycles from a centralized command center.
                    </p>
                </div>

                <button
                    onClick={loadStats}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95 disabled:opacity-70"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    <span className="font-medium">Refresh Data</span>
                </button>
            </div>

            {/* --- Stats Overview (Bento Grid Style) --- */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-indigo-500" />
                    Key Metrics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Primary Stats */}
                    <StatCard
                        title="Total Users"
                        count={stats.users}
                        icon={<Users size={24} />}
                        trend="+12% vs last month"
                        color="indigo"
                    />
                    <StatCard
                        title="Total Projects"
                        count={stats.projects}
                        icon={<Briefcase size={24} />}
                        trend="8 Active now"
                        color="violet"
                    />
                    <StatCard
                        title="Client Bookings"
                        count={stats.bookings}
                        icon={<Calendar size={24} />}
                        trend="5 Pending approval"
                        color="orange"
                    />
                    <StatCard
                        title="Active Tasks"
                        count={stats.assignments_working}
                        icon={<Activity size={24} />}
                        trend="High engagement"
                        color="emerald"
                    />

                    {/* Secondary Stats Row */}
                    <SmallStatCard
                        label="Clients"
                        value={stats.clients}
                        icon={<UserPlus size={18} />}
                        color="blue"
                    />
                    <SmallStatCard
                        label="Managers"
                        value={stats.managers}
                        icon={<ShieldCheck size={18} />}
                        color="rose"
                    />
                    <SmallStatCard
                        label="Employees"
                        value={stats.employees}
                        icon={<UserCog size={18} />}
                        color="cyan"
                    />
                    <SmallStatCard
                        label="Total Assignments"
                        value={stats.assignments}
                        icon={<ClipboardCheck size={18} />}
                        color="slate"
                    />
                </div>
            </div>

            {/* --- Quick Navigation Section --- */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-500" />
                    Management Console
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <DashboardLinkCard
                        link="/dashboard/admin/users"
                        title="User Management"
                        desc="Control access permissions & roles"
                        icon={<Users size={28} />}
                        color="blue"
                    />
                    <DashboardLinkCard
                        link="/dashboard/admin/projects"
                        title="Project Board"
                        desc="Oversee active project timelines"
                        icon={<Briefcase size={28} />}
                        color="violet"
                    />
                    <DashboardLinkCard
                        link="/dashboard/admin/bookings"
                        title="Booking Requests"
                        desc="Process incoming client proposals"
                        icon={<Calendar size={28} />}
                        color="orange"
                    />
                    <DashboardLinkCard
                        link="/dashboard/admin/assignments"
                        title="Task Assignments"
                        desc="Monitor workforce distribution"
                        icon={<ClipboardCheck size={28} />}
                        color="emerald"
                    />
                </div>
            </div>
        </div>
    );
}

// --- Sub-components for cleaner code ---

function StatCard({ title, count, icon, trend, color }: any) {
    const colorStyles: any = {
        indigo: "bg-indigo-50 text-indigo-600",
        violet: "bg-violet-50 text-violet-600",
        orange: "bg-orange-50 text-orange-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-semibold bg-slate-50 text-slate-500 px-2 py-1 rounded-full border border-slate-100">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">{count ?? "—"}</h3>
                <p className="text-slate-500 font-medium text-sm">{title}</p>
            </div>
        </div>
    );
}

function SmallStatCard({ label, value, icon, color }: any) {
    const bgColors: any = {
        blue: "bg-blue-100 text-blue-700",
        rose: "bg-rose-100 text-rose-700",
        cyan: "bg-cyan-100 text-cyan-700",
        slate: "bg-slate-100 text-slate-700",
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bgColors[color]}`}>
                    {icon}
                </div>
                <span className="text-slate-500 font-medium text-sm">{label}</span>
            </div>
            <span className="text-xl font-bold text-slate-800">{value ?? "—"}</span>
        </div>
    );
}

function DashboardLinkCard({ link, title, desc, icon, color }: any) {
    const gradients: any = {
        blue: "from-blue-500 to-indigo-600",
        violet: "from-violet-500 to-purple-600",
        orange: "from-orange-500 to-amber-600",
        emerald: "from-emerald-500 to-teal-600",
    };

    const shadows: any = {
        blue: "shadow-blue-500/20",
        violet: "shadow-violet-500/20",
        orange: "shadow-orange-500/20",
        emerald: "shadow-emerald-500/20",
    };

    return (
        <Link
            to={link}
            className={`group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl ${shadows[color]} hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradients[color]} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

            <div className={`w-14 h-14 bg-gradient-to-br ${gradients[color]} text-white rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {icon}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                {title}
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {desc}
            </p>

            <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                Access Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
}