<?php
/**
 * Database Auto-Initializer & Seeder
 * Inventory Management System
 */

require_once __DIR__ . '/config.php';

function initDatabase($forceReset = false) {
    $dbFileExists = file_exists(SQLITE_FILE);
    
    if (!$dbFileExists || $forceReset) {
        $pdo = getDbConnection();
        $schemaSql = file_get_contents(__DIR__ . '/schema.sql');
        
        if ($schemaSql) {
            $pdo->exec($schemaSql);
            return [
                'status' => 'success',
                'message' => 'Database initialized and seeded successfully.'
            ];
        } else {
            return [
                'status' => 'error',
                'message' => 'schema.sql file not found or empty.'
            ];
        }
    }
    
    return [
        'status' => 'info',
        'message' => 'Database already exists.'
    ];
}

initDatabase();

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === 'database.php') {
    header('Content-Type: application/json');
    $reset = isset($_GET['reset']) && $_GET['reset'] === '1';
    echo json_encode(initDatabase($reset));
}
