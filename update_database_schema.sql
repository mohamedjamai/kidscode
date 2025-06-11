-- Migration script to add student fields to existing users table
-- Run this to update your existing database schema

USE kidscode;

-- Add new columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS student_number VARCHAR(50) NULL COMMENT 'For school integration (Magister)',
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500) NULL COMMENT 'URL/path to profile photo from Magister',
ADD COLUMN IF NOT EXISTS class_id VARCHAR(100) NULL COMMENT 'Link to class/school system',
ADD COLUMN IF NOT EXISTS school_id VARCHAR(100) NULL COMMENT 'Link to school system',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true COMMENT 'Account status';

-- Update existing demo users with sample data
UPDATE users SET 
    student_number = 'STU001234',
    profile_picture = '/images/profiles/demo-student.jpg',
    class_id = 'CLASS-A1',
    school_id = 'SCHOOL-DEMO',
    is_active = true
WHERE email = 'student@kidscode.com';

UPDATE users SET 
    profile_picture = '/images/profiles/demo-teacher.jpg',
    class_id = 'CLASS-A1',
    school_id = 'SCHOOL-DEMO',
    is_active = true
WHERE email = 'teacher@kidscode.com';

UPDATE users SET 
    profile_picture = '/images/profiles/demo-admin.jpg',
    school_id = 'SCHOOL-DEMO',
    is_active = true
WHERE email = 'admin@kidscode.com';

-- Show updated schema
DESCRIBE users; 