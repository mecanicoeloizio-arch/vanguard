<?php
/**
 * EloWa - Servidor de WhatsApp Multi-Instância Oficial • Grupo Eloizio
 * Subdomínio: elowa.grupoeloizio.com.br
 * Motor: Integração Baileys (Whiskeysockets Baileys) com PHP 8.1+, cURL e Webhooks
 * Número Oficial Integrado: 21 99613-4073 (Camilla Faria & Grupo Eloizio)
 */

declare(strict_types=1);

define('ELOWA_ROOT_DIR', __DIR__);
define('ELOWA_STORAGE_DIR', __DIR__ . '/storage');
define('ELOWA_SESSIONS_DIR', __DIR__ . '/storage/sessions');
define('ELOWA_ATTACHMENTS_DIR', __DIR__ . '/storage/attachments');
define('ELOWA_INSTANCES_FILE', __DIR__ . '/storage/instances.json');
define('ELOWA_MESSAGES_FILE', __DIR__ . '/storage/messages.json');
define('ELOWA_LOGS_FILE', __DIR__ . '/storage/elowa_logs.json');

// Subdomínio e Configurações de Rede
define('ELOWA_SUBDOMAIN', 'elowa.grupoeloizio.com.br');
define('ELOWA_OFFICIAL_NUMBER', '5521996134073');
define('ELOWA_OFFICIAL_NUMBER_DISPLAY', '(21) 99613-4073');
define('ELOWA_CEO_NUMBER', '5521987648727');
define('ELOWA_CEO_NUMBER_DISPLAY', '(21) 98764-8727');

// Planos e Regras de Negócio
define('ELOWA_PLANS', [
    'vanguard_student' => [
        'name' => 'Aluno Vanguard Oficial',
        'price' => 0.00,
        'period' => 'Vitalício enquanto matriculado',
        'is_free' => true,
        'max_instances' => 1,
        'attachments_allowed' => ['text', 'audio', 'video', 'pdf', 'image'],
        'description' => 'Acesso 100% gratuito para prática de atendimento e estudos.'
    ],
    'subscriber_pro' => [
        'name' => 'Assinante Oficina Pro',
        'price' => 49.90,
        'period' => 'Mensal via Mercado Pago',
        'is_free' => false,
        'max_instances' => 2,
        'attachments_allowed' => ['text', 'audio', 'video', 'pdf', 'image'],
        'description' => 'Ideal para oficinas e mecânicos autônomos com disparo e atendimento.'
    ],
    'subscriber_enterprise' => [
        'name' => 'Assinante Corporativo Enterprise',
        'price' => 89.90,
        'period' => 'Mensal via Mercado Pago',
        'is_free' => false,
        'max_instances' => 5,
        'attachments_allowed' => ['text', 'audio', 'video', 'pdf', 'image'],
        'description' => 'Múltiplas instâncias, webhooks prioritários e suporte técnico 24/7.'
    ]
]);

// Garante que as pastas de armazenamento existam
if (!is_dir(ELOWA_STORAGE_DIR)) {
    mkdir(ELOWA_STORAGE_DIR, 0755, true);
}
if (!is_dir(ELOWA_SESSIONS_DIR)) {
    mkdir(ELOWA_SESSIONS_DIR, 0755, true);
}
if (!is_dir(ELOWA_ATTACHMENTS_DIR)) {
    mkdir(ELOWA_ATTACHMENTS_DIR, 0755, true);
}

/**
 * Inicializa instâncias padrão de teste e produção
 */
function initDefaultElowaInstances(): array
{
    if (file_exists(ELOWA_INSTANCES_FILE)) {
        $content = file_get_contents(ELOWA_INSTANCES_FILE);
        $decoded = json_decode((string)$content, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    $defaultInstances = [
        [
            'id' => 'inst_camilla_oficial',
            'name' => 'Camilla Faria • Grupo Eloizio Oficial',
            'phone' => '5521996134073',
            'phoneDisplay' => '(21) 99613-4073',
            'role' => 'admin_master',
            'isMaster' => true,
            'status' => 'connected',
            'battery' => 96,
            'plan' => 'vanguard_student',
            'isStudentFree' => true,
            'qrCode' => null,
            'pairingCode' => 'ELOW-9613',
            'createdAt' => '2026-01-10 08:00:00',
            'lastActive' => date('Y-m-d H:i:s'),
            'totalSent' => 1420,
            'totalReceived' => 2890,
            'webhookUrl' => 'https://elowa.grupoeloizio.com.br/api.php?action=webhook'
        ],
        [
            'id' => 'inst_aluno_lucas',
            'name' => 'Lucas Silva • Aluno Vanguard Mecânica',
            'phone' => '5521988771122',
            'phoneDisplay' => '(21) 98877-1122',
            'role' => 'student',
            'isMaster' => false,
            'status' => 'connected',
            'battery' => 84,
            'plan' => 'vanguard_student',
            'isStudentFree' => true,
            'qrCode' => null,
            'pairingCode' => 'VANG-1122',
            'createdAt' => '2026-02-15 14:30:00',
            'lastActive' => date('Y-m-d H:i:s'),
            'totalSent' => 310,
            'totalReceived' => 450,
            'webhookUrl' => ''
        ],
        [
            'id' => 'inst_oficina_sg',
            'name' => 'Oficina Mecânica São Gonçalo Pro',
            'phone' => '5521977665544',
            'phoneDisplay' => '(21) 97766-5544',
            'role' => 'subscriber',
            'isMaster' => false,
            'status' => 'connected',
            'battery' => 78,
            'plan' => 'subscriber_pro',
            'isStudentFree' => false,
            'subscriptionActive' => true,
            'mercadoPagoPaymentId' => 'MP-SUB-887419',
            'qrCode' => null,
            'pairingCode' => 'SGPR-5544',
            'createdAt' => '2026-03-01 10:15:00',
            'lastActive' => date('Y-m-d H:i:s'),
            'totalSent' => 890,
            'totalReceived' => 1120,
            'webhookUrl' => ''
        ]
    ];

    file_put_contents(ELOWA_INSTANCES_FILE, json_encode($defaultInstances, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return $defaultInstances;
}

/**
 * Inicializa mensagens padrão de teste com Texto, Áudio, Vídeo e PDF
 */
function initDefaultElowaMessages(): array
{
    if (file_exists(ELOWA_MESSAGES_FILE)) {
        $content = file_get_contents(ELOWA_MESSAGES_FILE);
        $decoded = json_decode((string)$content, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    $defaultMessages = [
        [
            'id' => 'msg_w1',
            'instanceId' => 'inst_camilla_oficial',
            'chatPhone' => '5521987648727',
            'chatName' => 'Eloizio Assunção (CEO Direção)',
            'fromMe' => false,
            'type' => 'text',
            'text' => 'Bom dia Camilla! Como estão as vendas do curso de manutenção de máquinas de costura e o atendimento dos novos alunos da Cooperativa hoje?',
            'timestamp' => date('Y-m-d H:i:s', strtotime('-40 minutes')),
            'status' => 'read',
            'media' => null
        ],
        [
            'id' => 'msg_w2',
            'instanceId' => 'inst_camilla_oficial',
            'chatPhone' => '5521987648727',
            'chatName' => 'Eloizio Assunção (CEO Direção)',
            'fromMe' => true,
            'type' => 'text',
            'text' => 'Bom dia Seu Eloizio! Já tomei minha primeira xícara de café ☕ e dei boot completo! Tivemos 8 matrículas confirmadas via Mercado Pago logo cedo. Estou acompanhando todos os leads aqui pelo painel EloWa!',
            'timestamp' => date('Y-m-d H:i:s', strtotime('-35 minutes')),
            'status' => 'read',
            'media' => null
        ],
        [
            'id' => 'msg_w3',
            'instanceId' => 'inst_camilla_oficial',
            'chatPhone' => '5521987648727',
            'chatName' => 'Eloizio Assunção (CEO Direção)',
            'fromMe' => true,
            'type' => 'audio',
            'text' => 'Áudio gravado por Camilla Faria (Relatório Geral)',
            'timestamp' => date('Y-m-d H:i:s', strtotime('-30 minutes')),
            'status' => 'read',
            'media' => [
                'type' => 'audio',
                'url' => 'https://actions.google.com/sounds/v1/human_voices/speaking_sample.ogg',
                'fileName' => 'audio_relatorio_camilla.ogg',
                'mimeType' => 'audio/ogg; codecs=opus',
                'size' => '340 KB',
                'duration' => 24
            ]
        ],
        [
            'id' => 'msg_w4',
            'instanceId' => 'inst_camilla_oficial',
            'chatPhone' => '5521998877665',
            'chatName' => 'Confecções Guanabara (Cliente Manutenção)',
            'fromMe' => false,
            'type' => 'text',
            'text' => 'Olá Camilla, nossa máquina galoneira industrial travou o looper inferior e quebrou duas agulhas seguidas. Pode nos enviar o manual técnico e orientar como regular?',
            'timestamp' => date('Y-m-d H:i:s', strtotime('-25 minutes')),
            'status' => 'read',
            'media' => null
        ],
        [
            'id' => 'msg_w5',
            'instanceId' => 'inst_camilla_oficial',
            'chatPhone' => '5521998877665',
            'chatName' => 'Confecções Guanabara (Cliente Manutenção)',
            'fromMe' => true,
            'type' => 'pdf',
            'text' => 'Segue em anexo o Manual Técnico Oficial de Regulagem de Looper e Lançadeiras!',
            'timestamp' => date('Y-m-d H:i:s', strtotime('-20 minutes')),
            'status' => 'read',
            'media' => [
                'type' => 'pdf',
                'url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'fileName' => 'Manual_Tecnico_Looper_Galoneira_Grupo_Eloizio.pdf',
                'mimeType' => 'application/pdf',
                'size' => '2.4 MB',
                'pages' => 48
            ]
        ],
        [
            'id' => 'msg_w6',
            'instanceId' => 'inst_camilla_oficial',
            'chatPhone' => '5521998877665',
            'chatName' => 'Confecções Guanabara (Cliente Manutenção)',
            'fromMe' => true,
            'type' => 'video',
            'text' => 'Gravei este vídeo demonstrativo prático da bancada mostrando o ajuste exato do sincronismo da barra da agulha!',
            'timestamp' => date('Y-m-d H:i:s', strtotime('-15 minutes')),
            'status' => 'read',
            'media' => [
                'type' => 'video',
                'url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'fileName' => 'Video_Ajuste_Sincronismo_Looper.mp4',
                'mimeType' => 'video/mp4',
                'size' => '8.2 MB',
                'duration' => 60
            ]
        ]
    ];

    file_put_contents(ELOWA_MESSAGES_FILE, json_encode($defaultMessages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    return $defaultMessages;
}
