<?php
/**
 * EloMak - Receptor Oficial de Pagamentos Mercado Pago
 * Subdomínio: https://elomak.grupoeloizio.com.br
 * Recebe do Hub Centralizado: webhook.grupoeloizio.com.br/webhook/mercadopago
 * 
 * Atualiza status da Ordem de Serviço para "Pago" / "Finalizada",
 * baixa contas a receber e registra movimentação no fluxo de caixa.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';

// Validar Secret do Webhook Central
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

$osId = 0;
if (preg_match('/(?:elomak_os_|os_)(\d+)/', $externalRef, $matches)) {
    $osId = (int)$matches[1];
}

try {
    $db = Database::getConnection();

    // Se temos o ID da OS, atualiza a Ordem de Serviço
    if ($osId > 0) {
        $stmt = $db->prepare("
            UPDATE ordem_servico 
            SET status = 'Finalizada', 
                valor_total = CASE WHEN valor_total <= 0 THEN ? ELSE valor_total END,
                atualizado_em = datetime('now')
            WHERE id = ?
        ");
        $stmt->execute([$amount, $osId]);

        // Registrar no contas_receber como quitado
        $stmtCR = $db->prepare("
            UPDATE contas_receber 
            SET status = 'recebido', 
                valor_recebido = valor, 
                data_recebimento = date('now')
            WHERE os_id = ?
        ");
        $stmtCR->execute([$osId]);

        // Inserir registro no fluxo de caixa
        $stmtCaixa = $db->prepare("
            INSERT INTO fluxo_caixa (usuario_id, tipo, descricao, valor, categoria, metodo_pagamento, referencia_id, data_movimento)
            VALUES (1, 'entrada', ?, ?, 'Serviço de Oficina / Peças', 'Mercado Pago (Pix/Cartão)', ?, date('now'))
        ");
        $stmtCaixa->execute(['Recebimento OS #' . $osId . ' via Mercado Pago', $amount, $paymentId]);
    }

    echo json_encode([
        'success' => true,
        'sistema' => 'EloMak',
        'os_id' => $osId,
        'status_os' => 'Finalizada',
        'transacao_mp' => $paymentId,
        'valor' => $amount,
        'mensagem' => 'Pagamento baixado com sucesso no ERP da Oficina EloMak'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao processar baixa no EloMak: ' . $e->getMessage()]);
}
