import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { GraduationCap, Briefcase, ShieldCheck, ChevronRight } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#fdfbf7]">
        <div className="w-full max-w-3xl bg-white border border-slate-200 shadow-sm p-8 sm:p-12 mt-16 relative">
          
          <div className="max-w-xl mx-auto text-center py-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-3 font-serif">Join the Platform</h1>
            <p className="text-slate-500 mb-10 text-sm leading-relaxed">Select your appropriate portal role to continue with your secure login or registration process.</p>

            <div className="grid gap-4">
              <button
                onClick={() => navigate("/login")}
                className="group flex items-center justify-between p-6 border border-slate-200 rounded-sm hover:border-slate-800 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-sm flex items-center justify-center text-amber-600 border border-amber-100">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Student</h3>
                    <p className="text-xs text-slate-500 mt-1">Access rigorous exam prep and premium material.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
              </button>

              <button
                onClick={() => navigate("/teacher/login")}
                className="group flex items-center justify-between p-6 border border-slate-200 rounded-sm hover:border-slate-800 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-sm flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Teacher</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage classrooms, courses, and mentor students.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
              </button>

              <button
                onClick={() => navigate("/admin/login")}
                className="group flex items-center justify-between p-6 border border-slate-200 rounded-sm hover:border-slate-800 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-sm flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Admin</h3>
                    <p className="text-xs text-slate-500 mt-1">Platform administration and analytics control.</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-800 transition-colors" />
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link to="/" className="text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors underline decoration-dotted underline-offset-4">
                Return to Home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelection;
