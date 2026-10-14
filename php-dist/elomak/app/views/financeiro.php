<?php
$pageTitle = 'Módulo Financeiro & PIX • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
  <div>
    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
      <i class="fas fa-wallet text-[#FF6B00]"></i> Gestão Financeira & Caixa
    </h1>
    <p class="text-xs text-zinc-400 mt-0.5">Contas a pagar e receber, conciliação e geração de cobrança PIX.</p>
  </div>
  <button onclick="$('#modal-novo-lancamento').removeClass('hidden')" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20 cursor-pointer">
    <i class="fas fa-plus"></i> Novo Lançamento
  </button>
</div>

<!-- 4 Métricas Financeiras -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
  <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
    <span class="text-xs text-zinc-400">Total Recebido (Pago)</span>
    <div class="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
      R$ <?= number_format($totalReceitas, 2, ',', '.') ?>
    </div>
  </div>
  <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
    <span class="text-xs text-zinc-400">Total Despesas (Pago)</span>
    <div class="text-xl sm:text-2xl font-black text-rose-400 mt-1">
      R$ <?= number_format($totalDespesas, 2, ',', '.') ?>
    </div>
  </div>
  <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
    <span class="text-xs text-zinc-400">Saldo Real em Caixa</span>
    <div class="text-xl sm:text-2xl font-black text-white mt-1">
      R$ <?= number_format($saldoCaixa, 2, ',', '.') ?>
    </div>
  </div>
  <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
    <span class="text-xs text-zinc-400">Contas a Receber Pendentes</span>
    <div class="text-xl sm:text-2xl font-black text-[#FF6B00] mt-1">
      R$ <?= number_format($aReceberPendente, 2, ',', '.') ?>
    </div>
  </div>
</div>

<!-- Tabela de Lançamentos (Vira cards no Mobile) -->
<div class="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl mb-6">
  <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
    <h2 class="text-sm font-bold text-white flex items-center gap-2">
      <i class="fas fa-receipt text-[#FF6B00]"></i> Extrato de Movimentações
    </h2>
    <div class="flex items-center gap-1.5 text-xs">
      <a href="/financeiro?tipo=todos" class="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-bold hover:text-white">Todos</a>
      <a href="/financeiro?tipo=receita" class="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold">Receitas</a>
      <a href="/financeiro?tipo=despesa" class="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 font-bold">Despesas</a>
    </div>
  </div>

  <div class="p-4">
    <?php if (empty($lancamentos)): ?>
      <p class="text-xs text-zinc-500 text-center py-8">Nenhum lançamento financeiro registrado.</p>
    <?php else: ?>
      <table class="responsive-table w-full text-left text-xs">
        <thead class="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
          <tr>
            <th class="py-3 px-4">Tipo</th>
            <th class="py-3 px-4">Categoria / Descrição</th>
            <th class="py-3 px-4">Vencimento</th>
            <th class="py-3 px-4">Forma</th>
            <th class="py-3 px-4">Valor</th>
            <th class="py-3 px-4">Status</th>
            <th class="py-3 px-4 text-right">Ação</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60">
          <?php foreach ($lancamentos as $l): ?>
            <tr class="hover:bg-zinc-800/30 transition">
              <td data-label="Tipo" class="py-3.5 px-4 font-bold">
                <?php if ($l['tipo'] === 'receita'): ?>
                  <span class="text-emerald-400"><i class="fas fa-arrow-down mr-1"></i> Receita</span>
                <?php else: ?>
                  <span class="text-rose-400"><i class="fas fa-arrow-up mr-1"></i> Despesa</span>
                <?php endif; ?>
              </td>
              <td data-label="Descrição" class="py-3.5 px-4">
                <span class="font-bold text-white block"><?= htmlspecialchars($l['descricao']) ?></span>
                <span class="text-zinc-500 text-[11px]"><?= htmlspecialchars($l['categoria']) ?></span>
              </td>
              <td data-label="Vencimento" class="py-3.5 px-4 text-zinc-400 font-mono">
                <?= date('d/m/Y', strtotime($l['data_vencimento'])) ?>
              </td>
              <td data-label="Forma" class="py-3.5 px-4 text-zinc-400">
                <?= htmlspecialchars($l['forma_pagamento']) ?>
              </td>
              <td data-label="Valor" class="py-3.5 px-4 font-bold font-mono text-sm <?= $l['tipo'] === 'receita' ? 'text-emerald-400' : 'text-rose-400' ?>">
                R$ <?= number_format((float)$l['valor'], 2, ',', '.') ?>
              </td>
              <td data-label="Status" class="py-3.5 px-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border <?= $l['status'] === 'pago' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30' ?>">
                  <?= htmlspecialchars($l['status']) ?>
                </span>
              </td>
              <td data-label="Ação" class="py-3.5 px-4 text-right">
                <?php if ($l['status'] !== 'pago'): ?>
                  <a href="/financeiro/baixar/<?= $l['id'] ?>" class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px]">
                    <i class="fas fa-check mr-1"></i> Baixar
                  </a>
                <?php else: ?>
                  <span class="text-zinc-500 text-[11px]"><i class="fas fa-check-double text-emerald-400"></i> Liquidado</span>
                <?php endif; ?>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
</div>

<!-- Modal Novo Lançamento -->
<div id="modal-novo-lancamento" class="modal-container hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
  <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
      <h3 class="font-bold text-white text-base flex items-center gap-2">
        <i class="fas fa-plus-circle text-[#FF6B00]"></i> Novo Lançamento Financeiro
      </h3>
      <button data-close-modal class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
    </div>

    <form method="POST" action="/financeiro/salvar" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Tipo *</label>
          <select name="tipo" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="receita">Receita (Entrada +)</option>
            <option value="despesa">Despesa (Saída -)</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Categoria *</label>
          <input type="text" name="categoria" value="Serviços Mecânicos" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
      </div>

      <div>
        <label class="block text-xs text-zinc-400 mb-1">Descrição do Lançamento *</label>
        <input type="text" name="descricao" placeholder="Ex: Pagamento Fornecedor de Peças Mann" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Valor (R$) *</label>
          <input type="number" step="0.01" name="valor" required placeholder="0.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Vencimento *</label>
          <input type="date" name="data_vencimento" value="<?= date('Y-m-d') ?>" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Status</label>
          <select name="status" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="pendente">Pendente</option>
            <option value="pago">Já Pago / Liquidado</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Forma</label>
          <select name="forma_pagamento" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="PIX">PIX</option>
            <option value="Cartão">Cartão</option>
            <option value="Boleto">Boleto</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" data-close-modal class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold">Cancelar</button>
        <button type="submit" class="px-5 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 text-xs font-black">Salvar Lançamento</button>
      </div>
    </form>
  </div>
</div>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
