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

// GET - Fetch all submissions
export async function GET(request: NextRequest) {
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
      ORDER BY s.submitted_at DESC
    `);
    
    await connection.end();

    return NextResponse.json({
      success: true,
      submissions: rows
    });

  } catch (error) {
    console.error('Database error:', error);
    
    // Return mock data if database is not available
    return NextResponse.json({
      success: true,
      submissions: mockStore.getAllSubmissions()
    });
  }
}

// POST - Create new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_name, lesson_id, html_code, css_code, javascript_code, preview_screenshot } = body;

    // Validation
    if (!student_name || !lesson_id) {
      return NextResponse.json(
        { success: false, message: 'Student name and lesson ID are required' },
        { status: 400 }
      );
    }

    try {
      const connection = await createConnection();

      // Insert new submission
      const [result] = await connection.execute(
        `INSERT INTO submissions (student_name, lesson_id, html_code, css_code, javascript_code, preview_screenshot, submitted_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [student_name, lesson_id, html_code || '', css_code || '', javascript_code || '', preview_screenshot || '']
      );

      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Submission created successfully',
        submission_id: (result as any).insertId
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Add to mock store if database is not available
      const lessonInfo = mockStore.getLessonInfo(lesson_id);
      
      const newSubmissionId = mockStore.addSubmission({
        student_name,
        lesson_id,
        lesson_title: lessonInfo.title,
        lesson_type: lessonInfo.type,
        difficulty_name: lessonInfo.difficulty,
        html_code: html_code || '',
        css_code: css_code || '',
        javascript_code: javascript_code || '',
        preview_screenshot: preview_screenshot || '',
        submitted_at: new Date().toISOString(),
        grade: null,
        feedback: null,
        reviewed_by: null,
        reviewed_at: null
      });
      
      console.log(`Mock submission created for ${student_name} on lesson ${lesson_id} with ID ${newSubmissionId}`);
      
      return NextResponse.json({
        success: true,
        message: 'Submission created successfully (demo mode)',
        submission_id: newSubmissionId
      });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create submission' },
      { status: 500 }
    );
  }
} 