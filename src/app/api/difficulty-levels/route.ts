import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const difficultyQuery = `
      SELECT id, name, level, description 
      FROM difficulty_levels 
      ORDER BY level ASC
    `;
    
    const difficultyLevels = await query({ query: difficultyQuery });
    
    return NextResponse.json({
      success: true,
      difficulty_levels: difficultyLevels
    });
    
  } catch (error) {
    console.error('Error fetching difficulty levels:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch difficulty levels!',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 