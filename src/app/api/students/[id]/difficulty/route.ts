import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is a teacher
    if (!session || session.user?.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized - Teachers only' },
        { status: 401 }
      );
    }

    const { difficultyId } = await request.json();

    // Validate the student exists and belongs to teacher's class
    const student = await prisma.user.findFirst({
      where: {
        id: params.id,
        class: {
          teacherId: session.user.id,
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found or not in your class' },
        { status: 404 }
      );
    }

    // Validate the difficulty level exists
    const difficultyLevel = await prisma.difficultyLevel.findUnique({
      where: { id: difficultyId },
    });

    if (!difficultyLevel) {
      return NextResponse.json(
        { error: 'Difficulty level not found' },
        { status: 404 }
      );
    }

    // Update student's progress for all lessons in the new difficulty level
    const lessons = await prisma.lesson.findMany({
      where: { difficultyId },
    });

    // Create or update progress entries for the new difficulty level
    await Promise.all(
      lessons.map((lesson) =>
        prisma.progress.upsert({
          where: {
            userId_lessonId: {
              userId: student.id,
              lessonId: lesson.id,
            },
          },
          create: {
            userId: student.id,
            lessonId: lesson.id,
            completed: false,
            score: 0,
          },
          update: {},
        })
      )
    );

    return NextResponse.json(
      { message: 'Student difficulty level updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating student difficulty:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 