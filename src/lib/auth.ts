import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// User database interface
interface UserData {
  passwordHash: string;
  role: 'student' | 'teacher';
  name: string;
  id: string;
  student_number?: string; // For school integration
  profile_picture?: string; // Profile photo URL/path
  class_id?: string; // Future: link to class/school
  school_id?: string; // Future: link to school
  isActive: boolean;
  lastLogin: Date | null;
  loginAttempts: number;
  lockedUntil: number | null;
}

// Path to persistent user data file
const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load users from file (persistent storage)
function loadUsersFromFile(): Record<string, UserData> {
  try {
    ensureDataDirectory();
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users from file:', error);
  }
  return {};
}

// Save users to file (persistent storage)
function saveUsersToFile(users: Record<string, UserData>) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users to file:', error);
  }
}

// Initial static users (fallback if file doesn't exist)
const STATIC_USERS: Record<string, UserData> = {
  'student@kidscode.com': {
    passwordHash: '$2a$12$LQGqTBrq3xK9.n2qYC9VxOHjN1zW7YJy3OzD4k7H2pO1X8Q5nE9wm', // securepass123
    role: 'student' as const,
    name: 'Demo Student',
    id: 'student-1',
    student_number: 'STU001234',
    profile_picture: '/images/profiles/demo-student.jpg',
    class_id: 'CLASS-A1',
    school_id: 'SCHOOL-DEMO',
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
    student_number: undefined, // Teachers don't have student numbers
    profile_picture: '/images/profiles/demo-teacher.jpg',
    class_id: 'CLASS-A1',
    school_id: 'SCHOOL-DEMO',
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
    student_number: 'STU005678',
    profile_picture: '/images/profiles/test-student.jpg',
    class_id: 'CLASS-B2',
    school_id: 'SCHOOL-TEST',
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
    student_number: undefined,
    profile_picture: '/images/profiles/test-teacher.jpg',
    class_id: 'CLASS-B2',
    school_id: 'SCHOOL-TEST',
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    lockedUntil: null
  }
};

// Combine static and persistent users
function getAllUsers(): Record<string, UserData> {
  const persistentUsers = loadUsersFromFile();
  return { ...STATIC_USERS, ...persistentUsers };
}

// Simple in-memory store for now (in production use Redis or database)
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  student_number?: string;
  profile_picture?: string;
  class_id?: string;
  school_id?: string;
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
  
  // Get all users (static + persistent)
  const allUsers = getAllUsers();
  const userData = allUsers[email];
  
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
    
    // Save updated user data
    if (!STATIC_USERS[email]) {
      const persistentUsers = loadUsersFromFile();
      persistentUsers[email] = userData;
      saveUsersToFile(persistentUsers);
    }
    
    recordLoginAttempt(email, false, ip);
    return { success: false, message: 'Invalid credentials' };
  }

  // Reset login attempts on successful login
  userData.loginAttempts = 0;
  userData.lockedUntil = null;
  userData.lastLogin = new Date();

  // Save updated user data
  if (!STATIC_USERS[email]) {
    const persistentUsers = loadUsersFromFile();
    persistentUsers[email] = userData;
    saveUsersToFile(persistentUsers);
  }

  recordLoginAttempt(email, true, ip);

  return {
    success: true,
    user: {
      id: userData.id,
      email,
      name: userData.name,
      role: userData.role,
      student_number: userData.student_number,
      profile_picture: userData.profile_picture,
      class_id: userData.class_id,
      school_id: userData.school_id,
      isActive: userData.isActive,
      lastLogin: userData.lastLogin
    }
  };
}

// Simple password verification for demo (in production use bcrypt)
async function verifyPassword(password: string, email: string): Promise<boolean> {
  // For demo purposes, use simple mapping for static users
  const staticPasswordMap: { [key: string]: string } = {
    'student@kidscode.com': 'securepass123',
    'teacher@kidscode.com': 'teacherpass123',
    'test.student@kidscode.com': 'test123',
    'test.teacher@kidscode.com': 'test123'
  };
  
  // Check static password map first
  if (staticPasswordMap[email] === password) {
    return true;
  }
  
  // Check dynamically added passwords from persistent storage
  const persistentUsers = loadUsersFromFile();
  const userData = persistentUsers[email];
  if (userData) {
    // For demo purposes, also store plain password
    const dynamicPasswords = (global as any).dynamicPasswords || {};
    if (dynamicPasswords[email] === password) {
      return true;
    }
  }
  
  return false;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Add new user registration function with persistent storage AND database
export async function registerUser(
  email: string, 
  password: string, 
  name: string, 
  role: 'student' | 'teacher',
  studentNumber?: string
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  
  // Check if email already exists in static or persistent users
  const allUsers = getAllUsers();
  if (allUsers[email]) {
    return { success: false, message: 'Email already exists' };
  }

  // Validate email format
  if (!validateEmail(email)) {
    return { success: false, message: 'Invalid email format' };
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { success: false, message: passwordValidation.message };
  }

  // Generate unique ID
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const userId = `${role}-${timestamp}-${randomSuffix}`;

  // Generate student number if not provided and user is a student
  let finalStudentNumber = studentNumber;
  if (role === 'student' && !studentNumber) {
    finalStudentNumber = `STU${timestamp.toString().slice(-6)}`;
  }

  try {
    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create new user data
    const newUserData: UserData = {
      passwordHash,
      role,
      name,
      id: userId,
      student_number: finalStudentNumber,
      profile_picture: `/images/profiles/default-${role}.jpg`,
      class_id: 'CLASS-NEW',
      school_id: 'SCHOOL-GENERAL',
      isActive: true,
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null
    };

    // Save to persistent file storage (backup)
    const persistentUsers = loadUsersFromFile();
    persistentUsers[email] = newUserData;
    saveUsersToFile(persistentUsers);

    // Store plain password for demo verification
    (global as any).dynamicPasswords = (global as any).dynamicPasswords || {};
    (global as any).dynamicPasswords[email] = password;

    // Try to save to database as well
    try {
      const { executeQuery } = await import('@/lib/prisma');
      
      // Insert user into database
      await executeQuery(`
        INSERT INTO users (email, name, role, student_number, profile_picture, class_id, school_id, is_active, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        email,
        name,
        role,
        finalStudentNumber,
        newUserData.profile_picture,
        newUserData.class_id,
        newUserData.school_id,
        1 // is_active as boolean 1
      ]);

      console.log(`✅ New ${role} registered in DATABASE and file: ${email} (${name})`);
      
    } catch (dbError) {
      console.error('⚠️  Database save failed, but file save succeeded:', dbError);
      console.log(`✅ New ${role} registered in FILE only: ${email} (${name})`);
    }

    return {
      success: true,
      user: {
        id: userId,
        email,
        name,
        role,
        student_number: finalStudentNumber,
        profile_picture: newUserData.profile_picture,
        class_id: newUserData.class_id,
        school_id: newUserData.school_id,
        isActive: true,
        lastLogin: null
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed due to server error' };
  }
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

// Utility function to get all registered users (for debugging)
export function getAllRegisteredUsers(): Record<string, AuthUser> {
  const allUsers = getAllUsers();
  const result: Record<string, AuthUser> = {};
  
  for (const [email, userData] of Object.entries(allUsers)) {
    result[email] = {
      id: userData.id,
      email,
      name: userData.name,
      role: userData.role,
      student_number: userData.student_number,
      profile_picture: userData.profile_picture,
      class_id: userData.class_id,
      school_id: userData.school_id,
      isActive: userData.isActive,
      lastLogin: userData.lastLogin
    };
  }
  
  return result;
} 