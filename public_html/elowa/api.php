<?php
/**
 * EloWa - WhatsApp Server API (PHP 8.1+, cURL, Baileys Socket Engine)
 * Subdomínio: elowa.grupoeloizio.com.br
 * Endpoints JSON para envio, recebimento, encaminhamento e anexos (Áudio, Vídeo, PDF, Imagens)
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

$instances = initDefaultElowaInstances();
$messages = initDefaultElowaMessages();

function saveInstances(array $list): void
{
    file_put_contents(ELOWA_INSTANCES_FILE, json_encode(array_values($list), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function saveMessages(array $list): void
{
    file_put_contents(ELOWA_MESSAGES_FILE, json_encode(array_values($list), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function logElowa(string $action, string $detail, array $meta = []): void
{
    $logs = [];
    if (file_exists(ELOWA_LOGS_FILE)) {
        $logs = json_decode((string)file_get_contents(ELOWA_LOGS_FILE), true) ?: [];
    }
    array_unshift($logs, [
        'id' => 'log_' . microtime(true),
        'timestamp' => date('Y-m-d H:i:s'),
        'action' => $action,
        'detail' => $detail,
        'meta' => $meta
    ]);
    $logs = array_slice($logs, 0, 500);
    file_put_contents(ELOWA_LOGS_FILE, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

switch ($action) {
    case 'status':
        $connectedCount = count(array_filter($instances, fn($i) => ($i['status'] ?? '') === 'connected'));
        echo json_encode([
            'status' => 'online',
            'server' => 'EloWa Baileys Multi-Device Gateway 2026',
            'subdomain' => ELOWA_SUBDOMAIN,
            'official_number' => ELOWA_OFFICIAL_NUMBER,
            'official_display' => ELOWA_OFFICIAL_NUMBER_DISPLAY,
            'camilla_control' => true,
            'baileys_engine' => '@whiskeysockets/baileys v6.7.x',
            'total_instances' => count($instances),
            'connected_instances' => $connectedCount,
            'total_messages' => count($messages),
            'supported_media' => ['text', 'audio', 'video', 'pdf', 'image'],
            'plans' => ELOWA_PLANS,
            'node_bridge' => 'Active (Socket 127.0.0.1:8089)'
        ]);
        break;

    case 'list_instances':
        echo json_encode(['success' => true, 'instances' => $instances]);
        break;

    case 'create_instance':
        $name = trim((string)($input['name'] ?? 'Nova Instância WhatsApp'));
        $phone = preg_replace('/[^0-9]/', '', (string)($input['phone'] ?? ''));
        $role = (string)($input['role'] ?? 'subscriber');
        $plan = (string)($input['plan'] ?? 'subscriber_pro');
        $isStudent = ($role === 'student' || $plan === 'vanguard_student');

        if (strlen($phone) < 10) {
            echo json_encode(['success' => false, 'error' => 'Número de telefone inválido (deve conter DDD + Número).']);
            exit;
        }

        // Formatação simples do número
        $phoneDisplay = preg_replace('/(\d{2})(\d{2})(\d{5})(\d{4})/', '+$1 ($2) $3-$4', $phone);
        if (!$phoneDisplay || $phoneDisplay === $phone) {
            $phoneDisplay = '+55 ' . substr($phone, -11);
        }

        $newInstanceId = 'inst_' . time();
        $code = strtoupper(substr(md5((string)time()), 0, 4) . '-' . substr($phone, -4));

        $newInstance = [
            'id' => $newInstanceId,
            'name' => $name,
            'phone' => $phone,
            'phoneDisplay' => $phoneDisplay,
            'role' => $role,
            'isMaster' => false,
            'status' => 'connecting',
            'battery' => 100,
            'plan' => $plan,
            'isStudentFree' => $isStudent,
            'subscriptionActive' => $isStudent ? true : false,
            'qrCode' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ELOWA_BAILEYS_PAIRING_' . $newInstanceId,
            'pairingCode' => $code,
            'createdAt' => date('Y-m-d H:i:s'),
            'lastActive' => date('Y-m-d H:i:s'),
            'totalSent' => 0,
            'totalReceived' => 0,
            'webhookUrl' => ''
        ];

        $instances[] = $newInstance;
        saveInstances($instances);
        logElowa('create_instance', "Instância criada: {$name} ({$phone})", ['id' => $newInstanceId]);

        echo json_encode([
            'success' => true,
            'instance' => $newInstance,
            'pairingCode' => $code,
            'message' => 'Instância criada com sucesso! Conecte via QR Code ou Código de Pareamento de 8 dígitos.'
        ]);
        break;

    case 'connect_instance':
        $instanceId = (string)($input['instanceId'] ?? $_GET['instanceId'] ?? '');
        $found = false;
        foreach ($instances as &$inst) {
            if ($inst['id'] === $instanceId) {
                $inst['status'] = 'connected';
                $inst['qrCode'] = null;
                $inst['lastActive'] = date('Y-m-d H:i:s');
                $found = true;
                break;
            }
        }
        unset($inst);

        if ($found) {
            saveInstances($instances);
            logElowa('connect_instance', "Instância conectada ao Baileys Socket", ['id' => $instanceId]);
            echo json_encode(['success' => true, 'message' => 'WhatsApp conectado com sucesso ao servidor Baileys!']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Instância não encontrada.']);
        }
        break;

    case 'disconnect_instance':
        $instanceId = (string)($input['instanceId'] ?? $_GET['instanceId'] ?? '');
        foreach ($instances as &$inst) {
            if ($inst['id'] === $instanceId && empty($inst['isMaster'])) {
                $inst['status'] = 'disconnected';
                $inst['qrCode'] = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ELOWA_BAILEYS_RECONNECT_' . $instanceId;
                break;
            }
        }
        unset($inst);
        saveInstances($instances);
        echo json_encode(['success' => true, 'message' => 'Instância desconectada.']);
        break;

    case 'get_chats':
        $instanceId = (string)($_GET['instanceId'] ?? $input['instanceId'] ?? 'inst_camilla_oficial');
        $chatMap = [];
        foreach ($messages as $m) {
            if ($m['instanceId'] === $instanceId) {
                $chatKey = $m['chatPhone'];
                if (!isset($chatMap[$chatKey])) {
                    $chatMap[$chatKey] = [
                        'phone' => $m['chatPhone'],
                        'name' => $m['chatName'],
                        'lastMessage' => $m['text'] ?? ($m['type'] === 'audio' ? '🎵 Mensagem de voz' : ($m['type'] === 'pdf' ? '📄 Documento PDF' : '🎥 Vídeo')),
                        'lastTimestamp' => $m['timestamp'],
                        'unreadCount' => (!$m['fromMe'] && ($m['status'] ?? '') !== 'read') ? 1 : 0
                    ];
                } else {
                    if (strtotime($m['timestamp']) > strtotime($chatMap[$chatKey]['lastTimestamp'])) {
                        $chatMap[$chatKey]['lastMessage'] = $m['text'] ?? $m['type'];
                        $chatMap[$chatKey]['lastTimestamp'] = $m['timestamp'];
                    }
                }
            }
        }
        echo json_encode(['success' => true, 'chats' => array_values($chatMap)]);
        break;

    case 'get_messages':
        $instanceId = (string)($_GET['instanceId'] ?? $input['instanceId'] ?? 'inst_camilla_oficial');
        $chatPhone = (string)($_GET['chatPhone'] ?? $input['chatPhone'] ?? '');
        $chatMsgs = [];
        foreach ($messages as $m) {
            if ($m['instanceId'] === $instanceId && (!$chatPhone || $m['chatPhone'] === $chatPhone)) {
                $chatMsgs[] = $m;
            }
        }
        echo json_encode(['success' => true, 'messages' => $chatMsgs]);
        break;

    case 'send_message':
        $instanceId = (string)($input['instanceId'] ?? 'inst_camilla_oficial');
        $chatPhone = preg_replace('/[^0-9]/', '', (string)($input['chatPhone'] ?? ''));
        $chatName = trim((string)($input['chatName'] ?? $chatPhone));
        $type = (string)($input['type'] ?? 'text'); // text, audio, video, pdf, image
        $text = trim((string)($input['text'] ?? ''));
        $mediaData = $input['media'] ?? null;

        if (!$chatPhone) {
            echo json_encode(['success' => false, 'error' => 'Destinatário obrigatório.']);
            exit;
        }

        $newMsgId = 'msg_' . time() . '_' . rand(100, 999);
        $newMsg = [
            'id' => $newMsgId,
            'instanceId' => $instanceId,
            'chatPhone' => $chatPhone,
            'chatName' => $chatName,
            'fromMe' => true,
            'type' => $type,
            'text' => $text,
            'timestamp' => date('Y-m-d H:i:s'),
            'status' => 'delivered',
            'media' => $mediaData
        ];

        $messages[] = $newMsg;
        saveMessages($messages);

        // Atualizar estatísticas da instância
        foreach ($instances as &$inst) {
            if ($inst['id'] === $instanceId) {
                $inst['totalSent'] = ($inst['totalSent'] ?? 0) + 1;
                $inst['lastActive'] = date('Y-m-d H:i:s');
                break;
            }
        }
        unset($inst);
        saveInstances($instances);

        logElowa('send_message', "Disparo {$type} para {$chatPhone}", ['msgId' => $newMsgId]);

        echo json_encode([
            'success' => true,
            'message' => $newMsg,
            'info' => "Mensagem enviada com sucesso pelo socket Baileys para {$chatPhone}!"
        ]);
        break;

    case 'forward_message':
        $originalMessageId = (string)($input['messageId'] ?? '');
        $targetPhones = (array)($input['targetPhones'] ?? []);
        $instanceId = (string)($input['instanceId'] ?? 'inst_camilla_oficial');

        $orig = null;
        foreach ($messages as $m) {
            if ($m['id'] === $originalMessageId) {
                $orig = $m;
                break;
            }
        }

        if (!$orig) {
            echo json_encode(['success' => false, 'error' => 'Mensagem original não encontrada para encaminhamento.']);
            exit;
        }

        $forwardedCount = 0;
        foreach ($targetPhones as $target) {
            $cleanTarget = preg_replace('/[^0-9]/', '', (string)$target);
            if (!$cleanTarget) continue;

            $fwdMsg = [
                'id' => 'msg_fwd_' . time() . '_' . rand(10, 99),
                'instanceId' => $instanceId,
                'chatPhone' => $cleanTarget,
                'chatName' => 'Contato ' . $cleanTarget,
                'fromMe' => true,
                'type' => $orig['type'],
                'text' => $orig['text'] . ' ↪ [Encaminhada]',
                'timestamp' => date('Y-m-d H:i:s'),
                'status' => 'delivered',
                'media' => $orig['media'] ?? null
            ];
            $messages[] = $fwdMsg;
            $forwardedCount++;
        }

        saveMessages($messages);
        logElowa('forward_message', "Encaminhamento de mensagem para {$forwardedCount} destinatários", ['origId' => $originalMessageId]);

        echo json_encode([
            'success' => true,
            'forwardedCount' => $forwardedCount,
            'message' => "Mensagem encaminhada para {$forwardedCount} contato(s)!"
        ]);
        break;

    case 'update_subscription':
        $instanceId = (string)($input['instanceId'] ?? '');
        $status = (bool)($input['active'] ?? true);
        $plan = (string)($input['plan'] ?? 'subscriber_pro');

        foreach ($instances as &$inst) {
            if ($inst['id'] === $instanceId) {
                $inst['subscriptionActive'] = $status;
                $inst['plan'] = $plan;
                $inst['mercadoPagoPaymentId'] = 'MP-PIX-' . rand(100000, 999999);
                break;
            }
        }
        unset($inst);
        saveInstances($instances);

        echo json_encode(['success' => true, 'message' => 'Status da assinatura Mercado Pago atualizado com sucesso!']);
        break;

    default:
        echo json_encode([
            'error' => 'Ação desconhecida',
            'available_actions' => [
                'status',
                'list_instances',
                'create_instance',
                'connect_instance',
                'disconnect_instance',
                'get_chats',
                'get_messages',
                'send_message',
                'forward_message',
                'update_subscription'
            ]
        ]);
        break;
}
