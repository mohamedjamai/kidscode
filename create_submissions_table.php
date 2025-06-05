<?php
// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'kidscode';

try {
    // Create connection
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $database");
    echo "Database '$database' created or already exists.\n";
    
    // Select the database
    $pdo->exec("USE $database");
    
    // Create submissions table
    $createTableSQL = "
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
        INDEX idx_submitted_at (submitted_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($createTableSQL);
    echo "Submissions table created successfully!\n";
    
    // Show table structure
    $stmt = $pdo->query("DESCRIBE submissions");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\nTable structure:\n";
    foreach ($columns as $column) {
        echo "- {$column['Field']}: {$column['Type']}\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?> 