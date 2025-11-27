import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import {
    Search,
    MapPin,
    Calendar,
    Briefcase,
    Layers,
    Navigation,
    Edit3,
    CheckCircle2,
    Clock,
    XCircle,
    PlayCircle
} from "lucide-react";


// --- Types ---
type Task = {
    id: number;
    project_id: number;
    role_desc?: string;
    start_date?: string;
    end_date?: string;
    status: string;

    project_name?: string;
    booking_title?: string;
    booking_location?: string;
    booking_start?: string;
    booking_end?: string;
};

export default function MyTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");

    // Employee GPS
    const [myLat, setMyLat] = useState<number | null>(null);
    const [myLng, setMyLng] = useState<number | null>(null);

    // Modal State
    const [selected, setSelected] = useState<Task | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    // --- Helpers ---
    const getLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setMyLat(pos.coords.latitude);
                setMyLng(pos.coords.longitude);
            },
            (err) => console.error(err)
        );
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/employee/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to load tasks");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
        getLocation();
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return tasks.filter(t =>
            `${t.role_desc} ${t.status} ${t.project_name} ${t.booking_location}`
                .toLowerCase()
                .includes(q)
        );
    }, [tasks, query]);

    const updateStatus = async () => {
        if (!selected) return;
        setUpdating(true);
        try {
            await api.put(`/assignments/${selected.id}/status`, { status: newStatus });
            setSelected(null);
            load();
        } catch (error) {
            alert("Failed to update status");
        }
        setUpdating(false);
    };

    // --- Map Logic ---
    const mapUrl = (location: string) =>
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;

    const distanceUrl = (location: string) => {
        if (!myLat || !myLng) return mapUrl(location);
        return `https://www.google.com/maps/dir/${myLat},${myLng}/${encodeURIComponent(location)}`;
    };

    // --- UI Helpers ---
    const getStatusUI = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Completed" };
            case "working": return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: PlayCircle, label: "In Progress" };
            case "rejected": return { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Rejected" };
            default: return { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, label: "Assigned" };
        }
    };

    const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "—";

    return (
        <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Assignments</h1>
                    <p className="text-slate-500 mt-1">Track your active tasks and manage job statuses.</p>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        placeholder="Search tasks, locations..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* --- Task Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-400">Loading your tasks...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400">No tasks found.</div>
                ) : (
                    filtered.map((t) => {
                        const Status = getStatusUI(t.status);
                        return (
                            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

                                {/* Card Header */}
                                <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            <Layers size={12} />
                                            Task #{t.id}
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={t.project_name}>
                                            {t.project_name || "Untitled Project"}
                                        </h3>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${Status.color}`}>
                                        <Status.icon size={12} />
                                        {Status.label}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 space-y-4">

                                    {/* Role */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <Briefcase size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase">My Role</p>
                                            <p className="text-sm font-medium text-slate-700">{t.role_desc || "General Staff"}</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase">Site Location</p>
                                            <p className="text-sm font-medium text-slate-700 line-clamp-2" title={t.booking_location}>
                                                {t.booking_location || "Remote / Unspecified"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase">Schedule</p>
                                            <p className="text-sm font-medium text-slate-700">
                                                {fmtDate(t.start_date)} — {fmtDate(t.end_date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                                    {/* Navigate Button */}
                                    {t.booking_location ? (
                                        <a
                                            href={distanceUrl(t.booking_location)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                                        >
                                            <Navigation size={14} /> Map
                                        </a>
                                    ) : (
                                        <button disabled className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-300 rounded-xl text-sm font-semibold cursor-not-allowed">
                                            <Navigation size={14} /> Map
                                        </button>
                                    )}

                                    {/* Status Button */}
                                    <button
                                        onClick={() => { setSelected(t); setNewStatus(t.status); }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                    >
                                        <Edit3 size={14} /> Update
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* --- Status Update Modal --- */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Update Task Status</h3>
                            <p className="text-sm text-slate-500 mt-1">Change the status for Task #{selected.id}</p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700 text-left">New Status</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="assigned">Assigned</option>
                                    <option value="working">Working (In Progress)</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setSelected(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateStatus}
                                disabled={updating}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                            >
                                {updating ? "Saving..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}