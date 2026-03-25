import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import {
  Play,
  User,
  CheckCircle2,
  X
} from "lucide-react";

const subjectColors = {
  "Indian Polity": "#312e81",
  "History": "#9333ea",
  "Economy": "#d97706",
  "Geography": "#059669",
  "Environment": "#65a30d",
  "CSAT": "#dc2626",
};

const VideoLectures = () => {
  const [filterSubject, setFilterSubject] = useState("All");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Video Player Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
        fetchVideos(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  // Sync video progress to backend every 5 seconds
  useEffect(() => {
    let interval;
    if (showVideoModal && selectedVideo) {
      interval = setInterval(() => {
        const videoElement = document.getElementById("course-video-player");
        if (videoElement && !videoElement.paused) {
           const currentTime = Math.floor(videoElement.currentTime);
           const duration = videoElement.duration || 1;
           const percentage = Math.floor((currentTime / duration) * 100);
           
           studentApi.updateVideoProgress(selectedVideo.id, currentTime, percentage)
             .catch(err => console.error("Error updating progress:", err));
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [showVideoModal, selectedVideo]);

  const loadData = async () => {
    setLoading(true);
    try {
      const subjectsData = await studentApi.fetchSubjects();
      setSubjects(subjectsData);
      
      if (subjectsData.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(subjectsData[0].id);
          setFilterSubject(subjectsData[0].name);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (subjectId) => {
      try {
          const videosData = await studentApi.fetchVideosBySubject(subjectId);
          setVideos(videosData);
      } catch (error) {
          console.error("Error fetching videos:", error);
      }
  };

  const handleVideoClick = (video) => {
      setSelectedVideo(video);
      setShowVideoModal(true);
      setTimeout(() => {
          const videoElement = document.getElementById("course-video-player");
          if (videoElement && video.lastWatchTime) {
              videoElement.currentTime = video.lastWatchTime;
          }
      }, 500);
  };

  const filtered = videos.filter(
    (v) => filterSubject === "All" || v.subject === filterSubject
  );

  const continueWatching = videos.filter((v) => v.progress > 0 && v.progress < 100);

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
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Video Lectures</h1>
        <p className="text-sm text-slate-500">Watch expert lectures at your own pace</p>
      </div>

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Continue Watching</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {continueWatching.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow transition-shadow group cursor-pointer"
              >
                <div
                  className="h-32 sm:h-36 relative flex items-center justify-center"
                  style={{ backgroundColor: (subjectColors[video.subject] || "#1e293b") + "12" }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Play size={20} className="text-slate-800 ml-1" />
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5">
                    {video.duration}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: subjectColors[video.subject] || "#1e293b" }}
                  >
                    {video.subject}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug line-clamp-2">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <User size={12} className="shrink-0" />
                      {video.teacher}
                    </span>
                    <span className="shrink-0">{video.progress}% done</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                  setFilterSubject("All");
                  setSelectedSubjectId(null);
              }}
              className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold border transition-all ${
                filterSubject === "All"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              All
            </button>
            {subjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => {
                    setFilterSubject(subj.name);
                    setSelectedSubjectId(subj.id);
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold border transition-all ${
                  filterSubject === subj.name
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {subj.name}
              </button>
            ))}
          </div>
      )}

      {/* All Videos */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          {filterSubject === "All" ? "All Lectures" : filterSubject}
          <span className="text-slate-400 font-normal ml-2 text-sm">({filtered.length})</span>
        </h2>
        
        {filtered.length === 0 && !loading ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-sm p-12 text-center">
                <Video size={40} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-900 mb-1">No lectures available</h3>
                <p className="text-xs text-slate-400">No video lectures found for the selected subject.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow transition-shadow group cursor-pointer"
              >
                <div
                  className="h-32 sm:h-36 relative flex items-center justify-center"
                  style={{ backgroundColor: (subjectColors[video.subject] || "#1e293b") + "12" }}
                >
                  {video.progress === 100 ? (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Play size={20} className="text-slate-800 ml-1" />
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5">
                    {video.duration}
                  </span>
                  {video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                      <div
                        className="h-full"
                        style={{
                          width: `${video.progress}%`,
                          backgroundColor: video.progress === 100 ? "#16a34a" : "#d97706",
                        }}
                      />
                    </div>
                  )}
                </div>
  
                <div className="p-3 sm:p-4">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: subjectColors[video.subject] || "#1e293b" }}
                  >
                    {video.subject}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug line-clamp-2">
                    {video.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <User size={12} className="shrink-0" />
                      {video.teacher}
                    </span>
                    {video.progress === 100 && (
                      <span className="text-green-600 font-semibold shrink-0 ml-2">Completed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl flex justify-between items-center mb-4 px-2">
                <div className="min-w-0 pr-12">
                    <h2 className="text-white text-lg font-bold truncate">{selectedVideo.title}</h2>
                    <p className="text-slate-400 text-xs truncate">{selectedVideo.subject}</p>
                </div>
                <button 
                  onClick={() => {
                      setShowVideoModal(false);
                      setSelectedVideo(null);
                  }}
                  className="absolute top-4 right-4 z-[110] w-10 h-10 bg-black/50 hover:bg-white/20 text-white flex items-center justify-center rounded-full transition-colors shrink-0"
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
                <p className="text-sm opacity-80 leading-relaxed">{selectedVideo.description || "No description provided."}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default VideoLectures;
