-- ====================================================
-- Smart Student Behavior Analytics - MySQL Setup
-- ====================================================
-- This script sets up the database for the application
-- Run this BEFORE starting the backend server
-- ====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS student_behavior_analytics
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE student_behavior_analytics;

-- Show that database is created
SELECT 'Database created successfully!' AS Status;

-- ====================================================
-- Tables will be auto-created by Sequelize
-- ====================================================
-- When you start the backend server, Sequelize will:
-- 1. Create the users table
-- 2. Create the activities table
-- 3. Create the behavior_data table
-- 4. Create the alerts table
-- 5. Set up all foreign keys and indexes
-- ====================================================

-- Optional: Create a dedicated application user (more secure than using root)
-- Uncomment and run these lines if you want a dedicated user:

/*
CREATE USER IF NOT EXISTS 'student_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON student_behavior_analytics.* TO 'student_app'@'localhost';
FLUSH PRIVILEGES;

-- Then update your .env file:
-- DB_USER=student_app
-- DB_PASSWORD=your_secure_password
*/

-- ====================================================
-- Verify Setup
-- ====================================================

-- Show current database
SELECT DATABASE() AS CurrentDatabase;

-- Show character set
SHOW VARIABLES LIKE 'character_set_database';

-- ====================================================
-- Useful Commands for Testing
-- ====================================================

-- After backend starts, verify tables were created:
-- SHOW TABLES;

-- Check table structures:
-- DESCRIBE users;
-- DESCRIBE activities;
-- DESCRIBE behavior_data;
-- DESCRIBE alerts;

-- View data:
-- SELECT * FROM users;
-- SELECT * FROM activities ORDER BY timestamp DESC LIMIT 10;
-- SELECT * FROM behavior_data ORDER BY date DESC;
-- SELECT * FROM alerts WHERE status = 'active';

-- ====================================================
-- Reset Database (USE WITH CAUTION!)
-- ====================================================
-- Only use this if you want to completely reset:

/*
DROP DATABASE IF EXISTS student_behavior_analytics;
CREATE DATABASE student_behavior_analytics
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
*/

-- ====================================================
-- END OF SETUP SCRIPT
-- ====================================================

SELECT 'Setup complete! Now start your backend server.' AS NextStep;
