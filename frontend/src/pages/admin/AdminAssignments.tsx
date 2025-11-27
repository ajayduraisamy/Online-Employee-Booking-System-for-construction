import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import { Search, Trash2, MapPin, Users, Calendar, Navigation, User, Clock, AlertCircle } from "react-feather";
import type { AxiosError } from "axios";

type Assignment = {
    id: number;
    project_id: number;
    employee_id: number;
    assigned_by: number;
    role_desc?: string;
    start_date?: string;
    end_date?: string;
    status: string;

    // extra joined fields
    employee_name?: string;
    project_name?: string;
    booking_location?: string;
    booking_title?: string;
};

export default function AdminAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [deleting, setDeleting] = useState<Assignment | null>(null);

    // Admin GPS
    const [myLat, setMyLat] = useState<number | null>(null);
    const [myLng, setMyLng] = useState<number | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("GPS not supported.");
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            pos => {
                setMyLat(pos.coords.latitude);
                setMyLng(pos.coords.longitude);
                setLocationLoading(false);
            },
            err => {
                console.error(err);
                setLocationLoading(false);
            }
        );
    };

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/assignments/all"); // ADMIN ENDPOINT
            setAssignments(res.data);
        } catch (err) {
            const error = err as AxiosError;
            alert((error.response?.data as any)?.msg || "Failed to load assignments");
        }
        setLoading(false);
    };

    useEffect(() => {
        load();
        getLocation();
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return assignments.filter((a) =>
            `${a.project_name} ${a.employee_name} ${a.role_desc}`.toLowerCase().includes(q)
        );
    }, [assignments, query]);

    const deleteAssignment = async () => {
        if (!deleting) return;
        await api.delete(`/assignments/${deleting.id}`);
        setDeleting(null);
        load();
    };

    // Map URLs
    const mapUrl = (loc: string) =>
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc)}`;

    const distanceUrl = (loc: string) => {
        if (!myLat || !myLng) return mapUrl(loc);
        return `https://www.google.com/maps/dir/${myLat},${myLng}/${encodeURIComponent(loc)}`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    {
        locationLoading && (
            <div className="text-blue-600 text-sm mb-2">Fetching admin location...</div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Assignments Management
                        </h1>
                        <p className="text-gray-600">Manage and track all employee assignments</p>
                    </div>
                    <div className="flex items-center gap-4">
                        
                        <button
                            onClick={load}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>


            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Search assignments by project, employee, role..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg border">
                        {filtered.length} results
                    </div>
                </div>
            </div>

            {/* Assignments Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or create new assignments.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filtered.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {a.booking_title || `Assignment #${a.id}`}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1">ID: {a.id}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(a.status)}`}>
                                        {a.status}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        
                                        <div>
                                            <p className="text-sm text-gray-600">Project</p>
                                            <p className="font-semibold text-gray-800">{a.project_name || a.project_id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-green-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Employee</p>
                                            <p className="font-semibold text-gray-800">
                                                {a.employee_name || `#${a.employee_id}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-purple-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">Start Date</p>
                                            <p className="font-semibold text-gray-800">{formatDate(a.start_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        <div>
                                            <p className="text-sm text-gray-600">End Date</p>
                                            <p className="font-semibold text-gray-800">{formatDate(a.end_date)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Role Description */}
                                {a.role_desc && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-1">Role Description</p>
                                        <p className="text-gray-800 bg-gray-50 rounded-lg p-3 border">
                                            {a.role_desc}
                                        </p>
                                    </div>
                                )}

                                {/* Location Section */}
                                {a.booking_location && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                        </p>
                                        <div className="flex gap-2">
                                            <a
                                                href={mapUrl(a.booking_location)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-center"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                View on Map
                                            </a>
                                            <a
                                                href={distanceUrl(a.booking_location)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-center"
                                            >
                                                <Navigation className="w-4 h-4" />
                                                Get Directions
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setDeleting(a)}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Assignment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Modal */}
            {deleting && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in-90 zoom-in-90">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Delete Assignment?
                            </h3>
                            <p className="text-gray-600 mb-2">
                                You're about to delete assignment <span className="font-semibold">#{deleting.id}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone and will permanently remove this assignment.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleting(null)}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteAssignment}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                            >
                                Delete Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}