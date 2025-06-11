'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function HomePage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'demo' | 'manual'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoLogin = async (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setIsLoading(true);
    
    // Use test credentials based on role selection
    const credentials = {
      email: role === 'student' ? 'test.student@kidscode.com' : 'test.teacher@kidscode.com',
      password: 'test123',
      role: role
    };
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
        redirect: false,
      });
      
      if (result?.ok) {
        // Redirect based on role
        if (role === 'student') {
          window.location.href = '/student/dashboard';
        } else {
          window.location.href = '/teacher/dashboard';
        }
      } else {
        console.error('Authentication failed:', result?.error);
        alert(`Login failed: ${result?.error || 'Unknown error'}. Please try again.`);
        setIsLoading(false);
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      alert('An error occurred during login. Please try again.');
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email || !password) {
      alert('Please select a role and enter your credentials.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        role: selectedRole,
        redirect: false,
      });
      
      if (result?.ok) {
        // Redirect based on role
        if (selectedRole === 'student') {
          window.location.href = '/student/dashboard';
        } else {
          window.location.href = '/teacher/dashboard';
        }
      } else {
        console.error('Authentication failed:', result?.error);
        alert(`Login failed: ${result?.error || 'Unknown error'}. Please check your credentials and try again.`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      alert('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setIsLoading(false);
  };

  // If already logged in, redirect to appropriate dashboard
  if (session) {
    const userRole = (session.user as any)?.role;
    if (userRole === 'student') {
      window.location.href = '/student/dashboard';
      return null;
    } else if (userRole === 'teacher') {
      window.location.href = '/teacher/dashboard';
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                👨‍💻
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  KidsCode 🚀
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn to code with fun!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <button 
                onClick={() => window.location.href = '/lessons'}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                📚 Lessons
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome to KidsCode!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
            The fun way for kids to learn programming with interactive lessons and creative projects
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-2">🎮</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Interactive</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Fun lessons</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Achievements</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Track progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-2">🔐</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Safe & Secure</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Child-friendly</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl mb-2">👨‍🏫</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Teacher Tools</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Easy management</div>
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            {/* Login Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
              <button
                onClick={() => {
                  setLoginMode('demo');
                  resetForm();
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  loginMode === 'demo'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🚀 Demo Mode
              </button>
              <button
                onClick={() => {
                  setLoginMode('manual');
                  resetForm();
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  loginMode === 'manual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                🔐 Manual Login
              </button>
            </div>

            {loginMode === 'demo' ? (
              /* Demo Mode */
              <>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
                  Choose Your Role 👤
                </h3>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Logging in as {selectedRole}...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Student Login */}
                    <button
                      onClick={() => handleDemoLogin('student')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                          🧑‍🎓
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-lg">I'm a Student</div>
                          <div className="text-blue-100 text-sm">Ready to learn and code!</div>
                        </div>
                        <div className="text-2xl">→</div>
                      </div>
                    </button>

                    {/* Teacher Login */}
                    <button
                      onClick={() => handleDemoLogin('teacher')}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                          👩‍🏫
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-lg">I'm a Teacher</div>
                          <div className="text-green-100 text-sm">Manage students and lessons</div>
                        </div>
                        <div className="text-2xl">→</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Demo Credentials Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Demo Mode - Test Credentials
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    <p><strong>Student:</strong> test.student@kidscode.com</p>
                    <p><strong>Teacher:</strong> test.teacher@kidscode.com</p>
                    <p><strong>Password:</strong> test123</p>
                  </div>
                </div>
              </>
            ) : (
              /* Manual Login Mode */
              <>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
                  Login with Your Account 🔐
                </h3>

                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRole === 'student'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-xl mb-1">🧑‍🎓</div>
                      <div className="text-sm font-medium">Student</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('teacher')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedRole === 'teacher'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-xl mb-1">👩‍🏫</div>
                      <div className="text-sm font-medium">Teacher</div>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleManualLogin} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !selectedRole || !email || !password}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Logging in...
                      </div>
                    ) : (
                      `🚀 Login as ${selectedRole || 'User'}`
                    )}
                  </button>
                </form>

                {/* Available Accounts Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Available Test Accounts
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    <p><strong>Students:</strong> test.student@kidscode.com, student@kidscode.com</p>
                    <p><strong>Teachers:</strong> test.teacher@kidscode.com, teacher@kidscode.com</p>
                    <p><strong>Passwords:</strong> test123, securepass123, teacherpass123</p>
                  </div>
                </div>
              </>
            )}

            {/* Demo Access */}
            <div className="mt-6">
              <div className="text-center mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Want to explore first?
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.location.href = '/lessons'}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  📚 Browse Lessons
                </button>
                <button
                  onClick={() => window.location.href = '/accessibility-demo'}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  ♿ Accessibility
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 max-w-lg mx-auto">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-amber-500 text-xl flex-shrink-0">🔐</div>
              <div>
                <h4 className="text-amber-800 dark:text-amber-300 font-semibold text-sm mb-1">
                  Enhanced Security Mode
                </h4>
                <p className="text-amber-700 dark:text-amber-400 text-xs">
                  For maximum child safety, sessions are not persistent. You'll need to login fresh each time you visit. This ensures no unauthorized access to student accounts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <button 
              onClick={() => window.location.href = '/about'}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About KidsCode
            </button>
            <span>•</span>
            <button 
              onClick={() => window.location.href = '/privacy'}
              className="hover:text-blue-600 dark:text-gray-400 transition-colors"
            >
              Privacy & Safety
            </button>
            <span>•</span>
            <button 
              onClick={() => window.location.href = '/help'}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Help & Support
            </button>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            © 2024 KidsCode - Making coding fun and safe for everyone! 🌟
          </div>
        </div>
      </div>
    </div>
  );
}
