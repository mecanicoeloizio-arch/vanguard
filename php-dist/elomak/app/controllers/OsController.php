<?php
/**
 * EloMak - OsController (Gestão Completa de Ordens de Serviço)
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';
require_once dirname(__DIR__, 2) . '/config/whatsapp.php';

class OsController
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
        $statusFiltro = $_GET['status'] ?? 'todos';
        $busca = trim((string)($_GET['q'] ?? ''));

        $sql = "
            SELECT os.*, c.nome as cliente_nome, c.whatsapp as cliente_whatsapp, 
                   v.placa, v.marca, v.modelo, v.ano
            FROM ordem_servico os
            LEFT JOIN clientes_oficina c ON os.cliente_id = c.id
            LEFT JOIN veiculos v ON os.veiculo_id = v.id
            WHERE 1=1
        ";
        $params = [];

        if ($statusFiltro !== 'todos') {
            $sql .= " AND os.status = ?";
            $params[] = $statusFiltro;
        }

        if (!empty($busca)) {
            $sql .= " AND (c.nome LIKE ? OR v.placa LIKE ? OR os.numero_os LIKE ?)";
            $params[] = "%{$busca}%";
            $params[] = "%{$busca}%";
            $params[] = "%{$busca}%";
        }

        $sql .= " ORDER BY os.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $ordens = $stmt->fetchAll();

        require_once APP_PATH . '/views/os_list.php';
    }

    public function novo(): void
    {
        $clientes = $this->db->query("SELECT * FROM clientes_oficina ORDER BY nome ASC")->fetchAll();
        $veiculos = $this->db->query("SELECT v.*, c.nome as cliente_nome FROM veiculos v LEFT JOIN clientes_oficina c ON v.cliente_id = c.id ORDER BY v.placa ASC")->fetchAll();
        $produtos = $this->db->query("SELECT * FROM produtos_estoque WHERE quantidade > 0 ORDER BY descricao ASC")->fetchAll();

        require_once APP_PATH . '/views/os_form.php';
    }

    public function salvar(): void
    {
        $clienteId = (int)($_POST['cliente_id'] ?? 0);
        $veiculoId = (int)($_POST['veiculo_id'] ?? 0);
        $defeito = trim((string)($_POST['defeito'] ?? ''));
        $diagnostico = trim((string)($_POST['diagnostico'] ?? ''));
        $status = $_POST['status'] ?? 'Aberta';
        $valorMaoObra = (float)str_replace(',', '.', (string)($_POST['valor_mao_obra'] ?? '0'));
        $valorPecas = (float)str_replace(',', '.', (string)($_POST['valor_pecas'] ?? '0'));
        $valorDesconto = (float)str_replace(',', '.', (string)($_POST['valor_desconto'] ?? '0'));
        $formaPagamento = $_POST['forma_pagamento'] ?? 'Mercado Pago (PIX)';
        $prazoEntrega = $_POST['prazo_entrega'] ?? date('Y-m-d', strtotime('+3 days'));
        $prazoGarantia = $_POST['prazo_garantia'] ?? '90 dias (Lei 8.078/90 CDC)';
        $laudo = trim((string)($_POST['laudo_tecnico'] ?? ''));

        // Se o cliente ou veículo for novo via formulário rápido
        if ($clienteId === 0 && !empty($_POST['novo_cliente_nome'])) {
            $insC = $this->db->prepare("INSERT INTO clientes_oficina (usuario_id, nome, whatsapp, cpf) VALUES (1, ?, ?, ?)");
            $insC->execute([$_POST['novo_cliente_nome'], $_POST['novo_cliente_whatsapp'], $_POST['novo_cliente_cpf'] ?? '']);
            $clienteId = (int)$this->db->lastInsertId();
        }

        if ($veiculoId === 0 && !empty($_POST['nova_placa'])) {
            $insV = $this->db->prepare("INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano) VALUES (?, ?, ?, ?, ?)");
            $insV->execute([$clienteId, strtoupper($_POST['nova_placa']), $_POST['nova_marca'] ?? 'Generico', $_POST['novo_modelo'] ?? 'Modelo', $_POST['novo_ano'] ?? date('Y')]);
            $veiculoId = (int)$this->db->lastInsertId();
        }

        $valorTotal = max(0, ($valorMaoObra + $valorPecas) - $valorDesconto);
        $numeroOs = 'OS-' . date('Y') . '-' . str_pad((string)rand(10, 999), 3, '0', STR_PAD_LEFT);

        // Upload de foto se houver
        $fotos = [];
        if (!empty($_FILES['fotos']['name'][0])) {
            foreach ($_FILES['fotos']['tmp_name'] as $k => $tmp) {
                if (is_uploaded_file($tmp)) {
                    $ext = pathinfo($_FILES['fotos']['name'][$k], PATHINFO_EXTENSION);
                    $nomeFoto = 'os_' . time() . '_' . rand(100, 999) . '.' . $ext;
                    $destino = STORAGE_PATH . '/uploads/' . $nomeFoto;
                    if (move_uploaded_file($tmp, $destino)) {
                        $fotos[] = '/storage/uploads/' . $nomeFoto;
                    }
                }
            }
        }

        $stmt = $this->db->prepare("
            INSERT INTO ordem_servico (
                numero_os, usuario_id, cliente_id, veiculo_id, defeito, diagnostico, laudo_tecnico,
                status, valor_mao_obra, valor_pecas, valor_desconto, valor_total, forma_pagamento,
                prazo_entrega, prazo_garantia, fotos_json, data_entrada
            ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $numeroOs, $clienteId, $veiculoId, $defeito, $diagnostico, $laudo,
            $status, $valorMaoObra, $valorPecas, $valorDesconto, $valorTotal, $formaPagamento,
            $prazoEntrega, $prazoGarantia, json_encode($fotos)
        ]);
        $osId = (int)$this->db->lastInsertId();

        // Baixa automática de peças no estoque se itens foram selecionados
        if (!empty($_POST['peca_id']) && is_array($_POST['peca_id'])) {
            foreach ($_POST['peca_id'] as $idx => $prodId) {
                $pId = (int)$prodId;
                $pQtd = (float)($_POST['peca_qtd'][$idx] ?? 1);
                $pVlr = (float)($_POST['peca_vlr'][$idx] ?? 0);
                $pDesc = (string)($_POST['peca_desc'][$idx] ?? 'Peça');

                if ($pId > 0 && $pQtd > 0) {
                    // Insere item
                    $insItem = $this->db->prepare("INSERT INTO os_itens (os_id, tipo, produto_id, descricao, quantidade, valor_unitario, valor_total) VALUES (?, 'peca', ?, ?, ?, ?, ?)");
                    $insItem->execute([$osId, $pId, $pDesc, $pQtd, $pVlr, ($pQtd * $pVlr)]);

                    // Baixa estoque
                    $down = $this->db->prepare("UPDATE produtos_estoque SET quantidade = quantidade - ? WHERE id = ?");
                    $down->execute([$pQtd, $pId]);

                    // Movimentação
                    $mov = $this->db->prepare("INSERT INTO movimentacoes_estoque (produto_id, os_id, tipo, quantidade, motivo) VALUES (?, ?, 'saida', ?, ?)");
                    $mov->execute([$pId, $osId, $pQtd, "Uso na Ordem de Serviço #{$numeroOs}"]);
                }
            }
        }

        // Gera lançamento financeiro a receber
        $insFin = $this->db->prepare("
            INSERT INTO financeiro_lancamentos (usuario_id, os_id, tipo, categoria, descricao, valor, status, data_vencimento, forma_pagamento)
            VALUES (1, ?, 'receita', 'Serviços de Oficina', ?, ?, 'pendente', ?, ?)
        ");
        $insFin->execute([$osId, "Recebimento da {$numeroOs}", $valorTotal, $prazoEntrega, $formaPagamento]);

        $_SESSION['flash_success'] = "Ordem de Serviço {$numeroOs} criada com sucesso!";
        redirect(BASE_URL . '/os/detalhes/' . $osId);
    }

    public function detalhes(int $id): void
    {
        $stmt = $this->db->prepare("
            SELECT os.*, c.nome as cliente_nome, c.whatsapp as cliente_whatsapp, c.cpf as cliente_cpf,
                   v.placa, v.marca, v.modelo, v.ano, v.km_atual
            FROM ordem_servico os
            LEFT JOIN clientes_oficina c ON os.cliente_id = c.id
            LEFT JOIN veiculos v ON os.veiculo_id = v.id
            WHERE os.id = ?
        ");
        $stmt->execute([$id]);
        $os = $stmt->fetch();

        if (!$os) {
            $_SESSION['flash_error'] = 'Ordem de Serviço não encontrada.';
            redirect(BASE_URL . '/os');
        }

        // Itens
        $stmtItens = $this->db->prepare("SELECT * FROM os_itens WHERE os_id = ?");
        $stmtItens->execute([$id]);
        $itens = $stmtItens->fetchAll();

        require_once APP_PATH . '/views/os_detalhes.php';
    }

    public function atualizarStatus(): void
    {
        $id = (int)($_POST['id'] ?? 0);
        $novoStatus = $_POST['status'] ?? 'Em Andamento';

        $stmt = $this->db->prepare("UPDATE ordem_servico SET status = ? WHERE id = ?");
        $stmt->execute([$novoStatus, $id]);

        // Se finalizada, atualiza data_conclusao
        if ($novoStatus === 'Finalizada' || $novoStatus === 'Entregue') {
            $this->db->prepare("UPDATE ordem_servico SET data_conclusao = NOW() WHERE id = ?")->execute([$id]);
        }

        $_SESSION['flash_success'] = "Status da OS atualizado para {$novoStatus}!";
        redirect(BASE_URL . '/os/detalhes/' . $id);
    }

    public function imprimirPdf(int $id): void
    {
        // Renderiza view preparada para impressão e PDF
        $stmt = $this->db->prepare("
            SELECT os.*, c.nome as cliente_nome, c.whatsapp as cliente_whatsapp, c.cpf as cliente_cpf,
                   v.placa, v.marca, v.modelo, v.ano, v.km_atual
            FROM ordem_servico os
            LEFT JOIN clientes_oficina c ON os.cliente_id = c.id
            LEFT JOIN veiculos v ON os.veiculo_id = v.id
            WHERE os.id = ?
        ");
        $stmt->execute([$id]);
        $os = $stmt->fetch();

        $stmtItens = $this->db->prepare("SELECT * FROM os_itens WHERE os_id = ?");
        $stmtItens->execute([$id]);
        $itens = $stmtItens->fetchAll();

        require_once APP_PATH . '/views/os_impressao.php';
    }
}
