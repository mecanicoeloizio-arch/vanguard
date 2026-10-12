<?php
/**
 * EloMak - OrcamentoController (Orçamentos que viram OS em 1 clique)
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';

class OrcamentoController
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
        $stmt = $this->db->query("
            SELECT o.*, c.nome as cliente_nome, c.whatsapp as cliente_whatsapp,
                   v.placa, v.marca, v.modelo
            FROM orcamentos o
            LEFT JOIN clientes_oficina c ON o.cliente_id = c.id
            LEFT JOIN veiculos v ON o.veiculo_id = v.id
            ORDER BY o.id DESC
        ");
        $orcamentos = $stmt->fetchAll();

        $clientes = $this->db->query("SELECT * FROM clientes_oficina ORDER BY nome ASC")->fetchAll();
        $veiculos = $this->db->query("SELECT * FROM veiculos ORDER BY placa ASC")->fetchAll();

        require_once APP_PATH . '/views/orcamentos.php';
    }

    public function salvar(): void
    {
        $clienteId = (int)($_POST['cliente_id'] ?? 0);
        $veiculoId = (int)($_POST['veiculo_id'] ?? 0);
        $descricao = trim((string)($_POST['descricao_servicos'] ?? ''));
        $valor = (float)str_replace(',', '.', (string)($_POST['valor_total'] ?? '0'));
        $validade = (int)($_POST['validade_dias'] ?? 10);

        $numeroOrc = 'ORC-' . date('Y') . '-' . str_pad((string)rand(10, 999), 3, '0', STR_PAD_LEFT);

        $stmt = $this->db->prepare("
            INSERT INTO orcamentos (numero_orcamento, usuario_id, cliente_id, veiculo_id, descricao_servicos, valor_total, validade_dias, criado_em)
            VALUES (?, 1, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$numeroOrc, $clienteId, $veiculoId, $descricao, $valor, $validade]);

        $_SESSION['flash_success'] = "Orçamento {$numeroOrc} gerado com sucesso!";
        redirect(BASE_URL . '/orcamentos');
    }

    /**
     * REGRA DE OURO: Transforma orçamento em OS com 1 clique!
     */
    public function converterEmOs(int $orcamentoId): void
    {
        $stmt = $this->db->prepare("SELECT * FROM orcamentos WHERE id = ?");
        $stmt->execute([$orcamentoId]);
        $orc = $stmt->fetch();

        if (!$orc) {
            $_SESSION['flash_error'] = 'Orçamento não localizado.';
            redirect(BASE_URL . '/orcamentos');
            return;
        }

        $numeroOs = 'OS-' . date('Y') . '-' . str_pad((string)rand(10, 999), 3, '0', STR_PAD_LEFT);
        $prazo = date('Y-m-d', strtotime('+3 days'));

        // Insere a OS
        $insOs = $this->db->prepare("
            INSERT INTO ordem_servico (
                numero_os, usuario_id, cliente_id, veiculo_id, defeito, diagnostico, status,
                valor_total, prazo_entrega, data_entrada
            ) VALUES (?, 1, ?, ?, ?, 'Aprovado a partir de Orçamento prévio', 'Aberta', ?, ?, NOW())
        ");
        $insOs->execute([
            $numeroOs, $orc['cliente_id'], $orc['veiculo_id'], 
            "Serviços aprovados via Orçamento {$orc['numero_orcamento']}: {$orc['descricao_servicos']}",
            $orc['valor_total'], $prazo
        ]);
        $novaOsId = (int)$this->db->lastInsertId();

        // Atualiza orçamento
        $up = $this->db->prepare("UPDATE orcamentos SET status = 'Convertido em OS', os_gerada_id = ? WHERE id = ?");
        $up->execute([$novaOsId, $orcamentoId]);

        $_SESSION['flash_success'] = "Orçamento convertido em Ordem de Serviço {$numeroOs} com 1 clique!";
        redirect(BASE_URL . '/os/detalhes/' . $novaOsId);
    }
}
