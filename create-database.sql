CREATE DATABASE IF NOT EXISTS kidscode;
USE kidscode;

-- Create a user with access to the database (if not exists)
CREATE USER IF NOT EXISTS 'kidscode_user'@'localhost' IDENTIFIED BY 'kidscode_password';
GRANT ALL PRIVILEGES ON kidscode.* TO 'kidscode_user'@'localhost';
FLUSH PRIVILEGES; 