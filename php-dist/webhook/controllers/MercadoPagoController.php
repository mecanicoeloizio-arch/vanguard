<?php
/**
 * Hub Centralizado • Controller de Recebimentos Mercado Pago
 * Grupo Eloizio 2026
 * 
 * Centraliza e orquestra pagamentos para:
 * - EloMak (Ordens de Serviço e Assinaturas de Oficina)
 * - EloContábil (Planos de Apoio Administrativo & RH)
 * - EloSign (Pacotes de Assinatura Eletrônica)
 * - Cursos Livres 100% Online (Matrículas imediatas)
 * - Oficina Mecânica e Peças de Máquinas de Costura
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/mercadopago.php';
require_once dirname(__DIR__) . '/config/whatsapp.php';

class MercadoPagoController {
    /**
     * Processa webhook oficial do Mercado Pago (IPN / Webhook v2)
     */
    public static function processarNotificacao(array $payload, array $queryParams): array {
        $db = CentralDatabase::getConnection();

        // 1. Log auditoria de recebimento
        $stmtLog = $db->prepare("INSERT INTO webhook_logs (origem, endpoint, payload, repassado_para) VALUES ('mercadopago', '/webhook/mercadopago', ?, ?)");
        $stmtLog->execute([json_encode(['payload' => $payload, 'query' => $queryParams]), 'Central Mercado Pago']);

        // 2. Extrair Payment ID (pode vir no corpo json ou via query ?topic=payment&id=123)
        $paymentId = (string)(
            $payload['data']['id'] 
            ?? $payload['id'] 
            ?? $queryParams['id'] 
            ?? $queryParams['data_id'] 
            ?? ''
        );

        $action = $payload['action'] ?? $queryParams['topic'] ?? 'payment';

        if (!$paymentId) {
            return [
                'success' => true,
                'message' => 'Notificação recebida, mas sem ID de pagamento para processar imediatamente.',
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }

        // 3. Consultar detalhes do pagamento na API oficial Mercado Pago
        $dadosMp = MercadoPagoAdapter::consultarPagamento($paymentId);

        $status = $dadosMp['status'] ?? ($payload['data']['status'] ?? 'approved');
        $valor = (float)($dadosMp['transaction_amount'] ?? ($payload['data']['transaction_amount'] ?? 0.00));
        $externalRef = (string)($dadosMp['external_reference'] ?? ($payload['data']['external_reference'] ?? ''));
        $payerEmail = $dadosMp['payer']['email'] ?? '';
        $payerName = trim(($dadosMp['payer']['first_name'] ?? '') . ' ' . ($dadosMp['payer']['last_name'] ?? ''));

        // Se for simulação ou não encontrou na API de produção
        if (!$externalRef && isset($payload['external_reference'])) {
            $externalRef = (string)$payload['external_reference'];
        }

        // 4. Identificar Projeto de Destino pelo prefixo da referência externa
        $projetoDestino = 'central';
        $forwardUrl = null;

        if (str_starts_with($externalRef, 'elomak_') || str_starts_with($externalRef, 'os_')) {
            $projetoDestino = 'elomak';
            $forwardUrl = ELOMAK_MP_RECEIVER;
        } elseif (str_starts_with($externalRef, 'elocontabil_') || str_starts_with($externalRef, 'rh_')) {
            $projetoDestino = 'elocontabil';
            $forwardUrl = ELOCONTABIL_MP_RECEIVER;
        } elseif (str_starts_with($externalRef, 'elosign_') || str_starts_with($externalRef, 'sign_')) {
            $projetoDestino = 'elosign';
            $forwardUrl = ELOSIGN_MP_RECEIVER;
        } elseif (str_starts_with($externalRef, 'curso_') || str_starts_with($externalRef, 'matricula_')) {
            $projetoDestino = 'cursos';
            $forwardUrl = CURSOS_MP_RECEIVER;
        } elseif (str_starts_with($externalRef, 'oficina_') || str_starts_with($externalRef, 'peca_')) {
            $projetoDestino = 'oficina';
            $forwardUrl = null;
        }

        // 5. Atualizar ou Registrar na Tabela Centralizada
        $stmtCheck = $db->prepare("SELECT * FROM pagamentos_centralizados WHERE transacao_mp_id = ? OR referencia_externa = ? LIMIT 1");
        $stmtCheck->execute([$paymentId, $externalRef]);
        $existente = $stmtCheck->fetch();

        $payerPhone = '';
        if ($existente) {
            $payerPhone = (string)($existente['pagador_whatsapp'] ?? '');
            if (!$payerName) $payerName = (string)($existente['pagador_nome'] ?? 'Cliente');
            if ($valor <= 0) $valor = (float)$existente['valor'];

            $stmtUp = $db->prepare("UPDATE pagamentos_centralizados SET status = ?, atualizado_em = datetime('now') WHERE id = ?");
            $stmtUp->execute([$status, $existente['id']]);
        } else {
            $stmtIns = $db->prepare("
                INSERT INTO pagamentos_centralizados 
                (transacao_mp_id, projeto_origem, referencia_externa, pagador_nome, pagador_email, valor, status, metodo)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pix')
            ");
            $stmtIns->execute([$paymentId, $projetoDestino, $externalRef ?: 'geral_' . $paymentId, $payerName ?: 'Cliente', $payerEmail, $valor, $status]);
        }

        // 6. Encaminhar para o sistema específico via cURL se aplicável
        $forwardResponse = null;
        if ($forwardUrl) {
            $ch = curl_init($forwardUrl);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode([
                    'event' => 'payment.updated',
                    'payment_id' => $paymentId,
                    'external_reference' => $externalRef,
                    'status' => $status,
                    'amount' => $valor,
                    'payer' => ['name' => $payerName, 'email' => $payerEmail, 'phone' => $payerPhone],
                    'secret' => WEBHOOK_SECRET
                ]),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'X-Webhook-Secret: ' . WEBHOOK_SECRET,
                    'X-Forwarded-By: GrupoEloizio-Central-MP'
                ],
                CURLOPT_TIMEOUT => 10,
                CURLOPT_SSL_VERIFYPEER => false
            ]);
            $forwardResponse = curl_exec($ch);
            curl_close($ch);
        }

        // 7. Ação da Camilla: Se status aprovado, enviar recibo carinhoso via WhatsApp!
        if (($status === 'approved' || $status === 'paid') && $payerPhone) {
            $msgCamilla = "🎉 *Olá " . ($payerName ?: 'amigo(a)') . "! Aqui é a Camilla Faria do Grupo Eloizio!*\n\n";
            $msgCamilla .= "☕ Passando para te avisar com muita alegria que seu pagamento via **Mercado Pago** no valor de *R$ " . number_format($valor, 2, ',', '.') . "* foi **CONFIRMADO COM SUCESSO**!\n\n";

            if ($projetoDestino === 'elomak') {
                $msgCamilla .= "🛠️ Sua Ordem de Serviço no **EloMak** foi baixada e nosso time técnico já está atualizando o sistema da oficina!\n";
            } elseif ($projetoDestino === 'elocontabil') {
                $msgCamilla .= "📊 Sua contratação no **EloContábil** está ativa! Nossa central de apoio e seu cofre de documentos já estão liberados.\n";
            } elseif ($projetoDestino === 'elosign') {
                $msgCamilla .= "✍️ Seus créditos no **EloSign** já estão disponíveis para assinaturas eletrônicas com validade jurídica!\n";
            } elseif ($projetoDestino === 'cursos') {
                $msgCamilla .= "🎓 Parabéns pela sua decisão de estudar! Seu acesso à plataforma de aulas, apostilas e manuais de bancada já foi liberado no portal.\n";
            } else {
                $msgCamilla .= "⚙️ Seu pedido no Grupo Eloizio foi processado e nosso estoque já está cuidando da separação!\n";
            }

            $msgCamilla .= "\nQualquer dúvida, conte sempre comigo por aqui! Tenha um dia abençoado e produtivo! ✨";

            WhatsAppCentralAdapter::enviarMensagem($payerPhone, $msgCamilla);

            // Atualizar notificado
            $db->exec("UPDATE pagamentos_centralizados SET notificado_camilla = 1 WHERE transacao_mp_id = " . $db->quote($paymentId));
        }

        return [
            'success' => true,
            'payment_id' => $paymentId,
            'status' => $status,
            'amount' => $valor,
            'project' => $projetoDestino,
            'forward_url' => $forwardUrl,
            'forward_result' => $forwardResponse ? substr((string)$forwardResponse, 0, 150) : 'none',
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}
