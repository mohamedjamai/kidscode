'use client';

import { useState, useEffect } from 'react';
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

export default function LessonsManagePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    content: '',
    lesson_type: '',
    difficulty_level: 1
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setEditForm({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      lesson_type: lesson.lesson_type,
      difficulty_level: lesson.difficulty_level
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!selectedLesson) return;

    console.log(`✏️ Attempting to save lesson ${selectedLesson.id}`);

    try {
      const response = await fetch(`/api/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      console.log('✏️ Save response:', data);

      if (response.ok && data.success) {
        // Refresh lessons list
        await fetchLessons();
        
        // Update the selected lesson with new data
        const updatedLesson = {
          ...selectedLesson,
          ...editForm
        };
        setSelectedLesson(updatedLesson);
        
        setIsEditing(false);
        setError(null);
        setSuccess(data.message || 'Lesson updated successfully');
        
        // Show demo mode note if applicable
        if (data.note) {
          console.log('ℹ️ Demo mode note:', data.note);
        }
      } else {
        console.error('❌ Save failed:', data.message);
        setError(data.message || 'Failed to update lesson');
      }
    } catch (err) {
      console.error('❌ Network error during save:', err);
      setError('Failed to update lesson - network error');
    }
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return;
    }

    console.log(`🗑️ Attempting to delete lesson ${lessonId}`);

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('🗑️ Delete response:', data);

      if (response.ok && data.success) {
        // Remove from local state
        setLessons(lessons.filter(lesson => lesson.id !== lessonId));
        if (selectedLesson?.id === lessonId) {
          setSelectedLesson(null);
          setIsEditing(false);
        }
        setError(null);
        setSuccess(data.message || 'Lesson deleted successfully');
        
        // Show demo mode note if applicable
        if (data.note) {
          console.log('ℹ️ Demo mode note:', data.note);
        }
      } else {
        console.error('❌ Delete failed:', data.message);
        setError(data.message || 'Failed to delete lesson');
      }
    } catch (err) {
      console.error('❌ Network error during delete:', err);
      setError('Failed to delete lesson - network error');
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
    switch (type.toLowerCase()) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'python': return '🐍';
      case 'blocks': return '🧩';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Lessons</h1>
          <p className="text-gray-600">Edit, delete, and preview your lessons</p>
          
          {/* Demo Mode Notice */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-blue-500 text-lg mr-2">ℹ️</div>
              <div>
                <h3 className="text-blue-800 font-medium">Demo Mode</h3>
                <p className="text-blue-700 text-sm">
                  You're currently in demo mode. Lesson edits and deletions are simulated and will be restored when the server restarts.
                  In production, changes would be permanently saved to the database.
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <div className="flex gap-8">
          {/* Lessons List */}
          <div className="w-1/2">
            <div className="bg-white rounded-xl shadow-lg border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">All Lessons ({lessons.length})</h2>
              </div>
              
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {lessons.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No lessons found</h3>
                    <p className="text-gray-500 mb-4">Create your first lesson to get started!</p>
                    <Link
                      href="/teacher/lessons/create"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Create First Lesson
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          selectedLesson?.id === lesson.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                        }`}
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg ${getLessonTypeColor(lesson.lesson_type)} flex items-center justify-center text-white`}>
                              <span className="text-lg">{getTypeIcon(lesson.lesson_type)}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                  #{lesson.order_number}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                                  {lesson.difficulty_name}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getLessonTypeColor(lesson.lesson_type)}`}>
                                  {lesson.lesson_type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(lesson);
                              }}
                              className="text-blue-600 hover:text-blue-700 p-1"
                              title="Edit lesson"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(lesson.id);
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Delete lesson"
                            >
                              🗑️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLesson(lesson);
                              }}
                              className="text-green-600 hover:text-green-700 p-1"
                              title="View lesson details"
                            >
                              👁️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Details/Edit Panel */}
          <div className="w-1/2">
            {selectedLesson ? (
              <div className="bg-white rounded-xl shadow-lg border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      {isEditing ? 'Edit Lesson' : 'Lesson Details'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {!isEditing ? (
                        <button
                          onClick={() => handleEdit(selectedLesson)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                          >
                            💾 Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm({
                                title: selectedLesson.title,
                                description: selectedLesson.description,
                                content: selectedLesson.content,
                                lesson_type: selectedLesson.lesson_type,
                                difficulty_level: selectedLesson.difficulty_level
                              });
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
                        <select
                          value={editForm.lesson_type}
                          onChange={(e) => setEditForm({...editForm, lesson_type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="blocks">Blocks</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                        <select
                          value={editForm.difficulty_level}
                          onChange={(e) => setEditForm({...editForm, difficulty_level: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value={1}>Beginner</option>
                          <option value={2}>Intermediate</option>
                          <option value={3}>Advanced</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-16 h-16 rounded-xl ${getLessonTypeColor(selectedLesson.lesson_type)} flex items-center justify-center text-white`}>
                            <span className="text-2xl">{getTypeIcon(selectedLesson.lesson_type)}</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h3>
                            <div className="flex items-center space-x-3">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                                Lesson #{selectedLesson.order_number}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedLesson.difficulty_level)}`}>
                                {selectedLesson.difficulty_name}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getLessonTypeColor(selectedLesson.lesson_type)}`}>
                                {selectedLesson.lesson_type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description:</h4>
                        <p className="text-gray-700">{selectedLesson.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Learning Content:</h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-blue-800">{selectedLesson.content}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Difficulty Info:</h4>
                        <p className="text-gray-600">{selectedLesson.difficulty_description}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => alert(`Preview for lesson: ${selectedLesson.title}\n\nThis is a secure teacher preview. The lesson contains:\n\n${selectedLesson.content}\n\nFor security, teachers can only view lesson details here without accessing the interactive student interface.`)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold text-center block transition-all transform hover:scale-105"
                        >
                          👁️ Preview Lesson Content
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Select a lesson</h3>
                  <p className="text-gray-500">Choose a lesson from the list to view details or make edits</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 