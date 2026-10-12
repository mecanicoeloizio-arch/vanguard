<?php
/**
 * Hub Centralizado de Webhooks • Grupo Eloizio
 * Subdomínio: webhook.grupoeloizio.com.br
 * Roteamento para EloMak, EloSign e EduVanguard
 */

declare(strict_types=1);

define('WEBHOOK_SECRET', 'eloizio_secret_123');

// Mapeamento de destinos internos
define('ELOMAK_WEBHOOK_RECEIVER', 'https://elomak.grupoeloizio.com.br/api/webhook_receiver.php');
define('ELOSIGN_WEBHOOK_RECEIVER', 'https://elosign.grupoeloizio.com.br/api.php?action=webhook');
define('VANGUARD_WEBHOOK_RECEIVER', 'https://eduvanguard.grupoeloizio.com.br/api/webhook');
define('ELOCONTABIL_WEBHOOK_RECEIVER', 'https://elocontabil.grupoeloizio.com.br/api/webhook_receiver.php');

// Configurações da Evolution API / Z-API Oficial
define('EVOLUTION_API_URL', 'https://zap.grupoeloizio.com.br');
define('EVOLUTION_GLOBAL_KEY', 'B6D711FCDE4D4FD5936544120E713976');
