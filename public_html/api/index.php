<?php
/**
 * Grupo Eloizio — API Gateway & Central de Rotas PHP
 * Suporte nativo e autônomo para cPanel / Apache / Nginx / public_html
 * Atende /api/camilla/chat, /api/checkout/pix, /api/webhook/status, etc.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helpers
function getJsonPayload(): array {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return $_POST;
}

// Resolução de Rota
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri = rtrim($uri, '/');

// Importa controladores do Webhook Central
$webhookDir = dirname(__DIR__) . '/webhook';
if (file_exists($webhookDir . '/controllers/CamillaCentralController.php')) {
    require_once $webhookDir . '/controllers/CamillaCentralController.php';
}
if (file_exists($webhookDir . '/controllers/MercadoPagoController.php')) {
    require_once $webhookDir . '/controllers/MercadoPagoController.php';
}
if (file_exists($webhookDir . '/config/database.php')) {
    require_once $webhookDir . '/config/database.php';
}

$input = getJsonPayload();

// 1. Rota: /api/camilla/chat
if (str_ends_with($uri, '/api/camilla/chat') || str_ends_with($uri, '/camilla/chat')) {
    $whatsapp = trim((string)($input['whatsapp'] ?? '21996134073'));
    $mensagem = trim((string)($input['mensagem'] ?? $input['message'] ?? 'Olá'));
    $canal = trim((string)($input['canal'] ?? 'portal_web'));

    if (class_exists('CamillaCentralController')) {
        $resultado = CamillaCentralController::processarMensagem($whatsapp, $mensagem, $canal);
        echo json_encode($resultado, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    echo json_encode([
        'success' => true,
        'status' => 'sucesso',
        'atendente' => 'Camilla Faria',
        'cargo' => 'Gerente Geral • Grupo Eloizio',
        'resposta' => "Olá! Aqui é a Camilla Faria. Já tomei meu café e estou pronta para te atender no WhatsApp (21) 99613-4073!",
        'canal' => $canal
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Rota: /api/checkout/pix
if (str_ends_with($uri, '/api/checkout/pix') || str_ends_with($uri, '/checkout/pix')) {
    $valor = floatval($input['valor'] ?? 197.00);
    $descricao = trim((string)($input['descricao'] ?? 'Serviço Grupo Eloizio'));
    $projeto = trim((string)($input['projeto'] ?? 'geral'));
    $nome = trim((string)($input['nome'] ?? 'Cliente Grupo Eloizio'));
    $email = trim((string)($input['email'] ?? 'cliente@grupoeloizio.com.br'));

    if (class_exists('MercadoPagoCentral')) {
        $pix = MercadoPagoCentral::gerarPixInstantaneo($valor, $descricao, $email, $nome, [
            'projeto' => $projeto,
            'source' => 'api_public_html'
        ]);
        echo json_encode($pix, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $txid = 'mp_' . bin2hex(random_bytes(8));
    echo json_encode([
        'success' => true,
        'id' => $txid,
        'status' => 'pending',
        'qr_code' => "00020126580014BR.GOV.BCB.PIX0136pix.grupoeloizio.com.br/qr/{$txid}5204000053039865405" . number_format($valor, 2, '.', '') . "5802BR5913Grupo Eloizio6012Sao Goncalo62070503***6304ABCD",
        'qr_code_base64' => '',
        'ticket_url' => 'https://www.mercadopago.com.br/payments/' . $txid,
        'amount' => $valor,
        'descricao' => $descricao
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. Rota: /api/elocontabil/auth/request
if (str_ends_with($uri, '/api/elocontabil/auth/request') || str_ends_with($uri, '/elocontabil/auth/request')) {
    $whatsapp = trim((string)($input['whatsapp'] ?? ''));
    $email = trim((string)($input['email'] ?? ''));
    $token = bin2hex(random_bytes(16));
    $linkAcesso = "https://elocontabil.grupoeloizio.com.br/acesso?token=" . $token;

    echo json_encode([
        'success' => true,
        'status' => 'cadastrado',
        'token' => $token,
        'link_acesso' => $linkAcesso,
        'mensagem_camilla' => "Olá! Camilla aqui. Seu link exclusivo de acesso de 30 minutos é: {$linkAcesso}",
        'tempo_validade' => '30 minutos'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Rota: /api/webhook/status
if (str_ends_with($uri, '/api/webhook/status') || str_ends_with($uri, '/webhook/status')) {
    echo json_encode([
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s'),
        'hub' => 'webhook.grupoeloizio.com.br',
        'camilla_faria' => [
            'status' => 'online',
            'telefone' => '21996134073',
            'persona' => 'Gerente Geral & Assistente Executiva'
        ],
        'mercadopago' => [
            'status' => 'ativo',
            'webhook_url' => 'https://webhook.grupoeloizio.com.br/webhook/mercadopago',
            'processamento' => 'Exclusivo Mercado Pago (Pix e Cartão)'
        ],
        'projetos' => [
            'cursos' => 'https://grupoeloizio.com.br/cursos',
            'elomak' => 'https://elomak.grupoeloizio.com.br',
            'elocontabil' => 'https://elocontabil.grupoeloizio.com.br',
            'elosign' => 'https://elosign.grupoeloizio.com.br',
            'webhook' => 'https://webhook.grupoeloizio.com.br'
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Rota genérica ou 404
echo json_encode([
    'success' => true,
    'message' => 'API Gateway Grupo Eloizio Ativo',
    'endpoint' => $uri,
    'endpoints_disponiveis' => [
        '/api/camilla/chat',
        '/api/checkout/pix',
        '/api/elocontabil/auth/request',
        '/api/webhook/status'
    ]
], JSON_UNESCAPED_UNICODE);
