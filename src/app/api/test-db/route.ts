import { NextResponse } from 'next/server';
import { getMany, getOne } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Get all users
    const users = await getMany('SELECT * FROM users');
    console.log('Users found:', users);
    
    // Test 2: Get all difficulty levels
    const difficultyLevels = await getMany('SELECT * FROM difficulty_levels');
    console.log('Difficulty levels found:', difficultyLevels);
    
    // Test 3: Get all lessons
    const lessons = await getMany('SELECT * FROM lessons');
    console.log('Lessons found:', lessons);
    
    // Test 4: Get lessons with difficulty level info
    const lessonsWithDifficulty = await getMany(`
      SELECT 
        l.id, 
        l.title, 
        l.description, 
        l.lesson_type, 
        l.order_number,
        dl.name as difficulty_name,
        dl.level as difficulty_level
      FROM lessons l
      LEFT JOIN difficulty_levels dl ON l.difficulty_level_id = dl.id
      ORDER BY l.order_number
    `);
    console.log('Lessons with difficulty:', lessonsWithDifficulty);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        users: users,
        difficultyLevels: difficultyLevels,
        lessons: lessons,
        lessonsWithDifficulty: lessonsWithDifficulty
      },
      counts: {
        users: Array.isArray(users) ? users.length : 0,
        difficultyLevels: Array.isArray(difficultyLevels) ? difficultyLevels.length : 0,
        lessons: Array.isArray(lessons) ? lessons.length : 0
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 