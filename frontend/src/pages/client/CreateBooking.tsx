import { useState } from "react";
import { api } from "../../api/axios";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    MapPin,
    DollarSign,
    PenTool,
    Type,
    FileText,
    Loader2
} from "lucide-react";

export default function CreateBooking() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        required_skills: "",
        start_date: "",
        end_date: "",
        budget: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/bookings", form);
            // Optional: You could use a toast notification library here instead of alert
            alert("Booking Submitted!");
            navigate("/dashboard/client");
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    // Helper to update state cleanly
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex-1 bg-slate-50 min-h-screen p-8 lg:p-12 font-sans">

            {/* Page Header */}
            <div className="mb-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900">Create New Booking</h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Fill in the details below to request a new project.
                </p>
            </div>

            {/* Card Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                {/* Decorative Gradient Top Bar */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full"></div>

                <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">

                    {/* --- Title Section --- */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Type size={16} className="text-indigo-500" /> Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Building Name"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    {/* --- Description Section --- */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" /> Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe project requirements in detail..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400 resize-none"
                        />
                    </div>

                    {/* --- Grid for Details --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <MapPin size={16} className="text-indigo-500" /> Location
                            </label>
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Bangalore"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <DollarSign size={16} className="text-green-500" /> Budget (₹)
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                placeholder="e.g. 15000"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <PenTool size={16} className="text-purple-500" /> Required Skills
                        </label>
                        <input
                            name="required_skills"
                            value={form.required_skills}
                            onChange={handleChange}
                            placeholder="e.g. Masonry, Plumbing, Electrical Work, Roofing, Civil Engineering"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-500" /> Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={form.start_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar size={16} className="text-orange-500" /> End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={form.end_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all duration-200"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {loading ? "Submitting..." : "Submit Booking"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}