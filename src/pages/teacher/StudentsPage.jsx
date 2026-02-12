import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Search } from 'lucide-react';

const demoStudents = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.s@example.com', enrolledSubjects: 3, status: 'active', joinedAt: 'Jan 12, 2026' },
  { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', enrolledSubjects: 2, status: 'active', joinedAt: 'Jan 18, 2026' },
  { id: 3, name: 'Rohan Gupta', email: 'rohan.g@example.com', enrolledSubjects: 4, status: 'active', joinedAt: 'Jan 25, 2026' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha.r@example.com', enrolledSubjects: 1, status: 'inactive', joinedAt: 'Feb 01, 2026' },
  { id: 5, name: 'Arjun Mehta', email: 'arjun.m@example.com', enrolledSubjects: 3, status: 'active', joinedAt: 'Feb 05, 2026' },
  { id: 6, name: 'Kavya Iyer', email: 'kavya.i@example.com', enrolledSubjects: 2, status: 'active', joinedAt: 'Feb 08, 2026' },
];

const StudentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Students</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and view all registered students.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>{demoStudents.length} students enrolled</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {demoStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {student.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.enrolledSubjects}</td>
                    <td className="px-6 py-4">
                      <Badge variant={student.status === 'active' ? 'success' : 'warning'}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{student.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;