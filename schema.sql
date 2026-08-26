-- Inventory Management System Database Schema
-- Simple SQL table setup for beginner PHP & SQLite project

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for basic search & stock filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Seed Initial Categories
INSERT OR IGNORE INTO categories (id, name, slug) VALUES 
(1, 'Electronics', 'electronics'),
(2, 'Apparel & Fashion', 'apparel'),
(3, 'Home & Kitchen', 'home-kitchen'),
(4, 'Books & Stationery', 'books-stationery'),
(5, 'Groceries', 'groceries');

-- Seed Sample Products with prices in Indian Rupees (₹)
INSERT OR IGNORE INTO products (id, sku, name, description, price, stock, category, created_at, updated_at) VALUES 
('prod-101', 'SKU-ELEC-001', 'Wireless Bluetooth Headphones', 'Over-ear headphones with deep bass and 20-hour battery backup.', 2499.00, 15, 'Electronics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod-102', 'SKU-ELEC-002', 'RGB Mechanical Gaming Keyboard', 'Tactile switches with customizable rainbow LED backlighting.', 3499.00, 3, 'Electronics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod-103', 'SKU-ELEC-003', 'Full HD Monitor 24 inch', '1080p IPS display monitor for office and gaming.', 8999.00, 0, 'Electronics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod-104', 'SKU-APPR-001', 'Cotton Polo T-Shirt', 'Breathable 100% pure cotton regular fit t-shirt.', 799.00, 25, 'Apparel & Fashion', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod-105', 'SKU-HOME-001', 'Electric Coffee Maker Machine', 'Automatic drip coffee brewer with keep-warm plate.', 1850.00, 2, 'Home & Kitchen', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod-106', 'SKU-BOOK-001', 'Complete Web Development Book', 'Beginner guide to HTML, CSS, JavaScript, PHP and SQL databases.', 450.00, 0, 'Books & Stationery', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('prod-107', 'SKU-GROC-001', 'Organic Roasted Coffee Beans 500g', 'Fresh roasted arabica coffee beans.', 599.00, 40, 'Groceries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
