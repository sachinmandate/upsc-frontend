import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../layout/Navbar";
import { User, Mail, Lock, Phone, MapPin, Building, Eye, EyeOff, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [role, setRole] = useState("student");
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    district: "",
    taluka: "",
    city: "",
    organization: "",
    examId: ""
  });

  useEffect(() => {
    const fetchExams = async () => {
        try {
            const response = await fetch('/api/public/exams');
            if (response.ok) {
                const data = await response.json();
                setExams(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, examId: data[0].id.toString() }));
                }
            }
        } catch (error) {
            console.error("Failed to fetch exams", error);
        }
    };
    fetchExams();
  }, []);

  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      let dataToSend;
      if (role === 'teacher') {
        const { confirmPassword, examId, ...teacherData } = formData;
        dataToSend = teacherData;
      } else {
        dataToSend = formData;
      }
      
      const result = await register(dataToSend, role);

      if (result.success) {
        if (role === 'teacher') {
          toast.success("Registration request sent! Please wait for admin approval.");
          setIsSuccess(true);
        } else {
          toast.success("Account created successfully! Please login.");
          navigate("/login");
        }
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-10 mt-16 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
              <Clock size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Registration Received</h1>
            <p className="text-slate-600 mb-8">
              Thank you for applying. Your account is currently <strong>waiting for admin approval</strong>.
            </p>
            <button onClick={() => navigate("/login")} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
              Return to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 py-24">
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100/50 mt-12 relative">
          
          {/* Left Decorative Side */}
          <div className="hidden md:flex flex-col justify-between w-[40%] bg-slate-900 p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-amber-500/20">
                <BookOpen size={28} className="text-slate-900" />
              </div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">Start your journey with us.</h2>
              <p className="text-slate-400 leading-relaxed text-base opacity-90">
                Comprehensive learning platform for UPSC and MPSC exams.
              </p>
            </div>
            
            <div className="relative z-10 mt-16">
              <p className="text-sm font-semibold text-slate-300">Your path to success begins here.</p>
            </div>

            {/* Background design patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800 rounded-full blur-[80px] -mr-48 -mt-48 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-900/40 rounded-full blur-[80px] -ml-20 -mb-20"></div>
          </div>

          {/* Right Form Side */}
          <div className="w-full md:w-[60%] p-8 sm:p-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-sm text-slate-500 mt-2 font-medium">Already have an account? <Link to="/login" className="text-amber-600 font-bold hover:underline transition-colors">Sign in</Link></p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-7">
              
              {/* Role Toggle */}
              <div className="p-1.5 bg-slate-100 rounded-xl flex border border-slate-200/60 shadow-inner">
                <button 
                  type="button" 
                  onClick={() => setRole("student")}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${role === 'student' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Student
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole("teacher")}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${role === 'teacher' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Teacher
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
                {/* Personal Info */}
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="John" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="Doe" required disabled={loading} />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="john@example.com" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="mobile" value={formData.mobile} onChange={handleChange} type="tel" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="9876543210" required disabled={loading} />
                  </div>
                </div>

                {/* Location Info */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">District</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="district" value={formData.district} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="E.g. Pune" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-1 border border-transparent">
                  <div className="flex gap-3">
                    <div className="w-1/2 space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Taluka</label>
                      <input name="taluka" value={formData.taluka} onChange={handleChange} placeholder="Taluka" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" required disabled={loading} />
                    </div>
                    <div className="w-1/2 space-y-2">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
                       <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" required disabled={loading} />
                    </div>
                  </div>
                </div>

                {/* Role Specific */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{role === 'student' ? 'College / School' : 'Organization'}</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="organization" value={formData.organization} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder={role === 'student' ? "School/College Name" : "Department/Organization"} required disabled={loading} />
                  </div>
                </div>
                {role === "student" && exams.length > 0 && (
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Exam (Optional)</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select name="examId" value={formData.examId} onChange={handleChange} className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium appearance-none cursor-pointer" disabled={loading}>
                        <option value="">Select an Exam</option>
                        {exams.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Info */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="••••••••" required disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showConfirmPassword ? "text" : "password"} className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium" placeholder="••••••••" required disabled={loading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-75 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] active:scale-[0.98] flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : "Create Account"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;
