<?php
/**
 * EloContábil - Configurações Gerais
 * Subdomínio Oficial: elocontabil.grupoeloizio.com.br
 * Diretório Raiz: /elocontabil/
 * Grupo Eloizio • Apoio Administrativo & RH Sem Necessidade de CRC
 */

declare(strict_types=1);

// Ambiente e Fuso Horário
date_default_timezone_set('America/Sao_Paulo');

// Constantes de Diretórios
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('CONFIG_PATH', ROOT_PATH . '/config');
define('PUBLIC_PATH', ROOT_PATH . '/public');
define('STORAGE_PATH', ROOT_PATH . '/storage');

// Subdomínio e URLs
define('SUBDOMAIN', 'elocontabil.grupoeloizio.com.br');
define('BASE_URL', 'https://' . SUBDOMAIN);

// Conexão Obrigatória com o Webhook Centralizado
define('CENTRAL_WEBHOOK_URL', 'https://webhook.grupoeloizio.com.br');
define('WEBHOOK_SECRET', 'eloizio_secret_123');

// Camilla Faria - Atendente Oficial e Gerente Geral
define('CAMILLA_PHONE', '21996134073');
define('CAMILLA_EMAIL', 'camilla@grupoeloizio.com.br');
define('CAMILLA_NAME', 'Camilla Faria');
define('CAMILLA_ROLE', 'Gerente Geral do Grupo Eloizio & Atendente Inteligente');
define('CONTADOR_RESPONSAVEL_EMAIL', 'contabilidade@grupoeloizio.com.br');

// Disclaimer Jurídico Obrigatório (Regra de Ouro)
define('LEGAL_DISCLAIMER', 'EloContábil é apoio administrativo, não substitui seu contador responsável.');

// Criar diretórios de armazenamento se não existirem
$directoriesToEnsure = [
    STORAGE_PATH,
    STORAGE_PATH . '/cofre',
    STORAGE_PATH . '/holerites',
    STORAGE_PATH . '/documentos_temp',
    STORAGE_PATH . '/logs',
];

foreach ($directoriesToEnsure as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}
