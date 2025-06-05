'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorIcon, setErrorIcon] = useState('❌');

  useEffect(() => {
    switch (error) {
      case 'CredentialsSignin':
        setErrorMessage('Invalid login credentials. Please check your email and password.');
        setErrorIcon('🔐');
        break;
      case 'Configuration':
        setErrorMessage('There is a problem with the server configuration.');
        setErrorIcon('⚙️');
        break;
      case 'AccessDenied':
        setErrorMessage('Access denied. You do not have permission to sign in.');
        setErrorIcon('🚫');
        break;
      case 'Verification':
        setErrorMessage('The verification token has expired or has already been used.');
        setErrorIcon('⏰');
        break;
      case 'Default':
        setErrorMessage('An unexpected error occurred during authentication.');
        setErrorIcon('⚠️');
        break;
      case 'unauthorized':
        setErrorMessage('You need to log in to access this page.');
        setErrorIcon('🔒');
        break;
      default:
        setErrorMessage('An authentication error occurred. Please try again.');
        setErrorIcon('❌');
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="text-6xl mb-4">{errorIcon}</div>
          
          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Error
          </h1>
          
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">🔐 Security Notice</h3>
            <p className="text-blue-800 text-xs">
              For your security, login attempts are monitored and limited. 
              Multiple failed attempts may temporarily lock your account.
            </p>
          </div>

          {/* Help Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Need Help?</h3>
            <div className="text-yellow-800 text-xs space-y-1">
              <p>• Make sure you're using the correct email and password</p>
              <p>• Check if you selected the right role (Student/Teacher)</p>
              <p>• Try the test credentials provided on the login page</p>
              <p>• Wait 15 minutes if your account is temporarily locked</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Try Again
            </Link>
            
            <Link
              href="/lessons"
              className="block w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Lessons Instead
            </Link>
          </div>

          {/* Additional Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Having trouble? This is a demo system with secure test accounts.
              <br />Use the credentials shown on the login page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 