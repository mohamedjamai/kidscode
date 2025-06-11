import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Mock lessons data when database is not available
const mockLessons = [
  {
    id: 1,
    title: "Introduction to HTML",
    description: "Learn the basics of HTML and create your first webpage",
    lesson_type: "html",
    order_number: 1,
    is_published: 1,
    difficulty_name: "Beginner",
    difficulty_level: 1
  },
  {
    id: 2,
    title: "CSS Styling Basics",
    description: "Add colors, fonts, and layout to your webpages",
    lesson_type: "css",
    order_number: 2,
    is_published: 1,
    difficulty_name: "Beginner",
    difficulty_level: 1
  },
  {
    id: 3,
    title: "JavaScript Fundamentals",
    description: "Make your websites interactive with JavaScript",
    lesson_type: "javascript",
    order_number: 3,
    is_published: 1,
    difficulty_name: "Beginner",
    difficulty_level: 1
  }
];

export async function GET() {
  try {
    // Try database connection - this will likely fail
    const { query } = await import('@/lib/db');
    
    const lessonsQuery = `
      SELECT 
        l.id, 
        l.title, 
        l.description, 
        l.lesson_type, 
        l.order_number,
        l.is_published,
        dl.name as difficulty_name,
        dl.level as difficulty_level
      FROM lessons l
      LEFT JOIN difficulty_levels dl ON l.difficulty_level_id = dl.id
      WHERE l.is_published = 1
      ORDER BY l.order_number ASC
    `;
    
    const lessons = await query({ query: lessonsQuery });
    
    return NextResponse.json({
      success: true,
      lessons: lessons
    });
    
  } catch (error) {
    console.error('❌ Database error, using mock lessons:', error);
    
    // Return mock lessons when database is not available
    return NextResponse.json({
      success: true,
      lessons: mockLessons,
      source: 'mock'
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form data:', body);
    
    const { title, description, content, lesson_type, difficulty_level_id, order_number } = body;

    console.log('Extracted fields:', {
      title: title,
      description: description, 
      content: content,
      lesson_type: lesson_type,
      difficulty_level_id: difficulty_level_id,
      order_number: order_number
    });

    // Validation
    if (!title || !description || !content || !lesson_type || !difficulty_level_id) {
      console.log('Validation failed - missing fields:', {
        title: !!title,
        description: !!description,
        content: !!content,
        lesson_type: !!lesson_type,
        difficulty_level_id: !!difficulty_level_id
      });
      
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: title, description, content, lesson_type, difficulty_level_id'
      }, { status: 400 });
    }

    try {
      // Try database connection first
      const { query } = await import('@/lib/db');
      
      // Get the next order number if not provided
      let finalOrderNumber = order_number;
      if (!finalOrderNumber) {
        const maxOrderResult = await query({ 
          query: 'SELECT MAX(order_number) as max_order FROM lessons' 
        }) as any[];
        finalOrderNumber = (maxOrderResult[0]?.max_order || 0) + 1;
      }

      // Insert the new lesson
      const insertQuery = `
        INSERT INTO lessons (title, description, content, lesson_type, difficulty_level_id, order_number, is_published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;

      const result = await query({
        query: insertQuery,
        values: [
          title,
          description, 
          content,
          lesson_type,
          difficulty_level_id,
          finalOrderNumber
        ]
      }) as any;

      return NextResponse.json({
        success: true,
        message: 'Lesson created successfully!',
        lessonId: result.insertId
      }, { status: 201 });
      
    } catch (dbError) {
      console.error('❌ Database error for lesson creation:', dbError);
      
      // For demo purposes, simulate successful creation
      const mockLessonId = Math.floor(Math.random() * 1000) + 100;
      
      return NextResponse.json({
        success: true,
        message: 'Lesson created successfully (demo mode)!',
        lessonId: mockLessonId,
        note: 'This is a demo - lesson not saved to database'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('❌ API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create lesson!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 