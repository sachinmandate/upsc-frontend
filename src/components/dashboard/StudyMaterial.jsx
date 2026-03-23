import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import {
  BookOpen,
  Download,
  Search,
  FileText,
  Filter,
  ChevronRight,
} from "lucide-react";

const StudyMaterial = () => {
  const [subjects, setSubjects] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsData, materialsData] = await Promise.all([
        studentApi.fetchEnrolledGroups().catch(() => []),
        studentApi.fetchRecentMaterials().catch(() => [])
      ]);
      setSubjects(groupsData);
      setRecentNotes(materialsData);
      // allNotes can be populated from the selected subject's notes
      setAllNotes([]); 
    } catch (error) {
      console.error("Error loading study material:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (subjectId) => {
    try {
      const notesData = await studentApi.fetchNotesBySubject(subjectId);
      setAllNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    // Find subject ID by name if needed, or update subjects state to include ID
    const subject = subjects.find(s => s.name === selectedSubject);
    if (subject) {
      fetchNotes(subject.id);
    } else if (selectedSubject === "All") {
      setAllNotes([]);
    }
  }, [selectedSubject, subjects]);

  const filteredNotes = allNotes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
              style={{ backgroundColor: (subject.color || "#1e293b") + "15" }}
            >
              <BookOpen size={14} style={{ color: subject.color || "#1e293b" }} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-0.5 truncate">{subject.name}</p>
            <p className="text-[10px] sm:text-xs text-slate-400">{subject.totalNotes || 0} notes</p>
            <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${subject.progress || 0}%`, backgroundColor: subject.color || "#1e293b" }}
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
      {recentNotes.length > 0 && (
        <div className="bg-white border border-slate-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Recently Accessed</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {recentNotes.map((material) => (
              <div
                key={material.id}
                className="flex items-center gap-3 p-3 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer"
              >
                <div className="w-9 h-9 bg-amber-50 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{material.title}</p>
                  <p className="text-xs text-slate-400">{material.subjectName || material.subject} &middot; {material.date || "Today"}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="bg-white border border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {selectedSubject === "All" ? "All Notes" : selectedSubject}
            <span className="text-slate-400 font-normal ml-2 text-sm">({filteredNotes.length})</span>
          </h2>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No notes available</p>
            <p className="text-xs text-slate-300 mt-1">Check back later for updated study materials.</p>
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
                  <p className="text-sm font-medium text-slate-800 truncate">{note.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {note.subject} &middot; {note.pages} pages &middot; {note.size}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shrink-0 rounded-sm">
                  <Download size={13} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;
