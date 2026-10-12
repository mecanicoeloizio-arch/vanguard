<?php
$pageTitle = "{$os['numero_os']} • Detalhes da OS • EloMak";
require_once APP_PATH . '/views/layout_header.php';
?>

<div class="max-w-5xl mx-auto space-y-6">
  
  <!-- Top Bar -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h1 class="text-xl sm:text-2xl font-black text-white font-mono"><?= htmlspecialchars($os['numero_os']) ?></h1>
        <?php
        $statusColor = match($os['status']) {
          'Finalizada', 'Entregue' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          'Em Andamento' => 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          'Aguardando Peça' => 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          'Pré-Atendimento' => 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          default => 'bg-zinc-800 text-zinc-300 border-zinc-700'
        };
        ?>
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border <?= $statusColor ?>">
          <?= htmlspecialchars($os['status']) ?>
        </span>
      </div>
      <p class="text-xs text-zinc-400">
        Entrada em <?= date('d/m/Y H:i', strtotime($os['data_entrada'])) ?> • Oficina Mecânica EloMak
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Imprimir PDF -->
      <a href="/os/imprimir/<?= $os['id'] ?>" target="_blank" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-1.5">
        <i class="fas fa-print"></i> Imprimir OS
      </a>

      <!-- Disparar no WhatsApp com Camilla -->
      <?php
      $msgZap = "Olá {$os['cliente_nome']}! Aqui é da Oficina EloMak. Sua Ordem de Serviço #{$os['numero_os']} ({$os['placa']} - {$os['modelo']}) está no status '{$os['status']}'. Valor total: R$ " . number_format((float)$os['valor_total'], 2, ',', '.') . ".";
      $zapLink = "https://wa.me/" . preg_replace('/[^0-9]/', '', $os['cliente_whatsapp']) . "?text=" . urlencode($msgZap);
      ?>
      <a href="<?= $zapLink ?>" target="_blank" class="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition flex items-center gap-1.5">
        <i class="fab fa-whatsapp"></i> Notificar no Zap
      </a>

      <!-- Assinatura Digital no EloSign -->
      <a href="https://elosign.grupoeloizio.com.br" target="_blank" class="px-3.5 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20">
        <i class="fas fa-file-signature"></i> Assinar no EloSign
      </a>
    </div>
  </div>

  <!-- Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    <!-- Coluna 1 e 2: Detalhes do Serviço -->
    <div class="md:col-span-2 space-y-6">

      <!-- Informações do Cliente e Veículo -->
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-xs font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
          <i class="fas fa-id-card"></i> Identificação
        </h2>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-zinc-500 block">Cliente:</span>
            <strong class="text-white text-sm"><?= htmlspecialchars($os['cliente_nome']) ?></strong>
            <span class="text-zinc-400 block font-mono"><?= htmlspecialchars($os['cliente_whatsapp']) ?></span>
          </div>
          <div>
            <span class="text-zinc-500 block">Veículo:</span>
            <strong class="text-white text-sm"><?= htmlspecialchars($os['marca']) ?> <?= htmlspecialchars($os['modelo']) ?> (<?= htmlspecialchars($os['ano']) ?>)</strong>
            <span class="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono font-bold text-zinc-200 inline-block mt-0.5">
              <?= htmlspecialchars($os['placa']) ?>
            </span>
          </div>
        </div>
      </div>

      <!-- Defeito e Diagnóstico -->
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-xs font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
          <i class="fas fa-stethoscope"></i> Ocorrência Técnica
        </h2>
        <div>
          <span class="text-[11px] text-zinc-500 uppercase font-bold block mb-1">Defeito Reclamado pelo Cliente:</span>
          <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300">
            <?= nl2br(htmlspecialchars($os['defeito'])) ?>
          </div>
        </div>
        <?php if (!empty($os['diagnostico'])): ?>
          <div>
            <span class="text-[11px] text-zinc-500 uppercase font-bold block mb-1">Diagnóstico da Oficina:</span>
            <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300">
              <?= nl2br(htmlspecialchars($os['diagnostico'])) ?>
            </div>
          </div>
        <?php endif; ?>
        <?php if (!empty($os['laudo_tecnico'])): ?>
          <div>
            <span class="text-[11px] text-zinc-500 uppercase font-bold block mb-1">Laudo / Recomendações:</span>
            <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300">
              <?= nl2br(htmlspecialchars($os['laudo_tecnico'])) ?>
            </div>
          </div>
        <?php endif; ?>
      </div>

      <!-- Itens Aplicados -->
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-xs font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
          <i class="fas fa-boxes-packing"></i> Peças e Componentes Aplicados
        </h2>
        <?php if (empty($itens)): ?>
          <p class="text-xs text-zinc-500 italic">Nenhum item discriminado individualmente nesta OS.</p>
        <?php else: ?>
          <div class="divide-y divide-zinc-800/60 text-xs">
            <?php foreach ($itens as $it): ?>
              <div class="py-2.5 flex justify-between items-center">
                <div>
                  <span class="font-bold text-white"><?= htmlspecialchars($it['descricao']) ?></span>
                  <span class="text-zinc-500 block text-[11px]">Qtd: <?= $it['quantidade'] ?> x R$ <?= number_format((float)$it['valor_unitario'], 2, ',', '.') ?></span>
                </div>
                <div class="font-mono font-bold text-zinc-200">
                  R$ <?= number_format((float)$it['valor_total'], 2, ',', '.') ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

    </div>

    <!-- Coluna 3: Valores, Status e Garantia -->
    <div class="space-y-6">

      <!-- Atualizar Status -->
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <i class="fas fa-sliders text-[#FF6B00]"></i> Atualizar Status da OS
        </h2>
        <form method="POST" action="/os/atualizar-status" class="space-y-3">
          <input type="hidden" name="id" value="<?= $os['id'] ?>">
          <select name="status" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="Aberta" <?= ($os['status'] === 'Aberta') ? 'selected' : '' ?>>Aberta</option>
            <option value="Em Andamento" <?= ($os['status'] === 'Em Andamento') ? 'selected' : '' ?>>Em Andamento</option>
            <option value="Aguardando Peça" <?= ($os['status'] === 'Aguardando Peça') ? 'selected' : '' ?>>Aguardando Peça</option>
            <option value="Finalizada" <?= ($os['status'] === 'Finalizada') ? 'selected' : '' ?>>Finalizada</option>
            <option value="Entregue" <?= ($os['status'] === 'Entregue') ? 'selected' : '' ?>>Entregue ao Cliente</option>
            <option value="Cancelada" <?= ($os['status'] === 'Cancelada') ? 'selected' : '' ?>>Cancelada</option>
          </select>
          <button type="submit" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition">
            Atualizar Status
          </button>
        </form>
      </div>

      <!-- Resumo Financeiro -->
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-xs font-bold text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
          <i class="fas fa-receipt"></i> Resumo Financeiro
        </h2>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between text-zinc-400">
            <span>Mão de Obra:</span>
            <span class="font-mono text-zinc-200">R$ <?= number_format((float)$os['valor_mao_obra'], 2, ',', '.') ?></span>
          </div>
          <div class="flex justify-between text-zinc-400">
            <span>Peças & Materiais:</span>
            <span class="font-mono text-zinc-200">R$ <?= number_format((float)$os['valor_pecas'], 2, ',', '.') ?></span>
          </div>
          <?php if ((float)$os['valor_desconto'] > 0): ?>
            <div class="flex justify-between text-emerald-400">
              <span>Desconto Aplicado:</span>
              <span class="font-mono">- R$ <?= number_format((float)$os['valor_desconto'], 2, ',', '.') ?></span>
            </div>
          <?php endif; ?>
          <div class="pt-2 border-t border-zinc-800 flex justify-between font-bold text-sm">
            <span class="text-white">Valor Total:</span>
            <span class="text-[#FF6B00] font-mono text-base">R$ <?= number_format((float)$os['valor_total'], 2, ',', '.') ?></span>
          </div>
        </div>
        <div class="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">
          Pagamento: <strong class="text-zinc-300"><?= htmlspecialchars($os['forma_pagamento']) ?></strong>
        </div>
      </div>

      <!-- Termo de Garantia -->
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
        <h3 class="font-bold text-white flex items-center gap-1.5">
          <i class="fas fa-shield-halved text-emerald-400"></i> Termo de Garantia Legal
        </h3>
        <p class="text-zinc-400 leading-relaxed">
          Garantia de <strong><?= htmlspecialchars($os['prazo_garantia'] ?? '90 dias') ?></strong> sobre os serviços executados conforme o Artigo 26 do Código de Defesa do Consumidor (Lei 8.078/90).
        </p>
      </div>

    </div>

  </div>

</div>

<?php require_once APP_PATH . '/views/layout_footer.php'; ?>
