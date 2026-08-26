<?php
/**
 * Database Auto-Initializer
 * Inventory Management System
 */

require_once __DIR__ . '/db.php';

function init_database($forceReset = false) {
    $pdo = get_db_connection();
    
    // Check if products table exists
    $tableExists = false;
    try {
        $check = $pdo->query("SELECT 1 FROM products LIMIT 1");
        if ($check !== false) {
            $tableExists = true;
        }
    } catch (Exception $e) {
        $tableExists = false;
    }

    if (!$tableExists || $forceReset) {
        // Clear existing products table data when resetting to prevent duplicate entries
        if ($tableExists && $forceReset) {
            try {
                $pdo->exec("DELETE FROM products");
            } catch (Exception $ex) {
                // Ignore if error
            }
        }

        $schema = file_get_contents(__DIR__ . '/schema.sql');
        if ($schema) {
            $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            if ($driver === 'sqlite') {
                $schema = str_replace('INT AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT', $schema);
                $schema = str_replace('ON UPDATE CURRENT_TIMESTAMP', '', $schema);
                $schema = str_replace('INSERT INTO products', 'INSERT OR IGNORE INTO products', $schema);
            }
            $pdo->exec($schema);
        }
    }
}

init_database();
