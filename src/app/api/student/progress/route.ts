import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student's progress with lesson and difficulty information
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
      orderBy: [
        {
          lesson: {
            difficulty: {
              level: 'asc',
            },
          },
        },
        {
          lesson: {
            order: 'asc',
          },
        },
      ],
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 