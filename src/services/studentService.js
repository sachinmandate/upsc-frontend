/**
 * Student Service
 * Handles all student API calls for dashboard, videos, notes, assignments, etc.
 */

import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData } from './api';

export const studentService = {
  // ==================== DASHBOARD ====================

  /**
   * Get student dashboard data
   */
  getDashboard: async () => {
    return apiGet('/student/dashboard');
  },

  /**
   * Update student profile
   */
  updateProfile: async (profileData) => {
    return apiPut('/student/profile', profileData);
  },

  // ==================== CLASSES & SUBJECTS ====================

  /**
   * Get all classes
   */
  getAllClasses: async () => {
    return apiGet('/student/classes');
  },

  /**
   * Get all subjects
   */
  getAllSubjects: async () => {
    return apiGet('/student/subjects');
  },

  /**
   * Get subjects by class
   */
  getSubjectsByClass: async (classId) => {
    return apiGet(`/student/subjects/by-class/${classId}`);
  },

  // ==================== TEACHERS ====================

  /**
   * Get all teachers
   */
  getAllTeachers: async () => {
    return apiGet('/student/teachers');
  },

  /**
   * Get teacher by ID
   */
  getTeacherById: async (teacherId) => {
    return apiGet(`/student/teachers/${teacherId}`);
  },

  /**
   * Get teachers by subject
   */
  getTeachersBySubject: async (subjectId) => {
    return apiGet(`/student/teachers/by-subject/${subjectId}`);
  },

  // ==================== CHAPTERS ====================

  /**
   * Get chapters by teacher
   */
  getChaptersByTeacher: async (teacherId) => {
    return apiGet(`/student/teachers/${teacherId}/chapters`);
  },

  /**
   * Get chapters by teacher and subject
   */
  getChaptersByTeacherAndSubject: async (teacherId, subjectId) => {
    return apiGet(
      `/student/teachers/${teacherId}/subjects/${subjectId}/chapters`
    );
  },

  // ==================== VIDEOS ====================

  /**
   * Get videos by subject
   */
  getVideosBySubject: async (subjectId) => {
    return apiGet(`/student/subjects/${subjectId}/videos`);
  },

  /**
   * Get videos by chapter
   */
  getVideosByChapter: async (chapterId) => {
    return apiGet(`/student/chapters/${chapterId}/videos`);
  },

  /**
   * Update video progress
   */
  updateVideoProgress: async (videoId, watchedDuration, completionPercentage) => {
    return apiPost('/student/videos/progress', {
      videoId,
      watchedDuration,
      completionPercentage,
    });
  },

  // ==================== NOTES ====================

  /**
   * Get notes by subject
   */
  getNotesBySubject: async (subjectId) => {
    return apiGet(`/student/subjects/${subjectId}/notes`);
  },

  /**
   * Get notes by chapter
   */
  getNotesByChapter: async (chapterId) => {
    return apiGet(`/student/chapters/${chapterId}/notes`);
  },

  /**
   * Track note download
   */
  trackNoteDownload: async (noteId) => {
    return apiPost(`/student/notes/${noteId}/download`, {});
  },

  /**
   * Get downloaded notes
   */
  getDownloadedNotes: async () => {
    return apiGet('/student/notes/downloaded');
  },

  // ==================== ASSIGNMENTS ====================

  /**
   * Get assignments by chapter
   */
  getAssignmentsByChapter: async (chapterId) => {
    return apiGet(`/student/chapters/${chapterId}/assignments`);
  },

  /**
   * Submit assignment
   */
  submitAssignment: async (assignmentId, submissionData) => {
    return apiPost('/student/assignments/submit', {
      assignmentId,
      ...submissionData,
    });
  },

  /**
   * Get my submissions
   */
  getMySubmissions: async () => {
    return apiGet('/student/assignments/my-submissions');
  },

  // ==================== GROUPS ====================

  /**
   * Get available groups
   */
  getAvailableGroups: async () => {
    return apiGet('/student/groups/available');
  },

  /**
   * Join a group
   */
  joinGroup: async (groupId) => {
    return apiPost('/student/groups/join', { groupId });
  },

  // ==================== CHAT ====================

  /**
   * Get group chat messages
   */
  getGroupChat: async (groupId) => {
    return apiGet(`/student/groups/${groupId}/chat`);
  },

  /**
   * Send chat message
   */
  sendChatMessage: async (groupId, message) => {
    return apiPost('/student/chat/send', {
      groupId,
      message,
    });
  },

  // ==================== BOOKMARKS ====================

  /**
   * Add bookmark
   */
  addBookmark: async (bookmarkType, contentId) => {
    return apiPost('/student/bookmarks', {
      bookmarkType,
      contentId,
    });
  },

  /**
   * Remove bookmark
   */
  removeBookmark: async (bookmarkType, contentId) => {
    return apiDelete(`/student/bookmarks/${bookmarkType}/${contentId}`);
  },

  /**
   * Get all bookmarks
   */
  getBookmarks: async () => {
    return apiGet('/student/bookmarks');
  },

  // ==================== PAYMENTS ====================

  /**
   * Create payment
   */
  createPayment: async (amount, paymentType, courseId) => {
    return apiPost('/student/payments', {
      amount,
      paymentType,
      courseId,
    });
  },

  /**
   * Get my payments
   */
  getMyPayments: async () => {
    return apiGet('/student/payments');
  },

  /**
   * Get payment by ID
   */
  getPaymentById: async (paymentId) => {
    return apiGet(`/student/payments/${paymentId}`);
  },

  // ==================== EXAMS ====================

  /**
   * Get all exams
   */
  getAllExams: async () => {
    return apiGet('/student/exams');
  },

  /**
   * Select exam
   */
  selectExam: async (examId) => {
    return apiPost('/student/select-exam', { examId });
  },

  // ==================== PROGRESS & RESULTS ====================

  /**
   * Get progress report
   */
  getProgressReport: async () => {
    return apiGet('/student/progress-report');
  },

  /**
   * Get my results
   */
  getMyResults: async () => {
    return apiGet('/student/results');
  },

  /**
   * Get result by assignment
   */
  getResultByAssignment: async (assignmentId) => {
    return apiGet(`/student/results/assignment/${assignmentId}`);
  },
};

export default studentService;
