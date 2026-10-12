<?php
/**
 * Hub Centralizado de Webhooks & Pagamentos • Grupo Eloizio
 * Subdomínio Oficial: webhook.grupoeloizio.com.br
 * Diretório Raiz: /webhook/
 * 
 * Centraliza:
 * 1. Webhook Evolution API / Z-API (WhatsApp Oficial 21 996134073)
 * 2. Webhook Mercado Pago & IPN (Pix, Cartão, Boleto, Checkout)
 * 3. Roteamento inteligente para EloMak, EloContábil, EloSign e Cursos
 * 4. Atendente Central Camilla Faria
 */

declare(strict_types=1);

// Ambiente e Segurança
define('CENTRAL_WEBHOOK_URL', 'https://webhook.grupoeloizio.com.br');
define('WEBHOOK_SECRET', 'eloizio_secret_123');
define('STORAGE_PATH', dirname(__DIR__) . '/storage');
define('LOGS_PATH', STORAGE_PATH . '/logs');

// Subdomínios e Destinos do Ecossistema Grupo Eloizio
define('URL_GRUPO_ELOIZIO', 'https://grupoeloizio.com.br');
define('URL_ELOMAK', 'https://elomak.grupoeloizio.com.br');
define('URL_ELOCONTABIL', 'https://elocontabil.grupoeloizio.com.br');
define('URL_ELOSIGN', 'https://elosign.grupoeloizio.com.br');
define('URL_ELOWA', 'https://elowa.grupoeloizio.com.br');

// Receivers internos de Webhook
define('ELOMAK_WEBHOOK_RECEIVER', URL_ELOMAK . '/api/webhook_receiver.php');
define('ELOMAK_MP_RECEIVER', URL_ELOMAK . '/api/mercadopago_receiver.php');
define('ELOCONTABIL_WEBHOOK_RECEIVER', URL_ELOCONTABIL . '/api/webhook_receiver.php');
define('ELOCONTABIL_MP_RECEIVER', URL_ELOCONTABIL . '/api/mercadopago_receiver.php');
define('ELOSIGN_WEBHOOK_RECEIVER', URL_ELOSIGN . '/api.php?action=webhook');
define('ELOSIGN_MP_RECEIVER', URL_ELOSIGN . '/api.php?action=mercadopago_callback');
define('CURSOS_MP_RECEIVER', URL_GRUPO_ELOIZIO . '/api/pagamento_aprovado.php');

// Credenciais Mercado Pago (Recebimentos Exclusivos Grupo Eloizio)
define('MP_ACCESS_TOKEN', getenv('MP_ACCESS_TOKEN') ?: 'APP_USR-704814245695-091012-7nu3j7s7zfqoacm5ra2ocu-eloizio');
define('MP_PUBLIC_KEY', getenv('MP_PUBLIC_KEY') ?: 'APP_USR-45218392-8812-4211-8893-eloiziomak');
define('MP_WEBHOOK_SECRET', getenv('MP_WEBHOOK_SECRET') ?: 'mp_whsec_eloizio_2026_safe');

// Evolution API / Z-API Oficial do Grupo Eloizio
define('EVOLUTION_API_URL', 'https://zap.grupoeloizio.com.br');
define('EVOLUTION_GLOBAL_KEY', 'B6D711FCDE4D4FD5936544120E713976');
define('WHATSAPP_CAMILLA_OFICIAL', '21996134073');
define('WHATSAPP_ELOIZIO_CEO', '21987648727');

// Configurações do Banco de Dados Centralizado
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_NAME', getenv('DB_NAME') ?: 'grupoeloizio_central');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
