import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import {
    Trash2,
    Search,
    
    Phone,
    Shield,
    Cpu
} from "lucide-react";

// --- Types ---
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    skills?: string;
    created_at: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Users
    const getUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // Delete User
    const deleteUser = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this user permanently?")) return;

        try {
            await api.delete(`/admin/user/${id}`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    // --- Helpers for UI ---
    const getRoleStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin": return "bg-purple-100 text-purple-700 border-purple-200";
            case "manager": return "bg-blue-100 text-blue-700 border-blue-200";
            case "employee": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage access, roles, and user details.</p>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full md:w-72 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                {loading ? (
                    // --- Premium Skeleton Loading State ---
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Skills</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="group hover:bg-indigo-50/30 transition-colors duration-200"
                                        >
                                            {/* Name & Avatar Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{user.name}</p>
                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role Badge Column */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleStyle(user.role)}`}>
                                                    <Shield size={12} />
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Contact Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm text-slate-500">
                                                    {user.phone ? (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={14} className="text-slate-400" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 italic">No phone</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Skills Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 text-sm max-w-[200px] truncate">
                                                    <Cpu size={16} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">{user.skills || "—"}</span>
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    title="Delete User"
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Pagination (Optional Placeholder) */}
                {!loading && (
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-sm text-slate-500 flex justify-between items-center">
                        <span>Showing {filteredUsers.length} users</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded hover:bg-white transition">Prev</button>
                            <button className="px-3 py-1 border rounded hover:bg-white transition">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}