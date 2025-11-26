import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
// import { formatISO } from "date-fns";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Sidebar from "../../components/Sidebar";
import { api } from "../../api/axios";
import {
    CalendarDays,
    Plus,
    Pencil,
    Trash2,
    
} from "lucide-react";

moment.locale("en-gb");
const localizer = momentLocalizer(moment);

export default function Bookings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tab, setTab] = useState("calendar");

    const [bookings, setBookings] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [sites, setSites] = useState<any[]>([]);

    const [formOpen, setFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        id: "",
        employee_id: "",
        site_id: "",
        start_time: "",
        end_time: "",
        role_required: "",
        status: "pending",
    });

    const loadAll = async () => {
        const [b, e, s] = await Promise.all([
            api.get("/bookings"),
            api.get("/employees"),
            api.get("/sites"),
        ]);

        setBookings(b.data || []);
        setEmployees(e.data || []);
        setSites(s.data || []);
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openAdd = () => {
        setForm({
            id: "",
            employee_id: "",
            site_id: "",
            start_time: "",
            end_time: "",
            role_required: "",
            status: "pending",
        });
        setIsEditing(false);
        setFormOpen(true);
    };

    const openEdit = (b: any) => {
        setForm({
            id: b.id,
            employee_id: b.employee_id,
            site_id: b.site_id,
            start_time: b.start_time,
            end_time: b.end_time,
            role_required: b.role_required,
            status: b.status,
        });
        setIsEditing(true);
        setFormOpen(true);
    };

    const submit = async () => {
        if (!form.employee_id || !form.site_id || !form.start_time || !form.end_time) {
            alert("Fill all required fields");
            return;
        }

        const conflict = await api.post("/bookings/check_conflict", {
            employee_id: form.employee_id,
            start_time: form.start_time,
            end_time: form.end_time,
        });

        if (conflict.data && conflict.data.conflicts.length > 0) {
            if (!window.confirm("Conflict found. Still continue?")) return;
        }

        if (isEditing) {
            await api.put(`/bookings/${form.id}`, form);
        } else {
            await api.post("/bookings", form);
        }

        setFormOpen(false);
        loadAll();
    };

    const cancelBooking = async (id: number) => {
        if (!window.confirm("Cancel booking?")) return;
        await api.post(`/bookings/${id}/cancel`);
        loadAll();
    };

    // Calendar formatting
    const events = bookings.map((b) => ({
        id: b.id,
        title: `${b.employee_name || "Employee"} @ ${b.site_name || "Site"}`,
        start: new Date(b.start_time),
        end: new Date(b.end_time),
        allDay: false,
        resource: b,
    }));

    const handleSelectEvent = (event: any) => {
        openEdit(event.resource);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="w-7 h-7 text-indigo-600" />
                        <h1 className="text-2xl font-bold">Bookings</h1>
                    </div>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Add Booking
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b pb-2 mb-4">
                    <button
                        onClick={() => setTab("calendar")}
                        className={`pb-2 ${tab === "calendar"
                            ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                            : "text-gray-500"
                            }`}
                    >
                        Calendar View
                    </button>
                    <button
                        onClick={() => setTab("table")}
                        className={`pb-2 ${tab === "table"
                            ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                            : "text-gray-500"
                            }`}
                    >
                        Table View
                    </button>
                </div>

                {/* Calendar View */}
                {tab === "calendar" && (
                    <div className="bg-white p-4 rounded shadow border border-gray-200">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            onSelectEvent={handleSelectEvent}
                        />
                    </div>
                )}

                {/* Table View */}
                {tab === "table" && (
                    <div className="bg-white shadow border border-gray-200 rounded">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left">Employee</th>
                                    <th className="p-3 text-left">Site</th>
                                    <th className="p-3 text-center">Start</th>
                                    <th className="p-3 text-center">End</th>
                                    <th className="p-3 text-center">Status</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b.id} className="border-t">
                                        <td className="p-3">{b.employee_name}</td>
                                        <td className="p-3">{b.site_name}</td>
                                        <td className="p-3 text-center">{b.start_time}</td>
                                        <td className="p-3 text-center">{b.end_time}</td>
                                        <td className="p-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${b.status === "confirmed"
                                                        ? "bg-green-100 text-green-700"
                                                        : b.status === "cancelled"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>

                                        <td className="p-3 flex justify-center gap-2">
                                            <button
                                                onClick={() => openEdit(b)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => cancelBooking(b.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {bookings.length === 0 && (
                            <p className="text-center text-gray-500 py-5">
                                No bookings found.
                            </p>
                        )}
                    </div>
                )}
            </main>

            {/* Modal */}
            {formOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded shadow">
                        <div className="p-4 border-b">
                            <h2 className="font-bold text-xl">
                                {isEditing ? "Edit Booking" : "Add Booking"}
                            </h2>
                        </div>

                        <div className="p-4 space-y-3">

                            {/* Employee */}
                            <div>
                                <label className="block text-sm mb-1 font-medium">Employee</label>
                                <select
                                    name="employee_id"
                                    value={form.employee_id}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((e) => (
                                        <option key={e.id} value={e.user_id}>
                                            {e.name} ({e.trade})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Site */}
                            <div>
                                <label className="block text-sm mb-1 font-medium">Site</label>
                                <select
                                    name="site_id"
                                    value={form.site_id}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">Select Site</option>
                                    {sites.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm mb-1 font-medium">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={form.start_time}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm mb-1 font-medium">End Time</label>
                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={form.end_time}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            {/* Role Required */}
                            <div>
                                <label className="block text-sm mb-1 font-medium">
                                    Required Role (optional)
                                </label>
                                <input
                                    name="role_required"
                                    value={form.role_required}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <button
                                onClick={() => setFormOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
