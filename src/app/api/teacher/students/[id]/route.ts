import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch lessons to get total count
    const lessonsResponse = await fetch('http://localhost:3000/api/lessons');
    const lessonsData = await lessonsResponse.json();
    const totalLessons = lessonsData.success ? lessonsData.lessons.length : 8; // fallback to 8

    // Fetch student submissions to calculate real progress
    const submissionsResponse = await fetch('http://localhost:3000/api/submissions/student?student_name=Test Student');
    const submissionsData = await submissionsResponse.json();
    const studentSubmissions = submissionsData.success ? submissionsData.submissions.length : 0;

    // Calculate real progress
    const progressPercentage = totalLessons > 0 ? Math.round((studentSubmissions / totalLessons) * 100) : 0;
    
    // Mock student data - in real app, this would fetch from database
    const mockStudent = {
      id: id,
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
      currentLevel: 'Beginner',
      lastActive: '2024-12-20T14:30:00Z',
      averageGrade: 7.5
    };

    return NextResponse.json({
      success: true,
      student: mockStudent
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch student' 
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log(`📝 Updating student ${id}:`, body);
    
    // Mock update - in real app, this would update the database
    if (body.class_id) {
      console.log(`🔄 Transferring student ${id} to class ${body.class_id}`);
    }
    
    if (body.is_active !== undefined) {
      console.log(`👤 Setting student ${id} active status to ${body.is_active}`);
    }

    // Return updated student data
    const updatedStudent = {
      id: id,
      name: 'Test Student',
      email: 'test.student@kidscode.com',
      student_number: '2024001',
      class_id: body.class_id || 'KLAS-A',
      school_id: 'SCHOOL-001',
      profile_picture: '/images/avatars/student-1.jpg',
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: '2024-01-15T10:00:00Z',
      progress: { completed: 3, total: 8, percentage: 37.5 },
      currentLevel: 'Beginner',
      lastActive: '2024-12-20T14:30:00Z',
      averageGrade: 7.5
    };

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update student' 
    }, { status: 500 });
  }
} 