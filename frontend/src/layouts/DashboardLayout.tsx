import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.role) return window.location.href = "/login";

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar role={user.role} />

            <main className="flex-1 h-screen overflow-y-auto p-6 bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
}
