import { NextResponse } from 'next/server';
import { getAllRegisteredUsers } from '@/lib/auth';

export async function GET() {
  try {
    const allUsers = getAllRegisteredUsers();
    
    return NextResponse.json({
      success: true,
      message: 'All registered users retrieved',
      users: allUsers,
      count: Object.keys(allUsers).length
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
} 