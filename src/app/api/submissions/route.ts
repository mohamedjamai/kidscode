import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

// GET - Fetch all submissions
export async function GET(request: NextRequest) {
  try {
    // Use only mock store - no database
    const mockSubmissions = mockStore.getAllSubmissions();
    
    return NextResponse.json({
      success: true,
      submissions: mockSubmissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({
      success: false,
      submissions: []
    }, { status: 500 });
  }
}

// POST - Create new submission
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Add submission to mock store
    const submissionId = mockStore.addSubmission({
      student_name: data.student_name,
      lesson_id: data.lesson_id,
      lesson_title: data.lesson_title,
      lesson_type: data.lesson_type,
      difficulty_name: data.difficulty_name,
      html_code: data.html_code || '',
      css_code: data.css_code || '',
      javascript_code: data.javascript_code || '',
      submitted_at: new Date().toISOString(),
      grade: null,
      feedback: null,
      reviewed_by: null,
      reviewed_at: null
    });

    console.log(`📤 New submission added: ID ${submissionId} from ${data.student_name}`);

    return NextResponse.json({
      success: true,
      submission_id: submissionId,
      message: 'Code submitted successfully!'
    });

  } catch (error) {
    console.error('Error submitting code:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit code' 
    }, { status: 500 });
  }
}

// DELETE - Clear all submissions
export async function DELETE(request: NextRequest) {
  try {
    const cleared = mockStore.clearAllSubmissions();
    
    if (cleared) {
      return NextResponse.json({
        success: true,
        message: 'All submissions cleared successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to clear submissions'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error clearing submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear submissions' },
      { status: 500 }
    );
  }
} 