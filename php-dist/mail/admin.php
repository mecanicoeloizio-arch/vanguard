<?php
/**
 * Grupo Eloizio Mail Server - Painel Administrativo do Servidor de E-mail
 * Subdomínio: webmail.grupoeloizio.com.br/admin.php
 * Gestão de Contas, Domínios, Alunos Vanguard (Gratuito) e Assinaturas Mercado Pago
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$mailboxes = initDefaultMailboxes();
$messages = initDefaultMessages();

// Estatísticas
$totalBoxes = count($mailboxes);
$studentBoxes = count(array_filter($mailboxes, fn($b) => !empty($b['is_student_free'])));
$subscriberBoxes = count(array_filter($mailboxes, fn($b) => ($b['role'] ?? '') === 'subscriber'));
$totalUsedMb = array_sum(array_column($mailboxes, 'used_mb'));
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel do Servidor de E-mail • Grupo Eloizio (webmail.grupoeloizio.com.br)</title>
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
<body class="bg-slate-100 text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- TOP HEADER -->
  <header class="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-600 via-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
        ⚙️
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="font-black text-base sm:text-lg text-white">Servidor de E-mail • Painel Administrativo</h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950 uppercase">
            Diretoria & Gerência
          </span>
        </div>
        <p class="text-xs text-slate-400">
          Subdomínio: <code class="text-indigo-300">webmail.grupoeloizio.com.br</code> • PHPMailer 6.9+ Engine
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <a href="index.php" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20">
        <span>✉️ Acessar Webmail</span>
      </a>
      <a href="../" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition">
        <span>Voltar ao Portal Geral</span>
      </a>
    </div>
  </header>

  <!-- CONTEÚDO PRINCIPAL -->
  <main class="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 flex-1">

    <!-- BANNER DE AUTORIDADE: REGRAS DE NEGÓCIO ALUNOS VANGUARD VS ASSINANTES -->
    <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-indigo-400/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            ✓ Alunos Vanguard: Gratuito
          </span>
          <span class="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
            💳 Assinantes Externos: Pago no Mercado Pago
          </span>
          <span class="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
            ⚡ Autonomia Camilla Faria & Eloizio
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-white">
          Gestão Central de Caixas Postais, Domínios & Envio SMTP
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          O servidor suporta a criação instantânea de novos endereços corporativos e acadêmicos. Alunos ativos do Vanguard recebem caixas institucionais <strong>gratuitas</strong> (1 GB de cota). Usuários externos, oficinas e empresas parceiras assinam planos mensais/anuais faturados automaticamente pelo <strong>Mercado Pago</strong>.
        </p>
      </div>

      <button id="btnOpenNewAccountModal" class="px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition shrink-0 flex items-center gap-2 cursor-pointer">
        <span class="text-base">➕</span>
        <span>Criar Novo Endereço de E-mail</span>
      </button>
    </div>

    <!-- CARDS DE ESTATÍSTICAS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
        <span class="text-[11px] font-black uppercase text-slate-400">Total de Caixas Ativas</span>
        <div class="text-2xl font-black text-slate-900"><?= $totalBoxes ?> Contas</div>
        <p class="text-[11px] text-slate-500">Distribuídas em 3 domínios oficiais</p>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
        <span class="text-[11px] font-black uppercase text-emerald-600">Alunos Vanguard (Gratuito)</span>
        <div class="text-2xl font-black text-emerald-700"><?= $studentBoxes ?> Contas</div>
        <p class="text-[11px] text-emerald-600 font-semibold">100% isentos de mensalidade</p>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
        <span class="text-[11px] font-black uppercase text-purple-600">Assinantes Pagantes (Mercado Pago)</span>
        <div class="text-2xl font-black text-purple-700"><?= $subscriberBoxes ?> Contas</div>
        <p class="text-[11px] text-purple-600 font-semibold">Faturamento recorrente ativo</p>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
        <span class="text-[11px] font-black uppercase text-slate-400">Armazenamento Utilizado</span>
        <div class="text-2xl font-black text-indigo-700"><?= $totalUsedMb ?> MB</div>
        <p class="text-[11px] text-slate-500">Média de 32 MB por conta</p>
      </div>
    </div>

    <!-- TABELA DE CONTAS DE E-MAIL -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
      <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-black text-slate-900">Endereços de E-mail Cadastrados</h3>
          <p class="text-xs text-slate-500">Gerencie cotas, senhas, status e permissões de envio</p>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="text"
            id="filterAccounts"
            placeholder="Filtrar por nome ou e-mail..."
            class="px-3.5 py-2 bg-slate-100 rounded-xl text-xs border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-hidden"
          >
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50 text-[11px] font-black uppercase text-slate-400 border-b border-slate-200">
            <tr>
              <th class="p-4">Usuário & Endereço</th>
              <th class="p-4">Tipo / Plano</th>
              <th class="p-4">Cota de Espaço</th>
              <th class="p-4">Status & Faturamento</th>
              <th class="p-4">Data Criação</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody id="accountsTableBody" class="divide-y divide-slate-100 font-medium">
            <?php foreach ($mailboxes as $b):
              $isStudent = !empty($b['is_student_free']);
              $pct = round(($b['used_mb'] / max(1, $b['quota_mb'])) * 100);
            ?>
              <tr class="hover:bg-slate-50/70 transition">
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                      <?= strtoupper(substr($b['name'], 0, 1)) ?>
                    </div>
                    <div>
                      <strong class="text-slate-900 block"><?= htmlspecialchars($b['name']) ?></strong>
                      <span class="text-[11px] font-mono text-slate-500"><?= htmlspecialchars($b['email']) ?></span>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <?php if ($isStudent): ?>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Aluno Vanguard (Gratuito)
                    </span>
                    <span class="text-[10px] text-slate-400 block mt-0.5"><?= htmlspecialchars($b['course'] ?? 'Cursos Livres') ?></span>
                  <?php elseif ($b['role'] === 'admin'): ?>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900 text-white">
                      👑 Diretoria Geral
                    </span>
                  <?php else: ?>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                      Assinante Corporativo
                    </span>
                  <?php endif; ?>
                </td>
                <td class="p-4">
                  <div class="space-y-1 w-32">
                    <div class="flex items-center justify-between text-[10px] font-mono">
                      <span><?= $b['used_mb'] ?> MB</span>
                      <span><?= $b['quota_mb'] ?> MB</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div class="h-full bg-indigo-600 rounded-full" style="width: <?= $pct ?>%"></div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Ativo
                  </span>
                  <?php if (!$isStudent && $b['role'] !== 'admin'): ?>
                    <span class="text-[10px] text-slate-500 block mt-0.5">Mercado Pago: Pago</span>
                  <?php endif; ?>
                </td>
                <td class="p-4 text-slate-400 font-mono text-[11px]">
                  <?= htmlspecialchars($b['created_at'] ?? '2026-01-01') ?>
                </td>
                <td class="p-4 text-right">
                  <a href="index.php?box=<?= urlencode($b['email']) ?>" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition inline-flex items-center gap-1">
                    <span>Abrir Webmail</span>
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- GUIA DE APONTAMENTO DNS: DOMÍNIOS & SUBDOMÍNIO -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🌐</span>
        <div>
          <h3 class="text-base font-black text-slate-900">Configuração de DNS para <code class="text-indigo-600">webmail.grupoeloizio.com.br</code></h3>
          <p class="text-xs text-slate-500">Registros recomendados para entrega máxima, autenticação e antispam (SPF, DKIM e DMARC)</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <strong class="text-indigo-900 font-bold">1. Subdomínio Webmail (CNAME / A)</strong>
            <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">Apontamento</span>
          </div>
          <p class="text-slate-600 text-[11px]">Tipo: <code>A</code> | Nome: <code>webmail</code> | Valor: <code>IP_DO_SEU_SERVIDOR</code></p>
          <p class="text-slate-500 text-[10px]">Acessa diretamente a pasta <code>/mail</code> deste repositório.</p>
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <strong class="text-indigo-900 font-bold">2. Registro de Troca de Mensagens (MX)</strong>
            <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">Prioridade 10</span>
          </div>
          <p class="text-slate-600 text-[11px]">Tipo: <code>MX</code> | Nome: <code>@</code> | Valor: <code>mail.grupoeloizio.com.br</code></p>
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <strong class="text-indigo-900 font-bold">3. Registro SPF Antispam (TXT)</strong>
            <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Autenticação</span>
          </div>
          <p class="text-slate-600 text-[11px]">Valor: <code>v=spf1 mx a include:_spf.grupoeloizio.com.br ~all</code></p>
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <strong class="text-indigo-900 font-bold">4. Política DMARC (TXT)</strong>
            <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Proteção</span>
          </div>
          <p class="text-slate-600 text-[11px]">Nome: <code>_dmarc</code> | Valor: <code>v=DMARC1; p=quarantine; pct=100</code></p>
        </div>
      </div>
    </div>
  </main>

  <!-- MODAL: CRIAR NOVA CONTA DE E-MAIL -->
  <div id="modalNewAccount" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-extrabold text-base text-slate-900">Criar Nova Conta no Servidor de E-mail</h3>
        <button id="btnCloseModal" class="p-1 rounded-lg text-slate-400 hover:text-slate-700">✕</button>
      </div>

      <form id="formCreateAccount" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 uppercase text-[11px] mb-1">Nome Completo do Titular</label>
          <input type="text" id="newAccName" required placeholder="Ex: Roberto Técnico Mecânico" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 uppercase text-[11px] mb-1">Prefixo do E-mail</label>
            <input type="text" id="newAccUser" required placeholder="roberto.mecanica" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden font-mono">
          </div>
          <div>
            <label class="block font-bold text-slate-700 uppercase text-[11px] mb-1">Domínio</label>
            <select id="newAccDomain" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:border-indigo-600 focus:outline-hidden">
              <option value="grupoeloizio.com.br">@grupoeloizio.com.br</option>
              <option value="aluno.eduvanguard.com.br">@aluno.eduvanguard.com.br</option>
              <option value="eduvanguard.com.br">@eduvanguard.com.br</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase text-[11px] mb-1">Tipo de Acesso & Plano</label>
          <select id="newAccPlan" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden">
            <option value="vanguard_student">🎓 Aluno Vanguard Oficial (100% Gratuito - 1 GB)</option>
            <option value="subscriber_pro">💼 Assinante Corporativo Pro (Pago Mercado Pago - 5 GB)</option>
            <option value="subscriber_enterprise">🏢 Assinante Enterprise Oficina (Pago Mercado Pago - 15 GB)</option>
          </select>
        </div>

        <div id="courseSelectWrapper">
          <label class="block font-bold text-slate-700 uppercase text-[11px] mb-1">Curso Livre Vinculado (Aluno)</label>
          <input type="text" id="newAccCourse" placeholder="Ex: Mecânica de Máquinas de Costura" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden">
        </div>

        <div>
          <label class="block font-bold text-slate-700 uppercase text-[11px] mb-1">Senha Inicial</label>
          <input type="password" id="newAccPassword" required value="Vanguard@2026" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:border-indigo-600 focus:outline-hidden">
        </div>

        <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button type="button" id="btnCancelModal" class="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
          <button type="submit" id="btnSubmitNewAccount" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md">Criar Conta Agora</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    $('#btnOpenNewAccountModal').on('click', function() {
      $('#modalNewAccount').removeClass('hidden');
    });

    $('#btnCloseModal, #btnCancelModal').on('click', function() {
      $('#modalNewAccount').addClass('hidden');
    });

    $('#newAccPlan').on('change', function() {
      if ($(this).val() === 'vanguard_student') {
        $('#courseSelectWrapper').removeClass('hidden');
      } else {
        $('#courseSelectWrapper').addClass('hidden');
      }
    });

    $('#formCreateAccount').on('submit', function(e) {
      e.preventDefault();
      const user = $('#newAccUser').val().trim();
      const domain = $('#newAccDomain').val();
      const fullEmail = (user + '@' + domain).toLowerCase();
      const name = $('#newAccName').val().trim();
      const plan = $('#newAccPlan').val();
      const course = $('#newAccCourse').val().trim();
      const password = $('#newAccPassword').val();

      $('#btnSubmitNewAccount').prop('disabled', true).text('Criando conta...');

      $.ajax({
        url: 'api.php?action=create_mailbox',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          email: fullEmail,
          name: name,
          plan: plan,
          course: course,
          password: password
        }),
        success: function(resp) {
          $('#btnSubmitNewAccount').prop('disabled', false).text('Criar Conta Agora');
          if (resp && resp.success) {
            alert('✓ Conta de e-mail criada com sucesso: ' + fullEmail);
            window.location.reload();
          } else {
            alert('Erro: ' + (resp.error || 'Falha ao criar conta.'));
          }
        },
        error: function() {
          $('#btnSubmitNewAccount').prop('disabled', false).text('Criar Conta Agora');
          alert('Erro de conexão com o servidor.');
        }
      });
    });

    $('#filterAccounts').on('input', function() {
      const q = $(this).val().toLowerCase();
      $('#accountsTableBody tr').each(function() {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(q));
      });
    });
  </script>

</body>
</html>
