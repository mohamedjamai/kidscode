'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_type: string;
  order_number: number;
  difficulty_name: string;
  difficulty_level: number;
}

export default function StudentDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      
      if (data.success) {
        setLessons(data.lessons);
      } else {
        setError(data.message || 'Failed to load lessons');
      }
    } catch (err) {
      setError('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'html': return 'bg-orange-500';
      case 'css': return 'bg-blue-500';
      case 'javascript': return 'bg-yellow-500';
      case 'python': return 'bg-green-500';
      case 'blocks': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-3">👨‍🎓</span>
              <div>
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <p className="text-green-100">Welcome back, Test Student!</p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout →
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Available Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Lessons</h2>
                <Link
                  href="/lessons"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All →
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading lessons...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button 
                    onClick={fetchLessons}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.slice(0, 5).map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="block group"
                    >
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                        <div className={`w-12 h-12 rounded-lg ${getLessonTypeColor(lesson.lesson_type)} flex items-center justify-center text-white font-bold`}>
                          {lesson.lesson_type.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                              {lesson.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                              {lesson.difficulty_name}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-gray-500">Lesson #{lesson.order_number}</span>
                            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                              {lesson.lesson_type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm text-gray-500">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Level</span>
                    <span className="text-sm text-gray-500">Beginner</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href="/lessons"
                  className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">📚</span>
                  <span className="font-medium text-blue-700 group-hover:text-blue-800">Browse All Lessons</span>
                </Link>

                <Link
                  href="/student/progress"
                  className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">📊</span>
                  <span className="font-medium text-green-700 group-hover:text-green-800">View Progress</span>
                </Link>

                <Link
                  href="/student/achievements"
                  className="flex items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">🏆</span>
                  <span className="font-medium text-yellow-700 group-hover:text-yellow-800">Achievements</span>
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">💡 Coding Tip of the Day</h3>
              <p className="text-purple-100 text-sm">
                Start with HTML lessons to build a strong foundation. Remember, every expert was once a beginner!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 