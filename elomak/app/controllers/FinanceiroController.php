<?php
/**
 * EloMak - FinanceiroController (Contas Pagar/Receber & PIX QR Code)
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';

class FinanceiroController
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
        $tipoFiltro = $_GET['tipo'] ?? 'todos';

        // Totais
        $totalReceitas = (float)$this->db->query("SELECT COALESCE(SUM(valor), 0) FROM financeiro_lancamentos WHERE tipo = 'receita' AND status = 'pago'")->fetchColumn();
        $totalDespesas = (float)$this->db->query("SELECT COALESCE(SUM(valor), 0) FROM financeiro_lancamentos WHERE tipo = 'despesa' AND status = 'pago'")->fetchColumn();
        $saldoCaixa = $totalReceitas - $totalDespesas;

        $aReceberPendente = (float)$this->db->query("SELECT COALESCE(SUM(valor), 0) FROM financeiro_lancamentos WHERE tipo = 'receita' AND status = 'pendente'")->fetchColumn();
        $aPagarPendente = (float)$this->db->query("SELECT COALESCE(SUM(valor), 0) FROM financeiro_lancamentos WHERE tipo = 'despesa' AND status = 'pendente'")->fetchColumn();

        // Lançamentos
        $sql = "SELECT * FROM financeiro_lancamentos WHERE 1=1";
        $params = [];
        if ($tipoFiltro !== 'todos') {
            $sql .= " AND tipo = ?";
            $params[] = $tipoFiltro;
        }
        $sql .= " ORDER BY data_vencimento DESC LIMIT 50";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $lancamentos = $stmt->fetchAll();

        require_once APP_PATH . '/views/financeiro.php';
    }

    public function salvar(): void
    {
        $tipo = $_POST['tipo'] ?? 'receita';
        $categoria = trim((string)($_POST['categoria'] ?? 'Geral'));
        $descricao = trim((string)($_POST['descricao'] ?? ''));
        $valor = (float)str_replace(',', '.', (string)($_POST['valor'] ?? '0'));
        $status = $_POST['status'] ?? 'pendente';
        $dataVenc = $_POST['data_vencimento'] ?? date('Y-m-d');
        $forma = $_POST['forma_pagamento'] ?? 'PIX';

        $dataPagto = $status === 'pago' ? date('Y-m-d') : null;

        // Gera código PIX Copia e Cola simbólico no padrão oficial EMV BR Code
        $pixCopiaCola = '00020126580014br.gov.bcb.pix0136' . uniqid('elomak_') . '520400005303986540' . number_format($valor, 2, '.', '') . '5802BR5925OFICINA ELOMAK ELOIZIO6014SAO GONCALO62070503***6304';

        $stmt = $this->db->prepare("
            INSERT INTO financeiro_lancamentos (usuario_id, tipo, categoria, descricao, valor, status, data_vencimento, data_pagamento, forma_pagamento, pix_qrcode, criado_em)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$tipo, $categoria, $descricao, $valor, $status, $dataVenc, $dataPagto, $forma, $pixCopiaCola]);

        $_SESSION['flash_success'] = 'Lançamento financeiro registrado com sucesso!';
        redirect(BASE_URL . '/financeiro');
    }

    public function baixar(int $id): void
    {
        $stmt = $this->db->prepare("UPDATE financeiro_lancamentos SET status = 'pago', data_pagamento = NOW() WHERE id = ?");
        $stmt->execute([$id]);

        $_SESSION['flash_success'] = 'Lançamento liquidado como PAGO!';
        redirect(BASE_URL . '/financeiro');
    }
}
