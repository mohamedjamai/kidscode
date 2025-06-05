import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const progress = await prisma.progress.findFirst({
      where: {
        lessonId: params.lessonId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!progress) {
      // Return default progress if none exists
      return NextResponse.json({
        completed: false,
        score: 0,
        code: null,
        blocklyXml: null,
        attempts: 0,
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { code, blocklyXml, completed, score } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: params.lessonId,
        },
      },
      update: {
        code,
        blocklyXml,
        completed,
        score,
        attempts: {
          increment: 1,
        },
      },
      create: {
        userId: user.id,
        lessonId: params.lessonId,
        code,
        blocklyXml,
        completed,
        score,
        attempts: 1,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 