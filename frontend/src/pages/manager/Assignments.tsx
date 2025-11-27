import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import { Plus, Edit2, Trash2, Search } from "react-feather";
import type { AxiosError } from "axios";

type Assignment = {
    id: number;
    project_id: number;
    employee_id: number;
    role_desc?: string;
    start_date?: string;
    end_date?: string;
    status: string;
    created_at: string;
};

type Employee = {
    id: number;
    name: string;
    skills?: string;
};

type Project = {
    id: number;
    project_name: string;
};

export default function ManagerAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [loading, setLoading] = useState(false);

    // Search + Filters
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [page, setPage] = useState(1);
    const perPage = 10;

    // Modals
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editing, setEditing] = useState<Assignment | null>(null);
    const [deleting, setDeleting] = useState<Assignment | null>(null);

    const [processing, setProcessing] = useState(false);

    // Form state
    const emptyForm = {
        project_id: "",
        employee_id: "",
        role_desc: "",
        start_date: "",
        end_date: "",
        status: "assigned",
    };
    const [form, setForm] = useState<any>(emptyForm);

    // Load data
    const load = async () => {
        setLoading(true);
        try {
            const a = await api.get("/assignments");
            const e = await api.get("/employees");
            const p = await api.get("/projects");
            setAssignments(a.data);
            setEmployees(e.data);
            setProjects(p.data);
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Failed loading assignments");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    // Filter + search
    const filtered = useMemo(() => {
        let arr = assignments;

        if (statusFilter) arr = arr.filter((a) => a.status === statusFilter);

        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((a) =>
                `${a.role_desc}`.toLowerCase().includes(q)
            );
        }

        return arr;
    }, [assignments, query, statusFilter]);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    // Open create modal
    const openCreate = () => {
        setForm(emptyForm);
        setShowCreate(true);
    };

    // CREATE
    const handleCreate = async (e: any) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await api.post("/assignments", form);
            setShowCreate(false);
            load();
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Create failed");
        }

        setProcessing(false);
    };

    // EDIT
    const openEdit = (assn: Assignment) => {
        setEditing(assn);
        setForm({
            project_id: assn.project_id,
            employee_id: assn.employee_id,
            role_desc: assn.role_desc || "",
            start_date: assn.start_date || "",
            end_date: assn.end_date || "",
            status: assn.status,
        });
        setShowEdit(true);
    };

    const handleEdit = async (e: any) => {
        e.preventDefault();
        if (!editing) return;

        setProcessing(true);
        try {
            await api.put(`/assignments/${editing.id}`, form);
            setShowEdit(false);
            setEditing(null);
            load();
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Update failed");
        }
        setProcessing(false);
    };

    // DELETE
    const handleDelete = async () => {
        if (!deleting) return;

        setProcessing(true);
        try {
            await api.delete(`/assignments/${deleting.id}`);
            setDeleting(null);
            load();
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Delete failed");
        }
        setProcessing(false);
    };

    return (
        <div className="p-6">

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Assignments</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Assign employees to projects
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-[1.01]"
                >
                    <Plus className="w-4 h-4" /> New Assignment
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">

                {/* Search */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search role..."
                        className="bg-transparent outline-none text-sm"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Status Filter */}
                <select
                    className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="assigned">Assigned</option>
                    <option value="working">Working</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shadow-inner">

                {loading ? (
                    <div className="py-6 text-center">Loading...</div>
                ) : current.length === 0 ? (
                    <div className="py-6 text-center text-gray-400">No assignments found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="text-gray-400 border-b text-sm">
                                    <th className="py-3 px-4">Project</th>
                                    <th className="py-3 px-4">Employee</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4">Dates</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {current.map((a) => (
                                    <tr key={a.id} className="border-b hover:bg-white/5">
                                        <td className="py-3 px-4">{a.project_id}</td>

                                        <td className="py-3 px-4">{a.employee_id}</td>

                                        <td className="py-3 px-4">{a.role_desc || "—"}</td>

                                        <td className="py-3 px-4">
                                            {a.start_date || "—"} → {a.end_date || "—"}
                                        </td>

                                        <td className="py-3 px-4 capitalize">{a.status}</td>

                                        <td className="py-3 px-4 flex gap-2">
                                            <button
                                                onClick={() => openEdit(a)}
                                                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-1"
                                            >
                                                <Edit2 className="w-4 h-4" /> Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleting(a)}
                                                className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
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
                        Showing {(page - 1) * perPage + 1} –{" "}
                        {Math.min(page * perPage, filtered.length)} of {filtered.length}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 bg-white/5 rounded-xl"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-1 bg-white/5 rounded-xl">
                            {page} / {pages}
                        </span>

                        <button
                            disabled={page >= pages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 bg-white/5 rounded-xl"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------------------------------------------------
                 CREATE MODAL
            --------------------------------------------------------- */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-xl w-full shadow-2xl">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">New Assignment</h2>
                            <button onClick={() => setShowCreate(false)}>✕</button>
                        </div>

                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {/* Project */}
                            <select
                                required
                                className="border p-3 rounded-xl"
                                value={form.project_id}
                                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                            >
                                <option value="">Select Project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.id} — {p.project_name}
                                    </option>
                                ))}
                            </select>

                            {/* Employee */}
                            <select
                                required
                                className="border p-3 rounded-xl"
                                value={form.employee_id}
                                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                            >
                                <option value="">Select Employee</option>
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.id} — {e.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Role Description"
                                className="border p-3 rounded-xl md:col-span-2"
                                value={form.role_desc}
                                onChange={(e) => setForm({ ...form, role_desc: e.target.value })}
                            />

                            <input
                                type="date"
                                className="border p-3 rounded-xl"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                            />

                            <input
                                type="date"
                                className="border p-3 rounded-xl"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                            />

                            <button
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl md:col-span-2"
                            >
                                {processing ? "Assigning…" : "Assign"}
                            </button>

                        </form>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------
                 EDIT MODAL
            --------------------------------------------------------- */}
            {showEdit && editing && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-xl w-full shadow-2xl">

                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">Edit Assignment</h2>
                            <button onClick={() => setShowEdit(false)}>✕</button>
                        </div>

                        <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            {/* Project */}
                            <select
                                required
                                className="border p-3 rounded-xl"
                                value={form.project_id}
                                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                            >
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.id} — {p.project_name}
                                    </option>
                                ))}
                            </select>

                            {/* Employee */}
                            <select
                                required
                                className="border p-3 rounded-xl"
                                value={form.employee_id}
                                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                            >
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.id} — {e.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                placeholder="Role Description"
                                className="border p-3 rounded-xl md:col-span-2"
                                value={form.role_desc}
                                onChange={(e) => setForm({ ...form, role_desc: e.target.value })}
                            />

                            <input
                                type="date"
                                className="border p-3 rounded-xl"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                            />

                            <input
                                type="date"
                                className="border p-3 rounded-xl"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                            />

                            <select
                                className="border p-3 rounded-xl md:col-span-2"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="assigned">Assigned</option>
                                <option value="working">Working</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <button
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl md:col-span-2"
                            >
                                {processing ? "Saving…" : "Save Changes"}
                            </button>

                        </form>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------
                 DELETE CONFIRMATION
            --------------------------------------------------------- */}
            {deleting && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full text-center">

                        <h3 className="text-lg font-semibold mb-2">
                            Delete assignment #{deleting.id}?
                        </h3>

                        <p className="text-gray-500 text-sm mb-4">
                            This cannot be undone.
                        </p>

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
                                {processing ? "Deleting…" : "Delete"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
