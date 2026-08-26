<?php
/**
 * PHP Main Application Entry Point
 * Inventory Management System
 */

require_once __DIR__ . '/database.php';
initDatabase();

include __DIR__ . '/index.html';
