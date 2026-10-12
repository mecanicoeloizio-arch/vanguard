<?php
/**
 * EloWa - Interface Web Oficial do Servidor de WhatsApp Multi-Instância
 * Subdomínio: elowa.grupoeloizio.com.br
 * Motor: Baileys (@whiskeysockets/baileys) • PHP 8.1+ • HTML5 • Tailwind CSS • jQuery
 * Instância Master: 21 99613-4073 (Camilla Faria & Vanguard)
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$instances = initDefaultElowaInstances();
$messages = initDefaultElowaMessages();

// Instância ativa selecionada
$currentInstId = $_GET['inst'] ?? 'inst_camilla_oficial';
$currentInst = null;
foreach ($instances as $i) {
    if ($i['id'] === $currentInstId) {
        $currentInst = $i;
        break;
    }
}
if (!$currentInst && count($instances) > 0) {
    $currentInst = $instances[0];
    $currentInstId = $currentInst['id'];
}

// Extrair contatos/conversas únicos da instância selecionada
$chats = [];
foreach ($messages as $m) {
    if ($m['instanceId'] === $currentInstId) {
        $phone = $m['chatPhone'];
        if (!isset($chats[$phone])) {
            $chats[$phone] = [
                'phone' => $phone,
                'name' => $m['chatName'],
                'lastMessage' => $m['text'] ?: ($m['type'] === 'audio' ? '🎵 Áudio' : ($m['type'] === 'pdf' ? '📄 Documento PDF' : '🎥 Vídeo')),
                'lastTimestamp' => $m['timestamp'],
                'unread' => (!$m['fromMe'] && ($m['status'] ?? '') !== 'read')
            ];
        } else {
            if (strtotime($m['timestamp']) > strtotime($chats[$phone]['lastTimestamp'])) {
                $chats[$phone]['lastMessage'] = $m['text'] ?: $m['type'];
                $chats[$phone]['lastTimestamp'] = $m['timestamp'];
            }
        }
    }
}

// Chat atualmente aberto
$activeChatPhone = $_GET['chat'] ?? array_key_first($chats) ?? '5521987648727';
$activeChatName = $chats[$activeChatPhone]['name'] ?? 'Contato ' . $activeChatPhone;

// Mensagens da conversa aberta
$activeMessages = [];
foreach ($messages as $m) {
    if ($m['instanceId'] === $currentInstId && $m['chatPhone'] === $activeChatPhone) {
        $activeMessages[] = $m;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EloWa • Servidor de WhatsApp Grupo Eloizio & Vanguard</title>
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
<body class="bg-slate-900 text-slate-100 antialiased h-screen flex flex-col overflow-hidden">

  <!-- TOP HEADER ELOWA -->
  <header class="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-500 via-teal-600 to-green-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
        💬
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-extrabold text-sm sm:text-base tracking-tight text-white">EloWa • WhatsApp Engine</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <?= ELOWA_SUBDOMAIN ?>
          </span>
          <span class="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
            Camilla Control: 21 99613-4073
          </span>
        </div>
        <p class="text-[11px] text-slate-400">
          Servidor Multi-Instância Baileys • Texto, Áudio, Vídeo, PDF • Vanguard & Assinantes
        </p>
      </div>
    </div>

    <!-- Seletor de Instância & Ações -->
    <div class="flex items-center gap-2.5">
      <!-- Seletor de Instância WhatsApp -->
      <div class="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
        <span class="text-slate-400 text-[11px] hidden sm:inline">WhatsApp Conectado:</span>
        <select id="selectInstance" class="bg-transparent text-emerald-400 font-extrabold text-xs focus:outline-hidden cursor-pointer" onchange="window.location.href='?inst=' + this.value">
          <?php foreach ($instances as $inst): ?>
            <option value="<?= htmlspecialchars($inst['id']) ?>" <?= ($inst['id'] === $currentInstId) ? 'selected' : '' ?> class="bg-slate-900 text-white">
              <?= htmlspecialchars($inst['name']) ?> (<?= htmlspecialchars($inst['phoneDisplay'] ?? $inst['phone']) ?>)
            </option>
          <?php endforeach; ?>
        </select>
      </div>

      <!-- Botão Conectar Novo WhatsApp -->
      <button onclick="abrirModalNovaInstancia()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer">
        <span>➕ Novo WhatsApp</span>
      </button>

      <!-- Painel Admin -->
      <a href="admin.php" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
        <span>⚙️ Painel Admin</span>
      </a>

      <!-- Voltar ao Portal -->
      <a href="../" class="hidden sm:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition">
        <span>Portal Principal &rarr;</span>
      </a>
    </div>
  </header>

  <!-- CORPO PRINCIPAL DO WHATSAPP (2 COLUNAS: LISTA DE CONVERSAS + ÁREA DO CHAT) -->
  <div class="flex-1 flex overflow-hidden">

    <!-- COLUNA ESQUERDA: LISTA DE CONVERSAS (CHATS) -->
    <aside class="w-80 sm:w-96 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
      
      <!-- Topo da Aba de Chats com Detalhe da Instância -->
      <div class="p-3 border-b border-slate-800 bg-slate-900/60 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs font-black text-white truncate"><?= htmlspecialchars($currentInst['name']) ?></span>
          </div>
          <span class="text-[10px] font-mono font-bold text-slate-400">
            <?= htmlspecialchars($currentInst['phoneDisplay'] ?? $currentInst['phone']) ?>
          </span>
        </div>

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <?php if (!empty($currentInst['isMaster'])): ?>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
              👑 Instância Master Oficial Camilla
            </span>
          <?php elseif (!empty($currentInst['isStudentFree'])): ?>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Aluno Vanguard (Gratuito)
            </span>
          <?php else: ?>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
              💳 Assinante Pro (Mercado Pago)
            </span>
          <?php endif; ?>
          <span class="font-mono text-[10px] text-slate-400">Bateria: <?= $currentInst['battery'] ?? 100 ?>% 🔋</span>
        </div>

        <!-- Campo de Pesquisa de Conversas -->
        <div class="relative pt-1">
          <input
            type="text"
            id="searchChatInput"
            placeholder="Pesquisar contatos e conversas..."
            class="w-full pl-8 pr-3 py-1.5 bg-slate-800 text-xs text-white rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden"
          />
          <span class="absolute left-2.5 top-3 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      <!-- Lista de Chats -->
      <div id="chatListContainer" class="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        <?php if (count($chats) === 0): ?>
          <div class="p-8 text-center text-slate-500 text-xs">
            Nenhuma conversa nesta instância ainda.<br>Envie a primeira mensagem abaixo!
          </div>
        <?php else: ?>
          <?php foreach ($chats as $phone => $c): ?>
            <?php $isActive = ($phone === $activeChatPhone); ?>
            <a
              href="?inst=<?= urlencode($currentInstId) ?>&chat=<?= urlencode($phone) ?>"
              class="flex items-center gap-3 p-3 transition hover:bg-slate-900 cursor-pointer <?= $isActive ? 'bg-slate-800/90 border-l-4 border-emerald-500' : '' ?>"
            >
              <div class="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0">
                <?= strtoupper(substr($c['name'], 0, 1)) ?>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold text-white truncate"><?= htmlspecialchars($c['name']) ?></h4>
                  <span class="text-[10px] text-slate-400 font-mono"><?= date('H:i', strtotime($c['lastTimestamp'])) ?></span>
                </div>
                <p class="text-[11px] text-slate-400 truncate mt-0.5"><?= htmlspecialchars($c['lastMessage']) ?></p>
              </div>
            </a>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </aside>

    <!-- COLUNA DIREITA: TELA DE CHAT & HISTÓRICO DE MENSAGENS -->
    <main class="flex-1 bg-slate-900 flex flex-col overflow-hidden">
      
      <!-- Header do Chat Ativo -->
      <div class="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-inner">
            <?= strtoupper(substr($activeChatName, 0, 1)) ?>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-extrabold text-white"><?= htmlspecialchars($activeChatName) ?></h3>
              <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <?= htmlspecialchars($activeChatPhone) ?>
              </span>
            </div>
            <p class="text-[11px] text-slate-400">
              Instância Transmissora: <strong class="text-slate-300"><?= htmlspecialchars($currentInst['name']) ?></strong> (Baileys Socket 2026)
            </p>
          </div>
        </div>

        <!-- Ações do Chat: Encaminhar, Limpar, Simular Disparo -->
        <div class="flex items-center gap-2">
          <button onclick="abrirModalNovaConversa()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
            <span>💬 Nova Conversa</span>
          </button>
        </div>
      </div>

      <!-- Feed de Mensagens (Área de Rolagem com Fundo Estilo WhatsApp) -->
      <div id="messagesFeed" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/90">
        <?php if (count($activeMessages) === 0): ?>
          <div class="p-12 text-center text-slate-400 space-y-2">
            <div class="text-4xl">💬</div>
            <p class="text-xs">Inicie a conversa com <?= htmlspecialchars($activeChatName) ?> enviando um texto, áudio, vídeo ou PDF.</p>
          </div>
        <?php else: ?>
          <?php foreach ($activeMessages as $m): ?>
            <?php $isMe = !empty($m['fromMe']); ?>
            <div class="flex <?= $isMe ? 'justify-end' : 'justify-start' ?>">
              <div class="max-w-lg rounded-2xl p-3.5 shadow-md space-y-2 <?= $isMe ? 'bg-emerald-800/90 text-white rounded-tr-xs' : 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700/60' ?>">
                
                <!-- Nome do Remetente em Grupos ou Resposta -->
                <div class="flex items-center justify-between text-[10px] font-bold <?= $isMe ? 'text-emerald-200' : 'text-emerald-400' ?>">
                  <span><?= $isMe ? htmlspecialchars($currentInst['name']) : htmlspecialchars($m['chatName']) ?></span>
                  <span class="font-mono text-slate-300"><?= date('H:i', strtotime($m['timestamp'])) ?></span>
                </div>

                <!-- Conteúdo por Tipo: Texto -->
                <?php if (!empty($m['text'])): ?>
                  <p class="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap"><?= htmlspecialchars($m['text']) ?></p>
                <?php endif; ?>

                <!-- Conteúdo: ÁUDIO -->
                <?php if ($m['type'] === 'audio' && !empty($m['media'])): ?>
                  <div class="bg-black/30 rounded-xl p-2.5 space-y-1.5 border border-white/10">
                    <div class="flex items-center gap-2">
                      <span class="text-lg">🎙️</span>
                      <span class="text-[11px] font-bold text-emerald-300">Mensagem de Voz / Áudio Baileys</span>
                      <span class="text-[10px] font-mono text-slate-400 ml-auto"><?= $m['media']['duration'] ?? '0:24' ?>s</span>
                    </div>
                    <audio controls class="w-full h-8">
                      <source src="<?= htmlspecialchars($m['media']['url']) ?>" type="audio/ogg">
                      Seu navegador não suporta reprodução de áudio.
                    </audio>
                  </div>
                <?php endif; ?>

                <!-- Conteúdo: VÍDEO -->
                <?php if ($m['type'] === 'video' && !empty($m['media'])): ?>
                  <div class="bg-black/40 rounded-xl overflow-hidden border border-white/10 space-y-1.5">
                    <video controls class="w-full max-h-60 rounded-lg">
                      <source src="<?= htmlspecialchars($m['media']['url']) ?>" type="video/mp4">
                      Seu navegador não suporta tag de vídeo.
                    </video>
                    <div class="p-2 flex items-center justify-between text-[11px] text-slate-300">
                      <span class="truncate">🎥 <?= htmlspecialchars($m['media']['fileName'] ?? 'Video.mp4') ?></span>
                      <span class="font-mono text-[10px]"><?= $m['media']['size'] ?? '8 MB' ?></span>
                    </div>
                  </div>
                <?php endif; ?>

                <!-- Conteúdo: PDF / DOCUMENTO -->
                <?php if ($m['type'] === 'pdf' && !empty($m['media'])): ?>
                  <div class="bg-black/30 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 truncate">
                      <span class="text-2xl">📄</span>
                      <div class="truncate">
                        <strong class="text-xs text-white block truncate"><?= htmlspecialchars($m['media']['fileName'] ?? 'Documento.pdf') ?></strong>
                        <span class="text-[10px] text-slate-400 font-mono"><?= $m['media']['size'] ?? '2.4 MB' ?></span>
                      </div>
                    </div>
                    <a href="<?= htmlspecialchars($m['media']['url']) ?>" target="_blank" download class="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black shrink-0 transition">
                      Baixar PDF
                    </a>
                  </div>
                <?php endif; ?>

                <!-- Rodapé da Mensagem: Status e Ação de Encaminhar -->
                <div class="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                  <button onclick="abrirModalEncaminhar('<?= $m['id'] ?>', '<?= htmlspecialchars(addslashes($m['text'] ?? '')) ?>')" class="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer">
                    <span>↪ Encaminhar</span>
                  </button>
                  <span class="text-emerald-300 font-bold"><?= $isMe ? '✓✓ Entregue (Baileys)' : 'Recebida' ?></span>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Compositor de Mensagem: Texto, Anexo (Áudio, Vídeo, PDF) e Envio -->
      <footer class="p-3 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2">
        <!-- Preview de Anexo Selecionado -->
        <div id="mediaPreviewBar" class="hidden items-center justify-between bg-slate-900 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-white">
          <div class="flex items-center gap-2 truncate">
            <span id="previewMediaIcon" class="text-lg">📎</span>
            <span id="previewMediaName" class="font-bold truncate">Arquivo selecionado</span>
            <span id="previewMediaType" class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">PDF</span>
          </div>
          <button onclick="cancelarAnexo()" class="text-slate-400 hover:text-rose-400 font-bold text-sm cursor-pointer">&times;</button>
        </div>

        <form id="formSendMessage" onsubmit="enviarMensagem(event)" class="flex items-center gap-2">
          <!-- Botão Menu de Anexos -->
          <div class="relative">
            <button type="button" onclick="toggleMenuAnexos()" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-base transition cursor-pointer" title="Adicionar Anexo">
              📎
            </button>
            <div id="menuAnexos" class="hidden absolute bottom-12 left-0 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl w-48 space-y-1 z-30">
              <button type="button" onclick="selecionarTipoAnexo('pdf')" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                <span>📄</span> <span>Documento PDF</span>
              </button>
              <button type="button" onclick="selecionarTipoAnexo('video')" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                <span>🎥</span> <span>Vídeo Explicativo</span>
              </button>
              <button type="button" onclick="selecionarTipoAnexo('audio')" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer">
                <span>🎙️</span> <span>Gravar / Áudio</span>
              </button>
            </div>
          </div>

          <!-- Input de Texto -->
          <input
            type="text"
            id="messageTextInput"
            placeholder="Digite uma mensagem para <?= htmlspecialchars($activeChatName) ?>..."
            class="flex-1 px-4 py-2.5 bg-slate-800 text-xs sm:text-sm text-white rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden"
          />

          <!-- Botão Gravar Áudio Rápido -->
          <button type="button" onclick="simularGravacaoAudio()" class="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 text-base transition cursor-pointer" title="Gravar Áudio">
            🎙️
          </button>

          <!-- Botão Enviar -->
          <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer">
            <span>Enviar</span>
            <span>&rarr;</span>
          </button>
        </form>
      </footer>
    </main>
  </div>

  <!-- MODAL: CONECTAR NOVO WHATSAPP VIA BAILEYS (QR CODE & PAIRING CODE) -->
  <div id="modalNovaInstancia" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 text-white animate-in zoom-in-95">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">📱</span>
          <div>
            <h3 class="font-black text-base text-white">Conectar Novo WhatsApp no Servidor</h3>
            <p class="text-xs text-slate-400">Biblioteca Baileys • QR Code ou Código de Pareamento</p>
          </div>
        </div>
        <button onclick="fecharModalNovaInstancia()" class="text-slate-400 hover:text-white text-xl cursor-pointer">&times;</button>
      </div>

      <div class="space-y-4 text-xs">
        <div>
          <label class="block text-slate-300 font-bold mb-1">Identificação / Nome da Instância</label>
          <input type="text" id="newInstName" placeholder="Ex: Suporte Técnico São Gonçalo" class="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white" />
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">Número de WhatsApp (com DDD)</label>
          <input type="text" id="newInstPhone" placeholder="Ex: 21996134073" class="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">Perfil de Usuário</label>
            <select id="newInstRole" class="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white">
              <option value="student">Aluno Vanguard (Gratuito)</option>
              <option value="subscriber">Assinante Pro (Mercado Pago)</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">Método de Pareamento</label>
            <select id="newInstMethod" class="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white">
              <option value="pairing">Código de Pareamento (8 dígitos)</option>
              <option value="qrcode">QR Code Baileys</option>
            </select>
          </div>
        </div>

        <!-- Área de Demonstração de Pareamento -->
        <div id="pairingCodeDisplayArea" class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
          <span class="text-[10px] font-bold uppercase text-slate-400">Código de Conexão Baileys:</span>
          <div id="pairingCodeValue" class="font-mono text-2xl font-black text-emerald-400 tracking-widest">
            ELOW-9613
          </div>
          <p class="text-[11px] text-slate-400">
            Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar com número de telefone.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <button onclick="fecharModalNovaInstancia()" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">Cancelar</button>
        <button onclick="salvarNovaInstancia()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/30">
          ✓ Iniciar Conexão Baileys
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: ENCAMINHAR MENSAGEM -->
  <div id="modalEncaminhar" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-white">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="font-extrabold text-sm text-white">↪ Encaminhar Mensagem</h3>
        <button onclick="fecharModalEncaminhar()" class="text-slate-400 hover:text-white">&times;</button>
      </div>
      <p id="forwardMsgSnippet" class="text-xs text-slate-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700 italic">...</p>
      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">Destinatários (telefones separados por vírgula):</label>
        <input type="text" id="forwardTargetsInput" placeholder="21987648727, 21998877665" class="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xs text-white" />
      </div>
      <div class="flex items-center justify-end gap-2 pt-2">
        <button onclick="fecharModalEncaminhar()" class="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">Cancelar</button>
        <button onclick="confirmarEncaminhamento()" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold">Encaminhar Agora</button>
      </div>
    </div>
  </div>

  <!-- SCRIPTS JQUERY & JS INTERATIVO -->
  <script>
    let anexoAtual = null;
    let msgIdParaEncaminhar = null;

    function toggleMenuAnexos() {
      $('#menuAnexos').toggleClass('hidden');
    }

    function selecionarTipoAnexo(tipo) {
      $('#menuAnexos').addClass('hidden');
      if (tipo === 'pdf') {
        anexoAtual = {
          type: 'pdf',
          fileName: 'Apostila_Manutencao_Vanguard_2026.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.8 MB'
        };
        $('#previewMediaIcon').text('📄');
        $('#previewMediaName').text(anexoAtual.fileName);
        $('#previewMediaType').text('PDF');
      } else if (tipo === 'video') {
        anexoAtual = {
          type: 'video',
          fileName: 'Video_Explicativo_Regulagem_Mecanica.mp4',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          size: '8.2 MB'
        };
        $('#previewMediaIcon').text('🎥');
        $('#previewMediaName').text(anexoAtual.fileName);
        $('#previewMediaType').text('VÍDEO');
      } else if (tipo === 'audio') {
        anexoAtual = {
          type: 'audio',
          fileName: 'audio_explicativo_camilla.ogg',
          url: 'https://actions.google.com/sounds/v1/human_voices/speaking_sample.ogg',
          size: '420 KB',
          duration: 32
        };
        $('#previewMediaIcon').text('🎙️');
        $('#previewMediaName').text(anexoAtual.fileName);
        $('#previewMediaType').text('ÁUDIO');
      }
      $('#mediaPreviewBar').removeClass('hidden').addClass('flex');
    }

    function cancelarAnexo() {
      anexoAtual = null;
      $('#mediaPreviewBar').removeClass('flex').addClass('hidden');
    }

    function simularGravacaoAudio() {
      selecionarTipoAnexo('audio');
      $('#messageTextInput').val('Gravação de voz via WhatsApp EloWa');
    }

    function enviarMensagem(e) {
      e.preventDefault();
      const texto = $('#messageTextInput').val().trim();
      if (!texto && !anexoAtual) return;

      const payload = {
        action: 'send_message',
        instanceId: '<?= $currentInstId ?>',
        chatPhone: '<?= $activeChatPhone ?>',
        chatName: '<?= addslashes($activeChatName) ?>',
        type: anexoAtual ? anexoAtual.type : 'text',
        text: texto,
        media: anexoAtual
      };

      $.ajax({
        url: 'api.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(res) {
          if (res.success) {
            window.location.reload();
          } else {
            alert('Erro: ' + (res.error || 'Falha ao enviar'));
          }
        },
        error: function() {
          alert('Erro de conexão com o servidor EloWa');
        }
      });
    }

    function abrirModalNovaInstancia() {
      $('#modalNovaInstancia').removeClass('hidden').addClass('flex');
    }
    function fecharModalNovaInstancia() {
      $('#modalNovaInstancia').removeClass('flex').addClass('hidden');
    }

    function salvarNovaInstancia() {
      const nome = $('#newInstName').val().trim() || 'Nova Instância';
      const phone = $('#newInstPhone').val().trim();
      const role = $('#newInstRole').val();

      if (!phone) {
        alert('Informe o número de telefone.');
        return;
      }

      $.ajax({
        url: 'api.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          action: 'create_instance',
          name: nome,
          phone: phone,
          role: role,
          plan: role === 'student' ? 'vanguard_student' : 'subscriber_pro'
        }),
        success: function(res) {
          if (res.success) {
            alert('Instância criada! Pareamento gerado: ' + res.pairingCode);
            window.location.href = '?inst=' + res.instance.id;
          } else {
            alert('Erro: ' + res.error);
          }
        }
      });
    }

    function abrirModalEncaminhar(id, texto) {
      msgIdParaEncaminhar = id;
      $('#forwardMsgSnippet').text(texto || '(Arquivo de Mídia)');
      $('#modalEncaminhar').removeClass('hidden').addClass('flex');
    }
    function fecharModalEncaminhar() {
      $('#modalEncaminhar').removeClass('flex').addClass('hidden');
    }

    function confirmarEncaminhamento() {
      const targets = $('#forwardTargetsInput').val().split(',').map(s => s.trim()).filter(Boolean);
      if (targets.length === 0) {
        alert('Informe ao menos um destinatário.');
        return;
      }

      $.ajax({
        url: 'api.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          action: 'forward_message',
          messageId: msgIdParaEncaminhar,
          targetPhones: targets,
          instanceId: '<?= $currentInstId ?>'
        }),
        success: function(res) {
          if (res.success) {
            alert('Encaminhado com sucesso!');
            fecharModalEncaminhar();
            window.location.reload();
          }
        }
      });
    }

    function abrirModalNovaConversa() {
      const tel = prompt('Digite o WhatsApp de destino com DDD (ex: 21987648727):');
      if (tel) {
        window.location.href = '?inst=<?= urlencode($currentInstId) ?>&chat=' + encodeURIComponent(tel.replace(/[^0-9]/g, ''));
      }
    }
  </script>
</body>
</html>
