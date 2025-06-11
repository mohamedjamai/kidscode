import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { mockStore } from '@/lib/mockStore';

// Create database connection
async function createConnection() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'kidscode',
  });
  return connection;
}

// GET - Fetch submissions for a specific student
export async function GET(request: NextRequest) {
  console.log('📥 GET student submissions API called');
  
  const { searchParams } = new URL(request.url);
  const studentName = searchParams.get('student_name');
  
  if (!studentName) {
    return NextResponse.json(
      { success: false, message: 'Student name is required' },
      { status: 400 }
    );
  }

  console.log(`📊 Fetching submissions for student: ${studentName}`);

  try {
    const connection = await createConnection();
    
    const [rows] = await connection.execute(`
      SELECT 
        s.*,
        l.title as lesson_title,
        l.lesson_type,
        l.difficulty_name
      FROM submissions s
      LEFT JOIN lessons l ON s.lesson_id = l.id
      WHERE s.student_name = ?
      ORDER BY s.submitted_at DESC
    `, [studentName]);
    
    await connection.end();
    
    console.log(`✅ Found ${(rows as any[]).length} submissions for ${studentName}`);

    return NextResponse.json({
      success: true,
      submissions: rows
    });

  } catch (error) {
    console.error('❌ Database error, falling back to mock store:', error);
    
    // Get student submissions from mock store
    const allSubmissions = mockStore.getAllSubmissions();
    const studentSubmissions = allSubmissions.filter(
      submission => submission.student_name === studentName
    );
    
    console.log(`📦 Mock store returned ${studentSubmissions.length} submissions for ${studentName}`);
    
    return NextResponse.json({
      success: true,
      submissions: studentSubmissions,
      source: 'mock'
    });
  }
} 