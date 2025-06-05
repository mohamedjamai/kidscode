'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  email: string;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  currentLevel: string;
}

interface ClassStats {
  totalStudents: number;
  averageProgress: number;
  mostCommonLevel: string;
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classStats, setClassStats] = useState<ClassStats>({
    totalStudents: 0,
    averageProgress: 0,
    mostCommonLevel: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, using mock data since we don't have teacher API endpoints yet
        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'Test Student',
            email: 'test.student@kidscode.com',
            progress: { completed: 2, total: 5, percentage: 40 },
            currentLevel: 'Beginner'
          }
        ];
        
        const mockStats: ClassStats = {
          totalStudents: 1,
          averageProgress: 40,
          mostCommonLevel: 'Beginner'
        };

        setStudents(mockStudents);
        setClassStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your class overview.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          ← Back to Home
        </Link>
      </div>

      {/* Class Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Students</h2>
          <p className="text-3xl font-bold text-blue-600">{classStats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Average Progress</h2>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(classStats.averageProgress)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Most Common Level</h2>
          <p className="text-3xl font-bold text-purple-600">{classStats.mostCommonLevel}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/lessons"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border hover:border-blue-300"
        >
          <div className="text-blue-600 text-2xl mb-2">📚</div>
          <h2 className="text-lg font-semibold mb-2">View Lessons</h2>
          <p className="text-gray-600">Browse all available lessons</p>
        </Link>
        <Link
          href="/teacher/lessons/create"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border hover:border-green-300"
        >
          <div className="text-green-600 text-2xl mb-2">✨</div>
          <h2 className="text-lg font-semibold mb-2">Create New Lesson</h2>
          <p className="text-gray-600">Design exciting coding adventures</p>
        </Link>
        <div className="bg-white rounded-xl shadow-lg p-6 border opacity-75">
          <div className="text-gray-400 text-2xl mb-2">👥</div>
          <h2 className="text-lg font-semibold mb-2 text-gray-500">Student Management</h2>
          <p className="text-gray-400">Coming soon - manage student progress</p>
        </div>
      </div>

      {/* Student Progress Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {student.currentLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${student.progress.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {student.progress.completed}/{student.progress.total}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Teaching Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">💡 Teaching Tip of the Day</h3>
        <p className="text-gray-700">
          Encourage students to experiment with the code! Making mistakes is a crucial part of learning programming.
        </p>
      </div>
    </div>
  );
} 