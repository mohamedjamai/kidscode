'use client';

import { useState } from 'react';
import { useCSRF } from '@/hooks/useCSRF';
import { securePost, secureGet } from '@/lib/api';
import SubmissionForm from '@/components/SubmissionForm';

export default function SecurityDemoPage() {
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  // CSRF protection
  const { token: csrfToken, loading: csrfLoading, error: csrfError, refreshToken } = useCSRF();

  const testCSRFProtection = async () => {
    setLoading(true);
    setApiResponse('');

    try {
      console.log('🔐 Testing CSRF protection...');
      
      // Test 1: Try without CSRF token (should fail)
      console.log('❌ Test 1: Attempt without CSRF token');
      
      try {
        const unsafeResponse = await fetch('/api/lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Test Without CSRF',
            description: 'This should fail',
            content: 'Test content',
            lesson_type: 'html',
            difficulty_level_id: 1
          }),
        });
        
        const unsafeResult = await unsafeResponse.json();
        setApiResponse(prev => prev + `❌ Zonder CSRF: ${unsafeResult.message || 'Request blocked'}\n`);
      } catch (err) {
        setApiResponse(prev => prev + `❌ Zonder CSRF: Request blocked (${err instanceof Error ? err.message : 'Error'})\n`);
      }

      // Test 2: Try with CSRF token (should succeed)
      if (csrfToken) {
        console.log('✅ Test 2: Attempt with CSRF token');
        
        try {
          const safeResponse = await securePost('/api/lessons', {
            title: 'Test Met CSRF',
            description: 'This should succeed',
            content: 'Test content with CSRF protection',
            lesson_type: 'html',
            difficulty_level_id: 1
          }, {
            csrfToken: csrfToken
          });

          const safeResult = await safeResponse.json();
          setApiResponse(prev => prev + `✅ Met CSRF: ${safeResult.message || 'Request successful'}\n`);
        } catch (err) {
          setApiResponse(prev => prev + `⚠️ Met CSRF: ${err instanceof Error ? err.message : 'Error'}\n`);
        }
      } else {
        setApiResponse(prev => prev + `⚠️ Met CSRF: No token available\n`);
      }

      // Test 3: Test GET request (should work normally)
      console.log('ℹ️ Test 3: GET request (no CSRF needed)');
      
      try {
        const getResponse = await secureGet('/api/difficulty-levels');
        const getResult = await getResponse.json();
        setApiResponse(prev => prev + `ℹ️ GET request: ${getResult.success ? 'Successful' : 'Failed'}\n`);
      } catch (err) {
        setApiResponse(prev => prev + `ℹ️ GET request: ${err instanceof Error ? err.message : 'Error'}\n`);
      }

    } catch (error) {
      console.error('Test error:', error);
      setApiResponse(prev => prev + `💥 Test Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setLoading(false);
    }
  };

  // Main error state - if CSRF system completely fails
  if (csrfError && !csrfLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
          <div className="text-6xl mb-4">🔒❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Security System Error
          </h1>
          <p className="text-gray-600 mb-6">
            De beveiligingscomponenten kunnen niet worden geladen:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-mono">{csrfError}</p>
          </div>
          <button
            onClick={refreshToken}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🔄 Probeer Opnieuw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔐 Security Demo</h1>
          <p className="text-gray-600 text-lg">
            Live demonstratie van CSRF protection in KidsCode
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CSRF Status */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🛡️ CSRF Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <span className="font-medium">Token Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  csrfLoading ? 'bg-yellow-100 text-yellow-800' :
                  csrfToken ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {csrfLoading ? '⏳ Loading...' : csrfToken ? '✅ Active' : '❌ Missing'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <span className="font-medium">Token Value:</span>
                <span className="text-xs text-gray-600 font-mono">
                  {csrfToken ? `${csrfToken.substring(0, 12)}...` : 'Geen token'}
                </span>
              </div>
              
              {csrfError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-800 font-medium">❌ CSRF Error:</p>
                  <p className="text-red-600 text-sm">{csrfError}</p>
                </div>
              )}
              
              <button
                onClick={refreshToken}
                disabled={csrfLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                🔄 Refresh Token
              </button>
            </div>
          </div>

          {/* API Tests */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🧪 API Tests</h2>
            
            <div className="space-y-4">
              <button
                onClick={testCSRFProtection}
                disabled={loading || csrfLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Testing...
                  </div>
                ) : (
                  '🚀 Test CSRF Protection'
                )}
              </button>
              
              {apiResponse && (
                <div className="p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm whitespace-pre-line max-h-40 overflow-y-auto">
                  {apiResponse}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Form Demo - Only show when CSRF is working */}
        {csrfToken && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Live Form Demo</h2>
              <p className="text-gray-600 mb-6">
                Deze form gebruikt automatische CSRF protection:
              </p>
              
              <SubmissionForm
                lessonId={1}
                lessonTitle="Security Demo Lesson"
                lessonType="html"
                difficultyName="Beginner"
                studentName="Demo Student"
                onSubmissionSuccess={(id) => {
                  console.log('✅ Submission successful:', id);
                }}
                onSubmissionError={(error) => {
                  console.log('❌ Submission failed:', error);
                }}
              />
            </div>
          </div>
        )}

        {/* Loading state for form demo */}
        {csrfLoading && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                <span className="text-gray-600">Security systeem wordt geladen...</span>
              </div>
            </div>
          </div>
        )}

        {/* Security Features */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">🔒 Beveiligingsfeatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="font-semibold text-green-800">CSRF Protection</h4>
                  <p className="text-green-700 text-sm">Automatische beveiliging tegen cross-site request forgery</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h4 className="font-semibold text-green-800">Secure API Calls</h4>
                  <p className="text-green-700 text-sm">Alle POST/PUT/DELETE requests zijn beveiligd</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-semibold text-green-800">Auto Token Refresh</h4>
                  <p className="text-green-700 text-sm">Tokens worden automatisch ververst bij problemen</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">👥</span>
                <div>
                  <h4 className="font-semibold text-green-800">User-Friendly</h4>
                  <p className="text-green-700 text-sm">Transparant voor gebruikers, geen extra stappen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 