import { useState } from "react";
import { watchHistory } from "../../data/dashboardData";
import {
  Play,
  Clock,
  CheckCircle2,
  History,
  RotateCcw,
} from "lucide-react";

const subjectColors = {
  "Indian Polity": "#312e81",
  "History": "#9333ea",
  "Economy": "#d97706",
  "Geography": "#059669",
  "Environment": "#65a30d",
  "CSAT": "#dc2626",
};

const tabs = ["All", "In Progress", "Completed"];

const WatchHistory = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = watchHistory.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "In Progress") return item.progress < 100;
    return item.progress === 100;
  });

  const totalWatched = watchHistory.length;
  const completedCount = watchHistory.filter((v) => v.progress === 100).length;
  const totalHours = watchHistory.reduce((sum, v) => {
    const match = v.watchedDuration.match(/(\d+)h?\s*(\d+)?m?/);
    if (!match) return sum;
    return sum + (parseInt(match[1] || 0) * (v.watchedDuration.includes("h") ? 60 : 1) + parseInt(match[2] || 0));
  }, 0);
  const hours = Math.floor(totalHours / 60);
  const mins = totalHours % 60;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Watch History</h1>
        <p className="text-sm text-slate-500">Track your learning progress across all video lectures</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Play size={16} className="text-indigo-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Watched</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{totalWatched}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total videos</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-amber-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Time</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{hours}h {mins}m</p>
          <p className="text-xs text-slate-500 mt-0.5">Total watched</p>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-green-500" />
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Done</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 p-1 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="bg-white border border-slate-200 shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <History size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No videos in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => {
              const color = subjectColors[item.subject] || "#1e293b";
              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: color + "15" }}
                    >
                      {item.progress === 100 ? (
                        <CheckCircle2 size={18} style={{ color }} />
                      ) : (
                        <Play size={18} style={{ color }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.subject} &middot; {item.teacher} &middot; {formatDate(item.watchedAt)}
                      </p>
                      {item.progress < 100 && (
                        <div className="mt-2 w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-14 sm:pl-0 shrink-0">
                    <span className="text-xs text-slate-400">
                      {item.watchedDuration} / {item.duration}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 ${
                        item.progress === 100
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.progress}%
                    </span>
                    {item.progress < 100 ? (
                      <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                        <Play size={12} />
                        Resume
                      </button>
                    ) : (
                      <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                        <RotateCcw size={12} />
                        Rewatch
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
