-- KidsCode Database Setup Script
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS kidscode;
USE kidscode;

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    lesson_id INT NOT NULL,
    html_code TEXT,
    css_code TEXT,
    javascript_code TEXT,
    preview_screenshot TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade INT DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    reviewed_by VARCHAR(255) DEFAULT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_student_name (student_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
INSERT INTO submissions (student_name, lesson_id, html_code, css_code, javascript_code, submitted_at, grade, feedback, reviewed_by, reviewed_at) VALUES
('Emma Johnson', 1, '<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Website</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my first webpage! I''m learning HTML.</p>\n    <h2>About Me</h2>\n    <p>My name is Emma and I love coding!</p>\n</body>\n</html>', 'h1 {\n    color: blue;\n    text-align: center;\n}\n\np {\n    color: green;\n    font-size: 16px;\n}', 'console.log("Hello from Emma''s webpage!");', '2025-01-05 10:30:00', 95, 'Excellent work! Great use of HTML elements and structure.', 'Ms. Smith', '2025-01-05 15:45:00'),
('Alex Chen', 2, '<!DOCTYPE html>\n<html>\n<head>\n    <title>Colorful Page</title>\n</head>\n<body>\n    <h1>Welcome to my colorful page</h1>\n    <p class="highlight">This paragraph has special styling!</p>\n    <div class="box">This is a styled box</div>\n</body>\n</html>', 'body {\n    background-color: lightblue;\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: darkblue;\n    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n\n.highlight {\n    background-color: yellow;\n    padding: 10px;\n    border-radius: 5px;\n}\n\n.box {\n    background-color: lightgreen;\n    padding: 20px;\n    margin: 10px;\n    border: 2px solid green;\n    border-radius: 10px;\n}', '', '2025-01-05 14:20:00', NULL, NULL, NULL, NULL);

-- Show table status
SHOW TABLES;
DESCRIBE submissions; 