'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setError(null);
    // Pre-fill test credentials based on role
    if (role === 'student') {
      setEmail('test.student@kidscode.com');
      setPassword('test123');
    } else {
      setEmail('test.teacher@kidscode.com');
      setPassword('test123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    setError(null);

    try {
      // Simple login simulation - in real app this would call an API
      if (email.includes('student') && selectedRole === 'student') {
        window.location.href = '/student/dashboard';
      } else if (email.includes('teacher') && selectedRole === 'teacher') {
        window.location.href = '/teacher/dashboard';
      } else {
        setError('Invalid email or role selection');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to KidsCode!
              </h1>
              <p className="text-gray-600">
                Learn to code with fun, interactive lessons
              </p>
            </div>

            {!selectedRole ? (
              /* Role Selection */
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 text-center">
                  <p>👋 Hi there! Please select your role to continue.</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-green-400 to-green-600 rounded-xl text-white hover:from-green-500 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">👨‍🎓</span>
                      <div className="text-left">
                        <div className="font-bold text-lg">I'm a Student</div>
                        <div className="text-green-100 text-sm">Learn & Explore</div>
                      </div>
                    </div>
                    <div className="text-2xl">→</div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('teacher')}
                    className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl text-white hover:from-purple-500 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">👩‍🏫</span>
                      <div className="text-left">
                        <div className="font-bold text-lg">I'm a Teacher</div>
                        <div className="text-purple-100 text-sm">Teach & Monitor</div>
                      </div>
                    </div>
                    <div className="text-2xl">→</div>
                  </button>
                </div>

                {/* Quick Access to Lessons */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-sm mb-3">Or browse lessons without logging in</p>
                  <div className="space-y-2">
                    <Link
                      href="/lessons"
                      className="block text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                    >
                      View All Lessons →
                    </Link>
                    <Link
                      href="/admin/lessons/create"
                      className="block text-green-600 hover:text-green-700 font-medium text-sm underline"
                    >
                      Create New Lesson (Admin) ✨
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white ${
                    selectedRole === 'student' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    <span className="mr-2">
                      {selectedRole === 'student' ? '👨‍🎓' : '👩‍🏫'}
                    </span>
                    {selectedRole === 'student' ? 'Student Login' : 'Teacher Login'}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-700 text-xs text-center">
                    <strong>Test credentials:</strong><br />
                    Email: {selectedRole === 'student' ? 'test.student@kidscode.com' : 'test.teacher@kidscode.com'}<br />
                    Password: test123
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                      selectedRole === 'student'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'}`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      `Sign in as ${selectedRole === 'student' ? 'Student' : 'Teacher'}`
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    ← Back to Role Selection
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">Learn by Playing</h3>
              <p className="text-white/80">Build amazing things with colorful blocks!</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-white/80">See how much you've learned and unlock new levels!</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Level Up</h3>
              <p className="text-white/80">Start with blocks and grow into a real coder!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
