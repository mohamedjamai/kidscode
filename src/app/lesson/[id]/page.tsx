'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  lesson_type: string;
  order_number: number;
  difficulty_name: string;
  difficulty_level: number;
  difficulty_description: string;
}

export default function LessonPage() {
  const params = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchLesson(params.id as string);
    }
  }, [params]);

  const fetchLesson = async (id: string) => {
    try {
      const response = await fetch(`/api/lessons/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setLesson(data.lesson);
      } else {
        setError(data.message || 'Lesson not found');
      }
    } catch (err) {
      setError('Failed to load lesson');
      console.error('Error fetching lesson:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-4xl">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Lessons
            </Link>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                {lesson.difficulty_name}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getLessonTypeColor(lesson.lesson_type)}`}>
                {lesson.lesson_type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-3">
                  Lesson #{lesson.order_number}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {lesson.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {lesson.description}
                </p>
              </div>
              <div className={`${getLessonTypeColor(lesson.lesson_type)} w-16 h-16 rounded-full flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">
                  {lesson.lesson_type.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Difficulty Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">About this difficulty level:</h3>
              <p className="text-gray-600">{lesson.difficulty_description}</p>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn:</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {lesson.content}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to start coding?</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to start this amazing lesson!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                  🚀 Start Lesson
                </button>
                
                <Link
                  href="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                >
                  Browse More Lessons
                </Link>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">🎯 Fun Fact!</h3>
              <p className="text-lg">
                {lesson.lesson_type === 'html' && "HTML stands for HyperText Markup Language - it's like the skeleton of every website!"}
                {lesson.lesson_type === 'css' && "CSS stands for Cascading Style Sheets - it's what makes websites look beautiful!"}
                {lesson.lesson_type === 'javascript' && "JavaScript can run in your browser and make websites interactive and fun!"}
                {lesson.lesson_type === 'python' && "Python is named after the British comedy group Monty Python!"}
                {lesson.lesson_type === 'blocks' && "Block programming helps you learn coding concepts without worrying about syntax!"}
                {!['html', 'css', 'javascript', 'python', 'blocks'].includes(lesson.lesson_type) && "Every great programmer started with their first lesson - just like you!"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 