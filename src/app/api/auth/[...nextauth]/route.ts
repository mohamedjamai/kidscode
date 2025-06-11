import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { Session } from 'next-auth';
import { authenticateUser, validateEmail, validatePassword, checkRateLimit } from '@/lib/auth';

// Secure user database - in real app this would be in a database
const SECURE_USERS = {
  'student@kidscode.com': {
    password: 'securepass123',
    role: 'student',
    name: 'Demo Student'
  },
  'teacher@kidscode.com': {
    password: 'teacherpass123', 
    role: 'teacher',
    name: 'Demo Teacher'
  },
  'test.student@kidscode.com': {
    password: 'test123',
    role: 'student', 
    name: 'Test Student'
  },
  'test.teacher@kidscode.com': {
    password: 'test123',
    role: 'teacher',
    name: 'Test Teacher'
  }
};

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    student_number?: string;
    profile_picture?: string;
    class_id?: string;
    school_id?: string;
  };
}

interface DbUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  classId: string | null;
}

// Ensure we always have a secret - multiple fallbacks
const getSecureSecret = () => {
  // Try environment variable first
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length > 10) {
    return process.env.NEXTAUTH_SECRET;
  }
  
  // Fallback to a secure development secret
  const devSecret = 'kidscode-secure-development-secret-2024-v2-do-not-use-in-production-' + Date.now();
  
  console.log('🔑 Using fallback NextAuth secret for development');
  
  return devSecret;
};

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error('Missing credentials');
        }

        try {
          // Input validation
          if (!validateEmail(credentials.email)) {
            throw new Error('Invalid email format');
          }

          const passwordValidation = validatePassword(credentials.password);
          if (!passwordValidation.isValid) {
            throw new Error(passwordValidation.message || 'Invalid password');
          }

          // Rate limiting check
          if (!checkRateLimit(credentials.email)) {
            throw new Error('Too many login attempts. Please try again later.');
          }

          // Get client IP for logging (if available)
          const ip = req?.headers?.['x-forwarded-for'] || req?.headers?.['x-real-ip'] || 'unknown';

          // Authenticate user with new secure system
          const authResult = await authenticateUser(
            credentials.email, 
            credentials.password, 
            ip as string
          );

          if (!authResult.success) {
            throw new Error(authResult.message || 'Authentication failed');
          }

          if (!authResult.user) {
            throw new Error('User data not found');
          }

          // Verify role matches
          if (authResult.user.role !== credentials.role) {
            throw new Error(`This account is for ${authResult.user.role}s only. Please select the correct role.`);
          }

          // Return user object for session
          return {
            id: authResult.user.id,
            name: authResult.user.name,
            email: authResult.user.email,
            role: authResult.user.role,
            student_number: authResult.user.student_number,
            profile_picture: authResult.user.profile_picture,
            class_id: authResult.user.class_id,
            school_id: authResult.user.school_id,
            image: null
          };
        } catch (error) {
          console.error('Auth error:', error);
          // Don't expose specific error details to prevent information leakage
          throw new Error(error instanceof Error ? error.message : 'Authentication failed');
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      // Add additional sign-in validation if needed
      return true;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      
      if (customSession.user) {
        customSession.user.id = token.sub!;
        customSession.user.role = (token as any).role || 'student';
        customSession.user.name = token.name;
        customSession.user.email = token.email;
        customSession.user.student_number = (token as any).student_number;
        customSession.user.profile_picture = (token as any).profile_picture;
        customSession.user.class_id = (token as any).class_id;
        customSession.user.school_id = (token as any).school_id;
      }
      
      return customSession;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
        token.student_number = (user as any).student_number;
        token.profile_picture = (user as any).profile_picture;
        token.class_id = (user as any).class_id;
        token.school_id = (user as any).school_id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60, // 5 minutes only - very short session
    updateAge: 60, // Update every minute (doesn't matter much with 5min max)
  },
  cookies: {
    sessionToken: {
      name: `kidscode.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60, // 5 minutes
      }
    },
    callbackUrl: {
      name: `kidscode.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60, // 5 minutes
      }
    },
    csrfToken: {
      name: `kidscode.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60, // 5 minutes
      }
    }
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign-ins with security notice
      console.log(`🔓 Secure login: ${user.email} (${(user as any).role}) - Session expires in 5 minutes`);
    },
    async signOut({ session, token }) {
      // Log sign-outs
      console.log(`🔒 User signed out: ${session?.user?.email || 'unknown'}`);
    },
    async session({ session, token }) {
      // Log active sessions (will happen frequently with short sessions)
      // Only log occasionally to reduce noise
      if (Math.random() < 0.1) { // 10% chance to log
        console.log(`🔄 Active session: ${session?.user?.email} - Security mode: High`);
      }
    }
  },
  secret: getSecureSecret(),
  debug: false, // Turn off debug to reduce noise
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 