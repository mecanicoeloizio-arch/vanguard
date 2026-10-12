<?php
/**
 * EloContábil - Webhook Receiver Oficial (Recebe do Webhook Central)
 * Subdomínio: https://elocontabil.grupoeloizio.com.br
 * Caminho: /elocontabil/api/webhook_receiver.php
 * Conexão obrigatória: webhook.grupoeloizio.com.br
 * Atendente: Camilla Faria
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';

// 1. Validação de Segurança do Secret do Hub Central
$incomingSecret = $_SERVER['HTTP_X_WEBHOOK_SECRET'] ?? $_GET['secret'] ?? '';
if ($incomingSecret !== WEBHOOK_SECRET) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Acesso negado: Secret inválido do Hub Central']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: $_POST;

// Log da requisição para auditoria interna
$logFile = STORAGE_PATH . '/logs/webhook_elocontabil_' . date('Y-m-d') . '.log';
@file_put_contents(
    $logFile,
    sprintf("[%s] Recebido do Hub: %s\n", date('H:i:s'), $rawInput),
    FILE_APPEND
);

// 2. Extração de Contato e Mensagem
$sender = $data['data']['key']['remoteJid'] 
    ?? $data['sender'] 
    ?? $data['phone'] 
    ?? $data['number'] 
    ?? $data['email']
    ?? '';

$phoneOrContact = preg_replace('/[^0-9]/', '', (string)$sender);
if (!$phoneOrContact && filter_var($sender, FILTER_VALIDATE_EMAIL)) {
    $phoneOrContact = trim((string)$sender);
}

$message = $data['data']['message']['conversation']
    ?? $data['data']['message']['extendedTextMessage']['text']
    ?? $data['text']
    ?? $data['message']
    ?? '';

$text = trim((string)$message);

if (!$phoneOrContact || !$text) {
    echo json_encode(['success' => false, 'notice' => 'Ignorado: sem texto ou contato']);
    exit;
}

$db = Database::getConnection();

// 3. Identifica se o contato já existe no cadastro de usuários
$stmtUser = $db->prepare("SELECT * FROM usuarios_contabil WHERE whatsapp = ? OR whatsapp = ? OR email = ?");
$stmtUser->execute([$phoneOrContact, substr($phoneOrContact, 2), $phoneOrContact]);
$usuarioExistente = $stmtUser->fetch();

// Busca o lead ativo mais recente
$stmtLead = $db->prepare("SELECT * FROM leads_triagem WHERE contato = ? ORDER BY id DESC LIMIT 1");
$stmtLead->execute([$phoneOrContact]);
$lead = $stmtLead->fetch();

$respostaParaEnviar = '';

// Se for usuário já cadastrado
if ($usuarioExistente) {
    // Gera token temporário de 30 minutos
    $token = bin2hex(random_bytes(16));
    $expiraEm = date('Y-m-d H:i:s', strtotime('+30 minutes'));

    $stmtToken = $db->prepare("
        INSERT INTO leads_triagem (contato, tipo_contato, servico_interesse, token_acesso, expira_em, status_triagem)
        VALUES (?, 'whatsapp', 'cliente_cadastrado', ?, ?, 'autorizado')
    ");
    $stmtToken->execute([$phoneOrContact, $token, $expiraEm]);

    $linkAcesso = BASE_URL . "/acesso/{$token}";

    $respostaParaEnviar = "Olá, {$usuarioExistente['nome']}! Aqui é a Camilla da Gerência do Grupo Eloizio ☕\n\n"
        . "Localizei o cadastro da sua empresa *{$usuarioExistente['empresa']}* no EloContábil.\n"
        . "Seu link seguro de acesso (válido por 30 minutos) está pronto:\n\n"
        . "👉 {$linkAcesso}\n\n"
        . "Deseja que eu envie o checklist do mês ou solicite algum documento para o seu contador agora?";
} else {
    // Contato novo: triagem da Camilla
    switch ($text) {
        case '1':
            $token = bin2hex(random_bytes(16));
            $expiraEm = date('Y-m-d H:i:s', strtotime('+30 minutes'));
            $stmtToken = $db->prepare("
                INSERT INTO leads_triagem (contato, tipo_contato, servico_interesse, token_acesso, expira_em, status_triagem)
                VALUES (?, 'whatsapp', 'rh_apoio', ?, ?, 'liberado_demonstracao')
            ");
            $stmtToken->execute([$phoneOrContact, $token, $expiraEm]);

            $linkAcesso = BASE_URL . "/acesso/{$token}";
            $respostaParaEnviar = "Excelente escolha! Nosso módulo de *RH de Apoio* organiza controle de ponto simples, ASO, uniformes, EPIs e checklist admissional sem complicação.\n\n"
                . "Liberei um link de acesso imediato válido por 30 minutos:\n"
                . "👉 {$linkAcesso}\n\n"
                . "☕ *Lembrete*: O EloContábil é apoio administrativo e não substitui seu contador responsável.";
            break;

        case '2':
            $token = bin2hex(random_bytes(16));
            $expiraEm = date('Y-m-d H:i:s', strtotime('+30 minutes'));
            $stmtToken = $db->prepare("
                INSERT INTO leads_triagem (contato, tipo_contato, servico_interesse, token_acesso, expira_em, status_triagem)
                VALUES (?, 'whatsapp', 'cofre_documentos', ?, ?, 'liberado_demonstracao')
            ");
            $stmtToken->execute([$phoneOrContact, $token, $expiraEm]);

            $linkAcesso = BASE_URL . "/acesso/{$token}";
            $respostaParaEnviar = "Perfeito! O *Cofre Administrativo* avisa alvarás vencendo e agenda lembretes de envio de documentos todo dia 28 para seu contador.\n\n"
                . "Acesse pelo seu link temporário de 30 minutos:\n"
                . "👉 {$linkAcesso}";
            break;

        case '3':
            $token = bin2hex(random_bytes(16));
            $expiraEm = date('Y-m-d H:i:s', strtotime('+30 minutes'));
            $stmtToken = $db->prepare("
                INSERT INTO leads_triagem (contato, tipo_contato, servico_interesse, token_acesso, expira_em, status_triagem)
                VALUES (?, 'whatsapp', 'central_camilla', ?, ?, 'liberado_demonstracao')
            ");
            $stmtToken->execute([$phoneOrContact, $token, $expiraEm]);

            $linkAcesso = BASE_URL . "/acesso/{$token}";
            $respostaParaEnviar = "Ótimo! Eu sou a Camilla Faria. Eu recebo os holerites e comprovantes por aqui e encaminho tudo mastigadinho por e-mail para seu contador responsável!\n\n"
                . "Seu link seguro:\n👉 {$linkAcesso}";
            break;

        default:
            $respostaParaEnviar = "Olá! Sou a Camilla Faria do Grupo Eloizio ☕\n"
                . "Vi que você entrou em contato com o *EloContábil* (Apoio Administrativo & RH que não precisa de CRC).\n\n"
                . "Qual área sua empresa precisa organizar hoje?\n"
                . "1️⃣ - RH de Apoio (Ponto, ASO, Uniformes, EPIs, Holerites)\n"
                . "2️⃣ - Administrativo & Cofre (Alvarás, Contratos, Agenda do Contador)\n"
                . "3️⃣ - Atendimento Direto Comigo (Camilla) para envio de documentos\n\n"
                . "Responda 1, 2 ou 3 para eu liberar seu link de acesso rápido!";
            break;
    }
}

// 4. Envia resposta via HUB Centralizado (cURL para /send)
$chSend = curl_init(rtrim(CENTRAL_WEBHOOK_URL, '/') . '/send');
curl_setopt_array($chSend, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'number' => $phoneOrContact,
        'text' => $respostaParaEnviar,
        'instance' => 'elocontabil_camilla'
    ]),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-Webhook-Secret: ' . WEBHOOK_SECRET
    ],
    CURLOPT_TIMEOUT => 8,
    CURLOPT_SSL_VERIFYPEER => false
]);
$hubResponse = curl_exec($chSend);
curl_close($chSend);

echo json_encode([
    'success' => true,
    'subdomain' => SUBDOMAIN,
    'sender' => $phoneOrContact,
    'reply_prepared' => $respostaParaEnviar,
    'dispatched_via_hub' => true,
    'hub_response' => $hubResponse ? json_decode((string)$hubResponse, true) : null,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
