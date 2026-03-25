import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  MessageSquare,
  CalendarCheck,
  Star,
  Clock,
  Circle,
  User,
} from "lucide-react";

const ConnectTeachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await studentApi.fetchTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Connect with Teachers</h1>
        <p className="text-sm text-slate-500">Get guidance from experienced faculty members</p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center shrink-0">
            <MessageSquare size={22} className="text-indigo-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 mb-0.5">Live Chat</p>
            <p className="text-xs text-slate-400">Chat with available mentors in real time</p>
          </div>
          <button onClick={() => navigate('/dashboard/student/chat')} className="btn-primary text-xs py-2 px-4 w-full sm:w-auto">Start Chat</button>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 flex items-center justify-center shrink-0">
            <CalendarCheck size={22} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 mb-0.5">Book Doubt Session</p>
            <p className="text-xs text-slate-400">Schedule a one-on-one doubt clearing session</p>
          </div>
          <button className="btn-secondary text-xs py-2 px-4 w-full sm:w-auto opacity-50 cursor-not-allowed">Book Now</button>
        </div>
      </div>

      {/* Teacher List */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Faculty Members</h2>
        </div>
        
        {teachers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <User size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No faculty members found at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-6 py-5 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-lg font-bold text-slate-600">
                    {teacher.firstName?.[0] || ""}{teacher.lastName?.[0] || ""}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{teacher.firstName} {teacher.lastName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {teacher.subjects ? teacher.subjects.join(", ") : "Expert Faculty"}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <Star size={12} fill="currentColor" />
                        {teacher.rating || "4.5"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        {teacher.experience || "Available"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-16 sm:pl-0 shrink-0">
                  <div className="flex flex-col items-end gap-1">
                      <span
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                          teacher.subscriptionType === "PAID" ? "text-amber-600" : "text-green-600"
                        }`}
                      >
                        {teacher.subscriptionType === "PAID" ? "Premium" : "Free Access"}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold ${
                          teacher.available !== false ? "text-green-600" : "text-slate-400"
                        }`}
                      >
                        <Circle
                          size={8}
                          fill="currentColor"
                          className={teacher.available !== false ? "text-green-500" : "text-slate-300"}
                        />
                        {teacher.available !== false ? "Available" : "Offline"}
                      </span>
                  </div>
                  {teacher.subscriptionType === "PAID" && !teacher.isSubscribed ? (
                    <Link 
                      to="/dashboard/student/subscriptions"
                      className="btn-primary text-[10px] py-1.5 px-3 bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-amber-100"
                    >
                      Subscribe
                    </Link>
                  ) : (
                    <button className="btn-primary text-[10px] py-1.5 px-3">Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectTeachers;
