<?php
/**
 * Grupo Eloizio Mail Server Configuration
 * Subdomínio: webmail.grupoeloizio.com.br
 * Suporta: PHPMailer, Multi-domínio, Alunos Vanguard (Gratuito) e Assinantes (Mercado Pago)
 */

declare(strict_types=1);

// Caminho de armazenamento local para mensagens e contas
define('MAIL_ROOT_DIR', __DIR__);
define('MAIL_STORAGE_DIR', __DIR__ . '/storage');
define('MAIL_ATTACHMENTS_DIR', __DIR__ . '/storage/attachments');
define('MAIL_BOXES_FILE', __DIR__ . '/storage/mailboxes.json');
define('MAIL_MESSAGES_FILE', __DIR__ . '/storage/emails.json');
define('MAIL_LOGS_FILE', __DIR__ . '/storage/mail_logs.json');

// Subdomínio e Domínios Suportados
define('MAIL_SUBDOMAIN', 'webmail.grupoeloizio.com.br');
define('MAIL_ALLOWED_DOMAINS', [
    'grupoeloizio.com.br',
    'eduvanguard.com.br',
    'aluno.eduvanguard.com.br'
]);

// Configurações SMTP / Servidor
define('MAIL_SMTP_HOST', getenv('MAIL_SMTP_HOST') ?: 'mail.grupoeloizio.com.br');
define('MAIL_SMTP_PORT', (int)(getenv('MAIL_SMTP_PORT') ?: 587));
define('MAIL_SMTP_SECURE', getenv('MAIL_SMTP_SECURE') ?: 'tls'); // 'tls' | 'ssl'
define('MAIL_SMTP_AUTH', true);
define('MAIL_DEFAULT_FROM', 'contato@grupoeloizio.com.br');
define('MAIL_DEFAULT_FROM_NAME', 'Grupo Eloizio Webmail');

// Planos & Cotas
define('MAIL_PLANS', [
    'vanguard_student' => [
        'name' => 'Aluno Vanguard Oficial',
        'is_free' => true,
        'price_monthly' => 0.00,
        'quota_mb' => 1024, // 1 GB
        'max_attachment_mb' => 25,
        'description' => 'Acesso 100% gratuito para todos os alunos matriculados nos cursos livres do Vanguard.',
        'allowed_domains' => ['aluno.eduvanguard.com.br', 'eduvanguard.com.br', 'grupoeloizio.com.br']
    ],
    'subscriber_pro' => [
        'name' => 'Assinante Profissional & Corporativo',
        'is_free' => false,
        'price_monthly' => 19.90,
        'price_yearly' => 180.00,
        'quota_mb' => 5120, // 5 GB
        'max_attachment_mb' => 50,
        'description' => 'E-mail corporativo com domínio próprio @grupoeloizio.com.br, suporte prioritário e alta entrega.',
        'allowed_domains' => ['grupoeloizio.com.br'],
        'mercadopago_checkout_url' => 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=PLAN_ELOIZIO_MAIL_PRO'
    ],
    'subscriber_enterprise' => [
        'name' => 'Assinante Enterprise Oficina / Oficina Mecânica',
        'is_free' => false,
        'price_monthly' => 39.90,
        'price_yearly' => 380.00,
        'quota_mb' => 15360, // 15 GB
        'max_attachment_mb' => 100,
        'description' => 'Até 5 caixas postais para oficinas, confecções e empresas parceiras do CEO Eloizio Assunção.',
        'allowed_domains' => ['grupoeloizio.com.br', 'eduvanguard.com.br'],
        'mercadopago_checkout_url' => 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=PLAN_ELOIZIO_MAIL_ENTERPRISE'
    ]
]);

// Criar pastas de armazenamento caso não existam
if (!is_dir(MAIL_STORAGE_DIR)) {
    @mkdir(MAIL_STORAGE_DIR, 0755, true);
}
if (!is_dir(MAIL_ATTACHMENTS_DIR)) {
    @mkdir(MAIL_ATTACHMENTS_DIR, 0755, true);
}

/**
 * Função utilitária para inicializar as caixas postais padrão
 */
function initDefaultMailboxes(): array
{
    if (file_exists(MAIL_BOXES_FILE)) {
        $data = json_decode((string)file_get_contents(MAIL_BOXES_FILE), true);
        if (is_array($data) && count($data) > 0) {
            return $data;
        }
    }

    $defaultBoxes = [
        [
            'id' => 'box_ceo_eloizio',
            'email' => 'eloizio@grupoeloizio.com.br',
            'name' => 'Eloizio Assunção (CEO)',
            'role' => 'admin',
            'plan' => 'admin_unlimited',
            'quota_mb' => 50000,
            'used_mb' => 342,
            'status' => 'active',
            'password_hash' => password_hash('Eloizio@2026', PASSWORD_BCRYPT),
            'created_at' => '2026-01-01 08:00:00'
        ],
        [
            'id' => 'box_gerente_camilla',
            'email' => 'camilla@grupoeloizio.com.br',
            'name' => 'Camilla Faria (Gerente Geral)',
            'role' => 'admin',
            'plan' => 'admin_unlimited',
            'quota_mb' => 50000,
            'used_mb' => 218,
            'status' => 'active',
            'password_hash' => password_hash('Camilla@2026', PASSWORD_BCRYPT),
            'created_at' => '2026-01-01 08:00:00'
        ],
        [
            'id' => 'box_contato_geral',
            'email' => 'contato@grupoeloizio.com.br',
            'name' => 'Atendimento Geral Grupo Eloizio',
            'role' => 'support',
            'plan' => 'admin_unlimited',
            'quota_mb' => 20000,
            'used_mb' => 520,
            'status' => 'active',
            'password_hash' => password_hash('Contato@2026', PASSWORD_BCRYPT),
            'created_at' => '2026-01-01 08:00:00'
        ],
        [
            'id' => 'box_aluno_lucas',
            'email' => 'lucas.silva@aluno.eduvanguard.com.br',
            'name' => 'Lucas Silva Prado',
            'role' => 'student',
            'plan' => 'vanguard_student',
            'quota_mb' => 1024,
            'used_mb' => 45,
            'status' => 'active',
            'is_student_free' => true,
            'course' => 'Engenharia de Software Moderna & Cloud',
            'password_hash' => password_hash('Aluno@2026', PASSWORD_BCRYPT),
            'created_at' => '2026-02-15 10:20:00'
        ],
        [
            'id' => 'box_aluno_carlos',
            'email' => 'carlos.mecanica@aluno.eduvanguard.com.br',
            'name' => 'Carlos Eduardo Santos',
            'role' => 'student',
            'plan' => 'vanguard_student',
            'quota_mb' => 1024,
            'used_mb' => 30,
            'status' => 'active',
            'is_student_free' => true,
            'course' => 'Mecânica e Manutenção de Máquinas de Costura',
            'password_hash' => password_hash('Aluno@2026', PASSWORD_BCRYPT),
            'created_at' => '2026-03-01 14:10:00'
        ],
        [
            'id' => 'box_assinante_oficina',
            'email' => 'oficina.central@grupoeloizio.com.br',
            'name' => 'Oficina Mecânica Central São Gonçalo',
            'role' => 'subscriber',
            'plan' => 'subscriber_pro',
            'quota_mb' => 5120,
            'used_mb' => 185,
            'status' => 'active',
            'subscription_payment_status' => 'paid_mercadopago',
            'subscription_expires_at' => '2027-02-28 23:59:59',
            'password_hash' => password_hash('Oficina@2026', PASSWORD_BCRYPT),
            'created_at' => '2026-02-28 09:30:00'
        ]
    ];

    file_put_contents(MAIL_BOXES_FILE, json_encode($defaultBoxes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return $defaultBoxes;
}

/**
 * Função utilitária para inicializar as mensagens padrão
 */
function initDefaultMessages(): array
{
    if (file_exists(MAIL_MESSAGES_FILE)) {
        $data = json_decode((string)file_get_contents(MAIL_MESSAGES_FILE), true);
        if (is_array($data) && count($data) > 0) {
            return $data;
        }
    }

    $defaultMsgs = [
        [
            'id' => 'msg_101',
            'mailbox' => 'camilla@grupoeloizio.com.br',
            'folder' => 'inbox',
            'from_name' => 'Eloizio Assunção (CEO)',
            'from_email' => 'eloizio@grupoeloizio.com.br',
            'to' => ['camilla@grupoeloizio.com.br'],
            'subject' => 'Autonomia confirmada para os Cursos Livres e Novo Servidor de E-mail Webmail',
            'date' => 'Hoje às 09:15',
            'timestamp' => time() - 3600,
            'read' => false,
            'starred' => true,
            'body_html' => '<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
                <p>Olá Camilla,</p>
                <p>Estou muito satisfeito com a sua condução no Grupo Eloizio! Conforme conversamos, você tem <strong>autonomia total</strong> para colocar em produção todos os nossos cursos profissionalizantes livres com seus respectivos manuais, livros digitais, apostilas e videoaulas à venda no Mercado Pago.</p>
                <p>Além disso, estamos inaugurando oficialmente nosso <strong>Servidor de E-mail Institucional</strong> em <code>webmail.grupoeloizio.com.br</code>. Todos os nossos alunos do Vanguard têm contas <strong>100% gratuitas</strong> (@aluno.eduvanguard.com.br), e os assinantes externos terão caixas profissionais pagas via Mercado Pago.</p>
                <p>Grande abraço,<br><strong>Eloizio Assunção</strong><br>Diretor Presidente & CEO</p>
            </div>',
            'attachments' => [
                [
                    'id' => 'att_101_1',
                    'name' => 'Diretrizes_Webmail_Cursos_Livres_2026.pdf',
                    'size' => '1.8 MB',
                    'type' => 'application/pdf',
                    'url' => '#'
                ]
            ]
        ],
        [
            'id' => 'msg_102',
            'mailbox' => 'camilla@grupoeloizio.com.br',
            'folder' => 'inbox',
            'from_name' => 'Secretaria Acadêmica Vanguard',
            'from_email' => 'secretaria@eduvanguard.com.br',
            'to' => ['camilla@grupoeloizio.com.br'],
            'subject' => 'Relatório Diário de Matrículas e Ativação de E-mails de Alunos',
            'date' => 'Hoje às 08:30',
            'timestamp' => time() - 7200,
            'read' => true,
            'starred' => false,
            'body_html' => '<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
                <p>Bom dia Gerente Camilla,</p>
                <p>Todas as novas matrículas processadas no Mercado Pago tiveram suas caixas postais geradas automaticamente com cota de 1 GB gratuita. Os alunos já receberam seus manuais e apostilas em anexo.</p>
                <p>Atenciosamente,<br><strong>Secretaria Geral Vanguard</strong></p>
            </div>',
            'attachments' => []
        ],
        [
            'id' => 'msg_103',
            'mailbox' => 'lucas.silva@aluno.eduvanguard.com.br',
            'folder' => 'inbox',
            'from_name' => 'Camilla Faria (Gerente Geral)',
            'from_email' => 'camilla@grupoeloizio.com.br',
            'to' => ['lucas.silva@aluno.eduvanguard.com.br'],
            'subject' => 'Boas-vindas ao seu E-mail Estudantil Oficial Vanguard (Gratuito)',
            'date' => 'Ontem às 17:40',
            'timestamp' => time() - 86400,
            'read' => false,
            'starred' => true,
            'body_html' => '<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
                <p>Olá Lucas!</p>
                <p>Seja muito bem-vindo ao seu Webmail Oficial do Grupo Eloizio! Como aluno ativo do curso <strong>Engenharia de Software Moderna & Cloud</strong>, sua caixa postal <code>lucas.silva@aluno.eduvanguard.com.br</code> é <strong>totalmente gratuita</strong>.</p>
                <p>Você pode usar este e-mail para receber notificações acadêmicas, carteirinha DNE oficial e submeter dúvidas aos tutores.</p>
                <p>Com carinho,<br><strong>Camilla Faria</strong><br>Gerente Geral & Atendente</p>
            </div>',
            'attachments' => [
                [
                    'id' => 'att_103_1',
                    'name' => 'Manual_Estudante_Webmail_Vanguard.pdf',
                    'size' => '2.4 MB',
                    'type' => 'application/pdf',
                    'url' => '#'
                ]
            ]
        ]
    ];

    file_put_contents(MAIL_MESSAGES_FILE, json_encode($defaultMsgs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return $defaultMsgs;
}
