import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Badge from '../../components/common/Badge';
import { toast } from 'sonner';
import * as teacherApi from '../../api/teacherApi';
import { Plus, Video, Trash2, ChevronRight, X, FileText, Layers, BookOpen, Download, Link } from 'lucide-react';

const SubjectsPage = ({ classesList }) => {
  const [activeTab, setActiveTab] = useState('classes');

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [subjectsList, setSubjectsList] = useState([]);
  const [chaptersList, setChaptersList] = useState([]);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [videosList, setVideosList] = useState([]);
  const [notesList, setNotesList] = useState([]);

  // Forms
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');
  const [chapterVideo, setChapterVideo] = useState('');

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoContentType, setVideoContentType] = useState('FREE');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteType, setNoteType] = useState('PDF');
  const [noteContentType, setNoteContentType] = useState('FREE');

  const fetchSubjects = async (classId) => {
    try {
      const data = await teacherApi.fetchMySubjects();
      console.log("DAta received = ", data);
      // Temporarily removing strict filtering since frontend/backend mapping might not strictly align
      // or subjects might lack classEntity values right now.
      if (Array.isArray(data)) {
        // Just show all teacher subjects, or attempt loose matching if they heavily mis-map 
        // Best approach right now is to just display the data array returned directly
        setSubjectsList(data);
      } else {
        setSubjectsList([]);
      }
    } catch (err) {
      console.log("Error fetching subjects on subjects page = ", err.message)
      toast.error("Error fetching subjects");
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      const data = await teacherApi.fetchMyChapters();
      const filtered = Array.isArray(data) ? data.filter(c => {
        const cSubId = c.subject ? c.subject.id : c.subjectId;
        return cSubId === subjectId;
      }) : [];
      setChaptersList(filtered);
    } catch (err) {
      toast.error("Error fetching chapters");
    }
  };

  const fetchVideos = async (chapterId) => {
    const data = await teacherApi.fetchVideosByChapter(chapterId);
    setVideosList(Array.isArray(data) ? data : []);
  };

  const fetchNotes = async (chapterId) => {
    const data = await teacherApi.fetchNotesByChapter(chapterId);
    setNotesList(Array.isArray(data) ? data : []);
  };

  const fetchAssignments = async (chapterId) => {
    const data = await teacherApi.fetchAssignments(chapterId);
    setAssignmentsList(Array.isArray(data) ? data : []);
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!chapterTitle.trim() || !selectedSubject) return;
    try {
      const res = await teacherApi.createChapter({
        title: chapterTitle,
        description: chapterDesc,
        subjectId: selectedSubject.id,
        videoUrl: chapterVideo
      });

      if (res.success) {
        toast.success("Chapter created successfully");
        setShowChapterForm(false);
        setChapterTitle(''); setChapterDesc(''); setChapterVideo('');
        fetchChapters(selectedSubject.id);
      } else {
        toast.error("Failed to create chapter");
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;
    const res = await teacherApi.uploadVideo({
      title: videoTitle,
      videoUrl: videoUrl,
      contentType: videoContentType,
      chapterId: selectedChapter.id
    });
    if (res) {
      toast.success("Video added");
      setVideoTitle(''); setVideoUrl(''); setShowVideoForm(false);
      fetchVideos(selectedChapter.id);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const res = await teacherApi.uploadNote({
      title: noteTitle,
      noteType: noteType,
      contentType: noteContentType,
      chapterId: selectedChapter.id
    });
    if (res) {
      toast.success("Note placeholder added");
      setNoteTitle(''); setShowNoteForm(false);
      fetchNotes(selectedChapter.id);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentTitle.trim() || !assignmentDueDate) return;
    const res = await teacherApi.createAssignment({
      title: assignmentTitle,
      description: assignmentDesc,
      dueDate: assignmentDueDate,
      chapterId: selectedChapter.id,
      classId: selectedClass?.id,
      subjectId: selectedSubject?.id
    });
    if (res) {
      toast.success("Assignment created");
      setAssignmentTitle(''); setAssignmentDesc(''); setAssignmentDueDate(''); setShowAssignmentForm(false);
      fetchAssignments(selectedChapter.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Curriculum Content</h2>
          <p className="text-sm text-gray-500 mt-1">Select a class and subject to manage chapters, videos, notes, and assignments.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['classes', 'subjects', 'chapters', 'chapter-details'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
                if (tab === 'chapter-details' && !selectedChapter) {
                    toast.error("Select a chapter first");
                    return;
                }
                setActiveTab(tab);
            }}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classesList && classesList.map((cls) => {
            const isSelected = selectedClass?.id === cls.id;
            return (
              <Card
                key={cls.id}
                className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                  }`}
              >
                <div
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSubject(null);
                    setSelectedChapter(null);
                    fetchSubjects(cls.id);
                    setActiveTab('subjects');
                  }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 flex gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{cls.name || "Class"}</h3>
                        <p className="text-sm text-gray-500 mt-1">{cls.stream || "General"}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  </div>
                </div>
              </Card>
            );
          })}
          {classesList.length === 0 && (
            <div className="col-span-3 text-center py-10 text-slate-500">No classes assigned.</div>
          )}
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="space-y-4">
          {selectedClass ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500 cursor-pointer hover:underline" onClick={() => setActiveTab('classes')}>Classes</span>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-800">{selectedClass.name}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectsList.map((subject) => {
                  const isSelected = selectedSubject?.id === subject.id;
                  return (
                    <Card
                      key={subject.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                        }`}
                    >
                      <div
                        onClick={() => {
                          setSelectedSubject(subject);
                          setSelectedChapter(null);
                          fetchChapters(subject.id);
                          setActiveTab('chapters');
                        }}
                        className="p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 flex gap-3">
                            <div className="bg-indigo-50 p-2 text-indigo-500 rounded-lg">
                              <BookOpen size={20} />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">{subject.name}</h3>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{subject.description || "No description"}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {subjectsList.length === 0 && (
                  <div className="col-span-3 text-center py-10 text-slate-500">No subjects found for this class.</div>
                )}
              </div>
            </>
          ) : (
            <Card><CardContent className="py-12 text-center text-slate-500">Select a class first from the Classes tab.</CardContent></Card>
          )}
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="space-y-4">
          {selectedSubject ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveTab('classes')} className="text-sm text-gray-500 hover:text-gray-900">
                    {selectedClass?.name}
                  </button>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <button onClick={() => setActiveTab('subjects')} className="text-sm text-gray-500 hover:text-gray-900">
                    {selectedSubject.name}
                  </button>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Chapters</span>
                </div>
                <Button size="sm" onClick={() => setShowChapterForm(true)}>
                  <Plus className="h-4 w-4" />
                  Add Chapter
                </Button>
              </div>

              {showChapterForm && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Add New Chapter</CardTitle>
                    <button onClick={() => setShowChapterForm(false)} className="p-1 rounded-lg hover:bg-gray-100">
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateChapter} className="space-y-4">
                      <Input
                        label="Chapter Title"
                        placeholder="e.g. Introduction to Calculus"
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                        required
                      />
                      <Textarea
                        label="Description"
                        placeholder="Brief description of the chapter"
                        value={chapterDesc}
                        onChange={(e) => setChapterDesc(e.target.value)}
                      />
                      <Input
                        label="Video URL (Optional)"
                        placeholder="https://youtube.com/watch?v=..."
                        value={chapterVideo}
                        onChange={(e) => setChapterVideo(e.target.value)}
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setShowChapterForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Chapter</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {chaptersList.length > 0 ? (
                <div className="space-y-3">
                  {chaptersList.map((chapter) => (
                    <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between p-5">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="rounded-lg bg-gray-100 p-2.5">
                            <Video className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900">{chapter.title}</h4>
                            <p className="text-sm text-gray-500 mt-0.5 truncate">{chapter.description}</p>
                            {chapter.videoUrl && (
                              <p className="text-xs text-blue-600 mt-1 truncate">{chapter.videoUrl}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => {
                              setSelectedChapter(chapter);
                              fetchVideos(chapter.id);
                              fetchNotes(chapter.id);
                              fetchAssignments(chapter.id);
                              setActiveTab('chapter-details');
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                          >
                            Manage Content
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Video className="h-10 w-10 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-500 mt-3">No chapters yet. Add your first chapter.</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-gray-500">Select a subject first from the Subjects tab.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'chapter-details' && (
        <div className="space-y-6">
          {selectedChapter ? (
            <>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-3 text-sm">
                <button onClick={() => setActiveTab('subjects')} className="text-gray-500 hover:text-gray-900 transition-colors">
                  {selectedSubject?.name}
                </button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <button onClick={() => setActiveTab('chapters')} className="text-gray-500 hover:text-gray-900 transition-colors">
                  {selectedChapter.title}
                </button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900 border-b-2 border-indigo-600 pb-0.5">Chapter Details</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Videos & Notes */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Videos Section */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Video className="h-5 w-5 text-indigo-500" />
                          Video Lectures
                        </CardTitle>
                        <CardDescription>Video content for students</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setShowVideoForm(!showVideoForm)}>
                        <Plus className="h-4 w-4" />
                        {showVideoForm ? 'Close' : 'Add Video'}
                      </Button>
                    </CardHeader>
                    {showVideoForm && (
                      <CardContent className="border-b bg-slate-50/50">
                        <form onSubmit={handleCreateVideo} className="space-y-4 py-2">
                          <Input label="Video Title" placeholder="e.g. Overview of Calculus" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required />
                          <Input label="Video URL" placeholder="YouTube or Video Link" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
                          <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-1.5 block">Access Type</label>
                                <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-950" value={videoContentType} onChange={(e) => setVideoContentType(e.target.value)}>
                                    <option value="FREE">Free</option>
                                    <option value="PAID">Paid</option>
                                </select>
                            </div>
                            <div className="flex-1 flex items-end">
                                <Button type="submit" className="w-full">Add Video</Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    )}
                    <CardContent className="p-0">
                      {videosList.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {videosList.map(v => (
                            <div key={v.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-indigo-50 p-2 rounded text-indigo-600">
                                  <Link size={16} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{v.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{v.videoUrl}</p>
                                </div>
                              </div>
                              <Badge variant={v.contentType === 'PAID' ? 'warning' : 'success'}>{v.contentType}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center text-gray-500 text-sm">No videos uploaded.</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Notes Section */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <FileText className="h-5 w-5 text-emerald-500" />
                          Study Notes (PDF/PPT)
                        </CardTitle>
                        <CardDescription>Reading material for students</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setShowNoteForm(!showNoteForm)}>
                        <Plus className="h-4 w-4" />
                        {showNoteForm ? 'Close' : 'Add Note'}
                      </Button>
                    </CardHeader>
                    {showNoteForm && (
                      <CardContent className="border-b bg-slate-50/50">
                        <form onSubmit={handleCreateNote} className="space-y-4 py-2">
                          <Input label="Note Title" placeholder="e.g. Calculus Formulas PDF" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} required />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">File Type</label>
                                <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-950" value={noteType} onChange={(e) => setNoteType(e.target.value)}>
                                    <option value="PDF">PDF Document</option>
                                    <option value="PPT">PowerPoint</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Access Type</label>
                                <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-950" value={noteContentType} onChange={(e) => setNoteContentType(e.target.value)}>
                                    <option value="FREE">Free</option>
                                    <option value="PAID">Paid</option>
                                </select>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Add Note Entry</Button>
                          </div>
                        </form>
                      </CardContent>
                    )}
                    <CardContent className="p-0">
                      {notesList.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notesList.map(n => (
                            <div key={n.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 p-2 rounded text-emerald-600">
                                  <FileText size={16} />
                                </div>
                                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{n.noteType}</Badge>
                                <Badge variant={n.contentType === 'PAID' ? 'warning' : 'success'}>{n.contentType}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center text-gray-500 text-sm">No notes uploaded.</div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Assignments */}
                <div className="space-y-6">
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Assignments</CardTitle>
                        <CardDescription>Track student tasks</CardDescription>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setShowAssignmentForm(!showAssignmentForm)}>
                        {showAssignmentForm ? <X size={16} /> : <Plus size={16} />}
                      </Button>
                    </CardHeader>
                    {showAssignmentForm && (
                      <CardContent className="border-b bg-gray-50/50">
                        <form onSubmit={handleCreateAssignment} className="space-y-3 py-2">
                          <Input label="Title" bsSize="sm" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} required />
                          <Input label="Due Date" type="date" bsSize="sm" value={assignmentDueDate} onChange={(e) => setAssignmentDueDate(e.target.value)} required />
                          <Textarea label="Desc" value={assignmentDesc} onChange={(e) => setAssignmentDesc(e.target.value)} />
                          <Button type="submit" size="sm" className="w-full">Create</Button>
                        </form>
                      </CardContent>
                    )}
                    <CardContent className={assignmentsList.length > 0 ? 'p-0' : 'p-6'}>
                      {assignmentsList.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {assignmentsList.map(item => (
                            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] font-bold text-rose-600 uppercase">Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 h-4">Marks: {item.totalMarks}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Plus className="h-8 w-8 text-gray-300 mx-auto" strokeWidth={1.5} />
                          <p className="text-xs text-gray-400 mt-2">No assignments yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-20 text-center">
                <Video className="h-10 w-10 text-gray-200 mx-auto" />
                <p className="text-sm text-gray-500 mt-4">Select a chapter from the chapters tab to manage content.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('chapters')}>Back to Chapters</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;