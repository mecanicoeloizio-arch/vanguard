<?php
/**
 * EloMak - EstoqueController (Produtos, Peças & Estoque Mínimo)
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';

class EstoqueController
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
        $busca = trim((string)($_GET['q'] ?? ''));
        $sql = "SELECT * FROM produtos_estoque WHERE 1=1";
        $params = [];

        if (!empty($busca)) {
            $sql .= " AND (codigo LIKE ? OR descricao LIKE ? OR fornecedor LIKE ?)";
            $params[] = "%{$busca}%";
            $params[] = "%{$busca}%";
            $params[] = "%{$busca}%";
        }

        $sql .= " ORDER BY quantidade <= estoque_minimo DESC, descricao ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $produtos = $stmt->fetchAll();

        // Movimentações recentes
        $stmtMov = $this->db->query("
            SELECT m.*, p.descricao as produto_nome, p.codigo
            FROM movimentacoes_estoque m
            LEFT JOIN produtos_estoque p ON m.produto_id = p.id
            ORDER BY m.id DESC LIMIT 10
        ");
        $movimentacoes = $stmtMov->fetchAll();

        require_once APP_PATH . '/views/estoque.php';
    }

    public function salvar(): void
    {
        $codigo = strtoupper(trim((string)($_POST['codigo'] ?? '')));
        $descricao = trim((string)($_POST['descricao'] ?? ''));
        $categoria = trim((string)($_POST['categoria'] ?? 'Peças Mecânicas'));
        $fornecedor = trim((string)($_POST['fornecedor'] ?? ''));
        $precoCusto = (float)str_replace(',', '.', (string)($_POST['preco_custo'] ?? '0'));
        $precoVenda = (float)str_replace(',', '.', (string)($_POST['preco_venda'] ?? '0'));
        $quantidade = (float)str_replace(',', '.', (string)($_POST['quantidade'] ?? '0'));
        $minimo = (float)str_replace(',', '.', (string)($_POST['estoque_minimo'] ?? '2'));

        if (empty($codigo) || empty($descricao)) {
            $_SESSION['flash_error'] = 'Código e descrição são obrigatórios.';
            redirect(BASE_URL . '/estoque');
            return;
        }

        $stmt = $this->db->prepare("
            INSERT INTO produtos_estoque (usuario_id, codigo, descricao, categoria, fornecedor, preco_custo, preco_venda, quantidade, estoque_minimo, criado_em)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$codigo, $descricao, $categoria, $fornecedor, $precoCusto, $precoVenda, $quantidade, $minimo]);
        $prodId = (int)$this->db->lastInsertId();

        // Registra movimentação de entrada inicial
        if ($quantidade > 0) {
            $insMov = $this->db->prepare("INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, motivo) VALUES (?, 'entrada', ?, 'Saldo Inicial de Cadastro')");
            $insMov->execute([$prodId, $quantidade]);
        }

        $_SESSION['flash_success'] = "Produto {$descricao} cadastrado com sucesso no estoque!";
        redirect(BASE_URL . '/estoque');
    }

    public function ajustarSaldo(): void
    {
        $produtoId = (int)($_POST['produto_id'] ?? 0);
        $tipo = $_POST['tipo'] ?? 'entrada';
        $qtd = (float)str_replace(',', '.', (string)($_POST['quantidade'] ?? '1'));
        $motivo = trim((string)($_POST['motivo'] ?? 'Ajuste manual de estoque'));

        if ($tipo === 'entrada') {
            $this->db->prepare("UPDATE produtos_estoque SET quantidade = quantidade + ? WHERE id = ?")->execute([$qtd, $produtoId]);
        } else {
            $this->db->prepare("UPDATE produtos_estoque SET quantidade = quantidade - ? WHERE id = ?")->execute([$qtd, $produtoId]);
        }

        $insMov = $this->db->prepare("INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, motivo) VALUES (?, ?, ?, ?)");
        $insMov->execute([$produtoId, $tipo, $qtd, $motivo]);

        $_SESSION['flash_success'] = 'Estoque ajustado com sucesso!';
        redirect(BASE_URL . '/estoque');
    }
}
