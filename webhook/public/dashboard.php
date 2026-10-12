<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hub Central de Webhooks & Mercado Pago • Grupo Eloizio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #18181b; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased">

  <!-- Header Superior -->
  <header class="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
          <i class="fa-solid fa-network-wired text-lg"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-white tracking-tight">Hub Central Grupo Eloizio</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
            </span>
          </div>
          <p class="text-xs text-zinc-400">webhook.grupoeloizio.com.br • Mercado Pago & WhatsApp</p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-xs text-zinc-300">
          <i class="fa-solid fa-headset text-orange-400"></i>
          <span>Atendente: <strong>Camilla Faria</strong> (21 99613-4073)</span>
        </div>
        <a href="https://grupoeloizio.com.br" target="_blank" class="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span class="hidden sm:inline">Portal Grupo Eloizio</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Container Principal -->
  <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

    <!-- Hero / Status Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
          <span>Mercado Pago Pix & Card</span>
          <i class="fa-solid fa-credit-card text-blue-400"></i>
        </div>
        <div class="text-2xl font-bold text-white mb-1">R$ 14.850,00</div>
        <p class="text-[11px] text-zinc-400 flex items-center gap-1 text-emerald-400">
          <i class="fa-solid fa-arrow-trend-up"></i> Central de Recebimentos Ativa
        </p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
          <span>Roteamento WhatsApp</span>
          <i class="fa-brands fa-whatsapp text-emerald-400 text-base"></i>
        </div>
        <div class="text-2xl font-bold text-white mb-1">4 Projetos</div>
        <p class="text-[11px] text-zinc-400">EloMak, EloContábil, EloSign, Cursos</p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
          <span>Atendente Camilla</span>
          <i class="fa-solid fa-robot text-orange-400"></i>
        </div>
        <div class="text-2xl font-bold text-white mb-1">99.4% Taxa Resposta</div>
        <p class="text-[11px] text-zinc-400">Triagem autônoma • Café ☕</p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
          <span>Latência Média</span>
          <i class="fa-solid fa-bolt text-amber-400"></i>
        </div>
        <div class="text-2xl font-bold text-white mb-1">28 ms</div>
        <p class="text-[11px] text-zinc-400">cURL Interno X-Webhook-Secret</p>
      </div>
    </div>

    <!-- Mapeamento de Subsistemas Integrados -->
    <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-diagram-project text-orange-500"></i>
            Ecossistema Grupo Eloizio Conectado
          </h2>
          <p class="text-xs text-zinc-400">Todos os subdomínios recebem notificações e pagamentos deste hub central</p>
        </div>
        <span class="text-xs text-zinc-500 font-mono">Secret: eloizio_secret_123</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- EloMak Card -->
        <div class="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between hover:border-orange-500/50 transition">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-sm text-white flex items-center gap-2">
                <i class="fa-solid fa-wrench text-orange-500"></i> EloMak
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 text-orange-400 font-mono font-medium">Oficinas</span>
            </div>
            <p class="text-xs text-zinc-400 mb-3">ERP Mecânica sem senha, triagem placa e OS automática.</p>
            <div class="text-[11px] font-mono text-zinc-500 break-all mb-2">
              /api/webhook_receiver.php
            </div>
          </div>
          <a href="https://elomak.grupoeloizio.com.br" target="_blank" class="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 mt-2">
            Abrir EloMak <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>

        <!-- EloContabil Card -->
        <div class="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between hover:border-blue-500/50 transition">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-sm text-white flex items-center gap-2">
                <i class="fa-solid fa-calculator text-blue-400"></i> EloContábil
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 font-mono font-medium">Sem CRC</span>
            </div>
            <p class="text-xs text-zinc-400 mb-3">Apoio administrativo, ponto, EPI, ASO e cofre de documentos.</p>
            <div class="text-[11px] font-mono text-zinc-500 break-all mb-2">
              /api/webhook_receiver.php
            </div>
          </div>
          <a href="https://elocontabil.grupoeloizio.com.br" target="_blank" class="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 mt-2">
            Abrir EloContábil <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>

        <!-- EloSign Card -->
        <div class="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between hover:border-emerald-500/50 transition">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-sm text-white flex items-center gap-2">
                <i class="fa-solid fa-file-signature text-emerald-400"></i> EloSign
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-medium">Assinatura</span>
            </div>
            <p class="text-xs text-zinc-400 mb-3">Assinatura digital avançada com validade jurídica e carimbo do tempo.</p>
            <div class="text-[11px] font-mono text-zinc-500 break-all mb-2">
              /api.php?action=webhook
            </div>
          </div>
          <a href="https://elosign.grupoeloizio.com.br" target="_blank" class="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 mt-2">
            Abrir EloSign <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>

        <!-- Cursos & Mecânica Card -->
        <div class="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col justify-between hover:border-purple-500/50 transition">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-sm text-white flex items-center gap-2">
                <i class="fa-solid fa-graduation-cap text-purple-400"></i> Cursos & Oficina
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 font-mono font-medium">Portal</span>
            </div>
            <p class="text-xs text-zinc-400 mb-3">Cursos livres 100% online e conserto de máquinas em São Gonçalo - RJ.</p>
            <div class="text-[11px] font-mono text-zinc-500 break-all mb-2">
              /api/pagamento_aprovado.php
            </div>
          </div>
          <a href="https://grupoeloizio.com.br" target="_blank" class="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 mt-2">
            Abrir Portal <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Simulação & Testador de Webhook Mercado Pago & WhatsApp -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Testador Mercado Pago -->
      <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
          <i class="fa-solid fa-qrcode text-blue-400"></i> Gerador de Cobrança PIX Mercado Pago
        </h3>
        <p class="text-xs text-zinc-400 mb-4">Gera PIX instantâneo com baixa automática via webhook no Grupo Eloizio</p>

        <form id="formPix" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">Projeto</label>
              <select id="pixProjeto" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
                <option value="elomak">EloMak (OS Oficina)</option>
                <option value="elocontabil">EloContábil (Plano RH)</option>
                <option value="elosign">EloSign (Pacote Assinaturas)</option>
                <option value="cursos">Cursos (Matrícula)</option>
                <option value="oficina">Mecânica de Máquinas</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">Valor (R$)</label>
              <input type="number" step="0.01" id="pixValor" value="97.00" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-1">Nome do Pagador</label>
            <input type="text" id="pixNome" value="Mário Augusto Silva" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">WhatsApp Pagador</label>
              <input type="text" id="pixWhatsapp" value="21996134073" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">Referência Externa</label>
              <input type="text" id="pixRef" value="elomak_os_104" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
            </div>
          </div>

          <button type="submit" id="btnGerarPix" class="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow">
            <i class="fa-solid fa-receipt"></i> Gerar PIX Mercado Pago & Testar
          </button>
        </form>

        <div id="resPixBox" class="mt-4 hidden p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 custom-scroll max-h-48 overflow-y-auto"></div>
      </div>

      <!-- Testador Camilla Central & WhatsApp -->
      <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
          <i class="fa-solid fa-comments text-emerald-400"></i> Simulador de Atendimento Camilla Faria
        </h3>
        <p class="text-xs text-zinc-400 mb-4">Teste a inteligência e triagem da Camilla nos 3 pilares do Grupo Eloizio</p>

        <form id="formCamilla" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">WhatsApp do Cliente</label>
              <input type="text" id="camillaZap" value="21988771122" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-400 mb-1">Canal</label>
              <select id="camillaCanal" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">
                <option value="whatsapp">WhatsApp (Evolution)</option>
                <option value="web_chat">Chat Web</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-zinc-400 mb-1">Mensagem Enviada</label>
            <textarea id="camillaMsg" rows="3" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500">Minha máquina de costura reta está quebrando agulha direto, quanto custa a revisão aí em São Gonçalo?</textarea>
          </div>

          <div class="flex gap-2">
            <button type="button" class="btn-quick px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-[11px] text-zinc-300" data-msg="Tenho um Gol placa ABC1D23 com barulho no freio">Placa Carro</button>
            <button type="button" class="btn-quick px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-[11px] text-zinc-300" data-msg="Como funciona o controle de ponto e EPI do EloContábil?">EloContábil</button>
            <button type="button" class="btn-quick px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-[11px] text-zinc-300" data-msg="Quero pagar meu curso via PIX">Pagar Pix</button>
          </div>

          <button type="submit" id="btnTestarCamilla" class="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition flex items-center justify-center gap-2 shadow">
            <i class="fa-solid fa-paper-plane"></i> Enviar para Camilla Faria
          </button>
        </form>

        <div id="resCamillaBox" class="mt-4 hidden p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 custom-scroll max-h-48 overflow-y-auto whitespace-pre-wrap"></div>
      </div>

    </div>

    <!-- Tabela de Pagamentos Centralizados Mercado Pago (Mobile First: Cards no Celular) -->
    <div class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-money-bill-wave text-emerald-400"></i> Recebimentos Centralizados Mercado Pago
          </h3>
          <p class="text-xs text-zinc-400">Todos os projetos reportam transações para a mesma base</p>
        </div>
        <button id="btnAtualizarPagamentos" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition flex items-center gap-1.5">
          <i class="fa-solid fa-rotate"></i> Atualizar
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-zinc-800 text-zinc-400 font-semibold">
              <th class="py-3 px-3">ID / Transação</th>
              <th class="py-3 px-3">Projeto</th>
              <th class="py-3 px-3">Cliente / Pagador</th>
              <th class="py-3 px-3">Valor</th>
              <th class="py-3 px-3">Status</th>
              <th class="py-3 px-3">Camilla Notificou</th>
              <th class="py-3 px-3">Data</th>
            </tr>
          </thead>
          <tbody id="listaPagamentos" class="divide-y divide-zinc-800/60 font-mono">
            <tr>
              <td colspan="7" class="py-4 text-center text-zinc-500 font-sans">Carregando transações centralizadas...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>

  <!-- Rodapé Oficial -->
  <footer class="border-t border-zinc-800 bg-zinc-900 py-6 text-center text-xs text-zinc-500">
    <div class="max-w-7xl mx-auto px-4 space-y-2">
      <p>© 2026 Grupo Eloizio • Central Webhook Hub • WhatsApp Oficial (21) 99613-4073 • CEO Eloizio (21) 987648727</p>
      <p class="text-[11px] text-zinc-600">Subdomínio oficial: webhook.grupoeloizio.com.br • Processamento exclusivo de recebimentos via Mercado Pago.</p>
    </div>
  </footer>

  <script>
    $(document).ready(function() {
      // Carregar pagamentos ao abrir
      carregarPagamentos();

      // Botão atualizar
      $('#btnAtualizarPagamentos').on('click', function() {
        carregarPagamentos();
      });

      // Quick buttons no chat
      $('.btn-quick').on('click', function() {
        $('#camillaMsg').val($(this).data('msg'));
      });

      // Gerar Pix Mercado Pago
      $('#formPix').on('submit', function(e) {
        e.preventDefault();
        $('#btnGerarPix').prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Gerando PIX...');
        $('#resPixBox').removeClass('hidden').text('Enviando para Mercado Pago API...');

        $.ajax({
          url: '/checkout/pix',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            projeto: $('#pixProjeto').val(),
            valor: parseFloat($('#pixValor').val()),
            referencia: $('#pixRef').val(),
            descricao: 'Serviço ' + $('#pixProjeto').val().toUpperCase() + ' - Grupo Eloizio',
            pagador: {
              nome: $('#pixNome').val(),
              whatsapp: $('#pixWhatsapp').val()
            }
          }),
          success: function(res) {
            $('#btnGerarPix').prop('disabled', false).html('<i class="fa-solid fa-receipt"></i> Gerar PIX Mercado Pago & Testar');
            $('#resPixBox').html(
              '<span class="text-emerald-400 font-bold">✓ Pix Gerado com Sucesso!</span>\n' +
              'ID: ' + res.transacao_id + '\n' +
              'Valor: R$ ' + res.valor.toFixed(2) + '\n' +
              'Status: ' + res.status + '\n' +
              'Chave Copia e Cola:\n' + res.pix_copia_cola
            );
            carregarPagamentos();
          },
          error: function(err) {
            $('#btnGerarPix').prop('disabled', false).html('<i class="fa-solid fa-receipt"></i> Gerar PIX Mercado Pago & Testar');
            $('#resPixBox').text('Erro ao conectar com API: ' + JSON.stringify(err));
          }
        });
      });

      // Enviar mensagem para Camilla
      $('#formCamilla').on('submit', function(e) {
        e.preventDefault();
        $('#btnTestarCamilla').prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Camilla digitando...');
        $('#resCamillaBox').removeClass('hidden').text('Aguardando resposta da Camilla...');

        $.ajax({
          url: '/camilla/chat',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            whatsapp: $('#camillaZap').val(),
            mensagem: $('#camillaMsg').val(),
            canal: $('#camillaCanal').val()
          }),
          success: function(res) {
            $('#btnTestarCamilla').prop('disabled', false).html('<i class="fa-solid fa-paper-plane"></i> Enviar para Camilla Faria');
            $('#resCamillaBox').html(
              '<strong class="text-orange-400">Camilla Faria (' + res.cargo + '):</strong>\n\n' +
              res.resposta
            );
          },
          error: function(err) {
            $('#btnTestarCamilla').prop('disabled', false).html('<i class="fa-solid fa-paper-plane"></i> Enviar para Camilla Faria');
            $('#resCamillaBox').text('Erro ao contatar Camilla: ' + JSON.stringify(err));
          }
        });
      });

      function carregarPagamentos() {
        $.getJSON('/api/pagamentos', function(res) {
          if (!res || !res.data || res.data.length === 0) {
            $('#listaPagamentos').html('<tr><td colspan="7" class="py-4 text-center text-zinc-500 font-sans">Nenhum pagamento registrado ainda. Gere um PIX no simulador acima!</td></tr>');
            return;
          }

          let html = '';
          res.data.forEach(function(item) {
            const statusClass = item.status === 'approved' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

            const statusLabel = item.status === 'approved' ? 'Aprovado' : 'Pendente';
            const camillaLabel = item.notificado_camilla ? '<span class="text-emerald-400">✓ Sim (Zap)</span>' : '<span class="text-zinc-500">Aguardando</span>';

            html += '<tr class="hover:bg-zinc-800/30 transition">';
            html += '<td class="py-3 px-3 text-white font-medium">' + (item.transacao_mp_id || 'ID-' + item.id) + '</td>';
            html += '<td class="py-3 px-3 uppercase text-zinc-400">' + item.projeto_origem + '</td>';
            html += '<td class="py-3 px-3 font-sans text-zinc-200">' + (item.pagador_nome || 'Cliente') + '<div class="text-[10px] text-zinc-500">' + (item.pagador_whatsapp || '') + '</div></td>';
            html += '<td class="py-3 px-3 text-white font-bold">R$ ' + parseFloat(item.valor).toFixed(2) + '</td>';
            html += '<td class="py-3 px-3"><span class="px-2 py-0.5 rounded text-[10px] border ' + statusClass + '">' + statusLabel + '</span></td>';
            html += '<td class="py-3 px-3">' + camillaLabel + '</td>';
            html += '<td class="py-3 px-3 text-zinc-500 text-[11px]">' + (item.criado_em || '') + '</td>';
            html += '</tr>';
          });

          $('#listaPagamentos').html(html);
        }).fail(function() {
          $('#listaPagamentos').html('<tr><td colspan="7" class="py-4 text-center text-zinc-500 font-sans">Pronto para receber transações.</td></tr>');
        });
      }
    });
  </script>
</body>
</html>
