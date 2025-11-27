
import { Link } from "react-router-dom";
import {
    ClipboardList,
    ArrowRight,
    CheckCircle2,
    Clock
} from "lucide-react";

export default function EmployeeDashboard() {
    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- 1. Welcome Header --- */}
            <div className="max-w-4xl mx-auto mb-12 text-center md:text-left">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                    Employee Workspace
                </h1>
                <p className="text-slate-500 text-lg">
                    Welcome back. Ready to tackle your day?
                </p>
            </div>

            {/* --- 2. Main Content Area --- */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* --- The "My Tasks" Hero Card (Takes up 2 columns) --- */}
                <Link
                    to="/dashboard/employee/tasks"
                    className="md:col-span-2 group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
                >
                    {/* Decorative background blobs */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                            <ClipboardList size={32} className="text-white" />
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">My Tasks</h2>
                        <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                            Access your assigned work, update project statuses, and log your progress for the team.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="inline-flex items-center gap-3 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm shadow-lg group-hover:bg-indigo-50 transition-colors">
                            View Assignments <ArrowRight size={18} />
                        </div>
                    </div>
                </Link>

                {/* --- Side Status Card (Visual filler only, keeps it premium) --- */}
                <div className="md:col-span-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center">
                    <h3 className="text-slate-400 font-semibold uppercase tracking-wider text-xs mb-6">Quick Status</h3>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">Active</p>
                                <p className="text-xs text-slate-400">Current Status</p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 w-full"></div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">On Time</p>
                                <p className="text-xs text-slate-400">Performance</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}