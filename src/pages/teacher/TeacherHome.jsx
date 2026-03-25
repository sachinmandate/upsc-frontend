import React from 'react';
import { Users, BookOpen, Video, FileText } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import RecentActivity from '../../components/teacher/RecentActivity';
import RecentSubjects from '../../components/teacher/RecentSubjects';
import QuickActions from '../../components/teacher/QuickActions';

const TeacherHome = ({ dashboardStats, subjects, chapters, onNavigate }) => {
  const subjectsWithCounts = subjects.map((s) => ({
    ...s,
    chapterCount: chapters.filter((c) => c.subjectId === s.id).length,
  }));

  // Map dashboard properties from real API
  const stats = [
    { icon: Users, label: 'Total Students', value: dashboardStats?.totalStudents || 0, trend: 'up', trendLabel: 'Live' },
    { icon: BookOpen, label: 'Subjects', value: dashboardStats?.subjects?.length || subjects?.length || 0, trend: 'up', trendLabel: 'Live' },
    { icon: Video, label: 'Chapters', value: dashboardStats?.totalChapters || chapters?.length || 0, trend: 'up', trendLabel: 'Live' },
    { icon: FileText, label: 'Notes (Docs)', value: dashboardStats?.totalNotes || 0, trend: 'up', trendLabel: 'Live' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back, {dashboardStats ? `${dashboardStats.firstName} ${dashboardStats.lastName}` : "Teacher"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your teaching activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Note: Dummy data kept here as instructed, no explicit exact API provided for Recent Activity list mapping in dashboard payload */}
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions onNavigate={onNavigate} />
          {/* We use actual fetched subjects here if available */}
          <RecentSubjects subjects={subjectsWithCounts} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;