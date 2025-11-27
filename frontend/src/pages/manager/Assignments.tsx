import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import { Plus, Edit2, Trash2, Search, User, Briefcase, Calendar, Filter, ChevronLeft, ChevronRight, X, AlertCircle, CheckCircle, Clock, PlayCircle } from "react-feather";
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
            const [a, e, p] = await Promise.all([
                api.get("/assignments"),
                api.get("/employees"),
                api.get("/projects")
            ]);
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

    // Helper functions
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'working': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'assigned': return <Clock className="w-4 h-4" />;
            case 'working': return <PlayCircle className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getProjectName = (projectId: number) => {
        const project = projects.find(p => p.id === projectId);
        return project?.project_name || `Project #${projectId}`;
    };

    const getEmployeeName = (employeeId: number) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee?.name || `Employee #${employeeId}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Assignments Management
                        </h1>
                        <p className="text-gray-600">Manage employee assignments and project allocations</p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        New Assignment
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            placeholder="Search assignments by role description..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full lg:w-48"
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
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : current.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search criteria or create a new assignment.</p>
                        <button
                            onClick={openCreate}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            Create First Assignment
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Project & Employee
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Timeline
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {current.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                                        P{a.project_id}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {getProjectName(a.project_id)}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                            <User className="w-3 h-3" />
                                                            {getEmployeeName(a.employee_id)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="max-w-xs">
                                                    <div className="text-gray-900 font-medium">
                                                        {a.role_desc || "—"}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-green-500" />
                                                        <span className="font-medium text-gray-700">{formatDate(a.start_date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-red-500" />
                                                        <span className="font-medium text-gray-700">{formatDate(a.end_date)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(a.status)}`}>
                                                    {getStatusIcon(a.status)}
                                                    <span className="capitalize">{a.status}</span>
                                                </span>
                                            </td>

                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEdit(a)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all duration-300 group/edit"
                                                        title="Edit Assignment"
                                                    >
                                                        <Edit2 className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                                                    </button>

                                                    <button
                                                        onClick={() => setDeleting(a)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:scale-110 transition-all duration-300 group/delete"
                                                        title="Delete Assignment"
                                                    >
                                                        <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-semibold">{(page - 1) * perPage + 1}</span> to{" "}
                                    <span className="font-semibold">{Math.min(page * perPage, filtered.length)}</span> of{" "}
                                    <span className="font-semibold">{filtered.length}</span> assignments
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={page <= 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${page === p
                                                        ? 'bg-blue-600 text-white shadow-lg'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={page >= pages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl animate-in fade-in-90 zoom-in-90">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
                                <p className="text-gray-600 mt-1">Assign an employee to a project</p>
                            </div>
                            <button
                                onClick={() => setShowCreate(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.project_id}
                                        onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.project_name} (#{p.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.employee_id}
                                        onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map((e) => (
                                            <option key={e.id} value={e.id}>
                                                {e.name} (#{e.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role Description</label>
                                <input
                                    placeholder="Enter role description and responsibilities..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    value={form.role_desc}
                                    onChange={(e) => setForm({ ...form, role_desc: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.start_date}
                                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.end_date}
                                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </div>
                                    ) : (
                                        "Create Assignment"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEdit && editing && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl animate-in fade-in-90 zoom-in-90">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Edit Assignment</h2>
                                <p className="text-gray-600 mt-1">Update assignment details</p>
                            </div>
                            <button
                                onClick={() => setShowEdit(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.project_id}
                                        onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                                    >
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.project_name} (#{p.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                                    <select
                                        required
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.employee_id}
                                        onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                                    >
                                        {employees.map((e) => (
                                            <option key={e.id} value={e.id}>
                                                {e.name} (#{e.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role Description</label>
                                <input
                                    placeholder="Enter role description and responsibilities..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    value={form.role_desc}
                                    onChange={(e) => setForm({ ...form, role_desc: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.start_date}
                                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={form.end_date}
                                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="assigned">Assigned</option>
                                    <option value="working">Working</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEdit(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </div>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleting && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-90 zoom-in-90 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Assignment?
                        </h3>

                        <p className="text-gray-600 mb-2">
                            You're about to delete assignment <span className="font-semibold">#{deleting.id}</span>
                        </p>

                        <p className="text-sm text-gray-500 mb-6">
                            This action cannot be undone and will permanently remove this assignment.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleting(null)}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={processing}
                                onClick={handleDelete}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all duration-300"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Deleting...
                                    </div>
                                ) : (
                                    "Delete Assignment"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}