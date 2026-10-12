<?php
/**
 * EloMak - Configurações Gerais do Sistema
 * Subdomínio Oficial: https://elomak.grupoeloizio.com.br
 * Grupo Eloizio 2026 • PHP 8.3 Puro MVC
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

date_default_timezone_set('America/Sao_Paulo');

// URLs e Domínios
define('BASE_URL', 'https://elomak.grupoeloizio.com.br');
define('APP_NAME', 'EloMak - Gestão Inteligente para Oficinas');
define('APP_VERSION', '1.0.0');

// REGRA DE OURO 3: WEBHOOK CENTRALIZADO OBRIGATÓRIO
define('CENTRAL_WEBHOOK_URL', 'https://webhook.grupoeloizio.com.br');
define('WEBHOOK_SECRET', 'eloizio_secret_123');

// Diretórios Físicos
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('PUBLIC_PATH', ROOT_PATH . '/public');
define('STORAGE_PATH', ROOT_PATH . '/storage');
define('CONFIG_PATH', ROOT_PATH . '/config');

// Garantir diretório de storage para uploads e logs
if (!is_dir(STORAGE_PATH)) {
    @mkdir(STORAGE_PATH, 0755, true);
    @mkdir(STORAGE_PATH . '/uploads', 0755, true);
    @mkdir(STORAGE_PATH . '/logs', 0755, true);
}

// Helpers de Sessão e CSRF
function isAuthenticated(): bool
{
    return isset($_SESSION['elomak_usuario']) && !empty($_SESSION['elomak_usuario']['id']);
}

function getLoggedUser(): ?array
{
    return $_SESSION['elomak_usuario'] ?? null;
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

function jsonResponse(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
