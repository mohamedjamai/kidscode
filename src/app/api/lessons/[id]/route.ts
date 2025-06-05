import { NextResponse } from 'next/server';
import { getOne, executeQuery } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (!lessonId || isNaN(lessonId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid lesson ID'
      }, { status: 400 });
    }

    // Get lesson with difficulty level info
    const lesson = await getOne(`
      SELECT 
        l.id, 
        l.title, 
        l.description, 
        l.content,
        l.lesson_type, 
        l.order_number,
        l.is_published,
        dl.name as difficulty_name,
        dl.level as difficulty_level,
        dl.description as difficulty_description
      FROM lessons l
      LEFT JOIN difficulty_levels dl ON l.difficulty_level_id = dl.id
      WHERE l.id = ? AND l.is_published = 1
    `, [lessonId]);
    
    if (!lesson) {
      return NextResponse.json({
        success: false,
        message: 'Lesson not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      lesson: lesson
    });
    
  } catch (error) {
    console.error('Error fetching lesson:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch lesson!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (!lessonId || isNaN(lessonId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid lesson ID'
      }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, content, lesson_type, difficulty_level } = body;

    // Validate required fields
    if (!title || !description || !content || !lesson_type || !difficulty_level) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if lesson exists
    const existingLesson = await getOne(`
      SELECT id FROM lessons WHERE id = ?
    `, [lessonId]);

    if (!existingLesson) {
      return NextResponse.json({
        success: false,
        message: 'Lesson not found'
      }, { status: 404 });
    }

    // Update the lesson
    await executeQuery(`
      UPDATE lessons 
      SET title = ?, description = ?, content = ?, lesson_type = ?, difficulty_level_id = ?
      WHERE id = ?
    `, [title, description, content, lesson_type, difficulty_level, lessonId]);

    return NextResponse.json({
      success: true,
      message: 'Lesson updated successfully'
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to update lesson!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (!lessonId || isNaN(lessonId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid lesson ID'
      }, { status: 400 });
    }

    // Check if lesson exists
    const existingLesson = await getOne(`
      SELECT id FROM lessons WHERE id = ?
    `, [lessonId]);

    if (!existingLesson) {
      return NextResponse.json({
        success: false,
        message: 'Lesson not found'
      }, { status: 404 });
    }

    // Delete the lesson
    await executeQuery(`
      DELETE FROM lessons WHERE id = ?
    `, [lessonId]);

    return NextResponse.json({
      success: true,
      message: 'Lesson deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting lesson:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete lesson!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 