import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock student data - in real app, this would fetch from database
    const mockStudents = [
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
        progress: { completed: 4, total: 8, percentage: 50 },
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
        progress: { completed: 6, total: 8, percentage: 75 },
        currentLevel: 'Intermediate',
        lastActive: '2024-12-21T11:45:00Z',
        averageGrade: 8.2
      },
      // Add more mock students as needed
    ];

    return NextResponse.json({
      success: true,
      students: mockStudents
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch students' 
    }, { status: 500 });
  }
} 