import { NextResponse } from 'next/server';

// Mock difficulty levels data when database is not available
const mockDifficultyLevels = [
  {
    id: 1,
    name: "Beginner",
    level: 1,
    description: "Perfect for kids who are just starting their coding journey"
  },
  {
    id: 2,
    name: "Intermediate", 
    level: 2,
    description: "For kids who know the basics and want to learn more"
  },
  {
    id: 3,
    name: "Advanced",
    level: 3,
    description: "For experienced young coders ready for challenges"
  }
];

export async function GET() {
  try {
    const { query } = await import('@/lib/db');
    
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
    console.error('❌ Database error, using mock difficulty levels:', error);
    
    // Return mock difficulty levels when database is not available
    return NextResponse.json({
      success: true,
      difficulty_levels: mockDifficultyLevels,
      source: 'mock'
    });
  }
} 