import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const difficulties = await query({
      query: `
        SELECT * FROM DifficultyLevel
        ORDER BY level ASC
      `,
    });

    return NextResponse.json(difficulties);
  } catch (error) {
    console.error('Error fetching difficulties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch difficulties' },
      { status: 500 }
    );
  }
} 