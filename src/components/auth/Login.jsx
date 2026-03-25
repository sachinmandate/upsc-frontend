import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import Navbar from "../layout/Navbar";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.loginStudent(email, password);

      // Store user data and token in context
      login(
        {
          role: "student",
          studentId: response.studentId,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
        },
        response.token
      );

      // Redirect to dashboard or onboarding
      const hasSelectedSubjects = localStorage.getItem("selectedSubjects");
      navigate(hasSelectedSubjects ? "/dashboard/student" : "/onboarding/subjects");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#fdfbf7]">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm p-4 sm:p-10 mt-16 relative">
          
          <div className="absolute -top-12 left-0 right-0 flex justify-center sm:justify-end px-2">
            <Link 
              to="/register" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              No account? <span className="text-amber-600 underline decoration-2 underline-offset-4">Sign Up</span>
            </Link>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-50/50 border border-slate-200 flex items-center justify-center text-[#d97706]">
              <ShieldCheck size={32} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Login to MPSC–UPSC Portal
          </h1>

          <p className="text-center text-slate-600 mb-8 max-w-[280px] mx-auto leading-relaxed text-sm italic">
            "Access your existing account securely."
          </p>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>

              <div className="relative">
                {email === "" && (
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                )}

                <input
                  className={`input ${email === "" ? "pl-12" : "pl-4"}`}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-slate-400 hover:text-slate-800 transition-all underline decoration-dotted"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                {password === "" && (
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                )}

                <input
                  className={`input ${password === "" ? "pl-12" : "pl-4"} pr-12`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded-sm border-slate-300 accent-slate-800 cursor-pointer"
                disabled={loading}
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-600 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <span className="relative px-4 bg-white text-xs font-bold uppercase tracking-widest text-slate-300">
                Institutional Access
              </span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="btn-secondary w-full flex items-center justify-center gap-3"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4 grayscale opacity-70"
                alt="Google"
              />
              <span>Continue with Google</span>
            </button>

            {/* Register */}
            <p className="text-center text-sm text-slate-500 pt-6">
              New here?{" "}
              <Link
                to="/register"
                className="text-slate-800 font-bold hover:underline"
              >
                Register an account
              </Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
