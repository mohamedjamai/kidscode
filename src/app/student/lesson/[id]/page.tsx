'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  lesson_type: string;
  order_number: number;
  difficulty_name: string;
  difficulty_level: number;
  difficulty_description: string;
}

export default function LessonPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Code editor states
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [javascriptCode, setJavascriptCode] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [showInstructions, setShowInstructions] = useState(true);

  // Submission states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Debug session loading
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  useEffect(() => {
    if (params?.id) {
      fetchLesson(params.id as string);
    }
  }, [params]);

  const fetchLesson = async (id: string) => {
    try {
      const response = await fetch(`/api/lessons/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setLesson(data.lesson);
        // Set initial code based on lesson type
        initializeCode(data.lesson);
      } else {
        setError(data.message || 'Lesson not found');
      }
    } catch (err) {
      setError('Failed to load lesson');
      console.error('Error fetching lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const initializeCode = (lesson: Lesson) => {
    const lessonType = lesson.lesson_type.toLowerCase();
    
    if (lessonType === 'html') {
      setHtmlCode(`<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to coding! Try changing this text.</p>
</body>
</html>`);
      setActiveTab('html');
    } else if (lessonType === 'css') {
      setHtmlCode(`<!DOCTYPE html>
<html>
<head>
    <title>Styling Fun</title>
    <style>
        /* Write your CSS here */
    </style>
</head>
<body>
    <h1>Style Me!</h1>
    <p>Make me colorful and beautiful!</p>
</body>
</html>`);
      setCssCode(`h1 {
    color: blue;
    text-align: center;
}

p {
    color: green;
    font-size: 18px;
}`);
      setActiveTab('css');
    } else if (lessonType === 'javascript') {
      setHtmlCode(`<!DOCTYPE html>
<html>
<head>
    <title>Interactive Fun</title>
</head>
<body>
    <h1>Click the button!</h1>
    <button onclick="sayHello()">Click Me!</button>
    <p id="message"></p>
    
    <script>
        // Write your JavaScript here
    </script>
</body>
</html>`);
      setJavascriptCode(`function sayHello() {
    document.getElementById('message').innerHTML = 'Hello from JavaScript!';
    alert('You clicked the button!');
}`);
      setActiveTab('javascript');
    }
  };

  const generatePreview = () => {
    let finalHtml = htmlCode;
    
    if (cssCode && lesson?.lesson_type.toLowerCase() === 'css') {
      finalHtml = htmlCode.replace('/* Write your CSS here */', cssCode);
    }
    
    if (javascriptCode && lesson?.lesson_type.toLowerCase() === 'javascript') {
      finalHtml = htmlCode.replace('// Write your JavaScript here', javascriptCode);
    }
    
    return finalHtml;
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'html': return 'bg-orange-500';
      case 'css': return 'bg-blue-500';
      case 'javascript': return 'bg-yellow-500';
      case 'python': return 'bg-green-500';
      case 'blocks': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'javascript': return javascriptCode;
      default: return htmlCode;
    }
  };

  const updateCurrentCode = (code: string) => {
    switch (activeTab) {
      case 'html': setHtmlCode(code); break;
      case 'css': setCssCode(code); break;
      case 'javascript': setJavascriptCode(code); break;
    }
  };

  const handleSubmit = async () => {
    // Get student name from session
    const studentName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Unknown Student';

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_name: studentName,
          lesson_id: lesson?.id,
          html_code: htmlCode,
          css_code: cssCode,
          javascript_code: javascriptCode,
          preview_screenshot: generatePreview() // Send the HTML preview
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setSubmitMessage('Great work! Your lesson has been submitted successfully! 🎉');
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowSubmitModal(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setSubmitMessage(data.message || 'Failed to submit lesson');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interactive lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-4xl">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/student/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/student/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <div className="hidden md:block">
                <span className="text-gray-500">Lesson #{lesson.order_number}</span>
                <h1 className="text-lg font-bold text-gray-900">{lesson.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {showInstructions ? 'Hide' : 'Show'} Instructions
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <span>📤</span>
                <span>Submit Work</span>
              </button>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                {lesson.difficulty_name}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getLessonTypeColor(lesson.lesson_type)}`}>
                {lesson.lesson_type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Instructions Panel */}
        {showInstructions && (
          <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <div className={`${getLessonTypeColor(lesson.lesson_type)} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl font-bold">
                    {lesson.lesson_type.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">📚 What you'll learn:</h3>
                <p className="text-blue-800 text-sm">{lesson.content}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2">🎯 Instructions:</h3>
                <div className="text-green-800 text-sm space-y-2">
                  {lesson.lesson_type.toLowerCase() === 'html' && (
                    <>
                      <p>• Try changing the text inside the &lt;h1&gt; and &lt;p&gt; tags</p>
                      <p>• Add new HTML elements like &lt;h2&gt;, &lt;strong&gt;, or &lt;em&gt;</p>
                      <p>• Create a list using &lt;ul&gt; and &lt;li&gt; tags</p>
                    </>
                  )}
                  {lesson.lesson_type.toLowerCase() === 'css' && (
                    <>
                      <p>• Change the colors of the h1 and p elements</p>
                      <p>• Try adding background-color, font-family, or margin</p>
                      <p>• Experiment with different CSS properties</p>
                    </>
                  )}
                  {lesson.lesson_type.toLowerCase() === 'javascript' && (
                    <>
                      <p>• Modify the message that appears when you click the button</p>
                      <p>• Try changing the text or adding more interactive elements</p>
                      <p>• Experiment with different JavaScript functions</p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">💡 Tip:</h3>
                <p className="text-yellow-800 text-sm">
                  Don't worry about making mistakes! Coding is all about experimenting and learning. 
                  You can always reset the code if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Code Editor and Preview */}
        <div className={`${showInstructions ? 'w-2/3' : 'w-full'} flex flex-col`}>
          {/* Code Editor */}
          <div className="h-1/2 bg-gray-900 flex flex-col">
            {/* Tabs */}
            <div className="flex bg-gray-800 border-b border-gray-700">
              {lesson.lesson_type.toLowerCase() === 'html' && (
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'html' 
                      ? 'bg-gray-900 text-white border-t-2 border-orange-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  📄 HTML
                </button>
              )}
              {(lesson.lesson_type.toLowerCase() === 'css' || lesson.lesson_type.toLowerCase() === 'html') && (
                <button
                  onClick={() => setActiveTab('css')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'css' 
                      ? 'bg-gray-900 text-white border-t-2 border-blue-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🎨 CSS
                </button>
              )}
              {(lesson.lesson_type.toLowerCase() === 'javascript' || lesson.lesson_type.toLowerCase() === 'html') && (
                <button
                  onClick={() => setActiveTab('javascript')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'javascript' 
                      ? 'bg-gray-900 text-white border-t-2 border-yellow-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  ⚡ JavaScript
                </button>
              )}
              <div className="flex-1"></div>
              <div className="px-4 py-3 text-gray-400 text-sm">
                💻 Code Editor
              </div>
            </div>

            {/* Code Textarea */}
            <div className="flex-1">
              <textarea
                value={getCurrentCode()}
                onChange={(e) => updateCurrentCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-white p-4 font-mono text-sm resize-none outline-none"
                placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="h-1/2 bg-white flex flex-col">
            <div className="flex bg-gray-100 border-b border-gray-200 px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-gray-600 text-sm">🌐 Live Preview</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe
                srcDoc={generatePreview()}
                className="w-full h-full border-none"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Work!</h2>
              <p className="text-gray-600">Show your teacher what amazing code you've created!</p>
            </div>
            
            {status === 'loading' ? (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800">Loading your session...</p>
                </div>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : session ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👨‍🎓</div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        {session.user?.name || session.user?.email?.split('@')[0] || 'Student'}
                      </p>
                      <p className="text-sm text-blue-600">Ready to submit your work!</p>
                      <p className="text-xs text-blue-500">Session: {session.user?.email}</p>
                    </div>
                  </div>
                </div>

                {submitMessage && (
                  <div className={`p-4 rounded-lg ${submitSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {submitMessage}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || submitSuccess}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : submitSuccess ? (
                      <>
                        <span>✅</span>
                        <span>Submitted!</span>
                      </>
                    ) : (
                      <>
                        <span>📤</span>
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                  
                  {!submitSuccess && (
                    <button
                      onClick={() => {
                        setShowSubmitModal(false);
                        setSubmitMessage('');
                      }}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800">Please log in to submit your work</p>
                  <p className="text-xs text-yellow-600 mt-2">Session status: {status}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Go to Login
                  </button>
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 