import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../api/axios";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

export default function Sites() {
    const [sites, setSites] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // modal / form state
    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        id: "",
        name: "",
        location: "",
        latitude: "",
        longitude: "",
        status: "open",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSites();
    }, []);

    const loadSites = async () => {
        try {
            const res = await api.get("/sites");
            setSites(res.data || []);
        } catch (err) {
            console.error("Load sites error", err);
            setSites([]);
        }
    };

    const openAdd = () => {
        setForm({
            id: "",
            name: "",
            location: "",
            latitude: "",
            longitude: "",
            status: "open",
        });
        setIsEditing(false);
        setFormOpen(true);
    };

    const openEdit = (s: any) => {
        setForm({
            id: s.id,
            name: s.name || "",
            location: s.location || "",
            latitude: s.latitude ?? "",
            longitude: s.longitude ?? "",
            status: s.status || "open",
        });
        setIsEditing(true);
        setFormOpen(true);
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        if (!form.name || !form.location) {
            alert("Please enter site name and location.");
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/sites/${form.id}`, {
                    name: form.name,
                    location: form.location,
                    latitude: form.latitude || null,
                    longitude: form.longitude || null,
                    status: form.status,
                });
            } else {
                await api.post("/sites", {
                    name: form.name,
                    location: form.location,
                    latitude: form.latitude || null,
                    longitude: form.longitude || null,
                    status: form.status,
                });
            }
            setFormOpen(false);
            loadSites();
        } catch (err) {
            console.error("Save site error", err);
            alert("Failed to save site. See console.");
        } finally {
            setLoading(false);
        }
    };

    const deleteSite = async (id: number) => {
        if (!window.confirm("Delete this site?")) return;
        try {
            await api.delete(`/sites/${id}`);
            loadSites();
        } catch (err) {
            console.error("Delete site error", err);
            alert("Failed to delete.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-2xl font-bold">Sites / Projects</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openAdd}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
                        >
                            <Plus size={16} />
                            Add Site
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow rounded border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-center">Latitude</th>
                                <th className="p-3 text-center">Longitude</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sites.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-gray-500">
                                        No sites found.
                                    </td>
                                </tr>
                            )}

                            {sites.map((s) => (
                                <tr key={s.id} className="border-t">
                                    <td className="p-3">{s.name}</td>
                                    <td className="p-3">{s.location}</td>
                                    <td className="p-3 text-center">{s.latitude ?? "-"}</td>
                                    <td className="p-3 text-center">{s.longitude ?? "-"}</td>
                                    <td className="p-3 text-center">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${s.status === "open" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(s)}
                                                className="p-2 rounded hover:bg-gray-100"
                                                title="Edit"
                                            >
                                                <Pencil size={16} className="text-sky-600" />
                                            </button>

                                            <button
                                                onClick={() => deleteSite(s.id)}
                                                className="p-2 rounded hover:bg-gray-100"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} className="text-rose-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* modal */}
            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">{isEditing ? "Edit Site" : "Add Site"}</h2>
                        </div>

                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Site Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Site / Project name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Location / Address</label>
                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="e.g. 123 Main St, City"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Latitude</label>
                                    <input
                                        name="latitude"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="optional"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Longitude</label>
                                    <input
                                        name="longitude"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="optional"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <button
                                onClick={() => setFormOpen(false)}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submit}
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {loading ? "Saving..." : isEditing ? "Update Site" : "Create Site"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
