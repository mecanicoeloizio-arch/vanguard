<?php
/**
 * Hub Centralizado • Camada de Banco de Dados Unificado (MySQL / SQLite)
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

class CentralDatabase {
    private static ?PDO $connection = null;

    public static function getConnection(): PDO {
        if (self::$connection !== null) {
            return self::$connection;
        }

        // 1. Tentar MySQL primeiro
        try {
            $dbHost = defined('DB_HOST') ? DB_HOST : 'localhost';
            $dbPort = defined('DB_PORT') ? (int)DB_PORT : 3306;
            $dbName = defined('DB_NAME') ? DB_NAME : 'grupoeloizio_central';
            $dbUser = defined('DB_USER') ? DB_USER : 'root';
            $dbPass = defined('DB_PASS') ? DB_PASS : '';

            // Tenta obter credenciais da Central Master se disponíveis
            $centralJson = dirname(__DIR__, 2) . '/database/central_config.json';
            if (file_exists($centralJson)) {
                $cData = json_decode(@file_get_contents($centralJson) ?: '', true);
                if (!empty($cData['database']['host'])) {
                    $dbHost = $cData['database']['host'];
                    $dbPort = (int)($cData['database']['port'] ?? 3306);
                    $dbName = $cData['database']['database'] ?? $dbName;
                    $dbUser = $cData['database']['user'] ?? $dbUser;
                    if (!empty($cData['database']['password']) && $cData['database']['password'] !== '••••••••••••') {
                        $dbPass = $cData['database']['password'];
                    }
                }
            }

            $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $dbHost, $dbPort, $dbName);
            self::$connection = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 2,
            ]);
            self::initMySqlTables(self::$connection);
            return self::$connection;
        } catch (Throwable $e) {
            // MySQL não conectou; prosseguir para SQLite com múltiplos caminhos
        }

        // 2. Fallback SQLite: Tentar múltiplos locais com permissão de escrita garantida
        $storageDir = defined('STORAGE_PATH') ? STORAGE_PATH : (__DIR__ . '/../storage');
        @mkdir($storageDir, 0777, true);

        $databaseDir = dirname(__DIR__, 2) . '/database';
        @mkdir($databaseDir, 0777, true);

        $tempDir = sys_get_temp_dir();

        $candidatos = [
            $storageDir . '/central_grupoeloizio.sqlite',
            $databaseDir . '/central_grupoeloizio.sqlite',
            $tempDir . '/central_grupoeloizio.sqlite',
            ':memory:',
        ];

        foreach ($candidatos as $sqlitePath) {
            try {
                if ($sqlitePath !== ':memory:') {
                    $dir = dirname($sqlitePath);
                    if (!is_dir($dir)) {
                        @mkdir($dir, 0777, true);
                    }
                    if (!is_writable($dir) && !file_exists($sqlitePath)) {
                        continue;
                    }
                }

                $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                self::$connection = $pdo;
                self::initSqliteTables(self::$connection);
                return self::$connection;
            } catch (Throwable $sqliteErr) {
                // Tenta o próximo candidato
                continue;
            }
        }

        // 3. Fallback infalível absoluto: SQLite em memória
        try {
            self::$connection = new PDO("sqlite::memory:", null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            self::initSqliteTables(self::$connection);
        } catch (Throwable $finalErr) {
            // Em caso extremo
        }

        return self::$connection;
    }

    private static function initSqliteTables(PDO $db): void {
        $db->exec("
            -- 1. Pagamentos Centralizados Mercado Pago
            CREATE TABLE IF NOT EXISTS pagamentos_centralizados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transacao_mp_id TEXT UNIQUE,
                projeto_origem TEXT NOT NULL, -- 'elomak', 'elocontabil', 'elosign', 'cursos', 'oficina'
                referencia_externa TEXT NOT NULL,
                pagador_nome TEXT,
                pagador_email TEXT,
                pagador_whatsapp TEXT,
                valor REAL NOT NULL,
                status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'refunded'
                metodo TEXT DEFAULT 'pix', -- 'pix', 'credit_card', 'ticket'
                link_pagamento TEXT,
                pix_copia_cola TEXT,
                pix_qr_base64 TEXT,
                notificado_camilla INTEGER DEFAULT 0,
                callback_projeto_status INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            -- 2. Clientes Unificados do Grupo Eloizio
            CREATE TABLE IF NOT EXISTS clientes_unificados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                whatsapp TEXT NOT NULL UNIQUE,
                email TEXT,
                nome TEXT NOT NULL,
                cpf TEXT,
                cidade TEXT DEFAULT 'São Gonçalo - RJ',
                tipo_perfil TEXT DEFAULT 'cliente', -- 'cliente_oficina', 'aluno_curso', 'empresa_contabil', 'parceiro_mecanico'
                projetos_ativos TEXT DEFAULT '[]', -- JSON dos projetos que utiliza
                total_gasto REAL DEFAULT 0.0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            -- 3. Interações & Log da Atendente Camila Faria
            CREATE TABLE IF NOT EXISTS interacoes_camilla (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                whatsapp TEXT NOT NULL,
                canal TEXT DEFAULT 'whatsapp', -- 'whatsapp', 'web_chat', 'email'
                projeto_direcionado TEXT DEFAULT 'central',
                mensagem_cliente TEXT NOT NULL,
                resposta_camilla TEXT NOT NULL,
                midia_anexo TEXT,
                diagnostico_ia TEXT,
                chamou_eloizio INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );

            -- 4. Registro de Webhooks Recebidos (Auditoria)
            CREATE TABLE IF NOT EXISTS webhook_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                origem TEXT NOT NULL, -- 'mercadopago', 'evolution', 'zapi', 'interno'
                endpoint TEXT NOT NULL,
                payload TEXT,
                http_status INTEGER,
                repassado_para TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            );
        ");
    }

    private static function initMySqlTables(PDO $db): void {
        $db->exec("
            CREATE TABLE IF NOT EXISTS `pagamentos_centralizados` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `transacao_mp_id` VARCHAR(100) UNIQUE,
                `projeto_origem` VARCHAR(50) NOT NULL,
                `referencia_externa` VARCHAR(100) NOT NULL,
                `pagador_nome` VARCHAR(150) NULL,
                `pagador_email` VARCHAR(150) NULL,
                `pagador_whatsapp` VARCHAR(30) NULL,
                `valor` DECIMAL(10,2) NOT NULL,
                `status` ENUM('pending', 'approved', 'rejected', 'refunded') DEFAULT 'pending',
                `metodo` VARCHAR(30) DEFAULT 'pix',
                `link_pagamento` TEXT NULL,
                `pix_copia_cola` TEXT NULL,
                `pix_qr_base64` LONGTEXT NULL,
                `notificado_camilla` TINYINT(1) DEFAULT 0,
                `callback_projeto_status` TINYINT(1) DEFAULT 0,
                `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `atualizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_proj (`projeto_origem`),
                INDEX idx_ref (`referencia_externa`),
                INDEX idx_status (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `clientes_unificados` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `whatsapp` VARCHAR(30) NOT NULL UNIQUE,
                `email` VARCHAR(150) NULL,
                `nome` VARCHAR(150) NOT NULL,
                `cpf` VARCHAR(20) NULL,
                `cidade` VARCHAR(100) DEFAULT 'São Gonçalo - RJ',
                `tipo_perfil` VARCHAR(50) DEFAULT 'cliente',
                `projetos_ativos` TEXT NULL,
                `total_gasto` DECIMAL(10,2) DEFAULT 0.00,
                `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `atualizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_zap (`whatsapp`),
                INDEX idx_mail (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `interacoes_camilla` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `whatsapp` VARCHAR(30) NOT NULL,
                `canal` VARCHAR(30) DEFAULT 'whatsapp',
                `projeto_direcionado` VARCHAR(50) DEFAULT 'central',
                `mensagem_cliente` TEXT NOT NULL,
                `resposta_camilla` LONGTEXT NOT NULL,
                `midia_anexo` VARCHAR(255) NULL,
                `diagnostico_ia` TEXT NULL,
                `chamou_eloizio` TINYINT(1) DEFAULT 0,
                `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_cam_zap (`whatsapp`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

            CREATE TABLE IF NOT EXISTS `webhook_logs` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `origem` VARCHAR(50) NOT NULL,
                `endpoint` VARCHAR(255) NOT NULL,
                `payload` LONGTEXT NULL,
                `http_status` INT NULL,
                `repassado_para` VARCHAR(255) NULL,
                `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    }
}
