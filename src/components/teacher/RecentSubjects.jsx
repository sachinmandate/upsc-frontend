import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import Badge from '../common/Badge';
import { ArrowRight } from 'lucide-react';

const RecentSubjects = ({ subjects, onNavigate }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Subjects</CardTitle>
        <button
          onClick={() => onNavigate('subjects')}
          className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{subject.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{subject.description}</p>
              </div>
              <Badge variant="default" className="flex-shrink-0">
                {subject.chapterCount} chapters
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSubjects;