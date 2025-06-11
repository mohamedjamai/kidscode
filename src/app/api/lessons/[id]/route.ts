import { NextResponse } from 'next/server';
import { getOne, executeQuery } from '@/lib/prisma';

// Mock lessons data
const mockLessons = [
  {
    id: 1,
    title: "Introduction to HTML",
    description: "Learn the basics of HTML and create your first webpage",
    content: `# Introduction to HTML

Welcome to your first HTML lesson! HTML (HyperText Markup Language) is the foundation of all web pages.

## What You'll Learn:
- Basic HTML structure
- Common HTML tags
- Creating your first webpage

## Your First HTML Page:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage!</p>
</body>
</html>
\`\`\`

## Challenge:
Create a webpage about yourself with:
- A title
- A heading with your name
- A paragraph about your interests`,
    lesson_type: "html",
    order_number: 1,
    is_published: 1,
    difficulty_name: "Beginner",
    difficulty_level: 1,
    difficulty_description: "Perfect for beginners with no coding experience"
  },
  {
    id: 2,
    title: "CSS Styling Basics",
    description: "Add colors, fonts, and layout to your webpages",
    content: `# CSS Styling Basics

CSS (Cascading Style Sheets) makes your websites beautiful! Let's add colors and styles.

## What You'll Learn:
- How to add CSS to HTML
- Colors and fonts
- Basic styling properties

## Your First CSS:

\`\`\`css
body {
    background-color: lightblue;
    font-family: Arial, sans-serif;
}

h1 {
    color: darkblue;
    text-align: center;
}

p {
    color: green;
    font-size: 18px;
}
\`\`\`

## Challenge:
Style your webpage with:
- A background color
- Colorful headings
- Styled paragraphs`,
    lesson_type: "css",
    order_number: 2,
    is_published: 1,
    difficulty_name: "Beginner",
    difficulty_level: 1,
    difficulty_description: "Perfect for beginners with no coding experience"
  },
  {
    id: 3,
    title: "JavaScript Fundamentals", 
    description: "Make your websites interactive with JavaScript",
    content: `# JavaScript Fundamentals

JavaScript brings your websites to life with interactivity!

## What You'll Learn:
- Variables and functions
- Making things happen with clicks
- Basic programming concepts

## Your First JavaScript:

\`\`\`javascript
function sayHello() {
    alert("Hello from JavaScript!");
}

function changeColor() {
    document.body.style.backgroundColor = "yellow";
}
\`\`\`

## Challenge:
Add JavaScript to:
- Show an alert when page loads
- Change colors when buttons are clicked
- Display the current time`,
    lesson_type: "javascript",
    order_number: 3,
    is_published: 1,
    difficulty_name: "Beginner", 
    difficulty_level: 1,
    difficulty_description: "Perfect for beginners with no coding experience"
  }
];

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

    try {
      // Try database connection first
      const { getOne } = await import('@/lib/prisma');
      
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
      
    } catch (dbError) {
      console.error('❌ Database error, using mock lesson:', dbError);
      
      // Fallback to mock lessons
      const mockLesson = mockLessons.find(lesson => lesson.id === lessonId);
      
      if (!mockLesson) {
        return NextResponse.json({
          success: false,
          message: 'Lesson not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        lesson: mockLesson,
        source: 'mock'
      });
    }
    
  } catch (error) {
    console.error('❌ API error:', error);
    
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
    
    console.log(`✏️ PUT lesson API called for ID: ${lessonId}`);
    
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

    try {
      // Try database first
      const { getOne, executeQuery } = await import('@/lib/prisma');
      
      // Check if lesson exists
      const existingLesson = await getOne(`
        SELECT id FROM lessons WHERE id = ?
      `, [lessonId]);

      if (!existingLesson) {
        return NextResponse.json({
          success: false,
          message: 'Lesson not found in database'
        }, { status: 404 });
      }

      // Update the lesson
      await executeQuery(`
        UPDATE lessons 
        SET title = ?, description = ?, content = ?, lesson_type = ?, difficulty_level_id = ?
        WHERE id = ?
      `, [title, description, content, lesson_type, difficulty_level, lessonId]);

      console.log(`✅ Lesson ${lessonId} updated in database`);
      return NextResponse.json({
        success: true,
        message: 'Lesson updated successfully'
      });

    } catch (dbError) {
      console.error('❌ Database error during lesson update, using mock system:', dbError);
      
      // Fallback: For demo purposes, we'll simulate successful update
      const mockLesson = mockLessons.find(lesson => lesson.id === lessonId);
      
      if (!mockLesson) {
        return NextResponse.json({
          success: false,
          message: 'Lesson not found'
        }, { status: 404 });
      }

      // For demo mode, we simulate update (we can't actually modify the const array)
      console.log(`✅ Mock update of lesson ${lessonId}: "${title}"`);
      return NextResponse.json({
        success: true,
        message: 'Lesson updated successfully (demo mode)',
        note: 'In demo mode, changes are restored on server restart'
      });
    }

  } catch (error) {
    console.error('❌ Error updating lesson:', error);
    
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
    
    console.log(`🗑️ DELETE lesson API called for ID: ${lessonId}`);
    
    if (!lessonId || isNaN(lessonId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid lesson ID'
      }, { status: 400 });
    }

    try {
      // Try database first
      const { getOne, executeQuery } = await import('@/lib/prisma');
      
      // Check if lesson exists
      const existingLesson = await getOne(`
        SELECT id FROM lessons WHERE id = ?
      `, [lessonId]);

      if (!existingLesson) {
        return NextResponse.json({
          success: false,
          message: 'Lesson not found in database'
        }, { status: 404 });
      }

      // Delete the lesson
      await executeQuery(`
        DELETE FROM lessons WHERE id = ?
      `, [lessonId]);

      console.log(`✅ Lesson ${lessonId} deleted from database`);
      return NextResponse.json({
        success: true,
        message: 'Lesson deleted successfully'
      });

    } catch (dbError) {
      console.error('❌ Database error during lesson delete, using mock system:', dbError);
      
      // Fallback: For demo purposes, we'll simulate successful deletion
      // In production, you'd want actual lesson management in the mock store
      const mockLesson = mockLessons.find(lesson => lesson.id === lessonId);
      
      if (!mockLesson) {
        return NextResponse.json({
          success: false,
          message: 'Lesson not found'
        }, { status: 404 });
      }

      // For demo mode, we simulate deletion (we can't actually modify the const array)
      console.log(`✅ Mock deletion of lesson ${lessonId}: "${mockLesson.title}"`);
      return NextResponse.json({
        success: true,
        message: 'Lesson deleted successfully (demo mode)',
        note: 'In demo mode, lessons are restored on server restart'
      });
    }

  } catch (error) {
    console.error('❌ Error deleting lesson:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete lesson!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 