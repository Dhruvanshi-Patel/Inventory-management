<?php
/**
 * Database Auto-Initializer
 * Inventory Management System
 */

require_once __DIR__ . '/db.php';

function init_database($forceReset = false) {
    $pdo = get_db_connection();
    
    // Check if products table exists AND already has data
    $hasData = false;
    try {
        $check = $pdo->query("SELECT COUNT(*) FROM products");
        if ($check !== false && intval($check->fetchColumn()) > 0) {
            $hasData = true;
        }
    } catch (Exception $e) {
        $hasData = false;
    }

    // Only create/seed database if data is missing OR if explicit reset is requested
    if (!$hasData || $forceReset) {
        if ($forceReset && $hasData) {
            try {
                $pdo->exec("DELETE FROM products");
            } catch (Exception $ex) {
                // Ignore
            }
        }

        $schema = file_get_contents(__DIR__ . '/schema.sql');
        if ($schema) {
            $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            if ($driver === 'sqlite') {
                $schema = str_replace('INT AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT', $schema);
                $schema = str_replace('ON UPDATE CURRENT_TIMESTAMP', '', $schema);
                $schema = str_replace('INSERT INTO products', 'INSERT OR IGNORE INTO products', $schema);
            } else {
                $schema = str_replace('INSERT OR IGNORE INTO products', 'INSERT IGNORE INTO products', $schema);
            }
            
            try {
                $pdo->exec($schema);
            } catch (Exception $e) {
                // Ignore duplicate errors if table already initialized
            }
        }
    }
}

// Auto-run once on load
init_database();
