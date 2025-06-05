'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'text-blue-600' : 'text-gray-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">KidsCode</span>
            </Link>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {session.user.role === 'student' && (
                  <>
                    <Link
                      href="/student/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        isActive('/student/dashboard')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/student/blocks"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        isActive('/student/blocks')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Block Programming
                    </Link>
                    <Link
                      href="/student/achievements"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        isActive('/student/achievements')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      My Achievements
                    </Link>
                  </>
                )}
                {session.user.role === 'teacher' && (
                  <>
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        isActive('/dashboard')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Teacher Dashboard
                    </Link>
                    <Link
                      href="/teacher/students"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        isActive('/teacher/students')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      My Students
                    </Link>
                    <Link
                      href="/teacher/lessons"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                        isActive('/teacher/lessons')
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Manage Lessons
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {session.user.role === 'teacher' ? '👩‍🏫 Teacher' : '👨‍🎓 Student'}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 