import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401 }
    );
  }

  try {
    // Fetch Python lessons with user progress
    const lessons = await prisma.lesson.findMany({
      where: {
        type: 'Python',
      },
      include: {
        difficulty: true,
        progress: {
          where: {
            userId: session.user.id,
          },
        },
      },
      orderBy: {
        difficulty: {
          level: 'asc',
        },
      },
    });

    // Transform the data to include completion status
    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      difficulty: lesson.difficulty,
      completed: lesson.progress.length > 0,
      score: lesson.progress[0]?.score || null,
    }));

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching Python lessons:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch lessons' }),
      { status: 500 }
    );
  }
} 