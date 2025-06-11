'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageContext';
import LanguageSelector from '../../../components/LanguageSelector';

// Extended session type to include our custom user properties
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  student_number?: string;
  profile_picture?: string;
  class_id?: string;
  school_id?: string;
}

interface ExtendedSession {
  user?: ExtendedUser;
  expires: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_type: string;
  order_number: number;
  difficulty_name: string;
  difficulty_level: number;
}

interface StudentSubmission {
  id: number;
  student_name: string;
  lesson_id: number;
  lesson_title: string;
  lesson_type: string;
  difficulty_name: string;
  html_code: string;
  css_code: string;
  javascript_code: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReviews, setNewReviews] = useState<StudentSubmission[]>([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'progress' | 'achievements'>('overview');

  // Cast session to our extended type for easier access
  const extendedSession = session as ExtendedSession;

  // Get student name for display
  const studentName = extendedSession?.user?.name || 
                      extendedSession?.user?.email?.split('@')[0] || 
                      'Student';

  // Function to get initials for avatar
  const getInitials = () => {
    const name = studentName || 'Student';
    return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  // Function to get avatar background color based on student
  const getAvatarColor = () => {
    const studentNum = extendedSession?.user?.student_number || '000';
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600', 
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600',
      'from-yellow-400 to-yellow-600',
      'from-gray-400 to-gray-600'
    ];
    const colorIndex = parseInt(studentNum.slice(-3)) % colors.length;
    return colors[colorIndex];
  };

  useEffect(() => {
    fetchLessons();
    if (session?.user) {
      fetchStudentSubmissions();
      
      // Set up real-time review notifications
      const studentName = session.user.name || session.user.email?.split('@')[0] || 'Test Student';
      console.log(`🔗 Setting up review notifications for: ${studentName}`);
      
      const eventSource = new EventSource(`/api/reviews/events?student_name=${encodeURIComponent(studentName)}`);
      
      eventSource.onopen = () => {
        console.log('✅ Review notifications connected');
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Review notification received:', data);
          
          switch (data.type) {
            case 'connected':
              console.log('🔗 Review notification system active');
              break;
              
            case 'review_received':
              console.log(`🔔 New review received for submission ${data.submission?.id}`);
              
              // Show browser notification
              if (Notification.permission === 'granted' && data.submission) {
                new Notification('KidsCode - Your Work Was Reviewed!', {
                  body: `Grade: ${data.submission.grade}/10 for ${data.submission.lesson_title}`,
                  icon: '/favicon.ico'
                });
              }
              
              // Refresh submissions to show new review
              fetchStudentSubmissions();
              break;
              
            case 'heartbeat':
              // Connection alive
              break;
              
            default:
              console.log('❓ Unknown review notification type:', data.type);
          }
        } catch (error) {
          console.error('❌ Error processing review notification:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('❌ Review notification connection error:', error);
      };
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Cleanup on unmount
      return () => {
        eventSource.close();
        console.log('🔗 Review notifications disconnected');
      };
    }
  }, [session]);

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

  const fetchStudentSubmissions = async () => {
    const studentName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Test Student';
    
    try {
      const response = await fetch(`/api/submissions/student?student_name=${encodeURIComponent(studentName)}`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
        
        // Find submissions that have been reviewed (have grade or feedback)
        const reviewedSubmissions = data.submissions.filter((sub: StudentSubmission) => 
          sub.grade !== null || sub.feedback !== null
        );
        
        // Check for new reviews (reviewed in last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentReviews = reviewedSubmissions.filter((sub: StudentSubmission) => 
          sub.reviewed_at && new Date(sub.reviewed_at) > oneDayAgo
        );
        
        setNewReviews(recentReviews);
        console.log(`📊 Student has ${reviewedSubmissions.length} reviewed submissions, ${recentReviews.length} new reviews`);
      }
    } catch (err) {
      console.error('Error fetching student submissions:', err);
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

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-500';
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'python': return '🐍';
      case 'blocks': return '🧩';
      default: return '📚';
    }
  };

  // Calculate stats
  const completedLessons = submissions.filter(s => s.grade !== null).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const averageGrade = submissions.length > 0 
    ? submissions.filter(s => s.grade !== null)
                .reduce((sum, s) => sum + (s.grade || 0), 0) / completedLessons
    : 0;
  const recentReviews = submissions.filter(s => 
    s.reviewed_at && new Date(s.reviewed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Get next lesson to work on
  const nextLesson = lessons.find(lesson => 
    !submissions.some(sub => sub.lesson_id === lesson.id && sub.grade !== null)
  );

  // Get recent achievements
  const achievements = [
    { icon: '🎯', title: 'First Submission', unlocked: submissions.length > 0 },
    { icon: '⭐', title: 'High Score', unlocked: submissions.some(s => s.grade && s.grade >= 9) },
    { icon: '🔥', title: 'Streak Master', unlocked: completedLessons >= 3 },
    { icon: '🏆', title: 'Course Complete', unlocked: progressPercentage >= 80 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center max-w-md w-full">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
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
              {/* Professional Avatar */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {getInitials()}
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Hello, {studentName.split(' ')[0]}! 👋
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ready to code today?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                {newReviews.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🔔
                </button>
              </div>
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

      {/* Progress Overview Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Your Progress</h2>
              <p className="text-blue-100">Keep up the great work!</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <div className="text-sm text-blue-100">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{completedLessons}</div>
              <div className="text-xs text-blue-100">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold">{averageGrade > 0 ? averageGrade.toFixed(1) : '-'}</div>
              <div className="text-xs text-blue-100">Avg Grade</div>
            </div>
            <div>
              <div className="text-lg font-bold">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-xs text-blue-100">Achievements</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 mb-6 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'lessons', label: 'Lessons', icon: '📚' },
            { id: 'progress', label: 'Progress', icon: '📈' },
            { id: 'achievements', label: 'Awards', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
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
            {/* Next Lesson Card */}
            {nextLesson && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Continue Learning</h3>
                  <span className="text-2xl">{getLessonTypeIcon(nextLesson.lesson_type)}</span>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{nextLesson.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{nextLesson.description}</p>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(nextLesson.difficulty_level)}`}>
                      {nextLesson.difficulty_name}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLessonTypeColor(nextLesson.lesson_type)}`}>
                      {nextLesson.lesson_type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = `/lesson/${nextLesson.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Start Lesson {nextLesson.order_number} →
                </button>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              {submissions.slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  {submissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-xl">{getLessonTypeIcon(submission.lesson_type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{submission.lesson_title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      {submission.grade && (
                        <div className={`text-sm font-bold ${getGradeColor(submission.grade)}`}>
                          {submission.grade}/10
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="text-gray-600 dark:text-gray-400">Start your first lesson to see activity here!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-4">
            {lessons.map((lesson) => {
              const submission = submissions.find(s => s.lesson_id === lesson.id);
              const isCompleted = submission && submission.grade !== null;
              
              return (
                <div
                  key={lesson.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    isCompleted ? 'border-l-4 border-green-500' : ''
                  }`}
                  onClick={() => window.location.href = `/lesson/${lesson.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{getLessonTypeIcon(lesson.lesson_type)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {lesson.title}
                          {isCompleted && <span className="ml-2 text-green-500">✓</span>}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{lesson.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty_level)}`}>
                            {lesson.difficulty_name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLessonTypeColor(lesson.lesson_type)}`}>
                            {lesson.lesson_type}
                          </span>
                          {isCompleted && submission?.grade && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Grade: {submission.grade}/10
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Lesson {lesson.order_number}</div>
                      <button className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        isCompleted 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      } transition-colors`}>
                        {isCompleted ? 'Review' : 'Start'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{completedLessons}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{averageGrade > 0 ? averageGrade.toFixed(1) : '0'}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Grade</div>
                </div>
              </div>
            </div>

            {/* Grades List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Grades</h3>
              {submissions.filter(s => s.grade !== null).length > 0 ? (
                <div className="space-y-3">
                  {submissions.filter(s => s.grade !== null).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{submission.lesson_title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`text-xl font-bold ${getGradeColor(submission.grade)}`}>
                        {submission.grade}/10
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600 dark:text-gray-400">No grades yet. Complete lessons to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-sm">{achievement.title}</div>
                {achievement.unlocked && (
                  <div className="text-xs mt-1 opacity-80">Unlocked!</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 