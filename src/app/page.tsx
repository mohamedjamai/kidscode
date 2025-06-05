'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateEmail, validatePassword } from '@/lib/auth';

// Secure user database - in real app this would be in a database
const SECURE_USERS = {
  'student@kidscode.com': {
    password: 'securepass123',
    role: 'student',
    name: 'Demo Student'
  },
  'teacher@kidscode.com': {
    password: 'teacherpass123', 
    role: 'teacher',
    name: 'Demo Teacher'
  },
  'test.student@kidscode.com': {
    password: 'test123',
    role: 'student', 
    name: 'Test Student'
  },
  'test.teacher@kidscode.com': {
    password: 'test123',
    role: 'teacher',
    name: 'Test Teacher'
  }
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setError(null);
    setLoginAttempts(0);
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
      // Client-side validation
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message || 'Invalid password.');
        setLoading(false);
        return;
      }

      // Use NextAuth signIn with credentials
      const result = await signIn('credentials', {
        email,
        password,
        role: selectedRole,
        redirect: false,
      });

      if (result?.error) {
        setLoginAttempts(prev => prev + 1);
        
        // Handle specific error messages
        if (result.error.includes('Too many login attempts')) {
          setError('🚫 Too many failed attempts. Please wait 15 minutes before trying again.');
        } else if (result.error.includes('Account temporarily locked')) {
          setError('🔒 Account locked due to multiple failed attempts. Try again later.');
        } else if (result.error.includes('Invalid email format')) {
          setError('📧 Please enter a valid email address.');
        } else if (result.error.includes('role')) {
          setError('⚠️ Wrong account type selected. Please choose the correct role.');
        } else {
          setError('🔐 Invalid credentials. Please check your email and password.');
        }

        // Show additional help after multiple attempts
        if (loginAttempts >= 2) {
          setError(prev => prev + ' Need help? Check the test credentials shown above.');
        }
      } else {
        // Wait for session to be established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on role
        if (selectedRole === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/teacher/dashboard');
        }
      }
    } catch (err) {
      setError('❌ Connection error. Please check your internet and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError(null);
    setLoginAttempts(0);
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
                  <p>🔐 <strong>Secure Login System</strong></p>
                  <p className="text-xs mt-1">Protected with rate limiting and account security</p>
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
                  <Link
                    href="/lessons"
                    className="block text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                  >
                    View All Lessons →
                  </Link>
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
                    <strong>🔐 Secure Test Credentials:</strong><br />
                    Email: {selectedRole === 'student' ? 'test.student@kidscode.com' : 'test.teacher@kidscode.com'}<br />
                    Password: test123
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
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
                        Signing in securely...
                      </div>
                    ) : (
                      `🚀 Sign in as ${selectedRole === 'student' ? 'Student' : 'Teacher'}`
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

                {loginAttempts > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-700 text-xs text-center">
                      ⚠️ Login attempts: {loginAttempts}/5. Account will be temporarily locked after 5 failed attempts.
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-white/80">Protected with advanced security features!</p>
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
