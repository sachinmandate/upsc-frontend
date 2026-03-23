const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchStudentDashboard = async () => {
  try {
    const response = await fetch("/api/student/dashboard", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard");
    return await response.json();
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return {};
  }
};

export const fetchStudentProfile = async () => {
  try {
    const response = await fetch("/api/student/profile", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    return {};
  }
};

export const fetchSubjects = async () => {
  try {
    const response = await fetch("/api/student/subjects", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch subjects");
    return await response.json();
  } catch (error) {
    console.error("Subjects fetch error:", error);
    return [];
  }
};

export const fetchAssignments = async () => {
  try {
    const response = await fetch("/api/student/assignments/my-submissions", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch assignments");
    return await response.json();
  } catch (error) {
    console.error("Assignments fetch error:", error);
    return []; // Return empty array to avoid crash
  }
};

export const fetchDailyTasks = async () => {
  return []; // Not yet implemented in backend
};

export const fetchRecentMaterials = async () => {
  try {
    const response = await fetch("/api/student/notes/downloaded", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch materials");
    return await response.json();
  } catch (error) {
    console.error("Materials fetch error:", error);
    return []; // Return empty array to avoid crash
  }
};

export const fetchMockTestScores = async () => {
  try {
    const response = await fetch("/api/student/results", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch mock test scores");
    return await response.json();
  } catch (error) {
    console.error("Mock test scores fetch error:", error);
    return [];
  }
};

export const fetchTeachers = async () => {
  try {
    const response = await fetch("/api/student/teachers", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch teachers");
    return await response.json();
  } catch (error) {
    console.error("Teachers fetch error:", error);
    return [];
  }
};

export const fetchExams = async () => {
  try {
    const response = await fetch("/api/student/exams", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch exams");
    return await response.json();
  } catch (error) {
    console.error("Exams fetch error:", error);
    return [];
  }
};

export const fetchAvailableGroups = async () => {
  try {
    const response = await fetch("/api/student/groups/available", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch groups");
    return await response.json();
  } catch (error) {
    console.error("Groups fetch error:", error);
    return [];
  }
};

export const fetchClasses = async () => {
  try {
    const response = await fetch("/api/student/classes", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch classes");
    return await response.json();
  } catch (error) {
    console.error("Classes fetch error:", error);
    return [];
  }
};
