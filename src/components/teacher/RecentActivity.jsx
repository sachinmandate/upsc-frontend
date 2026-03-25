import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import Badge from '../common/Badge';
import { BookOpen, FileText, Video } from 'lucide-react';

const activities = [];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities.length > 0 ? activities.map((activity) => {
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
          }) : (
            <div className="p-12 text-center text-slate-400 text-sm italic">
                No recent activity to show.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;