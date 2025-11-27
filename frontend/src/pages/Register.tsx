import { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { Eye, EyeOff, User, Mail, Lock, Phone, Briefcase, Sparkles } from "lucide-react";

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    skills: string;
}

export default function Register() {
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
        role: "client",
        phone: "",
        skills: ""
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRegister = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await api.post("/register", form);
            alert("Registered successfully. Please login.");
            window.location.href = "/login";
        } catch {
            alert("Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            handleRegister();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4000ms' }}></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1000ms' }}></div>

            <div className="relative w-full max-w-md px-6">
                {/* Header with Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-30"></div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Join Our Platform
                    </h1>
                    <p className="text-slate-400 text-sm">Create your account and get started</p>
                </div>

                {/* Registration Card */}
                <div className="bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative overflow-hidden">
                    {/* Card Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-20"></div>

                    <div className="relative space-y-6">
                        {/* Name Field */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                name="name"
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                value={form.name}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                value={form.email}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                value={form.password}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Role Select */}
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                            <select
                                name="role"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                onChange={handleInputChange}
                                value={form.role}
                            >
                                <option value="client">Client</option>
                                <option value="manager">Manager</option>
                                <option value="employee">Employee</option>
                                <option value="admin">Administrator</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                name="phone"
                                placeholder="Phone Number"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                value={form.phone}
                            />
                        </div>

                        {/* Skills Field */}
                        <div className="relative">
                            <input
                                name="skills"
                                placeholder="Skills (comma separated)"
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                value={form.skills}
                            />
                        </div>

                        {/* Register Button */}
                        <button
                            onClick={handleRegister}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-slate-400 text-sm pt-4 border-t border-slate-700/50">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200 hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-slate-500 text-xs">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}