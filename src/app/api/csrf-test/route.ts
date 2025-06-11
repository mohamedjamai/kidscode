import { NextRequest, NextResponse } from 'next/server';
import { validateCSRFToken } from '@/lib/csrf';

// POST - Test CSRF protection (no data creation)
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 CSRF Test endpoint called');
    
    // Extract CSRF token from headers
    const csrfToken = request.headers.get('x-csrf-token');
    
    if (!csrfToken) {
      console.log('❌ CSRF Test: No token provided');
      return NextResponse.json({
        success: false,
        message: 'CSRF token is required',
        code: 'CSRF_MISSING',
        test: 'failed'
      }, { status: 403 });
    }
    
    // Validate CSRF token
    const isValid = validateCSRFToken(csrfToken);
    
    if (!isValid) {
      console.log('❌ CSRF Test: Invalid token');
      return NextResponse.json({
        success: false,
        message: 'Invalid CSRF token',
        code: 'CSRF_INVALID',
        test: 'failed'
      }, { status: 403 });
    }
    
    // CSRF validation passed
    console.log('✅ CSRF Test: Token validation successful');
    return NextResponse.json({
      success: true,
      message: 'CSRF protection working correctly',
      test: 'passed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ CSRF Test error:', error);
    return NextResponse.json({
      success: false,
      message: 'CSRF test failed',
      code: 'CSRF_ERROR',
      test: 'error'
    }, { status: 500 });
  }
}

// GET - Always succeeds (no CSRF needed for GET requests)
export async function GET() {
  console.log('ℹ️ CSRF Test GET: No protection needed');
  return NextResponse.json({
    success: true,
    message: 'GET request successful (no CSRF needed)',
    test: 'passed',
    timestamp: new Date().toISOString()
  });
} 