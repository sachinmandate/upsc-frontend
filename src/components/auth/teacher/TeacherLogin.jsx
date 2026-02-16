import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../layout/Navbar";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ role: "teacher", email: email.trim() || "teacher" });
    navigate("/teacher/dashboard");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#fdfbf7]">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-10 mt-16 relative">

          <div className="absolute -top-12 left-0 right-0 flex justify-center sm:justify-end px-2">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              Not a teacher? <span className="text-amber-600 underline decoration-2 underline-offset-4">Student Login</span>
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-50 border border-slate-200 rounded-xl flex items-center justify-center text-[#d97706]">
              <GraduationCap size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Teacher Login
          </h1>

          <p className="text-center text-slate-500 mb-8 max-w-[280px] mx-auto leading-relaxed text-sm italic">
            "Access your teacher dashboard securely."
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
                  className="w-full h-11 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 border border-slate-300 rounded-md bg-white outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-400 hover:text-slate-800 transition-all underline decoration-dotted underline-offset-2"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  className="w-full h-11 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 border border-slate-300 rounded-md bg-white outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember-teacher"
                className="w-4 h-4 rounded border-slate-300 accent-amber-600 cursor-pointer"
              />
              <label
                htmlFor="remember-teacher"
                className="text-sm text-slate-600 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              Sign In as Teacher
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <span className="relative px-4 bg-white text-xs font-bold uppercase tracking-widest text-slate-300">
                Institutional Access
              </span>
            </div>

            <button
              type="button"
              className="w-full h-11 bg-white text-slate-700 text-sm font-semibold border border-slate-300 rounded-md hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4 grayscale opacity-70"
                alt="Google"
              />
              <span>Continue with Google</span>
            </button>

            <div className="text-center border-t border-slate-200 pt-5">
              <p className="text-sm text-slate-500 mb-2">Are you a student?</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 underline decoration-2 underline-offset-4 transition-colors"
              >
                ← Login as Student
              </Link>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default TeacherLogin;