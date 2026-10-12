<?php
/**
 * Roteador Central de Webhooks • Aliasing & Redirecionamento Inteligente
 * Subdomínio: https://webhook.grupoeloizio.com.br
 * 
 * Aponta e unifica a execução com o diretório raiz /webhook/public/index.php
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/webhook/public/index.php';
