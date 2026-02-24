import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { availableSubjects } from "../../data/dashboardData";
import {
  Scale,
  BookOpen,
  TrendingUp,
  Globe,
  Leaf,
  Brain,
  Atom,
  Heart,
  Shield,
  Check,
  Landmark,
} from "lucide-react";

const iconMap = {
  Scale, BookOpen, TrendingUp, Globe, Leaf, Brain, Atom, Heart, Shield,
};

const subjectColors = [
  "#312e81", "#9333ea", "#d97706", "#059669", "#65a30d",
  "#dc2626", "#0284c7", "#e11d48", "#7c3aed", "#0d9488",
];

const SubjectSelection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedSubjects");
    if (saved) {
      try { setSelected(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const toggleSubject = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (selected.length < 3) return;
    localStorage.setItem("selectedSubjects", JSON.stringify(selected));
    navigate("/dashboard/student");
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-5 sm:px-8 shrink-0">
        <Landmark className="text-slate-900 shrink-0" size={22} />
        <span className="ml-3 font-bold text-base text-slate-900 tracking-tight font-serif uppercase">
          MPSC–UPSC
        </span>
      </header>

      <div className="flex-1 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Select Your Subjects
            </h1>
            <p className="text-sm text-slate-500">
              Choose the subjects you are preparing for. You can change this later from your profile.
            </p>
          </div>

          {/* Selection count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Choose at least 3 subjects
            </p>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1">
              {selected.length} of {availableSubjects.length} selected
            </span>
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {availableSubjects.map((subject, index) => {
              const Icon = iconMap[subject.icon] || BookOpen;
              const color = subjectColors[index % subjectColors.length];
              const isSelected = selected.includes(subject.id);

              return (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`relative bg-white border shadow-sm p-4 text-left transition-all hover:shadow ${
                    isSelected
                      ? "border-slate-800 ring-1 ring-slate-800"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-slate-900 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className="w-9 h-9 flex items-center justify-center mb-3"
                    style={{ backgroundColor: color + "15" }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-0.5">{subject.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {subject.category}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm p-5">
            {selected.length < 3 && (
              <p className="text-xs text-red-500 font-medium">
                Please select at least 3 subjects to continue
              </p>
            )}
            {selected.length >= 3 && (
              <p className="text-xs text-green-600 font-medium">
                {selected.length} subjects selected — you're good to go!
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={selected.length < 3}
              className={`btn-primary px-8 py-2.5 text-sm shrink-0 ${
                selected.length < 3 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
