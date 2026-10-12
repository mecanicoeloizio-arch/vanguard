<?php
$pageTitle = 'Orçamentos • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
  <div>
    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
      <i class="fas fa-calculator text-[#FF6B00]"></i> Orçamentos de Oficina
    </h1>
    <p class="text-xs text-zinc-400 mt-0.5">Envie estimativas de peças e serviços e converta em Ordem de Serviço com 1 clique.</p>
  </div>
  <button onclick="$('#modal-novo-orcamento').removeClass('hidden')" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20 cursor-pointer">
    <i class="fas fa-plus"></i> Novo Orçamento
  </button>
</div>

<!-- Tabela de Orçamentos (Vira cards no Mobile) -->
<div class="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl my-6">
  <div class="p-4">
    <?php if (empty($orcamentos)): ?>
      <p class="text-xs text-zinc-500 text-center py-8">Nenhum orçamento cadastrado no momento.</p>
    <?php else: ?>
      <table class="responsive-table w-full text-left text-xs">
        <thead class="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
          <tr>
            <th class="py-3 px-4">Número</th>
            <th class="py-3 px-4">Cliente / WhatsApp</th>
            <th class="py-3 px-4">Veículo</th>
            <th class="py-3 px-4">Descrição</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4">Valor Total</th>
            <th class="py-3 px-4 text-right">Ação 1-Clique</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60">
          <?php foreach ($orcamentos as $orc): ?>
            <tr class="hover:bg-zinc-800/30 transition">
              <td data-label="Número" class="py-3.5 px-4 font-mono font-bold text-white">
                <?= htmlspecialchars($orc['numero_orcamento']) ?>
              </td>
              <td data-label="Cliente" class="py-3.5 px-4 font-semibold text-zinc-200">
                <?= htmlspecialchars($orc['cliente_nome'] ?? 'Cliente') ?>
              </td>
              <td data-label="Veículo" class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono font-bold text-zinc-200">
                  <?= htmlspecialchars($orc['placa'] ?? 'RIO2026') ?>
                </span>
                <span class="text-zinc-400 ml-1"><?= htmlspecialchars($orc['modelo'] ?? '') ?></span>
              </td>
              <td data-label="Descrição" class="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                <?= htmlspecialchars($orc['descricao_servicos']) ?>
              </td>
              <td data-label="Status" class="py-3.5 px-4">
                <?php
                $statusColor = match($orc['status']) {
                  'Convertido em OS' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                  'Aprovado' => 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                  'Recusado' => 'bg-rose-500/15 text-rose-400 border-rose-500/30',
                  default => 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                };
                ?>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border <?= $statusColor ?>">
                  <?= htmlspecialchars($orc['status']) ?>
                </span>
              </td>
              <td data-label="Valor Total" class="py-3.5 px-4 font-bold text-white font-mono">
                R$ <?= number_format((float)$orc['valor_total'], 2, ',', '.') ?>
              </td>
              <td data-label="Ação 1-Clique" class="py-3.5 px-4 text-right">
                <?php if ($orc['status'] !== 'Convertido em OS'): ?>
                  <a href="/orcamentos/converter/<?= $orc['id'] ?>" class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-[11px] transition inline-flex items-center gap-1 shadow-md shadow-emerald-500/20">
                    <i class="fas fa-bolt"></i> Virar OS (1 Clique)
                  </a>
                <?php else: ?>
                  <a href="/os/detalhes/<?= $orc['os_gerada_id'] ?>" class="text-xs text-zinc-400 hover:text-white underline">
                    Ver OS Gerada →
                  </a>
                <?php endif; ?>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
</div>

<!-- Modal Novo Orçamento -->
<div id="modal-novo-orcamento" class="modal-container hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
  <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
      <h3 class="font-bold text-white text-base flex items-center gap-2">
        <i class="fas fa-calculator text-[#FF6B00]"></i> Novo Orçamento de Oficina
      </h3>
      <button data-close-modal class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
    </div>

    <form method="POST" action="/orcamentos/salvar" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Cliente *</label>
          <select name="cliente_id" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <?php foreach ($clientes as $c): ?>
              <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['nome']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Veículo / Placa *</label>
          <select name="veiculo_id" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <?php foreach ($veiculos as $v): ?>
              <option value="<?= $v['id'] ?>"><?= htmlspecialchars($v['placa']) ?> - <?= htmlspecialchars($v['modelo']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs text-zinc-400 mb-1">Descrição dos Serviços e Peças *</label>
        <textarea name="descricao_servicos" required rows="3" placeholder="Ex: Troca de pastilhas dianteiras, retífica de discos e troca de fluido de freio..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Valor Total (R$) *</label>
          <input type="number" step="0.01" name="valor_total" required placeholder="0.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Validade (Dias)</label>
          <input type="number" name="validade_dias" value="10" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" data-close-modal class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold">Cancelar</button>
        <button type="submit" class="px-5 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 text-xs font-black">Gerar Orçamento</button>
      </div>
    </form>
  </div>
</div>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
