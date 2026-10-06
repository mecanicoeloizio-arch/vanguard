#!/usr/bin/env php
<?php
/**
 * ==============================================================================
 * EduVanguard - Instalador CLI (Linha de Comando via Terminal SSH / Contêiner)
 * Uso: php install-cli.php [opções]
 * ==============================================================================
 */

echo "\n\033[1;36m===============================================================\033[0m\n";
echo "\033[1;33m       EduVanguard - Instalador CLI (Hostinger KVM2 VPS)       \033[0m\n";
echo "\033[1;36m===============================================================\033[0m\n\n";

$rootPath = realpath(__DIR__);
$sqlFile = $rootPath . '/database.sql';
$envFile = $rootPath . '/.env';

if (!file_exists($sqlFile)) {
    echo "\033[0;31m[ERRO] Arquivo database.sql não encontrado na raiz!\033[0m\n";
    exit(1);
}

// Pergunta interativa no terminal
function prompt($question, $default = '') {
    $defStr = $default !== '' ? " [{$default}]" : '';
    echo "\033[1;32m{$question}{$defStr}: \033[0m";
    $handle = fopen("php://stdin", "r");
    $line = trim(fgets($handle));
    fclose($handle);
    return $line !== '' ? $line : $default;
}

echo "Configuração do Banco de Dados MySQL / MariaDB:\n";
$dbHost = prompt("Host do MySQL", "127.0.0.1");
$dbPort = prompt("Porta do MySQL", "3306");
$dbName = prompt("Nome do Banco de Dados", "eduvanguard_db");
$dbUser = prompt("Usuário do Banco", "root");
$dbPass = prompt("Senha do Banco", "");

echo "\nConectando ao MySQL e preparando o banco '{$dbName}'...\n";

try {
    $dsnNoDb = "mysql:host={$dbHost};port={$dbPort};charset=utf8mb4";
    $pdoInit = new PDO($dsnNoDb, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);

    $pdoInit->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "\033[0;32m[OK] Banco de dados '{$dbName}' validado/criado com sucesso!\033[0m\n";

    $dsnWithDb = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsnWithDb, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    echo "Importando estrutura e dados iniciais de 'database.sql'...\n";
    $sqlContent = file_get_contents($sqlFile);
    $pdo->exec($sqlContent);
    echo "\033[0;32m[OK] Tabelas e carga inicial importadas com sucesso!\033[0m\n\n";

} catch (Exception $e) {
    echo "\033[0;31m[ERRO DE BANCO] " . $e->getMessage() . "\033[0m\n";
    exit(1);
}

echo "Configurações Gerais do Sistema:\n";
$appUrl = prompt("URL da Aplicação", "http://localhost:3000");
$appPort = prompt("Porta do Servidor", "3000");
$geminiKey = prompt("Chave Gemini API (ou ENTER para pular)", "");
$adminEmail = prompt("E-mail do Administrador Geral", "carlos.mendes@direcao.eduvanguard.com.br");
$adminPass = prompt("Senha do Administrador", "vanguard123");

// Gerar arquivo .env
$envContent = "# =============================================================================\n" .
              "# EduVanguard - Variáveis de Ambiente de Produção\n" .
              "# Gerado via CLI em " . date('Y-m-d H:i:s') . "\n" .
              "# =============================================================================\n\n" .
              "NODE_ENV=production\n" .
              "PORT={$appPort}\n" .
              "APP_URL=\"{$appUrl}\"\n\n" .
              "# Gemini AI API Key\n" .
              "GEMINI_API_KEY=\"{$geminiKey}\"\n\n" .
              "# Banco de Dados Relacional\n" .
              "DB_HOST=\"{$dbHost}\"\n" .
              "DB_PORT={$dbPort}\n" .
              "DB_NAME=\"{$dbName}\"\n" .
              "DB_USER=\"{$dbUser}\"\n" .
              "DB_PASS=\"{$dbPass}\"\n\n" .
              "# Mercado Pago Sandbox / Live\n" .
              "MERCADO_PAGO_PUBLIC_KEY=\"APP_USR-sandbox-demo-key\"\n" .
              "MERCADO_PAGO_ACCESS_TOKEN=\"APP_USR-sandbox-demo-token\"\n" .
              "MERCADO_PAGO_WEBHOOK_SECRET=\"whsec_" . bin2hex(random_bytes(16)) . "\"\n\n" .
              "# Hash Salt LGPD\n" .
              "DATA_ENCRYPTION_SALT=\"" . bin2hex(random_bytes(24)) . "\"\n";

file_put_contents($envFile, $envContent);
echo "\033[0;32m[OK] Arquivo .env gerado com sucesso na raiz do projeto!\033[0m\n";

// Criar lock de instalação
@file_put_contents(__DIR__ . '/installer/installed.lock', json_encode([
    'installed_at' => date('c'),
    'installed_by' => $adminEmail,
    'method' => 'cli'
], JSON_PRETTY_PRINT));

echo "\n\033[1;32m===============================================================\033[0m\n";
echo "\033[1;32m       INSTALAÇÃO CONCLUÍDA COM SUCESSO!                       \033[0m\n";
echo "\033[1;32m===============================================================\033[0m\n\n";
echo "Para iniciar a aplicação dentro do contêiner Vanguard, execute:\n";
echo "  \033[1;33mnpm install\033[0m\n";
echo "  \033[1;33mnpm run build\033[0m\n";
echo "  \033[1;33mnpm run start\033[0m\n\n";
echo "Ou em background com PM2:\n";
echo "  \033[1;33npm2 start server.ts --name \"Vanguard\" --interpreter tsx\033[0m\n\n";
