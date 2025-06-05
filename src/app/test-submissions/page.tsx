'use client';

import { useState } from 'react';

export default function TestSubmissions() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testGetSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();
      setResult({ type: 'GET', data, timestamp: new Date().toISOString() });
    } catch (error) {
      setResult({ type: 'GET', error: error?.toString(), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const testCreateSubmission = async () => {
    setLoading(true);
    try {
      const testSubmission = {
        student_name: "Test Student",
        lesson_id: 1,
        html_code: "<h1>Test HTML</h1><p>This is a test submission</p>",
        css_code: "h1 { color: red; }",
        javascript_code: "console.log('test');",
        preview_screenshot: "test preview"
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testSubmission),
      });

      const data = await response.json();
      setResult({ type: 'POST', data, timestamp: new Date().toISOString() });
    } catch (error) {
      setResult({ type: 'POST', error: error?.toString(), timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Test Submissions System</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">API Tests</h2>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={testGetSubmissions}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              📥 Test GET Submissions
            </button>
            
            <button
              onClick={testCreateSubmission}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 ml-4"
            >
              📤 Test CREATE Submission
            </button>
          </div>

          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              <span>Testing...</span>
            </div>
          )}

          {result && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {result.type} Result
                </h3>
                <span className="text-xs text-gray-500">{result.timestamp}</span>
              </div>
              
              <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded overflow-auto">
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🔍 How to use this test:</h3>
          <ol className="text-yellow-800 text-sm space-y-1">
            <li>1. Click "Test GET Submissions" to see all current submissions</li>
            <li>2. Click "Test CREATE Submission" to add a new test submission</li>
            <li>3. Check console for detailed logging</li>
            <li>4. Go to Teacher Dashboard → Submissions to verify submissions appear</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 