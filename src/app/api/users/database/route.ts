import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { executeQuery } = await import('@/lib/prisma');
    
    // Get all users from database
    const dbUsers = await executeQuery(`
      SELECT 
        id,
        email,
        name,
        role,
        student_number,
        profile_picture,
        class_id,
        school_id,
        is_active,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json({
      success: true,
      message: 'Database users retrieved successfully',
      users: dbUsers,
      count: Array.isArray(dbUsers) ? dbUsers.length : 0,
      source: 'database'
    });
    
  } catch (error) {
    console.error('Database users error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve users from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 