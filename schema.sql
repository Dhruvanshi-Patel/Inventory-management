-- Inventory Management System Database Schema
-- Raw MySQL statement for phpMyAdmin / MySQL CLI

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial Sample Seed Data in Indian Rupees (₹) with fixed IDs to prevent any duplicate insertion
INSERT OR IGNORE INTO products (id, name, description, price, stock_quantity, category) VALUES
(1, 'Wireless Bluetooth Headphones', 'Over-ear headphones with deep bass and 20-hour battery backup.', 2499.00, 15, 'Electronics'),
(2, 'RGB Mechanical Gaming Keyboard', 'Tactile switches with customizable rainbow LED backlighting.', 3499.00, 3, 'Electronics'),
(3, 'Full HD Monitor 24 inch', '1080p IPS display monitor for office and gaming.', 8999.00, 0, 'Electronics'),
(4, 'Cotton Polo T-Shirt', 'Breathable 100% pure cotton regular fit t-shirt.', 799.00, 25, 'Apparel'),
(5, 'Electric Coffee Maker Machine', 'Automatic drip coffee brewer with keep-warm plate.', 1850.00, 2, 'Home & Kitchen'),
(6, 'Complete Web Development Book', 'Beginner guide to HTML, CSS, JavaScript, PHP and SQL databases.', 450.00, 0, 'Books'),
(7, 'Organic Roasted Coffee Beans 500g', 'Fresh roasted arabica coffee beans.', 599.00, 40, 'Groceries');
