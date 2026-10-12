<?php
/**
 * EloMak - Receptor Oficial de Webhook (RECEBE DO HUB CENTRAL)
 * Subdomínio: https://elomak.grupoeloizio.com.br
 * Caminho: /elomak/api/webhook_receiver.php
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/whatsapp.php';

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
$logFile = STORAGE_PATH . '/logs/webhook_receiver_' . date('Y-m-d') . '.log';
@file_put_contents(
    $logFile,
    sprintf("[%s] Recebido do Hub: %s\n", date('H:i:s'), $rawInput),
    FILE_APPEND
);

// 2. Extração de Mensagem e Remetente (Suporte a Evolution API e Z-API)
$sender = $data['data']['key']['remoteJid'] 
    ?? $data['sender'] 
    ?? $data['phone'] 
    ?? $data['number'] 
    ?? '';

$phone = preg_replace('/[^0-9]/', '', (string)$sender);

// Mensagem recebida
$message = $data['data']['message']['conversation']
    ?? $data['data']['message']['extendedTextMessage']['text']
    ?? $data['text']
    ?? $data['message']
    ?? '';

$text = trim((string)$message);

if (!$phone || !$text) {
    echo json_encode(['success' => false, 'notice' => 'Ignorado: sem texto ou telefone']);
    exit;
}

$db = Database::getConnection();

// 3. Identifica se o usuário existe no sistema ou é novo lead
$stmtUser = $db->prepare("SELECT * FROM usuarios_sistema WHERE whatsapp_dono = ? OR whatsapp_dono = ?");
$stmtUser->execute([$phone, substr($phone, 2)]);
$usuarioDono = $stmtUser->fetch();

$stmtCli = $db->prepare("SELECT * FROM clientes_oficina WHERE whatsapp = ? OR whatsapp = ?");
$stmtCli->execute([$phone, substr($phone, 2)]);
$clienteExistente = $stmtCli->fetch();

// Busca o lead ativo mais recente
$stmtLead = $db->prepare("SELECT * FROM leads_whatsapp WHERE whatsapp = ? ORDER BY id DESC LIMIT 1");
$stmtLead->execute([$phone]);
$lead = $stmtLead->fetch();

$tipoUsuario = $usuarioDono ? 'dono' : ($clienteExistente ? 'cliente' : 'novo');

// 4. REGRA DE TRIAGEM DA CAMILLA CONFORME ESPECIFICAÇÃO
$respostaParaEnviar = '';

// Verificação de placa de veículo via REGEX: Mercosul e Antiga [A-Z]{3}[0-9][A-Z0-9][0-9]{2}
$temPlaca = preg_match('/([A-Z]{3}[0-9][A-Z0-9][0-9]{2})/i', strtoupper(str_replace('-', '', $text)), $matches);
$placaEncontrada = $temPlaca ? strtoupper($matches[1]) : null;

if ($placaEncontrada) {
    // Registra a placa no lead
    $dadosTemp = $lead && !empty($lead['dados_temporarios_json']) ? json_decode($lead['dados_temporarios_json'], true) : [];
    $dadosTemp['placa'] = $placaEncontrada;

    // Atualiza status do lead
    $upStmt = $db->prepare("UPDATE leads_whatsapp SET dados_temporarios_json = ?, status_triagem = 'aguardando_defeito' WHERE id = ?");
    if ($lead) {
        $upStmt->execute([json_encode($dadosTemp), $lead['id']]);
    }

    $respostaParaEnviar = "Perfeito! Anotei a placa *{$placaEncontrada}* na sua ficha. Agora, por favor, me descreva resumidamente: qual defeito, barulho ou serviço você precisa que nossa equipe técnica avalie no veículo?";
} else {
    // Triagem por Opção numérica
    switch ($text) {
        case '1':
            if ($tipoUsuario === 'novo') {
                // Se for novo, pede placa e defeito e cria pré-OS status "Pré-Atendimento"
                $numOs = 'OS-' . date('Y') . '-' . rand(100, 999);
                
                // Cria ou recupera cliente básico
                $insCli = $db->prepare("INSERT INTO clientes_oficina (usuario_id, nome, whatsapp) VALUES (1, ?, ?)");
                $insCli->execute(['Cliente WhatsApp ' . substr($phone, -4), $phone]);
                $novoCliId = (int)$db->lastInsertId();

                // Cria veículo provisório
                $insVeic = $db->prepare("INSERT INTO veiculos (cliente_id, placa, marca, modelo) VALUES (?, 'EM_TRIAGEM', 'A Definir', 'A Definir')");
                $insVeic->execute([$novoCliId]);
                $novoVeicId = (int)$db->lastInsertId();

                // Cria pré-OS status 'Pré-Atendimento'
                $insOs = $db->prepare("INSERT INTO ordem_servico (numero_os, usuario_id, cliente_id, veiculo_id, defeito, status, data_entrada) VALUES (?, 1, ?, ?, 'Pré-atendimento iniciado via WhatsApp', 'Pré-Atendimento', NOW())");
                $insOs->execute([$numOs, $novoCliId, $novoVeicId]);

                $respostaParaEnviar = "Excelente! Já abri seu pré-atendimento (Protocolo *{$numOs}*). Por favor, me informe a *PLACA* do seu veículo (ex: RIO2026) para localizarmos o modelo exato no sistema.";
            } else {
                // Se for cliente existente, pede placa
                $respostaParaEnviar = "Olá de volta! Qual a *PLACA* do veículo que você deseja consultar o andamento ou agendar nova manutenção hoje?";
            }
            break;

        case '2':
            // Se resposta = 2 -> Gera novo token de acesso e envia link https://elomak.grupoeloizio.com.br/acesso/{token}
            $novoToken = bin2hex(random_bytes(16));
            $expiraEm = date('Y-m-d H:i:s', strtotime('+15 minutes'));

            $insLead = $db->prepare("INSERT INTO leads_whatsapp (whatsapp, tipo, token, expira_em, usado, status_triagem) VALUES (?, ?, ?, ?, 0, 'link_gerado')");
            $insLead->execute([$phone, $tipoUsuario, $novoToken, $expiraEm]);

            $linkAcesso = BASE_URL . '/acesso/' . $novoToken;
            $respostaParaEnviar = "🔑 *Seu Acesso Rápido ao EloMak:*\n\nClique no link abaixo para entrar no sistema da oficina sem precisar de senha (válido por 15 minutos):\n\n👉 {$linkAcesso}\n\nSe precisar de suporte, basta responder esta mensagem!";
            break;

        case '3':
            // Se resposta = 3 -> Pede placa + serviço para orçamento
            $respostaParaEnviar = "Com certeza! Para gerarmos seu orçamento sem compromisso, por favor envie a *PLACA* do veículo e o *SERVIÇO DESEJADO* (ex: troca de óleo, embreagem, suspensão, freios, retífica de motor).";
            break;

        default:
            // Se já forneceu a placa e agora descreveu o defeito
            if ($lead && ($lead['status_triagem'] ?? '') === 'aguardando_defeito') {
                $dadosTemp = json_decode($lead['dados_temporarios_json'] ?? '{}', true);
                $placaGravada = $dadosTemp['placa'] ?? 'Identificada';

                // Atualiza a pré-OS com o defeito
                $numOs = 'OS-' . date('Y') . '-' . rand(100, 999);
                $respostaParaEnviar = "✅ Defeito registrado com sucesso para a placa *{$placaGravada}*!\n\n📋 *Resumo do Atendimento:*\nDefeito: \"{$text}\"\nProtocolo: *{$numOs}*\n\nNossa equipe técnica já está com seu chamado na tela. Quer acompanhar pelo sistema? Digite *2* a qualquer momento para receber seu link de acesso rápido!";
                
                $upLead = $db->prepare("UPDATE leads_whatsapp SET status_triagem = 'defeito_registrado' WHERE id = ?");
                $upLead->execute([$lead['id']]);
            } else {
                // Mensagem padrão de saudação e menu
                $nomeSaudacao = $clienteExistente ? $clienteExistente['nome'] : ($usuarioDono ? $usuarioDono['nome_oficina'] : 'Cliente');
                $respostaParaEnviar = "Olá {$nomeSaudacao}! Sou a Camilla, atendente do Grupo Eloizio.\n\nComo posso te ajudar hoje?\n*1* - Agendar Serviço / Pré-Atendimento\n*2* - Acessar o Sistema EloMak\n*3* - Solicitar Orçamento de Peças ou Serviços";
            }
            break;
    }
}

// 5. Despacha a resposta de volta via CENTRAL HUB (cURL para CENTRAL_WEBHOOK_URL/send)
if ($respostaParaEnviar) {
    WhatsAppService::enviarMensagem($phone, $respostaParaEnviar);
}

echo json_encode([
    'success' => true,
    'receiver' => 'EloMak Webhook Receiver',
    'phone' => $phone,
    'triaged' => true,
    'reply_sent' => !empty($respostaParaEnviar),
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
