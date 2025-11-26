import {
    Building2,
    CalendarCheck,
    FileChartColumn,
    LayoutDashboard,
    LogOut,
    MoreVertical,
    UserCog,
    Users,
    WalletCards,
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
    role: "admin" | "manager" | "employee" | "client";
    open: boolean;
    setOpen: (v: boolean) => void;
}

interface LinkItem {
    name: string;
    to: string;
    icon: React.ReactNode;
}

export default function Sidebar({ role, open, setOpen }: SidebarProps) {

    const adminLinks: LinkItem[] = [
        { name: "Dashboard", to: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Users", to: "/admin/users", icon: <Users size={18} /> },
        { name: "Employees", to: "/admin/employees", icon: <UserCog size={18} /> },
        { name: "Sites / Projects", to: "/admin/sites", icon: <Building2 size={18} /> },
        { name: "Bookings", to: "/admin/bookings", icon: <CalendarCheck size={18} /> },
        { name: "Reports", to: "/admin/reports", icon: <FileChartColumn size={18} /> },
        { name: "Payroll", to: "/admin/payroll", icon: <WalletCards size={18} /> },
    ];

    const managerLinks: LinkItem[] = [
        { name: "Dashboard", to: "/manager", icon: <LayoutDashboard size={18} /> },
        { name: "Employees", to: "/manager/employees", icon: <UserCog size={18} /> },
        { name: "Bookings", to: "/manager/bookings", icon: <CalendarCheck size={18} /> },
        { name: "Requests", to: "/manager/requests", icon: <Users size={18} /> },
        { name: "Payments", to: "/manager/payments", icon: <WalletCards size={18} /> },
        { name: "Documents", to: "/manager/documents", icon: <FileChartColumn size={18} /> },
    ];

    const employeeLinks: LinkItem[] = [
        { name: "My Dashboard", to: "/employee", icon: <LayoutDashboard size={18} /> },
        { name: "My Shifts", to: "/employee/shifts", icon: <CalendarCheck size={18} /> },
        { name: "My Documents", to: "/employee/documents", icon: <FileChartColumn size={18} /> },
        { name: "Leave Requests", to: "/employee/leave", icon: <Users size={18} /> },
        { name: "Payments", to: "/employee/payments", icon: <WalletCards size={18} /> },
    ];

    
    const clientLinks: LinkItem[] = [
        { name: "Dashboard", to: "/client", icon: <LayoutDashboard size={18} /> },
        { name: "My Requests", to: "/client/requests", icon: <CalendarCheck size={18} /> },
        { name: "Create Request", to: "/client/request/new", icon: <Users size={18} /> },
        { name: "My Documents", to: "/client/documents", icon: <FileChartColumn size={18} /> },
        { name: "Payments", to: "/client/payments", icon: <WalletCards size={18} /> },
    ];

    let links: LinkItem[] = [];
    if (role === "admin") links = adminLinks;
    if (role === "manager") links = managerLinks;
    if (role === "employee") links = employeeLinks;
    if (role === "client") links = clientLinks;

    return (
        <>
            {/* OPEN/CLOSE BUTTON */}
            <button
                className={`fixed top-4 z-50 text-white px-3 py-2 shadow-lg transition-all duration-300 rounded-none
                    ${open ? "left-52 bg-red-600" : "left-4 bg-gray-900"}
                `}
                onClick={() => setOpen(!open)}
            >
                {open ? <X size={20} /> : <MoreVertical size={22} />}
            </button>

            {/* SIDEBAR */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-xl transition-all duration-300 z-40 
                    ${open ? "w-64" : "w-0 overflow-hidden"}
                `}
            >
                {/* HEADER */}
                <div className="px-5 py-5 border-b border-gray-700">
                    <h2 className="text-xl font-bold">{role.toUpperCase()} PANEL</h2>
                </div>

                {/* MENU */}
                <nav className="mt-4 flex flex-col">
                    {links.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-5 py-3 text-sm transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* LOGOUT */}
                <div className="absolute bottom-4 w-full px-4">
                    <button
                        className="flex items-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-none"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
