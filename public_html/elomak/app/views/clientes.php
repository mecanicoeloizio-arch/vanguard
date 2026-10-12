<?php
$pageTitle = 'Clientes & Veículos • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
  <div>
    <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
      <i class="fas fa-users text-[#FF6B00]"></i> Clientes & Veículos
    </h1>
    <p class="text-xs text-zinc-400 mt-0.5">Base cadastral completa com histórico de passagens pela oficina.</p>
  </div>
  <button onclick="$('#modal-novo-cliente').removeClass('hidden')" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20 cursor-pointer">
    <i class="fas fa-user-plus"></i> Novo Cliente
  </button>
</div>

<!-- Search Bar -->
<div class="my-6">
  <form method="GET" action="/clientes" class="max-w-md flex gap-2">
    <input 
      type="text" 
      name="q" 
      value="<?= htmlspecialchars($_GET['q'] ?? '') ?>" 
      placeholder="Buscar por nome, WhatsApp ou CPF..." 
      class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
    >
    <button type="submit" class="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition">
      <i class="fas fa-search"></i>
    </button>
  </form>
</div>

<!-- Tabela de Clientes (Vira cards no Mobile) -->
<div class="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
  <div class="p-4">
    <?php if (empty($clientes)): ?>
      <p class="text-xs text-zinc-500 text-center py-8">Nenhum cliente cadastrado.</p>
    <?php else: ?>
      <table class="responsive-table w-full text-left text-xs">
        <thead class="bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
          <tr>
            <th class="py-3 px-4">Nome do Cliente</th>
            <th class="py-3 px-4">WhatsApp</th>
            <th class="py-3 px-4">CPF / Documento</th>
            <th class="py-3 px-4">Cidade</th>
            <th class="py-3 px-4 text-center">Veículos</th>
            <th class="py-3 px-4 text-center">Ordens de Serviço</th>
            <th class="py-3 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60">
          <?php foreach ($clientes as $cli): ?>
            <tr class="hover:bg-zinc-800/30 transition">
              <td data-label="Nome" class="py-3.5 px-4 font-bold text-white">
                <?= htmlspecialchars($cli['nome']) ?>
              </td>
              <td data-label="WhatsApp" class="py-3.5 px-4 font-mono text-zinc-300">
                <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $cli['whatsapp']) ?>" target="_blank" class="text-emerald-400 hover:underline">
                  <i class="fab fa-whatsapp mr-1"></i><?= htmlspecialchars($cli['whatsapp']) ?>
                </a>
              </td>
              <td data-label="CPF" class="py-3.5 px-4 text-zinc-400 font-mono">
                <?= htmlspecialchars($cli['cpf'] ?? '-') ?>
              </td>
              <td data-label="Cidade" class="py-3.5 px-4 text-zinc-400">
                <?= htmlspecialchars($cli['cidade']) ?>
              </td>
              <td data-label="Veículos" class="py-3.5 px-4 text-center">
                <span class="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 font-bold text-zinc-300 text-[11px]">
                  <?= $cli['total_veiculos'] ?>
                </span>
              </td>
              <td data-label="OSs" class="py-3.5 px-4 text-center">
                <span class="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 font-bold text-zinc-300 text-[11px]">
                  <?= $cli['total_os'] ?>
                </span>
              </td>
              <td data-label="Ações" class="py-3.5 px-4 text-right">
                <a href="/os/novo?cliente_id=<?= $cli['id'] ?>" class="px-2.5 py-1 rounded-lg bg-[#FF6B00] text-zinc-950 font-bold text-[11px] hover:brightness-110">
                  <i class="fas fa-plus mr-1"></i> Criar OS
                </a>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
</div>

<!-- Modal Novo Cliente -->
<div id="modal-novo-cliente" class="modal-container hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
  <div class="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
      <h3 class="font-bold text-white text-base flex items-center gap-2">
        <i class="fas fa-user-plus text-[#FF6B00]"></i> Cadastrar Cliente & Veículo
      </h3>
      <button data-close-modal class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
    </div>

    <form method="POST" action="/clientes/salvar" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Nome Completo *</label>
          <input type="text" name="nome" required placeholder="Ex: Roberto Carlos" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">WhatsApp com DDD *</label>
          <input type="text" name="whatsapp" required placeholder="Ex: 21996134073" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">CPF</label>
          <input type="text" name="cpf" placeholder="000.000.000-00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Cidade</label>
          <input type="text" name="cidade" value="São Gonçalo - RJ" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
      </div>

      <div class="pt-3 border-t border-zinc-800 space-y-2">
        <span class="text-xs font-bold text-zinc-300 block">Veículo Inicial (Opcional)</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label class="block text-[10px] text-zinc-500 mb-0.5">Placa</label>
            <input type="text" id="modal_placa" name="veiculo_placa" placeholder="RIO2026" maxlength="7" oninput="formatarPlaca(this)" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white uppercase font-mono">
          </div>
          <div>
            <label class="block text-[10px] text-zinc-500 mb-0.5">Marca</label>
            <input type="text" name="veiculo_marca" placeholder="Fiat" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
          </div>
          <div>
            <label class="block text-[10px] text-zinc-500 mb-0.5">Modelo</label>
            <input type="text" name="veiculo_modelo" placeholder="Uno" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
          </div>
          <div>
            <label class="block text-[10px] text-zinc-500 mb-0.5">Ano</label>
            <input type="text" name="veiculo_ano" placeholder="2015" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" data-close-modal class="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold">Cancelar</button>
        <button type="submit" class="px-5 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 text-xs font-black">Salvar Cliente</button>
      </div>
    </form>
  </div>
</div>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
