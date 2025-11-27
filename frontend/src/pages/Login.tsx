import { useState } from "react";
import { api } from "../api/axios";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginForm {
    email: string;
    password: string;
}

interface User {
    id: string;
    email: string;
    role: string;
    name: string;
}

interface LoginResponse {
    user: User;
    token: string;
}

export default function Login() {
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginForm>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginForm> = {};

        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 5) {
            newErrors.password = "Password must be at least 5 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const res = await api.post<LoginResponse>("/login", form);

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);

            // Smooth redirect with slight delay for better UX
            setTimeout(() => {
                window.location.href = `/dashboard/${res.data.user.role}`;
            }, 500);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Invalid credentials";
            setErrors({ email: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
                    <div className="text-center">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">⚡</span>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to your account to continue
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                onKeyPress={handleKeyPress}
                                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-600 text-sm flex items-center">
                                <span className="mr-1">⚠</span> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                        
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onKeyPress={handleKeyPress}
                                className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 text-sm flex items-center">
                                <span className="mr-1">⚠</span> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Signing in...
                            </div>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                </div>

                {/* Footer */}
                
            </div>
        </div>
    );
}