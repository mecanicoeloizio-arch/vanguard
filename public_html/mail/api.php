<?php
/**
 * Grupo Eloizio Mail Server API (PHP 8.1+)
 * Endpoints JSON para envio, recebimento, encaminhamento, anexos e administração de caixas
 * Utiliza PHPMailer 6.9+
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';
require_once __DIR__ . '/PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Carregar caixas e mensagens
$mailboxes = initDefaultMailboxes();
$messages = initDefaultMessages();

function saveMailboxes(array $boxes): void
{
    file_put_contents(MAIL_BOXES_FILE, json_encode(array_values($boxes), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function saveMessages(array $msgs): void
{
    file_put_contents(MAIL_MESSAGES_FILE, json_encode(array_values($msgs), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function logMailActivity(string $action, string $detail, array $extra = []): void
{
    $logs = [];
    if (file_exists(MAIL_LOGS_FILE)) {
        $logs = json_decode((string)file_get_contents(MAIL_LOGS_FILE), true) ?: [];
    }
    array_unshift($logs, [
        'id' => 'log_' . microtime(true),
        'timestamp' => date('Y-m-d H:i:s'),
        'action' => $action,
        'detail' => $detail,
        'meta' => $extra
    ]);
    $logs = array_slice($logs, 0, 500); // Manter últimos 500 logs
    file_put_contents(MAIL_LOGS_FILE, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

switch ($action) {
    case 'status':
        echo json_encode([
            'status' => 'online',
            'server' => 'Grupo Eloizio Webmail Daemon 2026',
            'subdomain' => MAIL_SUBDOMAIN,
            'total_mailboxes' => count($mailboxes),
            'total_messages' => count($messages),
            'phpmailer_version' => '6.9.1',
            'supported_domains' => MAIL_ALLOWED_DOMAINS,
            'plans' => MAIL_PLANS
        ]);
        break;

    case 'list_mailboxes':
        // Listar caixas sem expor hash de senha
        $safeBoxes = array_map(function ($box) {
            unset($box['password_hash']);
            return $box;
        }, $mailboxes);

        echo json_encode(['success' => true, 'mailboxes' => $safeBoxes]);
        break;

    case 'create_mailbox':
        $email = strtolower(trim((string)($input['email'] ?? '')));
        $name = trim((string)($input['name'] ?? ''));
        $password = (string)($input['password'] ?? '');
        $plan = (string)($input['plan'] ?? 'vanguard_student');
        $course = (string)($input['course'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'error' => 'Formato de e-mail inválido.']);
            exit;
        }

        $domain = explode('@', $email)[1] ?? '';
        if (!in_array($domain, MAIL_ALLOWED_DOMAINS, true)) {
            echo json_encode([
                'success' => false,
                'error' => "Domínio @{$domain} não autorizado. Use: " . implode(', ', MAIL_ALLOWED_DOMAINS)
            ]);
            exit;
        }

        // Checar duplicidade
        foreach ($mailboxes as $b) {
            if (strtolower($b['email']) === $email) {
                echo json_encode(['success' => false, 'error' => 'Esta conta de e-mail já existe no servidor.']);
                exit;
            }
        }

        $planMeta = MAIL_PLANS[$plan] ?? MAIL_PLANS['vanguard_student'];
        $isStudent = ($plan === 'vanguard_student');

        $newBox = [
            'id' => 'box_' . md5($email . microtime()),
            'email' => $email,
            'name' => $name ?: explode('@', $email)[0],
            'role' => $isStudent ? 'student' : 'subscriber',
            'plan' => $plan,
            'quota_mb' => $planMeta['quota_mb'],
            'used_mb' => 2,
            'status' => 'active',
            'is_student_free' => $isStudent,
            'course' => $isStudent ? ($course ?: 'Cursos Livres Vanguard') : null,
            'subscription_payment_status' => $isStudent ? 'free_for_student' : 'pending_mercadopago',
            'password_hash' => password_hash($password ?: 'Vanguard@2026', PASSWORD_BCRYPT),
            'created_at' => date('Y-m-d H:i:s')
        ];

        $mailboxes[] = $newBox;
        saveMailboxes($mailboxes);

        logMailActivity('CREATE_MAILBOX', "Conta criada: {$email} (Plano: {$planMeta['name']})", [
            'email' => $email,
            'is_student_free' => $isStudent
        ]);

        // Enviar e-mail de boas-vindas na caixa do novo usuário
        $welcomeMsg = [
            'id' => 'msg_' . uniqid('wel_', true),
            'mailbox' => $email,
            'folder' => 'inbox',
            'from_name' => 'Camilla Faria (Gerente Geral)',
            'from_email' => 'camilla@grupoeloizio.com.br',
            'to' => [$email],
            'subject' => $isStudent
                ? '🎉 Bem-vindo ao seu E-mail Estudantil Oficial Vanguard (100% Gratuito)'
                : '✨ Bem-vindo ao seu E-mail Corporativo Profissional Grupo Eloizio',
            'date' => 'Hoje às ' . date('H:i'),
            'timestamp' => time(),
            'read' => false,
            'starred' => true,
            'body_html' => '<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">
                <p>Olá <strong>' . htmlspecialchars($name) . '</strong>,</p>
                <p>Sua conta de e-mail institucional <code>' . htmlspecialchars($email) . '</code> está ativa e configurada no servidor <strong>webmail.grupoeloizio.com.br</strong>!</p>
                <div style="background:#f1f5f9;padding:15px;border-radius:12px;margin:15px 0;">
                    <p style="margin:0 0 8px 0;"><strong>Detalhes da sua Conta:</strong></p>
                    <ul style="margin:0;padding-left:20px;">
                        <li><strong>Plano:</strong> ' . htmlspecialchars($planMeta['name']) . ($isStudent ? ' (Gratuito)' : '') . '</li>
                        <li><strong>Cota de Armazenamento:</strong> ' . $planMeta['quota_mb'] . ' MB</li>
                        <li><strong>Webmail de Acesso:</strong> <a href="http://webmail.grupoeloizio.com.br">webmail.grupoeloizio.com.br</a></li>
                    </ul>
                </div>
                <p>Você pode enviar e receber e-mails, adicionar anexos, encaminhar documentos e manter suas comunicações seguras.</p>
                <p>Com carinho,<br><strong>Camilla Faria</strong><br>Gerente Geral & Atendente Inteligente</p>
            </div>',
            'attachments' => []
        ];
        $messages[] = $welcomeMsg;
        saveMessages($messages);

        unset($newBox['password_hash']);
        echo json_encode(['success' => true, 'mailbox' => $newBox, 'message' => 'Conta criada com sucesso!']);
        break;

    case 'get_messages':
        $mailboxEmail = strtolower(trim((string)($input['mailbox'] ?? 'camilla@grupoeloizio.com.br')));
        $folder = strtolower(trim((string)($input['folder'] ?? 'inbox')));

        $filtered = array_values(array_filter($messages, function ($m) use ($mailboxEmail, $folder) {
            $isSameBox = (strtolower($m['mailbox'] ?? '') === $mailboxEmail);
            $isSameFolder = (($m['folder'] ?? 'inbox') === $folder);
            return $isSameBox && $isSameFolder;
        }));

        // Contadores de pastas
        $counts = [
            'inbox' => 0,
            'inbox_unread' => 0,
            'sent' => 0,
            'drafts' => 0,
            'trash' => 0,
            'spam' => 0
        ];

        foreach ($messages as $m) {
            if (strtolower($m['mailbox'] ?? '') === $mailboxEmail) {
                $f = $m['folder'] ?? 'inbox';
                if (isset($counts[$f])) {
                    $counts[$f]++;
                }
                if ($f === 'inbox' && empty($m['read'])) {
                    $counts['inbox_unread']++;
                }
            }
        }

        echo json_encode([
            'success' => true,
            'mailbox' => $mailboxEmail,
            'folder' => $folder,
            'messages' => $filtered,
            'counts' => $counts
        ]);
        break;

    case 'get_message_detail':
        $msgId = (string)($input['id'] ?? '');
        $found = null;

        foreach ($messages as &$m) {
            if ($m['id'] === $msgId) {
                $m['read'] = true; // Marcar como lida
                $found = $m;
                break;
            }
        }
        unset($m);

        if ($found) {
            saveMessages($messages);
            echo json_encode(['success' => true, 'message' => $found]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Mensagem não encontrada.']);
        }
        break;

    case 'send_message':
        $fromEmail = strtolower(trim((string)($input['from_email'] ?? 'camilla@grupoeloizio.com.br')));
        $fromName = trim((string)($input['from_name'] ?? 'Camilla Faria'));
        $to = is_array($input['to'] ?? null) ? $input['to'] : array_map('trim', explode(',', (string)($input['to'] ?? '')));
        $subject = trim((string)($input['subject'] ?? '(Sem Assunto)'));
        $bodyHtml = (string)($input['body_html'] ?? $input['body'] ?? '');
        $attachments = is_array($input['attachments'] ?? null) ? $input['attachments'] : [];

        if (empty($to)) {
            echo json_encode(['success' => false, 'error' => 'Informe pelo menos um destinatário.']);
            exit;
        }

        // Inicializar PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = MAIL_SMTP_HOST;
            $mail->Port = MAIL_SMTP_PORT;
            $mail->SMTPSecure = MAIL_SMTP_SECURE;
            $mail->SMTPAuth = true;
            $mail->setFrom($fromEmail, $fromName);

            foreach ($to as $rcpt) {
                $rcpt = trim($rcpt);
                if (filter_var($rcpt, FILTER_VALIDATE_EMAIL)) {
                    $mail->addAddress($rcpt);
                }
            }

            $mail->Subject = $subject;
            $mail->isHTML(true);
            $mail->Body = $bodyHtml;
            $mail->AltBody = strip_tags($bodyHtml);

            // Anexos
            foreach ($attachments as $att) {
                if (!empty($att['content_base64']) && !empty($att['name'])) {
                    $binary = base64_decode($att['content_base64']);
                    $mail->addStringAttachment($binary, $att['name'], 'base64', $att['type'] ?? 'application/octet-stream');
                }
            }

            // Executar envio PHPMailer
            $mail->send();

            // Salvar na pasta "sent" do remetente
            $msgId = 'msg_' . uniqid('sent_', true);
            $sentMessage = [
                'id' => $msgId,
                'mailbox' => $fromEmail,
                'folder' => 'sent',
                'from_name' => $fromName,
                'from_email' => $fromEmail,
                'to' => $to,
                'subject' => $subject,
                'date' => 'Hoje às ' . date('H:i'),
                'timestamp' => time(),
                'read' => true,
                'starred' => false,
                'body_html' => $bodyHtml,
                'attachments' => array_map(function ($att) {
                    return [
                        'id' => 'att_' . uniqid(),
                        'name' => $att['name'] ?? 'anexo.pdf',
                        'size' => $att['size'] ?? '1.2 MB',
                        'type' => $att['type'] ?? 'application/pdf',
                        'url' => '#'
                    ];
                }, $attachments)
            ];
            $messages[] = $sentMessage;

            // Se o destinatário for uma caixa interna do servidor, entregar na "inbox" dele também!
            foreach ($to as $targetEmail) {
                $targetEmail = strtolower(trim($targetEmail));
                foreach ($mailboxes as $b) {
                    if (strtolower($b['email']) === $targetEmail) {
                        $inboxMessage = $sentMessage;
                        $inboxMessage['id'] = 'msg_' . uniqid('in_', true);
                        $inboxMessage['mailbox'] = $targetEmail;
                        $inboxMessage['folder'] = 'inbox';
                        $inboxMessage['read'] = false;
                        $messages[] = $inboxMessage;
                        break;
                    }
                }
            }

            saveMessages($messages);
            logMailActivity('SEND_MAIL', "E-mail enviado de {$fromEmail} para " . implode(', ', $to), [
                'subject' => $subject,
                'attachments_count' => count($attachments)
            ]);

            echo json_encode([
                'success' => true,
                'message' => 'E-mail enviado com sucesso via PHPMailer!',
                'msg_id' => $msgId
            ]);
        } catch (\Exception $e) {
            echo json_encode([
                'success' => false,
                'error' => 'Falha no envio PHPMailer: ' . $e->getMessage()
            ]);
        }
        break;

    case 'forward_message':
        $origMsgId = (string)($input['original_id'] ?? '');
        $forwardTo = is_array($input['to'] ?? null) ? $input['to'] : array_map('trim', explode(',', (string)($input['to'] ?? '')));
        $fromEmail = strtolower(trim((string)($input['from_email'] ?? 'camilla@grupoeloizio.com.br')));
        $notes = (string)($input['notes'] ?? '');

        $orig = null;
        foreach ($messages as $m) {
            if ($m['id'] === $origMsgId) {
                $orig = $m;
                break;
            }
        }

        if (!$orig) {
            echo json_encode(['success' => false, 'error' => 'Mensagem original não encontrada.']);
            exit;
        }

        $fwdSubject = (str_starts_with($orig['subject'], 'Fwd:') ? '' : 'Fwd: ') . $orig['subject'];
        $fwdBody = '<div style="font-family:sans-serif;line-height:1.6;">'
            . ($notes ? '<p>' . nl2br(htmlspecialchars($notes)) . '</p><hr style="border:0;border-top:1px solid #cbd5e1;margin:15px 0;">' : '')
            . '<p style="color:#64748b;font-size:12px;">---------- Mensagem Encaminhada ----------<br>'
            . 'De: ' . htmlspecialchars($orig['from_name']) . ' &lt;' . htmlspecialchars($orig['from_email']) . '&gt;<br>'
            . 'Data: ' . htmlspecialchars($orig['date']) . '<br>'
            . 'Assunto: ' . htmlspecialchars($orig['subject']) . '<br>'
            . 'Para: ' . htmlspecialchars(implode(', ', $orig['to'])) . '</p>'
            . $orig['body_html']
            . '</div>';

        // Reutilizar send_message
        $newSent = [
            'id' => 'msg_' . uniqid('fwd_', true),
            'mailbox' => $fromEmail,
            'folder' => 'sent',
            'from_name' => 'Camilla Faria',
            'from_email' => $fromEmail,
            'to' => $forwardTo,
            'subject' => $fwdSubject,
            'date' => 'Hoje às ' . date('H:i'),
            'timestamp' => time(),
            'read' => true,
            'starred' => false,
            'body_html' => $fwdBody,
            'attachments' => $orig['attachments'] ?? []
        ];
        $messages[] = $newSent;

        // Entregar em caixas internas
        foreach ($forwardTo as $targetEmail) {
            $targetEmail = strtolower(trim($targetEmail));
            foreach ($mailboxes as $b) {
                if (strtolower($b['email']) === $targetEmail) {
                    $targetInbox = $newSent;
                    $targetInbox['id'] = 'msg_' . uniqid('in_', true);
                    $targetInbox['mailbox'] = $targetEmail;
                    $targetInbox['folder'] = 'inbox';
                    $targetInbox['read'] = false;
                    $messages[] = $targetInbox;
                    break;
                }
            }
        }

        saveMessages($messages);
        logMailActivity('FORWARD_MAIL', "Mensagem {$origMsgId} encaminhada para " . implode(', ', $forwardTo));
        echo json_encode(['success' => true, 'message' => 'Mensagem e anexos encaminhados com sucesso!']);
        break;

    case 'delete_message':
        $msgId = (string)($input['id'] ?? '');
        $permanent = (bool)($input['permanent'] ?? false);

        $changed = false;
        foreach ($messages as $idx => &$m) {
            if ($m['id'] === $msgId) {
                if ($permanent || ($m['folder'] ?? '') === 'trash') {
                    array_splice($messages, $idx, 1);
                } else {
                    $m['folder'] = 'trash';
                }
                $changed = true;
                break;
            }
        }
        unset($m);

        if ($changed) {
            saveMessages($messages);
            echo json_encode(['success' => true, 'message' => 'Operação concluída com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Mensagem não encontrada.']);
        }
        break;

    case 'update_subscription':
        $boxEmail = strtolower(trim((string)($input['email'] ?? '')));
        $status = (string)($input['status'] ?? 'active'); // 'active' | 'suspended' | 'cancelled'
        $plan = (string)($input['plan'] ?? 'subscriber_pro');

        $found = false;
        foreach ($mailboxes as &$b) {
            if (strtolower($b['email']) === $boxEmail) {
                $b['status'] = $status;
                $b['plan'] = $plan;
                $b['subscription_payment_status'] = ($status === 'active') ? 'paid_mercadopago' : 'pending_mercadopago';
                $found = true;
                break;
            }
        }
        unset($b);

        if ($found) {
            saveMailboxes($mailboxes);
            logMailActivity('SUBSCRIPTION_UPDATE', "Assinatura de {$boxEmail} alterada para {$status} ({$plan})");
            echo json_encode(['success' => true, 'message' => 'Status da assinatura atualizado com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Conta não encontrada.']);
        }
        break;

    case 'smtp_logs':
        $logs = [];
        if (file_exists(MAIL_LOGS_FILE)) {
            $logs = json_decode((string)file_get_contents(MAIL_LOGS_FILE), true) ?: [];
        }
        echo json_encode(['success' => true, 'logs' => $logs]);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Ação não reconhecida. Use ?action=status']);
        break;
}
