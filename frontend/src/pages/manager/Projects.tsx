import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../api/axios";
import {
    
    Edit3,
    Trash2,
    Search,
    Briefcase,
    Calendar,
    FileText,
    CheckCircle2,
    Clock,
    PlayCircle,

    Hash,
    X
} from "lucide-react";


// --- Types ---
type Project = {
    id: number;
    booking_id: number;
    manager_id: number;
    project_name: string;
    start_date?: string;
    end_date?: string;
    notes?: string;
    status: string;
    created_at: string;
};

export default function ManagerProjects() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookingFromQuery = queryParams.get("booking");

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 9;

    // Modals
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [deleting, setDeleting] = useState<Project | null>(null);
    const [editing, setEditing] = useState<Project | null>(null);
    const [processing, setProcessing] = useState(false);

    const emptyForm = {
        booking_id: "",
        project_name: "",
        start_date: "",
        end_date: "",
        notes: "",
        status: "active",
    };

    const [form, setForm] = useState<any>(emptyForm);

    // Auto-open create modal for ?booking=ID
    useEffect(() => {
        if (bookingFromQuery) {
            setForm({
                ...emptyForm,
                booking_id: bookingFromQuery
            });
            setShowCreate(true);
        }
    }, [bookingFromQuery]);

    const load = async () => {
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
        load();
    }, []);

    const filtered = useMemo(() => {
        let arr = projects;
        if (statusFilter) arr = arr.filter((p) => p.status === statusFilter);
        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((p) =>
                `${p.project_name} ${p.notes}`.toLowerCase().includes(q)
            );
        }
        return arr;
    }, [projects, query, statusFilter]);

    const pages = Math.ceil(filtered.length / perPage) || 1;
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    // --- Actions ---

    // const openCreate = () => {
    //     setForm(emptyForm);
    //     setShowCreate(true);
    // };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await api.post("/projects", form);
            setShowCreate(false);
            load();
        } catch (error) {
            alert("Create failed");
        }
        setProcessing(false);
    };

    const openEdit = (p: Project) => {
        setEditing(p);
        setForm({
            booking_id: p.booking_id,
            project_name: p.project_name,
            start_date: p.start_date || "",
            end_date: p.end_date || "",
            notes: p.notes || "",
            status: p.status,
        });
        setShowEdit(true);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        setProcessing(true);
        try {
            await api.put(`/projects/${editing.id}`, form);
            setShowEdit(false);
            setEditing(null);
            load();
        } catch (error) {
            alert("Edit failed");
        }
        setProcessing(false);
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setProcessing(true);
        try {
            await api.delete(`/projects/${deleting.id}`);
            setDeleting(null);
            load();
        } catch (error) {
            alert("Delete failed");
        }
        setProcessing(false);
    };

    // --- UI Helpers ---
    const getStatusTheme = (status: string) => {
        switch (status.toLowerCase()) {
            case "active": return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: PlayCircle };
            case "completed": return { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle2 };
            case "planned": return { color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", icon: Clock };
            default: return { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", icon: Briefcase };
        }
    };

    const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Not set";

    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Management</h1>
                    <p className="text-slate-500 mt-1"> oversee timeline, status, and details for all active jobs.</p>
                </div>

                
            </div>

            {/* --- Filters & Search --- */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8 justify-between items-start xl:items-center">

                <div className="flex flex-wrap gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                    {["", "active", "planned", "completed"].map((st) => (
                        <button
                            key={st}
                            onClick={() => { setStatusFilter(st); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                                ${statusFilter === st
                                    ? "bg-slate-900 text-white shadow"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            {st === "" ? "All Projects" : st}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full xl:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Search projects..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            {/* --- Project Grid --- */}
            {loading ? (
                <div className="py-20 text-center text-slate-400">Loading projects...</div>
            ) : current.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <Briefcase size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">No projects found</h3>
                    <p className="text-slate-500 text-sm">Create a new project to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {current.map((p) => {
                        const Theme = getStatusTheme(p.status);
                        const StatusIcon = Theme.icon;

                        return (
                            <div key={p.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

                                {/* Status Strip */}
                                <div className={`h-1.5 w-full ${Theme.bg.replace("50", "500")}`}></div>

                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${Theme.bg} ${Theme.color} ${Theme.border}`}>
                                            <StatusIcon size={12} />
                                            {p.status}
                                        </div>
                                        <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                            #{p.id}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1" title={p.project_name}>
                                        {p.project_name}
                                    </h3>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Hash size={16} className="text-slate-400" />
                                            <span className="font-medium bg-slate-50 px-1.5 rounded">Booking ID: {p.booking_id}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Calendar size={16} className="text-slate-400" />
                                            <span>{fmtDate(p.start_date)} — {fmtDate(p.end_date)}</span>
                                        </div>

                                        {p.notes && (
                                            <div className="flex gap-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg mt-2">
                                                <FileText size={16} className="shrink-0 mt-0.5 text-slate-400" />
                                                <p className="line-clamp-2 text-xs italic">"{p.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Edit3 size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleting(p)}
                                        className="px-3 py-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
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
                    className="px-5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all font-medium text-slate-600"
                >
                    Previous
                </button>
                <div className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold">
                    {page} / {pages}
                </div>
                <button
                    disabled={page >= pages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-5 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all font-medium text-slate-600"
                >
                    Next
                </button>
            </div>

            {/* --------------------- CREATE / EDIT MODAL --------------------- */}
            {(showCreate || showEdit) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">

                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">
                                {showCreate ? "Launch New Project" : "Edit Project Details"}
                            </h2>
                            <button
                                onClick={() => { setShowCreate(false); setShowEdit(false); }}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={showCreate ? handleCreate : handleEdit} className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Project Name</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        placeholder="e.g. Website Redesign Q4"
                                        value={form.project_name}
                                        onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Booking Reference ID</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                            placeholder="Booking ID"
                                            value={form.booking_id}
                                            onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Current Status</label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none"
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="planned">Planned</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <div className="absolute right-4 top-3 pointer-events-none text-slate-400">▼</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        value={form.start_date}
                                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        value={form.end_date}
                                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Project Notes</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                                        placeholder="Add any internal notes here..."
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowCreate(false); setShowEdit(false); }}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
                                >
                                    {processing ? "Saving..." : (showCreate ? "Create Project" : "Save Changes")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --------------------- DELETE MODAL --------------------- */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl border border-slate-100">
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Delete Project?</h3>
                        <p className="text-slate-500 mt-2 mb-6 text-sm">
                            Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleting.project_name}"</span>? This cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleting(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
                            >
                                {processing ? "Deleting..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}