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
  console.log('📝 PUT submission review API called');
  
  try {
    const { id } = await params;
    const body = await request.json();
    const { grade, feedback, reviewed_by } = body;

    console.log(`📊 Reviewing submission ${id}: Grade=${grade}, Feedback="${feedback}", Reviewer="${reviewed_by}"`);

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      console.error('❌ Invalid submission ID:', id);
      return NextResponse.json(
        { success: false, message: 'Invalid submission ID' },
        { status: 400 }
      );
    }

    try {
      const connection = await createConnection();

      // First check if submission exists
      const [existingRows] = await connection.execute(
        'SELECT id FROM submissions WHERE id = ?',
        [id]
      );

      if ((existingRows as any[]).length === 0) {
        console.log(`❌ Submission ${id} not found in database`);
        await connection.end();
        
        // Try updating mock store instead
        const success = mockStore.updateSubmission(parseInt(id), {
          grade: grade ? parseInt(grade) : null,
          feedback: feedback || null,
          reviewed_by: reviewed_by || null,
          reviewed_at: new Date().toISOString()
        });
        
        if (success) {
          console.log(`✅ Mock store updated for submission ${id}`);
          return NextResponse.json({
            success: true,
            message: 'Submission reviewed successfully (demo mode)'
          });
        } else {
          console.error(`❌ Submission ${id} not found in mock store either`);
          return NextResponse.json(
            { success: false, message: 'Submission not found' },
            { status: 404 }
          );
        }
      }

      // Update submission with review data
      const [updateResult] = await connection.execute(
        `UPDATE submissions 
         SET grade = ?, feedback = ?, reviewed_by = ?, reviewed_at = NOW()
         WHERE id = ?`,
        [grade, feedback, reviewed_by, id]
      );

      await connection.end();
      
      console.log(`✅ Database updated for submission ${id}`);

      return NextResponse.json({
        success: true,
        message: 'Submission reviewed successfully'
      });

    } catch (dbError) {
      console.error('❌ Database error, using mock store:', dbError);
      
      // Update mock store if database is not available
      const success = mockStore.updateSubmission(parseInt(id), {
        grade: grade ? parseInt(grade) : null,
        feedback: feedback || null,
        reviewed_by: reviewed_by || null,
        reviewed_at: new Date().toISOString()
      });
      
      if (success) {
        console.log(`✅ Mock store updated for submission ${id}: Grade ${grade}, Feedback: ${feedback}`);
        return NextResponse.json({
          success: true,
          message: 'Submission reviewed successfully (demo mode)'
        });
      } else {
        console.error(`❌ Submission ${id} not found in mock store`);
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('❌ API error:', error);
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
  console.log('📥 GET single submission API called');
  
  try {
    const { id } = await params;
    console.log(`📊 Fetching submission ${id}`);
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      console.error('❌ Invalid submission ID:', id);
      return NextResponse.json(
        { success: false, message: 'Invalid submission ID' },
        { status: 400 }
      );
    }
    
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
        console.log(`❌ Submission ${id} not found in database, trying mock store`);
        
        // Try to get from mock store
        const submission = mockStore.getSubmissionById(parseInt(id));
        if (submission) {
          console.log(`✅ Found submission ${id} in mock store`);
          return NextResponse.json({
            success: true,
            submission: submission
          });
        } else {
          console.error(`❌ Submission ${id} not found anywhere`);
          return NextResponse.json(
            { success: false, message: 'Submission not found' },
            { status: 404 }
          );
        }
      }

      console.log(`✅ Found submission ${id} in database`);
      return NextResponse.json({
        success: true,
        submission: (rows as any[])[0]
      });
      
    } catch (dbError) {
      console.error('❌ Database error, using mock store:', dbError);
      
      // Try to get from mock store
      const submission = mockStore.getSubmissionById(parseInt(id));
      if (submission) {
        console.log(`✅ Found submission ${id} in mock store`);
        return NextResponse.json({
          success: true,
          submission: submission
        });
      } else {
        console.error(`❌ Submission ${id} not found in mock store`);
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
} 