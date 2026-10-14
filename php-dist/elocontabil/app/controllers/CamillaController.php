<?php
/**
 * EloContábil - Controller da Camilla & Acesso Sem Senha
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';

class CamillaController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Passo 1: Verifica WhatsApp ou E-mail digitado na Home
     */
    public function verificarContato(): void {
        header('Content-Type: application/json; charset=utf-8');

        $contato = trim((string)($_POST['contato'] ?? ''));
        $tipo = trim((string)($_POST['tipo'] ?? 'whatsapp')); // 'whatsapp' ou 'email'

        if (empty($contato)) {
            echo json_encode(['success' => false, 'message' => 'Por favor, informe seu WhatsApp ou E-mail.']);
            return;
        }

        $cleanPhone = preg_replace('/[^0-9]/', '', $contato);
        $isEmail = filter_var($contato, FILTER_VALIDATE_EMAIL);

        // Busca se já é cadastrado
        if ($isEmail) {
            $stmt = $this->db->prepare("SELECT * FROM usuarios_contabil WHERE LOWER(email) = LOWER(?) LIMIT 1");
            $stmt->execute([$contato]);
        } else {
            $stmt = $this->db->prepare("SELECT * FROM usuarios_contabil WHERE whatsapp = ? OR whatsapp = ? LIMIT 1");
            $stmt->execute([$cleanPhone, substr($cleanPhone, 2)]);
        }

        $usuario = $stmt->fetch();

        // Gera token temporário de 30 minutos
        $token = bin2hex(random_bytes(16));
        $expiraEm = date('Y-m-d H:i:s', strtotime('+30 minutes'));

        $stmtLead = $this->db->prepare("
            INSERT INTO leads_triagem (contato, tipo_contato, servico_interesse, token_acesso, expira_em, status_triagem)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmtLead->execute([
            $isEmail ? $contato : $cleanPhone,
            $isEmail ? 'email' : 'whatsapp',
            $usuario ? 'cliente_cadastrado' : 'novo_lead',
            $token,
            $expiraEm,
            $usuario ? 'ativo' : 'triagem_inicial'
        ]);

        $linkAcesso = BASE_URL . "/acesso/{$token}";

        if ($usuario) {
            $mensagem = "Olá {$usuario['nome']}! Aqui é a Camilla da Gerência do Grupo Eloizio ☕. Localizei seu cadastro da empresa {$usuario['empresa']}. Seu link exclusivo e seguro para o EloContábil (válido por 30 minutos) está pronto: {$linkAcesso}";
            $status = 'cadastrado';
        } else {
            $mensagem = "Olá! Sou a Camilla Faria do Grupo Eloizio ☕. Vi que é seu primeiro contato com o EloContábil (Apoio Administrativo & RH que não precisa de CRC). Liberei seu acesso temporário de 30 minutos: {$linkAcesso} - Como posso apoiar sua empresa hoje?";
            $status = 'novo';
        }

        // Dispara mensagem via Webhook Centralizado se for WhatsApp
        $dispatched = false;
        if (!$isEmail && $cleanPhone) {
            $ch = curl_init(rtrim(CENTRAL_WEBHOOK_URL, '/') . '/send');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode([
                    'number' => $cleanPhone,
                    'text' => $mensagem,
                    'instance' => 'elocontabil_camilla'
                ]),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'X-Webhook-Secret: ' . WEBHOOK_SECRET
                ],
                CURLOPT_TIMEOUT => 5,
                CURLOPT_SSL_VERIFYPEER => false
            ]);
            $resp = curl_exec($ch);
            curl_close($ch);
            $dispatched = true;
        }

        echo json_encode([
            'success' => true,
            'status' => $status,
            'token' => $token,
            'link_acesso' => $linkAcesso,
            'mensagem_camilla' => $mensagem,
            'dispatched_via_webhook' => $dispatched,
            'tempo_validade' => '30 minutos'
        ]);
    }

    /**
     * Valida Token de Acesso (/acesso/{token})
     */
    public function validarToken(string $token): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $stmt = $this->db->prepare("SELECT * FROM leads_triagem WHERE token_acesso = ? AND expira_em > datetime('now') AND usado = 0");
        $stmt->execute([$token]);
        $lead = $stmt->fetch();

        if (!$lead) {
            // Verifica se está no MySQL
            try {
                $stmtMysql = $this->db->prepare("SELECT * FROM leads_triagem WHERE token_acesso = ? AND expira_em > NOW() AND usado = 0");
                $stmtMysql->execute([$token]);
                $lead = $stmtMysql->fetch();
            } catch (Throwable $e) {}
        }

        if ($lead) {
            // Marca como usado
            $up = $this->db->prepare("UPDATE leads_triagem SET usado = 1 WHERE id = ?");
            $up->execute([$lead['id']]);

            // Cria sessão autenticada por 30 minutos
            $_SESSION['elocontabil_user'] = [
                'contato' => $lead['contato'],
                'tipo' => $lead['tipo_contato'],
                'auth_at' => time(),
                'expires_at' => time() + (30 * 60)
            ];

            header("Location: " . BASE_URL . "/dashboard");
            exit;
        }

        // Token expirado ou inválido
        header("Location: " . BASE_URL . "/?erro=token_expirado");
        exit;
    }

    /**
     * Encerra Sessão
     */
    public function logout(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        unset($_SESSION['elocontabil_user']);
        session_destroy();
        header("Location: " . BASE_URL . "/");
        exit;
    }
}
