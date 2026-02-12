import React from 'react';
import { Users, BookOpen, Video, FileText } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import RecentActivity from '../../components/teacher/RecentActivity';
import RecentSubjects from '../../components/teacher/RecentSubjects';
import QuickActions from '../../components/teacher/QuickActions';

const stats = [
  { icon: Users, label: 'Total Students', value: '1,248', trend: 'up', trendLabel: '+12.5%' },
  { icon: BookOpen, label: 'Subjects', value: '8', trend: 'up', trendLabel: '+2' },
  { icon: Video, label: 'Chapters', value: '47', trend: 'up', trendLabel: '+8' },
  { icon: FileText, label: 'Assignments', value: '23', trend: 'up', trendLabel: '+5' },
];

const TeacherHome = ({ subjects, chapters, onNavigate }) => {
  const subjectsWithCounts = subjects.map((s) => ({
    ...s,
    chapterCount: chapters.filter((c) => c.subjectId === s.id).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your teaching activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions onNavigate={onNavigate} />
          <RecentSubjects subjects={subjectsWithCounts} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;