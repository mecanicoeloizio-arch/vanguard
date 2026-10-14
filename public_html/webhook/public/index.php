<?php
/**
 * Hub Central de Webhooks & Mercado Pago • Front Controller Oficial
 * Subdomínio: https://webhook.grupoeloizio.com.br
 * Diretório: /webhook/public/index.php
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Webhook-Secret, X-Forwarded-By');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/mercadopago.php';
require_once dirname(__DIR__) . '/config/whatsapp.php';
require_once dirname(__DIR__) . '/controllers/MercadoPagoController.php';
require_once dirname(__DIR__) . '/controllers/CamillaCentralController.php';
require_once dirname(__DIR__) . '/controllers/WhatsAppRouterController.php';

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

// Se for requisição para a interface Web do Dashboard
if ($uri === '/dashboard' || $uri === '/painel') {
    require_once __DIR__ . '/dashboard.php';
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// ROTA 1: Status Geral do Hub
if ($uri === '/' || $uri === '/status') {
    echo json_encode([
        'status' => 'online',
        'sistema' => 'Hub Centralizado de Webhooks & Pagamentos Mercado Pago',
        'dominio' => 'webhook.grupoeloizio.com.br',
        'atendente' => 'Camilla Faria (28 anos, Gerente Geral, 21 996134073)',
        'diretor_ceo' => 'Eloizio Assunção (21 987648727)',
        'destinos_conectados' => [
            'elomak' => ELOMAK_WEBHOOK_RECEIVER,
            'elocontabil' => ELOCONTABIL_WEBHOOK_RECEIVER,
            'elosign' => ELOSIGN_WEBHOOK_RECEIVER,
            'cursos' => CURSOS_MP_RECEIVER,
        ],
        'mercadopago' => [
            'status' => 'conectado',
            'modo' => 'exclusivo_pix_cartao',
            'webhook_receiver' => CENTRAL_WEBHOOK_URL . '/webhook/mercadopago'
        ],
        'evolution_whatsapp' => [
            'api_url' => EVOLUTION_API_URL,
            'instancia_padrao' => 'camilla_eloizio_01'
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 2: Webhook Mercado Pago (Notificações de Pagamentos Pix / Cartão)
if (strpos($uri, '/webhook/mercadopago') !== false || strpos($uri, '/mercadopago') !== false || strpos($uri, '/ipn') !== false) {
    $resultado = MercadoPagoController::processarNotificacao($data, $_GET);
    echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 3: Geração de Cobrança PIX Mercado Pago Unificada
if ($uri === '/checkout/pix' && $method === 'POST') {
    $projeto = (string)($data['projeto'] ?? 'central');
    $referencia = (string)($data['referencia'] ?? ('ref_' . time()));
    $valor = (float)($data['valor'] ?? 97.00);
    $descricao = (string)($data['descricao'] ?? 'Serviço Grupo Eloizio');
    $pagador = (array)($data['pagador'] ?? [
        'nome' => $data['nome'] ?? 'Cliente Eloizio',
        'email' => $data['email'] ?? 'pagamento@grupoeloizio.com.br',
        'whatsapp' => $data['whatsapp'] ?? '21996134073'
    ]);

    $resPix = MercadoPagoAdapter::criarCobrancaPix($projeto, $referencia, $valor, $descricao, $pagador);
    echo json_encode($resPix, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 4: Disparo de Mensagem WhatsApp (/send)
if ($uri === '/send' && $method === 'POST') {
    $secretHeader = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
    if ($secretHeader !== WEBHOOK_SECRET && ($_GET['secret'] ?? '') !== WEBHOOK_SECRET) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Acesso negado: Secret inválido']);
        exit;
    }

    $number = (string)($data['number'] ?? $data['numero'] ?? '');
    $text = (string)($data['text'] ?? $data['texto'] ?? $data['mensagem'] ?? '');
    $instance = (string)($data['instance'] ?? 'camilla_eloizio_01');

    $resSend = WhatsAppCentralAdapter::enviarMensagem($number, $text, $instance);
    echo json_encode($resSend, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 5: Camilla Faria Atendimento Inteligente API (/camilla/chat)
if ($uri === '/camilla/chat' && $method === 'POST') {
    $whatsapp = (string)($data['whatsapp'] ?? $data['telefone'] ?? '21996134073');
    $mensagem = (string)($data['mensagem'] ?? $data['message'] ?? 'Olá Camilla');
    $canal = (string)($data['canal'] ?? 'web_chat');

    $resCamilla = CamillaCentralController::processarMensagem($whatsapp, $mensagem, $canal);
    echo json_encode($resCamilla, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 6: Webhook Evolution / Z-API WhatsApp Geral (/webhook/evolution)
if (strpos($uri, '/webhook/evolution') !== false || strpos($uri, '/webhook/whatsapp') !== false || $uri === '/webhook') {
    $resRouter = WhatsAppRouterController::processarWebhook($data, $rawInput);
    echo json_encode($resRouter, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 7: Webhook EloContábil direto
if (strpos($uri, '/webhook/elocontabil') !== false) {
    $ch = curl_init(ELOCONTABIL_WEBHOOK_RECEIVER);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $rawInput ?: json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'X-Webhook-Secret: ' . WEBHOOK_SECRET,
            'X-Forwarded-By: Central-Webhook-Hub'
        ],
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo json_encode([
        'success' => true,
        'hub' => 'webhook.grupoeloizio.com.br',
        'forwarded_to' => ELOCONTABIL_WEBHOOK_RECEIVER,
        'http_status' => $httpCode,
        'response' => $res ? json_decode($res, true) : null
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 8: Histórico de Pagamentos Centralizados (Para Dashboard e Monitoramento)
if ($uri === '/api/pagamentos') {
    $db = CentralDatabase::getConnection();
    $stmt = $db->query("SELECT * FROM pagamentos_centralizados ORDER BY id DESC LIMIT 50");
    $pagamentos = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $pagamentos], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ROTA 9: Histórico de Interações da Camilla
if ($uri === '/api/interacoes') {
    $db = CentralDatabase::getConnection();
    $stmt = $db->query("SELECT * FROM interacoes_camilla ORDER BY id DESC LIMIT 50");
    $interacoes = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $interacoes], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// 404 Endpoint Não Encontrado
http_response_code(404);
echo json_encode(['error' => 'Endpoint não encontrado no Hub Central', 'uri' => $uri]);
