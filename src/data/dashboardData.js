// Dummy data for Student Dashboard

export const studentProfile = {
  name: "Purva Nitin Rane",
  email: "purva.rane@example.com",
  phone: "+91 98765 43210",
  examTarget: "UPSC CSE 2026",
  attempt: "1st Attempt",
  optionalSubject: "Political Science & IR",
  joinedDate: "15 Jan 2025",
  syllabusCompleted: 45,
  avatarInitials: "PR",
};

export const motivationalQuotes = [
  "Success in civil services is not luck — it is discipline meeting consistency.",
  "A year of focused preparation is worth more than a decade of wishful thinking.",
  "The IAS officer you admire was once a student just like you — start today.",
  "Discipline is choosing between what you want now and what you want most.",
  "Every page you read today brings you one step closer to serving the nation.",
];

export const subjects = [
  { id: 1, name: "Indian Polity", icon: "Scale", progress: 68, totalNotes: 42, color: "#312e81" },
  { id: 2, name: "History", icon: "BookOpen", progress: 55, totalNotes: 38, color: "#9333ea" },
  { id: 3, name: "Economy", icon: "TrendingUp", progress: 40, totalNotes: 30, color: "#d97706" },
  { id: 4, name: "Geography", icon: "Globe", progress: 52, totalNotes: 35, color: "#059669" },
  { id: 5, name: "Environment", icon: "Leaf", progress: 30, totalNotes: 20, color: "#65a30d" },
  { id: 6, name: "CSAT", icon: "Brain", progress: 25, totalNotes: 18, color: "#dc2626" },
  { id: 7, name: "Science & Tech", icon: "Atom", progress: 35, totalNotes: 22, color: "#0284c7" },
  { id: 8, name: "Ethics", icon: "Heart", progress: 20, totalNotes: 15, color: "#e11d48" },
];

export const recentMaterials = [
  { id: 1, title: "Fundamental Rights – Article 14 to 32", subject: "Indian Polity", date: "10 Feb 2026", type: "PDF" },
  { id: 2, title: "Indian National Movement – Phase III", subject: "History", date: "09 Feb 2026", type: "PDF" },
  { id: 3, title: "Monetary Policy & RBI Functions", subject: "Economy", date: "08 Feb 2026", type: "Notes" },
  { id: 4, title: "Climatology – Indian Monsoon", subject: "Geography", date: "07 Feb 2026", type: "PDF" },
];

export const assignments = [
  { id: 1, title: "Essay: Role of Judiciary in Democracy", subject: "Indian Polity", dueDate: "15 Feb 2026", status: "pending", marks: null },
  { id: 2, title: "Answer Writing: Economic Reforms 1991", subject: "Economy", dueDate: "12 Feb 2026", status: "pending", marks: null },
  { id: 3, title: "Map Work: Major Rivers of India", subject: "Geography", dueDate: "10 Feb 2026", status: "overdue", marks: null },
  { id: 4, title: "MCQ Set: Ancient Indian History", subject: "History", dueDate: "08 Feb 2026", status: "submitted", marks: "18/25" },
  { id: 5, title: "Ethics Case Study Analysis", subject: "Ethics", dueDate: "05 Feb 2026", status: "graded", marks: "22/25" },
  { id: 6, title: "Current Affairs Compilation – Jan 2026", subject: "General Studies", dueDate: "01 Feb 2026", status: "graded", marks: "20/25" },
];

export const videoLectures = [
  { id: 1, title: "Constitutional Framework & Amendments", subject: "Indian Polity", duration: "1h 45m", progress: 100, teacher: "Prof. Sharma", thumbnail: "polity", tier: "free", lastWatchedAt: "2026-02-19T09:00:00", resumeTimestamp: null },
  { id: 2, title: "Mughal Administration & Legacy", subject: "History", duration: "1h 30m", progress: 72, teacher: "Dr. Mehta", thumbnail: "history", tier: "free", lastWatchedAt: "2026-02-23T14:30:00", resumeTimestamp: "1:04:50" },
  { id: 3, title: "Balance of Payments & FOREX", subject: "Economy", duration: "2h 00m", progress: 45, teacher: "Prof. Iyer", thumbnail: "economy", tier: "premium", lastWatchedAt: "2026-02-22T10:15:00", resumeTimestamp: "54:00" },
  { id: 4, title: "Plate Tectonics & Earthquakes", subject: "Geography", duration: "1h 15m", progress: 0, teacher: "Dr. Singh", thumbnail: "geography", tier: "free", lastWatchedAt: null, resumeTimestamp: null },
  { id: 5, title: "Biodiversity Hotspots of India", subject: "Environment", duration: "1h 20m", progress: 0, teacher: "Prof. Gupta", thumbnail: "environment", tier: "premium", lastWatchedAt: null, resumeTimestamp: null },
  { id: 6, title: "Data Interpretation Techniques", subject: "CSAT", duration: "1h 40m", progress: 30, teacher: "Prof. Verma", thumbnail: "csat", tier: "free", lastWatchedAt: "2026-02-21T16:45:00", resumeTimestamp: "30:10" },
];

export const teachers = [
  { id: 1, name: "Prof. R. K. Sharma", subject: "Indian Polity & Governance", experience: "15 years", rating: 4.9, available: true, tier: "premium", monthlyFee: 999, followed: true, students: 1240 },
  { id: 2, name: "Dr. Anjali Mehta", subject: "History & Culture", experience: "12 years", rating: 4.8, available: true, tier: "free", monthlyFee: 0, followed: false, students: 890 },
  { id: 3, name: "Prof. S. Iyer", subject: "Economy & Finance", experience: "18 years", rating: 4.7, available: false, tier: "premium", monthlyFee: 1499, followed: true, students: 2100 },
  { id: 4, name: "Dr. Harpreet Singh", subject: "Geography & Environment", experience: "10 years", rating: 4.9, available: true, tier: "free", monthlyFee: 0, followed: false, students: 760 },
  { id: 5, name: "Prof. Neha Gupta", subject: "Science & Technology", experience: "8 years", rating: 4.6, available: false, tier: "premium", monthlyFee: 799, followed: false, students: 540 },
];

export const calendarEvents = [
  { date: "2026-02-15", title: "Essay Submission Due", type: "assignment", color: "#d97706" },
  { date: "2026-02-18", title: "Mock Test – GS Paper I", type: "exam", color: "#dc2626" },
  { date: "2026-02-20", title: "Live Doubt Session – Polity", type: "session", color: "#312e81" },
  { date: "2026-02-22", title: "Answer Writing Practice", type: "assignment", color: "#d97706" },
  { date: "2026-02-25", title: "Mock Test – GS Paper II", type: "exam", color: "#dc2626" },
  { date: "2026-02-28", title: "Monthly Assessment", type: "exam", color: "#dc2626" },
  { date: "2026-03-05", title: "Prelims Mock – Full Length", type: "exam", color: "#dc2626" },
  { date: "2026-05-24", title: "UPSC Prelims 2026", type: "milestone", color: "#059669" },
];

export const dailyTasks = [
  { id: 1, text: "Revise Polity – Fundamental Rights", completed: true, priority: "high" },
  { id: 2, text: "Watch Economy lecture – BOP", completed: false, priority: "high" },
  { id: 3, text: "Practice 50 MCQs – History", completed: false, priority: "medium" },
  { id: 4, text: "Read The Hindu editorial", completed: true, priority: "high" },
  { id: 5, text: "Answer writing practice (2 questions)", completed: false, priority: "high" },
  { id: 6, text: "Revise Geography – Climatology notes", completed: false, priority: "medium" },
];

export const studyHours = [
  { day: "Mon", hours: 8 },
  { day: "Tue", hours: 7.5 },
  { day: "Wed", hours: 9 },
  { day: "Thu", hours: 6 },
  { day: "Fri", hours: 8.5 },
  { day: "Sat", hours: 10 },
  { day: "Sun", hours: 7 },
];

export const mockTestScores = [
  { id: 1, name: "GS Paper I – Test 1", date: "15 Jan 2026", score: 98, total: 200, percentage: 49 },
  { id: 2, name: "GS Paper II – Test 1", date: "22 Jan 2026", score: 112, total: 200, percentage: 56 },
  { id: 3, name: "CSAT – Test 1", date: "29 Jan 2026", score: 142, total: 200, percentage: 71 },
  { id: 4, name: "GS Paper I – Test 2", date: "05 Feb 2026", score: 118, total: 200, percentage: 59 },
  { id: 5, name: "GS Paper II – Test 2", date: "08 Feb 2026", score: 124, total: 200, percentage: 62 },
];

export const weakAreas = [
  { subject: "Economy", topic: "International Trade & WTO", strength: 30 },
  { subject: "Environment", topic: "Climate Change Agreements", strength: 25 },
  { subject: "History", topic: "Post-Independence India", strength: 35 },
  { subject: "CSAT", topic: "Reading Comprehension", strength: 40 },
];

export const notifications = [
  { id: 1, text: "New assignment posted: Essay on Judiciary", time: "2 hours ago", read: false, type: "assignment" },
  { id: 2, text: "Mock Test results available – GS Paper II", time: "5 hours ago", read: false, type: "result" },
  { id: 3, text: "Live session tomorrow: Polity Doubt Clearing", time: "1 day ago", read: true, type: "session" },
  { id: 4, text: "New study material uploaded: Economy Chapter 8", time: "2 days ago", read: true, type: "material" },
];

// Subject Selection Data
export const availableSubjects = [
  { id: 1, name: "Indian Polity", category: "GS Paper II", icon: "Scale" },
  { id: 2, name: "History", category: "GS Paper I", icon: "BookOpen" },
  { id: 3, name: "Economy", category: "GS Paper III", icon: "TrendingUp" },
  { id: 4, name: "Geography", category: "GS Paper I", icon: "Globe" },
  { id: 5, name: "Environment", category: "GS Paper III", icon: "Leaf" },
  { id: 6, name: "CSAT", category: "Paper II", icon: "Brain" },
  { id: 7, name: "Science & Tech", category: "GS Paper III", icon: "Atom" },
  { id: 8, name: "Ethics", category: "GS Paper IV", icon: "Heart" },
  { id: 9, name: "International Relations", category: "GS Paper II", icon: "Globe" },
  { id: 10, name: "Internal Security", category: "GS Paper III", icon: "Shield" },
];

// Watch History Data
export const watchHistory = [
  { id: 1, videoId: 2, title: "Mughal Administration & Legacy", subject: "History", teacher: "Dr. Mehta", watchedAt: "2026-02-23T14:30:00", duration: "1h 30m", watchedDuration: "1h 05m", progress: 72 },
  { id: 2, videoId: 3, title: "Balance of Payments & FOREX", subject: "Economy", teacher: "Prof. Iyer", watchedAt: "2026-02-22T10:15:00", duration: "2h 00m", watchedDuration: "54m", progress: 45 },
  { id: 3, videoId: 6, title: "Data Interpretation Techniques", subject: "CSAT", teacher: "Prof. Verma", watchedAt: "2026-02-21T16:45:00", duration: "1h 40m", watchedDuration: "30m", progress: 30 },
  { id: 4, videoId: 1, title: "Constitutional Framework & Amendments", subject: "Indian Polity", teacher: "Prof. Sharma", watchedAt: "2026-02-20T09:00:00", duration: "1h 45m", watchedDuration: "1h 45m", progress: 100 },
];

// Chat Data
export const chatContacts = [
  { id: 1, name: "Prof. R. K. Sharma", type: "teacher", subject: "Indian Polity", avatar: "RS", online: true, lastMessage: "Great work on your last essay!", lastMessageTime: "10:30 AM", unread: 2 },
  { id: 2, name: "Dr. Anjali Mehta", type: "teacher", subject: "History", avatar: "AM", online: false, lastMessage: "Check the new notes I uploaded", lastMessageTime: "Yesterday", unread: 0 },
  { id: 3, name: "UPSC 2026 Study Group", type: "group", members: 45, avatar: "UG", online: true, lastMessage: "Has anyone solved the economics PYQ set?", lastMessageTime: "2:15 PM", unread: 5 },
  { id: 4, name: "Polity Discussion", type: "group", members: 28, avatar: "PD", online: true, lastMessage: "Article 370 analysis is excellent", lastMessageTime: "Yesterday", unread: 0 },
];

export const chatMessages = [
  { id: 1, contactId: 1, sender: "teacher", text: "Good morning! How is your Polity revision going?", time: "9:00 AM", date: "Today" },
  { id: 2, contactId: 1, sender: "student", text: "Good morning sir! I completed Fundamental Rights chapter.", time: "9:15 AM", date: "Today" },
  { id: 3, contactId: 1, sender: "teacher", text: "Excellent! Make sure to practice answer writing for Article 14-21.", time: "9:20 AM", date: "Today" },
  { id: 4, contactId: 1, sender: "student", text: "Yes sir, I'll work on that today.", time: "9:25 AM", date: "Today" },
  { id: 5, contactId: 1, sender: "teacher", text: "Great work on your last essay!", time: "10:30 AM", date: "Today" },
  { id: 6, contactId: 3, sender: "other", senderName: "Rahul K.", text: "Has anyone solved the economics PYQ set?", time: "2:15 PM", date: "Today" },
  { id: 7, contactId: 3, sender: "student", text: "I did! The BOP question was tricky.", time: "2:20 PM", date: "Today" },
  { id: 8, contactId: 3, sender: "other", senderName: "Priya M.", text: "Can someone share the approach for Q3?", time: "2:25 PM", date: "Today" },
];

// Payment & Subscription Data
export const subscriptionPlans = [
  { id: 1, name: "Free", price: 0, period: "Forever", features: ["Basic study materials", "Limited video lectures", "Community chat access", "3 mock tests/month"], current: false, popular: false },
  { id: 2, name: "Pro", price: 499, period: "month", features: ["All study materials", "All video lectures", "Priority teacher chat", "Unlimited mock tests", "Performance analytics"], current: true, popular: true },
  { id: 3, name: "Elite", price: 999, period: "month", features: ["Everything in Pro", "1-on-1 mentorship sessions", "Personal study plan", "Answer writing review", "Interview guidance"], current: false, popular: false },
];

export const paymentHistory = [
  { id: 1, date: "01 Feb 2026", description: "Pro Plan - Monthly", amount: 499, status: "paid", method: "UPI" },
  { id: 2, date: "01 Jan 2026", description: "Pro Plan - Monthly", amount: 499, status: "paid", method: "UPI" },
  { id: 3, date: "15 Dec 2025", description: "Prof. S. Iyer - Premium Access", amount: 1499, status: "paid", method: "Card" },
  { id: 4, date: "01 Dec 2025", description: "Pro Plan - Monthly", amount: 499, status: "paid", method: "UPI" },
];

// Activity Feed Data
export const activityFeed = [
  { id: 1, type: "video", text: "Watched 45 min of Balance of Payments & FOREX", time: "2 hours ago" },
  { id: 2, type: "assignment", text: "Submitted Essay: Role of Judiciary in Democracy", time: "5 hours ago" },
  { id: 3, type: "note", text: "Downloaded Fundamental Rights notes", time: "Yesterday" },
  { id: 4, type: "test", text: "Scored 62% on GS Paper II - Test 2", time: "2 days ago" },
  { id: 5, type: "teacher", text: "Started following Prof. R. K. Sharma", time: "3 days ago" },
];

// Study Notes with tier info
export const studyNotes = [
  { id: 1, title: "Preamble & Constitutional Framework", subject: "Indian Polity", pages: 24, size: "2.4 MB", tier: "free" },
  { id: 2, title: "Fundamental Rights – Article 14 to 32", subject: "Indian Polity", pages: 32, size: "3.1 MB", tier: "premium" },
  { id: 3, title: "Directive Principles of State Policy", subject: "Indian Polity", pages: 18, size: "1.8 MB", tier: "free" },
  { id: 4, title: "Ancient India – Indus Valley Civilization", subject: "History", pages: 28, size: "2.7 MB", tier: "free" },
  { id: 5, title: "Medieval India – Mughal Empire", subject: "History", pages: 35, size: "3.5 MB", tier: "premium" },
  { id: 6, title: "Indian National Movement – Phase I & II", subject: "History", pages: 40, size: "4.0 MB", tier: "free" },
  { id: 7, title: "National Income & GDP Concepts", subject: "Economy", pages: 22, size: "2.2 MB", tier: "free" },
  { id: 8, title: "Monetary Policy & RBI Functions", subject: "Economy", pages: 26, size: "2.6 MB", tier: "premium" },
  { id: 9, title: "Physical Geography – Geomorphology", subject: "Geography", pages: 30, size: "3.0 MB", tier: "free" },
  { id: 10, title: "Climatology – Indian Monsoon System", subject: "Geography", pages: 25, size: "2.5 MB", tier: "premium" },
  { id: 11, title: "Ecology & Biodiversity", subject: "Environment", pages: 20, size: "2.0 MB", tier: "free" },
  { id: 12, title: "Climate Change & International Agreements", subject: "Environment", pages: 16, size: "1.6 MB", tier: "free" },
  { id: 13, title: "Logical Reasoning & Analytical Ability", subject: "CSAT", pages: 35, size: "3.2 MB", tier: "premium" },
  { id: 14, title: "Data Interpretation", subject: "CSAT", pages: 28, size: "2.8 MB", tier: "free" },
];
