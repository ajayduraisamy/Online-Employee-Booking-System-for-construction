import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../api/axios";
import { Users, FileText, FolderKanban, Clock } from "lucide-react";

export default function ManagerDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [data, setData] = useState<any>({});

    useEffect(() => {
        api.get("/manager/dashboard").then((res) => setData(res.data));
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar role="manager" open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className={`flex-1 p-6 transition-all ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Manager Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <Card
                        icon={<Users className="w-8 h-8 text-blue-600" />}
                        title="Total Employees"
                        value={data.availability_list?.length || 0}
                    />

                    <Card
                        icon={<FolderKanban className="w-8 h-8 text-purple-600" />}
                        title="Pending Requests"
                        value={data.pending_requests?.length || 0}
                    />

                    <Card
                        icon={<FileText className="w-8 h-8 text-green-600" />}
                        title="Documents"
                        value={data.documents?.length || 0}
                    />

                    <Card
                        icon={<Clock className="w-8 h-8 text-orange-500" />}
                        title="Payments"
                        value={data.payments?.length || 0}
                    />
                </div>

                {/* Employee Availability Table */}
                <div className="mt-10 bg-white shadow rounded-lg border p-5">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Employee Availability</h2>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="p-3">Name</th>
                                <th className="p-3">Trade</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Rate</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.availability_list?.map((emp: any, i: number) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{emp.name}</td>
                                    <td className="p-3">{emp.trade}</td>
                                    <td className="p-3 capitalize">{emp.status}</td>
                                    <td className="p-3">₹{emp.hourly_rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}

function Card({ icon, title, value }: any) {
    return (
        <div className="bg-white p-6 shadow rounded-lg border flex items-center gap-4">
            <div>{icon}</div>
            <div>
                <p className="text-gray-600 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
}
