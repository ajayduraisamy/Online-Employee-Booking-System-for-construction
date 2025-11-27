
import { Link } from "react-router-dom";
import {
    Users,
    Briefcase,
    CalendarClock,
    
    ArrowRight,
    Activity,
    
} from "lucide-react";

export default function ManagerDashboard() {

    
    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- 1. Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manager Overview</h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Good morning. Here is the status of your workforce and projects.
                    </p>
                </div>
                
            </div>

        
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Management Console
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Card 1: Bookings */}
                <Link
                    to="/dashboard/manager/bookings"
                    className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-100 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <CalendarClock size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">Incoming Bookings</h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Review new requests from clients, approve timelines, and assign initial budgets.
                        </p>

                        <div className="flex items-center text-orange-600 font-bold text-sm group-hover:gap-2 transition-all">
                            Manage Bookings <ArrowRight size={16} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* Card 2: Employees */}
                <Link
                    to="/dashboard/manager/employees"
                    className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">Workforce</h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            View employee availability, assign tasks to squads, and track performance metrics.
                        </p>

                        <div className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
                            View Employees <ArrowRight size={16} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* Card 3: Projects */}
                <Link
                    to="/dashboard/manager/projects"
                    className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-violet-100 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Briefcase size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">Active Projects</h3>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Monitor on-site progress, update status reports, and manage resource allocation.
                        </p>

                        <div className="flex items-center text-violet-600 font-bold text-sm group-hover:gap-2 transition-all">
                            Track Projects <ArrowRight size={16} className="ml-2" />
                        </div>
                    </div>
                </Link>

            </div>

        
        </div>
    );
}