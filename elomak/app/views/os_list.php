<?php
$pageTitle = 'Ordens de Serviço • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
  <div>
    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
      <i class="fas fa-file-invoice text-[#FF6B00]"></i> Gestão de Ordens de Serviço
    </h1>
    <p class="text-xs text-zinc-400 mt-0.5">
      Acompanhe todos os serviços em execução, peças aplicadas e garantias.
    </p>
  </div>
  <a href="/os/novo" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20">
    <i class="fas fa-plus"></i> Abrir Nova OS
  </a>
</div>

<!-- Search & Status Filters -->
<div class="my-6 flex flex-col md:flex-row items-center justify-between gap-3">
  <form method="GET" action="/os" class="w-full md:w-96 flex gap-2">
    <input 
      type="text" 
      name="q" 
      value="<?= htmlspecialchars($_GET['q'] ?? '') ?>" 
      placeholder="Buscar por placa, cliente ou número OS..." 
      class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
    >
    <button type="submit" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition">
      <i class="fas fa-search"></i>
    </button>
  </form>

  <!-- Status Tabs -->
  <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
    <?php
    $curStatus = $_GET['status'] ?? 'todos';
    $statusOptions = [
      'todos' => 'Todos',
      'Aberta' => 'Abertas',
      'Em Andamento' => 'Em Andamento',
      'Aguardando Peça' => 'Aguardando Peça',
      'Finalizada' => 'Finalizadas'
    ];
    foreach ($statusOptions as $k => $label):
    ?>
      <a 
        href="/os?status=<?= urlencode($k) ?><?= !empty($_GET['q']) ? '&q=' . urlencode($_GET['q']) : '' ?>" 
        class="px-3 py-1.5 rounded-xl whitespace-nowrap transition <?= ($curStatus === $k) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white' ?>"
      >
        <?= $label ?>
      </a>
    <?php endforeach; ?>
  </div>
</div>

<!-- Responsive Table (Vira Cards no Mobile) -->
<div class="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
  <div class="p-4">
    <?php if (empty($ordens)): ?>
      <p class="text-xs text-zinc-500 text-center py-10">Nenhuma ordem de serviço localizada com os filtros informados.</p>
    <?php else: ?>
      <table class="responsive-table w-full text-left text-xs">
        <thead class="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
          <tr>
            <th class="py-3 px-4">Número</th>
            <th class="py-3 px-4">Cliente / WhatsApp</th>
            <th class="py-3 px-4">Veículo</th>
            <th class="py-3 px-4">Defeito Relatado</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Valor Total</th>
            <th class="py-3 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60">
          <?php foreach ($ordens as $os): ?>
            <tr class="hover:bg-zinc-800/30 transition">
              <td data-label="Número" class="py-3.5 px-4 font-mono font-bold text-white">
                <?= htmlspecialchars($os['numero_os']) ?>
              </td>
              <td data-label="Cliente" class="py-3.5 px-4 font-semibold text-zinc-200">
                <div><?= htmlspecialchars($os['cliente_nome'] ?? 'Cliente') ?></div>
                <div class="text-[10px] text-zinc-500 font-mono"><?= htmlspecialchars($os['cliente_whatsapp'] ?? '') ?></div>
              </td>
              <td data-label="Veículo" class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono font-bold text-zinc-200">
                  <?= htmlspecialchars($os['placa'] ?? 'RIO2026') ?>
                </span>
                <span class="text-zinc-400 ml-1"><?= htmlspecialchars($os['modelo'] ?? '') ?></span>
              </td>
              <td data-label="Defeito" class="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                <?= htmlspecialchars($os['defeito']) ?>
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
              <td data-label="Ações" class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <a href="/os/detalhes/<?= $os['id'] ?>" class="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-bold" title="Abrir">
                    <i class="fas fa-folder-open mr-1"></i> Abrir
                  </a>
                  <a href="/os/imprimir/<?= $os['id'] ?>" target="_blank" class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300" title="Imprimir">
                    <i class="fas fa-print"></i>
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
