<?php
/**
 * Grupo Eloizio - Configurações Gerais do Sistema (PHP 8.1+)
 * Site: grupoeloizio.com.br
 * WhatsApp Oficial: 21 996134073 (Camilla Faria - Gerente Geral)
 * WhatsApp CEO: 21 987648727 (Eloizio)
 */

declare(strict_types=1);

// Evita exibição de erros brutos em ambiente de produção
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Headers padrão para APIs REST JSON com suporte a CORS
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Signature, X-Request-Id');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configurações do Grupo Eloizio
define('GRUPO_ELOIZIO_NOME', 'Grupo Eloizio');
define('GRUPO_ELOIZIO_SITE', 'https://grupoeloizio.com.br');
define('GRUPO_ELOIZIO_WHATSAPP_CAMILLA', '21996134073');
define('GRUPO_ELOIZIO_WHATSAPP_CEO', '21987648727');
define('CAMILLA_CUPOM_PADRAO', 'CAMILLA15');
define('CAMILLA_DESCONTO_PERCENTUAL', 15);

// Configurações do Gateway Mercado Pago (Modo Produção Oficial)
define('MP_PUBLIC_KEY', getenv('MERCADOPAGO_PUBLIC_KEY') ?: 'APP_USR-9a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d');
define('MP_ACCESS_TOKEN', getenv('MERCADOPAGO_ACCESS_TOKEN') ?: 'APP_USR-7281928374659102-092916-d8f92a1b3c4e5f6a7b8c9d0e1f2a3b4c-192837465');
define('MP_WEBHOOK_SECRET', getenv('MERCADOPAGO_WEBHOOK_SECRET') ?: 'whsec_mp_grupoeloizio_live_secret');
define('MP_SANDBOX', getenv('MERCADOPAGO_SANDBOX') === 'true'); // false por padrão (Produção)

// Configurações da API de Inteligência Artificial Google Gemini
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');
define('GEMINI_MODEL_PRO', 'gemini-3.1-pro-preview');
define('GEMINI_MODEL_FLASH', 'gemini-3.8-flash');

/**
 * Retorna resposta padronizada em JSON e encerra execução
 */
function jsonResponse(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Captura e decodifica o payload JSON da requisição
 */
function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Saudação inteligente de acordo com o horário de Brasília
 */
function obterSaudacaoCamilla(): array
{
    $hora = (int)date('H');
    if ($hora >= 5 && $hora < 12) {
        return ['saudacao' => 'Bom dia', 'isManha' => true];
    }
    if ($hora >= 12 && $hora < 18) {
        return ['saudacao' => 'Boa tarde', 'isManha' => false];
    }
    return ['saudacao' => 'Boa noite', 'isManha' => false];
}
