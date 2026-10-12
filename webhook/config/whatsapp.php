<?php
/**
 * Hub Centralizado • Adaptador WhatsApp (Evolution API / Z-API)
 * Grupo Eloizio 2026
 * Número Oficial: 21 996134073 (Camilla Faria)
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

class WhatsAppCentralAdapter {
    /**
     * Envia mensagem de texto via Evolution API
     */
    public static function enviarMensagem(string $numero, string $texto, string $instancia = 'camilla_eloizio_01'): array {
        $cleanNumber = preg_replace('/[^0-9]/', '', $numero);
        if (!$cleanNumber || empty(trim($texto))) {
            return ['success' => false, 'error' => 'Número ou texto vazio'];
        }

        // Formatar para padrão DDI 55
        if (strlen($cleanNumber) === 10 || strlen($cleanNumber) === 11) {
            $cleanNumber = '55' . $cleanNumber;
        }

        $endpoint = rtrim(EVOLUTION_API_URL, '/') . '/message/sendText/' . $instancia;
        $payload = [
            'number' => $cleanNumber,
            'options' => [
                'delay' => 1000,
                'presence' => 'composing',
            ],
            'textMessage' => [
                'text' => $texto,
            ]
        ];

        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'apikey: ' . EVOLUTION_GLOBAL_KEY
            ],
            CURLOPT_TIMEOUT => 8,
            CURLOPT_SSL_VERIFYPEER => false
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'success' => true,
            'routed' => 'Evolution API',
            'number' => $cleanNumber,
            'http_code' => $httpCode,
            'response' => $response ? json_decode($response, true) : null,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}
