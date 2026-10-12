<?php
$pageTitle = 'Estoque & Peças • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
  <div>
    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
      <i class="fas fa-boxes-stacked text-[#FF6B00]"></i> Produtos & Estoque de Peças
    </h1>
    <p class="text-xs text-zinc-400 mt-0.5">Controle de peças, preços de custo/venda e baixa automática ao usar na OS.</p>
  </div>
  <button onclick="$('#modal-novo-produto').removeClass('hidden')" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20 cursor-pointer">
    <i class="fas fa-plus"></i> Novo Produto
  </button>
</div>

<!-- Search -->
<div class="my-6">
  <form method="GET" action="/estoque" class="max-w-md flex gap-2">
    <input 
      type="text" 
      name="q" 
      value="<?= htmlspecialchars($_GET['q'] ?? '') ?>" 
      placeholder="Buscar por código, descrição ou fornecedor..." 
      class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
    >
    <button type="submit" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition">
      <i class="fas fa-search"></i>
    </button>
  </form>
</div>

<!-- Tabela de Produtos (Vira cards no Mobile) -->
<div class="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl mb-6">
  <div class="p-4">
    <?php if (empty($produtos)): ?>
      <p class="text-xs text-zinc-500 text-center py-8">Nenhum produto cadastrado no estoque.</p>
    <?php else: ?>
      <table class="responsive-table w-full text-left text-xs">
        <thead class="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
          <tr>
            <th class="py-3 px-4">Código</th>
            <th class="py-3 px-4">Descrição do Produto</th>
            <th class="py-3 px-4">Fornecedor</th>
            <th class="py-3 px-4">Preço Custo</th>
            <th class="py-3 px-4">Preço Venda</th>
            <th class="py-3 px-4 text-center">Saldo em Estoque</th>
            <th class="py-3 px-4 text-right">Ajuste</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60">
          <?php foreach ($produtos as $p): 
            $alertaMinimo = (float)$p['quantidade'] <= (float)$p['estoque_minimo'];
          ?>
            <tr class="hover:bg-zinc-800/30 transition <?= $alertaMinimo ? 'bg-amber-950/10' : '' ?>">
              <td data-label="Código" class="py-3.5 px-4 font-mono font-bold text-white">
                <?= htmlspecialchars($p['codigo']) ?>
              </td>
              <td data-label="Descrição" class="py-3.5 px-4 font-semibold text-zinc-200">
                <?= htmlspecialchars($p['descricao']) ?>
              </td>
              <td data-label="Fornecedor" class="py-3.5 px-4 text-zinc-400">
                <?= htmlspecialchars($p['fornecedor'] ?? '-') ?>
              </td>
              <td data-label="Preço Custo" class="py-3.5 px-4 font-mono text-zinc-400">
                R$ <?= number_format((float)$p['preco_custo'], 2, ',', '.') ?>
              </td>
              <td data-label="Preço Venda" class="py-3.5 px-4 font-mono font-bold text-white">
                R$ <?= number_format((float)$p['preco_venda'], 2, ',', '.') ?>
              </td>
              <td data-label="Saldo" class="py-3.5 px-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full font-bold text-[11px] font-mono border <?= $alertaMinimo ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' ?>">
                  <?= number_format((float)$p['quantidade'], 1, ',', '') ?> <?= htmlspecialchars($p['unidade']) ?>
                  <?php if ($alertaMinimo): ?>
                    <i class="fas fa-triangle-exclamation ml-1" title="Estoque no limite mínimo"></i>
                  <?php endif; ?>
                </span>
              </td>
              <td data-label="Ajuste" class="py-3.5 px-4 text-right">
                <button onclick="abrirAjuste(<?= $p['id'] ?>, '<?= htmlspecialchars(addslashes($p['descricao'])) ?>')" class="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold">
                  <i class="fas fa-sliders mr-1"></i> Ajustar
                </button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
</div>

<!-- Modal Novo Produto -->
<div id="modal-novo-produto" class="modal-container hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
  <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
      <h3 class="font-bold text-white text-base flex items-center gap-2">
        <i class="fas fa-boxes-stacked text-[#FF6B00]"></i> Cadastrar Produto no Estoque
      </h3>
      <button data-close-modal class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
    </div>

    <form method="POST" action="/estoque/salvar" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Código da Peça *</label>
          <input type="text" name="codigo" required placeholder="Ex: OLEO-5W30" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Categoria</label>
          <input type="text" name="categoria" value="Peças Mecânicas" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
      </div>

      <div>
        <label class="block text-xs text-zinc-400 mb-1">Descrição do Produto *</label>
        <input type="text" name="descricao" required placeholder="Ex: Óleo Sintético 5W30 1L" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Fornecedor</label>
          <input type="text" name="fornecedor" placeholder="Ex: Distribuidora Lubrax" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Preço de Custo (R$)</label>
          <input type="number" step="0.01" name="preco_custo" placeholder="0.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Preço Venda (R$)</label>
          <input type="number" step="0.01" name="preco_venda" required placeholder="0.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Qtd Inicial</label>
          <input type="number" step="0.1" name="quantidade" value="10" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Estoque Mínimo</label>
          <input type="number" step="0.1" name="estoque_minimo" value="2" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" data-close-modal class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold">Cancelar</button>
        <button type="submit" class="px-5 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 text-xs font-black">Salvar Peça</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal Ajuste Saldo -->
<div id="modal-ajuste-saldo" class="modal-container hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
  <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
      <h3 class="font-bold text-white text-sm" id="ajuste-produto-nome">Ajustar Saldo</h3>
      <button data-close-modal class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
    </div>

    <form method="POST" action="/estoque/ajustar" class="space-y-4">
      <input type="hidden" name="produto_id" id="ajuste_produto_id">
      
      <div>
        <label class="block text-xs text-zinc-400 mb-1">Tipo de Movimentação</label>
        <select name="tipo" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
          <option value="entrada">Entrada (+) Nova Compra</option>
          <option value="saida">Saída (-) Consumo / Quebra</option>
        </select>
      </div>

      <div>
        <label class="block text-xs text-zinc-400 mb-1">Quantidade</label>
        <input type="number" step="0.1" name="quantidade" value="1" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
      </div>

      <div>
        <label class="block text-xs text-zinc-400 mb-1">Motivo</label>
        <input type="text" name="motivo" placeholder="Ex: Compra de reposição nota fiscal #8812" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" data-close-modal class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold">Cancelar</button>
        <button type="submit" class="px-5 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 text-xs font-black">Confirmar</button>
      </div>
    </form>
  </div>
</div>

<script>
function abrirAjuste(id, nome) {
  $('#ajuste_produto_id').val(id);
  $('#ajuste-produto-nome').text('Ajuste: ' + nome);
  $('#modal-ajuste-saldo').removeClass('hidden');
}
</script>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
