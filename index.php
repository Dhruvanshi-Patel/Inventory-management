<?php
/**
 * Simple Procedural Inventory Management System
 * Plain PHP + PDO MySQL/SQLite + HTML5 + CSS + Vanilla JS (No JSON)
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/database.php';

init_database();
$db = get_db_connection();

// Process HTML Form Submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add') {
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = max(0, floatval($_POST['price'] ?? 0));
        $stock_quantity = max(0, intval($_POST['stock_quantity'] ?? 0));
        $category = trim($_POST['category'] ?? '');

        if (!empty($name) && !empty($category)) {
            $stmt = $db->prepare("INSERT INTO products (name, description, price, stock_quantity, category) VALUES (:name, :description, :price, :stock_quantity, :category)");
            $stmt->execute([
                ':name' => $name,
                ':description' => $description,
                ':price' => $price,
                ':stock_quantity' => $stock_quantity,
                ':category' => $category
            ]);
        }
        header('Location: index.php?msg=added');
        exit;
    } 
    
    if ($action === 'edit') {
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = max(0, floatval($_POST['price'] ?? 0));
        $stock_quantity = max(0, intval($_POST['stock_quantity'] ?? 0));
        $category = trim($_POST['category'] ?? '');

        if ($id > 0 && !empty($name) && !empty($category)) {
            $stmt = $db->prepare("UPDATE products SET name = :name, description = :description, price = :price, stock_quantity = :stock_quantity, category = :category WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':name' => $name,
                ':description' => $description,
                ':price' => $price,
                ':stock_quantity' => $stock_quantity,
                ':category' => $category
            ]);
        }
        header('Location: index.php?msg=updated');
        exit;
    }

    if ($action === 'update_stock') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            if (isset($_POST['delta'])) {
                $delta = intval($_POST['delta']);
                $stmt = $db->prepare("UPDATE products SET stock_quantity = MAX(0, stock_quantity + :delta) WHERE id = :id");
                $stmt->execute([':id' => $id, ':delta' => $delta]);
            } else if (isset($_POST['stock_quantity'])) {
                $newStock = max(0, intval($_POST['stock_quantity']));
                $stmt = $db->prepare("UPDATE products SET stock_quantity = :stock_quantity WHERE id = :id");
                $stmt->execute([':id' => $id, ':stock_quantity' => $newStock]);
            }
        }
        header('Location: index.php?msg=stock_updated');
        exit;
    }

    if ($action === 'delete') {
        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $db->prepare("DELETE FROM products WHERE id = :id");
            $stmt->execute([':id' => $id]);
        }
        header('Location: index.php?msg=deleted');
        exit;
    }

    if ($action === 'reset') {
        init_database(true);
        header('Location: index.php?msg=reset');
        exit;
    }
}

// Fetch all products from MySQL database
$stmt = $db->query("SELECT * FROM products ORDER BY id DESC");
$products = $stmt->fetchAll();

// Fetch distinct categories
$catStmt = $db->query("SELECT DISTINCT category FROM products ORDER BY category ASC");
$categories = array_filter($catStmt->fetchAll(PDO::FETCH_COLUMN));

// Calculate Summary Statistics
$totalProducts = count($products);
$totalValue = 0;
$lowStockCount = 0;
$outOfStockCount = 0;

foreach ($products as $p) {
    $totalValue += ($p['price'] * $p['stock_quantity']);
    if ($p['stock_quantity'] == 0) {
        $outOfStockCount++;
    } else if ($p['stock_quantity'] <= 5) {
        $lowStockCount++;
    }
}

// Status Flash Messages
$toastMsg = '';
$toastType = 'info';
if (isset($_GET['msg'])) {
    switch ($_GET['msg']) {
        case 'added': $toastMsg = 'New product added successfully!'; $toastType = 'success'; break;
        case 'updated': $toastMsg = 'Product updated successfully!'; $toastType = 'success'; break;
        case 'stock_updated': $toastMsg = 'Stock level updated!'; $toastType = 'success'; break;
        case 'deleted': $toastMsg = 'Product deleted from inventory.'; $toastType = 'warning'; break;
        case 'reset': $toastMsg = 'Database reset to initial sample items.'; $toastType = 'info'; break;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Inventory Management System | PHP & MySQL</title>
    <meta name="description" content="Simple beginner-friendly Inventory Management System built with PHP, MySQL, HTML, CSS and JavaScript.">
    
    <!-- CSS & FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <!-- Simple Header Bar -->
    <header class="app-header">
        <div class="header-container">
            <div class="brand">
                <div class="brand-icon">
                    <i class="fa-solid fa-boxes-stacked"></i>
                </div>
                <div class="brand-text">
                    <h1>Inventory Manager</h1>
                    <p>Basic Stock & Product Tracking (PHP & MySQL)</p>
                </div>
            </div>

            <div class="header-actions">
                <form method="POST" action="index.php" style="display: inline;" onsubmit="return confirm('Reset database to initial sample items?');">
                    <input type="hidden" name="action" value="reset">
                    <button type="submit" class="btn btn-secondary" title="Reset Demo Data">
                        <i class="fa-solid fa-rotate-left"></i> Reset Data
                    </button>
                </form>
                <button type="button" class="btn btn-primary" id="btnAddProduct">
                    <i class="fa-solid fa-plus"></i> Add Product
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content Container -->
    <main class="main-container">

        <!-- Top Dashboard Summary Metric Cards -->
        <section class="stats-grid">
            <div class="stat-card" data-filter-target="all" title="Click to view all products">
                <div class="stat-info">
                    <h3>Total Products</h3>
                    <div class="stat-value"><?= $totalProducts ?></div>
                    <div class="stat-subtext">Cataloged items</div>
                </div>
                <div class="stat-icon-wrapper">
                    <i class="fa-solid fa-box"></i>
                </div>
            </div>

            <div class="stat-card" data-filter-target="all">
                <div class="stat-info">
                    <h3>Total Value</h3>
                    <div class="stat-value">₹<?= number_format($totalValue, 2) ?></div>
                    <div class="stat-subtext">Total inventory worth</div>
                </div>
                <div class="stat-icon-wrapper">
                    <i class="fa-solid fa-indian-rupee-sign"></i>
                </div>
            </div>

            <div class="stat-card" data-filter-target="lowstock" title="Click to filter Low Stock">
                <div class="stat-info">
                    <h3>Low Stock</h3>
                    <div class="stat-value"><?= $lowStockCount ?></div>
                    <div class="stat-subtext">&le; 5 units remaining</div>
                </div>
                <div class="stat-icon-wrapper">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
            </div>

            <div class="stat-card" data-filter-target="outofstock" title="Click to filter Out of Stock">
                <div class="stat-info">
                    <h3>Out of Stock</h3>
                    <div class="stat-value"><?= $outOfStockCount ?></div>
                    <div class="stat-subtext">0 units remaining</div>
                </div>
                <div class="stat-icon-wrapper">
                    <i class="fa-solid fa-circle-xmark"></i>
                </div>
            </div>
        </section>

        <!-- Controls Toolbar (Search & Filter) -->
        <section class="toolbar-panel">
            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="searchInput" class="search-input" placeholder="Search products by name, category, or description...">
            </div>

            <div class="filter-group">
                <select id="categoryFilter" class="custom-select">
                    <option value="all">All Categories</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= htmlspecialchars($cat) ?>"><?= htmlspecialchars($cat) ?></option>
                    <?php endforeach; ?>
                </select>

                <div class="status-pills">
                    <button type="button" class="pill-btn active" data-status="all">All</button>
                    <button type="button" class="pill-btn" data-status="instock">In Stock</button>
                    <button type="button" class="pill-btn" data-status="lowstock">Low Stock</button>
                    <button type="button" class="pill-btn" data-status="outofstock">Out of Stock</button>
                </div>

                <div class="view-toggle">
                    <button type="button" class="view-btn active" data-view="table" title="Table View">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    <button type="button" class="view-btn" data-view="grid" title="Grid View">
                        <i class="fa-solid fa-border-all"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- Products Display Panel -->
        <section class="inventory-panel">
            
            <!-- Table View -->
            <div id="tableViewContainer" class="table-responsive">
                <table class="product-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price (₹)</th>
                            <th>Stock Quantity</th>
                            <th>Stock Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody">
                        <?php foreach ($products as $p): 
                            $stock = intval($p['stock_quantity']);
                            $statusClass = $stock == 0 ? 'badge-outofstock' : ($stock <= 5 ? 'badge-lowstock' : 'badge-instock');
                            $statusText = $stock == 0 ? 'Out of Stock' : ($stock <= 5 ? 'Low Stock' : 'In Stock');
                            $statusKey = $stock == 0 ? 'outofstock' : ($stock <= 5 ? 'lowstock' : 'instock');
                        ?>
                            <tr data-id="<?= $p['id'] ?>" 
                                data-name="<?= htmlspecialchars(strtolower($p['name'])) ?>"
                                data-category="<?= htmlspecialchars($p['category']) ?>"
                                data-description="<?= htmlspecialchars(strtolower($p['description'])) ?>"
                                data-status="<?= $statusKey ?>">
                                <td>
                                    <div class="product-name-cell">
                                        <span class="product-title"><?= htmlspecialchars($p['name']) ?></span>
                                    </div>
                                </td>
                                <td><span class="card-category"><?= htmlspecialchars($p['category']) ?></span></td>
                                <td><span class="price-text">₹<?= number_format($p['price'], 2) ?></span></td>
                                <td>
                                    <div class="stock-adjuster">
                                        <form method="POST" action="index.php" style="display: inline;">
                                            <input type="hidden" name="action" value="update_stock">
                                            <input type="hidden" name="id" value="<?= $p['id'] ?>">
                                            <input type="hidden" name="delta" value="-1">
                                            <button type="submit" class="btn btn-secondary btn-icon-only btn-sm"><i class="fa-solid fa-minus"></i></button>
                                        </form>
                                        
                                        <span class="stock-count"><?= $stock ?></span>
                                        
                                        <form method="POST" action="index.php" style="display: inline;">
                                            <input type="hidden" name="action" value="update_stock">
                                            <input type="hidden" name="id" value="<?= $p['id'] ?>">
                                            <input type="hidden" name="delta" value="1">
                                            <button type="submit" class="btn btn-secondary btn-icon-only btn-sm"><i class="fa-solid fa-plus"></i></button>
                                        </form>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge <?= $statusClass ?>"><?= $statusText ?></span>
                                </td>
                                <td class="actions-cell">
                                    <button type="button" class="btn btn-secondary btn-icon-only btn-edit" 
                                            data-id="<?= $p['id'] ?>"
                                            data-name="<?= htmlspecialchars($p['name']) ?>"
                                            data-category="<?= htmlspecialchars($p['category']) ?>"
                                            data-price="<?= $p['price'] ?>"
                                            data-stock_quantity="<?= $p['stock_quantity'] ?>"
                                            data-description="<?= htmlspecialchars($p['description']) ?>"
                                            title="Edit">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button type="button" class="btn btn-danger btn-icon-only btn-delete" 
                                            data-id="<?= $p['id'] ?>"
                                            data-name="<?= htmlspecialchars($p['name']) ?>"
                                            title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Grid View -->
            <div id="gridViewContainer" class="product-grid" style="display: none;">
                <?php foreach ($products as $p): 
                    $stock = intval($p['stock_quantity']);
                    $statusClass = $stock == 0 ? 'badge-outofstock' : ($stock <= 5 ? 'badge-lowstock' : 'badge-instock');
                    $statusText = $stock == 0 ? 'Out of Stock' : ($stock <= 5 ? 'Low Stock' : 'In Stock');
                    $statusKey = $stock == 0 ? 'outofstock' : ($stock <= 5 ? 'lowstock' : 'instock');
                ?>
                    <div class="product-card"
                         data-id="<?= $p['id'] ?>" 
                         data-name="<?= htmlspecialchars(strtolower($p['name'])) ?>"
                         data-category="<?= htmlspecialchars($p['category']) ?>"
                         data-description="<?= htmlspecialchars(strtolower($p['description'])) ?>"
                         data-status="<?= $statusKey ?>">
                        <div>
                            <div class="card-header">
                                <span class="card-category"><?= htmlspecialchars($p['category']) ?></span>
                                <span class="badge <?= $statusClass ?>"><?= $statusText ?></span>
                            </div>
                            <h3 class="card-title"><?= htmlspecialchars($p['name']) ?></h3>
                            <p class="card-desc"><?= htmlspecialchars($p['description'] ?: 'No description.') ?></p>
                        </div>
                        <div>
                            <div class="card-meta">
                                <span class="price-text" style="font-size: 18px;">₹<?= number_format($p['price'], 2) ?></span>
                                <div class="stock-adjuster">
                                    <form method="POST" action="index.php" style="display: inline;">
                                        <input type="hidden" name="action" value="update_stock">
                                        <input type="hidden" name="id" value="<?= $p['id'] ?>">
                                        <input type="hidden" name="delta" value="-1">
                                        <button type="submit" class="btn btn-secondary btn-icon-only btn-sm"><i class="fa-solid fa-minus"></i></button>
                                    </form>
                                    
                                    <span class="stock-count"><?= $stock ?></span>
                                    
                                    <form method="POST" action="index.php" style="display: inline;">
                                        <input type="hidden" name="action" value="update_stock">
                                        <input type="hidden" name="id" value="<?= $p['id'] ?>">
                                        <input type="hidden" name="delta" value="1">
                                        <button type="submit" class="btn btn-secondary btn-icon-only btn-sm"><i class="fa-solid fa-plus"></i></button>
                                    </form>
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="button" class="btn btn-secondary btn-sm btn-edit" 
                                        data-id="<?= $p['id'] ?>"
                                        data-name="<?= htmlspecialchars($p['name']) ?>"
                                        data-category="<?= htmlspecialchars($p['category']) ?>"
                                        data-price="<?= $p['price'] ?>"
                                        data-stock_quantity="<?= $p['stock_quantity'] ?>"
                                        data-description="<?= htmlspecialchars($p['description']) ?>">
                                    <i class="fa-solid fa-pen"></i> Edit
                                </button>
                                <button type="button" class="btn btn-danger btn-sm btn-delete" 
                                        data-id="<?= $p['id'] ?>"
                                        data-name="<?= htmlspecialchars($p['name']) ?>">
                                    <i class="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="empty-state" style="display: none;">
                <i class="fa-solid fa-box-open"></i>
                <h3>No Products Found</h3>
                <p>No products match your search query or filter selection.</p>
            </div>

        </section>

    </main>

    <!-- Modal Dialog: Add / Edit Product -->
    <dialog id="productModal" class="modal">
        <div class="modal-header">
            <h2 id="modalTitle">Add New Product</h2>
            <button type="button" class="modal-close">&times;</button>
        </div>
        <form method="POST" action="index.php" id="productForm">
            <input type="hidden" name="action" id="formAction" value="add">
            <input type="hidden" name="id" id="productId">
            <div class="modal-body">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="modalProductName">Product Name *</label>
                        <input type="text" name="name" id="modalProductName" class="form-control" required placeholder="e.g. Ergonomic Desk Chair">
                    </div>

                    <div class="form-group">
                        <label for="modalCategorySelect">Category *</label>
                        <select name="category" id="modalCategorySelect" class="form-control" required>
                            <option value="Electronics">Electronics</option>
                            <option value="Apparel">Apparel</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Books">Books</option>
                            <option value="Groceries">Groceries</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="modalPrice">Price (₹) *</label>
                        <input type="number" step="0.01" min="0" name="price" id="modalPrice" class="form-control" required placeholder="0.00">
                    </div>

                    <div class="form-group">
                        <label for="modalStockQuantity">Stock Quantity *</label>
                        <input type="number" min="0" name="stock_quantity" id="modalStockQuantity" class="form-control" required placeholder="0">
                    </div>

                    <div class="form-group full-width">
                        <label for="modalDescription">Description</label>
                        <textarea name="description" id="modalDescription" class="form-control" placeholder="Enter product details..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-cancel">Cancel</button>
                <button type="submit" class="btn btn-primary" id="btnSaveProduct">Save Product</button>
            </div>
        </form>
    </dialog>

    <!-- Modal Dialog: Delete Confirmation -->
    <dialog id="deleteModal" class="modal">
        <div class="modal-header">
            <h2>Confirm Delete</h2>
            <button type="button" class="modal-close">&times;</button>
        </div>
        <form method="POST" action="index.php">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" id="deleteProductId">
            <div class="modal-body">
                <p>Are you sure you want to delete <strong id="deleteProductName">this product</strong>?</p>
                <p style="color: var(--text-muted); font-size: 13px; margin-top: 6px;">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-cancel">Cancel</button>
                <button type="submit" class="btn btn-danger">Delete Product</button>
            </div>
        </form>
    </dialog>

    <!-- Toast Notifications Container -->
    <div id="toastContainer" class="toast-container">
        <?php if (!empty($toastMsg)): ?>
            <div class="toast toast-<?= $toastType ?>">
                <span><?= htmlspecialchars($toastMsg) ?></span>
            </div>
        <?php endif; ?>
    </div>

    <!-- Application Script -->
    <script src="js/app.js"></script>
</body>
</html>
