const API_BASE_URL = "/api/admin";

const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Teacher Management
export const fetchPendingTeachers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teachers/pending`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch pending teachers");
    return await response.json();
  } catch (error) {
    console.error("Fetch pending teachers error:", error);
    return [];
  }
};

export const approveTeacher = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/${id}/approve`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return { success: response.ok, message: response.ok ? "Teacher approved" : "Failed to approve teacher" };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};

export const rejectTeacher = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/${id}/reject`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return { success: response.ok, message: response.ok ? "Teacher rejected" : "Failed to reject teacher" };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};

export const fetchAllTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, { headers: getHeaders() });
      if (!response.ok) throw new Error("Failed to fetch teachers");
      return await response.json();
    } catch (error) {
      console.error("Fetch all teachers error:", error);
      return [];
    }
};

export const updateTeacherPricing = async (id, pricingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher/${id}/pricing`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(pricingData)
      });
      return await response.json();
    } catch (error) {
      console.error("Update pricing error:", error);
      return { success: false, message: "Network error" };
    }
};

export const updateTeacherSubscription = async (id, subscriptionType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher/${id}/subscription-type?subscriptionType=${subscriptionType}`, {
        method: "PUT",
        headers: getHeaders()
      });
      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
};

export const assignTeacherSubjects = async (teacherId, subjectIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher/${teacherId}/subjects`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(subjectIds)
      });
      return await response.json();
    } catch (error) {
      console.error("Assign teacher subjects error:", error);
      return { success: false };
    }
};

// Class & Subject Management
export const fetchAllClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch classes");
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const createClass = async (classData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(classData),
    });
    return { success: response.ok, message: response.ok ? "Class created" : "Failed to create class" };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};

export const fetchSubjectsByClass = async (classId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${classId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch subjects");
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchAllSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, { headers: getHeaders() });
      if (!response.ok) throw new Error("Failed to fetch all subjects");
      return await response.json();
    } catch (error) {
      console.error("Fetch all subjects error:", error);
      return [];
    }
};

export const createSubject = async (subjectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(subjectData),
    });
    return { success: response.ok, message: response.ok ? "Subject created" : "Failed to create subject" };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};

// Exam Management
export const fetchAllExams = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/exams`, { headers: getHeaders() });
      if (!response.ok) throw new Error("Failed to fetch exams");
      return await response.json();
    } catch (error) {
      return [];
    }
};

export const createExam = async (examData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exams`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(examData),
      });
      return { success: response.ok };
    } catch (error) {
      return { success: false };
    }
};

// Student & Group Management
export const fetchAllStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, { headers: getHeaders() });
      return await response.json();
    } catch (error) {
      return [];
    }
};

export const fetchAllGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups`, { headers: getHeaders() });
      return await response.json();
    } catch (error) {
      return [];
    }
};

// Syllabus Management
export const createChapter = async (chapterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chapters`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(chapterData),
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
};

export const fetchChaptersBySubject = async (subjectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chapters/subject/${subjectId}`, { headers: getHeaders() });
      return await response.json();
    } catch (error) {
      return [];
    }
};

export const createCurriculum = async (curriculumData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/curriculum`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(curriculumData),
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
};

export const fetchCurriculumByChapter = async (chapterId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/curriculum/chapter/${chapterId}`, { headers: getHeaders() });
      return await response.json();
    } catch (error) {
      return [];
    }
};
