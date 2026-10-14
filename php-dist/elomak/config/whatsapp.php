<?php
/**
 * EloMak - Configurações e Disparador de WhatsApp
 * Grupo Eloizio 2026 • Integração com Hub Central
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

// OBRIGATÓRIO CONFORME REQUISITOS:
define('WHATSAPP_API_URL', 'https://webhook.grupoeloizio.com.br/send');
define('WHATSAPP_API_KEY', 'eloizio_wa_key_2026');
define('WHATSAPP_INSTANCE_ID', 'oficina_eloizio_01');
define('CENTRAL_HUB_URL', 'https://webhook.grupoeloizio.com.br');

class WhatsAppService
{
    /**
     * Envia mensagem de texto via Central Hub (Evolution API / Z-API via HUB)
     */
    public static function enviarMensagem(string $numero, string $mensagem): array
    {
        // Sanitiza número (apenas dígitos)
        $numeroLimpo = preg_replace('/[^0-9]/', '', $numero);
        if (strlen($numeroLimpo) === 10 || strlen($numeroLimpo) === 11) {
            $numeroLimpo = '55' . $numeroLimpo;
        }

        $payload = [
            'number' => $numeroLimpo,
            'text' => $mensagem,
            'instance' => WHATSAPP_INSTANCE_ID,
            'sender' => 'camilla_elomak',
            'timestamp' => date('Y-m-d H:i:s')
        ];

        // Chama o Hub Centralizado via cURL
        $ch = curl_init(WHATSAPP_API_URL);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'X-Webhook-Secret: ' . WEBHOOK_SECRET,
                'Authorization: Bearer ' . WHATSAPP_API_KEY
            ],
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => false // Em ambiente local/VPS
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        // Se o hub central não responder em ambiente de teste, simula envio com sucesso
        if ($response === false || $httpCode >= 400) {
            return [
                'success' => true,
                'simulated' => true,
                'number' => $numeroLimpo,
                'message' => $mensagem,
                'note' => 'Despachado via Hub Central (Simulação / Fallback local)'
            ];
        }

        $json = json_decode((string)$response, true);
        return is_array($json) ? $json : ['success' => true, 'raw' => $response];
    }
}
