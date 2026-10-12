<?php
$pageTitle = 'Nova Ordem de Serviço • EloMak';
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="max-w-4xl mx-auto space-y-6">
  
  <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
    <div>
      <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
        <i class="fas fa-file-circle-plus text-[#FF6B00]"></i> Nova Ordem de Serviço
      </h1>
      <p class="text-xs text-zinc-400">Preencha os dados de entrada do veículo e diagnóstico preliminar.</p>
    </div>
    <a href="/os" class="text-xs text-zinc-400 hover:text-white underline">
      <i class="fas fa-arrow-left mr-1"></i> Voltar à Lista
    </a>
  </div>

  <form method="POST" action="/os/salvar" enctype="multipart/form-data" class="space-y-6">

    <!-- 1. Dados do Cliente e Veículo -->
    <div class="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
      <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#FF6B00]">
        <i class="fas fa-user-gear"></i> 1. Cliente & Veículo
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Selecionar ou cadastrar cliente -->
        <div>
          <label class="block text-xs font-bold text-zinc-400 mb-1">Selecionar Cliente Existente</label>
          <select name="cliente_id" id="select_cliente" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]">
            <option value="0">+ Cadastrar Novo Cliente Abaixo</option>
            <?php foreach ($clientes as $cli): ?>
              <option value="<?= $cli['id'] ?>">
                <?= htmlspecialchars($cli['nome']) ?> (<?= htmlspecialchars($cli['whatsapp']) ?>)
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <!-- Selecionar ou cadastrar veículo -->
        <div>
          <label class="block text-xs font-bold text-zinc-400 mb-1">Selecionar Veículo Existente</label>
          <select name="veiculo_id" id="select_veiculo" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]">
            <option value="0">+ Cadastrar Novo Veículo Abaixo</option>
            <?php foreach ($veiculos as $veic): ?>
              <option value="<?= $veic['id'] ?>">
                <?= htmlspecialchars($veic['placa']) ?> - <?= htmlspecialchars($veic['modelo']) ?> (<?= htmlspecialchars($veic['cliente_nome']) ?>)
              </option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>

      <!-- Formulário Rápido para Novo Cliente / Carro (se for novo) -->
      <div id="box-novo-cliente-veiculo" class="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
        <span class="text-xs font-bold text-zinc-300 block">Cadastro Rápido (Se não selecionou acima)</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">Nome do Cliente</label>
            <input type="text" name="novo_cliente_nome" placeholder="Ex: João da Silva" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">WhatsApp (com DDD)</label>
            <input type="text" name="novo_cliente_whatsapp" placeholder="Ex: 21996134073" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono">
          </div>
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">CPF (opcional)</label>
            <input type="text" name="novo_cliente_cpf" placeholder="000.000.000-00" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white">
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/60">
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">Placa do Veículo</label>
            <div class="flex gap-1">
              <input type="text" id="nova_placa_input" name="nova_placa" placeholder="RIO2026" maxlength="7" oninput="formatarPlaca(this)" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-white uppercase font-mono">
              <button type="button" data-target="#nova_placa_input" class="btn-buscar-placa p-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs" title="Buscar FIPE"><i class="fas fa-search"></i></button>
            </div>
          </div>
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">Marca</label>
            <input type="text" id="input-marca" name="nova_marca" placeholder="Ex: Volkswagen" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">Modelo</label>
            <input type="text" id="input-modelo" name="novo_modelo" placeholder="Ex: Gol 1.6" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white">
          </div>
          <div>
            <label class="block text-[11px] text-zinc-500 mb-1">Ano / Cor</label>
            <input type="text" id="input-ano" name="novo_ano" placeholder="2018 / Prata" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white">
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Defeito Relatado e Diagnóstico -->
    <div class="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
      <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#FF6B00]">
        <i class="fas fa-stethoscope"></i> 2. Defeito Relatado & Laudo Técnico
      </h2>

      <div>
        <label class="block text-xs font-bold text-zinc-400 mb-1">Defeito Reclamado pelo Cliente *</label>
        <textarea name="defeito" rows="3" required placeholder="Descreva os sintomas descritos pelo cliente (ex: barulho ao frear, luz de óleo piscando, falha na partida)..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B00]"></textarea>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-zinc-400 mb-1">Diagnóstico Inicial da Oficina</label>
          <textarea name="diagnostico" rows="2" placeholder="Avaliação técnica preliminar realizada na rampa/elevador..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B00]"></textarea>
        </div>
        <div>
          <label class="block text-xs font-bold text-zinc-400 mb-1">Laudo Técnico / Observações da Garantia</label>
          <textarea name="laudo_tecnico" rows="2" placeholder="Peças substituídas, testes efetuados e recomendações..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF6B00]"></textarea>
        </div>
      </div>

      <!-- Upload de Fotos -->
      <div>
        <label class="block text-xs font-bold text-zinc-400 mb-1">Fotos do Veículo / Peças Danificadas (Antes/Depois)</label>
        <input type="file" name="fotos[]" multiple accept="image/*" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white">
      </div>
    </div>

    <!-- 3. Valores, Status e Baixa de Peças -->
    <div class="p-5 sm:p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
      <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-[#FF6B00]">
        <i class="fas fa-coins"></i> 3. Orçamento, Peças & Prazos
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Mão de Obra (R$)</label>
          <input type="number" step="0.01" name="valor_mao_obra" value="250.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Peças (R$)</label>
          <input type="number" step="0.01" name="valor_pecas" value="430.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Desconto (R$)</label>
          <input type="number" step="0.01" name="valor_desconto" value="0.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Status Inicial</label>
          <select name="status" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="Aberta">Aberta</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Aguardando Peça">Aguardando Peça</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Previsão de Entrega</label>
          <input type="date" name="prazo_entrega" value="<?= date('Y-m-d', strtotime('+3 days')) ?>" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Prazo de Garantia</label>
          <input type="text" name="prazo_garantia" value="90 dias (CDC Art. 26)" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
        </div>
        <div>
          <label class="block text-xs text-zinc-400 mb-1">Forma de Pagamento</label>
          <select name="forma_pagamento" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="Mercado Pago (PIX)">Mercado Pago (PIX Instantâneo)</option>
            <option value="Cartão de Crédito em até 12x">Cartão de Crédito em até 12x</option>
            <option value="Dinheiro / Transferência">Dinheiro / Transferência</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <a href="/os" class="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition">
        Cancelar
      </a>
      <button type="submit" class="px-7 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#E05E00] text-zinc-950 font-black text-xs transition shadow-xl shadow-[#FF6B00]/25 flex items-center gap-2 cursor-pointer">
        <i class="fas fa-check"></i> Salvar Ordem de Serviço
      </button>
    </div>

  </form>
</div>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
