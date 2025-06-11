import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

// Define protected routes
const protectedRoutes = [
  '/student',
  '/teacher',
  '/api/submissions'
];

const publicRoutes = [
  '/',
  '/lessons',
  '/api/auth',
  '/api/lessons',
  '/api/csrf', // CSRF endpoint is public
  '/api/difficulty-levels',
  '/security-demo'
];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow public routes
    const isPublicRoute = publicRoutes.some(route => 
      pathname.startsWith(route)
    );

    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Protect student routes
    if (pathname.startsWith('/student') && (!token || token.role !== 'student')) {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url));
    }

    // Protect teacher routes
    if (pathname.startsWith('/teacher') && (!token || token.role !== 'teacher')) {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url));
    }

    // Security headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 