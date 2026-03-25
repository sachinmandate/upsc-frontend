import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X,
} from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700", icon: AlertCircle },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: FileCheck },
  graded: { label: "Graded", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  SUBMITTED: { label: "Submitted", color: "bg-blue-100 text-blue-700", icon: FileCheck },
  GRADED: { label: "Graded", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

const tabs = ["All", "Pending", "Submitted", "Graded"];

const Assignments = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionData, setSubmissionData] = useState({ text: "", file: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await studentApi.fetchMySubmissions();
      setAssignments(data);
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      await studentApi.submitAssignment({
        assignmentId: selectedAssignment.id,
        submissionText: submissionData.text,
        fileUrl: submissionData.file, // For now, we just pass the URL/string
      });
      setShowModal(false);
      setSubmissionData({ text: "", file: "" });
      loadData(); // Refresh list
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assignments.filter((a) => {
    const status = (a.status || "pending").toUpperCase();
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return status === "PENDING" || status === "OVERDUE";
    return status === activeTab.toUpperCase();
  });

  const pendingCount = assignments.filter((a) => {
      const s = (a.status || "").toUpperCase();
      return s === "PENDING" || s === "OVERDUE";
  }).length;
  const submittedCount = assignments.filter((a) => (a.status || "").toUpperCase() === "SUBMITTED").length;
  const gradedCount = assignments.filter((a) => (a.status || "").toUpperCase() === "GRADED").length;

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
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Assignments</h1>
        <p className="text-sm text-slate-500">Track and submit your assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-amber-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Pending</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{pendingCount}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck size={16} className="text-blue-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Submitted</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{submittedCount}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-green-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Graded</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{gradedCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 p-1 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="bg-white border border-slate-200 shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No assignments found for this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((assignment) => {
              const status = (assignment.status || "pending").toUpperCase();
              const config = statusConfig[status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div
                  key={assignment.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <ClipboardList size={18} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{assignment.title || assignment.assignmentTitle}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {assignment.subject || "General Studies"} &middot; Due: {assignment.dueDate || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-[52px] sm:pl-0 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-sm ${config.color}`}>
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                    {assignment.marksObtained !== undefined && (
                      <span className="text-sm font-semibold text-slate-700">{assignment.marksObtained} / {assignment.totalMarks || 100}</span>
                    )}
                    {(status === "PENDING" || status === "OVERDUE") && (
                      <button 
                        onClick={() => handleOpenSubmit(assignment)}
                        className="btn-primary text-xs py-1.5 px-4"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Submit Assignment</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedAssignment?.assignmentTitle || selectedAssignment?.title}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Submission Notes / Link
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 transition-colors resize-none"
                  placeholder="Enter your notes or a link to your Google Drive/File..."
                  value={submissionData.text}
                  onChange={(e) => setSubmissionData({ ...submissionData, text: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  File Attachment (URL/Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                  placeholder="https://example.com/file.pdf"
                  value={submissionData.file}
                  onChange={(e) => setSubmissionData({ ...submissionData, file: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary py-3 text-sm font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary py-3 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {submitting ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
