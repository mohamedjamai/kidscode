import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Progress {
  completed: boolean;
  lesson: {
    difficulty: {
      id: string;
      level: number;
    };
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the student's progress to find the next incomplete lesson
    const progress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        lesson: {
          include: {
            difficulty: true,
          },
        },
      },
      orderBy: {
        lesson: {
          order: 'asc',
        },
      },
    });

    // Find the first incomplete lesson
    const nextLesson = progress.find((p: Progress) => !p.completed);

    if (nextLesson) {
      return NextResponse.json(nextLesson.lesson);
    }

    // If all lessons are completed in current difficulty, suggest moving to next level
    const currentDifficulty = progress[0]?.lesson.difficulty;
    
    if (currentDifficulty) {
      const nextDifficulty = await prisma.difficultyLevel.findFirst({
        where: {
          level: {
            gt: currentDifficulty.level,
          },
        },
        orderBy: {
          level: 'asc',
        },
      });

      if (nextDifficulty) {
        // Get the first lesson of the next difficulty level
        const firstLesson = await prisma.lesson.findFirst({
          where: {
            difficultyId: nextDifficulty.id,
          },
          include: {
            difficulty: true,
          },
          orderBy: {
            order: 'asc',
          },
        });

        if (firstLesson) {
          return NextResponse.json({
            ...firstLesson,
            needsTeacherApproval: true,
          });
        }
      }
    }

    // If no lessons are found or all are completed
    return NextResponse.json(
      { message: 'All lessons completed!' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching current lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 