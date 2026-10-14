<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ordem de Serviço #<?= htmlspecialchars($os['numero_os']) ?> • EloMak</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
    }
  </style>
</head>
<body class="bg-white text-zinc-900 font-sans p-6 max-w-4xl mx-auto">
  
  <div class="no-print mb-6 flex justify-between items-center bg-zinc-100 p-4 rounded-xl border border-zinc-300">
    <span class="text-xs font-bold text-zinc-700">Visualização de Impressão da OS</span>
    <button onclick="window.print()" class="px-4 py-2 bg-[#FF6B00] text-zinc-950 font-bold text-xs rounded-lg hover:brightness-110">
      Imprimir / Salvar PDF
    </button>
  </div>

  <!-- Header da Oficina -->
  <div class="border-b-2 border-zinc-900 pb-4 flex justify-between items-start">
    <div>
      <h1 class="text-xl font-black uppercase tracking-tight">Oficina Mecânica EloMak & Grupo Eloizio</h1>
      <p class="text-xs text-zinc-600">CNPJ: 12.345.678/0001-90 • Rua Dr. Nilo Peçanha, 450 - Centro, São Gonçalo - RJ</p>
      <p class="text-xs text-zinc-600">WhatsApp / Atendimento Oficial: (21) 99613-4073 • Site: grupoeloizio.com.br</p>
    </div>
    <div class="text-right">
      <div class="text-2xl font-black font-mono"><?= htmlspecialchars($os['numero_os']) ?></div>
      <div class="text-xs text-zinc-500">Data: <?= date('d/m/Y H:i', strtotime($os['data_entrada'])) ?></div>
      <div class="text-xs font-bold uppercase mt-1 px-2 py-0.5 bg-zinc-100 border border-zinc-300 inline-block rounded">
        Status: <?= htmlspecialchars($os['status']) ?>
      </div>
    </div>
  </div>

  <!-- Dados do Cliente e Veículo -->
  <div class="grid grid-cols-2 gap-4 py-4 border-b border-zinc-200 text-xs">
    <div>
      <h2 class="font-bold uppercase text-zinc-700 mb-1">Dados do Cliente</h2>
      <p><strong>Nome:</strong> <?= htmlspecialchars($os['cliente_nome']) ?></p>
      <p><strong>WhatsApp:</strong> <?= htmlspecialchars($os['cliente_whatsapp']) ?></p>
      <p><strong>CPF:</strong> <?= htmlspecialchars($os['cliente_cpf'] ?? 'Identificado') ?></p>
    </div>
    <div>
      <h2 class="font-bold uppercase text-zinc-700 mb-1">Dados do Veículo</h2>
      <p><strong>Placa:</strong> <span class="font-mono font-bold"><?= htmlspecialchars($os['placa']) ?></span></p>
      <p><strong>Veículo:</strong> <?= htmlspecialchars($os['marca']) ?> <?= htmlspecialchars($os['modelo']) ?> (<?= htmlspecialchars($os['ano']) ?>)</p>
      <p><strong>KM:</strong> <?= number_format((int)($os['km_atual'] ?? 0), 0, '', '.') ?> km</p>
    </div>
  </div>

  <!-- Ocorrência Técnica -->
  <div class="py-4 border-b border-zinc-200 text-xs space-y-3">
    <div>
      <h2 class="font-bold uppercase text-zinc-700 mb-0.5">Defeito Relatado pelo Cliente</h2>
      <p class="text-zinc-800 bg-zinc-50 p-2.5 rounded border border-zinc-200"><?= nl2br(htmlspecialchars($os['defeito'])) ?></p>
    </div>
    <?php if (!empty($os['diagnostico'])): ?>
      <div>
        <h2 class="font-bold uppercase text-zinc-700 mb-0.5">Diagnóstico Técnico</h2>
        <p class="text-zinc-800 bg-zinc-50 p-2.5 rounded border border-zinc-200"><?= nl2br(htmlspecialchars($os['diagnostico'])) ?></p>
      </div>
    <?php endif; ?>
  </div>

  <!-- Itens e Valores -->
  <div class="py-4 border-b border-zinc-200 text-xs">
    <h2 class="font-bold uppercase text-zinc-700 mb-2">Discriminação de Serviços e Peças</h2>
    <table class="w-full text-left text-xs mb-3">
      <thead class="bg-zinc-100 border-b border-zinc-300">
        <tr>
          <th class="py-1.5 px-2">Descrição</th>
          <th class="py-1.5 px-2 text-center">Qtd</th>
          <th class="py-1.5 px-2 text-right">Unitário</th>
          <th class="py-1.5 px-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <?php if (!empty($itens)): ?>
          <?php foreach ($itens as $it): ?>
            <tr class="border-b border-zinc-100">
              <td class="py-1.5 px-2"><?= htmlspecialchars($it['descricao']) ?></td>
              <td class="py-1.5 px-2 text-center"><?= $it['quantidade'] ?></td>
              <td class="py-1.5 px-2 text-right">R$ <?= number_format((float)$it['valor_unitario'], 2, ',', '.') ?></td>
              <td class="py-1.5 px-2 text-right font-mono">R$ <?= number_format((float)$it['valor_total'], 2, ',', '.') ?></td>
            </tr>
          <?php endforeach; ?>
        <?php else: ?>
          <tr class="border-b border-zinc-100">
            <td class="py-1.5 px-2">Mão de obra e serviços mecânicos gerais</td>
            <td class="py-1.5 px-2 text-center">1</td>
            <td class="py-1.5 px-2 text-right">R$ <?= number_format((float)$os['valor_mao_obra'], 2, ',', '.') ?></td>
            <td class="py-1.5 px-2 text-right font-mono">R$ <?= number_format((float)$os['valor_mao_obra'], 2, ',', '.') ?></td>
          </tr>
          <?php if ((float)$os['valor_pecas'] > 0): ?>
            <tr class="border-b border-zinc-100">
              <td class="py-1.5 px-2">Peças e componentes mecânicos</td>
              <td class="py-1.5 px-2 text-center">1</td>
              <td class="py-1.5 px-2 text-right">R$ <?= number_format((float)$os['valor_pecas'], 2, ',', '.') ?></td>
              <td class="py-1.5 px-2 text-right font-mono">R$ <?= number_format((float)$os['valor_pecas'], 2, ',', '.') ?></td>
            </tr>
          <?php endif; ?>
        <?php endif; ?>
      </tbody>
    </table>

    <!-- Totais -->
    <div class="flex justify-end">
      <div class="w-64 space-y-1 text-xs">
        <div class="flex justify-between">
          <span>Mão de Obra:</span>
          <span>R$ <?= number_format((float)$os['valor_mao_obra'], 2, ',', '.') ?></span>
        </div>
        <div class="flex justify-between">
          <span>Peças:</span>
          <span>R$ <?= number_format((float)$os['valor_pecas'], 2, ',', '.') ?></span>
        </div>
        <?php if ((float)$os['valor_desconto'] > 0): ?>
          <div class="flex justify-between text-zinc-600">
            <span>Desconto:</span>
            <span>- R$ <?= number_format((float)$os['valor_desconto'], 2, ',', '.') ?></span>
          </div>
        <?php endif; ?>
        <div class="flex justify-between font-black text-sm pt-1 border-t border-zinc-400">
          <span>TOTAL GERAL:</span>
          <span class="font-mono">R$ <?= number_format((float)$os['valor_total'], 2, ',', '.') ?></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Termo de Garantia e Assinaturas -->
  <div class="pt-4 text-xs space-y-8">
    <p class="text-[11px] text-zinc-600 text-justify leading-relaxed">
      <strong>Termo de Autorização e Garantia:</strong> Declaro ciência e autorizo a execução dos serviços e substituição das peças acima discriminadas. Todos os serviços mecânicos possuem garantia de <strong><?= htmlspecialchars($os['prazo_garantia'] ?? '90 dias') ?></strong> contados a partir da data de entrega, conforme Artigo 26 da Lei Federal 8.078/90 (CDC). Peças substituídas ficam à disposição para conferência.
    </p>

    <div class="grid grid-cols-2 gap-12 pt-6">
      <div class="text-center border-t border-zinc-400 pt-1">
        <span class="font-bold block"><?= htmlspecialchars($os['cliente_nome']) ?></span>
        <span class="text-[10px] text-zinc-500">Assinatura do Cliente / Contratante</span>
      </div>
      <div class="text-center border-t border-zinc-400 pt-1">
        <span class="font-bold block">Oficina Mecânica EloMak</span>
        <span class="text-[10px] text-zinc-500">Mestre Mecânico Responsável</span>
      </div>
    </div>
  </div>

</body>
</html>
