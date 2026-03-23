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
  return response.json();
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

  // Content (Lectures, Notes, Assignments)
  fetchEnrolledGroups: () =>
    fetch("/api/student/groups/enrolled", { headers: getAuthHeaders() }).then(handleResponse),

  fetchAvailableGroups: () =>
    fetch("/api/student/groups/available", { headers: getAuthHeaders() }).then(handleResponse),

  joinGroup: (groupId) =>
    fetch(`/api/student/groups/${groupId}/join`, {
      method: "POST",
      headers: getAuthHeaders(),
    }).then(handleResponse),

  fetchVideosBySubject: (subjectId) =>
    fetch(`/api/student/subjects/${subjectId}/videos`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchChaptersBySubject: (subjectId) =>
    fetch(`/api/student/subjects/${subjectId}/chapters`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchVideosByChapter: (chapterId) =>
    fetch(`/api/student/chapters/${chapterId}/videos`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchNotesByChapter: (chapterId) =>
    fetch(`/api/student/chapters/${chapterId}/notes`, { headers: getAuthHeaders() }).then(handleResponse),

  fetchRecentMaterials: () =>
    fetch("/api/student/notes/downloaded", { headers: getAuthHeaders() }).then(handleResponse),

  updateVideoProgress: (videoId, watchTime, completionPercentage) =>
    fetch("/api/student/videos/progress", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ videoId, watchTime, completionPercentage }),
    }).then(handleResponse),

  fetchNotesBySubject: (subjectId) =>
    fetch(`/api/student/subjects/${subjectId}/notes`, { headers: getAuthHeaders() }).then(handleResponse),

  // Announcements & Chat
  fetchAnnouncements: () =>
    fetch("/api/student/announcements", { headers: getAuthHeaders() }).then(handleResponse),

  fetchChatMessages: (groupId) =>
    fetch(`/api/student/groups/${groupId}/chat`, { headers: getAuthHeaders() }).then(handleResponse),

  sendMessage: (groupId, message) =>
    fetch("/api/student/groups/chat/send", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ groupId, message }),
    }).then(handleResponse),

  fetchTeachers: () =>
    fetch("/api/student/teachers", { headers: getAuthHeaders() }).then(handleResponse),

  fetchMySubmissions: () =>
    fetch("/api/student/assignments/my-submissions", { headers: getAuthHeaders() }).then(handleResponse),

  fetchMockTestScores: () =>
    fetch("/api/student/results", { headers: getAuthHeaders() }).then(handleResponse),

  fetchProgressReport: () =>
    fetch("/api/student/progress-report", { headers: getAuthHeaders() }).then(handleResponse),

  submitAssignment: (data) =>
    fetch("/api/student/assignments/submit", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Payments & Subscriptions
  initiatePayment: (data) =>
    fetch("/api/student/payments/initiate", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  verifyPayment: (paymentId, transactionId) =>
    fetch("/api/student/payments/verify", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentId, transactionId }),
    }).then(handleResponse),

  fetchPaymentHistory: () =>
    fetch("/api/student/payments/history", { headers: getAuthHeaders() }).then(handleResponse),
};
