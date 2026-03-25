import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../layout/Navbar";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);

        const result = await login(email, password, 'admin');

        if (result.success) {
            toast.success("Admin login successful!");
            navigate("/admin/dashboard");
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />

            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#fdfbf7]">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-10 mt-16 relative">

                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-red-50 border border-slate-200 rounded-xl flex items-center justify-center text-red-600">
                            <ShieldCheck size={32} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
                        Admin Portal
                    </h1>

                    <p className="text-center text-slate-500 mb-8 max-w-[280px] mx-auto leading-relaxed text-sm italic">
                        "Secure access for administrators."
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    className="w-full h-11 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 border border-slate-300 rounded-md bg-white outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    type="text"
                                    placeholder="Enter admin email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    className="w-full h-11 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 border border-slate-300 rounded-md bg-white outline-none transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 mt-4"
                        >
                            {loading ? "Authenticating..." : "Login to Admin Portal"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
