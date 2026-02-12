import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { Plus, Upload, FileText } from 'lucide-react';
import Button from '../common/Button';

const QuickActions = ({ onNavigate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button variant="secondary" className="justify-start" onClick={() => onNavigate('subjects')}>
          <Plus className="h-4 w-4" />
          Create New Subject
        </Button>
        <Button variant="secondary" className="justify-start" onClick={() => onNavigate('subjects')}>
          <Upload className="h-4 w-4" />
          Add Chapter & Video
        </Button>
        <Button variant="secondary" className="justify-start" onClick={() => onNavigate('subjects')}>
          <FileText className="h-4 w-4" />
          Create Assignment
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;