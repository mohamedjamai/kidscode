-- KidsCode Database Schema
CREATE DATABASE IF NOT EXISTS kidscode;
USE kidscode;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    student_number VARCHAR(50) NULL, -- For school integration (Magister)
    profile_picture VARCHAR(500) NULL, -- URL/path to profile photo from Magister
    class_id VARCHAR(100) NULL, -- Link to class/school system
    school_id VARCHAR(100) NULL, -- Link to school system
    is_active BOOLEAN DEFAULT true, -- Account status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Difficulty levels table
CREATE TABLE IF NOT EXISTS difficulty_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    difficulty_level_id INT,
    lesson_type ENUM('html', 'css', 'javascript', 'python', 'blocks') NOT NULL,
    order_number INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (difficulty_level_id) REFERENCES difficulty_levels(id)
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN DEFAULT false,
    score INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

-- Insert default difficulty levels
INSERT INTO difficulty_levels (name, level, description) VALUES
('Beginner', 1, 'Perfect for kids just starting their coding journey'),
('Intermediate', 2, 'For kids who have learned the basics'),
('Advanced', 3, 'For experienced young coders');

-- Insert sample lessons
INSERT INTO lessons (title, description, content, difficulty_level_id, lesson_type, order_number) VALUES
('Your First Website', 'Learn to create your very first webpage with HTML', 'Create a basic HTML page with headings and paragraphs', 1, 'html', 1),
('Making it Pretty', 'Add colors and styles with CSS', 'Learn basic CSS properties like color, font-size, and background', 1, 'css', 2),
('Interactive Elements', 'Make your website interactive with JavaScript', 'Add click events and simple animations', 2, 'javascript', 3),
('Building with Blocks', 'Create websites using visual blocks', 'Drag and drop blocks to build web pages', 1, 'blocks', 4),
('Python Basics', 'Learn the fundamentals of Python programming', 'Variables, loops, and functions in Python', 2, 'python', 5);

-- Insert a default user
INSERT INTO users (email, name, role) VALUES
('student@kidscode.com', 'Demo Student', 'student'),
('teacher@kidscode.com', 'Demo Teacher', 'teacher'),
('admin@kidscode.com', 'Demo Admin', 'admin'); 