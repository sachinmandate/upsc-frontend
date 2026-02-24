import { useState } from "react";
import { subjects, recentMaterials, studyNotes } from "../../data/dashboardData";
import ContentBadge from "../common/ContentBadge";
import {
  BookOpen,
  Download,
  Search,
  FileText,
  Filter,
  ChevronRight,
  Lock,
} from "lucide-react";

const StudyMaterial = () => {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = studyNotes.filter((note) => {
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Study Material</h1>
        <p className="text-sm text-slate-500">Access subject-wise notes and resources</p>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject.name)}
            className={`bg-white border shadow-sm p-3 sm:p-4 text-left transition-all hover:shadow ${
              selectedSubject === subject.name
                ? "border-slate-800 ring-1 ring-slate-800"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center mb-2 sm:mb-3"
              style={{ backgroundColor: subject.color + "15" }}
            >
              <BookOpen size={14} style={{ color: subject.color }} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-0.5 truncate">{subject.name}</p>
            <p className="text-[10px] sm:text-xs text-slate-400">{subject.totalNotes} notes</p>
            <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setSelectedSubject("All")}
          className={`btn-secondary text-xs py-3 flex items-center justify-center gap-1.5 ${
            selectedSubject === "All" ? "bg-slate-900 text-white border-slate-900" : ""
          }`}
        >
          <Filter size={14} />
          All Subjects
        </button>
      </div>

      {/* Recently Accessed */}
      <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Recently Accessed</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {recentMaterials.map((material) => (
            <div
              key={material.id}
              className="flex items-center gap-3 p-3 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 bg-amber-50 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{material.title}</p>
                <p className="text-xs text-slate-400">{material.subject} &middot; {material.date}</p>
              </div>
              <ChevronRight size={14} className="text-slate-300 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Notes List */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {selectedSubject === "All" ? "All Notes" : selectedSubject}
            <span className="text-slate-400 font-normal ml-2 text-sm">({filteredNotes.length})</span>
          </h2>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <FileText size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No notes found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-800 truncate">{note.title}</p>
                    <ContentBadge tier={note.tier} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {note.subject} &middot; {note.pages} pages &middot; {note.size}
                  </p>
                </div>
                {note.tier === "premium" ? (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all shrink-0 rounded-sm">
                    <Lock size={13} />
                    <span className="hidden sm:inline">Unlock</span>
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0 rounded-sm">
                    <Download size={13} />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;
