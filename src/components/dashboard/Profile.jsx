import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../api/studentApi";
import {
  User,
  Mail,
  Phone,
  Target,
  BookOpen,
  Calendar,
  Award,
  Edit3,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  
  const [showExamModal, setShowExamModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [updatingExam, setUpdatingExam] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [profileData, subjectsData] = await Promise.all([
        studentApi.fetchDashboard().catch(() => ({})),
        studentApi.fetchSubjects().catch(() => []),
      ]);
      setProfile(profileData);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const openExamModal = async () => {
    setShowExamModal(true);
    try {
      const examsData = await studentApi.fetchExams();
      setExams(Array.isArray(examsData) ? examsData : []);
      if (profile?.examTarget) {
         const current = examsData.find(e => e.name === profile.examTarget);
         if (current) setSelectedExamId(current.id.toString());
      }
    } catch (e) {
      toast.error("Failed to load exams");
    }
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    if (!selectedExamId) return;
    setUpdatingExam(true);
    try {
      await studentApi.selectExam(selectedExamId);
      toast.success("Exam target updated successfully");
      setShowExamModal(false);
      loadProfileData(); // Reload profile
    } catch (e) {
      toast.error("Failed to update exam target");
    } finally {
      setUpdatingExam(false);
    }
  };

  const studentProfile = {
    name: `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || user?.name || "Student",
    firstName: profile?.firstName || user?.firstName || "Student",
    email: user?.email || profile?.email || "",
    phone: profile?.phone || user?.phone || "—",
    examTarget: profile?.examTarget || user?.examTarget || "UPSC / MPSC",
    optionalSubject: profile?.optionalSubject || "—",
    attempt: profile?.attempt || "—",
    joinedDate: profile?.createdAt || "—",
    syllabusCompleted: profile?.overallProgress || 0,
    avatarInitials: (profile?.firstName?.[0] || "") + (profile?.lastName?.[0] || "") || "ST",
  };

  const infoRows = [
    { icon: Mail, label: "Email", value: user?.email || studentProfile.email },
    { icon: Phone, label: "Phone", value: studentProfile.phone },
    { icon: Target, label: "Exam Target", value: studentProfile.examTarget },
    { icon: BookOpen, label: "Optional Subject", value: studentProfile.optionalSubject },
    { icon: Award, label: "Attempt", value: studentProfile.attempt },
    { icon: Calendar, label: "Member Since", value: studentProfile.joinedDate },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Profile</h1>
        <p className="text-sm text-slate-500">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6 text-center h-fit">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-slate-900 text-white mx-auto flex items-center justify-center text-xl sm:text-2xl font-bold mb-4">
            {studentProfile.avatarInitials}
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-0.5">{studentProfile.name}</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">
            {studentProfile.examTarget}
          </p>
          <p className="text-xs text-slate-400">{studentProfile.attempt}</p>

          {/* Overall progress */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Syllabus Completed
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${studentProfile.syllabusCompleted}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-slate-600">{studentProfile.syllabusCompleted}%</p>
          </div>

          <button className="btn-secondary w-full mt-4 text-xs py-2.5 flex items-center justify-center gap-1.5">
            <Edit3 size={13} />
            Edit Profile
          </button>
        </div>

        {/* Info Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {infoRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="w-9 h-9 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <row.icon size={16} className="text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                      {row.label}
                    </p>
                    <p className="text-sm font-medium text-slate-800 truncate">{row.value}</p>
                  </div>
                  {row.label === "Exam Target" && (
                    <button 
                      onClick={openExamModal}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline transition-all"
                    >
                      Change
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Subject-wise Progress</h2>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{subject.name}</p>
                    <span className="text-xs font-bold ml-2 shrink-0" style={{ color: subject.color }}>
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Change Exam Target</h2>
              <button 
                onClick={() => setShowExamModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateExam} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Select New Exam
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 transition-colors bg-white"
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                >
                  <option value="" disabled>Select an exam setup...</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updatingExam || !selectedExamId}
                  className="w-full btn-primary py-3 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {updatingExam ? <Loader2 size={16} className="animate-spin" /> : "Update Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
