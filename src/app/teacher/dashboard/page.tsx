'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageContext';
import { signOut } from 'next-auth/react';

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
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [classStats, setClassStats] = useState<ClassStats>({
    totalStudents: 0,
    averageProgress: 0,
    mostCommonLevel: '',
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'lessons' | 'analytics'>('overview');

  // Get teacher name (placeholder for now)
  const teacherName = 'Teacher';

  // Function to get initials for avatar
  const getInitials = () => {
    return teacherName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  // Function to get avatar background color
  const getAvatarColor = () => {
    return 'from-purple-400 to-purple-600'; // Teacher theme color
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lessons to get total count
        const lessonsResponse = await fetch('/api/lessons');
        const lessonsData = await lessonsResponse.json();
        const totalLessons = lessonsData.success ? lessonsData.lessons.length : 8; // fallback to 8

        // Fetch student submissions to calculate real progress
        const submissionsResponse = await fetch('/api/submissions/student?student_name=Test Student');
        const submissionsData = await submissionsResponse.json();
        const studentSubmissions = submissionsData.success ? submissionsData.submissions.length : 0;

        // Calculate real progress
        const progressPercentage = totalLessons > 0 ? Math.round((studentSubmissions / totalLessons) * 100) : 0;

        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'Test Student',
            email: 'test.student@kidscode.com',
            progress: { 
              completed: studentSubmissions, 
              total: totalLessons, 
              percentage: progressPercentage 
            },
            currentLevel: 'Beginner'
          }
        ];
        
        const mockStats: ClassStats = {
          totalStudents: 1,
          averageProgress: progressPercentage,
          mostCommonLevel: 'Beginner'
        };

        setStudents(mockStudents);
        setClassStats(mockStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default mock data if APIs fail
        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'Test Student',
            email: 'test.student@kidscode.com',
            progress: { completed: 0, total: 8, percentage: 0 },
            currentLevel: 'Beginner'
          }
        ];
        
        const mockStats: ClassStats = {
          totalStudents: 1,
          averageProgress: 0,
          mostCommonLevel: 'Beginner'
        };

        setStudents(mockStudents);
        setClassStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Quick actions for teacher
  const quickActions = [
    { 
      icon: '📚', 
      title: 'Manage Lessons', 
      description: 'Create and organize coding lessons',
      action: () => window.location.href = '/teacher/lessons',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      icon: '👥', 
      title: 'View Students', 
      description: 'Monitor student progress and grades',
      action: () => window.location.href = '/teacher/students',
      color: 'from-green-400 to-green-600'
    },
    { 
      icon: '📝', 
      title: 'Review Submissions', 
      description: 'Grade student work and provide feedback',
      action: () => window.location.href = '/teacher/submissions',
      color: 'from-orange-400 to-orange-600'
    },
    { 
      icon: '📊', 
      title: 'Analytics', 
      description: 'View detailed progress reports',
      action: () => window.location.href = '/teacher/analytics',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Professional Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Professional Avatar */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {getInitials()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Welcome, {teacherName}! 👩‍🏫
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ready to inspire young coders?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                🔔
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Class Overview Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Class Overview</h2>
              <p className="text-purple-100">Your students are making great progress!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(classStats.averageProgress)}%</div>
              <div className="text-sm text-purple-100">Avg Progress</div>
            </div>
          </div>
          
          {/* Progress Visualization */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${classStats.averageProgress}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{classStats.totalStudents}</div>
              <div className="text-xs text-purple-100">Students</div>
            </div>
            <div>
              <div className="text-lg font-bold">{classStats.averageProgress.toFixed(0)}%</div>
              <div className="text-xs text-purple-100">Avg Grade</div>
            </div>
            <div>
              <div className="text-lg font-bold">{classStats.mostCommonLevel}</div>
              <div className="text-xs text-purple-100">Common Level</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 mb-6 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'students', label: 'Students', icon: '👥' },
            { id: 'lessons', label: 'Lessons', icon: '📚' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-base mr-1">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions Grid */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.action}
                    className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-white cursor-pointer transition-all hover:shadow-lg active:scale-95`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-xl">👨‍🎓</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">Test Student submitted HTML Basics</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending Review</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-xl">📚</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">New lesson "CSS Flexbox" created</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Yesterday</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Published</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student Progress</h3>
              <button 
                onClick={() => window.location.href = '/teacher/students'}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Manage Students
              </button>
            </div>
            
            {students.map((student) => (
              <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {student.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {student.currentLevel}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Progress: {student.progress.completed}/{student.progress.total} lessons
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {student.progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${student.progress.percentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.location.href = `/teacher/students/${student.id}`}
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => window.location.href = `/teacher/students/${student.id}/submissions`}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lesson Management</h3>
              <button 
                onClick={() => window.location.href = '/teacher/lessons/create'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                + New Lesson
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { title: 'HTML Basics', students: 1, type: 'HTML', status: 'Active' },
                { title: 'CSS Styling', students: 0, type: 'CSS', status: 'Draft' },
                { title: 'JavaScript Intro', students: 1, type: 'JavaScript', status: 'Active' }
              ].map((lesson, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.students} students enrolled</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.type === 'HTML' ? 'bg-orange-100 text-orange-800' :
                        lesson.type === 'CSS' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lesson.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lesson.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      View Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Class Analytics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{classStats.totalStudents}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{Math.round(classStats.averageProgress)}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Student Performance</h4>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{student.currentLevel}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{student.progress.percentage}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{student.progress.completed}/{student.progress.total} lessons</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 