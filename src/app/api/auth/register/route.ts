import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, studentNumber } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'student' && role !== 'teacher') {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be student or teacher' },
        { status: 400 }
      );
    }

    // Attempt registration
    const result = await registerUser(email, password, name, role, studentNumber);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        user: result.user
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 