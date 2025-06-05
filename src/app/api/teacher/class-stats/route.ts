import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type StudentProgress = {
  progress: {
    completed: boolean;
    lesson: {
      difficulty: {
        name: string;
      };
    };
  }[];
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

    // Get all students in the teacher's class
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

    // Calculate class statistics
    const totalStudents = students.length;
    let totalProgress = 0;
    const levelCounts: { [key: string]: number } = {};

    students.forEach((student: StudentProgress) => {
      const totalLessons = student.progress.length;
      const completedLessons = student.progress.filter((p) => p.completed).length;
      const studentProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      totalProgress += studentProgress;

      // Count students at each level
      const currentLevel = student.progress[0]?.lesson.difficulty.name || 'Beginner';
      levelCounts[currentLevel] = (levelCounts[currentLevel] || 0) + 1;
    });

    // Calculate average progress and most common level
    const averageProgress = totalStudents > 0 ? totalProgress / totalStudents : 0;
    const mostCommonLevel = Object.entries(levelCounts).reduce(
      (max, [level, count]) => (count > max[1] ? [level, count] : max),
      ['Beginner', 0]
    )[0];

    return NextResponse.json({
      totalStudents,
      averageProgress,
      mostCommonLevel,
    });
  } catch (error) {
    console.error('Error fetching class statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 