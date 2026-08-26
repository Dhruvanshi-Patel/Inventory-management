# Inventory Management System (PHP & MySQL)

A simple, beginner-friendly **Inventory Management System** for managing products, tracking stock levels, searching/filtering inventory, and identifying low-stock and out-of-stock items.

Built using **procedural PHP**, **MySQL (PDO)**, **HTML5**, **CSS** (warm beige theme), and **basic Vanilla JavaScript** (procedural functions, DOM arrays, objects, no JSON, no ES6 classes).

---

## 📋 Database (SQL)

Run the following raw SQL statements in **phpMyAdmin** or **MySQL CLI** to create the `products` table and insert sample data:

```sql
-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Insert Initial Sample Products (in Indian Rupees ₹)
INSERT INTO products (name, description, price, stock_quantity, category) VALUES
('Wireless Bluetooth Headphones', 'Over-ear headphones with deep bass and 20-hour battery backup.', 2499.00, 15, 'Electronics'),
('RGB Mechanical Gaming Keyboard', 'Tactile switches with customizable rainbow LED backlighting.', 3499.00, 3, 'Electronics'),
('Full HD Monitor 24 inch', '1080p IPS display monitor for office and gaming.', 8999.00, 0, 'Electronics'),
('Cotton Polo T-Shirt', 'Breathable 100% pure cotton regular fit t-shirt.', 799.00, 25, 'Apparel'),
('Electric Coffee Maker Machine', 'Automatic drip coffee brewer with keep-warm plate.', 1850.00, 2, 'Home & Kitchen'),
('Complete Web Development Book', 'Beginner guide to HTML, CSS, JavaScript, PHP and SQL databases.', 450.00, 0, 'Books'),
('Organic Roasted Coffee Beans 500g', 'Fresh roasted arabica coffee beans.', 599.00, 40, 'Groceries');
```

---

## 🎨 Design & Features

- **Beige Palette**: Warm beige color theme (`#f7f3ed` background, `#ebe3d5` header, `#8c6d46` accents, `#ffffff` card containers).
- **Rupee Currency (₹)**: All prices and inventory valuation metrics formatted in Indian Rupees (₹).
- **CRUD Operations**: Add, Edit, Delete, and Update stock quantity (`+1` / `-1`).
- **Stock Status Badges**:
  - `In Stock` (> 5 units)
  - `Low Stock` (1 to 5 units)
  - `Out of Stock` (0 units)
- **Real-Time Client-Side Filter**: Instant search by product name, category, or description using plain Vanilla JS.
- **Dual View Modes**: Switch between **Table View** and **Grid Cards View**.

---

## 📁 Project Structure

```
├── index.php          # Main PHP server application controller & view
├── db.php             # Procedural PDO database connection handler (MySQL / SQLite fallback)
├── database.php       # Auto-initializer for schema setup
├── schema.sql         # Raw MySQL database creation script
├── css/
│   └── styles.css     # Warm beige theme styling & layout rules
└── js/
    └── app.js         # Basic procedural JavaScript (DOM filtering & modal handling)
```

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhruvanshi-Patel/Inventory-management.git
   cd Inventory-management
   ```

2. Configure database settings in `db.php` if using MySQL:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'inventory_db');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

3. Start the PHP built-in web server:
   ```bash
   php -S 127.0.0.1:8000
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:8000/index.php
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
