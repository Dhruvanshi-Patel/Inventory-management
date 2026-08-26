# Inventory Management System

A beginner-friendly, full-featured **Inventory Management System** for managing products, tracking stock levels, searching/filtering inventory, and identifying low-stock and out-of-stock items.

Built using **PHP**, **SQL (SQLite/PDO)**, **HTML5**, **CSS** (warm beige color theme), and **JavaScript** (using native `Map` and `Array` data structures).

> 💡 **Note**: Built completely without JSON or CSV export dependencies! Uses standard HTML Form POST submissions and PDO SQL queries.

---

## 🎨 Theme & Aesthetics

- **Beige Color Palette**: Designed with a clean, warm beige theme (`#f7f3ed` page background, `#ebe3d5` header, `#8c6d46` warm brown accents, `#ffffff` card containers).
- **Rupee Currency (₹)**: All product prices and inventory valuation metrics are formatted in Indian Rupees (₹).

---

## ✨ Features

- 📦 **Product Details**: Product Name, Category, Price (₹), Stock Quantity, SKU Code, Description, and Stock Status.
- ➕ **CRUD Operations**: Add new products, edit existing items, delete with confirmation modal.
- 📊 **Dashboard Metrics**:
  - Total Products Cataloged
  - Total Inventory Valuation (₹)
  - Low Stock Counter ($\le$ 5 units)
  - Out of Stock Counter ($= 0$ units)
- 🔍 **Real-Time Client-Side Search & Filtering**: Fast DOM search by Product Name, SKU, Category, or Description; Category filter dropdown; Stock status filter pills (*All*, *In Stock*, *Low Stock*, *Out of Stock*).
- ⚡ **Stock Adjustments**: Quick `+1` / `-1` stock form buttons and exact stock quantity adjustment.
- 👁️ **Dual View Modes**: Switch between detailed **Table View** and **Grid Cards View**.

---

## 📁 Project Structure

```
├── index.php          # Main PHP server application controller & view
├── config.php         # PDO Database connection configuration (SQLite / MySQL)
├── database.php       # Database auto-initializer & seeder script
├── schema.sql         # SQL database schema DDL & initial product seed data
├── inventory.db       # SQLite database file
├── css/
│   └── styles.css     # Beige theme styling and responsive layout rules
└── js/
    └── app.js         # Client-side DOM filtering & modal controller (Map/Array)
```

---

## 🚀 Getting Started

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

## 🛠️ Built With

- **HTML5** & **CSS3** (Custom Properties, Warm Beige Theme)
- **JavaScript (ES6+)** (Native `Map` & `Array` DOM filtering, modal overlays)
- **PHP 8.x** & **PDO SQLite**
- **FontAwesome 6** Icons

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
