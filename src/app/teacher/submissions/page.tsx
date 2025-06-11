'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Submission {
  id: number;
  student_name: string;
  lesson_id: number;
  lesson_title: string;
  lesson_type: string;
  difficulty_name: string;
  html_code: string;
  css_code: string;
  javascript_code: string;
  preview_screenshot: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [newSubmissionCount, setNewSubmissionCount] = useState(0);
  const [previousSubmissionCount, setPreviousSubmissionCount] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    grade: '',
    feedback: '',
    reviewed_by: 'Teacher'
  });

  useEffect(() => {
    // Initial fetch
    fetchSubmissions();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Set up Server-Sent Events for real-time updates
    console.log('🔗 Setting up SSE connection...');
    const eventSource = new EventSource('/api/submissions/events');
    
    eventSource.onopen = () => {
      console.log('✅ SSE connection established');
      setDebugInfo('🔗 Real-time connection active');
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 SSE received:', data);
        
        switch (data.type) {
          case 'initial':
            console.log(`📊 Initial data: ${data.count} submissions`);
            setSubmissions(data.submissions || []);
            setPreviousSubmissionCount(data.count);
            setDebugInfo(`🔗 Real-time connected · ${data.count} submissions loaded at ${new Date(data.timestamp).toLocaleTimeString()}`);
            setLastRefresh(new Date(data.timestamp));
            break;
            
          case 'new_submissions':
            console.log(`🔔 New submissions detected: ${data.newSubmissions?.length || 0}`);
            setSubmissions(data.submissions || []);
            
            if (data.newSubmissions && data.newSubmissions.length > 0) {
              setNewSubmissionCount(prev => prev + data.newSubmissions.length);
              
              // Show browser notification
              if (Notification.permission === 'granted') {
                new Notification('KidsCode - New Submission!', {
                  body: `${data.newSubmissions.length} new submission(s) from students`,
                  icon: '/favicon.ico'
                });
              }
              
              setDebugInfo(`🔔 ${data.newSubmissions.length} new submission(s) received at ${new Date(data.timestamp).toLocaleTimeString()}`);
            }
            
            setPreviousSubmissionCount(data.count);
            setLastRefresh(new Date(data.timestamp));
            break;
            
          case 'new_submission':
            console.log(`🔔 Single new submission: ${data.submission?.student_name}`);
            // Refresh submissions list
            fetchSubmissions();
            setNewSubmissionCount(prev => prev + 1);
            
            // Show browser notification
            if (Notification.permission === 'granted' && data.submission) {
              new Notification('KidsCode - New Submission!', {
                body: `${data.submission.student_name} submitted work for ${data.submission.lesson_title}`,
                icon: '/favicon.ico'
              });
            }
            
            setDebugInfo(`🔔 New submission from ${data.submission?.student_name || 'Unknown'} at ${new Date(data.timestamp).toLocaleTimeString()}`);
            setLastRefresh(new Date(data.timestamp));
            break;
            
          case 'heartbeat':
            // Connection is alive, no action needed
            break;
            
          default:
            console.log('❓ Unknown SSE message type:', data.type);
        }
      } catch (error) {
        console.error('❌ Error processing SSE message:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('❌ SSE connection error:', error);
      setDebugInfo('❌ Real-time connection lost - attempting to reconnect...');
    };
    
    // Cleanup on unmount
    return () => {
      eventSource.close();
      console.log('🔗 SSE connection closed');
    };
  }, []);

  const fetchSubmissions = async () => {
    console.log('🔄 Fetching submissions...');
    
    try {
      const response = await fetch('/api/submissions', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      const data = await response.json();
      
      console.log('📊 API Response:', data);
      
      if (data.success) {
        const newSubmissions = data.submissions || [];
        const currentCount = newSubmissions.length;
        
        // Save to localStorage as backup
        try {
          localStorage.setItem('kidscode_submissions_backup', JSON.stringify({
            submissions: newSubmissions,
            timestamp: new Date().toISOString(),
            count: currentCount
          }));
        } catch (e) {
          console.warn('Failed to save submissions backup to localStorage');
        }
        
        // Check for new submissions
        if (previousSubmissionCount > 0 && currentCount > previousSubmissionCount) {
          const newCount = currentCount - previousSubmissionCount;
          setNewSubmissionCount(prev => prev + newCount);
          console.log(`🔔 ${newCount} new submission(s) detected!`);
          
          // Show notification
          if (Notification.permission === 'granted') {
            new Notification('KidsCode - New Submission!', {
              body: `${newCount} new submission(s) received`,
              icon: '/favicon.ico'
            });
          }
        }
        
        setSubmissions(newSubmissions);
        setPreviousSubmissionCount(currentCount);
        setDebugInfo(`Last fetch: ${new Date().toLocaleTimeString()}, Found: ${currentCount} submissions${data.source ? ` (${data.source})` : ''}`);
        setLastRefresh(new Date());
        console.log(`✅ Loaded ${currentCount} submissions`);
      } else {
        setError(data.message || 'Failed to load submissions');
        setDebugInfo(`Error: ${data.message}`);
        
        // Try to load from localStorage backup
        try {
          const backup = localStorage.getItem('kidscode_submissions_backup');
          if (backup) {
            const backupData = JSON.parse(backup);
            setSubmissions(backupData.submissions || []);
            setDebugInfo(`⚠️ Using backup data from ${new Date(backupData.timestamp).toLocaleTimeString()}`);
          }
        } catch (e) {
          console.warn('Failed to load backup from localStorage');
        }
      }
    } catch (err) {
      console.error('❌ Failed to load submissions:', err);
      setError('Failed to load submissions');
      setDebugInfo(`Network error: ${err}`);
      
      // Try to load from localStorage backup
      try {
        const backup = localStorage.getItem('kidscode_submissions_backup');
        if (backup) {
          const backupData = JSON.parse(backup);
          setSubmissions(backupData.submissions || []);
          setDebugInfo(`⚠️ Using backup data from ${new Date(backupData.timestamp).toLocaleTimeString()}`);
        }
      } catch (e) {
        console.warn('Failed to load backup from localStorage');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (submission: Submission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      grade: submission.grade?.toString() || '',
      feedback: submission.feedback || '',
      reviewed_by: 'Teacher'
    });
    setIsReviewing(true);
  };

  const submitReview = async () => {
    if (!selectedSubmission) return;

    console.log(`📝 Attempting to review submission ${selectedSubmission.id}`);
    console.log(`📊 Submission details:`, {
      id: selectedSubmission.id,
      student: selectedSubmission.student_name,
      lesson: selectedSubmission.lesson_title,
      current_grade: selectedSubmission.grade
    });
    console.log('📝 Review data being sent:', { 
      grade: reviewForm.grade, 
      grade_parsed: reviewForm.grade ? parseFloat(reviewForm.grade) : null,
      feedback: reviewForm.feedback,
      reviewed_by: reviewForm.reviewed_by
    });

    try {
      const reviewData = {
        grade: reviewForm.grade ? parseFloat(reviewForm.grade) : null,
        feedback: reviewForm.feedback || '',
        reviewed_by: reviewForm.reviewed_by || 'Teacher'
      };

      console.log(`📤 Sending PUT to /api/submissions/${selectedSubmission.id}`);
      console.log('📤 Review payload:', reviewData);

      const response = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();
      console.log('📊 Review response:', data);
      console.log('📊 Response status:', response.status);

      if (data.success) {
        console.log(`✅ Review saved successfully for submission ${selectedSubmission.id}`);
        
        // Refresh submissions to show updated data
        await fetchSubmissions();
        setIsReviewing(false);
        setSelectedSubmission(null);
        
        // Show success message
        setError(null);
        setDebugInfo(`✅ Review saved successfully at ${new Date().toLocaleTimeString()}`);
      } else {
        console.error('❌ Review failed:', data.message);
        setError(`Failed to save review: ${data.message}`);
        setDebugInfo(`❌ Review failed: ${data.message}`);
      }
    } catch (err) {
      console.error('❌ Review submission error:', err);
      setError('Network error while saving review. Please try again.');
      setDebugInfo(`❌ Network error: ${err}`);
    }
  };

  const testReviewAPI = async () => {
    if (submissions.length === 0) {
      setError('No submissions available to test');
      return;
    }

    const testSubmission = submissions[0];
    console.log(`🧪 Testing review API with submission ${testSubmission.id}`);

    try {
      const testReviewData = {
        grade: 85,
        feedback: 'Test review - good work!',
        reviewed_by: 'Test Teacher'
      };

      const response = await fetch(`/api/submissions/${testSubmission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testReviewData),
      });

      const data = await response.json();
      console.log('🧪 Test review response:', data);

      if (data.success) {
        setDebugInfo(`✅ Test review successful at ${new Date().toLocaleTimeString()}`);
        await fetchSubmissions(); // Refresh to see changes
      } else {
        setError(`Test review failed: ${data.message}`);
      }
    } catch (error) {
      console.error('🧪 Test review error:', error);
      setError(`Test review error: ${error}`);
    }
  };

  const clearAllSubmissions = async () => {
    if (!confirm('Are you sure you want to delete ALL submissions? This cannot be undone!')) {
      return;
    }

    try {
      const response = await fetch('/api/submissions', {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('🗑️ Clear submissions response:', data);

      if (data.success) {
        setSubmissions([]);
        setSelectedSubmission(null);
        setIsReviewing(false);
        setNewSubmissionCount(0);
        setPreviousSubmissionCount(0);
        setDebugInfo(`🗑️ All submissions cleared at ${new Date().toLocaleTimeString()}`);
        setError(null);
      } else {
        setError(`Failed to clear submissions: ${data.message}`);
      }
    } catch (error) {
      console.error('🗑️ Clear submissions error:', error);
      setError(`Failed to clear submissions: ${error}`);
    }
  };

  const createDemoSubmissions = async () => {
    const demoSubmissions = [
      {
        student_name: "Emma Johnson",
        lesson_id: 1,
        html_code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage!</p>
</body>
</html>`,
        css_code: `h1 { color: blue; text-align: center; }
p { color: green; }`,
        javascript_code: `console.log("Hello from Emma!");`
      },
      {
        student_name: "Alex Chen", 
        lesson_id: 2,
        html_code: `<!DOCTYPE html>
<html>
<head>
    <title>Styled Page</title>
</head>
<body>
    <h1>CSS is Fun!</h1>
    <p class="highlight">Colorful text!</p>
</body>
</html>`,
        css_code: `body { background: lightblue; }
h1 { color: darkblue; }
.highlight { background: yellow; padding: 10px; }`,
        javascript_code: ``
      },
      {
        student_name: "Maya Patel",
        lesson_id: 1, 
        html_code: `<!DOCTYPE html>
<html>
<head>
    <title>About Me</title>
</head>
<body>
    <h1>Hi, I'm Maya!</h1>
    <p>I love learning to code!</p>
    <p>This is my first HTML page.</p>
</body>
</html>`,
        css_code: `h1 { color: purple; font-family: Arial; }
p { color: darkgreen; margin: 15px; }`,
        javascript_code: `alert("Welcome to my page!");`
      }
    ];

    try {
      let createdCount = 0;
      for (const submission of demoSubmissions) {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });
        
        if (response.ok) {
          createdCount++;
        }
      }
      
      setDebugInfo(`✅ Created ${createdCount} demo submissions at ${new Date().toLocaleTimeString()}`);
      await fetchSubmissions(); // Refresh to show new submissions
      
    } catch (error) {
      console.error('❌ Failed to create demo submissions:', error);
      setError('Failed to create demo submissions');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'html': return '🌐';
      case 'css': return '🎨';
      case 'javascript': return '⚡';
      case 'python': return '🐍';
      case 'blocks': return '🧩';
      default: return '📚';
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-600';
    if (grade >= 7) return 'bg-green-100 text-green-800';
    if (grade >= 5.5) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const generatePreview = (submission: Submission) => {
    const html = submission.html_code || '';
    const css = submission.css_code || '';
    const js = submission.javascript_code || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Submissions</h1>
              <p className="text-gray-600">Review and grade student work</p>
            </div>
            <div className="text-right">
              <div className="flex space-x-2">
                <button
                  onClick={createDemoSubmissions}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <span>🎭</span>
                  <span>Demo Data</span>
                </button>
                <button
                  onClick={testReviewAPI}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <span>🧪</span>
                  <span>Test Review</span>
                </button>
                <button
                  onClick={clearAllSubmissions}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <span>🗑️</span>
                  <span>Clear All</span>
                </button>
                <button
                  onClick={fetchSubmissions}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <span>🔄</span>
                  <span>Refresh Now</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Real-time connection • Last update: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {/* Debug Information */}
          {debugInfo && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                <strong>Debug:</strong> {debugInfo}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 text-sm underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Submissions List */}
          <div className="w-1/2">
            <div className="bg-white rounded-xl shadow-lg border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <span>Submissions ({submissions.length})</span>
                    {newSubmissionCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        {newSubmissionCount} new!
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      Real-time updates • SSE
                    </div>
                    {newSubmissionCount > 0 && (
                      <button
                        onClick={() => setNewSubmissionCount(0)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg"
                      >
                        Mark as seen
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No submissions yet</h3>
                    <p className="text-gray-500 mb-4">Students haven't submitted any work yet</p>
                    <div className="text-xs text-gray-400">
                      {debugInfo && `Debug: ${debugInfo}`}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {submissions.map((submission) => {
                      // Check if submission is recent (less than 30 seconds old)
                      const submissionTime = new Date(submission.submitted_at).getTime();
                      const now = new Date().getTime();
                      const isRecent = (now - submissionTime) < 30000; // 30 seconds
                      
                      return (
                        <div 
                          key={submission.id} 
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedSubmission?.id === submission.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                          } ${isRecent ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white relative">
                                <span className="text-lg">{getTypeIcon(submission.lesson_type)}</span>
                                {isRecent && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{submission.student_name}</h3>
                                  {isRecent && (
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                      NEW!
                                    </span>
                                  )}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(submission.grade)}`}>
                                    {submission.grade ? `${submission.grade}/10` : 'Not graded'}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-1">{submission.lesson_title}</p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(submission.submitted_at).toLocaleDateString()} at{' '}
                                  {new Date(submission.submitted_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-400 text-xs">#{submission.id}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submission Details/Review Panel */}
          <div className="w-1/2">
            {selectedSubmission ? (
              <div className="bg-white rounded-xl shadow-lg border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      {isReviewing ? 'Review Submission' : 'Submission Details'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {!isReviewing ? (
                        <button
                          onClick={() => handleReview(selectedSubmission)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          ✏️ Review
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={submitReview}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                          >
                            💾 Save Review
                          </button>
                          <button
                            onClick={() => setIsReviewing(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {isReviewing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Grade (0-10)</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={reviewForm.grade}
                          onChange={(e) => setReviewForm({...reviewForm, grade: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter grade 0-10 (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
                        <textarea
                          value={reviewForm.feedback}
                          onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide feedback for the student..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reviewed By</label>
                        <input
                          type="text"
                          value={reviewForm.reviewed_by}
                          onChange={(e) => setReviewForm({...reviewForm, reviewed_by: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                          <span className="text-2xl">{getTypeIcon(selectedSubmission.lesson_type)}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubmission.student_name}</h3>
                          <p className="text-gray-600 mb-2">{selectedSubmission.lesson_title}</p>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedSubmission.grade)}`}>
                              {selectedSubmission.grade ? `Grade: ${selectedSubmission.grade}/10` : 'Not graded'}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {selectedSubmission.lesson_type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Submitted:</h4>
                        <p className="text-gray-700">{new Date(selectedSubmission.submitted_at).toLocaleString()}</p>
                      </div>

                      {selectedSubmission.feedback && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Teacher Feedback:</h4>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-blue-800">{selectedSubmission.feedback}</p>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Student's Code:</h4>
                        <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                          {selectedSubmission.html_code && (
                            <details className="cursor-pointer">
                              <summary className="font-medium text-orange-600">HTML Code</summary>
                              <pre className="mt-2 text-sm bg-white p-2 rounded border overflow-x-auto">
                                <code>{selectedSubmission.html_code}</code>
                              </pre>
                            </details>
                          )}
                          {selectedSubmission.css_code && (
                            <details className="cursor-pointer">
                              <summary className="font-medium text-blue-600">CSS Code</summary>
                              <pre className="mt-2 text-sm bg-white p-2 rounded border overflow-x-auto">
                                <code>{selectedSubmission.css_code}</code>
                              </pre>
                            </details>
                          )}
                          {selectedSubmission.javascript_code && (
                            <details className="cursor-pointer">
                              <summary className="font-medium text-yellow-600">JavaScript Code</summary>
                              <pre className="mt-2 text-sm bg-white p-2 rounded border overflow-x-auto">
                                <code>{selectedSubmission.javascript_code}</code>
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Live Preview:</h4>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                            <span className="text-gray-600 text-sm">🌐 Student's Work</span>
                          </div>
                          <div className="h-64 overflow-auto">
                            <iframe
                              srcDoc={generatePreview(selectedSubmission)}
                              className="w-full h-full border-none"
                              title="Student Preview"
                              sandbox="allow-scripts"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Select a submission</h3>
                  <p className="text-gray-500">Choose a submission from the list to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 