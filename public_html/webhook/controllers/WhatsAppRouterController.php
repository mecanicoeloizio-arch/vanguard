<?php
/**
 * Hub Centralizado • Router Inteligente WhatsApp (Evolution API / Z-API)
 * Grupo Eloizio 2026
 * 
 * Recebe todos os eventos de mensagens e distribui para os projetos:
 * - Se destinatário/instância ou contexto for Oficina Mecânica -> EloMak
 * - Se for Contábil/RH/Ponto/Holerite -> EloContábil
 * - Se for Assinatura/Contrato -> EloSign
 * - Se for Atendimento Geral ou Dúvida -> Camilla Central Engine
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/whatsapp.php';
require_once __DIR__ . '/CamillaCentralController.php';

class WhatsAppRouterController {
    public static function processarWebhook(array $payload, string $rawInput): array {
        $db = CentralDatabase::getConnection();

        // 1. Extração padronizada de dados da mensagem WhatsApp
        $sender = (string)(
            $payload['data']['key']['remoteJid'] 
            ?? $payload['sender'] 
            ?? $payload['phone'] 
            ?? $payload['from'] 
            ?? ''
        );
        $cleanPhone = preg_replace('/[^0-9]/', '', $sender);

        $messageText = (string)(
            $payload['data']['message']['conversation'] 
            ?? $payload['data']['message']['extendedTextMessage']['text'] 
            ?? $payload['text'] 
            ?? $payload['message'] 
            ?? ''
        );

        $instance = (string)($payload['instance'] ?? 'camilla_eloizio_01');

        // Se for mensagem enviada pelo próprio bot, ignorar para evitar looping
        $fromMe = $payload['data']['key']['fromMe'] ?? false;
        if ($fromMe) {
            return ['status' => 'ignored', 'reason' => 'from_me'];
        }

        if (empty(trim($messageText))) {
            return ['status' => 'ignored', 'reason' => 'empty_text'];
        }

        // 2. Análise de Destino e Palavras-Chave
        $textLower = mb_strtolower(trim($messageText), 'UTF-8');
        $targetProject = 'camilla_central';
        $targetUrl = null;

        // Se mensagem indica EloMak (placa, os, oficina mecânica específica)
        if (preg_match('/[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/i', $messageText) || str_starts_with($textLower, 'elomak') || $textLower === '1' || $textLower === '2' || $textLower === '3') {
            $targetProject = 'elomak';
            $targetUrl = ELOMAK_WEBHOOK_RECEIVER;
        }
        // Se mensagem indica EloContábil (ponto, holerite, rh, alvará)
        elseif (str_contains($textLower, 'elocontabil') || str_contains($textLower, 'holerite') || str_contains($textLower, 'ponto') || str_contains($textLower, 'aso') || str_contains($textLower, 'epi')) {
            $targetProject = 'elocontabil';
            $targetUrl = ELOCONTABIL_WEBHOOK_RECEIVER;
        }
        // Se mensagem indica EloSign
        elseif (str_contains($textLower, 'elosign') || str_contains($textLower, 'assinar') || str_contains($textLower, 'rubrica')) {
            $targetProject = 'elosign';
            $targetUrl = ELOSIGN_WEBHOOK_RECEIVER;
        }

        // 3. Encaminhamento via cURL com X-Webhook-Secret para o subsistema
        if ($targetUrl) {
            $ch = curl_init($targetUrl);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $rawInput ?: json_encode($payload),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'X-Webhook-Secret: ' . WEBHOOK_SECRET,
                    'X-Forwarded-By: Central-Webhook-Hub',
                    'X-Target-Project: ' . $targetProject
                ],
                CURLOPT_TIMEOUT => 15,
                CURLOPT_SSL_VERIFYPEER => false
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Gravar auditoria
            $stmt = $db->prepare("INSERT INTO webhook_logs (origem, endpoint, payload, http_status, repassado_para) VALUES ('evolution', '/webhook/whatsapp', ?, ?, ?)");
            $stmt->execute([$rawInput ?: json_encode($payload), $httpCode, $targetUrl]);

            return [
                'success' => true,
                'routed_to' => $targetProject,
                'target_url' => $targetUrl,
                'http_status' => $httpCode,
                'response_preview' => substr((string)$response, 0, 150),
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }

        // 4. Se não for específico de um sub-app, Camilla Central atende!
        $resultadoCamilla = CamillaCentralController::processarMensagem($cleanPhone, $messageText, 'whatsapp');

        // Enviar resposta de volta pelo WhatsApp usando Evolution API
        if (!empty($resultadoCamilla['resposta'])) {
            WhatsAppCentralAdapter::enviarMensagem($cleanPhone, $resultadoCamilla['resposta'], $instance);
        }

        return [
            'success' => true,
            'routed_to' => 'CamillaCentral',
            'atendente' => 'Camilla Faria',
            'response' => $resultadoCamilla['resposta'],
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}
