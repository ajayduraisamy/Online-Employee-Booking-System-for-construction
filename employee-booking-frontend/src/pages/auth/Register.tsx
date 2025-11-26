import { useState } from "react";
import { api } from "../../api/axios";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Loader2,
    Star,
    CheckCircle,
    ArrowRight
} from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("employee");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const submit = async () => {
        setError("");

        if (!name || !email || !password || !confirm) {
            setError("All fields are required");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await api.post("/register", {
                name,
                email,
                password,
                role,
            });

            alert("Registration successful!");
            window.location.href = "/";

        } catch (e: any) {
            setError(e.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Floating Stars */}
            <div className="absolute top-20 left-20 animate-pulse">
                <Star className="text-yellow-400/20 w-6 h-6" />
            </div>
            <div className="absolute bottom-32 right-24 animate-pulse delay-300">
                <Star className="text-blue-400/20 w-4 h-4" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card with Glass Morphism Effect */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">

                    {/* Premium Header with Gradient */}
                    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 pb-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                                <ShieldCheck className="text-white w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                                Join Our Platform
                            </h1>
                            <p className="text-white/80 text-sm mt-2 font-light">
                                Create your account and unlock premium features
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 pt-6 bg-gradient-to-b from-white/5 to-transparent">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 mb-6 rounded-xl backdrop-blur-sm animate-shake">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Full Name */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-purple-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/40 font-medium"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-blue-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/40 font-medium"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Role Select */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Role
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-indigo-400 transition-colors">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <select
                                        className="w-full pl-10 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white font-medium appearance-none cursor-pointer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="employee" className="bg-slate-800 text-white">Employee</option>
                                        <option value="manager" className="bg-slate-800 text-white">Manager</option>
                                        <option value="admin" className="bg-slate-800 text-white">Admin</option>
                                        <option value="client" className="bg-slate-800 text-white">Client</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-white/50">
                                        <svg className="w-4 h-4 fill-current transition-transform group-focus-within:rotate-180" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-amber-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="w-full pl-10 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/40 font-medium"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-amber-400 transition-all duration-300 hover:scale-110"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-green-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/40 font-medium"
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-white/80 text-sm font-medium">Premium Features Included</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                        Secure Storage
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                        24/7 Support
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                        Advanced Analytics
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                        Team Collaboration
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] text-white font-semibold py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group/btn mt-2 border border-white/20"
                                onClick={submit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Create Premium Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Footer / Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-white/60 text-sm">
                                Already have an account?{" "}
                                <a
                                    href="/"
                                    className="text-white font-semibold hover:text-purple-300 hover:underline transition-all duration-300 inline-flex items-center gap-1 group/link"
                                >
                                    Sign In
                                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}