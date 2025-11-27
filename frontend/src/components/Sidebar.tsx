import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../api/axios";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    CheckSquare,
    LogOut,
    ChevronLeft,
    PlusCircle,
    Layers,
    
} from "lucide-react";

// --- Types ---
// type UserRole = "admin" | "manager" | "employee" | "client";

interface SidebarProps {
    role: string; 
}

interface MenuItem {
    name: string;
    link: string;
    icon: React.ElementType;
}

export default function Sidebar({ role }: SidebarProps) {
    const [open, setOpen] = useState(true);

    // --- THE FIX: Force role to lowercase to match menu keys ---
    const safeRole = role.toLowerCase();

    const logout = async () => {
        try {
            await api.post("/logout");
            localStorage.clear();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const getIcon = (name: string) => {
        switch (name) {
            case "Dashboard": return LayoutDashboard;
            case "Users": return Users;
            case "Employees": return Users;
            case "Projects": return Layers;
            case "My Projects": return Layers;
            case "Bookings": return Calendar;
            case "My Bookings": return Calendar;
            case "My Tasks": return CheckSquare;
            case "Create Booking": return PlusCircle;
            default: return Briefcase;
        }
    };

    const rawMenus: Record<string, { name: string; link: string }[]> = {
        admin: [
            { name: "Dashboard", link: "/dashboard/admin" },
            { name: "Users", link: "/dashboard/admin/users" },
            { name: "Projects", link: "/dashboard/admin/projects" },
            { name: "Bookings", link: "/dashboard/admin/bookings" },
            { name: "Assignments", link: "/dashboard/admin/assignments" }
        ],
        manager: [
            { name: "Dashboard", link: "/dashboard/manager" },
            { name: "Projects", link: "/dashboard/manager/projects" },
            { name: "Employees", link: "/dashboard/manager/employees" },
            { name: "Bookings", link: "/dashboard/manager/bookings" },
            { name: "Assignments", link: "/dashboard/manager/assignments" } 
        ],
        employee: [
            { name: "Dashboard", link: "/dashboard/employee" },
            { name: "My Tasks", link: "/dashboard/employee/tasks" },
            
        ],
        client: [
            { name: "Dashboard", link: "/dashboard/client" },
            { name: "My Bookings", link: "/dashboard/client/bookings" },
            { name: "Create Booking", link: "/dashboard/client/book" }
        ]
    };

    // Get menus safely
    const links: MenuItem[] = (rawMenus[safeRole] || []).map(item => ({
        ...item,
        icon: getIcon(item.name)
    }));

    return (
        <div
            className={`relative h-screen bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out flex flex-col shadow-2xl ${open ? "w-72" : "w-20"}`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-9 bg-indigo-600 border-2 border-slate-900 text-white rounded-full p-1 hover:bg-indigo-500 transition-colors z-50 shadow-lg"
            >
                <ChevronLeft size={16} className={`transition-transform duration-300 ${!open ? "rotate-180" : ""}`} />
            </button>

            {/* Logo Area */}
            <div className="flex items-center gap-x-4 p-6 mb-4">
                <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                    <Layers size={24} className="text-white" />
                </div>
                <h1 className={`text-xl font-bold origin-left duration-200 ${!open && "scale-0 hidden"}`}>
                    <span className="text-indigo-400">Booking System</span>
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {links.map((item) => (
                    <NavLink
                        key={item.link}
                        to={item.link}
                        className={({ isActive }) =>
                            `flex items-center gap-x-4 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden
              ${isActive
                                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <item.icon size={22} className="shrink-0" />
                        <span className={`${!open && "hidden"} origin-left duration-200 font-medium whitespace-nowrap`}>
                            {item.name}
                        </span>

                        {/* Tooltip for collapsed state */}
                        {!open && (
                            <div className="absolute left-14 bg-indigo-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-md whitespace-nowrap">
                                {item.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className={`flex items-center gap-x-3 mb-4 ${!open ? "justify-center" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold shrink-0">
                        {safeRole.charAt(0).toUpperCase()}
                    </div>
                    {open && (
                        <div className="overflow-hidden">
                            <h4 className="font-semibold text-sm capitalize">{safeRole} </h4>
                            
                        </div>
                    )}
                </div>

                <button
                    onClick={logout}
                    className={`flex items-center justify-center w-full gap-x-2 p-2 rounded-lg bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors group ${!open ? "aspect-square p-0" : ""}`}
                >
                    <LogOut size={20} />
                    {open && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
}