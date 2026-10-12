<?php
/**
 * EloWa - Painel Administrativo Geral do Servidor de WhatsApp Multi-Instância
 * Subdomínio: elowa.grupoeloizio.com.br/admin.php
 * Gestão de Instâncias Baileys, Alunos Vanguard, Assinaturas Mercado Pago e Permissões da Camilla Faria
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$instances = initDefaultElowaInstances();
$messages = initDefaultElowaMessages();

// Métricas Gerais
$totalInstances = count($instances);
$connectedInstances = count(array_filter($instances, fn($i) => ($i['status'] ?? '') === 'connected'));
$studentInstances = count(array_filter($instances, fn($i) => !empty($i['isStudentFree'])));
$subscriberInstances = count(array_filter($instances, fn($i) => ($i['role'] ?? '') === 'subscriber'));
$totalSent = array_sum(array_column($instances, 'totalSent'));
$totalReceived = array_sum(array_column($instances, 'totalReceived'));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel Administrativo EloWa • WhatsApp Server (elowa.grupoeloizio.com.br)</title>
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
<body class="bg-slate-900 text-slate-100 antialiased min-h-screen flex flex-col">

  <!-- TOP HEADER -->
  <header class="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
        ⚙️
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-black text-base sm:text-lg text-white">EloWa • Painel Administrativo do Servidor</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950 uppercase">
            Camilla & Direção
          </span>
        </div>
        <p class="text-xs text-slate-400">
          Subdomínio: <code class="text-emerald-400">elowa.grupoeloizio.com.br</code> • Motor Baileys com Git Integrado
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <a href="index.php" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20">
        <span>💬 Acessar Web WhatsApp</span>
      </a>
      <a href="../" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition">
        <span>Voltar ao Portal Geral</span>
      </a>
    </div>
  </header>

  <!-- CONTEÚDO PRINCIPAL -->
  <main class="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 flex-1">

    <!-- BANNER DE AUTORIDADE: CAMILLA FARIA & NÚMERO OFICIAL 21 99613-4073 -->
    <div class="bg-linear-to-r from-slate-950 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            ✓ ZAP Oficial Vanguard: (21) 99613-4073
          </span>
          <span class="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
            ☕ Camilla Faria: Permissão Total & Gerência
          </span>
          <span class="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
            💳 Assinantes: Faturamento Mercado Pago
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-white">
          Gestor Central de WhatsApp Multi-Instância • EloWa
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Todas as notificações acadêmicas da <strong>EduVanguard</strong> (matrículas, notas, boletos Mercado Pago, emissão de certificados e suporte técnico) passam por este servidor através do WhatsApp oficial <strong>(21) 99613-4073</strong>. Alunos têm acesso gratuito para estudos; oficinas e mecânicos parceiros assinam planos corporativos.
        </p>
      </div>

      <a href="index.php" class="px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition shrink-0 flex items-center gap-2">
        <span>➕ Abrir WhatsApp Web EloWa</span>
        <span>&rarr;</span>
      </a>
    </div>

    <!-- CARDS DE MÉTRICAS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span class="font-bold">Total de Instâncias</span>
          <span class="text-emerald-400 text-lg">📱</span>
        </div>
        <div class="text-2xl font-black text-white"><?= $totalInstances ?> Instâncias</div>
        <p class="text-[11px] text-emerald-400 font-semibold mt-1">
          <?= $connectedInstances ?> ativas e conectadas no Baileys
        </p>
      </div>

      <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span class="font-bold">Alunos Vanguard (Grátis)</span>
          <span class="text-emerald-400 text-lg">🎓</span>
        </div>
        <div class="text-2xl font-black text-emerald-400"><?= $studentInstances ?> Alunos</div>
        <p class="text-[11px] text-slate-400 mt-1">100% isentos de taxa de assinatura</p>
      </div>

      <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span class="font-bold">Assinantes Mercado Pago</span>
          <span class="text-purple-400 text-lg">💳</span>
        </div>
        <div class="text-2xl font-black text-purple-400"><?= $subscriberInstances ?> Oficinas</div>
        <p class="text-[11px] text-slate-400 mt-1">Planos Pro (R$ 49,90) e Enterprise (R$ 89,90)</p>
      </div>

      <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div class="flex items-center justify-between text-slate-400 text-xs mb-2">
          <span class="font-bold">Mensagens Trafegadas</span>
          <span class="text-amber-400 text-lg">📊</span>
        </div>
        <div class="text-2xl font-black text-white"><?= number_format($totalSent + $totalReceived, 0, ',', '.') ?> msgs</div>
        <p class="text-[11px] text-amber-300 font-semibold mt-1">
          Texto, Áudio, Vídeo e PDFs transmitidos
        </p>
      </div>
    </div>

    <!-- TABELA DE INSTÂNCIAS DE WHATSAPP -->
    <div class="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      <div class="p-6 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 class="font-black text-base text-white">Instâncias WhatsApp Conectadas ao Socket Baileys</h3>
          <p class="text-xs text-slate-400">Controle de conexão, QR Code, pairing code e webhook de disparo</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Engine: @whiskeysockets/baileys 6.7+
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-4">Instância & Nome</th>
              <th class="p-4">Número WhatsApp</th>
              <th class="p-4">Tipo & Plano</th>
              <th class="p-4">Status Baileys</th>
              <th class="p-4">Tráfego (Env/Rec)</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80">
            <?php foreach ($instances as $inst): ?>
              <tr class="hover:bg-slate-900/60 transition">
                <td class="p-4">
                  <div class="font-bold text-white"><?= htmlspecialchars($inst['name']) ?></div>
                  <div class="text-[10px] text-slate-400 font-mono"><?= htmlspecialchars($inst['id']) ?></div>
                </td>
                <td class="p-4 font-mono font-bold text-emerald-400">
                  <?= htmlspecialchars($inst['phoneDisplay'] ?? $inst['phone']) ?>
                </td>
                <td class="p-4">
                  <?php if (!empty($inst['isMaster'])): ?>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                      MASTER OFICIAL CAMILLA
                    </span>
                  <?php elseif (!empty($inst['isStudentFree'])): ?>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      ALUNO (GRATUITO)
                    </span>
                  <?php else: ?>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      ASSINANTE PRO (R$ 49,90)
                    </span>
                  <?php endif; ?>
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Conectado (Online)
                  </span>
                </td>
                <td class="p-4 font-mono text-[11px]">
                  ↑ <?= $inst['totalSent'] ?? 0 ?> | ↓ <?= $inst['totalReceived'] ?? 0 ?>
                </td>
                <td class="p-4 text-right">
                  <a href="index.php?inst=<?= urlencode($inst['id']) ?>" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition">
                    Abrir Chat &rarr;
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SEÇÃO TÉCNICA: MOTOR BAILEYS & GIT REPOSITORY -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Card Status do Gateway Baileys -->
      <div class="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">⚡</span>
            <h4 class="font-extrabold text-sm text-white">Status do Gateway Baileys (Multi-Device)</h4>
          </div>
          <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            WS Socket 127.0.0.1:8089
          </span>
        </div>
        
        <div class="space-y-2 text-xs text-slate-300">
          <div class="flex justify-between py-1 border-b border-slate-900">
            <span class="text-slate-400">Biblioteca Utilizada:</span>
            <span class="font-mono font-bold text-white">@whiskeysockets/baileys</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-900">
            <span class="text-slate-400">Repositório Git:</span>
            <span class="font-mono text-emerald-400">git clone https://github.com/WhiskeySockets/Baileys</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-900">
            <span class="text-slate-400">Protocolo de Comunicação:</span>
            <span class="font-mono text-white">WebSocket Seguro WSS com Criptografia de Ponta a Ponta</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-900">
            <span class="text-slate-400">Suporte a Tipos de Mídia:</span>
            <span class="font-bold text-emerald-300">Texto, Áudio (Opus/OGG), Vídeo (MP4), Documentos (PDF), Imagens</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-slate-400">Webhook de Notificação:</span>
            <span class="font-mono text-indigo-400">https://elowa.grupoeloizio.com.br/api.php?action=webhook</span>
          </div>
        </div>
      </div>

      <!-- Card Planos e Faturamento Mercado Pago -->
      <div class="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">💳</span>
            <h4 class="font-extrabold text-sm text-white">Planos de Assinatura • Mercado Pago</h4>
          </div>
          <span class="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
            PIX & Cartão em até 12x
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <strong class="text-white block">Aluno Vanguard Oficial</strong>
              <span class="text-slate-400 text-[11px]">1 Instância • Vitalício enquanto matriculado</span>
            </div>
            <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl font-black text-xs">
              GRÁTIS
            </span>
          </div>

          <div class="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <strong class="text-white block">Oficina Mecânica Pro</strong>
              <span class="text-slate-400 text-[11px]">2 Instâncias • Disparos ilimitados + Webhooks</span>
            </div>
            <span class="font-black text-sm text-purple-400">
              R$ 49,90/mês
            </span>
          </div>

          <div class="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <strong class="text-white block">Corporativo Enterprise</strong>
              <span class="text-slate-400 text-[11px]">5 Instâncias • Alta prioridade & Suporte 24/7</span>
            </div>
            <span class="font-black text-sm text-purple-400">
              R$ 89,90/mês
            </span>
          </div>
        </div>
      </div>

    </div>

  </main>

  <!-- FOOTER -->
  <footer class="bg-slate-950 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
    EloWa WhatsApp Multi-Device Gateway • Grupo Eloizio & Vanguard • Subdomínio: elowa.grupoeloizio.com.br
  </footer>

</body>
</html>
