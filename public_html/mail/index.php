<?php
/**
 * Grupo Eloizio Webmail - Interface Oficial do Usuário (HTML5, Tailwind CSS, jQuery)
 * Subdomínio: webmail.grupoeloizio.com.br
 * Alunos Vanguard: Gratuito | Assinantes: Pago via Mercado Pago
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$mailboxes = initDefaultMailboxes();
$messages = initDefaultMessages();

// Caixa postal ativa selecionada (padrão Camilla Faria ou passada via GET)
$currentEmail = $_GET['box'] ?? 'camilla@grupoeloizio.com.br';
$currentBox = null;
foreach ($mailboxes as $b) {
    if (strtolower($b['email']) === strtolower($currentEmail)) {
        $currentBox = $b;
        break;
    }
}
if (!$currentBox && count($mailboxes) > 0) {
    $currentBox = $mailboxes[0];
    $currentEmail = $currentBox['email'];
}

$currentFolder = $_GET['folder'] ?? 'inbox';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webmail Grupo Eloizio & Vanguard • webmail.grupoeloizio.com.br</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased h-screen flex flex-col overflow-hidden">

  <!-- TOP BAR: SUBDOMÍNIO & SELETOR DE CONTA -->
  <header class="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-md">
        ✉
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-sm sm:text-base tracking-tight text-white">Webmail Grupo Eloizio</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
            webmail.grupoeloizio.com.br
          </span>
        </div>
        <p class="text-[11px] text-slate-400">
          Servidor Institucional com PHPMailer 6.9+ • Vanguard Cursos & Assinantes
        </p>
      </div>
    </div>

    <!-- Seletor de Caixa Postal e Ações -->
    <div class="flex items-center gap-3">
      <!-- Seletor de Conta -->
      <div class="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
        <span class="text-slate-400 text-[11px]">Conta Ativa:</span>
        <select id="selectMailbox" class="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer">
          <?php foreach ($mailboxes as $b): ?>
            <option value="<?= htmlspecialchars($b['email']) ?>" <?= (strtolower($b['email']) === strtolower($currentEmail)) ? 'selected' : '' ?> class="bg-slate-800 text-white">
              <?= htmlspecialchars($b['name']) ?> (<?= htmlspecialchars($b['email']) ?>)
            </option>
          <?php endforeach; ?>
        </select>
      </div>

      <!-- Link para o Painel Admin -->
      <a href="admin.php" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
        <span>⚙️ Painel Servidor</span>
      </a>

      <!-- Voltar ao Portal Principal -->
      <a href="../" class="hidden sm:flex px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition items-center gap-1.5">
        <span>Portal Principal &rarr;</span>
      </a>
    </div>
  </header>

  <!-- CORPO PRINCIPAL DO CLIENTE DE E-MAIL (3 COLUNAS) -->
  <div class="flex-1 flex overflow-hidden">

    <!-- COLUNA 1: PASTAS, COTA & COMPOSITOR (SIDEBAR ESQUERDA) -->
    <aside class="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0">
      <div class="space-y-4">
        <!-- Botão Escrever Mensagem -->
        <button id="btnOpenCompose" class="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer">
          <span class="text-base">✍️</span>
          <span>Nova Mensagem</span>
        </button>

        <!-- Informações do Usuário & Plano -->
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-slate-900 truncate"><?= htmlspecialchars($currentBox['name'] ?? 'Usuário') ?></span>
          </div>
          <p class="text-[11px] text-slate-500 font-mono truncate"><?= htmlspecialchars($currentBox['email'] ?? '') ?></p>

          <div class="pt-1.5 flex items-center justify-between border-t border-slate-200/60">
            <?php if (!empty($currentBox['is_student_free'])): ?>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ Aluno Vanguard (Gratuito)
              </span>
            <?php else: ?>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                Assinante Corporativo
              </span>
            <?php endif; ?>
          </div>
        </div>

        <!-- Árvore de Pastas -->
        <nav class="space-y-1 text-xs font-semibold">
          <a href="?box=<?= urlencode($currentEmail) ?>&folder=inbox" class="folder-link flex items-center justify-between px-3 py-2.5 rounded-xl transition <?= ($currentFolder === 'inbox') ? 'bg-indigo-50 text-indigo-700 font-extrabold' : 'text-slate-600 hover:bg-slate-100' ?>">
            <span class="flex items-center gap-2.5">
              <span>📥</span>
              <span>Caixa de Entrada</span>
            </span>
            <span id="badgeInboxCount" class="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-black">
              0
            </span>
          </a>

          <a href="?box=<?= urlencode($currentEmail) ?>&folder=sent" class="folder-link flex items-center justify-between px-3 py-2.5 rounded-xl transition <?= ($currentFolder === 'sent') ? 'bg-indigo-50 text-indigo-700 font-extrabold' : 'text-slate-600 hover:bg-slate-100' ?>">
            <span class="flex items-center gap-2.5">
              <span>📤</span>
              <span>Enviados</span>
            </span>
            <span id="badgeSentCount" class="text-slate-400 font-mono text-[10px]">0</span>
          </a>

          <a href="?box=<?= urlencode($currentEmail) ?>&folder=drafts" class="folder-link flex items-center justify-between px-3 py-2.5 rounded-xl transition <?= ($currentFolder === 'drafts') ? 'bg-indigo-50 text-indigo-700 font-extrabold' : 'text-slate-600 hover:bg-slate-100' ?>">
            <span class="flex items-center gap-2.5">
              <span>📝</span>
              <span>Rascunhos</span>
            </span>
            <span id="badgeDraftsCount" class="text-slate-400 font-mono text-[10px]">0</span>
          </a>

          <a href="?box=<?= urlencode($currentEmail) ?>&folder=spam" class="folder-link flex items-center justify-between px-3 py-2.5 rounded-xl transition <?= ($currentFolder === 'spam') ? 'bg-indigo-50 text-indigo-700 font-extrabold' : 'text-slate-600 hover:bg-slate-100' ?>">
            <span class="flex items-center gap-2.5">
              <span>🛡️</span>
              <span>Spam / Quarentena</span>
            </span>
            <span id="badgeSpamCount" class="text-slate-400 font-mono text-[10px]">0</span>
          </a>

          <a href="?box=<?= urlencode($currentEmail) ?>&folder=trash" class="folder-link flex items-center justify-between px-3 py-2.5 rounded-xl transition <?= ($currentFolder === 'trash') ? 'bg-indigo-50 text-indigo-700 font-extrabold' : 'text-slate-600 hover:bg-slate-100' ?>">
            <span class="flex items-center gap-2.5">
              <span>🗑️</span>
              <span>Lixeira</span>
            </span>
            <span id="badgeTrashCount" class="text-slate-400 font-mono text-[10px]">0</span>
          </a>
        </nav>
      </div>

      <!-- Cota de Armazenamento -->
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
        <div class="flex items-center justify-between text-[11px] text-slate-600">
          <span class="font-bold">Armazenamento</span>
          <span id="quotaText" class="font-mono">
            <?= (int)($currentBox['used_mb'] ?? 20) ?> MB / <?= (int)($currentBox['quota_mb'] ?? 1024) ?> MB
          </span>
        </div>
        <?php
          $usedMb = (int)($currentBox['used_mb'] ?? 20);
          $quotaMb = max(1, (int)($currentBox['quota_mb'] ?? 1024));
          $pct = min(100, round(($usedMb / $quotaMb) * 100));
        ?>
        <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div class="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full" style="width: <?= $pct ?>%"></div>
        </div>
        <p class="text-[10px] text-slate-400 text-center">
          Servidor SMTP/IMAP Grupo Eloizio 2026
        </p>
      </div>
    </aside>

    <!-- COLUNA 2: LISTAGEM DE MENSAGENS -->
    <section class="w-80 sm:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      <!-- Barra de Busca & Atualização -->
      <div class="p-3 border-b border-slate-200 flex items-center gap-2">
        <div class="relative flex-1">
          <input
            type="text"
            id="searchMessages"
            placeholder="Pesquisar e-mails, remetente, assunto..."
            class="w-full pl-8 pr-3 py-2 bg-slate-100 rounded-xl text-xs border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-hidden transition"
          >
          <span class="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
        <button id="btnRefreshMessages" class="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer" title="Atualizar mensagens">
          🔄
        </button>
      </div>

      <!-- Lista de E-mails com Scroll -->
      <div id="messagesListContainer" class="flex-1 overflow-y-auto divide-y divide-slate-100">
        <div class="p-8 text-center text-slate-400 text-xs">
          Carregando mensagens da caixa postal...
        </div>
      </div>
    </section>

    <!-- COLUNA 3: LEITOR DE E-MAIL (MENSAGEM SELECIONADA) -->
    <main class="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      <!-- Barra Superior de Ações da Mensagem -->
      <div id="readerActionBar" class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 hidden">
        <div class="flex items-center gap-2">
          <button id="btnReply" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
            <span>↩️</span>
            <span>Responder</span>
          </button>
          <button id="btnForward" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
            <span>↪️</span>
            <span>Encaminhar</span>
          </button>
          <button id="btnDeleteMsg" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
            <span>🗑️</span>
            <span>Excluir</span>
          </button>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-500">
          <button onclick="window.print()" class="p-1.5 rounded-lg hover:bg-slate-100" title="Imprimir mensagem">
            🖨️
          </button>
        </div>
      </div>

      <!-- Área de Visualização do Conteúdo -->
      <div id="readerEmptyState" class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
        <div class="w-16 h-16 rounded-3xl bg-slate-200/60 flex items-center justify-center text-3xl">
          ✉️
        </div>
        <h4 class="font-extrabold text-sm text-slate-700">Nenhum e-mail selecionado</h4>
        <p class="text-xs text-slate-500 max-w-sm">
          Selecione uma mensagem na lista à esquerda para ler o conteúdo, visualizar anexos e responder diretamente pelo servidor.
        </p>
      </div>

      <div id="readerContent" class="flex-1 overflow-y-auto p-6 space-y-6 hidden">
        <!-- Cabeçalho do E-mail -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-start justify-between gap-4">
            <h2 id="viewSubject" class="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              Assunto da Mensagem
            </h2>
            <span id="viewDate" class="text-xs text-slate-400 font-mono shrink-0">
              Hoje às 10:00
            </span>
          </div>

          <div class="flex items-center gap-3 pt-2 border-t border-slate-100">
            <div id="viewSenderAvatar" class="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              E
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span id="viewFromName" class="font-extrabold text-xs text-slate-900 block truncate">Eloizio Assunção</span>
                <span id="viewFromEmail" class="text-[11px] text-slate-500 font-mono block truncate">&lt;eloizio@grupoeloizio.com.br&gt;</span>
              </div>
              <p class="text-[11px] text-slate-400 truncate">Para: <span id="viewTo">camilla@grupoeloizio.com.br</span></p>
            </div>
          </div>
        </div>

        <!-- Seção de Anexos (se houver) -->
        <div id="viewAttachmentsContainer" class="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 space-y-3 hidden">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black uppercase text-indigo-950 flex items-center gap-1.5">
              <span>📎</span>
              <span>Anexos da Mensagem</span>
            </h4>
            <span id="viewAttachmentCountBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-200 text-indigo-900">
              1 arquivo
            </span>
          </div>
          <div id="viewAttachmentsList" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <!-- Anexos renderizados via JS -->
          </div>
        </div>

        <!-- Corpo do E-mail (HTML Seguro) -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs min-h-[300px]">
          <div id="viewBodyHtml" class="prose max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed">
            <!-- Corpo HTML renderizado -->
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- MODAL: NOVA MENSAGEM / COMPOR E-MAIL -->
  <div id="modalCompose" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
      <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">✍️</span>
          <h3 class="font-extrabold text-sm">Nova Mensagem de E-mail • PHPMailer</h3>
        </div>
        <button id="btnCloseCompose" class="p-1 rounded-xl text-slate-400 hover:text-white transition">
          ✕
        </button>
      </div>

      <form id="formSendMessage" class="flex-1 overflow-y-auto p-6 space-y-4">
        <!-- De (Remetente) -->
        <div>
          <label class="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">De (Remetente Oficial)</label>
          <input
            type="text"
            id="composeFrom"
            readonly
            value="<?= htmlspecialchars($currentBox['email'] ?? 'camilla@grupoeloizio.com.br') ?>"
            class="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs font-mono text-slate-700 border border-slate-200 font-bold"
          >
        </div>

        <!-- Para (Destinatário) -->
        <div>
          <label class="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">Para (Destinatários separados por vírgula)</label>
          <input
            type="text"
            id="composeTo"
            required
            placeholder="ex: aluno@eduvanguard.com.br, eloizio@grupoeloizio.com.br"
            class="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-900 border border-slate-300 focus:border-indigo-600 focus:outline-hidden"
          >
        </div>

        <!-- Assunto -->
        <div>
          <label class="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">Assunto</label>
          <input
            type="text"
            id="composeSubject"
            required
            placeholder="Informe o assunto do e-mail"
            class="w-full px-3.5 py-2.5 bg-white rounded-xl text-xs text-slate-900 border border-slate-300 focus:border-indigo-600 focus:outline-hidden font-semibold"
          >
        </div>

        <!-- Mensagem -->
        <div>
          <label class="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">Conteúdo da Mensagem (HTML / Texto)</label>
          <textarea
            id="composeBody"
            required
            rows="8"
            placeholder="Digite o conteúdo da sua mensagem aqui..."
            class="w-full p-3.5 bg-white rounded-xl text-xs text-slate-900 border border-slate-300 focus:border-indigo-600 focus:outline-hidden leading-relaxed"
          ></textarea>
        </div>

        <!-- Anexos -->
        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <span>📎</span>
              <span>Anexar Arquivos (PDF, Manuais, Documentos, Imagens)</span>
            </span>
            <input type="file" id="composeFileInput" multiple class="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer">
          </div>
          <div id="composeAttachmentsPreview" class="text-[11px] text-slate-500 font-mono">
            Nenhum anexo selecionado
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button type="button" id="btnCancelCompose" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
            Cancelar
          </button>
          <button type="submit" id="btnSubmitSend" class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer">
            <span>🚀 Enviar via PHPMailer</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <script>
    // Estado do Webmail em JavaScript
    const currentMailbox = <?= json_encode($currentEmail) ?>;
    const currentFolder = <?= json_encode($currentFolder) ?>;
    let loadedMessages = [];
    let selectedMessageId = null;
    let stagedAttachments = [];

    // Mudar de Caixa Postal
    $('#selectMailbox').on('change', function() {
      const selected = $(this).val();
      window.location.href = '?box=' + encodeURIComponent(selected) + '&folder=inbox';
    });

    // Carregar Mensagens via API
    function fetchMessages() {
      $('#messagesListContainer').html('<div class="p-8 text-center text-slate-400 text-xs">Atualizando caixa postal...</div>');

      $.ajax({
        url: 'api.php?action=get_messages',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          mailbox: currentMailbox,
          folder: currentFolder
        }),
        success: function(resp) {
          if (resp && resp.success) {
            loadedMessages = resp.messages || [];

            // Atualizar contadores
            if (resp.counts) {
              $('#badgeInboxCount').text(resp.counts.inbox_unread || 0);
              $('#badgeSentCount').text(resp.counts.sent || 0);
              $('#badgeDraftsCount').text(resp.counts.drafts || 0);
              $('#badgeSpamCount').text(resp.counts.spam || 0);
              $('#badgeTrashCount').text(resp.counts.trash || 0);
            }

            renderMessagesList(loadedMessages);
          } else {
            $('#messagesListContainer').html('<div class="p-8 text-center text-rose-500 text-xs">Erro ao carregar mensagens.</div>');
          }
        },
        error: function() {
          $('#messagesListContainer').html('<div class="p-8 text-center text-rose-500 text-xs">Servidor temporariamente indisponível.</div>');
        }
      });
    }

    // Renderizar lista de e-mails
    function renderMessagesList(list) {
      if (list.length === 0) {
        $('#messagesListContainer').html('<div class="p-8 text-center text-slate-400 text-xs">Nenhum e-mail nesta pasta.</div>');
        return;
      }

      let html = '';
      list.forEach(function(msg) {
        const isUnread = !msg.read;
        const hasAtt = msg.attachments && msg.attachments.length > 0;
        const isSelected = msg.id === selectedMessageId;

        html += `
          <div
            onclick="selectMessage('${msg.id}')"
            class="p-4 hover:bg-slate-50 cursor-pointer transition space-y-1.5 ${isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : ''} ${isUnread ? 'bg-white font-bold' : 'bg-slate-50/40 text-slate-600'}"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 truncate">
                ${isUnread ? '<span class="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>' : ''}
                <span class="text-xs text-slate-900 truncate ${isUnread ? 'font-extrabold' : 'font-medium'}">${msg.from_name || msg.from_email}</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono shrink-0">${msg.date}</span>
            </div>

            <h5 class="text-xs text-slate-800 line-clamp-1 ${isUnread ? 'font-black' : 'font-semibold'}">
              ${msg.subject}
            </h5>

            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span class="line-clamp-1 flex-1">${$('<div>').html(msg.body_html).text().substring(0, 50)}...</span>
              ${hasAtt ? '<span class="ml-2 text-indigo-600 font-bold shrink-0">📎 ' + msg.attachments.length + '</span>' : ''}
            </div>
          </div>
        `;
      });

      $('#messagesListContainer').html(html);
    }

    // Selecionar e Abrir Mensagem
    window.selectMessage = function(id) {
      selectedMessageId = id;
      const found = loadedMessages.find(m => m.id === id);
      if (!found) return;

      $('#readerEmptyState').addClass('hidden');
      $('#readerActionBar').removeClass('hidden');
      $('#readerContent').removeClass('hidden');

      $('#viewSubject').text(found.subject);
      $('#viewDate').text(found.date);
      $('#viewFromName').text(found.from_name);
      $('#viewFromEmail').text('<' + found.from_email + '>');
      $('#viewTo').text(Array.isArray(found.to) ? found.to.join(', ') : found.to);
      $('#viewSenderAvatar').text((found.from_name || 'U').charAt(0).toUpperCase());
      $('#viewBodyHtml').html(found.body_html);

      // Renderizar Anexos
      if (found.attachments && found.attachments.length > 0) {
        $('#viewAttachmentsContainer').removeClass('hidden');
        $('#viewAttachmentCountBadge').text(found.attachments.length + ' anexo(s)');

        let attHtml = '';
        found.attachments.forEach(function(att) {
          attHtml += `
            <div class="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
              <div class="flex items-center gap-2 truncate">
                <span class="text-base">📄</span>
                <div class="truncate">
                  <span class="text-xs font-bold text-slate-800 block truncate">${att.name}</span>
                  <span class="text-[10px] text-slate-400 font-mono">${att.size || '1.0 MB'}</span>
                </div>
              </div>
              <a href="${att.url || '#'}" download="${att.name}" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black border border-indigo-200 shrink-0">
                Baixar
              </a>
            </div>
          `;
        });
        $('#viewAttachmentsList').html(attHtml);
      } else {
        $('#viewAttachmentsContainer').addClass('hidden');
      }

      // Marcar como lida no backend
      $.ajax({
        url: 'api.php?action=get_message_detail',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: id })
      });
    };

    // Ações de Botões: Responder, Encaminhar, Excluir
    $('#btnReply').on('click', function() {
      const found = loadedMessages.find(m => m.id === selectedMessageId);
      if (!found) return;

      $('#composeTo').val(found.from_email);
      $('#composeSubject').val('Re: ' + found.subject.replace(/^Re:\s*/i, ''));
      $('#composeBody').val('\n\n\n--- Em ' + found.date + ', ' + found.from_name + ' escreveu:\n' + $('<div>').html(found.body_html).text());
      $('#modalCompose').removeClass('hidden');
    });

    $('#btnForward').on('click', function() {
      const found = loadedMessages.find(m => m.id === selectedMessageId);
      if (!found) return;

      $('#composeTo').val('');
      $('#composeSubject').val('Fwd: ' + found.subject.replace(/^Fwd:\s*/i, ''));
      $('#composeBody').val('\n\n--- Mensagem Encaminhada ---\nDe: ' + found.from_name + ' <' + found.from_email + '>\nData: ' + found.date + '\nAssunto: ' + found.subject + '\n\n' + $('<div>').html(found.body_html).text());
      $('#modalCompose').removeClass('hidden');
    });

    $('#btnDeleteMsg').on('click', function() {
      if (!selectedMessageId) return;
      if (!confirm('Deseja realmente mover esta mensagem para a lixeira?')) return;

      $.ajax({
        url: 'api.php?action=delete_message',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: selectedMessageId }),
        success: function(resp) {
          if (resp && resp.success) {
            alert('Mensagem excluída com sucesso!');
            selectedMessageId = null;
            $('#readerEmptyState').removeClass('hidden');
            $('#readerActionBar').addClass('hidden');
            $('#readerContent').addClass('hidden');
            fetchMessages();
          }
        }
      });
    });

    // Abrir e Fechar Modal de Composição
    $('#btnOpenCompose').on('click', function() {
      $('#formSendMessage')[0].reset();
      stagedAttachments = [];
      $('#composeAttachmentsPreview').text('Nenhum anexo selecionado');
      $('#modalCompose').removeClass('hidden');
    });

    $('#btnCloseCompose, #btnCancelCompose').on('click', function() {
      $('#modalCompose').addClass('hidden');
    });

    // Manipulação de Arquivos Anexos (Base64)
    $('#composeFileInput').on('change', function(e) {
      const files = e.target.files;
      stagedAttachments = [];
      if (files.length === 0) {
        $('#composeAttachmentsPreview').text('Nenhum anexo selecionado');
        return;
      }

      let names = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        names.push(file.name + ' (' + Math.round(file.size / 1024) + ' KB)');
        const reader = new FileReader();
        reader.onload = function(evt) {
          const base64Data = evt.target.result.split(',')[1];
          stagedAttachments.push({
            name: file.name,
            size: Math.round(file.size / 1024) + ' KB',
            type: file.type,
            content_base64: base64Data
          });
        };
        reader.readAsDataURL(file);
      }
      $('#composeAttachmentsPreview').text(names.join('; '));
    });

    // Enviar E-mail via PHPMailer API
    $('#formSendMessage').on('submit', function(e) {
      e.preventDefault();
      const toVal = $('#composeTo').val();
      const subVal = $('#composeSubject').val();
      const bodyVal = $('#composeBody').val();

      $('#btnSubmitSend').prop('disabled', true).text('Enviando via PHPMailer...');

      $.ajax({
        url: 'api.php?action=send_message',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          from_email: currentMailbox,
          from_name: <?= json_encode($currentBox['name'] ?? 'Camilla Faria') ?>,
          to: toVal,
          subject: subVal,
          body_html: '<p>' + bodyVal.replace(/\n/g, '<br>') + '</p>',
          attachments: stagedAttachments
        }),
        success: function(resp) {
          $('#btnSubmitSend').prop('disabled', false).text('🚀 Enviar via PHPMailer');
          if (resp && resp.success) {
            alert('✓ ' + (resp.message || 'E-mail enviado com sucesso!'));
            $('#modalCompose').addClass('hidden');
            fetchMessages();
          } else {
            alert('Erro: ' + (resp.error || 'Falha ao enviar mensagem'));
          }
        },
        error: function() {
          $('#btnSubmitSend').prop('disabled', false).text('🚀 Enviar via PHPMailer');
          alert('Erro de conexão ao servidor de e-mail.');
        }
      });
    });

    // Busca rápida
    $('#searchMessages').on('input', function() {
      const q = $(this).val().toLowerCase();
      if (!q) {
        renderMessagesList(loadedMessages);
        return;
      }
      const filtered = loadedMessages.filter(function(m) {
        return m.subject.toLowerCase().includes(q) ||
               (m.from_name && m.from_name.toLowerCase().includes(q)) ||
               (m.from_email && m.from_email.toLowerCase().includes(q)) ||
               (m.body_html && m.body_html.toLowerCase().includes(q));
      });
      renderMessagesList(filtered);
    });

    $('#btnRefreshMessages').on('click', fetchMessages);

    // Inicialização
    $(document).ready(function() {
      fetchMessages();
    });
  </script>

</body>
</html>
