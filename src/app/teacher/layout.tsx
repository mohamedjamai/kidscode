'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../../components/LanguageSelector';
import AccessibleLayout from '../../components/AccessibleLayout';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
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
      name: t('teacher.dashboard'),
      href: '/teacher/dashboard',
      icon: '🏠',
      active: pathname === '/teacher/dashboard'
    },
    {
      name: 'Studenten',
      href: '/teacher/students',
      icon: '👥',
      active: pathname === '/teacher/students' || pathname.startsWith('/teacher/students/')
    },
    {
      name: t('teacher.manageLessons'), 
      href: '/teacher/lessons',
      icon: '🔧',
      active: pathname === '/teacher/lessons'
    },
    {
      name: t('teacher.createNewLesson'),
      href: '/teacher/lessons/create', 
      icon: '✨',
      active: pathname === '/teacher/lessons/create'
    },
    {
      name: t('teacher.reviewSubmissions'),
      href: '/teacher/submissions', 
      icon: '📝',
      active: pathname === '/teacher/submissions'
    }
  ];

  return (
    <AccessibleLayout 
      title="Teacher Dashboard"
      description="Beheer je lessen, studenten en beoordelingen in de veilige KidsCode omgeving"
    >
      {/* Teacher-specific gradient background */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        
        {/* Teacher Navigation Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-3 sm:py-4">
              
              {/* Left side - Logo and Navigation */}
              <div className="flex items-center space-x-4 sm:space-x-8">
                {/* Logo */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <span className="text-white dark:text-gray-900 font-bold text-xs sm:text-sm">KC</span>
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    <span className="hidden sm:inline">KidsCode Teacher</span>
                    <span className="sm:hidden">KC Teacher</span>
                  </span>
                </div>
                
                {/* Desktop Navigation */}
                <nav 
                  className="hidden lg:flex space-x-1"
                  role="navigation"
                  aria-label="Teacher navigatie"
                >
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                        item.active
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      aria-current={item.active ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right side - Controls */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Time - Hidden on small mobile */}
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                  {currentTime.toLocaleTimeString()}
                </span>

                {/* Language Selector */}
                <div className="hidden sm:block">
                  <LanguageSelector />
                </div>

                {/* Security Indicator */}
                <div 
                  className="w-2 h-2 bg-green-500 rounded-full" 
                  title={t('teacher.secureSession')}
                  aria-label={t('teacher.secureSession')}
                />

                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 touch-target"
                  title={t('teacher.logout')}
                  aria-label={t('teacher.logout')}
                >
                  <span className="sm:hidden">🚪</span>
                  <span className="hidden sm:inline">Uitloggen</span>
                </button>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="lg:hidden pb-3 sm:pb-4" aria-label="Mobiele teacher navigatie">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-center touch-target ${
                      item.active
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-sm sm:text-base" role="img" aria-hidden="true">{item.icon}</span>
                      <span className="text-xs sm:text-sm font-medium leading-tight">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Mobile Language Selector */}
              <div className="sm:hidden mt-3 flex justify-center">
                <LanguageSelector />
              </div>
            </nav>
          </div>
        </header>

        {/* Security Notice */}
        <div 
          className="bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-800"
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center">
              <span className="text-xs text-green-700 dark:text-green-300">
                🔒 {t('teacher.secureSession')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="min-h-screen" role="main">
          {children}
        </main>

        {/* Footer */}
        <footer 
          className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          role="contentinfo"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>© 2025 KidsCode Teacher Platform</span>
              <div className="flex items-center space-x-2">
                <span>{t('teacher.sessionActive')}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AccessibleLayout>
  );
} 