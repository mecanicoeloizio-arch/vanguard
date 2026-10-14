<?php
/**
 * EloMak - CamillaController (Fluxo Exclusivo de WhatsApp e Autenticação Sem Senha)
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';
require_once dirname(__DIR__, 2) . '/config/whatsapp.php';

class CamillaController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Passo 1 e 2: Usuário digita WhatsApp no front e este método verifica
     */
    public function verificarNumero(): void
    {
        header('Content-Type: application/json; charset=utf-8');

        $whatsappRaw = $_POST['whatsapp'] ?? $_GET['whatsapp'] ?? '';
        $whatsappLimpo = preg_replace('/[^0-9]/', '', (string)$whatsappRaw);

        if (empty($whatsappLimpo) || strlen($whatsappLimpo) < 10) {
            echo json_encode([
                'success' => false,
                'error' => 'Por favor, informe um número de WhatsApp válido com DDD.'
            ]);
            exit;
        }

        if (strlen($whatsappLimpo) === 10 || strlen($whatsappLimpo) === 11) {
            $whatsappCompleto = '55' . $whatsappLimpo;
        } else {
            $whatsappCompleto = $whatsappLimpo;
        }

        // 1. Busca se é Dono de Oficina em usuarios_sistema
        $stmtDono = $this->db->prepare("SELECT * FROM usuarios_sistema WHERE whatsapp_dono = ? OR whatsapp_dono = ? LIMIT 1");
        $stmtDono->execute([$whatsappCompleto, $whatsappLimpo]);
        $dono = $stmtDono->fetch();

        // 2. Busca se é Cliente da Oficina em clientes_oficina
        $stmtCli = $this->db->prepare("SELECT c.*, u.nome_oficina, u.cidade as oficina_cidade FROM clientes_oficina c LEFT JOIN usuarios_sistema u ON c.usuario_id = u.id WHERE c.whatsapp = ? OR c.whatsapp = ? LIMIT 1");
        $stmtCli->execute([$whatsappCompleto, $whatsappLimpo]);
        $cliente = $stmtCli->fetch();

        // Gera token temporário de 32 chars (bin2hex 16 bytes = 32 chars) válido por 15 min
        $token = bin2hex(random_bytes(16));
        $expiraEm = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        $linkAcesso = BASE_URL . '/acesso/' . $token;

        if ($dono || $cliente) {
            // ============================================
            // CENÁRIO A: NÚMERO EXISTE NO SISTEMA
            // ============================================
            $tipo = $dono ? 'dono' : 'cliente';
            $nome = $dono ? 'Mestre ' . $dono['nome_oficina'] : $cliente['nome'];
            $nomeOficina = $dono ? $dono['nome_oficina'] : ($cliente['nome_oficina'] ?? 'Oficina EloMak');
            $cidade = $dono ? $dono['cidade'] : ($cliente['oficina_cidade'] ?? 'São Gonçalo - RJ');

            // Salva lead/token em leads_whatsapp
            $stmtLead = $this->db->prepare("
                INSERT INTO leads_whatsapp (whatsapp, tipo, token, expira_em, usado, status_triagem, criado_em)
                VALUES (?, ?, ?, ?, 0, 'link_gerado', NOW())
            ");
            $stmtLead->execute([$whatsappCompleto, $tipo, $token, $expiraEm]);

            // Mensagem especificada na REGRA DE OURO
            $mensagem = "Olá {$nome}! Vi que seu número é da {$nomeOficina} de {$cidade}. Quer continuar seu atendimento ou acessar o sistema EloMak? 1- Continuar 2- Acessar EloMak - Link rápido: {$linkAcesso}";

            // Despacha via HUB Central
            $envio = WhatsAppService::enviarMensagem($whatsappCompleto, $mensagem);

            echo json_encode([
                'success' => true,
                'status' => 'existente',
                'tipo' => $tipo,
                'nome' => $nome,
                'whatsapp' => $whatsappCompleto,
                'token' => $token,
                'link_acesso' => $linkAcesso,
                'expira_em' => $expiraEm,
                'mensagem_enviada' => $mensagem,
                'hub_response' => $envio,
                'feedback' => "Link de acesso gerado e enviado para {$whatsappCompleto}! Verifique seu WhatsApp."
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;

        } else {
            // ============================================
            // CENÁRIO B: NÚMERO NOVO (NOVO LEAD)
            // ============================================
            $stmtLead = $this->db->prepare("
                INSERT INTO leads_whatsapp (whatsapp, tipo, token, expira_em, usado, status_triagem, criado_em)
                VALUES (?, 'novo', ?, ?, 0, 'aguardando_opcao', NOW())
            ");
            $stmtLead->execute([$whatsappCompleto, $token, $expiraEm]);

            // Mensagem para novo número especificada na REGRA DE OURO
            $mensagem = "Olá! Sou a Camilla do Grupo Eloizio. Número novo por aqui. Qual serviço deseja? 1-Mecânica 2-Sistema para minha oficina 3-Orçamento";

            // Despacha via HUB Central
            $envio = WhatsAppService::enviarMensagem($whatsappCompleto, $mensagem);

            echo json_encode([
                'success' => true,
                'status' => 'novo',
                'tipo' => 'novo',
                'whatsapp' => $whatsappCompleto,
                'token' => $token,
                'link_acesso' => $linkAcesso,
                'mensagem_enviada' => $mensagem,
                'hub_response' => $envio,
                'feedback' => "Olá! Identificamos que este é seu primeiro contato. Enviamos uma mensagem no seu WhatsApp para iniciar o atendimento."
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    /**
     * Validação do Token de Acesso (/acesso/{token})
     * Valida token em leads_whatsapp (expira_em > NOW() e usado = 0)
     */
    public function validarTokenAcesso(string $token): void
    {
        $stmt = $this->db->prepare("
            SELECT * FROM leads_whatsapp 
            WHERE token = ? AND expira_em > datetime('now', 'localtime') AND usado = 0 
            LIMIT 1
        ");
        $stmt->execute([$token]);
        $lead = $stmt->fetch();

        // Se o banco for MySQL puro:
        if (!$lead) {
            $stmtMysql = $this->db->prepare("
                SELECT * FROM leads_whatsapp 
                WHERE token = ? AND expira_em > NOW() AND usado = 0 
                LIMIT 1
            ");
            $stmtMysql->execute([$token]);
            $lead = $stmtMysql->fetch();
        }

        if (!$lead) {
            // Token inválido ou expirado
            $_SESSION['flash_error'] = 'Link de acesso inválido ou expirado. Por favor, solicite um novo link via WhatsApp.';
            redirect(BASE_URL . '/');
            return;
        }

        // Marca como usado
        $upStmt = $this->db->prepare("UPDATE leads_whatsapp SET usado = 1 WHERE id = ?");
        $upStmt->execute([$lead['id']]);

        // Carrega dados para a sessão do usuário
        $stmtUser = $this->db->prepare("SELECT * FROM usuarios_sistema WHERE whatsapp_dono = ? OR whatsapp_dono = ? LIMIT 1");
        $stmtUser->execute([$lead['whatsapp'], substr($lead['whatsapp'], 2)]);
        $dono = $stmtUser->fetch();

        if ($dono) {
            $_SESSION['elomak_usuario'] = [
                'id' => $dono['id'],
                'tipo' => 'dono',
                'nome' => $dono['nome_oficina'],
                'nome_oficina' => $dono['nome_oficina'],
                'whatsapp' => $dono['whatsapp_dono'],
                'cidade' => $dono['cidade'],
                'cnpj' => $dono['cnpj'],
                'plano' => $dono['plano'],
                'logo' => $dono['logo'],
                'autenticado_em' => date('Y-m-d H:i:s')
            ];
        } else {
            // Cliente da oficina ou lead que virou operador
            $stmtCli = $this->db->prepare("SELECT * FROM clientes_oficina WHERE whatsapp = ? OR whatsapp = ? LIMIT 1");
            $stmtCli->execute([$lead['whatsapp'], substr($lead['whatsapp'], 2)]);
            $cli = $stmtCli->fetch();

            $_SESSION['elomak_usuario'] = [
                'id' => $cli['id'] ?? 1,
                'usuario_id' => $cli['usuario_id'] ?? 1,
                'tipo' => 'cliente',
                'nome' => $cli['nome'] ?? 'Cliente WhatsApp',
                'nome_oficina' => 'Oficina Mecânica EloMak & Grupo Eloizio',
                'whatsapp' => $lead['whatsapp'],
                'cidade' => $cli['cidade'] ?? 'São Gonçalo - RJ',
                'autenticado_em' => date('Y-m-d H:i:s')
            ];
        }

        $_SESSION['flash_success'] = 'Acesso autenticado com sucesso via WhatsApp!';
        redirect(BASE_URL . '/dashboard');
    }

    /**
     * Encerra a sessão
     */
    public function logout(): void
    {
        unset($_SESSION['elomak_usuario']);
        session_destroy();
        redirect(BASE_URL . '/');
    }
}
