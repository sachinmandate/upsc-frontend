import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  AlertTriangle,
  Award,
  Circle,
} from "lucide-react";

const PerformanceAnalytics = () => {
  const [testScores, setTestScores] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]); // Placeholder for now
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scores, subjectsData] = await Promise.all([
        studentApi.fetchMockTestScores(),
        studentApi.fetchSubjects()
      ]);
      setTestScores(scores);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error loading performance data:", error);
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

  const latestScore = testScores.length > 0 ? testScores[testScores.length - 1] : null;
  const previousScore = testScores.length > 1 ? testScores[testScores.length - 2] : null;
  const trend = latestScore && previousScore ? (latestScore.percentage || 0) - (previousScore.percentage || 0) : 0;
  
  const maxBarHeight = 120;

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
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Performance Analytics</h1>
        <p className="text-sm text-slate-500">Track your test scores and identify improvement areas</p>
      </div>

      {testScores.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-sm p-16 text-center">
            <BarChart3 size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No performance data yet</h3>
            <p className="text-sm text-slate-400">Complete mock tests to see your detailed analytics here.</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={16} className="text-indigo-500" />
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Average</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{avgScore}%</p>
              <p className="text-xs text-slate-500 mt-0.5">across all tests</p>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-amber-500" />
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Best</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{bestScore}%</p>
              <p className="text-xs text-slate-500 mt-0.5">highest score</p>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} className="text-green-500" />
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Latest</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{latestScore?.percentage || 0}%</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{latestScore ? (latestScore.assignmentTitle || latestScore.name || "Test").split(" – ")[0] : "N/A"}</p>
            </div>
            <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                {trend >= 0 ? (
                  <TrendingUp size={16} className="text-green-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Trend</p>
              </div>
              <p className={`text-xl sm:text-2xl font-bold ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                {trend >= 0 ? "+" : ""}{trend}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">vs previous test</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Score Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
              <h2 className="text-base font-bold text-slate-900 mb-6">Mock Test Scores</h2>
              <div className="flex items-end gap-2 sm:gap-4 justify-around">
                {testScores.map((test) => (
                  <div key={test.id} className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600">{test.percentage || 0}%</span>
                    <div
                      className="w-full max-w-16 rounded-t-sm transition-all"
                      style={{
                        height: `${((test.percentage || 0) / 100) * maxBarHeight}px`,
                        backgroundColor:
                          (test.percentage || 0) >= 60
                            ? "#059669"
                            : (test.percentage || 0) >= 45
                            ? "#d97706"
                            : "#dc2626",
                      }}
                    />
                    <div className="text-center w-full">
                      <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 leading-tight truncate">
                        {(test.assignmentTitle || test.name || "Test").split(" – ")[0]}
                      </p>
                      <p className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5">
                        {test.marksObtained}/{test.totalMarks || 100}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Cutoff line */}
              <div className="relative mt-4 pt-4 border-t border-dashed border-slate-200">
                <span className="absolute -top-2.5 left-0 text-[10px] font-bold text-slate-400 bg-white pr-2">
                  Target: 55% (estimated cutoff)
                </span>
              </div>
            </div>

            {/* Weak Areas */}
            <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-500" />
                <h2 className="text-base font-bold text-slate-900">Weak Areas</h2>
              </div>
              {weakAreas.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                    <p className="text-xs">More test data needed to identify weak areas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {weakAreas.map((area, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-700 truncate">{area.topic}</p>
                        <span className="text-xs font-semibold text-red-600 ml-2 shrink-0">{area.strength}%</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1.5">{area.subject}</p>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-red-400"
                          style={{ width: `${area.strength}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
                Focus on these areas to improve your overall score.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Subject-wise Progress */}
      <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-900 mb-5">Subject-wise Progress</h2>
        {subjects.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <p className="text-sm">No subjects enrolled or progress data available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4">
            {subjects.map((subject) => (
              <div key={subject.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-slate-700">{subject.name}</p>
                  <span className="text-xs font-bold ml-2 shrink-0" style={{ color: subject.color || "#1e293b" }}>
                    {subject.progress || 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${subject.progress || 0}%`,
                      backgroundColor: subject.color || "#1e293b",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test History Table */}
      {testScores.length > 0 && (
        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Test History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 py-3">
                    Test Name
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 sm:px-6 py-3">
                    Date
                  </th>
                  <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">
                    Score
                  </th>
                  <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-3">
                    %
                  </th>
                  <th className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 sm:px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {testScores.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                        {test.assignmentTitle || test.name || "Mock Test"}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                        {test.gradedAt || test.date || "Completed"}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-slate-700 text-center whitespace-nowrap">
                      {test.marksObtained}/{test.totalMarks || 100}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`text-sm font-bold ${
                          (test.percentage || 0) >= 60
                            ? "text-green-600"
                            : (test.percentage || 0) >= 45
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {test.percentage || 0}%
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 whitespace-nowrap ${
                          (test.percentage || 0) >= 55
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {(test.percentage || 0) >= 55 ? "Above" : "Below"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalytics;
