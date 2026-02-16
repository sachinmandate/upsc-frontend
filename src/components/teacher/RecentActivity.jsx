import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import Badge from '../common/Badge';
import { BookOpen, FileText, Video } from 'lucide-react';

const activities = [
  {
    id: 1,
    icon: BookOpen,
    title: 'New subject created',
    description: 'Computer Science — Programming, algorithms, and data structures',
    time: '2 hours ago',
    badge: { label: 'Subject', variant: 'info' },
  },
  {
    id: 2,
    icon: Video,
    title: 'Chapter added',
    description: 'Linear Algebra Fundamentals — Mathematics',
    time: '5 hours ago',
    badge: { label: 'Chapter', variant: 'success' },
  },
  {
    id: 3,
    icon: FileText,
    title: 'Assignment published',
    description: 'Calculus Problem Set 1 — 25 questions',
    time: '1 day ago',
    badge: { label: 'Assignment', variant: 'warning' },
  },
  {
    id: 4,
    icon: BookOpen,
    title: 'New subject created',
    description: 'Physics — Classical and modern physics concepts',
    time: '2 days ago',
    badge: { label: 'Subject', variant: 'info' },
  },
  {
    id: 5,
    icon: Video,
    title: 'Chapter added',
    description: "Newton's Laws of Motion — Physics",
    time: '3 days ago',
    badge: { label: 'Chapter', variant: 'success' },
  },
];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <Badge variant={activity.badge.variant}>{activity.badge.label}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;