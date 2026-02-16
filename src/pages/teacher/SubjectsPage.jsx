import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { Plus, Video, Pencil, Trash2, ChevronRight, X, FileText } from 'lucide-react';

const SubjectsPage = ({
  subjects,
  chapters,
  onSubjectCreated,
  onChapterCreated,
  onChapterDelete,
  onAssignmentCreated,
}) => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const [subjectName, setSubjectName] = useState('');
  const [subjectDesc, setSubjectDesc] = useState('');

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');
  const [chapterVideo, setChapterVideo] = useState('');

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');

  const filteredChapters = selectedSubject
    ? chapters.filter((c) => c.subjectId === selectedSubject.id)
    : [];

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    onSubjectCreated({ name: subjectName, description: subjectDesc });
    setSubjectName('');
    setSubjectDesc('');
    setShowSubjectForm(false);
  };

  const handleCreateChapter = (e) => {
    e.preventDefault();
    if (!chapterTitle.trim() || !selectedSubject) return;
    onChapterCreated({
      subjectId: selectedSubject.id,
      title: chapterTitle,
      description: chapterDesc,
      videoUrl: chapterVideo,
    });
    setChapterTitle('');
    setChapterDesc('');
    setChapterVideo('');
    setShowChapterForm(false);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!assignmentTitle.trim() || !selectedChapter) return;
    onAssignmentCreated({
      chapterId: selectedChapter.id,
      title: assignmentTitle,
      description: assignmentDesc,
      dueDate: assignmentDueDate,
    });
    setAssignmentTitle('');
    setAssignmentDesc('');
    setAssignmentDueDate('');
    setShowAssignmentForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Classes & Subjects</h2>
          <p className="text-sm text-gray-500 mt-1">Manage subjects, chapters, and assignments.</p>
        </div>
        <Button onClick={() => setShowSubjectForm(true)}>
          <Plus className="h-4 w-4" />
          New Subject
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['subjects', 'chapters', 'assignments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {showSubjectForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Create New Subject</CardTitle>
            <button onClick={() => setShowSubjectForm(false)} className="p-1 rounded-lg hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <Input
                label="Subject Name"
                placeholder="e.g. Mathematics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
              <Textarea
                label="Description"
                placeholder="Brief description of the subject"
                value={subjectDesc}
                onChange={(e) => setSubjectDesc(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <Button variant="secondary" type="button" onClick={() => setShowSubjectForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Subject</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const count = chapters.filter((c) => c.subjectId === subject.id).length;
            const isSelected = selectedSubject?.id === subject.id;
            return (
              <Card
                key={subject.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                }`}
              >
                <div
                  onClick={() => {
                    setSelectedSubject(subject);
                    setSelectedChapter(null);
                    setActiveTab('chapters');
                  }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{subject.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Badge>{count} {count === 1 ? 'chapter' : 'chapters'}</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="space-y-4">
          {selectedSubject ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedSubject(null);
                      setActiveTab('subjects');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    All Subjects
                  </button>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{selectedSubject.name}</span>
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
                      />
                      <Textarea
                        label="Description"
                        placeholder="Brief description of the chapter"
                        value={chapterDesc}
                        onChange={(e) => setChapterDesc(e.target.value)}
                      />
                      <Input
                        label="Video URL"
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

              {filteredChapters.length > 0 ? (
                <div className="space-y-3">
                  {filteredChapters.map((chapter) => (
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
                              setActiveTab('assignments');
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Create Assignment"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onChapterDelete(chapter.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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
                <p className="text-sm text-gray-500">Select a subject to view its chapters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {selectedChapter ? (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('chapters')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {selectedSubject?.name}
                </button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{selectedChapter.title}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Assignments</span>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Create Assignment</CardTitle>
                    <CardDescription>For: {selectedChapter.title}</CardDescription>
                  </div>
                  {!showAssignmentForm && (
                    <Button size="sm" onClick={() => setShowAssignmentForm(true)}>
                      <Plus className="h-4 w-4" />
                      New Assignment
                    </Button>
                  )}
                </CardHeader>
                {showAssignmentForm && (
                  <CardContent>
                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                      <Input
                        label="Assignment Title"
                        placeholder="e.g. Problem Set 1"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                      />
                      <Textarea
                        label="Instructions"
                        placeholder="Describe the assignment requirements"
                        value={assignmentDesc}
                        onChange={(e) => setAssignmentDesc(e.target.value)}
                      />
                      <Input
                        label="Due Date"
                        type="date"
                        value={assignmentDueDate}
                        onChange={(e) => setAssignmentDueDate(e.target.value)}
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="secondary" type="button" onClick={() => setShowAssignmentForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Assignment</Button>
                      </div>
                    </form>
                  </CardContent>
                )}
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-gray-500">Select a chapter from the chapters tab to manage assignments.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;