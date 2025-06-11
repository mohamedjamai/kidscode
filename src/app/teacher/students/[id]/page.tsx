'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface StudentDetails {
  id: string;
  name: string;
  email: string;
  student_number: string;
  class_id: string;
  school_id: string;
  profile_picture?: string;
  is_active: boolean;
  created_at: string;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  currentLevel: string;
}

interface StudentSubmission {
  id: number;
  student_name: string;
  lesson_id: number;
  lesson_title: string;
  lesson_type: string;
  difficulty_name: string;
  html_code: string;
  css_code: string;
  javascript_code: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

interface ClassOption {
  id: string;
  name: string;
  teacher_id: string;
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [transfering, setTransfering] = useState(false);

  useEffect(() => {
    fetchStudentDetails();
    fetchStudentSubmissions();
    fetchClasses();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      // Fetch lessons to get total count
      const lessonsResponse = await fetch('/api/lessons');
      const lessonsData = await lessonsResponse.json();
      const totalLessons = lessonsData.success ? lessonsData.lessons.length : 8; // fallback to 8

      // Fetch student submissions to calculate real progress
      const submissionsResponse = await fetch('/api/submissions/student?student_name=Test Student');
      const submissionsData = await submissionsResponse.json();
      const studentSubmissions = submissionsData.success ? submissionsData.submissions.length : 0;

      // Calculate real progress
      const progressPercentage = totalLessons > 0 ? Math.round((studentSubmissions / totalLessons) * 100) : 0;

      // Mock data for now - in real app, this would fetch from API
      const mockStudent: StudentDetails = {
        id: studentId,
        name: 'Test Student',
        email: 'test.student@kidscode.com',
        student_number: '2024001',
        class_id: 'KLAS-A',
        school_id: 'SCHOOL-001',
        profile_picture: '/images/avatars/student-1.jpg',
        is_active: true,
        created_at: '2024-01-15T10:00:00Z',
        progress: { 
          completed: studentSubmissions, 
          total: totalLessons, 
          percentage: progressPercentage 
        },
        currentLevel: 'Beginner'
      };
      setStudent(mockStudent);
    } catch (err) {
      setError('Failed to load student details');
    }
  };

  const fetchStudentSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions/student?student_name=${encodeURIComponent('Test Student')}`);
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      // Mock data for classes
      const mockClasses: ClassOption[] = [
        { id: 'KLAS-A', name: 'Klas A - Beginners', teacher_id: 'teacher1' },
        { id: 'KLAS-B', name: 'Klas B - Intermediate', teacher_id: 'teacher1' },
        { id: 'KLAS-C', name: 'Klas C - Advanced', teacher_id: 'teacher2' },
      ];
      setClasses(mockClasses);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferStudent = async () => {
    if (!selectedClass || !student) return;
    
    setTransfering(true);
    try {
      // Mock API call - in real app, this would update the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setStudent({
        ...student,
        class_id: selectedClass
      });
      
      setShowTransferModal(false);
      setSelectedClass('');
      
      // Show success message
      alert(`${student.name} is succesvol verplaatst naar ${classes.find(c => c.id === selectedClass)?.name}`);
    } catch (err) {
      alert('Er is een fout opgetreden bij het verplaatsen van de student');
    } finally {
      setTransfering(false);
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'bg-gray-100 text-gray-600';
    if (grade >= 7) return 'bg-green-100 text-green-800';
    if (grade >= 5.5) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Student not found'}</p>
          <Link
            href="/teacher/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Terug naar Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/teacher/dashboard"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>←</span>
              <span>Terug naar Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={student.profile_picture || '/images/avatars/default-student.jpg'}
                alt={`${student.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600">{student.email}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  <strong>Studentnummer:</strong> {student.student_number}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Klas:</strong> {student.class_id}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>School ID:</strong> {student.school_id}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Ingeschreven:</strong> {new Date(student.created_at).toLocaleDateString('nl-NL')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {student.is_active ? 'Actief' : 'Inactief'}
            </span>
            <button
              onClick={() => setShowTransferModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <span>📋</span>
              <span>Verplaats Klas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Voortgang</h3>
          <div className="flex items-center mb-3">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden mr-3">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${student.progress.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {student.progress.percentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {student.progress.completed} van {student.progress.total} lessen voltooid
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Niveau</h3>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {student.currentLevel}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Inleveringen</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Totaal:</strong> {submissions.length}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Beoordeeld:</strong> {submissions.filter(s => s.grade !== null).length}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Gem. Cijfer:</strong> {
                submissions.filter(s => s.grade !== null).length > 0
                  ? (submissions.filter(s => s.grade !== null).reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.filter(s => s.grade !== null).length).toFixed(1)
                  : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Inleveringen van {student.name}</h2>
        
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-500">Nog geen inleveringen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div 
                key={submission.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{submission.lesson_title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ingeleverd: {new Date(submission.submitted_at).toLocaleDateString('nl-NL')} om {new Date(submission.submitted_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center mt-2 space-x-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {submission.lesson_type.toUpperCase()}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {submission.difficulty_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {submission.grade !== null ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(submission.grade)}`}>
                        {submission.grade}/10
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Wacht op beoordeling
                      </span>
                    )}
                    <span className="text-blue-500">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Student Verplaatsen
            </h3>
            <p className="text-gray-600 mb-4">
              Verplaats <strong>{student.name}</strong> naar een andere klas:
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecteer nieuwe klas:
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kies een klas...</option>
                {classes
                  .filter(cls => cls.id !== student.class_id)
                  .map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedClass('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={transfering}
              >
                Annuleren
              </button>
              <button
                onClick={handleTransferStudent}
                disabled={!selectedClass || transfering}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {transfering && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                )}
                <span>{transfering ? 'Verplaatsen...' : 'Verplaatsen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Inlevering: {selectedSubmission.lesson_title}
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  Ingeleverd: {new Date(selectedSubmission.submitted_at).toLocaleDateString('nl-NL')}
                </span>
                {selectedSubmission.grade !== null && (
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedSubmission.grade)}`}>
                    Cijfer: {selectedSubmission.grade}/10
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">HTML Code:</h3>
                    <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>{selectedSubmission.html_code || 'Geen HTML code'}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">CSS Code:</h3>
                    <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>{selectedSubmission.css_code || 'Geen CSS code'}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">JavaScript Code:</h3>
                    <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>{selectedSubmission.javascript_code || 'Geen JavaScript code'}</code>
                    </pre>
                  </div>
                </div>

                {/* Preview Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preview:</h3>
                  <div className="border border-gray-300 rounded-lg h-96 bg-white">
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <style>${selectedSubmission.css_code || ''}</style>
                          </head>
                          <body>
                            ${selectedSubmission.html_code || ''}
                            <script>${selectedSubmission.javascript_code || ''}</script>
                          </body>
                        </html>
                      `}
                      className="w-full h-full rounded-lg"
                      title="Student Code Preview"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              {selectedSubmission.feedback && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Feedback:</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800">{selectedSubmission.feedback}</p>
                    {selectedSubmission.reviewed_by && (
                      <p className="text-sm text-blue-600 mt-2">
                        - {selectedSubmission.reviewed_by}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 