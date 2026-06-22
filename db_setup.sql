-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  oldPrice DECIMAL(10, 2),
  category VARCHAR(100),
  qty INT,
  description TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
