import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../api/axios";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee"
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        api.get("/users").then((res) => setUsers(res.data));
    };

    const handleInput = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createUser = async () => {
        await api.post("/register", form);
        setShowModal(false);
        setForm({ name: "", email: "", password: "", role: "employee" });
        loadUsers();
    };

    const deleteUser = async (id: number) => {
        if (!window.confirm("Delete this user?")) return;
        await api.delete(`/users/${id}`);
        loadUsers();
    };

    return (
        <div className="flex">
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            <div className={`flex-1 p-6 ${sidebarOpen ? "ml-64" : ""}`}>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        + Add User
                    </button>
                </div>

                <div className="mt-6 bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">ID</th>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Role</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u: any) => (
                                <tr key={u.id} className="text-center">
                                    <td className="border p-2">{u.id}</td>
                                    <td className="border p-2">{u.name}</td>
                                    <td className="border p-2">{u.email}</td>
                                    <td className="border p-2 capitalize">{u.role}</td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-3">Add User</h2>

                        <input
                            className="border p-2 w-full mb-3"
                            name="name"
                            placeholder="Name"
                            onChange={handleInput}
                        />

                        <input
                            className="border p-2 w-full mb-3"
                            name="email"
                            placeholder="Email"
                            onChange={handleInput}
                        />

                        <input
                            className="border p-2 w-full mb-3"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleInput}
                        />

                        <select
                            name="role"
                            className="border p-2 w-full mb-4"
                            onChange={handleInput}
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                            <option value="client">Client</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={createUser}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
