const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const studentApi = {
  // Dashboard & Profile
  fetchDashboard: () =>
    fetch("/api/student/dashboard", { headers: getAuthHeaders() }).then(handleResponse),

  updateProfile: (data) =>
    fetch("/api/student/profile", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Classes & Subjects
  fetchClasses: () =>
    fetch("/api/student/classes", { headers: getAuthHeaders() }).then(handleResponse),

  fetchSubjects: () =>
    fetch("/api/student/subjects", { headers: getAuthHeaders() }).then(handleResponse),

  fetchSubjectsByClass: (classId) =>
    fetch(`/api/student/subjects/by-class/${classId}`, { headers: getAuthHeaders() }).then(handleResponse),

  // Teachers
  fetchTeachers: () =>
    fetch("/api/student/teachers", { headers: getAuthHeaders() }).then(handleResponse),

  fetchTeachersBySubject: (subjectId) =>
    fetch(`/api/student/teachers/by-subject/${subjectId}`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchTeacherById: (teacherId) =>
    fetch(`/api/student/teachers/${teacherId}`, { headers: getAuthHeaders() }).then(handleResponse),

  // Chapters
  fetchChaptersBySubject: (subjectId) =>
    fetch(`/api/student/subjects/${subjectId}/chapters`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchChaptersByTeacher: (teacherId) =>
    fetch(`/api/student/teachers/${teacherId}/chapters`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchChaptersByTeacherAndSubject: (teacherId, subjectId) =>
    fetch(`/api/student/teachers/${teacherId}/subjects/${subjectId}/chapters`, { headers: getAuthHeaders() }).then(handleResponse),

  // Videos
  fetchVideosBySubject: (subjectId) =>
    fetch(`/api/student/subjects/${subjectId}/videos`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchVideosByChapter: (chapterId) =>
    fetch(`/api/student/chapters/${chapterId}/videos`, { headers: getAuthHeaders() }).then(handleResponse),

  updateVideoProgress: (videoId, watchTime, completionPercentage) =>
    fetch("/api/student/videos/progress", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ videoId, watchTime, completionPercentage }),
    }).then(handleResponse),

  // Notes
  fetchNotesBySubject: (subjectId) =>
    fetch(`/api/student/subjects/${subjectId}/notes`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchNotesByChapter: (chapterId) =>
    fetch(`/api/student/chapters/${chapterId}/notes`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchRecentMaterials: () =>
    fetch("/api/student/notes/downloaded", { headers: getAuthHeaders() }).then(handleResponse),

  trackNoteDownload: (noteId) =>
    fetch(`/api/student/notes/${noteId}/download`, {
      method: "POST",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Assignments
  fetchAssignmentsByChapter: (chapterId) =>
    fetch(`/api/student/chapters/${chapterId}/assignments`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchMySubmissions: () =>
    fetch("/api/student/assignments/my-submissions", { headers: getAuthHeaders() }).then(handleResponse),

  submitAssignment: (data) =>
    fetch("/api/student/assignments/submit", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Groups
  fetchAvailableGroups: () =>
    fetch("/api/student/groups/available", { headers: getAuthHeaders() }).then(handleResponse),

  joinGroup: (groupId) =>
    fetch("/api/student/groups/join", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ groupId }),
    }).then(handleResponse),

  // Chat
  fetchChatMessages: (groupId) =>
    fetch(`/api/student/groups/${groupId}/chat`, { headers: getAuthHeaders() }).then(handleResponse),

  sendMessage: (groupId, message) =>
    fetch("/api/student/chat/send", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ groupId, message }),
    }).then(handleResponse),

  // Results & Progress
  fetchMockTestScores: () =>
    fetch("/api/student/results", { headers: getAuthHeaders() }).then(handleResponse),

  fetchProgressReport: () =>
    fetch("/api/student/progress-report", { headers: getAuthHeaders() }).then(handleResponse),

  // Exams
  fetchExams: () =>
    fetch("/api/student/exams", { headers: getAuthHeaders() }).then(handleResponse),

  selectExam: (examId) =>
    fetch("/api/student/select-exam", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ examId }),
    }).then(handleResponse),

  // Payments & Subscriptions
  createPayment: (data) =>
    fetch("/api/student/payments", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  fetchPayments: () =>
    fetch("/api/student/payments", { headers: getAuthHeaders() }).then(handleResponse),

  // Bookmarks
  addBookmark: (data) =>
    fetch("/api/student/bookmarks", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  removeBookmark: (bookmarkType, contentId) =>
    fetch(`/api/student/bookmarks/${bookmarkType}/${contentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  fetchBookmarks: () =>
    fetch("/api/student/bookmarks", { headers: getAuthHeaders() }).then(handleResponse),
};
