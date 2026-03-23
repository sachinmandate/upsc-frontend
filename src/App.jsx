import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import StudyMaterial from "./components/dashboard/StudyMaterial";
import VideoLectures from "./components/dashboard/VideoLectures";
import CourseView from "./components/dashboard/CourseView";
import Assignments from "./components/dashboard/Assignments";
import MockTests from "./components/dashboard/MockTests";
import DailyPlanner from "./components/dashboard/DailyPlanner";
import CalendarView from "./components/dashboard/CalendarView";
import PerformanceAnalytics from "./components/dashboard/PerformanceAnalytics";
import SubscriptionPlans from "./components/dashboard/SubscriptionPlans";
import Profile from "./components/dashboard/Profile";
import ConnectTeachers from "./components/dashboard/ConnectTeachers";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherLogin from "./components/auth/teacher/TeacherLogin";
import AdminLogin from "./components/auth/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "./App.css";


function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Teacher Auth */}
          <Route path="/teacher/login" element={<TeacherLogin />} />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard/student" element={<DashboardLayout />}>
               <Route index element={<DashboardHome />} />
              <Route path="course/:subjectId" element={<CourseView />} />
              <Route path="notes" element={<StudyMaterial />} />
              <Route path="videos" element={<VideoLectures />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="mock-tests" element={<MockTests />} />
              <Route path="planner" element={<DailyPlanner />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="analytics" element={<PerformanceAnalytics />} />
              <Route path="subscriptions" element={<SubscriptionPlans />} />
              <Route path="profile" element={<Profile />} />
              <Route path="teachers" element={<ConnectTeachers />} />
            </Route>
          </Route>

          {/* Teacher Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Simple component to handle root redirection based on auth state
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/dashboard/student" replace />;
};

export default App;