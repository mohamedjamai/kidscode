import { NextResponse } from 'next/server';
import { generateCSRFToken, createCSRFCookieOptions } from '@/lib/csrf';

export async function GET() {
  try {
    // Generate new CSRF token
    const csrfToken = generateCSRFToken();
    const cookieOptions = createCSRFCookieOptions();
    
    console.log('🔐 Providing CSRF token via API');
    
    // Create response with token
    const response = NextResponse.json({
      success: true,
      csrfToken,
      message: 'CSRF token generated successfully'
    });
    
    // Set CSRF token as httpOnly=false cookie so frontend can access it
    response.cookies.set(cookieOptions.name, csrfToken, {
      maxAge: cookieOptions.maxAge,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });
    
    return response;
    
  } catch (error) {
    console.error('❌ CSRF token generation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate CSRF token'
    }, { status: 500 });
  }
}

export async function POST() {
  // For refreshing CSRF tokens
  return GET();
} 