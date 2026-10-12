<?php
/**
 * EloSign - Assinatura Eletrônica Inteligente para Oficinas Mecânicas e Cursos
 * Subdomínio Oficial: elosign.grupoeloizio.com.br
 * Validade Jurídica: Assinatura Eletrônica Avançada conforme Lei 14.063/2020 e MP 2.200-2/2001
 * Grupo Eloizio & EduVanguard
 */

declare(strict_types=1);

define('ELOSIGN_ROOT_DIR', __DIR__);
define('ELOSIGN_STORAGE_DIR', __DIR__ . '/storage');
define('ELOSIGN_ENVELOPES_FILE', __DIR__ . '/storage/envelopes.json');
define('ELOSIGN_TEMPLATES_FILE', __DIR__ . '/storage/templates.json');
define('ELOSIGN_AUDITS_FILE', __DIR__ . '/storage/audits.json');

define('ELOSIGN_SUBDOMAIN', 'elosign.grupoeloizio.com.br');
define('ELOSIGN_PRIMARY_COLOR', '#FF6B00'); // Laranja Oficina

// Planos do SaaS
define('ELOSIGN_PLANS', [
    'start' => [
        'name' => 'Plano Start Oficina',
        'price' => 39.00,
        'limit_docs' => 30,
        'whatsapp_direct' => false,
        'white_label' => false,
        'api_access' => false,
        'description' => 'Ideal para mecânicos autônomos iniciando na digitalização.'
    ],
    'pro' => [
        'name' => 'Plano Pro Oficina + Zap',
        'price' => 69.00,
        'limit_docs' => 100,
        'whatsapp_direct' => true,
        'white_label' => false,
        'api_access' => false,
        'description' => 'Disparos automáticos pelo WhatsApp e logo personalizada da oficina.'
    ],
    'enterprise' => [
        'name' => 'Plano Enterprise White Label',
        'price' => 129.00,
        'limit_docs' => 300,
        'whatsapp_direct' => true,
        'white_label' => true,
        'api_access' => true,
        'description' => 'Acesso completo à API, Widget para EloMak e remoção total da marca EloSign.'
    ]
]);

// Modelos prontos de documentos
define('ELOSIGN_DEFAULT_TEMPLATES', [
    [
        'id' => 'tpl_os_autorizacao',
        'title' => 'Ordem de Serviço - Autorização de Manutenção',
        'category' => 'Oficina Mecânica',
        'description' => 'Autorização expressa de desmontagem, diagnóstico e execução de reparos.',
        'content' => "TERMO DE AUTORIZAÇÃO DE SERVIÇO E DESMONTAGEM\n\nEu, {nome_cliente}, portador do CPF {cpf}, autorizo a Oficina Mecânica do Grupo Eloizio a realizar os procedimentos de inspeção técnica, desmontagem e manutenção no maquinário/veículo de placa {placa}, no valor estimado de R$ {valor_servico}.\n\nPrazo de garantia acordado: {prazo_garantia}.\nDeclaro ciência de que peças substituídas ficarão à disposição para conferência.",
        'variables' => ['nome_cliente', 'cpf', 'placa', 'valor_servico', 'prazo_garantia']
    ],
    [
        'id' => 'tpl_orcamento',
        'title' => 'Orçamento e Aprovação de Peças',
        'category' => 'Oficina Mecânica',
        'description' => 'Aprovação formal de orçamento com discriminação de peças e mão de obra.',
        'content' => "APROVAÇÃO FORMAL DE ORÇAMENTO TÉCNICO\n\nCliente: {nome_cliente} | CPF: {cpf}\nEquipamento/Placa: {placa}\n\nFica aprovada a ordem de compra de componentes e serviços técnicos no valor total de R$ {valor_servico}, com condições de pagamento acordadas previamente.\nGarantia de {prazo_garantia} em serviços executados.",
        'variables' => ['nome_cliente', 'cpf', 'placa', 'valor_servico', 'prazo_garantia']
    ],
    [
        'id' => 'tpl_garantia_motor',
        'title' => 'Termo de Garantia de Motor 90 dias',
        'category' => 'Oficina Mecânica',
        'description' => 'Termo formal de garantia legal e contratual para reparos de motor.',
        'content' => "CERTIFICADO DE GARANTIA DE MOTOR E RETÍFICA (90 DIAS)\n\nBeneficiário: {nome_cliente} - CPF: {cpf}\nIdentificação da Máquina/Placa: {placa}\nValor da Operação: R$ {valor_servico}\n\nA presente garantia cobre defeitos de montagem e ajuste mecânico pelo período de {prazo_garantia}, contados a partir da data de assinatura eletrônica deste instrumento.",
        'variables' => ['nome_cliente', 'cpf', 'placa', 'valor_servico', 'prazo_garantia']
    ],
    [
        'id' => 'tpl_contrato_vanguard',
        'title' => 'Contrato Curso Vanguard Cursos Livres',
        'category' => 'Educação',
        'description' => 'Contrato de prestação de serviços educacionais para formação profissionalizante.',
        'content' => "CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS - CURSO LIVRE PROFISSIONALIZANTE\n\nCONTRATANTE: {nome_cliente}, CPF: {cpf}.\nCONTRATADA: EduVanguard / Grupo Eloizio.\n\nCláusula 1ª: O presente instrumento tem como objeto a matrícula e fornecimento de material didático (manuais, apostilas e videoaulas), pelo valor de R$ {valor_servico}.\nCláusula 2ª: Em conformidade com a Lei nº 9.394/96 Art. 42 e Decreto nº 5.154/04, o curso confere certificação válida nacionalmente.",
        'variables' => ['nome_cliente', 'cpf', 'valor_servico']
    ],
    [
        'id' => 'tpl_uso_imagem',
        'title' => 'Autorização de Uso de Imagem e Depoimento',
        'category' => 'Geral',
        'description' => 'Termo para gravação de vídeos antes/depois de máquinas e depoimentos de alunos.',
        'content' => "AUTORIZAÇÃO DE USO DE IMAGEM, VOZ E NOME\n\nEu, {nome_cliente}, CPF {cpf}, autorizo a título gratuito a veiculação de imagens e fotos de reparo mecânico ou participação em cursos, para divulgação institucional e pedagógica nas redes sociais do Grupo Eloizio.",
        'variables' => ['nome_cliente', 'cpf']
    ]
]);

if (!is_dir(ELOSIGN_STORAGE_DIR)) {
    mkdir(ELOSIGN_STORAGE_DIR, 0755, true);
}
