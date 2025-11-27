import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import { Search } from "react-feather";
import type { AxiosError } from "axios";

type Employee = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    skills?: string;
};

export default function ManagerEmployees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [query, setQuery] = useState("");
    const [skillFilter, setSkillFilter] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 10;

    // Load employees
    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/employees"); // backend route for manager/admin
            setEmployees(res.data);
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Failed to load employees");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    // Search + Filter logic
    const filtered = useMemo(() => {
        let arr = employees;

        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter((e) =>
                `${e.name} ${e.email} ${e.skills}`.toLowerCase().includes(q)
            );
        }

        if (skillFilter.trim()) {
            arr = arr.filter((e) =>
                (e.skills || "").toLowerCase().includes(skillFilter.toLowerCase())
            );
        }

        return arr;
    }, [employees, query, skillFilter]);

    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="p-6">

            <h1 className="text-3xl font-semibold mb-6">Employees</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

                {/* Search */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        className="bg-transparent outline-none text-sm"
                        placeholder="Search employees..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Skill Filter */}
                <input
                    placeholder="Filter by skill…"
                    className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm"
                    value={skillFilter}
                    onChange={(e) => {
                        setSkillFilter(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/* Employees Table */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shadow-inner">
                {loading ? (
                    <div className="text-center py-6">Loading employees…</div>
                ) : current.length === 0 ? (
                    <div className="py-6 text-center text-gray-400">
                        No employees found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Phone</th>
                                    <th className="py-3 px-4">Skills</th>
                                </tr>
                            </thead>

                            <tbody>
                                {current.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        className="border-b hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-3 px-4">{emp.id}</td>
                                        <td className="py-3 px-4">{emp.name}</td>
                                        <td className="py-3 px-4">{emp.email}</td>
                                        <td className="py-3 px-4">{emp.phone || "—"}</td>
                                        <td className="py-3 px-4">{emp.skills || "—"}</td>
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

                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1 bg-white/5 rounded-xl"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 bg-white/5 rounded-xl">
                            {page} / {pages}
                        </span>
                        <button
                            className="px-3 py-1 bg-white/5 rounded-xl"
                            disabled={page >= pages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
