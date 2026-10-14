<?php
/**
 * Grupo Eloizio - Conexão e Gerenciador de Banco de Dados PDO (PHP 8.1+)
 * Suporte a MySQL, MariaDB e SQLite local automático
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): ?PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $driver = getenv('DB_DRIVER') ?: 'sqlite';
        $host = getenv('DB_HOST') ?: 'localhost';
        $port = getenv('DB_PORT') ?: '3306';
        $dbname = getenv('DB_DATABASE') ?: 'grupo_eloizio';
        $user = getenv('DB_USERNAME') ?: 'root';
        $pass = getenv('DB_PASSWORD') ?: '';

        try {
            if ($driver === 'mysql') {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
                self::$instance = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } else {
                // SQLite local embutido para portabilidade instantânea
                $sqliteFile = __DIR__ . '/data_grupo_eloizio.sqlite';
                $isNew = !file_exists($sqliteFile);
                self::$instance = new PDO("sqlite:{$sqliteFile}", null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);

                if ($isNew) {
                    self::initSqliteTables(self::$instance);
                }
            }
        } catch (Throwable $e) {
            error_log('Database connection error: ' . $e->getMessage());
            return null;
        }

        return self::$instance;
    }

    private static function initSqliteTables(PDO $db): void
    {
        $db->exec("
            CREATE TABLE IF NOT EXISTS system_modules (
                id TEXT PRIMARY KEY,
                slug TEXT UNIQUE,
                name TEXT,
                version TEXT,
                category TEXT,
                enabled INTEGER DEFAULT 1,
                is_core INTEGER DEFAULT 0,
                description TEXT,
                updated_at TEXT
            );

            CREATE TABLE IF NOT EXISTS payments_log (
                id TEXT PRIMARY KEY,
                order_id TEXT,
                title TEXT,
                amount REAL,
                method TEXT,
                status TEXT,
                payer_email TEXT,
                payer_name TEXT,
                created_at TEXT
            );

            CREATE TABLE IF NOT EXISTS cli_audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                command TEXT,
                status TEXT,
                output TEXT,
                executed_at TEXT
            );
        ");
    }
}
