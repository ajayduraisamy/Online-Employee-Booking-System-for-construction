import { useState } from "react";
import { api } from "../../api/axios";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    User,
    Shield,
    Building,
    Users,
    Star
} from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/login", { email, password });
            const role = res.data.user.role;

            // Smooth redirect with loading state
            setTimeout(() => {
                if (role === "admin") window.location.href = "/admin";
                else if (role === "manager") window.location.href = "/manager";
                else if (role === "employee") window.location.href = "/employee";
                else if (role === "client") window.location.href = "/client";

            }, 1000);

        } catch (err) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            submit();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-4 relative overflow-hidden">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating Icons */}
            <div className="absolute top-20 left-20 animate-bounce">
                <Shield className="text-blue-400/20 w-8 h-8" />
            </div>
            <div className="absolute bottom-32 right-24 animate-bounce delay-300">
                <Users className="text-purple-400/20 w-6 h-6" />
            </div>
            <div className="absolute top-40 right-40 animate-bounce delay-700">
                <Building className="text-indigo-400/20 w-7 h-7" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Main Card with Glass Effect */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">

                
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 pb-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 transform hover:rotate-12 transition-transform duration-300">
                                <User className="text-white w-10 h-10" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-white/80 text-sm mt-2 font-light">
                                Sign in to your  account
                            </p>
                        </div>
                    </div>

                    
                    <div className="p-8 pt-6 bg-gradient-to-b from-white/5 to-transparent">
                    
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 mb-6 rounded-xl backdrop-blur-sm animate-shake">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Email Input */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-blue-400 transition-colors duration-300">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/40 font-medium"
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="group">
                                <label className="text-white/70 text-xs font-medium uppercase tracking-wider mb-2 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-amber-400 transition-colors duration-300">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 backdrop-blur-sm transition-all duration-300 text-white placeholder-white/40 font-medium"
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-amber-400 transition-all duration-300 hover:scale-110"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            
                            {/* Role Benefits */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-white/80 text-sm font-medium">Role-Based Access</span>
                                </div>

                                <div className="grid grid-cols-4 gap-4 text-center">
                                    <div className="text-white/60">
                                        <Building className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                                        <span className="text-xs">Admin</span>
                                    </div>

                                    <div className="text-white/60">
                                        <Users className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                                        <span className="text-xs">Client</span>
                                    </div>

                                    <div className="text-white/60">
                                        <Users className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                                        <span className="text-xs">Manager</span>
                                    </div>

                                    <div className="text-white/60">
                                        <User className="w-6 h-6 mx-auto mb-1 text-green-400" />
                                        <span className="text-xs">Employee</span>
                                    </div>
                                </div>
                            </div>


                            {/* Login Button */}
                            <button
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] text-white font-semibold py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group/btn border border-white/20 relative overflow-hidden"
                                onClick={submit}
                                disabled={loading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>

                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Dashboard</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Footer / Register Link */}
                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-white font-semibold hover:text-cyan-300 hover:underline transition-all duration-300 inline-flex items-center gap-1 group/link"
                                >
                                    Create Account
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