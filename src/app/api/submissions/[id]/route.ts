import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/mockStore';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { grade, feedback, reviewed_by } = await request.json();
    const { id } = await params;
    const submissionId = parseInt(id);

    // Find the submission using mockStore method
    const submission = mockStore.getSubmissionById(submissionId);
    
    if (!submission) {
      return NextResponse.json({ 
        success: false, 
        error: 'Submission not found' 
      }, { status: 404 });
    }

    // Update the submission with review using mockStore method
    const updated = mockStore.updateSubmission(submissionId, {
      grade: grade,
      feedback: feedback,
      reviewed_by: reviewed_by,
      reviewed_at: new Date().toISOString()
    });

    if (!updated) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update submission' 
      }, { status: 500 });
    }

    console.log(`✅ Review submitted for submission ${submissionId}: Grade ${grade}/10`);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully!',
      submission: mockStore.getSubmissionById(submissionId)
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit review' 
    }, { status: 500 });
  }
}