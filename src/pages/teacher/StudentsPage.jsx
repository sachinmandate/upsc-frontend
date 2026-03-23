import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Search, Loader2 } from 'lucide-react';
import * as teacherApi from '../../api/teacherApi';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    const data = await teacherApi.fetchMyStudents();
    setStudents(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <CardDescription>{students.length} students enrolled</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-slate-600">
                              {(student.firstName?.[0] || '') + (student.lastName?.[0] || '')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.city || '-'}, {student.district || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsPage;