<?php
$pageTitle = 'Dashboard • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<!-- Top Welcome & Actions -->
<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
  <div>
    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
      <i class="fas fa-gauge-high text-[#FF6B00]"></i> Painel Operacional da Oficina
    </h1>
    <p class="text-xs text-zinc-400 mt-0.5">
      Visão geral de produtividade, faturamento e ordens de serviço ativas.
    </p>
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <a href="/os/novo" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20">
      <i class="fas fa-plus"></i> Nova Ordem de Serviço
    </a>
    <a href="/orcamentos" class="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-800 transition flex items-center gap-1.5">
      <i class="fas fa-calculator"></i> Novo Orçamento
    </a>
  </div>
</div>

<!-- 4 Core Metric Cards -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
  
  <!-- Card 1: Faturamento Mês -->
  <div class="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
    <div class="flex items-center justify-between text-zinc-400 text-xs">
      <span>Faturamento do Mês</span>
      <i class="fas fa-money-bill-wave text-emerald-400"></i>
    </div>
    <div class="text-xl sm:text-2xl font-black text-emerald-400 mt-2">
      R$ <?= number_format($faturamentoMes, 2, ',', '.') ?>
    </div>
    <div class="text-[10px] text-zinc-500 mt-1">OS Finalizadas & Pagas</div>
  </div>

  <!-- Card 2: OS Abertas / Andamento -->
  <div class="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
    <div class="flex items-center justify-between text-zinc-400 text-xs">
      <span>OS Abertas / Oficina</span>
      <i class="fas fa-clock text-amber-400"></i>
    </div>
    <div class="text-xl sm:text-2xl font-black text-amber-400 mt-2">
      <?= $osAbertas ?>
    </div>
    <div class="text-[10px] text-zinc-500 mt-1">Carros no pátio / bancada</div>
  </div>

  <!-- Card 3: OS Concluídas -->
  <div class="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
    <div class="flex items-center justify-between text-zinc-400 text-xs">
      <span>OS Finalizadas</span>
      <i class="fas fa-check-double text-blue-400"></i>
    </div>
    <div class="text-xl sm:text-2xl font-black text-blue-400 mt-2">
      <?= $osFinalizadas ?>
    </div>
    <div class="text-[10px] text-zinc-500 mt-1">Entregues com garantia</div>
  </div>

  <!-- Card 4: Contas a Receber -->
  <div class="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
    <div class="flex items-center justify-between text-zinc-400 text-xs">
      <span>Contas a Receber</span>
      <i class="fas fa-hand-holding-dollar text-[#FF6B00]"></i>
    </div>
    <div class="text-xl sm:text-2xl font-black text-[#FF6B00] mt-2">
      R$ <?= number_format($contasReceber, 2, ',', '.') ?>
    </div>
    <div class="text-[10px] text-zinc-500 mt-1">Aguardando PIX / Cartão</div>
  </div>

</div>

<!-- Quick License Plate Search Box -->
<div class="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center text-lg shrink-0">
      <i class="fas fa-car-side"></i>
    </div>
    <div>
      <h3 class="text-sm font-bold text-white">Consulta Rápida de Placa (Mercosul / Sinesp)</h3>
      <p class="text-xs text-zinc-400">Localize o histórico mecânico de qualquer veículo na oficina.</p>
    </div>
  </div>
  <div class="flex items-center gap-2 w-full sm:w-auto">
    <input 
      type="text" 
      id="quick_placa_input" 
      placeholder="Ex: RIO2026" 
      maxlength="7"
      oninput="formatarPlaca(this)"
      class="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono w-full sm:w-36 focus:outline-none focus:border-[#FF6B00]"
    >
    <button 
      type="button" 
      data-target="#quick_placa_input" 
      class="btn-buscar-placa px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition shrink-0"
    >
      <i class="fas fa-search mr-1"></i> Buscar
    </button>
  </div>
</div>

<!-- Ordens de Serviço Recentes (Responsividade: Vira Cards no Mobile) -->
<div class="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl mb-6">
  <div class="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
    <h2 class="text-sm font-bold text-white flex items-center gap-2">
      <i class="fas fa-list-check text-[#FF6B00]"></i>
      Ordens de Serviço Recentes no Pátio
    </h2>
    <a href="/os" class="text-xs text-[#FF6B00] hover:underline font-semibold">
      Ver Todas (<?= count($osRecentes) ?>) →
    </a>
  </div>

  <div class="p-4">
    <?php if (empty($osRecentes)): ?>
      <p class="text-xs text-zinc-500 text-center py-6">Nenhuma ordem de serviço cadastrada recentemente.</p>
    <?php else: ?>
      <table class="responsive-table w-full text-left text-xs">
        <thead class="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
          <tr>
            <th class="py-3 px-4">Número OS</th>
            <th class="py-3 px-4">Cliente</th>
            <th class="py-3 px-4">Veículo / Placa</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Valor Total</th>
            <th class="py-3 px-4">Entrada</th>
            <th class="py-3 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60">
          <?php foreach ($osRecentes as $os): ?>
            <tr class="hover:bg-zinc-800/30 transition">
              <td data-label="Número OS" class="py-3.5 px-4 font-mono font-bold text-white">
                <?= htmlspecialchars($os['numero_os']) ?>
              </td>
              <td data-label="Cliente" class="py-3.5 px-4 font-semibold text-zinc-200">
                <?= htmlspecialchars($os['cliente_nome'] ?? 'Cliente WhatsApp') ?>
              </td>
              <td data-label="Veículo / Placa" class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono font-bold text-zinc-200">
                  <?= htmlspecialchars($os['placa'] ?? 'RIO2026') ?>
                </span>
                <span class="text-zinc-400 ml-1"><?= htmlspecialchars($os['veiculo_modelo'] ?? '') ?></span>
              </td>
              <td data-label="Status" class="py-3.5 px-4">
                <?php
                $statusColor = match($os['status']) {
                  'Finalizada', 'Entregue' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                  'Em Andamento' => 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                  'Aguardando Peça' => 'bg-purple-500/15 text-purple-400 border-purple-500/30',
                  'Pré-Atendimento' => 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                  default => 'bg-zinc-800 text-zinc-300 border-zinc-700'
                };
                ?>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border <?= $statusColor ?>">
                  <?= htmlspecialchars($os['status']) ?>
                </span>
              </td>
              <td data-label="Valor Total" class="py-3.5 px-4 font-bold text-white font-mono">
                R$ <?= number_format((float)$os['valor_total'], 2, ',', '.') ?>
              </td>
              <td data-label="Entrada" class="py-3.5 px-4 text-zinc-400">
                <?= date('d/m/Y', strtotime($os['data_entrada'])) ?>
              </td>
              <td data-label="Ações" class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <a href="/os/detalhes/<?= $os['id'] ?>" class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition" title="Ver Detalhes">
                    <i class="fas fa-eye text-xs"></i>
                  </a>
                  <a href="/os/imprimir/<?= $os['id'] ?>" target="_blank" class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition" title="Imprimir OS">
                    <i class="fas fa-print text-xs"></i>
                  </a>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
</div>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
