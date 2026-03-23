const API_BASE_URL = "/api/teacher";

const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchDashboardStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`, { headers: getHeaders() });
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        return await response.json();
    } catch (error) {
        console.error("Dashboard Stats error:", error);
        return null;
    }
};

export const fetchMyClasses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/classes`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const selectClasses = async (classIds) => {
    try {
        const response = await fetch(`${API_BASE_URL}/select-classes`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ classIds })
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const fetchMySubjects = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/my-subjects`, { headers: getHeaders() });
        const data = await response.json();
        console.log("Teacher subjects data = ", data);
        return data;
    } catch (error) {
        return [];
    }
};

export const fetchAvailableSubjects = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/available-subjects`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const selectSubjects = async (subjectIds) => {
    try {
        const response = await fetch(`${API_BASE_URL}/select-subjects`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ subjectIds })
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const createChapter = async (chapterData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(chapterData)
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const fetchMyChapters = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const fetchMyGroups = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const createGroup = async (groupData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(groupData)
        });
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const updateGroup = async (groupId, groupData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(groupData)
        });
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const fetchAnnouncementsByTeacher = async (teacherId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements/teacher/${teacherId}`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const createAnnouncement = async (announcementData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/announcements`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(announcementData)
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const addStudentToGroup = async (groupId, studentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/students/${studentId}`, {
            method: "POST",
            headers: getHeaders()
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const removeStudentFromGroup = async (groupId, studentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/groups/${groupId}/students/${studentId}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return { success: response.ok };
    } catch (error) {
        return { success: false };
    }
};

export const fetchMyStudents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/my-students`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const searchStudents = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/search?query=${query}`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const fetchStudentProgress = async (studentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/progress`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const uploadVideo = async (videoData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/videos`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(videoData)
        });
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchVideosByChapter = async (chapterId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/videos`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const uploadNote = async (noteData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(noteData)
        });
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const fetchNotesByChapter = async (chapterId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/notes`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const createAssignment = async (assignmentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/assignments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(assignmentData)
        });
        return { success: response.ok };
    } catch (error) {
        return null;
    }
};

export const fetchAssignments = async (chapterId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/assignments/chapter/${chapterId}`, { headers: getHeaders() });
        return await response.json();
    } catch (error) {
        return [];
    }
};
