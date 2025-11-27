import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import {
    Search,
    Mail,
    Phone,
    User,

    Filter,
    MoreHorizontal,
    Copy,
    ChevronLeft,
    ChevronRight
} from "lucide-react";


// --- Types ---
type Employee = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    skills?: string;
};

export default function ManagerEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [query, setQuery] = useState("");
    const [skillFilter, setSkillFilter] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 10;

    // Load Data
    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/employees");
            setEmployees(res.data);
        } catch (err) {
            console.error("Failed to load employees", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    // Filter Logic
    const filtered = useMemo(() => {
        let arr = employees;

        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((e) =>
                `${e.name} ${e.email}`.toLowerCase().includes(q)
            );
        }

        if (skillFilter.trim()) {
            arr = arr.filter((e) =>
                (e.skills || "").toLowerCase().includes(skillFilter.toLowerCase())
            );
        }

        return arr;
    }, [employees, query, skillFilter]);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    // Helper: Get Initials for Avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    // Helper: Get Color based on ID
    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-blue-100 text-blue-700",
            "bg-emerald-100 text-emerald-700",
            "bg-orange-100 text-orange-700",
            "bg-purple-100 text-purple-700",
            "bg-pink-100 text-pink-700",
            "bg-cyan-100 text-cyan-700"
        ];
        return colors[id % colors.length];
    };

    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header Section --- */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Workforce Directory</h1>
                <p className="text-slate-500 mt-1">Manage employee profiles and view skillsets.</p>
            </div>

            {/* --- Controls Bar --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">

                {/* Main Search */}
                <div className="relative group flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Skill Filter */}
                <div className="relative group w-full md:w-80">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Filter by skill (e.g. React)..."
                        value={skillFilter}
                        onChange={(e) => {
                            setSkillFilter(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* --- Employee Table Card --- */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 font-medium">Loading directory...</p>
                    </div>
                ) : current.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <User size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No employees found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Skills</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {current.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        className="group hover:bg-indigo-50/30 transition-colors duration-200"
                                    >
                                        {/* Employee Profile */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${getAvatarColor(emp.id)}`}>
                                                    {getInitials(emp.name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{emp.name}</div>
                                                    <div className="text-xs text-slate-400 font-mono">ID: {emp.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {emp.email}
                                                </div>
                                                {emp.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone size={14} className="text-slate-400" />
                                                        {emp.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Skills */}
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex flex-wrap gap-1.5">
                                                {emp.skills ? (
                                                    emp.skills.split(",").slice(0, 3).map((skill, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded border border-slate-200">
                                                            {skill.trim()}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic">No skills listed</span>
                                                )}
                                                {emp.skills && emp.skills.split(",").length > 3 && (
                                                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded border border-slate-200">
                                                        +{emp.skills.split(",").length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a
                                                    href={`mailto:${emp.email}`}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Send Email"
                                                >
                                                    <Mail size={18} />
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(emp.email);
                                                        // Ideally show a toast here
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Copy Email"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Pagination Footer --- */}
                {!loading && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-900">{(page - 1) * perPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * perPage, filtered.length)}</span> of {filtered.length} employees
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-medium text-slate-700 px-2">Page {page}</span>
                            <button
                                disabled={page >= pages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}