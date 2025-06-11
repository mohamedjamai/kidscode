'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LessonsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lessons error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📚❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Fout bij lessen
        </h2>
        <p className="text-gray-600 mb-6">
          Er is een fout opgetreden bij het laden van de lessensectie.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Probeer Opnieuw
          </button>
          
          <Link
            href="/teacher/dashboard"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🏠 Terug naar Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 