<?php
/**
 * RESTful API Endpoint Controller
 * Inventory Management System
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

$pdo = getDbConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? '';

function getJsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? $_POST;
}

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("SELECT * FROM products ORDER BY updated_at DESC");
            $products = $stmt->fetchAll();
            
            foreach ($products as &$p) {
                $p['price'] = (float)$p['price'];
                $p['stock'] = (int)$p['stock'];
            }
            
            $catStmt = $pdo->query("SELECT DISTINCT category FROM products UNION SELECT name as category FROM categories ORDER BY category ASC");
            $categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

            echo json_encode([
                'success' => true,
                'products' => $products,
                'categories' => array_values(array_filter($categories))
            ]);
            break;

        case 'create':
            $data = getJsonInput();
            
            $name = trim($data['name'] ?? '');
            $sku = trim($data['sku'] ?? '');
            $category = trim($data['category'] ?? '');
            $price = isset($data['price']) ? (float)$data['price'] : 0.0;
            $stock = isset($data['stock']) ? (int)$data['stock'] : 0;
            $description = trim($data['description'] ?? '');
            $id = trim($data['id'] ?? ('prod-' . time() . '-' . rand(100, 999)));

            if (empty($name) || empty($category)) {
                echo json_encode(['success' => false, 'error' => 'Product Name and Category are required fields.']);
                exit;
            }

            if (empty($sku)) {
                $sku = 'SKU-' . strtoupper(substr(preg_replace('/[^a-zA-Z0-9]/', '', $category), 0, 4)) . '-' . rand(100, 999);
            }

            if ($price < 0 || $stock < 0) {
                echo json_encode(['success' => false, 'error' => 'Price and Stock Quantity cannot be negative.']);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO products (id, sku, name, description, price, stock, category, created_at, updated_at) VALUES (:id, :sku, :name, :description, :price, :stock, :category, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");
            $stmt->execute([
                ':id' => $id,
                ':sku' => $sku,
                ':name' => $name,
                ':description' => $description,
                ':price' => $price,
                ':stock' => $stock,
                ':category' => $category
            ]);

            $catCheck = $pdo->prepare("INSERT OR IGNORE INTO categories (name, slug) VALUES (:name, :slug)");
            $catCheck->execute([':name' => $category, ':slug' => strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $category))]);

            echo json_encode([
                'success' => true,
                'message' => 'Product created successfully!',
                'product' => [
                    'id' => $id,
                    'sku' => $sku,
                    'name' => $name,
                    'description' => $description,
                    'price' => $price,
                    'stock' => $stock,
                    'category' => $category
                ]
            ]);
            break;

        case 'update':
            $data = getJsonInput();
            $id = trim($data['id'] ?? '');

            if (empty($id)) {
                echo json_encode(['success' => false, 'error' => 'Product ID is required for update.']);
                exit;
            }

            $name = trim($data['name'] ?? '');
            $sku = trim($data['sku'] ?? '');
            $category = trim($data['category'] ?? '');
            $price = isset($data['price']) ? (float)$data['price'] : 0.0;
            $stock = isset($data['stock']) ? (int)$data['stock'] : 0;
            $description = trim($data['description'] ?? '');

            if (empty($name) || empty($category)) {
                echo json_encode(['success' => false, 'error' => 'Product Name and Category are required.']);
                exit;
            }

            if ($price < 0 || $stock < 0) {
                echo json_encode(['success' => false, 'error' => 'Price and Stock cannot be negative.']);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE products SET sku = :sku, name = :name, description = :description, price = :price, stock = :stock, category = :category, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
            $stmt->execute([
                ':id' => $id,
                ':sku' => $sku,
                ':name' => $name,
                ':description' => $description,
                ':price' => $price,
                ':stock' => $stock,
                ':category' => $category
            ]);

            echo json_encode([
                'success' => true,
                'message' => 'Product updated successfully!'
            ]);
            break;

        case 'update_stock':
            $data = getJsonInput();
            $id = trim($data['id'] ?? '');
            
            if (empty($id)) {
                echo json_encode(['success' => false, 'error' => 'Product ID is required.']);
                exit;
            }

            if (isset($data['delta'])) {
                $delta = (int)$data['delta'];
                $stmt = $pdo->prepare("UPDATE products SET stock = MAX(0, stock + :delta), updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute([':id' => $id, ':delta' => $delta]);
            } else if (isset($data['stock'])) {
                $newStock = max(0, (int)$data['stock']);
                $stmt = $pdo->prepare("UPDATE products SET stock = :stock, updated_at = CURRENT_TIMESTAMP WHERE id = :id");
                $stmt->execute([':id' => $id, ':stock' => $newStock]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Provide delta or new stock value.']);
                exit;
            }

            $checkStmt = $pdo->prepare("SELECT stock FROM products WHERE id = :id");
            $checkStmt->execute([':id' => $id]);
            $updatedStock = (int)$checkStmt->fetchColumn();

            echo json_encode([
                'success' => true,
                'message' => 'Stock updated successfully!',
                'newStock' => $updatedStock
            ]);
            break;

        case 'delete':
            $data = getJsonInput();
            $id = trim($data['id'] ?? '');

            if (empty($id)) {
                echo json_encode(['success' => false, 'error' => 'Product ID is required for deletion.']);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
            $stmt->execute([':id' => $id]);

            echo json_encode([
                'success' => true,
                'message' => 'Product deleted successfully!'
            ]);
            break;

        case 'seed':
            initDatabase(true);
            echo json_encode([
                'success' => true,
                'message' => 'Database successfully reset to initial seed data!'
            ]);
            break;

        default:
            echo json_encode([
                'success' => false,
                'error' => 'Invalid or missing API action parameters.'
            ]);
            break;
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Server Exception: ' . $e->getMessage()
    ]);
}
