'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DifficultyLevel {
  id: number;
  name: string;
  level: number;
  description: string;
}

const LESSON_TYPES = [
  { value: 'html', label: 'HTML', color: 'bg-orange-100 text-orange-800', icon: '🌐' },
  { value: 'css', label: 'CSS', color: 'bg-blue-100 text-blue-800', icon: '🎨' },
  { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' },
  { value: 'python', label: 'Python', color: 'bg-green-100 text-green-800', icon: '🐍' },
  { value: 'blocks', label: 'Blocks', color: 'bg-purple-100 text-purple-800', icon: '🧩' }
];

export default function CreateLessonPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    lesson_type: '',
    difficulty_level_id: ''
  });
  
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch difficulty levels on component mount
  useEffect(() => {
    const fetchDifficultyLevels = async () => {
      try {
        const response = await fetch('/api/difficulty-levels');
        const data = await response.json();
        if (data.success) {
          setDifficultyLevels(data.difficulty_levels);
        }
      } catch (error) {
        console.error('Error fetching difficulty levels:', error);
      }
    };
    
    fetchDifficultyLevels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Debug: Log form data before sending
    console.log('Form data before sending:', formData);
    
    const submitData = {
      ...formData,
      difficulty_level_id: parseInt(formData.difficulty_level_id)
    };
    
    console.log('Data being sent to API:', submitData);

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setMessage('Lesson created successfully! 🎉');
        setIsSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          content: '',
          lesson_type: '',
          difficulty_level_id: ''
        });
      } else {
        setMessage(data.message || 'Failed to create lesson');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Lesson</h1>
          <p className="text-gray-600 text-lg">Design an exciting coding adventure for kids! 🚀</p>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Lesson Title ✨
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 'Your First Website Adventure'"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description 📝
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="A fun description that will excite kids to learn..."
                  required
                />
              </div>

              {/* Lesson Type */}
              <div>
                <label htmlFor="lesson_type" className="block text-sm font-semibold text-gray-700 mb-3">
                  Lesson Type 🎯
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {LESSON_TYPES.map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="lesson_type"
                        value={type.value}
                        checked={formData.lesson_type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`
                        p-4 rounded-xl border-2 text-center transition-all
                        ${formData.lesson_type === type.value 
                          ? 'border-blue-500 bg-blue-50 transform scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}>
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="font-medium text-gray-800">{type.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label htmlFor="difficulty_level_id" className="block text-sm font-semibold text-gray-700 mb-3">
                  Difficulty Level 🎢
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficultyLevels.map((level) => (
                    <label key={level.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="difficulty_level_id"
                        value={level.id}
                        checked={formData.difficulty_level_id === level.id.toString()}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`
                        p-4 rounded-xl border-2 transition-all
                        ${formData.difficulty_level_id === level.id.toString()
                          ? 'border-purple-500 bg-purple-50 transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-800">{level.name}</span>
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${level.level === 1 ? 'bg-green-100 text-green-800' : 
                              level.level === 2 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}
                          `}>
                            Level {level.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                  Lesson Content 📚
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                  placeholder="Write the detailed lesson content, code examples, exercises, and instructions here..."
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Include step-by-step instructions, code examples, and fun challenges for kids!
                </p>
              </div>

              {/* Message */}
              {message && (
                <div className={`
                  p-4 rounded-xl border 
                  ${isSuccess 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                  }
                `}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      Create Lesson
                    </div>
                  )}
                </button>
                
                <Link
                  href="/lessons"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">💡 Tips for Creating Great Lessons</h3>
            <ul className="space-y-2 text-yellow-700">
              <li>• Keep instructions simple and clear for kids</li>
              <li>• Include interactive examples and exercises</li>
              <li>• Use fun themes and characters kids can relate to</li>
              <li>• Break complex concepts into small, manageable steps</li>
              <li>• Add visual elements and emojis to make it engaging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 