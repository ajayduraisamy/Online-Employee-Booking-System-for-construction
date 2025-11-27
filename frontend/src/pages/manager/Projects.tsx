import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../api/axios";
import { Plus, Edit2, Trash2, Search } from "react-feather";
import type { AxiosError } from "axios";

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
    const perPage = 10;

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
            const err = error as AxiosError;
            alert((err.response?.data as any)?.msg || "Failed to load projects");
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

    const pages = Math.ceil(filtered.length / perPage);
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    const openCreate = () => {
        setForm(emptyForm);
        setShowCreate(true);
    };

    const handleCreate = async (e: any) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await api.post("/projects", form);
            setShowCreate(false);
            load();
        } catch (error) {
            const err = error as AxiosError;
            alert((err.response?.data as any)?.msg || "Create failed");
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

    const handleEdit = async (e: any) => {
        e.preventDefault();
        if (!editing) return;

        setProcessing(true);

        try {
            await api.put(`/projects/${editing.id}`, form);
            setShowEdit(false);
            setEditing(null);
            load();
        } catch (error) {
            const err = error as AxiosError;
            alert((err.response?.data as any)?.msg || "Edit failed");
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
            const err = error as AxiosError;
            alert((err.response?.data as any)?.msg || "Delete failed");
        }

        setProcessing(false);
    };

    return (
        <div className="p-6">

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Projects</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage all projects</p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-[1.02]"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        className="bg-transparent outline-none text-sm"
                        placeholder="Search projects..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <select
                    className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="planned">Planned</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Projects Table */}
            <div className="bg-white/5 rounded-2xl shadow-inner border border-white/10 p-4">

                {loading ? (
                    <div className="py-6 text-center">Loading...</div>
                ) : current.length === 0 ? (
                    <div className="py-6 text-center text-gray-400">No projects found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Booking</th>
                                    <th className="py-3 px-4">Project</th>
                                    <th className="py-3 px-4">Dates</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {current.map((p) => (
                                    <tr key={p.id} className="border-b hover:bg-white/5">

                                        <td className="py-3 px-4">{p.id}</td>
                                        <td className="py-3 px-4">#{p.booking_id}</td>
                                        <td className="py-3 px-4">{p.project_name}</td>

                                        <td className="py-3 px-4">
                                            {p.start_date || "—"} → {p.end_date || "—"}
                                        </td>

                                        <td className="py-3 px-4 capitalize">{p.status}</td>

                                        <td className="py-3 px-4 flex gap-2">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-1"
                                            >
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleting(p)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-xl text-white flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
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
                        Showing {(page - 1) * perPage + 1} -{" "}
                        {Math.min(page * perPage, filtered.length)} of {filtered.length}
                    </span>

                    <div className="flex gap-2">
                        <button disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 bg-white/5 rounded-xl">Prev</button>

                        <span className="px-3 py-1 bg-white/5 rounded-xl">{page} / {pages}</span>

                        <button disabled={page >= pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 bg-white/5 rounded-xl">Next</button>
                    </div>
                </div>

            </div>

            {/* CREATE MODAL */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">Create Project</h2>
                            <button onClick={() => setShowCreate(false)}>✕</button>
                        </div>

                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <input
                                required
                                placeholder="Booking ID"
                                value={form.booking_id}
                                onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <input
                                required
                                placeholder="Project Name"
                                value={form.project_name}
                                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <textarea
                                placeholder="Notes..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="border p-3 rounded-xl md:col-span-2"
                            />

                            <button
                                disabled={processing}
                                className="bg-blue-600 text-white px-4 py-2 md:col-span-2 rounded-xl"
                            >
                                {processing ? "Creating..." : "Create Project"}
                            </button>

                        </form>

                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {showEdit && editing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">Edit Project</h2>
                            <button onClick={() => setShowEdit(false)}>✕</button>
                        </div>

                        <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <input
                                required
                                placeholder="Booking ID"
                                value={form.booking_id}
                                onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <input
                                required
                                placeholder="Project Name"
                                value={form.project_name}
                                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                className="border p-3 rounded-xl"
                            />

                            <textarea
                                placeholder="Notes..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="border p-3 rounded-xl md:col-span-2"
                            />

                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="border p-3 rounded-xl md:col-span-2"
                            >
                                <option value="active">Active</option>
                                <option value="planned">Planned</option>
                                <option value="completed">Completed</option>
                            </select>

                            <button
                                disabled={processing}
                                className="bg-green-600 text-white px-4 py-2 md:col-span-2 rounded-xl"
                            >
                                {processing ? "Saving..." : "Save Changes"}
                            </button>

                        </form>

                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl text-center">

                        <h2 className="text-lg font-semibold mb-2">
                            Delete "{deleting.project_name}"?
                        </h2>

                        <p className="text-gray-500 mb-4 text-sm">This action cannot be undone.</p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setDeleting(null)}
                                className="px-4 py-2 bg-gray-300 rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={processing}
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl"
                            >
                                {processing ? "Deleting..." : "Delete"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
