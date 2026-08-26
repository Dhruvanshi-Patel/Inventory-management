# Inventory Management System

A beginner-friendly, full-featured **Inventory Management System** built using **only**:
- **HTML5** (`index.html`)
- **CSS3** (`styles.css` with warm beige theme)
- **Vanilla JavaScript** (`app.js` with `localStorage`, `Map`, and `Array` data structures)

> 💡 **Zero Subdirectories & Zero Backend Required!** Simply open `index.html` in any web browser to run the application locally.

---

## 🎨 Theme & Features

- **Warm Beige Palette**: Styled with `#f7f3ed` page background, `#ebe3d5` header, `#8c6d46` warm brown buttons, and `#ffffff` card containers.
- **Rupee Currency (₹)**: All prices and total inventory valuation metrics are formatted in Indian Rupees (₹).
- **LocalStorage Data Persistence**: Automatically saves your products in browser `localStorage`. Page refreshes load stored data cleanly without duplicating items!
- **Duplicate Prevention & Stock Merging**: Adding a product with an existing name automatically merges stock (`stock_quantity += addedStock`) and updates total valuation metrics.
- **CRUD Operations**: Add, Edit, Delete, and Update stock quantity (`+1` / `-1`).
- **Real-Time Client-Side Search & Filter**: Filter products by Name, Category, or Stock Status (*All*, *In Stock*, *Low Stock*, *Out of Stock*).
- **Dual View Modes**: Switch between **Table View** and **Grid Cards View**.

---

## 📁 Project Structure

```
├── index.html         # Main HTML5 web application
├── styles.css         # Warm beige styling & layout rules
├── app.js             # Vanilla JS application controller (LocalStorage, Map, Array)
└── README.md          # Project documentation
```

---

## 🚀 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Dhruvanshi-Patel/Inventory-management.git
   cd Inventory-management
   ```

2. Double-click `index.html` or open it in any web browser!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
