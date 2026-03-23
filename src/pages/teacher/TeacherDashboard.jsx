import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/Teacher.AppLayout';
import TeacherHome from './TeacherHome';
import StudentsPage from './StudentsPage';
import GroupsPage from './GroupsPage';
import SubjectsPage from './SubjectsPage';
import ProfilePage from './ProfilePage';
import AnnouncementsPage from './AnnouncementsPage';
import { toast } from 'sonner';
import * as teacherApi from '../../api/teacherApi';

const HomePage = TeacherHome;

const TeacherDashboard = () => {
  const [activePage, setActivePage] = useState('home');
  const [loading, setLoading] = useState(true);

  // Stats from /api/teacher/dashboard
  const [dashboardStats, setDashboardStats] = useState(null);

  const [classesList, setClassesList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [stats, classes, mySubjects, myChapters] = await Promise.all([
        teacherApi.fetchDashboardStats(),
        teacherApi.fetchMyClasses(),
        teacherApi.fetchMySubjects(),
        teacherApi.fetchMyChapters()
      ]);

      if (stats) setDashboardStats(stats);
      setClassesList(Array.isArray(classes) ? classes : []);
      setSubjects(Array.isArray(mySubjects) ? mySubjects : []);
      setChapters(Array.isArray(myChapters) ? myChapters : []);

    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    if (page === 'logout') {
      console.log('Logging out...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/teacher/login';
      return;
    }
    setActivePage(page);
  };

  if (loading) {
    return (
      <AppLayout activeKey={activePage} onNavigate={handleNavigate}>
        <div className="flex h-screen items-center justify-center">Loading dashboard...</div>
      </AppLayout>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage dashboardStats={dashboardStats} subjects={subjects} chapters={chapters} onNavigate={handleNavigate} />;
      case 'students':
        return <StudentsPage />;
      case 'groups':
        return <GroupsPage />;
      case 'subjects':
        return (
          <SubjectsPage
            classesList={classesList}
          />
        );
      case 'announcements':
        return <AnnouncementsPage dashboardStats={dashboardStats} classesList={classesList} />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage dashboardStats={dashboardStats} subjects={subjects} chapters={chapters} onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppLayout activeKey={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </AppLayout>
  );
};

export default TeacherDashboard;