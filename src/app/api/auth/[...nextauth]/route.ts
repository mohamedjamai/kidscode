import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { Session } from 'next-auth';
import { query } from '@/lib/db';

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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        try {
          // Check if user exists
          const users = await query({
            query: 'SELECT * FROM User WHERE email = ?',
            values: [credentials.email]
          }) as DbUser[];

          let user: DbUser;

          if (users.length === 0) {
            // Create new user
            const result = await query({
              query: `
                INSERT INTO User (id, name, email, role, image)
                VALUES (?, ?, ?, ?, ?)
              `,
              values: [
                `test-${Date.now()}`,
                credentials.email.split('@')[0],
                credentials.email,
                credentials.role,
                null
              ]
            });

            user = {
              id: `test-${Date.now()}`,
              name: credentials.email.split('@')[0],
              email: credentials.email,
              role: credentials.role,
              image: null,
              classId: null
            };
          } else {
            user = users[0];
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      try {
        // Update or create user with Google info
        await query({
          query: `
            INSERT INTO User (id, email, name, image, role)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            image = VALUES(image),
            role = VALUES(role)
          `,
          values: [
            user.id,
            user.email,
            user.name,
            user.image,
            'student'
          ]
        });
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      
      if (customSession.user) {
        customSession.user.id = token.sub!;
        customSession.user.role = (token as any).role || 'student';

        if (token.sub?.startsWith('test-')) {
          return customSession;
        }

        try {
          const users = await query({
            query: `
              SELECT u.*, c.id as classId, c.name as className
              FROM User u
              LEFT JOIN Class c ON u.classId = c.id
              WHERE u.id = ?
            `,
            values: [token.sub]
          }) as (DbUser & { className: string | null })[];

          if (users.length > 0) {
            const dbUser = users[0];
            customSession.user.role = dbUser.role;
            if (dbUser.classId) {
              customSession.user.classId = dbUser.classId;
              customSession.user.className = dbUser.className || undefined;
            }
          }
        } catch (error) {
          console.error('Session error:', error);
        }
      }
      return customSession;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 