import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import {
  FileCheck,
  Clock,
  Play,
  CheckCircle2,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const MockTests = () => {
  const [testScores, setTestScores] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]); // Will stay empty for now
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const scores = await studentApi.fetchMockTestScores();
      setTestScores(scores);
    } catch (error) {
      console.error("Error loading mock test scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = testScores.length > 0 
    ? Math.round(testScores.reduce((sum, t) => sum + (t.percentage || 0), 0) / testScores.length)
    : 0;
    
  const bestScore = testScores.length > 0
    ? Math.max(...testScores.map((t) => t.percentage || 0))
    : 0;

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
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Mock Tests</h1>
        <p className="text-sm text-slate-500">Practice with UPSC-pattern mock tests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck size={16} className="text-indigo-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Attempted</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{testScores.length}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} className="text-amber-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Avg Score</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{avgScore}%</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-green-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{upcomingTests.length}</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-green-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Best Score</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{bestScore}%</p>
        </div>
      </div>

      {/* Upcoming Tests */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Upcoming Tests</h2>
        </div>
        
        {upcomingTests.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center">
            <Clock size={32} className="opacity-20 mb-2" />
            <p className="text-sm">No tests scheduled for the next few days.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center shrink-0">
                    <FileCheck size={18} className="text-indigo-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{test.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {test.date} &middot; {test.duration} &middot; {test.questions} questions
                    </p>
                  </div>
                </div>
                <div className="pl-[52px] sm:pl-0">
                  <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 w-fit">
                    <Play size={13} />
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tests */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Completed Tests</h2>
        </div>
        
        {testScores.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <CheckCircle2 size={32} className="opacity-20 mb-2" />
            <p className="text-sm">You haven't completed any mock tests yet.</p>
            <p className="text-xs mt-1">Attempt an upcoming test to see your performance here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {testScores.map((test) => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{test.assignmentTitle || test.name || "Mock Test"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{test.gradedAt || test.date || "Completed"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-[52px] sm:pl-0 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {test.marksObtained}/{test.totalMarks || 100}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        (test.percentage || 0) >= 55 ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {test.percentage || 0}%
                    </p>
                  </div>
                  <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 opacity-50 cursor-not-allowed">
                    Review <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTests;
