import React, { useState } from 'react';
import AppLayout from '../../components/layout/Teacher.AppLayout';
import TeacherHome from './TeacherHome';
import StudentsPage from './StudentsPage';
import SubjectsPage from './SubjectsPage';
import ProfilePage from './ProfilePage';
import API_CONFIG from '../../config/api';

const HomePage = TeacherHome; // bad code! will refactor later

const TeacherDashboard = () => {
  const [activePage, setActivePage] = useState('home');

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', description: 'Advanced mathematics topics including algebra, calculus, and geometry' },
    { id: 2, name: 'Physics', description: 'Classical and modern physics concepts' },
    { id: 3, name: 'Computer Science', description: 'Programming, algorithms, and data structures' },
  ]);

  const [chapters, setChapters] = useState([
    {
      id: 1,
      subjectId: 1,
      title: 'Linear Algebra Fundamentals',
      description: 'Introduction to matrices, determinants, and vector spaces',
      videoUrl: 'https://youtube.com/watch?v=example1',
    },
    {
      id: 2,
      subjectId: 1,
      title: 'Calculus Basics',
      description: 'Limits, derivatives, and their applications',
      videoUrl: 'https://youtube.com/watch?v=example2',
    },
    {
      id: 3,
      subjectId: 2,
      title: 'Newtons Laws of Motion',
      description: 'Understanding force, mass, and acceleration',
      videoUrl: 'https://youtube.com/watch?v=example3',
    },
  ]);

  const handleSubjectCreated = (subject) => {
    setSubjects((prev) => [...prev, { ...subject, id: Date.now() }]);
  };

  const handleChapterCreated = (chapter) => {
    setChapters((prev) => [...prev, { ...chapter, id: Date.now() }]);
  };

  const handleChapterDelete = async (chapterId) => {
    const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAPTER.DELETE.replace(':id', chapterId)}`;
    console.log('Delete chapter:', chapterId, 'Endpoint:', endpoint);
    setChapters((prev) => prev.filter((c) => c.id !== chapterId));
  };

  const handleAssignmentCreated = (assignment) => {
    console.log('Assignment created:', assignment);
  };

  const handleNavigate = (page) => {
    if (page === 'logout') {
      console.log('Logging out...');
      return;
    }
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage subjects={subjects} chapters={chapters} onNavigate={handleNavigate} />;
      case 'students':
        return <StudentsPage />;
      case 'subjects':
        return (
          <SubjectsPage
            subjects={subjects}
            chapters={chapters}
            onSubjectCreated={handleSubjectCreated}
            onChapterCreated={handleChapterCreated}
            onChapterDelete={handleChapterDelete}
            onAssignmentCreated={handleAssignmentCreated}
          />
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage subjects={subjects} chapters={chapters} onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppLayout activeKey={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </AppLayout>
  );
};

export default TeacherDashboard;