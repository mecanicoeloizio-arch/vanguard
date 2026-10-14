<?php
/**
 * EloMak - DashboardController
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';

class DashboardController
{
    private PDO $db;

    public function __construct()
    {
        if (!isAuthenticated()) {
            redirect(BASE_URL . '/');
        }
        $this->db = Database::getConnection();
    }

    public function index(): void
    {
        $user = getLoggedUser();

        // 1. Faturamento do Mês
        $stmtFat = $this->db->query("
            SELECT COALESCE(SUM(valor_total), 0) as total_mes 
            FROM ordem_servico 
            WHERE status = 'Finalizada' OR status = 'Entregue'
        ");
        $faturamentoMes = (float)($stmtFat->fetchColumn() ?: 0);

        // 2. OS Abertas / Em Andamento
        $stmtAberta = $this->db->query("
            SELECT COUNT(*) FROM ordem_servico 
            WHERE status IN ('Aberta', 'Em Andamento', 'Aguardando Peça', 'Pré-Atendimento')
        ");
        $osAbertas = (int)$stmtAberta->fetchColumn();

        // 3. OS Finalizadas
        $stmtFin = $this->db->query("
            SELECT COUNT(*) FROM ordem_servico 
            WHERE status IN ('Finalizada', 'Entregue')
        ");
        $osFinalizadas = (int)$stmtFin->fetchColumn();

        // 4. Contas a Receber Pendentes
        $stmtRec = $this->db->query("
            SELECT COALESCE(SUM(valor), 0) FROM financeiro_lancamentos 
            WHERE tipo = 'receita' AND status = 'pendente'
        ");
        $contasReceber = (float)($stmtRec->fetchColumn() ?: 0);

        // 5. Total de Clientes Cadastrados
        $totalClientes = (int)$this->db->query("SELECT COUNT(*) FROM clientes_oficina")->fetchColumn();

        // 6. Total de Peças em Estoque com Alerta de Mínimo
        $itensEstoqueBaixo = (int)$this->db->query("
            SELECT COUNT(*) FROM produtos_estoque WHERE quantidade <= estoque_minimo
        ")->fetchColumn();

        // 7. Lista das Ordens de Serviço Recentes
        $stmtRecentes = $this->db->query("
            SELECT os.*, c.nome as cliente_nome, v.placa, v.modelo as veiculo_modelo, v.marca as veiculo_marca
            FROM ordem_servico os
            LEFT JOIN clientes_oficina c ON os.cliente_id = c.id
            LEFT JOIN veiculos v ON os.veiculo_id = v.id
            ORDER BY os.id DESC LIMIT 10
        ");
        $osRecentes = $stmtRecentes->fetchAll();

        // 8. Leads Recentes do WhatsApp
        $stmtLeads = $this->db->query("
            SELECT * FROM leads_whatsapp ORDER BY id DESC LIMIT 5
        ");
        $leadsRecentes = $stmtLeads->fetchAll();

        require_once APP_PATH . '/views/dashboard.php';
    }
}
