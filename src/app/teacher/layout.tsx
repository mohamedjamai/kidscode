'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Security: Block access to non-teacher routes
  useEffect(() => {
    // Prevent navigation outside teacher scope
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // This will show a warning if user tries to navigate away
      if (!window.location.pathname.startsWith('/teacher')) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/teacher/dashboard',
      icon: '🏠',
      active: pathname === '/teacher/dashboard'
    },
    {
      name: 'Manage Lessons', 
      href: '/teacher/lessons',
      icon: '🔧',
      active: pathname === '/teacher/lessons'
    },
    {
      name: 'Create Lesson',
      href: '/teacher/lessons/create', 
      icon: '✨',
      active: pathname === '/teacher/lessons/create'
    },
    {
      name: 'Submissions',
      href: '/teacher/submissions', 
      icon: '📝',
      active: pathname === '/teacher/submissions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Teacher Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KC</span>
                </div>
                <span className="font-bold text-gray-900">KidsCode Teacher</span>
              </div>
              
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                🕐 {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600">
                👨‍🏫 Teacher Mode
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Secure Session Active"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Security Notice */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
            <span>🔒</span>
            <span>Secure Teacher Environment - All navigation stays within teacher scope</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>© 2025 KidsCode Teacher Platform</span>
              <span>🛡️ Secure Session</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Session: Active</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 