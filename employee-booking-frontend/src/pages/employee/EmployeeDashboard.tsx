import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function EmployeeDashboard() {
    const [data, setData] = useState<any>({});

    useEffect(() => {
        api.get("/employee/dashboard").then(res => setData(res.data));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">My Dashboard</h1>

            <h2 className="text-lg mt-5 font-semibold">Today's Shifts</h2>
            <ul className="ml-5 list-disc">
                {data.today_shifts?.map((shift: any) => (
                    <li key={shift.id}>
                        {shift.start_time} → {shift.end_time}
                    </li>
                ))}
            </ul>

            <h2 className="text-lg mt-5 font-semibold">Payments</h2>
            <ul className="ml-5 list-disc">
                {data.payments?.map((p: any) => (
                    <li key={p.id}>
                        {p.amount} — {p.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}
