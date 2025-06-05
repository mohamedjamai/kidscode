'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An error occurred during sign in.';
  if (error === 'AccessDenied') {
    errorMessage = 'Please use your school email address to sign in.';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In Error
              </h1>
              <p className="text-gray-600">{errorMessage}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4 text-sm text-red-700">
                <p>
                  If you're a student, make sure you're using your school-provided
                  email address. If you continue to have problems, please contact
                  your teacher.
                </p>
              </div>

              <Link
                href="/"
                className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>

              <div className="text-center text-sm text-gray-500">
                <p>Need help? Ask your teacher for assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 