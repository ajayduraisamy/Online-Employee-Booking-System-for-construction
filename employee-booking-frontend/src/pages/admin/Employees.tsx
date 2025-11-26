import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import { Pencil, Trash2, UserPlus } from "lucide-react";

export default function Employees() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState({
        id: "",
        user_id: "",
        trade: "",
        skills: "",
        hourly_rate: "",
        status: "active",
    });

    // Load employees + users
    const load = () => {
        api.get("/employees").then((res) => setEmployees(res.data));
        api.get("/users").then((res) => setUsers(res.data));
    };

    useEffect(() => {
        load();
    }, []);

    // Form handler
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add or Update employee
    const submit = async () => {
        if (!form.user_id) {
            alert("Select a user");
            return;
        }

        if (!isEditing) {
            await api.post("/employees", form);
        } else {
            await api.put(`/employees/${form.id}`, form);
        }

        setFormOpen(false);
        setForm({
            id: "",
            user_id: "",
            trade: "",
            skills: "",
            hourly_rate: "",
            status: "active",
        });
        setIsEditing(false);
        load();
    };

    // Edit
    const editEmployee = (emp: any) => {
        setForm({
            id: emp.id,
            user_id: emp.user_id,
            trade: emp.trade,
            skills: emp.skills,
            hourly_rate: emp.hourly_rate,
            status: emp.status,
        });
        setIsEditing(true);
        setFormOpen(true);
    };

    // Delete
    const deleteEmployee = async (id: number) => {
        if (window.confirm("Delete this employee?")) {
            await api.delete(`/employees/${id}`);
            load();
        }
    };

    return (
        <div className="flex">
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Employees</h1>

                    <button
                        onClick={() => setFormOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                    >
                        <UserPlus size={18} />
                        Add Employee
                    </button>
                </div>

                {/* EMPLOYEE TABLE */}
                <div className="bg-white shadow rounded p-4 overflow-x-auto border border-gray-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">Name</th>
                                <th className="p-2">Trade</th>
                                <th className="p-2">Skills</th>
                                <th className="p-2">Hourly Rate</th>
                                <th className="p-2">Status</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id} className="border-b">
                                    <td className="p-2">{emp.name}</td>
                                    <td className="p-2 text-center">{emp.trade}</td>
                                    <td className="p-2 text-center">{emp.skills}</td>
                                    <td className="p-2 text-center">₹{emp.hourly_rate}</td>
                                    <td className="p-2 text-center">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${emp.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="p-2 flex justify-center gap-3">
                                        <button
                                            onClick={() => editEmployee(emp)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteEmployee(emp.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {employees.length === 0 && (
                        <p className="text-center text-gray-500 py-5">No employees found.</p>
                    )}
                </div>

                {/* FORM MODAL */}
                {formOpen && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow w-96">
                            <h2 className="text-xl font-bold mb-4">
                                {isEditing ? "Edit Employee" : "Add Employee"}
                            </h2>

                            {/* SELECT USER */}
                            <label className="block text-sm font-medium mb-1">User</label>
                            <select
                                name="user_id"
                                value={form.user_id}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded mb-3"
                                disabled={isEditing}
                            >
                                <option value="">Select user</option>
                                {users
                                    .filter((u) => u.role === "employee")
                                    .map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                            </select>

                            <label className="block text-sm font-medium mb-1">Trade</label>
                            <input
                                name="trade"
                                value={form.trade}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded mb-3"
                            />

                            <label className="block text-sm font-medium mb-1">Skills</label>
                            <input
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded mb-3"
                            />

                            <label className="block text-sm font-medium mb-1">Hourly Rate</label>
                            <input
                                name="hourly_rate"
                                type="number"
                                value={form.hourly_rate}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded mb-3"
                            />

                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded mb-3"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setFormOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    {isEditing ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
