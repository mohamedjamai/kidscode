import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import type { Progress } from '@prisma/client';

type UserWithProgress = {
  id: string;
  name: string | null;
  email: string | null;
  progress: (Progress & {
    lesson: {
      difficulty: {
        name: string;
      };
    };
  })[];
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all students in the teacher's class with their progress
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        classId: session.user.classId,
      },
      include: {
        progress: {
          include: {
            lesson: {
              include: {
                difficulty: true,
              },
            },
          },
        },
      },
    });

    // Transform the data for the frontend
    const transformedStudents = students.map((student: UserWithProgress) => {
      const totalLessons = student.progress.length;
      const completedLessons = student.progress.filter((p: Progress) => p.completed).length;
      const currentLevel = student.progress[0]?.lesson.difficulty.name || 'Beginner';

      return {
        id: student.id,
        name: student.name || '',
        email: student.email || '',
        progress: {
          completed: completedLessons,
          total: totalLessons,
          percentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
        },
        currentLevel,
      };
    });

    return NextResponse.json(transformedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 