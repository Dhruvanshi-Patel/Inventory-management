# Inventory Management System

A beginner-friendly, full-featured **Inventory Management System** for managing products, tracking stock levels, searching/filtering inventory, and identifying low-stock and out-of-stock items.

Built using **PHP**, **SQL (SQLite/PDO)**, **HTML5**, **CSS** (warm beige color theme), and **JavaScript** (leveraging `Map`, `Array`, `Objects`, and `LocalStorage`).

---

## 🎨 Theme & Aesthetics

- **Beige Color Palette**: Designed with a clean, warm beige theme (`#f7f3ed` background, `#ebe3d5` header, `#8c6d46` accents, `#ffffff` card panels).
- **Rupee Currency (₹)**: All prices, inventory valuation metrics, forms, and CSV exports are formatted in Indian Rupees (₹).
- **Dual Persistence**: Works seamlessly with PHP/SQL backend API (`api.php` + `inventory.db`) and automatically falls back to browser `LocalStorage` if running client-side without a PHP server.

---

## ✨ Features

- 📦 **Product Details**: Product Name, Category, Price (₹), Stock Quantity, SKU Code, Description, and Stock Status.
- ➕ **CRUD Operations**: Add new products, edit existing items, delete with confirmation modal.
- 📊 **Dashboard Metrics**:
  - Total Products Cataloged
  - Total Inventory Valuation (₹)
  - Low Stock Counter ($\le$ 5 units)
  - Out of Stock Counter ($= 0$ units)
- 🔍 **Real-Time Search & Filtering**: Instant search by Product Name, SKU, Category, or Description; Category filter dropdown; Stock status filter pills (*All*, *In Stock*, *Low Stock*, *Out of Stock*).
- ⚡ **Stock Adjustments**: Quick `+1` / `-1` stock buttons and exact stock quantity adjustment modal.
- 👁️ **Dual View Modes**: Switch between detailed **Table View** and **Grid Cards View**.
- 📥 **Export Data**: Export inventory to **CSV** spreadsheet or **JSON** backup format.

---

## 📁 Project Structure

```
├── index.php          # Main PHP server entry point
├── index.html         # Main HTML5 UI markup
├── api.php            # RESTful PHP API controller for SQL database operations
├── config.php         # PDO Database connection configuration (SQLite / MySQL)
├── database.php       # Database auto-initializer & seeder script
├── schema.sql         # SQL database schema DDL & initial product seed data
├── inventory.db       # SQLite database file
├── css/
│   └── styles.css     # Beige theme styling and responsive layout rules
└── js/
    ├── store.js       # Data Store Engine (Map, Array methods, LocalStorage sync)
    └── app.js         # UI Controller & DOM event listeners
```

---

## 🚀 Getting Started

### Method 1: Using PHP Built-in Web Server (Recommended for SQL Persistence)

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhruvanshi-Patel/Inventory-management.git
   cd Inventory-management
   ```

2. Start the PHP development server:
   ```bash
   php -S 127.0.0.1:8000
   ```

3. Open your browser and navigate to:
   ```
   http://127.0.0.1:8000/index.php
   ```

---

### Method 2: Client-Side Standalone Mode (No PHP required)

Simply open `index.html` directly in any web browser. The system will automatically use browser `LocalStorage` for saving and updating your inventory data!

---

## 🛠️ Built With

- **HTML5** & **CSS3** (Custom Properties, Responsive Flexbox/Grid)
- **JavaScript (ES6+)** (`Map`, `Array` methods, `LocalStorage`, `fetch` API)
- **PHP 8.x** & **PDO SQLite**
- **FontAwesome 6** Icons

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
