import { NextResponse } from 'next/server';
import { getOne } from '@/lib/prisma';

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