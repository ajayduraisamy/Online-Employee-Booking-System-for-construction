import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../api/axios";
import { BarChart2, FileText } from "lucide-react";

export default function Reports() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [tab, setTab] = useState("utilization");

    const [utilization, setUtilization] = useState<any[]>([]);
    const [labourCost, setLabourCost] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [certExpiry, setCertExpiry] = useState<any[]>([]);

    const loadData = async () => {
        const util = await api.get("/reports/utilization");
        const cost = await api.get("/reports/labour_cost_by_project");
        const att = await api.get("/reports/attendance_summary");
        const cert = await api.get("/reports/cert_expiry");

        setUtilization(util.data.utilization || []);
        setLabourCost(cost.data.labour_cost_by_project || []);
        setAttendance(att.data.attendance || []);
        setCertExpiry(cert.data.certificates || []);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <BarChart2 className="w-7 h-7 text-indigo-600" />
                        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-4 border-b pb-2 mb-6">
                    <TabButton title="Utilization" tab="utilization" activeTab={tab} setTab={setTab} />
                    <TabButton title="Labour Cost" tab="labour" activeTab={tab} setTab={setTab} />
                    <TabButton title="Attendance" tab="attendance" activeTab={tab} setTab={setTab} />
                    <TabButton title="Certificate Expiry" tab="certs" activeTab={tab} setTab={setTab} />
                </div>

                {/* UTILIZATION TABLE */}
                {tab === "utilization" && (
                    <TableCard title="Employee Utilization" columns={["Employee ID", "Total Hours"]}>
                        {utilization.map((u, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3">{u.employee_id}</td>
                                <td className="p-3">{u.total_hours}</td>
                            </tr>
                        ))}
                    </TableCard>
                )}

                {/* LABOUR COST */}
                {tab === "labour" && (
                    <TableCard title="Labour Cost by Project" columns={["Site ID", "Project Name", "Total Cost"]}>
                        {labourCost.map((c, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3">{c.site_id}</td>
                                <td className="p-3">{c.site_name}</td>
                                <td className="p-3">₹{c.labour_cost}</td>
                            </tr>
                        ))}
                    </TableCard>
                )}

                {/* ATTENDANCE SUMMARY */}
                {tab === "attendance" && (
                    <TableCard
                        title="Attendance Summary"
                        columns={["Employee ID", "Days Present", "Total Hours"]}>

                        {attendance.map((a, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3">{a.employee_id}</td>
                                <td className="p-3">{a.days_present}</td>
                                <td className="p-3">{a.total_hours}</td>
                            </tr>
                        ))}
                    </TableCard>
                )}

                {/* CERTIFICATE EXPIRY */}
                {tab === "certs" && (
                    <TableCard
                        title="Certificates Expiring / Expired"
                        columns={["User ID", "Employee", "Document Type", "Expiry Date"]}>

                        {certExpiry.map((c, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3">{c.user_id}</td>
                                <td className="p-3">{c.name}</td>
                                <td className="p-3">{c.doc_type}</td>
                                <td className="p-3">{c.expiry_date}</td>
                            </tr>
                        ))}
                    </TableCard>
                )}
            </main>
        </div>
    );
}

function TabButton({ title, tab, activeTab, setTab }: any) {
    return (
        <button
            onClick={() => setTab(tab)}
            className={`pb-2 ${activeTab === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                    : "text-gray-500"
                }`}
        >
            {title}
        </button>
    );
}

function TableCard({ title, columns, children }: any) {
    return (
        <div className="bg-white shadow rounded border border-gray-200">
            <div className="p-4 border-b flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold">{title}</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((c: string) => (
                                <th key={c} className="p-3 text-left">{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
