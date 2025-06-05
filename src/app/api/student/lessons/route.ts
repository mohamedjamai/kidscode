import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RowDataPacket } from 'mysql2';

interface LessonRow extends RowDataPacket {
  id: string;
  title: string;
  description: string;
  type: string;
  difficultyName: string;
  difficultyLevel: number;
  order: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug log

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get lessons with difficulty information
    const lessons = await query({
      query: `
        SELECT l.*, d.name as difficultyName, d.level as difficultyLevel
        FROM Lesson l
        JOIN DifficultyLevel d ON l.difficultyId = d.id
        ORDER BY l.createdAt DESC
      `
    }) as LessonRow[];

    // Transform the data to match the expected format
    const formattedLessons = Array.isArray(lessons) ? lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      type: lesson.type,
      difficulty: {
        name: lesson.difficultyName,
        level: lesson.difficultyLevel
      },
      order: lesson.order || 0
    })) : [];

    console.log('Lessons found:', formattedLessons); // Debug log
    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Detailed error:', error); // More detailed error logging
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 