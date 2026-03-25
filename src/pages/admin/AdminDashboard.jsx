import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import { 
  CheckCircle, XCircle, Clock, Loader2, UserCheck, ShieldCheck, MapPin, 
  BookOpen, Layers, Plus, Users, Group, FileText, Settings, DollarSign,
  ChevronRight, Trash2, Edit, Save
} from "lucide-react";
import { toast } from "sonner";
import * as adminApi from "../../api/adminApi";
import { Video } from "lucide-react";

const AdminDashboard = () => {
    // approvals, classes, subjects, exams, students, syllabus, teachers
    const [activeTab, setActiveTab] = useState('approvals'); 
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    // Data states
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]); // Placeholder for approved ones
    const [classesList, setClassesList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [examsList, setExamsList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [groupsList, setGroupsList] = useState([]);
    const [chaptersList, setChaptersList] = useState([]);
    const [curriculumList, setCurriculumList] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);

    // Form states
    const [newClass, setNewClass] = useState({ name: "", stream: "", image: "" });
    const [newSubject, setNewSubject] = useState({ name: "", classId: "" });
    const [newExam, setNewExam] = useState({ name: "", description: "", iconUrl: "" });
    const [newChapter, setNewChapter] = useState({ title: "", description: "", subjectId: "" });
    const [newCurriculum, setNewCurriculum] = useState({ title: "", description: "", videoUrl: "", chapterId: "" });
    const [editingPricing, setEditingPricing] = useState(null); // { id, pricingModel, rates... }
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadIntialData();
    }, []);

    const loadIntialData = async () => {
        setLoading(true);
        try {
            const [pending, classes, exams, subjects] = await Promise.all([
                adminApi.fetchPendingTeachers(),
                adminApi.fetchAllClasses(),
                adminApi.fetchAllExams(),
                adminApi.fetchAllSubjects()
            ]);
            setPendingTeachers(pending);
            setClassesList(classes);
            setExamsList(exams);
            setAllSubjects(subjects);
        } catch (error) {
            toast.error("Error loading dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // Tab change handlers for lazy loading
    useEffect(() => {
        if (activeTab === 'students') {
            loadStudents();
        } else if (activeTab === 'teachers') {
            loadAllTeachers();
        }
    }, [activeTab]);

    const loadStudents = async () => {
        const students = await adminApi.fetchAllStudents();
        const groups = await adminApi.fetchAllGroups();
        setStudentsList(students);
        setGroupsList(groups);
    };

    const loadAllTeachers = async () => {
        const teachers = await adminApi.fetchAllTeachers();
        setAllTeachers(teachers);
        
        const subjects = await adminApi.fetchAllSubjects();
        setAllSubjects(subjects);
    };

    const handleApprove = async (id) => {
        const res = await adminApi.approveTeacher(id);
        if (res.success) {
            toast.success(res.message);
            setPendingTeachers(prev => prev.filter(t => t.id !== id));
        } else toast.error(res.message);
    };

    const handleReject = async (id) => {
        const res = await adminApi.rejectTeacher(id);
        if (res.success) {
            toast.success(res.message);
            setPendingTeachers(prev => prev.filter(t => t.id !== id));
        } else toast.error(res.message);
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await adminApi.createClass(newClass);
        if (res.success) {
            toast.success(res.message);
            setNewClass({ name: "", stream: "", image: "" });
            setClassesList(await adminApi.fetchAllClasses());
        } else toast.error(res.message);
        setIsSubmitting(false);
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await adminApi.createSubject(newSubject);
        if (res.success) {
            toast.success(res.message);
            setNewSubject({ name: "", classId: "" });
            // Refresh list if needed or let effect handle it
        } else toast.error(res.message);
        setIsSubmitting(false);
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await adminApi.createExam(newExam);
        if (res.success) {
            toast.success("Exam created");
            setNewExam({ name: "", description: "", iconUrl: "" });
            setExamsList(await adminApi.fetchAllExams());
        } else toast.error("Failed to create exam");
        setIsSubmitting(false);
    };

    const handleCreateChapter = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await adminApi.createChapter(newChapter);
        if (res.success) {
            toast.success("Chapter created");
            setNewChapter({ title: "", description: "", subjectId: "" });
            setChaptersList(prev => [...prev, res.chapter]);
        } else toast.error("Failed to create chapter");
        setIsSubmitting(false);
    };

    const fetchChapters = async (subId) => {
        const res = await adminApi.fetchChaptersBySubject(subId);
        setChaptersList(res);
    };

    const handleCreateCurriculum = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await adminApi.createCurriculum(newCurriculum);
        if (res.success) {
            toast.success("Curriculum topic added");
            setNewCurriculum({ title: "", description: "", videoUrl: "", chapterId: "" });
            setCurriculumList(prev => [...prev, res.curriculum]);
        } else toast.error("Failed to add curriculum");
        setIsSubmitting(false);
    };

    const handleUpdatePricing = async (id) => {
        setIsSubmitting(true);
        const res = await adminApi.updateTeacherPricing(id, editingPricing);
        if (res.success) {
            toast.success("Pricing updated");
            setEditingPricing(null);
            loadAllTeachers();
        } else toast.error("Failed to update pricing");
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
            <Navbar />

            {/* Admin Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
                                <p className="text-sm font-medium text-slate-500">System Control & Resource Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated As</p>
                                <p className="text-sm font-bold text-slate-800">{user?.email || "Admin"}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-100 shadow-sm">
                                AD
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
                  <div className="flex gap-1 overflow-x-auto no-scrollbar pt-2">
                      {[
                        { id: 'approvals', icon: UserCheck, label: 'Approvals' },
                        { id: 'teachers', icon: DollarSign, label: 'Teacher Pricing' },
                        { id: 'exams', icon: FileText, label: 'Exams' },
                        { id: 'classes', icon: Layers, label: 'Classes' },
                        { id: 'subjects', icon: BookOpen, label: 'Subjects' },
                        { id: 'syllabus', icon: Settings, label: 'Syllabus' },
                        { id: 'students', icon: Users, label: 'Students' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-200 ${
                            activeTab === tab.id 
                            ? 'border-red-600 text-red-600 bg-red-50/30' 
                            : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <tab.icon size={16} />
                          {tab.label}
                        </button>
                      ))}
                  </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-sm border border-slate-200 shadow-sm">
                        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Console...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Approvals Tab */}
                        {activeTab === 'approvals' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">Pending Teacher Requests</h2>
                                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200 flex items-center gap-2">
                                        <Clock size={12} /> {pendingTeachers.length} Pending
                                    </span>
                                </div>
                                
                                {pendingTeachers.length === 0 ? (
                                    <div className="bg-white rounded-sm border border-slate-200 p-16 text-center shadow-sm">
                                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Pending Requests</h3>
                                        <p className="text-slate-400 max-w-sm mx-auto">Registration queue is empty. New teacher applications will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pendingTeachers.map((teacher) => (
                                            <div key={teacher.id} className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col">
                                                <div className="p-6 flex-1">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="w-12 h-12 bg-slate-900 text-white rounded-sm flex items-center justify-center text-lg font-bold">
                                                            {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-slate-900 truncate">{teacher.firstName} {teacher.lastName}</h3>
                                                            <p className="text-xs text-slate-500 truncate">{teacher.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3 text-xs font-semibold text-slate-600">
                                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-sm border border-slate-100">
                                                            <MapPin size={14} className="text-red-500" />
                                                            {teacher.city || 'N/A'}, {teacher.district || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-sm border border-slate-100">
                                                            <Layers size={14} className="text-amber-500" />
                                                            {teacher.organization || 'No Organization'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex gap-3">
                                                    <button onClick={() => handleReject(teacher.id)} className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-sm text-xs font-bold uppercase tracking-widest transition-all">
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                    <button onClick={() => handleApprove(teacher.id)} className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-800 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm">
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Teacher Management / Pricing Tab */}
                        {activeTab === 'teachers' && (
                            <div className="space-y-6">
                              <h2 className="text-xl font-bold text-slate-900">Review Approved Teachers & Pricing</h2>
                              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                  <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Teacher</th>
                                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Model</th>
                                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rate Info</th>
                                      <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {allTeachers.filter(t => t.status === 'APPROVED').map(t => (
                                      <tr key={t.id} className="hover:bg-slate-50/30">
                                        <td className="px-6 py-4">
                                          <p className="text-sm font-bold text-slate-900">{t.firstName} {t.lastName}</p>
                                          <p className="text-[10px] text-slate-400">{t.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                          <p className="text-xs font-bold text-slate-600 italic mb-1">{t.pricingModel || "FREE"}</p>
                                          <div className="flex flex-wrap gap-1">
                                            {t.subjects && t.subjects.map(s => (
                                              <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded-sm border border-slate-200">
                                                {s.name}
                                              </span>
                                            ))}
                                            {(!t.subjects || t.subjects.length === 0) && <span className="text-[10px] text-slate-300">No subjects</span>}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                          {t.pricingModel === 'REVENUE_SHARE' ? `${t.revenueSharePercentage}% Share` 
                                           : t.pricingModel === 'PER_LECTURE' ? `₹${t.perLectureRate} / lect`
                                           : t.pricingModel === 'PER_COURSE' ? `₹${t.perCourseRate} / course`
                                           : "Standard Access"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                          <button 
                                            onClick={() => setEditingPricing(t)}
                                            className="text-slate-400 hover:text-red-600 ml-auto border border-slate-200 p-1.5 rounded-sm hover:border-red-200 transition-all"
                                          >
                                            <Edit size={16} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                        )}

                        {/* Classes, Subjects, Entities Tab Logic */}
                        {(activeTab === 'classes' || activeTab === 'subjects' || activeTab === 'exams') && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* FORM COLUMN */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 sticky top-24">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                      <Plus size={20} className="text-red-600" /> 
                                      {activeTab === 'classes' ? 'Add New Class' : activeTab === 'subjects' ? 'Add New Subject' : 'Create New Exam'}
                                    </h3>
                                    
                                    {activeTab === 'classes' && (
                                      <form onSubmit={handleCreateClass} className="space-y-4">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Class Name</label>
                                              <input required value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} disabled={isSubmitting} className="input" placeholder="e.g. UPSC CSE 2026" />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Stream</label>
                                              <input value={newClass.stream} onChange={e => setNewClass({...newClass, stream: e.target.value})} disabled={isSubmitting} className="input" placeholder="e.g. Arts/Science" />
                                          </div>
                                          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-xs tracking-widest uppercase">
                                              {isSubmitting ? 'Syncing...' : 'Create Class'}
                                          </button>
                                      </form>
                                    )}

                                    {activeTab === 'subjects' && (
                                      <form onSubmit={handleCreateSubject} className="space-y-4">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject Name</label>
                                              <input required value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} disabled={isSubmitting} className="input" placeholder="e.g. Indian Polity" />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assign To Class</label>
                                              <select required value={newSubject.classId} onChange={e => setNewSubject({...newSubject, classId: e.target.value})} className="input bg-white">
                                                  <option value="">Select a Class</option>
                                                  {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                              </select>
                                          </div>
                                          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-xs tracking-widest uppercase">
                                              {isSubmitting ? 'Syncing...' : 'Add Subject'}
                                          </button>
                                      </form>
                                    )}

                                    {activeTab === 'exams' && (
                                      <form onSubmit={handleCreateExam} className="space-y-4">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Exam Title</label>
                                              <input required value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} className="input" placeholder="e.g. MPSC Exam" />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
                                              <textarea value={newExam.description} onChange={e => setNewExam({...newExam, description: e.target.value})} className="input h-24 resize-none" placeholder="Brief metadata..." />
                                          </div>
                                          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 text-xs tracking-widest uppercase">
                                              {isSubmitting ? 'Syncing...' : 'Create Exam'}
                                          </button>
                                      </form>
                                    )}
                                </div>
                            </div>
                            
                            {/* LIST COLUMN */}
                            <div className="lg:col-span-2 space-y-4">
                              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden min-h-[400px]">
                                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Existing {activeTab === 'classes' ? 'Classes' : activeTab === 'subjects' ? 'Subjects' : 'Exams'}
                                  </h3>
                                </div>
                                
                                <div className="divide-y divide-slate-100">
                                  {activeTab === 'classes' && (
                                    classesList.length > 0 ? classesList.map(cls => (
                                      <div key={cls.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div>
                                          <h4 className="font-bold text-slate-900">{cls.name}</h4>
                                          <p className="text-xs text-slate-400 mt-0.5">{cls.stream || 'No Stream'} • ID: {cls.id}</p>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                      </div>
                                    )) : <div className="p-16 text-center text-slate-400 italic">No classes found.</div>
                                  )}

                                  {activeTab === 'exams' && (
                                    examsList.length > 0 ? examsList.map(ex => (
                                      <div key={ex.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-sm flex items-center justify-center font-bold">
                                            {ex.name.charAt(0)}
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-slate-900">{ex.name}</h4>
                                            <p className="text-xs text-slate-400 line-clamp-1">{ex.description || 'No description provided'}</p>
                                          </div>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                      </div>
                                    )) : <div className="p-16 text-center text-slate-400 italic">No exams found.</div>
                                  )}

                                  {activeTab === 'subjects' && (
                                    subjectsList.length > 0 ? subjectsList.map(sub => (
                                      <div key={sub.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div>
                                          <h4 className="font-bold text-slate-900">{sub.name}</h4>
                                          <p className="text-xs text-slate-400 mt-0.5">Linked to Class ID: {sub.classEntity?.id || sub.classId}</p>
                                        </div>
                                        <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                      </div>
                                    )) : <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                                      <p className="text-xs mb-4">Select a class to view its subjects:</p>
                                      <select className="input max-w-xs" onChange={e => e.target.value && adminApi.fetchSubjectsByClass(e.target.value).then(setSubjectsList)}>
                                          <option value="">Choose Class...</option>
                                          {classesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                      </select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Syllabus Tab Logic (Chapters, Curriculum) */}
                        {activeTab === 'syllabus' && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             {/* CHAPTER SECTION */}
                             <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
                               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                  <Layers size={18} className="text-indigo-600" /> Manage Chapters
                               </h3>
                               <form onSubmit={handleCreateChapter} className="space-y-4 mb-8 pb-8 border-b border-slate-100">
                                   <div className="grid sm:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</label>
                                          <select required className="input bg-white" onChange={e => {
                                            setNewChapter({...newChapter, subjectId: e.target.value});
                                            fetchChapters(e.target.value);
                                          }}>
                                            <option value="">Select Subject</option>
                                            {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name} (ID: {s.classId})</option>)}
                                          </select>
                                      </div>
                                      <div className="space-y-1">
                                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</label>
                                          <input required className="input" value={newChapter.title} onChange={e => setNewChapter({...newChapter, title: e.target.value})} placeholder="e.g. Fundamental Rights" />
                                      </div>
                                   </div>
                                   <button type="submit" disabled={isSubmitting} className="btn-primary py-2 px-6 text-[10px] tracking-widest uppercase">Create Chapter</button>
                               </form>
                               
                               <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                  {chaptersList.map(ch => (
                                    <div key={ch.id} className="p-3 bg-slate-50 border border-slate-100 flex items-center justify-between rounded-sm cursor-pointer hover:border-slate-300" onClick={() => {
                                      setNewCurriculum({...newCurriculum, chapterId: ch.id});
                                      adminApi.fetchCurriculumByChapter(ch.id).then(setCurriculumList);
                                    }}>
                                      <span className="text-sm font-bold text-slate-700">{ch.title}</span>
                                      <ChevronRight size={14} className="text-slate-400" />
                                    </div>
                                  ))}
                               </div>
                             </div>

                             {/* CURRICULUM SECTION */}
                             <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
                               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                                  <Video size={18} className="text-indigo-600" /> Curriculum & Content
                               </h3>
                               {newCurriculum.chapterId ? (
                                  <form onSubmit={handleCreateCurriculum} className="space-y-4">
                                     <div className="space-y-1 text-xs font-bold text-slate-400 uppercase">Adding to: Chapter ID {newCurriculum.chapterId}</div>
                                     <input required className="input" value={newCurriculum.title} onChange={e => setNewCurriculum({...newCurriculum, title: e.target.value})} placeholder="Topic Title" />
                                     <input className="input" value={newCurriculum.videoUrl} onChange={e => setNewCurriculum({...newCurriculum, videoUrl: e.target.value})} placeholder="Video URL (Optional)" />
                                     <button type="submit" disabled={isSubmitting} className="btn-primary py-2.5 w-full text-[10px] tracking-widest uppercase shadow-md shadow-red-100">Add Topic</button>
                                     <div className="pt-4 divide-y divide-slate-100">
                                       {curriculumList.map(c => (
                                         <div key={c.id} className="py-2.5 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            <span className="text-xs font-semibold text-slate-800">{c.title}</span>
                                         </div>
                                       ))}
                                     </div>
                                  </form>
                               ) : (
                                 <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <Layers className="opacity-20 mb-2" size={32} />
                                    <p className="text-xs text-center px-8">Select a chapter from the left to manage its curriculum topics.</p>
                                 </div>
                               )}
                             </div>
                          </div>
                        )}

                        {/* Students & Groups Tab */}
                        {activeTab === 'students' && (
                          <div className="space-y-8">
                            <div className="grid lg:grid-cols-4 gap-6">
                              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-sm p-4 h-fit shadow-sm">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">Groups List</h3>
                                <div className="space-y-2">
                                  {groupsList.map(g => (
                                    <div key={g.id} className="p-3 bg-slate-50 border border-slate-100 rounded-sm hover:border-slate-300 cursor-pointer">
                                      <p className="text-sm font-bold text-slate-800">{g.groupName}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">{g.students?.length || 0} Students enrolled</p>
                                    </div>
                                  ))}
                                  {groupsList.length === 0 && <p className="text-xs text-slate-400 italic">No groups defined.</p>}
                                </div>
                              </div>
                              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Enrolled Students</h3>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left">
                                    <thead>
                                      <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Identity</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</th>
                                        <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined</th>
                                        <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Remove</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                      {studentsList.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                                          <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">{s.firstName} {s.lastName}</p>
                                            <p className="text-[10px] text-slate-400">{s.email}</p>
                                          </td>
                                          <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                                            {s.city}, {s.district}
                                          </td>
                                          <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                            {new Date(s.createdAt || Date.now()).toLocaleDateString()}
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                            <button className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                )}
            </main>

            {/* Pricing Modal */}
            {editingPricing && (
              <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Manage Teacher Pricing</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Editing: {editingPricing.firstName} {editingPricing.lastName}</p>
                    </div>
                    <button onClick={() => setEditingPricing(null)} className="text-slate-400 hover:text-slate-800"><XCircle size={24} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subscription Type</label>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-sm">
                        {['FREE', 'PAID'].map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setEditingPricing({...editingPricing, subscriptionType: type});
                              adminApi.updateTeacherSubscription(editingPricing.id, type);
                            }}
                            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${
                              editingPricing.subscriptionType === type 
                              ? 'bg-white text-slate-900 shadow-sm' 
                              : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pricing Model</label>
                      <select 
                        className="input bg-white" 
                        value={editingPricing.pricingModel || "FREE"}
                        onChange={e => setEditingPricing({...editingPricing, pricingModel: e.target.value})}
                      >
                        <option value="FREE">Free / Open</option>
                        <option value="PER_LECTURE">Fixed Rate (Per Lecture)</option>
                        <option value="PER_COURSE">Fixed Rate (Per Course)</option>
                        <option value="REVENUE_SHARE">Revenue Share (%)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assigned Subjects</label>
                      <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-sm p-3 grid grid-cols-2 gap-2 bg-slate-50/50">
                        {allSubjects.map(sub => {
                          const isAssigned = (editingPricing.subjects || []).some(s => s.id === sub.id);
                          return (
                            <label key={sub.id} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="w-3.5 h-3.5 rounded-sm accent-red-600"
                                checked={isAssigned}
                                onChange={async (e) => {
                                  let newSubs = [...(editingPricing.subjects || [])];
                                  if (e.target.checked) {
                                    newSubs.push(sub);
                                  } else {
                                    newSubs = newSubs.filter(s => s.id !== sub.id);
                                  }
                                  const subjectIds = newSubs.map(s => s.id);
                                  setEditingPricing({...editingPricing, subjects: newSubs});
                                  await adminApi.assignTeacherSubjects(editingPricing.id, subjectIds);
                                }}
                              />
                              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{sub.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {editingPricing.pricingModel === 'PER_LECTURE' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rate per Lecture (₹)</label>
                        <input type="number" className="input" value={editingPricing.perLectureRate || 0} onChange={e => setEditingPricing({...editingPricing, perLectureRate: parseFloat(e.target.value)})} />
                      </div>
                    )}

                    {editingPricing.pricingModel === 'PER_COURSE' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rate per Course (₹)</label>
                        <input type="number" className="input" value={editingPricing.perCourseRate || 0} onChange={e => setEditingPricing({...editingPricing, perCourseRate: parseFloat(e.target.value)})} />
                      </div>
                    )}

                    {editingPricing.pricingModel === 'REVENUE_SHARE' && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Revenue Share Percentage (%)</label>
                        <input type="number" className="input" value={editingPricing.revenueSharePercentage || 0} onChange={e => setEditingPricing({...editingPricing, revenueSharePercentage: parseFloat(e.target.value)})} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-t border-slate-100 flex gap-3">
                    <button onClick={() => setEditingPricing(null)} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-sm">Cancel</button>
                    <button onClick={() => handleUpdatePricing(editingPricing.id)} disabled={isSubmitting} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-slate-900 text-white rounded-sm shadow-md">{isSubmitting ? 'Saving...' : 'Save Pricing'}</button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
};

export default AdminDashboard;
