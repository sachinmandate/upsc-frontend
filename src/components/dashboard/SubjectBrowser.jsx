import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  BookOpen,
  ChevronRight,
  Users,
  Video,
  FileText,
  Star,
  Filter,
  GraduationCap,
  Search,
  Lock,
  LockOpen,
  Layers,
} from "lucide-react";

const classColors = [
  { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", accent: "#4f46e5" },
  { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", accent: "#d97706" },
  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", accent: "#059669" },
  { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", accent: "#e11d48" },
];

const SubjectBrowser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Step tracking: "classes" -> "subjects" -> "teachers"
  const [step, setStep] = useState("classes");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await studentApi.fetchClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = async (cls) => {
    setSelectedClass(cls);
    setStep("subjects");
    setLoading(true);
    try {
      const data = await studentApi.fetchSubjectsByClass(cls.id);
      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setStep("teachers");
    setLoading(true);
    try {
      const data = await studentApi.fetchTeachersBySubject(subject.id);
      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "teachers") {
      setStep("subjects");
      setSelectedSubject(null);
      setTeachers([]);
    } else if (step === "subjects") {
      setStep("classes");
      setSelectedClass(null);
      setSubjects([]);
    }
  };

  const handleTeacherClick = (teacher) => {
    // Navigate to course view with teacher + subject context
    navigate(`/dashboard/student/course/${selectedSubject.id}?teacherId=${teacher.id}`);
  };

  const filteredTeachers = teachers.filter((t) => {
    const name = `${t.firstName || ""} ${t.lastName || ""}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (loading && step === "classes" && classes.length === 0) {
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
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Browse Subjects</h1>
        <p className="text-sm text-slate-500">
          Choose a class, pick a subject, and explore teachers & content
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
        <button
          onClick={() => { setStep("classes"); setSelectedClass(null); setSelectedSubject(null); }}
          className={`transition-colors ${step === "classes" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
        >
          Classes
        </button>
        {selectedClass && (
          <>
            <ChevronRight size={12} className="text-slate-300" />
            <button
              onClick={handleBack}
              className={`transition-colors ${step === "subjects" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
            >
              {selectedClass.name}
            </button>
          </>
        )}
        {selectedSubject && (
          <>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900">{selectedSubject.name}</span>
          </>
        )}
      </div>

      {/* ─── STEP 1: Classes ─── */}
      {step === "classes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.length === 0 ? (
            <div className="col-span-full bg-white border border-dashed border-slate-200 p-12 text-center">
              <Layers size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800 mb-1">No classes available</p>
              <p className="text-xs text-slate-400">Classes will appear here once added by the admin.</p>
            </div>
          ) : (
            classes.map((cls, idx) => {
              const color = classColors[idx % classColors.length];
              return (
                <button
                  key={cls.id}
                  onClick={() => handleClassSelect(cls)}
                  className={`bg-white border border-slate-200 shadow-sm p-6 text-left hover:shadow-md hover:border-slate-300 transition-all group`}
                >
                  <div className={`w-12 h-12 ${color.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <GraduationCap size={24} className={color.text} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{cls.name}</h3>
                  <p className="text-xs text-slate-400">{cls.stream || "General"}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                    Browse Subjects <ChevronRight size={14} />
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* ─── STEP 2: Subjects ─── */}
      {step === "subjects" && (
        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-200 p-5 animate-pulse">
                  <div className="w-10 h-10 bg-slate-100 rounded mb-3"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 p-12 text-center">
              <BookOpen size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800 mb-1">No subjects found</p>
              <p className="text-xs text-slate-400">No subjects have been added under {selectedClass?.name} yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject, idx) => {
                const color = classColors[idx % classColors.length];
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject)}
                    className="bg-white border border-slate-200 shadow-sm p-5 text-left hover:shadow-md hover:border-slate-300 transition-all group"
                  >
                    <div className={`w-10 h-10 ${color.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <BookOpen size={18} className={color.text} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5 leading-snug">{subject.name}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedClass?.name}</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                      View Teachers <ChevronRight size={12} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── STEP 3: Teachers for Selected Subject ─── */}
      {step === "teachers" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 transition-colors bg-white"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-slate-200 p-6 animate-pulse flex gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 p-12 text-center">
              <Users size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800 mb-1">No teachers found</p>
              <p className="text-xs text-slate-400">No teachers are assigned to {selectedSubject?.name} yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => handleTeacherClick(teacher)}
                  className="w-full bg-white border border-slate-200 shadow-sm p-5 sm:p-6 text-left hover:shadow-md hover:border-slate-300 transition-all group flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-lg font-bold text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      {teacher.firstName?.[0] || ""}{teacher.lastName?.[0] || ""}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900">{teacher.firstName} {teacher.lastName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {teacher.subjects ? teacher.subjects.join(", ") : selectedSubject?.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        {teacher.rating && (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <Star size={12} fill="currentColor" /> {teacher.rating}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Video size={12} /> {teacher.totalVideos || 0} videos
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <FileText size={12} /> {teacher.totalNotes || 0} notes
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Users size={12} /> {teacher.totalStudents || 0} students
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-[72px] sm:pl-0 shrink-0">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${
                      teacher.subscriptionType === "PAID"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {teacher.subscriptionType === "PAID" ? (
                        <><Lock size={10} /> Premium</>
                      ) : (
                        <><LockOpen size={10} /> Free</>
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                      View Content <ChevronRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectBrowser;
