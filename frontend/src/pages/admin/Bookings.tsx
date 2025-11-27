import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "../../api/axios";
import {
    Trash2,
    Search,
    
    MapPin,
    DollarSign,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    
} from "lucide-react";

type Booking = {
    id: number;
    client_id?: number;
    title: string;
    description?: string;
    location?: string;
    required_skills?: string;
    start_date?: string | null;
    end_date?: string | null;
    budget?: number | null;
    status?: string;
    created_at?: string;
};

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const perPage = 10;

    const [deleting, setDeleting] = useState<Booking | null>(null);
    const [processing, setProcessing] = useState(false);

    const loadBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/admin/bookings");
            setBookings(res.data || []);
        } catch (error) {
            const err = error as AxiosError;
            alert(
                (err.response?.data as any)?.msg ||
                (err.response?.data as any)?.error ||
                "Something went wrong"
            );
        }
        setLoading(false);
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return bookings;

        return bookings.filter((b) =>
            `${b.title} ${b.description || ""} ${b.client_id || ""}`
                .toLowerCase()
                .includes(q)
        );
    }, [bookings, query]);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    const handleDelete = async () => {
        if (!deleting) return;
        setProcessing(true);
        try {
            await api.delete(`/admin/bookings/${deleting.id}`);
            setDeleting(null);
            await loadBookings();
        } catch (error) {
            const err = error as AxiosError;
            alert((err.response?.data as any)?.msg || "Delete failed");
        }
        setProcessing(false);
    };

    const fmt = (d?: string | null) =>
        d ? new Date(d).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—";

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Management</h1>
                    <p className="text-slate-500 mt-1">Review client requests and manage project pipelines.</p>
                </div>

                {/* Premium Search Bar */}
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by title, client ID..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* --- Main Content Card --- */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Loading bookings...</p>
                    </div>
                ) : error ? (
                    <div className="p-10 text-center">
                        <div className="inline-flex p-3 bg-red-50 text-red-500 rounded-full mb-3">
                            <AlertCircle size={24} />
                        </div>
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                        <th className="py-4 px-6">ID</th>
                                        <th className="py-4 px-6">Project Details</th>
                                        <th className="py-4 px-6">Timeline</th>
                                        <th className="py-4 px-6">Budget</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {current.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                                                No bookings found matching your search.
                                            </td>
                                        </tr>
                                    )}

                                    {current.map((b) => (
                                        <tr key={b.id} className="group hover:bg-slate-50 transition-colors duration-200">

                                            {/* ID */}
                                            <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                                                #{b.id}
                                            </td>

                                            {/* Title & Client */}
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                    {b.title}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                                                        Client: {b.client_id ?? "—"}
                                                    </span>
                                                    {b.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={10} /> {b.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Dates */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                        {fmt(b.start_date)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                        {fmt(b.end_date)}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Budget */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 w-fit px-2 py-1 rounded-lg border border-slate-200">
                                                    <DollarSign size={14} className="text-green-600" />
                                                    {b.budget ? b.budget.toLocaleString() : "—"}
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${!b.status || b.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}
                                                    ${b.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
                                                    ${b.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : ''}
                                                    ${!['pending', 'approved', 'rejected'].includes(b.status || '') ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                                                `}>
                                                    {b.status || "Pending"}
                                                </span>
                                            </td>

                                            {/* Delete Action */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setDeleting(b)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95"
                                                    title="Delete Booking"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Footer / Pagination --- */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-sm text-slate-500 font-medium">
                                Showing <span className="text-slate-900">{filtered.length > 0 ? (page - 1) * perPage + 1 : 0}</span> to <span className="text-slate-900">{Math.min(page * perPage, filtered.length)}</span> of {filtered.length} entries
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <span className="text-sm font-semibold text-slate-700 px-2">
                                    Page {page} of {pages}
                                </span>

                                <button
                                    disabled={page >= pages}
                                    onClick={() => setPage((p) => Math.min(p + 1, pages))}
                                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* --- Premium Delete Modal --- */}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
                            <div className="bg-red-100 p-3 rounded-full mb-3 text-red-600">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Delete Booking?</h3>
                            <p className="text-sm text-slate-500 mt-1">ID: #{deleting.id}</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 text-center">
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Are you sure you want to delete <span className="font-semibold text-slate-900">"{deleting.title}"</span>? This action cannot be undone and will remove all related data.
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 pt-0">
                            <button
                                onClick={() => setDeleting(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:opacity-70"
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