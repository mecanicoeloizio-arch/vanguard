<?php
/**
 * EloContábil - Controller dos Módulos Principais
 * Módulos: RH de Apoio, Administrativo e Central da Camilla
 * Grupo Eloizio 2026
 */

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/config/config.php';
require_once dirname(__DIR__, 2) . '/config/database.php';

class ModulosController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Módulo 1: RH de Apoio
     */
    public function getDadosRH(): array {
        $funcionarios = $this->db->query("SELECT * FROM funcionarios ORDER BY nome ASC")->fetchAll();
        $pontos = $this->db->query("
            SELECT p.*, f.nome as funcionario_nome, f.cargo 
            FROM ponto_registros p 
            JOIN funcionarios f ON p.funcionario_id = f.id 
            ORDER BY p.data DESC LIMIT 15
        ")->fetchAll();

        // Modelos Prontos de Documentos de RH
        $modelosRH = [
            'termo_epi' => [
                'titulo' => 'Termo de Entrega e Responsabilidade de EPI e Uniforme',
                'descricao' => 'Comprovante assinado pelo colaborador para atendimento das Normas Regulamentadoras (NR-06).',
            ],
            'advertencia_disciplinar' => [
                'titulo' => 'Modelo de Advertência Disciplinar por Escrito',
                'descricao' => 'Registro formal com fundamento no Art. 482 da CLT para atrasos ou conduta.',
            ],
            'checklist_admissao' => [
                'titulo' => 'Checklist Completo de Admissão de Funcionário',
                'descricao' => 'Relação de RG, CPF, CTPS Digital, Título, ASO Admissional e comprovante de residência.',
            ],
            'checklist_demissao' => [
                'titulo' => 'Checklist de Desligamento & Homologação',
                'descricao' => 'Exame Demissional, devolução de ferramentas/chaves e conferência de dias trabalhados.',
            ],
        ];

        return [
            'funcionarios' => $funcionarios,
            'pontos' => $pontos,
            'modelos' => $modelosRH,
            'total_ativos' => count($funcionarios),
            'asos_vencendo' => array_filter($funcionarios, function($f) {
                if (empty($f['vencimento_aso'])) return false;
                $diff = strtotime($f['vencimento_aso']) - time();
                return $diff < (60 * 86400); // vence em menos de 60 dias
            })
        ];
    }

    /**
     * Salvar Funcionário
     */
    public function salvarFuncionario(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO funcionarios (nome, cargo, cpf, admissao, vencimento_aso, tamanho_uniforme, epi_entregue, status, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $data['nome'] ?? '',
            $data['cargo'] ?? '',
            $data['cpf'] ?? '',
            $data['admissao'] ?? date('Y-m-d'),
            $data['vencimento_aso'] ?? '',
            $data['tamanho_uniforme'] ?? 'G',
            isset($data['epi_entregue']) ? 1 : 0,
            $data['status'] ?? 'ativo',
            $data['observacoes'] ?? ''
        ]);
    }

    /**
     * Módulo 2: Administrativo & Cofre de Documentos
     */
    public function getDadosAdministrativo(): array {
        $documentos = $this->db->query("SELECT * FROM cofre_documentos ORDER BY vencimento ASC")->fetchAll();
        $lembretes = $this->db->query("SELECT * FROM lembretes_agenda ORDER BY data_limite ASC")->fetchAll();
        $financeiro = $this->db->query("SELECT * FROM financeiro_basico ORDER BY vencimento ASC")->fetchAll();

        $totalPagar = 0;
        $totalReceber = 0;
        foreach ($financeiro as $fin) {
            if ($fin['tipo'] === 'pagar') $totalPagar += (float)$fin['valor'];
            if ($fin['tipo'] === 'receber') $totalReceber += (float)$fin['valor'];
        }

        return [
            'documentos' => $documentos,
            'lembretes' => $lembretes,
            'financeiro' => $financeiro,
            'totalPagar' => $totalPagar,
            'totalReceber' => $totalReceber,
            'alvarasVencendo' => array_filter($documentos, function($d) {
                if (empty($d['vencimento'])) return false;
                $diff = strtotime($d['vencimento']) - time();
                return $diff < (90 * 86400); // 90 dias
            })
        ];
    }

    /**
     * Salvar Documento no Cofre
     */
    public function salvarDocumentoCofre(array $data): bool {
        $stmt = $this->db->prepare("
            INSERT INTO cofre_documentos (titulo, categoria, vencimento, status, arquivo_nome, enviado_ao_contador)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        return $stmt->execute([
            $data['titulo'] ?? 'Documento Administrativo',
            $data['categoria'] ?? 'Geral',
            $data['vencimento'] ?? null,
            $data['status'] ?? 'valido',
            $data['arquivo_nome'] ?? 'documento.pdf',
            isset($data['enviado_ao_contador']) ? 1 : 0
        ]);
    }

    /**
     * Módulo 3: Central da Camilla
     */
    public function getDadosCamilla(): array {
        $leads = $this->db->query("SELECT * FROM leads_triagem ORDER BY id DESC LIMIT 10")->fetchAll();
        $historicoEnvios = [
            [
                'tipo' => 'WhatsApp',
                'destinatario' => 'Carlos Eduardo (Mecânico)',
                'assunto' => 'Envio de 2ª via do Holerite ref. 09/2026',
                'status' => 'Entregue com Sucesso',
                'data' => date('d/m/Y H:i', strtotime('-2 hours'))
            ],
            [
                'tipo' => 'E-mail',
                'destinatario' => CONTADOR_RESPONSAVEL_EMAIL,
                'assunto' => 'Remessa Mensal: Extratos Bancários + Despesas Consolidadas',
                'status' => 'Encaminhado ao Contador',
                'data' => date('d/m/Y H:i', strtotime('-5 hours'))
            ],
            [
                'tipo' => 'WhatsApp',
                'destinatario' => 'Mariana Fagundes',
                'assunto' => 'Lembrete Amigável: Renovação de ASO Periódico',
                'status' => 'Visualizado',
                'data' => date('d/m/Y H:i', strtotime('-1 day'))
            ]
        ];

        return [
            'leads' => $leads,
            'historico' => $historicoEnvios,
            'camillaInfo' => [
                'nome' => CAMILLA_NAME,
                'telefone' => CAMILLA_PHONE,
                'email' => CAMILLA_EMAIL,
                'cargo' => CAMILLA_ROLE,
                'contadorDestino' => CONTADOR_RESPONSAVEL_EMAIL,
                'webhookCentral' => CENTRAL_WEBHOOK_URL
            ]
        ];
    }
}
