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

const LESSON_TYPES = [
  { value: 'all', label: 'All Lessons', icon: '🌟', color: 'from-purple-500 to-pink-500' },
  { value: 'html', label: 'HTML', icon: '🌐', color: 'from-orange-400 to-orange-600' },
  { value: 'css', label: 'CSS', icon: '🎨', color: 'from-blue-400 to-blue-600' },
  { value: 'javascript', label: 'JavaScript', icon: '⚡', color: 'from-yellow-400 to-yellow-600' },
  { value: 'python', label: 'Python', icon: '🐍', color: 'from-green-400 to-green-600' },
  { value: 'blocks', label: 'Blocks', icon: '🧩', color: 'from-purple-400 to-purple-600' }
];

export default function LessonsPreviewPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredLessons(lessons);
    } else {
      setFilteredLessons(lessons.filter(lesson => lesson.lesson_type === selectedType));
    }
  }, [lessons, selectedType]);

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
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 4: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'html': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'css': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'javascript': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'python': return 'bg-green-100 text-green-800 border-green-200';
      case 'blocks': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    const lessonType = LESSON_TYPES.find(t => t.value === type);
    return lessonType ? lessonType.icon : '📚';
  };

  const getLessonStats = () => {
    const stats = {
      total: lessons.length,
      beginner: lessons.filter(l => l.difficulty_level === 1).length,
      intermediate: lessons.filter(l => l.difficulty_level === 2).length,
      advanced: lessons.filter(l => l.difficulty_level === 3).length,
      byType: {} as Record<string, number>
    };

    LESSON_TYPES.slice(1).forEach(type => {
      stats.byType[type.value] = lessons.filter(l => l.lesson_type === type.value).length;
    });

    return stats;
  };

  const stats = getLessonStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading available lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center max-w-md w-full">
          <div className="text-red-500 text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Lessons</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchLessons}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again 🔄
          </button>
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                📚
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Available Lessons 🚀
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Login required to start coding!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                🔓 Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Security Notice */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">🔐</div>
            <div>
              <h2 className="text-lg font-bold">Secure Access Required</h2>
              <p className="text-amber-100 text-sm">Enhanced security for student safety</p>
            </div>
          </div>
          <p className="text-sm opacity-90">
            For security reasons, you can preview lessons here but must log in fresh each time to access them. 
            No login sessions are saved for enhanced security.
          </p>
        </div>

        {/* Course Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Lessons</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.beginner}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Beginner</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.intermediate + stats.advanced}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Advanced</div>
            </div>
          </div>
        </div>

        {/* Filter by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filter by Type</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {LESSON_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center justify-center py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                  selectedType === type.value
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg transform scale-105`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-lg mr-2">{type.icon}</span>
                <span className="truncate">{type.label}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredLessons.length} of {lessons.length} lessons
            </span>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {selectedType === 'all' ? 'All Lessons' : `${LESSON_TYPES.find(t => t.value === selectedType)?.label} Lessons`}
          </h2>
          
          {filteredLessons.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No lessons found</h3>
              <p className="text-gray-600 dark:text-gray-400">No lessons found for the selected type</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson) => (
                <div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xl shadow-sm">
                      {getTypeIcon(lesson.lesson_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-5">
                          {lesson.title}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          #{lesson.order_number}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {lesson.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty_level)}`}>
                          {lesson.difficulty_name}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLessonTypeColor(lesson.lesson_type)}`}>
                          {lesson.lesson_type.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          🔐 Login required to start
                        </span>
                        <button
                          onClick={() => {
                            alert('🔐 Please log in first to access this lesson!\n\nFor security, you need to authenticate before starting any lesson.');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Start Lesson →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-xl">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-xl font-bold mb-2">Ready to Start Learning?</h2>
          <p className="text-blue-100 text-sm mb-4">
            Join KidsCode today and begin your coding journey with fun, interactive lessons!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              🔓 Login to Start Learning
            </button>
            <button
              onClick={() => window.location.href = '/accessibility-demo'}
              className="px-6 py-3 bg-white/20 text-white border border-white/30 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              ♿ Accessibility Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 