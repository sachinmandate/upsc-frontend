import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import { BookOpen, Target, Users, Award, CheckCircle, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/dashboard/student');
    } else {
      navigate('/role-selection');
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-screen font-sans text-slate-900 pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32 px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-[#fdfbf7] to-[#fdfbf7]"></div>
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest mb-8 border border-amber-200">
            <Award size={14} />
            <span>For Civil Services</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 font-serif mb-6 leading-tight">
            Master Your <span className="text-amber-600">MPSC & UPSC</span> <br className="hidden sm:block" /> Journey With Us
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-600 max-w-2xl mx-auto italic mb-10">
            Access study material, live video lectures, mock tests, and connect with expert teachers to secure your success in civil services examinations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleStartLearning}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-sm shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 border border-slate-900"
            >
              Start Learning Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Award className="text-slate-900" size={24} />
            <span className="font-bold text-lg text-slate-900 tracking-tight font-serif uppercase">
              MPSC–UPSC Portal
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
         
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Terms</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Privacy</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
