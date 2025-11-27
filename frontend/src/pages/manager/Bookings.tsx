import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import { Search } from "react-feather";
import type { AxiosError } from "axios";

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

    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [onlyUnassigned, setOnlyUnassigned] = useState(false);

    const [page, setPage] = useState(1);
    const perPage = 8;

    // -------- Modal states --------
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newStatus, setNewStatus] = useState("");

    // Load bookings
    const load = async () => {
        setLoading(true);
        try {
            const url =
                onlyUnassigned
                    ? "/bookings?unassigned=1"
                    : statusFilter
                        ? `/bookings?status=${statusFilter}`
                        : "/bookings";

            const res = await api.get(url);
            setBookings(res.data);
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Failed to load bookings");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, [statusFilter, onlyUnassigned]);

    // Filter + search
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

    // --------- STATUS UPDATE ----------
    const openStatusModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        setShowStatusModal(true);
    };

    const updateStatus = async () => {
        if (!selectedBooking) return;

        try {
            await api.put(`/admin/bookings/${selectedBooking.id}`, {
                status: newStatus
            });

            setShowStatusModal(false);
            load();
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Failed to update status");
        }
    };


    return (
        <div className="p-6">

            <h1 className="text-3xl font-semibold mb-6">Client Bookings</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">

                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        className="bg-transparent outline-none text-sm"
                        placeholder="Search bookings..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <select
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                </select>

                <button
                    onClick={() => {
                        setOnlyUnassigned(!onlyUnassigned);
                        setPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm ${onlyUnassigned ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300"
                        }`}
                >
                    Unassigned Only
                </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 rounded-2xl p-4 shadow-inner border border-white/10">

                {loading ? (
                    <div className="text-center py-6">Loading bookings…</div>
                ) : current.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">No bookings found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="text-gray-400 border-b text-sm">
                                    <th className="py-3 px-4">Title</th>
                                    <th className="py-3 px-4">Client</th>
                                    <th className="py-3 px-4">Skills</th>
                                    <th className="py-3 px-4">Dates</th>
                                    <th className="py-3 px-4">Budget</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {current.map((b) => (
                                    <tr key={b.id} className="border-b hover:bg-white/5">

                                        <td className="py-3 px-4 font-medium">
                                            {b.title}
                                            <div className="text-gray-400 text-sm">
                                                {b.description?.slice(0, 50)}…
                                            </div>
                                        </td>

                                        <td className="py-3 px-4">#{b.client_id}</td>
                                        <td className="py-3 px-4">{b.required_skills || "—"}</td>

                                        <td className="py-3 px-4">
                                            {b.start_date || "—"} → {b.end_date || "—"}
                                        </td>

                                        <td className="py-3 px-4">
                                            ₹{b.budget?.toLocaleString() || "—"}
                                        </td>

                                        <td className="py-3 px-4 capitalize">{b.status}</td>

                                        <td className="py-3 px-4 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    window.location.href = `/dashboard/manager/projects?booking=${b.id}`
                                                }
                                                className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                            >
                                                Create Project
                                            </button>

                                            <button
                                                onClick={() => openStatusModal(b)}
                                                className="px-3 py-1 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
                                            >
                                                Update Status
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                    <span>
                        Showing {(page - 1) * perPage + 1} –
                        {Math.min(page * perPage, filtered.length)} of {filtered.length}
                    </span>

                    <div className="flex gap-2">
                        <button disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 bg-white/5 rounded-xl">Prev</button>

                        <span className="px-3 py-1 bg-white/5 rounded-xl">
                            {page} / {pages}
                        </span>

                        <button disabled={page >= pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 bg-white/5 rounded-xl">Next</button>
                    </div>
                </div>

            </div>

            {/* -------- STATUS UPDATE MODAL -------- */}
            {showStatusModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">

                        <h2 className="text-xl font-semibold mb-4">
                            Update Status for: {selectedBooking.title}
                        </h2>

                        <select
                            className="border p-3 rounded-xl w-full mb-4"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="completed">Completed</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateStatus}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl"
                            >
                                Update
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
