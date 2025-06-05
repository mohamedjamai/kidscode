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

// PUT - Update submission with grade and feedback
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { grade, feedback, reviewed_by } = body;

    try {
      const connection = await createConnection();

      // Update submission with review data
      await connection.execute(
        `UPDATE submissions 
         SET grade = ?, feedback = ?, reviewed_by = ?, reviewed_at = NOW()
         WHERE id = ?`,
        [grade, feedback, reviewed_by, id]
      );

      await connection.end();

      return NextResponse.json({
        success: true,
        message: 'Submission reviewed successfully'
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Update mock store if database is not available
      const success = mockStore.updateSubmission(parseInt(id), {
        grade: grade ? parseInt(grade) : null,
        feedback: feedback || null,
        reviewed_by: reviewed_by || null,
        reviewed_at: new Date().toISOString()
      });
      
      if (success) {
        console.log(`Mock review saved for submission ${id}: Grade ${grade}, Feedback: ${feedback}`);
        return NextResponse.json({
          success: true,
          message: 'Submission reviewed successfully (demo mode)'
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// GET - Get single submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
        WHERE s.id = ?
      `, [id]);
      
      await connection.end();

      if ((rows as any[]).length === 0) {
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        submission: (rows as any[])[0]
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Try to get from mock store
      const submission = mockStore.getSubmissionById(parseInt(id));
      if (submission) {
        return NextResponse.json({
          success: true,
          submission: submission
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
} 