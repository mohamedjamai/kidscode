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
    classId?: string;
    className?: string;
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

// Generate a secure secret for development if none provided
const getNextAuthSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  
  // For development only - generate a consistent secret
  if (process.env.NODE_ENV === 'development') {
    return 'kidscode-dev-secret-2024-secure-fallback-do-not-use-in-production';
  }
  
  throw new Error('NEXTAUTH_SECRET environment variable is required in production');
};

export const authOptions: NextAuthOptions = {
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
      }
      
      return customSession;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign-ins
      console.log(`User signed in: ${user.email} (${(user as any).role})`);
    },
    async signOut({ session, token }) {
      // Log sign-outs
      console.log(`User signed out: ${session?.user?.email}`);
    },
  },
  secret: getNextAuthSecret(),
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 