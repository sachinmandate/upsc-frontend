import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  Video,
  FileText,
  ChevronLeft,
  Play,
  Download,
  CheckCircle2,
  Clock,
  User,
  X,
  Lock,
  LockOpen,
} from "lucide-react";
import { toast } from "sonner";

const CourseView = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("videos"); // videos, notes, assignments
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Interval for updating progress
  useEffect(() => {
    let interval;
    if (showVideoModal && selectedVideo) {
      interval = setInterval(() => {
        const videoElement = document.getElementById("course-video-player");
        if (videoElement && !videoElement.paused) {
           const currentTime = Math.floor(videoElement.currentTime);
           const duration = videoElement.duration || selectedVideo.duration || 1;
           const percentage = Math.floor((currentTime / duration) * 100);
           
           studentApi.updateVideoProgress(selectedVideo.id, currentTime, percentage)
             .catch(err => console.error("Error updating progress:", err));
        }
      }, 5000); // Every 5 seconds
    }
    return () => clearInterval(interval);
  }, [showVideoModal, selectedVideo]);

  useEffect(() => {
    loadCourseData();
  }, [subjectId]);

  const loadCourseData = async () => {
    setLoading(true);
    try {
      // Get subject details (from enrolled groups)
      const groups = await studentApi.fetchEnrolledGroups();
      const currentSubject = groups.find((g) => g.id.toString() === subjectId);
      setSubject(currentSubject);

      if (currentSubject) {
          // Fetch chapters for this subject
          // Note: Backend might need an endpoint for this, for now we simulate or use a combined one
          // Looking at StudentController, we have /teachers/{teacherId}/subjects/{subjectId}/chapters
          // But since we are in CourseView by subjectId, we might need a better way.
          // For now, let's assume we can fetch chapters by subjectId
          const chaptersData = await studentApi.fetchChaptersBySubject(subjectId);
          setChapters(chaptersData);
          if (chaptersData.length > 0) {
              setSelectedChapter(chaptersData[0]);
              fetchChapterContent(chaptersData[0].id);
          }
      }
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterContent = async (chapterId) => {
      try {
          const [videosData, notesData] = await Promise.all([
              studentApi.fetchVideosByChapter(chapterId),
              studentApi.fetchNotesByChapter(chapterId)
          ]);
          setVideos(videosData);
          setNotes(notesData);
      } catch (error) {
          console.error("Error fetching chapter content:", error);
      }
  };

  const handleVideoClick = (video) => {
      if (video.isPaid && !video.isSubscribed) {
          toast.error("This is a premium video. Please subscribe to watch.", {
              action: {
                  label: "Subscribe",
                  onClick: () => navigate("/dashboard/student/subscriptions")
              }
          });
          return;
      }
      setSelectedVideo(video);
      setShowVideoModal(true);
      // Wait for element to render then seek
      setTimeout(() => {
          const videoElement = document.getElementById("course-video-player");
          if (videoElement && video.lastWatchTime) {
              videoElement.currentTime = video.lastWatchTime;
          }
      }, 500);
  };

  const handleChapterClick = (chapter) => {
      setSelectedChapter(chapter);
      fetchChapterContent(chapter.id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!subject) {
      return (
          <div className="text-center py-20">
              <h2 className="text-xl font-bold text-slate-800">Subject not found</h2>
              <Link to="/dashboard/student" className="text-amber-600 hover:underline mt-2 inline-block">
                  Back to Dashboard
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div>
        <Link
          to="/dashboard/student"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest mb-3"
        >
          <ChevronLeft size={14} />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{subject.name}</h1>
            <p className="text-sm text-slate-500">
              Teacher: {subject.teacherName} &middot; {chapters.length} Chapters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Your Progress
              </p>
              <p className="text-sm font-bold text-slate-900">{subject.progress || 0}% Complete</p>
            </div>
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center">
               <span className="text-xs font-bold text-slate-800">{subject.progress || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Chapters</h2>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                className={`w-full text-left p-4 border transition-all hover:bg-slate-50 ${
                  selectedChapter?.id === chapter.id
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Chapter {index + 1}</p>
                <p className="text-sm font-bold leading-tight">{chapter.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {["videos", "notes", "assignments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                  activeTab === tab
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            {activeTab === "videos" && (
              <div className="divide-y divide-slate-100">
                {videos.length === 0 ? (
                  <div className="p-12 text-center">
                    <Video size={40} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-sm text-slate-400 font-bold">No videos in this chapter</p>
                  </div>
                ) : (
                  videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoClick(video)}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="relative w-full sm:w-48 aspect-video bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                        <Play size={24} className="text-slate-300 group-hover:scale-110 transition-transform" />
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5">
                          {video.duration}
                        </span>
                        {video.completionPercentage > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                            <div
                              className="h-full bg-amber-500"
                              style={{ width: `${video.completionPercentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-800 leading-snug">
                              {video.title}
                            </h3>
                            {video.isPaid && (
                              video.isSubscribed ? <LockOpen size={14} className="text-green-500" /> : <Lock size={14} className="text-amber-500" />
                            )}
                          </div>
                          {video.isCompleted && (
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {video.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {video.teacherName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="divide-y divide-slate-100">
                {notes.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText size={40} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-sm text-slate-400 font-bold">No notes in this chapter</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-50 flex items-center justify-center">
                          <FileText size={18} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{note.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {note.noteType} &middot; {note.fileSize}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (note.isPaid && !note.isSubscribed) {
                            toast.error("Premium content. Please subscribe to download.");
                            return;
                          }
                          // Handle download
                        }}
                        className={`btn-secondary py-2 px-4 text-xs flex items-center gap-2 ${note.isPaid && !note.isSubscribed ? 'opacity-50' : ''}`}
                      >
                        {note.isPaid && !note.isSubscribed ? <Lock size={14} /> : <Download size={14} />}
                        Download PDF
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "assignments" && (
                <div className="p-12 text-center">
                    <CheckCircle2 size={40} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-sm text-slate-400 font-bold">No assignments for this chapter yet</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/98 z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl flex justify-between items-center mb-4 px-2">
                <div className="min-w-0">
                    <h2 className="text-white text-lg font-bold truncate">{selectedVideo.title}</h2>
                    <p className="text-slate-400 text-xs truncate">{selectedVideo.chapterName}</p>
                </div>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center rounded-full transition-colors shrink-0"
                >
                    <X size={24} />
                </button>
            </div>
            
            <div className="w-full max-w-5xl aspect-video bg-black/40 border border-white/5 relative shadow-2xl">
                <video 
                  id="course-video-player"
                  src={selectedVideo.videoUrl} 
                  controls 
                  autoPlay
                  className="w-full h-full"
                />
            </div>
            
            <div className="w-full max-w-5xl mt-6 px-2 text-slate-300">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Description</h3>
                <p className="text-sm opacity-80 leading-relaxed">{selectedVideo.description}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
