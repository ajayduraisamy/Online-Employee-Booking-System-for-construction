import { useState } from "react";
import { api } from "../api/axios";

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);

    const login = async (email: string, password: string) => {
        const res = await api.post("/login", { email, password });
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        await api.post("/logout");
        setUser(null);
    };

    return { user, login, logout };
};
