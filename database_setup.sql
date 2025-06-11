-- KidsCode Database Setup
-- Run this in phpMyAdmin or MySQL to create the required tables

CREATE DATABASE IF NOT EXISTS `kidscode`;
USE `kidscode`;

-- Lessons table
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `lesson_type` enum('html','css','javascript','python','blocks') NOT NULL DEFAULT 'html',
  `order_number` int(11) NOT NULL DEFAULT 1,
  `difficulty_name` varchar(50) NOT NULL DEFAULT 'Beginner',
  `difficulty_level` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample lessons
INSERT INTO `lessons` (`id`, `title`, `description`, `lesson_type`, `order_number`, `difficulty_name`, `difficulty_level`) VALUES
(1, 'Introduction to HTML', 'Learn the basics of HTML structure and elements', 'html', 1, 'Beginner', 1),
(2, 'CSS Styling Basics', 'Discover how to style your HTML with CSS', 'css', 2, 'Beginner', 1),
(3, 'JavaScript Fundamentals', 'Introduction to JavaScript programming', 'javascript', 3, 'Intermediate', 2),
(4, 'Advanced HTML Forms', 'Create interactive forms with HTML', 'html', 4, 'Intermediate', 2),
(5, 'CSS Flexbox Layout', 'Master modern CSS layout with Flexbox', 'css', 5, 'Advanced', 3);

-- Submissions table
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `html_code` longtext DEFAULT NULL,
  `css_code` longtext DEFAULT NULL,
  `javascript_code` longtext DEFAULT NULL,
  `preview_screenshot` longtext DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grade` decimal(3,1) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `reviewed_by` varchar(255) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `student_name` (`student_name`),
  KEY `submitted_at` (`submitted_at`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample submissions with Dutch grades (0-10)
INSERT INTO `submissions` (`student_name`, `lesson_id`, `html_code`, `css_code`, `javascript_code`, `submitted_at`, `grade`, `feedback`, `reviewed_by`, `reviewed_at`) VALUES
('Emma Johnson', 1, '<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Website</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my first webpage! I\'m learning HTML.</p>\n</body>\n</html>', 'h1 { color: blue; text-align: center; }\np { color: green; font-size: 16px; }', 'console.log("Hello from Emma!");', NOW() - INTERVAL 2 HOUR, 9.5, 'Excellent work! Great use of HTML elements and structure.', 'Ms. Smith', NOW() - INTERVAL 1 HOUR),

('Alex Chen', 2, '<!DOCTYPE html>\n<html>\n<head>\n    <title>Colorful Page</title>\n</head>\n<body>\n    <h1>Welcome to my colorful page</h1>\n    <p class="highlight">This paragraph has special styling!</p>\n</body>\n</html>', 'body { background-color: lightblue; }\nh1 { color: darkblue; }\n.highlight { background-color: yellow; padding: 10px; }', '', NOW() - INTERVAL 3 HOUR, 7.5, 'Good work with CSS! Nice use of colors and styling.', 'Mr. Johnson', NOW() - INTERVAL 1 HOUR),

('Test Student', 1, '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Test Webpage</title>\n</head>\n<body>\n    <h1>Hello from Test Student!</h1>\n    <p>This is a test submission.</p>\n</body>\n</html>', 'h1 { color: purple; text-align: center; }\np { color: blue; }', 'console.log("Test submission!");', NOW() - INTERVAL 30 MINUTE, 8.5, 'Great job! Your HTML structure is clean and well-organized.', 'Ms. Teacher', NOW() - INTERVAL 15 MINUTE),

('Test Teacher', 1, '<!DOCTYPE html>\n<html>\n<head>\n    <title>Teacher Test Page</title>\n</head>\n<body>\n    <h1>Hello from Test Teacher!</h1>\n    <p>Testing the submission system.</p>\n</body>\n</html>', 'h1 { color: green; text-align: center; }\np { color: darkgreen; margin: 10px; }', 'console.log("Teacher test!");', NOW() - INTERVAL 45 MINUTE, 9.0, 'Excellent work! Perfect understanding of HTML structure.', 'Principal Johnson', NOW() - INTERVAL 10 MINUTE);

-- Optional: Users table for authentication (if you want to move away from hardcoded users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Show success message
SELECT 'Database setup completed successfully!' as Status; 