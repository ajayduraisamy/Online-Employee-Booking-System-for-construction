import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import {
    Search,
    Filter,
    Calendar,
    User,
    DollarSign,
    Briefcase,
    Edit3,
    PlusCircle,
    X,
    CheckCircle2,
    Clock,

    ChevronLeft,
    ChevronRight
} from "lucide-react";


// --- Types ---
type Booking = {
    id: number;
    client_id: number;
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

export default function ManagerBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [onlyUnassigned, setOnlyUnassigned] = useState(false);
    const [page, setPage] = useState(1);
    const perPage = 8;

    // Modal State
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    // --- Data Loading ---
    const load = async () => {
        setLoading(true);
        try {
            const url = onlyUnassigned
                ? "/bookings?unassigned=1"
                : statusFilter
                    ? `/bookings?status=${statusFilter}`
                    : "/bookings";

            const res = await api.get(url);
            setBookings(res.data);
        } catch (err) {
            console.error("Failed to load bookings");
        }

        setLoading(false);
    };

    useEffect(() => {
        load();
    }, [statusFilter, onlyUnassigned]);

    // --- Filtering ---
    const filtered = useMemo(() => {
        let arr = bookings;
        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((b) =>
                `${b.title} ${b.description} ${b.required_skills}`.toLowerCase().includes(q)
            );
        }
        return arr;
    }, [bookings, query]);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    // --- Status Actions ---
    const openStatusModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        setShowStatusModal(true);
    };

    const updateStatus = async () => {
        if (!selectedBooking) return;
        setUpdating(true);
        try {
            await api.put(`/admin/bookings/${selectedBooking.id}`, {
                status: newStatus
            });
            setShowStatusModal(false);
            load();
        } catch (err) {
            alert("Failed to update status");
        }
        setUpdating(false);
    };

    // --- UI Helpers ---
    const getStatusUI = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved": return { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
            case "completed": return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2 };
            
            default: return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock }; // pending
        }
    };

    const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : "—";

    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header --- */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Client Bookings</h1>
                <p className="text-slate-500 mt-1">Review incoming requests and assign projects.</p>
            </div>

            {/* --- Controls Bar --- */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8 justify-between items-start xl:items-center">

                {/* Search & Tabs Group */}
                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">

                    {/* Search */}
                    <div className="relative group w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Search bookings..."
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                        {[
                            { label: "All", val: "" },
                            { label: "Pending", val: "pending" },
                            { label: "Approved", val: "approved" },
                            { label: "Completed", val: "completed" },
                            
                        ].map((tab) => (
                            <button
                                key={tab.val}
                                onClick={() => { setStatusFilter(tab.val); setPage(1); setOnlyUnassigned(false); }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                    ${statusFilter === tab.val && !onlyUnassigned
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Unassigned Toggle */}
                <button
                    onClick={() => { setOnlyUnassigned(!onlyUnassigned); setPage(1); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 font-medium text-sm
                        ${onlyUnassigned
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    <Filter size={16} />
                    Unassigned Only
                </button>
            </div>

            {/* --- Data Table --- */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading bookings...</div>
                ) : current.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">No bookings found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Request Details</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Timeline</th>
                                    <th className="px-6 py-4">Budget</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {current.map((b) => {
                                    const Status = getStatusUI(b.status);
                                    const StatusIcon = Status.icon;

                                    return (
                                        <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                                            {/* Title & Description */}
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                                        <Briefcase size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{b.title}</p>
                                                        <p className="text-slate-500 text-xs mt-1 line-clamp-1">{b.description}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                                                                {b.required_skills || "General"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Client ID */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <User size={16} className="text-slate-400" />
                                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">#{b.client_id}</span>
                                                </div>
                                            </td>

                                            {/* Timeline */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
                                                    <Calendar size={16} className="text-slate-400" />
                                                    <span className="text-xs font-medium">
                                                        {fmtDate(b.start_date)} <span className="text-slate-400 mx-1">→</span> {fmtDate(b.end_date)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Budget */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 font-bold text-slate-700">
                                                    <DollarSign size={14} className="text-emerald-500" />
                                                    {b.budget ? b.budget.toLocaleString() : "—"}
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${Status.color}`}>
                                                    <StatusIcon size={12} />
                                                    {b.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => window.location.href = `/dashboard/manager/projects?booking=${b.id}`}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Create Project"
                                                    >
                                                        <PlusCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openStatusModal(b)}
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="Update Status"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Pagination Footer --- */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                        Showing <span className="font-medium text-slate-900">{(page - 1) * perPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * perPage, filtered.length)}</span> of {filtered.length} results
                    </span>
                    <div className="flex gap-2">
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
            </div>

            {/* --- Status Modal --- */}
            {showStatusModal && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Update Status</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Booking Title</p>
                                <p className="text-sm font-medium text-slate-800 line-clamp-1">{selectedBooking.title}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">New Status</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateStatus}
                                disabled={updating}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
                            >
                                {updating ? "Saving..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}