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
  { value: 'all', label: 'All Lessons', icon: '🌟', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { value: 'html', label: 'HTML', icon: '🌐', color: 'bg-orange-500' },
  { value: 'css', label: 'CSS', icon: '🎨', color: 'bg-blue-500' },
  { value: 'javascript', label: 'JavaScript', icon: '⚡', color: 'bg-yellow-500' },
  { value: 'python', label: 'Python', icon: '🐍', color: 'bg-green-500' },
  { value: 'blocks', label: 'Blocks', icon: '🧩', color: 'bg-purple-500' }
];

export default function LessonsPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Amazing Lessons...</h2>
            <p className="text-gray-500">Get ready to start your coding adventure! 🚀</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">😕</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchLessons}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Try Again 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium mr-6 transition-colors"
              >
                ← Back to Home
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Coding Lessons</h1>
                <p className="text-gray-600">Choose your adventure and start learning! 🚀</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/student/dashboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Beginner</p>
                <p className="text-2xl font-bold text-gray-900">{stats.beginner}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Intermediate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.intermediate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Advanced</p>
                <p className="text-2xl font-bold text-gray-900">{stats.advanced}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Programming Language 🎨</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LESSON_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`
                  p-4 rounded-xl border-2 text-center transition-all transform hover:scale-105
                  ${selectedType === type.value 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-semibold text-gray-800">{type.label}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {type.value === 'all' ? stats.total : stats.byType[type.value] || 0} lessons
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedType === 'all' ? 'All Lessons' : `${LESSON_TYPES.find(t => t.value === selectedType)?.label} Lessons`}
              <span className="text-gray-500 font-normal"> ({filteredLessons.length})</span>
            </h2>
          </div>

          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No lessons found</h3>
              <p className="text-gray-500">
                {selectedType === 'all' 
                  ? 'No lessons are available yet.' 
                  : `No ${selectedType.toUpperCase()} lessons are available yet.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lesson/${lesson.id}`}
                  className="block group"
                >
                  <div className="flex items-center p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className={`w-16 h-16 rounded-xl ${getLessonTypeColor(lesson.lesson_type)} flex items-center justify-center text-white shadow-lg`}>
                      <span className="text-2xl">{getTypeIcon(lesson.lesson_type)}</span>
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            #{lesson.order_number}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                          {lesson.difficulty_name}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLessonTypeColor(lesson.lesson_type)}`}>
                          {lesson.lesson_type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">Click to start learning!</span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:transform group-hover:scale-105 transition-all shadow-lg">
                        Start Lesson →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Fun Learning Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🎯 Ready to Start Coding?</h3>
              <p className="text-purple-100">
                Pick any lesson that looks fun! Start with HTML if you're new to coding, or jump into any topic that excites you.
              </p>
            </div>
            <div className="text-6xl opacity-20">
              🚀
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 