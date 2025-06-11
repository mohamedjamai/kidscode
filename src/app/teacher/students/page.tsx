'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Student {
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
  lastActive?: string;
  averageGrade?: number;
}

interface ClassFilter {
  id: string;
  name: string;
  count: number;
}

export default function StudentsPage() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'grade' | 'lastActive'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  useEffect(() => {
    filterAndSortStudents();
  }, [students, selectedClass, searchTerm, sortBy, sortOrder]);

  const fetchStudents = async () => {
    try {
      // Fetch lessons to get total count
      const lessonsResponse = await fetch('/api/lessons');
      const lessonsData = await lessonsResponse.json();
      const totalLessons = lessonsData.success ? lessonsData.lessons.length : 8; // fallback to 8

      // Mock data for now - in real app, this would fetch from API
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Emma van der Berg',
          email: 'emma.vandenberg@school.nl',
          student_number: '2024001',
          class_id: 'KLAS-A',
          school_id: 'SCHOOL-001',
          profile_picture: '/images/avatars/student-1.jpg',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
          progress: { completed: 4, total: totalLessons, percentage: Math.round((4 / totalLessons) * 100) },
          currentLevel: 'Beginner',
          lastActive: '2024-12-20T14:30:00Z',
          averageGrade: 7.8
        },
        {
          id: '2',
          name: 'Lucas Janssen',
          email: 'lucas.janssen@school.nl',
          student_number: '2024002',
          class_id: 'KLAS-A',
          school_id: 'SCHOOL-001',
          profile_picture: '/images/avatars/student-2.jpg',
          is_active: true,
          created_at: '2024-01-20T09:15:00Z',
          progress: { completed: 6, total: totalLessons, percentage: Math.round((6 / totalLessons) * 100) },
          currentLevel: 'Intermediate',
          lastActive: '2024-12-21T11:45:00Z',
          averageGrade: 8.2
        },
        {
          id: '3',
          name: 'Sophie de Wit',
          email: 'sophie.dewit@school.nl',
          student_number: '2024003',
          class_id: 'KLAS-B',
          school_id: 'SCHOOL-001',
          profile_picture: '/images/avatars/student-3.jpg',
          is_active: true,
          created_at: '2024-02-01T13:20:00Z',
          progress: { completed: 2, total: totalLessons, percentage: Math.round((2 / totalLessons) * 100) },
          currentLevel: 'Beginner',
          lastActive: '2024-12-19T16:20:00Z',
          averageGrade: 6.5
        },
        {
          id: '4',
          name: 'Daan Bakker',
          email: 'daan.bakker@school.nl',
          student_number: '2024004',
          class_id: 'KLAS-B',
          school_id: 'SCHOOL-001',
          profile_picture: '/images/avatars/student-4.jpg',
          is_active: false,
          created_at: '2024-01-25T11:10:00Z',
          progress: { completed: 1, total: totalLessons, percentage: Math.round((1 / totalLessons) * 100) },
          currentLevel: 'Beginner',
          lastActive: '2024-12-10T09:30:00Z',
          averageGrade: 5.8
        },
        {
          id: '5',
          name: 'Zara Ahmed',
          email: 'zara.ahmed@school.nl',
          student_number: '2024005',
          class_id: 'KLAS-C',
          school_id: 'SCHOOL-001',
          profile_picture: '/images/avatars/student-5.jpg',
          is_active: true,
          created_at: '2024-02-10T15:45:00Z',
          progress: { completed: 7, total: totalLessons, percentage: Math.round((7 / totalLessons) * 100) },
          currentLevel: 'Advanced',
          lastActive: '2024-12-21T17:10:00Z',
          averageGrade: 9.1
        }
      ];
      setStudents(mockStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      // Mock data for classes with student counts
      const mockClasses: ClassFilter[] = [
        { id: 'KLAS-A', name: 'Klas A - Beginners', count: 2 },
        { id: 'KLAS-B', name: 'Klas B - Intermediate', count: 2 },
        { id: 'KLAS-C', name: 'Klas C - Advanced', count: 1 },
      ];
      setClasses(mockClasses);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = students;

    // Filter by class
    if (selectedClass !== 'all') {
      filtered = filtered.filter(student => student.class_id === selectedClass);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number.includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'progress':
          aValue = a.progress.percentage;
          bValue = b.progress.percentage;
          break;
        case 'grade':
          aValue = a.averageGrade || 0;
          bValue = b.averageGrade || 0;
          break;
        case 'lastActive':
          aValue = new Date(a.lastActive || 0);
          bValue = new Date(b.lastActive || 0);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 8) return 'text-green-600';
    if (grade >= 6.5) return 'text-blue-600';
    if (grade >= 5.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatLastActive = (lastActive: string) => {
    const now = new Date();
    const last = new Date(lastActive);
    const diffInHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Vandaag';
    } else if (diffInHours < 48) {
      return 'Gisteren';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} dagen geleden`;
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Studenten Overzicht</h1>
        <p className="text-gray-600">Beheer en monitor je studenten en hun voortgang</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Totaal Studenten</h3>
          <p className="text-3xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Actieve Studenten</h3>
          <p className="text-3xl font-bold text-green-600">
            {students.filter(s => s.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Gem. Voortgang</h3>
          <p className="text-3xl font-bold text-purple-600">
            {Math.round(students.reduce((acc, s) => acc + s.progress.percentage, 0) / students.length)}%
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Gem. Cijfer</h3>
          <p className="text-3xl font-bold text-orange-600">
            {(students.reduce((acc, s) => acc + (s.averageGrade || 0), 0) / students.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoeken
            </label>
            <input
              type="text"
              placeholder="Naam, email of studentnummer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Klas Filter
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle klassen ({students.length})</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sorteer op
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Naam</option>
              <option value="progress">Voortgang</option>
              <option value="grade">Gemiddeld Cijfer</option>
              <option value="lastActive">Laatst Actief</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volgorde
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Oplopend</option>
              <option value="desc">Aflopend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Studenten ({filteredStudents.length})
          </h2>
          
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-500">Geen studenten gevonden met de huidige filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Klas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Voortgang</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Gem. Cijfer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Laatst Actief</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                            <img
                              src={student.profile_picture || '/images/avatars/default-student.jpg'}
                              alt={`${student.name}'s profile`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            <div className="text-xs text-gray-400">#{student.student_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {student.class_id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(student.is_active)}`}>
                          {student.is_active ? 'Actief' : 'Inactief'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[60px]">
                            <div
                              className={`h-full transition-all duration-300 ${getProgressColor(student.progress.percentage)}`}
                              style={{ width: `${student.progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 min-w-[40px]">
                            {student.progress.percentage.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${getGradeColor(student.averageGrade || 0)}`}>
                          {student.averageGrade ? student.averageGrade.toFixed(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {student.lastActive ? formatLastActive(student.lastActive) : 'Nooit'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/teacher/students/${student.id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}