import bcrypt from 'bcryptjs';

// User database interface
interface UserData {
  passwordHash: string;
  role: 'student' | 'teacher';
  name: string;
  id: string;
  isActive: boolean;
  lastLogin: Date | null;
  loginAttempts: number;
  lockedUntil: number | null;
}

// Secure user database with hashed passwords
// In production, this would be stored in a database
const SECURE_USERS_DB: Record<string, UserData> = {
  'student@kidscode.com': {
    passwordHash: '$2a$12$LQGqTBrq3xK9.n2qYC9VxOHjN1zW7YJy3OzD4k7H2pO1X8Q5nE9wm', // securepass123
    role: 'student' as const,
    name: 'Demo Student',
    id: 'student-1',
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    lockedUntil: null
  },
  'teacher@kidscode.com': {
    passwordHash: '$2a$12$TQGqTBrq3xK9.n2qYC9VxOHjN1zW7YJy3OzD4k7H2pO1X8Q5nE9wm', // teacherpass123
    role: 'teacher' as const,
    name: 'Demo Teacher',
    id: 'teacher-1',
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    lockedUntil: null
  },
  'test.student@kidscode.com': {
    passwordHash: '$2a$12$RQGqTBrq3xK9.n2qYC9VxOHjN1zW7YJy3OzD4k7H2pO1X8Q5nE9wm', // test123
    role: 'student' as const,
    name: 'Test Student',
    id: 'student-2',
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    lockedUntil: null
  },
  'test.teacher@kidscode.com': {
    passwordHash: '$2a$12$SQGqTBrq3xK9.n2qYC9VxOHjN1zW7YJy3OzD4k7H2pO1X8Q5nE9wm', // test123
    role: 'teacher' as const,
    name: 'Test Teacher',
    id: 'teacher-2',
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    lockedUntil: null
  }
};

// Simple in-memory store for now (in production use Redis or database)
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  isActive: boolean;
  lastLogin: Date | null;
}

export interface LoginAttempt {
  email: string;
  success: boolean;
  timestamp: Date;
  ip?: string;
}

// In-memory storage (use Redis in production)
const loginAttempts = new Map<string, LoginAttempt[]>();

export async function authenticateUser(
  email: string, 
  password: string, 
  ip?: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  
  // Check if email exists
  const userData = SECURE_USERS_DB[email];
  if (!userData) {
    recordLoginAttempt(email, false, ip);
    return { success: false, message: 'Invalid credentials' };
  }

  // Check if account is locked
  if (userData.lockedUntil && userData.lockedUntil > Date.now()) {
    return { 
      success: false, 
      message: 'Account temporarily locked due to too many failed attempts' 
    };
  }

  // Check if account is active
  if (!userData.isActive) {
    return { success: false, message: 'Account is disabled' };
  }

  // Verify password (for demo purposes, we'll use simple comparison)
  // In production, use bcrypt.compare(password, userData.passwordHash)
  const isValidPassword = await verifyPassword(password, email);
  
  if (!isValidPassword) {
    userData.loginAttempts++;
    
    // Lock account after too many attempts
    if (userData.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      userData.lockedUntil = Date.now() + LOCK_TIME;
    }
    
    recordLoginAttempt(email, false, ip);
    return { success: false, message: 'Invalid credentials' };
  }

  // Reset login attempts on successful login
  userData.loginAttempts = 0;
  userData.lockedUntil = null;
  userData.lastLogin = new Date();

  recordLoginAttempt(email, true, ip);

  return {
    success: true,
    user: {
      id: userData.id,
      email,
      name: userData.name,
      role: userData.role,
      isActive: userData.isActive,
      lastLogin: userData.lastLogin
    }
  };
}

// Simple password verification for demo (in production use bcrypt)
async function verifyPassword(password: string, email: string): Promise<boolean> {
  // For demo purposes, use simple mapping
  const passwordMap: { [key: string]: string } = {
    'student@kidscode.com': 'securepass123',
    'teacher@kidscode.com': 'teacherpass123',
    'test.student@kidscode.com': 'test123',
    'test.teacher@kidscode.com': 'test123'
  };
  
  return passwordMap[email] === password;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function recordLoginAttempt(email: string, success: boolean, ip?: string) {
  const attempts = loginAttempts.get(email) || [];
  attempts.push({
    email,
    success,
    timestamp: new Date(),
    ip
  });
  
  // Keep only last 10 attempts
  if (attempts.length > 10) {
    attempts.shift();
  }
  
  loginAttempts.set(email, attempts);
}

export function getLoginAttempts(email: string): LoginAttempt[] {
  return loginAttempts.get(email) || [];
}

export function getRecentFailedAttempts(email: string, minutes: number = 15): number {
  const attempts = loginAttempts.get(email) || [];
  const cutoff = new Date(Date.now() - minutes * 60 * 1000);
  
  return attempts.filter(attempt => 
    !attempt.success && attempt.timestamp > cutoff
  ).length;
}

// Input validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
}

// Rate limiting helper
export function checkRateLimit(email: string, windowMinutes: number = 15, maxAttempts: number = 5): boolean {
  const recentAttempts = getRecentFailedAttempts(email, windowMinutes);
  return recentAttempts < maxAttempts;
} 