import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";

import {
    Edit2,
    Trash2,
    Search,
    MapPin,
    Calendar,
    DollarSign,
    Filter,
    X,
    Save,
    AlertTriangle,
    FileText,
    Briefcase
} from "lucide-react";

// --- Types ---
type Booking = {
    id: number;
    title: string;
    description: string;
    location?: string;
    required_skills?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    status: string;
    created_at: string;
};

export default function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 10;

    // Modals
    const [editing, setEditing] = useState<Booking | null>(null);
    const [form, setForm] = useState<any>({});
    const [processing, setProcessing] = useState(false);
    const [deleting, setDeleting] = useState<Booking | null>(null);

    // Load Data
    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/bookings/mine");
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to load bookings");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    // Filter Logic
    const filtered = useMemo(() => {
        let arr = bookings;
        if (statusFilter) {
            arr = arr.filter((b) => b.status.toLowerCase() === statusFilter);
        }
        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((b) =>
                `${b.title} ${b.description} ${b.location}`.toLowerCase().includes(q)
            );
        }
        return arr;
    }, [bookings, query, statusFilter]);

    const pages = Math.ceil(filtered.length / perPage) || 1;
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    // Handlers
    const openEdit = (b: Booking) => {
        setEditing(b);
        setForm({
            title: b.title,
            description: b.description,
            location: b.location || "",
            required_skills: b.required_skills || "",
            start_date: b.start_date || "",
            end_date: b.end_date || "",
            budget: b.budget || "",
            status: b.status,
        });
    };

    const save = async () => {
        if (!editing) return;
        setProcessing(true);
        try {
            await api.put(`/bookings/${editing.id}`, form);
            // Optional: Add Toast notification here
            setEditing(null);
            load();
        } catch (error) {
            alert("Update failed");
        }
        setProcessing(false);
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setProcessing(true);
        try {
            await api.delete(`/bookings/${deleting.id}`);
            setDeleting(null);
            load();
        } catch (error) {
            alert("Delete failed");
        }
        setProcessing(false);
    };

    // UI Helpers
    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
            case "rejected": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200"; // pending
        }
    };

    const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString() : "—";

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Projects</h1>
                    <p className="text-slate-500 mt-1">Track and manage your booking requests.</p>
                </div>
            </div>

            {/* --- Controls Bar --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                    {["", "pending", "approved", "completed", "rejected"].map((st) => (
                        <button
                            key={st}
                            onClick={() => { setStatusFilter(st); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                                ${statusFilter === st
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            {st === "" ? "All Requests" : st}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative group w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        placeholder="Search project, location..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* --- Data Table Card --- */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading your bookings...</div>
                ) : current.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Filter className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">No bookings found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Project Details</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Timeline</th>
                                    <th className="px-6 py-4">Budget</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {current.map((b) => (
                                    <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="font-semibold text-slate-800">{b.title}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                                                <Briefcase size={12} />
                                                {b.required_skills || "General"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <MapPin size={16} className="text-slate-400" />
                                                {b.location || "Remote"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
                                                <Calendar size={16} className="text-slate-400" />
                                                <span className="text-xs">
                                                    {fmtDate(b.start_date)} - {fmtDate(b.end_date)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 font-medium text-slate-700">
                                                <DollarSign size={14} className="text-slate-400" />
                                                {b.budget ? b.budget.toLocaleString() : "—"}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getStatusStyle(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(b)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleting(b)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                        Page <span className="font-medium text-slate-900">{page}</span> of {pages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= pages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------------- EDIT MODAL ---------------------- */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Edit Project Details</h2>
                            <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Project Title</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Project Title"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe the project..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                            value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Budget (₹)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                            value={form.budget}
                                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Required Skills</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        value={form.required_skills}
                                        onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
                                        placeholder="e.g. React, Node.js"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
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
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                            <button
                                onClick={() => setEditing(null)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-white hover:border-slate-300 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={save}
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
                            >
                                {processing ? "Saving..." : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --------------------- DELETE CONFIRMATION --------------------- */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Delete Project?</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleting.title}"</span>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                onClick={() => setDeleting(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all"
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