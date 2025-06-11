import { randomBytes, createHmac } from 'crypto';
import { NextRequest } from 'next/server';

// CSRF configuration
const CSRF_CONFIG = {
  tokenLength: 32,
  secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  maxAge: 60 * 60 * 1000, // 1 hour
};

export interface CSRFToken {
  token: string;
  timestamp: number;
  signature: string;
}

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now();
  const randomToken = randomBytes(CSRF_CONFIG.tokenLength).toString('hex');
  
  // Create signature using HMAC
  const payload = `${randomToken}.${timestamp}`;
  const signature = createHmac('sha256', CSRF_CONFIG.secret)
    .update(payload)
    .digest('hex');
  
  // Combine token parts
  const csrfToken = `${randomToken}.${timestamp}.${signature}`;
  
  console.log('🔐 Generated CSRF token:', {
    token: randomToken.substring(0, 8) + '...',
    timestamp: new Date(timestamp).toISOString(),
    signature: signature.substring(0, 8) + '...'
  });
  
  return csrfToken;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ CSRF validation failed: Invalid token format');
      return false;
    }
    
    const [randomToken, timestampStr, providedSignature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if token is expired
    const now = Date.now();
    if (now - timestamp > CSRF_CONFIG.maxAge) {
      console.log('❌ CSRF validation failed: Token expired');
      return false;
    }
    
    // Verify signature
    const payload = `${randomToken}.${timestamp}`;
    const expectedSignature = createHmac('sha256', CSRF_CONFIG.secret)
      .update(payload)
      .digest('hex');
    
    if (providedSignature !== expectedSignature) {
      console.log('❌ CSRF validation failed: Invalid signature');
      return false;
    }
    
    console.log('✅ CSRF token validated successfully');
    return true;
    
  } catch (error) {
    console.error('❌ CSRF validation error:', error);
    return false;
  }
}

/**
 * Extract CSRF token from request
 */
export function extractCSRFToken(request: NextRequest): string | null {
  // Try header first
  const headerToken = request.headers.get(CSRF_CONFIG.headerName);
  if (headerToken) {
    return headerToken;
  }
  
  // Try cookie
  const cookieToken = request.cookies.get(CSRF_CONFIG.cookieName)?.value;
  if (cookieToken) {
    return cookieToken;
  }
  
  // Try body for form submissions
  const contentType = request.headers.get('content-type');
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    // For form submissions, the token should be in the request body
    // This will be handled in the API route
  }
  
  return null;
}

/**
 * Get CSRF configuration
 */
export function getCSRFConfig() {
  return {
    cookieName: CSRF_CONFIG.cookieName,
    headerName: CSRF_CONFIG.headerName,
    maxAge: CSRF_CONFIG.maxAge,
  };
}

/**
 * Create CSRF cookie options
 */
export function createCSRFCookieOptions() {
  return {
    name: CSRF_CONFIG.cookieName,
    maxAge: CSRF_CONFIG.maxAge / 1000, // Convert to seconds
    httpOnly: false, // Needs to be accessible by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };
} 