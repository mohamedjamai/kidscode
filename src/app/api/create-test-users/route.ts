import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('Creating test users...');
    
    // Create test student
    await executeQuery(`
      INSERT IGNORE INTO users (email, name, role) VALUES
      ('test.student@kidscode.com', 'Test Student', 'student')
    `);
    console.log('Test student created');

    // Create test teacher  
    await executeQuery(`
      INSERT IGNORE INTO users (email, name, role) VALUES
      ('test.teacher@kidscode.com', 'Test Teacher', 'teacher')
    `);
    console.log('Test teacher created');

    // Get all users to verify
    const allUsers = await executeQuery('SELECT * FROM users ORDER BY id');
    
    return NextResponse.json({
      success: true,
      message: 'Test users created successfully!',
      users: allUsers
    });
    
  } catch (error) {
    console.error('Error creating test users:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create test users!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 