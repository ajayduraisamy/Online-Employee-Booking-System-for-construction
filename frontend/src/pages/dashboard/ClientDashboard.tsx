
import { Link } from "react-router-dom";
import {
    PlusCircle,
    List,

    ArrowRight,
    Sparkles
} from "lucide-react";

export default function ClientDashboard() {



    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- 1. Welcome Header --- */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">
                    Client Dashboard
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Welcome back! Manage your projects and track your progress here.
                </p>
            </div>

            

            {/* --- 3. Main Action Cards --- */}
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-500" /> Quick Actions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">

                {/* Create Booking Card - Highlighted */}
                <Link
                    to="/dashboard/client/book"
                    className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                    {/* Decorative background circle */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                    <div className="relative z-10 text-white">
                        <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <PlusCircle size={32} className="text-white" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Create New Booking</h2>
                        <p className="text-indigo-100 mb-6 max-w-sm">
                            Start a new project request. Define your requirements, budget, and timeline to get matched with experts.
                        </p>

                        <div className="flex items-center font-semibold bg-white/10 w-fit px-4 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-indigo-700 transition-all">
                            Start Booking <ArrowRight size={18} className="ml-2" />
                        </div>
                    </div>
                </Link>

                {/* View Bookings Card */}
                <Link
                    to="/dashboard/client/bookings"
                    className="group bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                        <List size={32} className="text-indigo-600 group-hover:text-white transition-colors" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        My Bookings
                    </h2>
                    <p className="text-slate-500 mb-6 max-w-sm leading-relaxed">
                        View the status of your current requests, manage active projects, and review past history.
                    </p>

                    <div className="flex items-center font-semibold text-slate-600 group-hover:text-indigo-600 group-hover:gap-2 transition-all">
                        View All <ArrowRight size={18} className="ml-2" />
                    </div>
                </Link>

            </div>

            

        </div>
    );
}