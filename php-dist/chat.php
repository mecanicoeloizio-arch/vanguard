<?php
/**
 * Grupo Eloizio - Chat Acadêmico & Central de Mensagens (PHP 8.1+)
 * Atendimento ao Vivo, Suporte com a Expert Sofia Vanguard e Fórum de Dúvidas
 * Funciona diretamente na pasta public_html sem dependências!
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Chat Acadêmico & Atendimento ao Vivo";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$mensagens = getMensagensChat();
$canalAtivo = $_GET['canal'] ?? 'geral';

// Envio de nova mensagem via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['texto'])) {
    $texto = trim($_POST['texto']);
    $canal = trim($_POST['canal'] ?? 'geral');
    $autor = $currentUser['name'] ?? 'Aluno / Visitante';
    $role = $currentUser['role'] ?? 'student';

    if (!empty($texto)) {
        $novaMsg = [
            'id' => 'msg_' . time(),
            'channel' => $canal,
            'author' => $autor,
            'role' => $role,
            'text' => $texto,
            'time' => 'Hoje ' . date('H:i')
        ];
        salvarMensagemChat($novaMsg);
        header("Location: chat.php?canal=" . urlencode($canal));
        exit;
    }
}

$mensagensCanal = array_filter($mensagens, function ($m) use ($canalAtivo) {
    return ($m['channel'] ?? 'geral') === $canalAtivo;
});
?>

<div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
  <!-- Header -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="space-y-1">
      <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
        <span>💬 Comunicação Interna & Suporte</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-black text-white">Chat Acadêmico Grupo Eloizio</h1>
      <p class="text-xs text-indigo-200">Interaja com a Expert Sofia Vanguard, tire dúvidas com professores e colegas.</p>
    </div>

    <div class="flex items-center gap-2">
      <a href="https://wa.me/5521996134073" target="_blank" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
        <span>WhatsApp Oficial</span>
      </a>
    </div>
  </div>

  <!-- Estrutura do Chat: Canais à esquerda, Mensagens à direita -->
  <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
    <!-- Menu Lateral de Canais (4 Colunas) -->
    <div class="md:col-span-4 border-r border-slate-200 p-4 space-y-3 bg-slate-50/50">
      <span class="text-[10px] uppercase font-bold text-slate-400 block px-2">Canais de Conversa:</span>

      <div class="space-y-1 text-xs">
        <a href="chat.php?canal=geral" class="w-full text-left p-3 rounded-xl font-bold flex items-center justify-between transition <?= ($canalAtivo === 'geral') ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700' ?>">
          <div class="flex items-center gap-2">
            <span>📢</span>
            <span>Mural Geral de Avisos</span>
          </div>
        </a>

        <a href="chat.php?canal=suporte" class="w-full text-left p-3 rounded-xl font-bold flex items-center justify-between transition <?= ($canalAtivo === 'suporte') ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700' ?>">
          <div class="flex items-center gap-2">
            <span>✨</span>
            <span>Atendimento (Sofia Vanguard)</span>
          </div>
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        </a>

        <a href="chat.php?canal=mecanica" class="w-full text-left p-3 rounded-xl font-bold flex items-center justify-between transition <?= ($canalAtivo === 'mecanica') ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700' ?>">
          <div class="flex items-center gap-2">
            <span>🔧</span>
            <span>Oficina & Máquinas (Eloizio)</span>
          </div>
        </a>

        <a href="chat.php?canal=duvidas" class="w-full text-left p-3 rounded-xl font-bold flex items-center justify-between transition <?= ($canalAtivo === 'duvidas') ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700' ?>">
          <div class="flex items-center gap-2">
            <span>💡</span>
            <span>Tira-Dúvidas dos Alunos</span>
          </div>
        </a>
      </div>

      <!-- Info Card de Contato -->
      <div class="mt-6 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-2">
        <strong class="text-indigo-950 block font-bold">Plantão de Atendimento:</strong>
        <p class="text-indigo-800 text-[11px] leading-relaxed">
          Segunda a Sexta: 08:00 às 18:00<br>
          Sábado: 08:00 às 13:00 (Oficina São Gonçalo)
        </p>
      </div>
    </div>

    <!-- Área de Mensagens (8 Colunas) -->
    <div class="md:col-span-8 flex flex-col justify-between h-[550px] bg-white">
      <!-- Topo do Canal Ativo -->
      <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <strong class="text-slate-900 font-extrabold text-sm uppercase">#<?= htmlspecialchars($canalAtivo) ?></strong>
          <span class="text-slate-500">• <?= count($mensagensCanal) ?> mensagens</span>
        </div>
        <span class="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
          ● Online
        </span>
      </div>

      <!-- Feed de Mensagens com Scroll -->
      <div class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
        <?php if (empty($mensagensCanal)): ?>
          <div class="text-center py-12 text-slate-400">
            Nenhuma mensagem neste canal ainda. Seja o primeiro a perguntar!
          </div>
        <?php else: ?>
          <?php foreach ($mensagensCanal as $m): ?>
            <?php
            $isAdmin = ($m['role'] ?? '') === 'admin';
            ?>
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 <?= $isAdmin ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-slate-700' ?>">
                <?= strtoupper(substr($m['author'] ?? 'U', 0, 1)) ?>
              </div>
              <div class="space-y-1 max-w-xl">
                <div class="flex items-center gap-2">
                  <strong class="text-slate-900 font-bold"><?= htmlspecialchars($m['author']) ?></strong>
                  <?php if ($isAdmin): ?>
                    <span class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-indigo-100 text-indigo-800">Equipe</span>
                  <?php endif; ?>
                  <span class="text-[10px] text-slate-400"><?= $m['time'] ?? 'Hoje' ?></span>
                </div>
                <div class="p-3 rounded-2xl leading-relaxed <?= $isAdmin ? 'bg-indigo-50 border border-indigo-100 text-indigo-950 font-medium' : 'bg-slate-100 text-slate-800' ?>">
                  <?= nl2br(htmlspecialchars($m['text'])) ?>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>

      <!-- Barra de Input para Nova Mensagem -->
      <form method="POST" action="chat.php?canal=<?= urlencode($canalAtivo) ?>" class="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
        <input type="hidden" name="canal" value="<?= htmlspecialchars($canalAtivo) ?>">
        <input
          type="text"
          name="texto"
          required
          placeholder="Escreva sua dúvida ou mensagem para a equipe..."
          class="flex-1 p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
        >
        <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer transition">
          Enviar &rarr;
        </button>
      </form>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
