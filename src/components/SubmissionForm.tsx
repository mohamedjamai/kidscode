'use client';

import { useState } from 'react';
import { useCSRF } from '@/hooks/useCSRF';
import { securePost } from '@/lib/api';

interface SubmissionFormProps {
  lessonId: number;
  lessonTitle: string;
  lessonType: string;
  difficultyName: string;
  studentName: string;
  onSubmissionSuccess?: (submissionId: number) => void;
  onSubmissionError?: (error: string) => void;
}

export default function SubmissionForm({
  lessonId,
  lessonTitle,
  lessonType,
  difficultyName,
  studentName,
  onSubmissionSuccess,
  onSubmissionError
}: SubmissionFormProps) {
  const [code, setCode] = useState({
    html: '',
    css: '',
    javascript: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // CSRF protection
  const { token: csrfToken, loading: csrfLoading, error: csrfError, refreshToken } = useCSRF();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csrfToken) {
      setMessage('Beveiligingstoken niet beschikbaar. Ververs de pagina.');
      setIsSuccess(false);
      onSubmissionError?.('CSRF token not available');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const submissionData = {
        student_name: studentName,
        lesson_id: lessonId,
        lesson_title: lessonTitle,
        lesson_type: lessonType,
        difficulty_name: difficultyName,
        html_code: code.html,
        css_code: code.css,
        javascript_code: code.javascript
      };

      console.log('🔐 Submitting with CSRF protection:', { lessonId, studentName });

      const response = await securePost('/api/submissions', submissionData, {
        csrfToken: csrfToken
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Code succesvol ingediend! 🎉');
        setIsSuccess(true);
        onSubmissionSuccess?.(result.submission_id);
        
        // Clear form
        setCode({ html: '', css: '', javascript: '' });
      } else {
        if (result.code === 'CSRF_INVALID') {
          setMessage('Beveiligingstoken verlopen. Probeer opnieuw...');
          await refreshToken();
        } else {
          setMessage(result.error || 'Fout bij indienen van code');
        }
        setIsSuccess(false);
        onSubmissionError?.(result.error || 'Submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      if (error instanceof Error && error.message.includes('CSRF token required')) {
        setMessage('Beveiligingstoken vereist. Ververs de pagina.');
        await refreshToken();
      } else {
        setMessage('Netwerkfout. Probeer opnieuw.');
      }
      setIsSuccess(false);
      onSubmissionError?.(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while CSRF token loads
  if (csrfLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-600">Beveiligingscontrole...</span>
        </div>
      </div>
    );
  }

  // Show CSRF error
  if (csrfError) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔒❌</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Beveiligingsprobleem</h3>
          <p className="text-gray-600 mb-4">{csrfError}</p>
          <button
            onClick={refreshToken}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            🔄 Probeer Opnieuw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Jouw Code Indienen 📤
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">🔒</span>
            <span>Beveiligd</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HTML Code */}
          <div>
            <label htmlFor="html" className="block text-sm font-medium text-gray-700 mb-2">
              HTML Code 🌐
            </label>
            <textarea
              id="html"
              value={code.html}
              onChange={(e) => setCode({ ...code, html: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Voer je HTML code hier in..."
            />
          </div>

          {/* CSS Code */}
          <div>
            <label htmlFor="css" className="block text-sm font-medium text-gray-700 mb-2">
              CSS Code 🎨
            </label>
            <textarea
              id="css"
              value={code.css}
              onChange={(e) => setCode({ ...code, css: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Voer je CSS code hier in..."
            />
          </div>

          {/* JavaScript Code */}
          <div>
            <label htmlFor="javascript" className="block text-sm font-medium text-gray-700 mb-2">
              JavaScript Code ⚡
            </label>
            <textarea
              id="javascript"
              value={code.javascript}
              onChange={(e) => setCode({ ...code, javascript: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Voer je JavaScript code hier in..."
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              isSuccess 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !csrfToken}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Indienen...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Code Indienen
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 