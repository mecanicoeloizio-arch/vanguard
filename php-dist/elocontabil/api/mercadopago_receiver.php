<?php
/**
 * EloContábil - Receptor Oficial de Pagamentos Mercado Pago
 * Subdomínio: https://elocontabil.grupoeloizio.com.br
 * Recebe do Hub Centralizado: webhook.grupoeloizio.com.br/webhook/mercadopago
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';

$secretHeader = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? '';
$secretQuery = $_GET['secret'] ?? '';

if ($secretHeader !== WEBHOOK_SECRET && $secretQuery !== WEBHOOK_SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Acesso negado: Secret do webhook central inválido']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

$externalRef = (string)($data['external_reference'] ?? '');
$paymentId = (string)($data['payment_id'] ?? '');
$status = (string)($data['status'] ?? 'approved');
$amount = (float)($data['amount'] ?? 0.0);
$payer = (array)($data['payer'] ?? []);

try {
    $db = Database::getConnection();

    // Ativar ou renovar plano da empresa
    $payerPhone = preg_replace('/[^0-9]/', '', (string)($payer['phone'] ?? ''));
    if ($payerPhone) {
        $stmt = $db->prepare("
            UPDATE usuarios_contabil 
            SET criado_em = CURRENT_TIMESTAMP
            WHERE whatsapp LIKE ?
        ");
        $stmt->execute(['%' . substr($payerPhone, -8) . '%']);
    }

    echo json_encode([
        'success' => true,
        'sistema' => 'EloContábil',
        'transacao_mp' => $paymentId,
        'valor' => $amount,
        'mensagem' => 'Plano do EloContábil ativado com sucesso!'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao processar ativação no EloContábil: ' . $e->getMessage()]);
}
