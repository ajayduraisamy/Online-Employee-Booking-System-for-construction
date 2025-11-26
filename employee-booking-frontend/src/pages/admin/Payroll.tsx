import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { api } from "../../api/axios";
import { Download, Calculator } from "lucide-react";

export default function Payroll() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [payroll, setPayroll] = useState<any[]>([]);
    const [error, setError] = useState("");

    const calculate = async () => {
        setError("");
        if (!start || !end) {
            setError("Please select start and end dates (YYYY-MM-DD).");
            return;
        }
        setLoading(true);
        try {
            const res = await api.get("/payroll/calculate", { params: { start, end } });
            setPayroll(res.data.payroll || []);
        } catch (err: any) {
            console.error("Payroll calculate error", err);
            setError(err?.response?.data?.error || "Failed to calculate payroll.");
            setPayroll([]);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = async () => {
        if (!start || !end) {
            setError("Please select start and end dates before exporting.");
            return;
        }
        setError("");
        try {
            // request blob from backend and download
            const res = await api.get("/payroll/export", {
                params: { start, end },
                responseType: "blob",
            });
            const blob = new Blob([res.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `payroll_${start}_to_${end}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed", err);
            setError("Failed to export CSV. Check server logs.");
        }
    };

    const totalSummary = payroll.reduce(
        (acc, row) => {
            acc.base += Number(row.base || 0);
            acc.overtime_pay += Number(row.overtime_pay || 0);
            acc.total += Number(row.total || 0);
            return acc;
        },
        { base: 0, overtime_pay: 0, total: 0 }
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Calculator className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-2xl font-bold">Payroll</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm">Start</label>
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="border px-3 py-2 rounded"
                        />
                        <label className="text-sm">End</label>
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="border px-3 py-2 rounded"
                        />

                        <button
                            onClick={calculate}
                            disabled={loading}
                            className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            {loading ? "Calculating..." : "Calculate"}
                        </button>

                        <button
                            onClick={exportCSV}
                            className="ml-2 inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Employee ID</th>
                                <th className="p-3 text-right">Hours</th>
                                <th className="p-3 text-right">Overtime</th>
                                <th className="p-3 text-right">Hourly Rate</th>
                                <th className="p-3 text-right">Base Pay</th>
                                <th className="p-3 text-right">Overtime Pay</th>
                                <th className="p-3 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payroll.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-6 text-center text-gray-500">
                                        No payroll data. Pick a date range and click Calculate.
                                    </td>
                                </tr>
                            )}

                            {payroll.map((r: any) => (
                                <tr key={r.employee_id} className="border-t">
                                    <td className="p-3">{r.employee_id}</td>
                                    <td className="p-3 text-right">{r.hours}</td>
                                    <td className="p-3 text-right">{r.overtime}</td>
                                    <td className="p-3 text-right">{r.hourly_rate}</td>
                                    <td className="p-3 text-right">₹{Number(r.base || 0).toFixed(2)}</td>
                                    <td className="p-3 text-right">₹{Number(r.overtime_pay || 0).toFixed(2)}</td>
                                    <td className="p-3 text-right font-semibold">₹{Number(r.total || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>

                        {payroll.length > 0 && (
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td className="p-3 font-semibold">TOTAL</td>
                                    <td className="p-3" />
                                    <td className="p-3" />
                                    <td className="p-3" />
                                    <td className="p-3 text-right font-semibold">₹{totalSummary.base.toFixed(2)}</td>
                                    <td className="p-3 text-right font-semibold">₹{totalSummary.overtime_pay.toFixed(2)}</td>
                                    <td className="p-3 text-right font-semibold">₹{totalSummary.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </main>
        </div>
    );
}
