import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import {
    Trash2,
    Search,
    Calendar,
    User,
    Briefcase,
    FileText,
    Layers,
    MoreHorizontal,
    AlertTriangle,
    CheckCircle2,
    Clock,
    PlayCircle
} from "lucide-react";


// --- Types ---
type Project = {
    id: number;
    project_name: string;
    manager_id: number;
    booking_id: number;
    start_date?: string;
    end_date?: string;
    notes?: string;
    status: string;
    created_at: string;
};

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 9; // Grid layout looks better with multiples of 3

    // Delete modal
    const [deleting, setDeleting] = useState<Project | null>(null);
    const [processing, setProcessing] = useState(false);

    // --- Actions ---
    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get("/projects");
            setProjects(res.data);
        } catch (error) {
            console.error("Failed to load projects");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const filtered = useMemo(() => {
        let arr = projects;
        if (statusFilter) {
            arr = arr.filter((p) => p.status.toLowerCase() === statusFilter);
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((p) =>
                `${p.project_name} ${p.notes}`.toLowerCase().includes(q)
            );
        }
        return arr;
    }, [projects, query, statusFilter]);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    const handleDelete = async () => {
        if (!deleting) return;
        setProcessing(true);
        try {
            await api.delete(`/projects/${deleting.id}`);
            setDeleting(null);
            loadProjects();
        } catch (error) {
            alert("Delete failed");
        }
        setProcessing(false);
    };

    // --- UI Helpers ---
    const getStatusTheme = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return {
                    border: "border-emerald-500",
                    bg: "bg-emerald-50",
                    text: "text-emerald-700",
                    icon: PlayCircle,
                    gradient: "from-emerald-500 to-teal-500"
                };
            case "completed":
                return {
                    border: "border-blue-500",
                    bg: "bg-blue-50",
                    text: "text-blue-700",
                    icon: CheckCircle2,
                    gradient: "from-blue-500 to-indigo-500"
                };
            case "planned":
                return {
                    border: "border-violet-500",
                    bg: "bg-violet-50",
                    text: "text-violet-700",
                    icon: Clock,
                    gradient: "from-violet-500 to-purple-500"
                };
            default:
                return {
                    border: "border-slate-400",
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    icon: Layers,
                    gradient: "from-slate-400 to-slate-500"
                };
        }
    };

    const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—";

    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">
                        Project Overview
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Manage active timelines and project deliverables.
                    </p>
                </div>
            </div>

            {/* --- Filters & Controls --- */}
            <div className="flex flex-col xl:flex-row gap-6 mb-10 justify-between">

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm w-fit">
                    {[
                        { id: "", label: "All Projects" },
                        { id: "active", label: "Active" },
                        { id: "planned", label: "Planned" },
                        { id: "completed", label: "Completed" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setStatusFilter(tab.id); setPage(1); }}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${statusFilter === tab.id
                                    ? "bg-slate-900 text-white shadow-md transform scale-105"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative group w-full xl:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        placeholder="Search project name..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                </div>
            </div>

            {/* --- Project Grid --- */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading projects...</p>
                </div>
            ) : current.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Briefcase size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">No projects found</h3>
                    <p className="text-slate-500">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {current.map((p) => {
                        const Theme = getStatusTheme(p.status);
                        const StatusIcon = Theme.icon;

                        return (
                            <div
                                key={p.id}
                                className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Color Accent Strip */}
                                <div className={`h-1.5 w-full bg-gradient-to-r ${Theme.gradient}`}></div>

                                <div className="p-6 flex-1">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${Theme.bg} ${Theme.text}`}>
                                            <StatusIcon size={20} />
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${Theme.bg} ${Theme.text} ${Theme.border} bg-opacity-50`}>
                                            {p.status}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                        {p.project_name}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-mono mb-6">ID: #{p.id}</p>

                                    {/* Info Grid */}
                                    <div className="space-y-3">

                                        <div className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                                            <User size={16} className="text-slate-400" />
                                            <span className="font-medium">Manager ID:</span> {p.manager_id}
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                                            <Briefcase size={16} className="text-slate-400" />
                                            <span className="font-medium">Booking ID:</span> {p.booking_id}
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                                            <Calendar size={16} className="text-slate-400" />
                                            <span className="font-medium">{fmtDate(p.start_date)} - {fmtDate(p.end_date)}</span>
                                        </div>

                                        {p.notes && (
                                            <div className="flex gap-3 text-sm text-slate-500 mt-2 px-2">
                                                <FileText size={16} className="shrink-0 mt-0.5 text-slate-400" />
                                                <p className="line-clamp-2 italic text-xs leading-relaxed">"{p.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-2">
                                    <button
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                        title="View Details"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDeleting(p)}
                                        className="flex items-center gap-2 px-3 py-2 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- Pagination --- */}
            <div className="flex justify-center mt-12 gap-2">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium disabled:opacity-50 transition-all shadow-sm"
                >
                    Previous
                </button>
                <div className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold shadow-md">
                    {page} / {pages}
                </div>
                <button
                    disabled={page >= pages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium disabled:opacity-50 transition-all shadow-sm"
                >
                    Next
                </button>
            </div>

            {/* --- Delete Modal --- */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-slate-100 text-center">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Project?</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Are you sure you want to remove <span className="font-semibold text-slate-800">"{deleting.project_name}"</span>?
                            This action cannot be undone and will remove all associated assignments.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                                onClick={() => setDeleting(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-all"
                                onClick={handleDelete}
                                disabled={processing}
                            >
                                {processing ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}