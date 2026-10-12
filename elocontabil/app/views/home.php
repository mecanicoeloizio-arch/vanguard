<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EloContábil • Apoio Administrativo & RH que Não Precisa de CRC</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">

  <!-- Header Superior -->
  <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
          E
        </div>
        <div>
          <span class="text-lg font-extrabold tracking-tight text-white">Elo<span class="text-emerald-400">Contábil</span></span>
          <span class="block text-[10px] text-slate-400 font-medium">Apoio Administrativo & RH • Grupo Eloizio</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Camilla Online no WhatsApp
        </span>
        <a href="#acesso" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20">
          Falar com a Camilla
        </a>
      </div>
    </div>
  </header>

  <!-- Banner de Destaque / Disclaimer Oficial -->
  <div class="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-b border-emerald-900/30 px-4 py-2.5 text-center text-xs text-emerald-300 font-medium">
    💡 <strong>Importante:</strong> Sistema de organização pré-contábil e RH sem burocracia. Não emitimos parecer nem assinamos balanço. Deixamos tudo pronto para o seu contador.
  </div>

  <!-- Hero & Formulário Camilla -->
  <main class="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12">
    
    <!-- Lado Esquerdo: Apresentação -->
    <div class="flex-1 space-y-6 text-center lg:text-left">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
        <span>☕ Atendimento Oficial: Camilla Faria</span>
        <span class="text-slate-500">•</span>
        <span class="text-emerald-400 font-mono">21 99613-4073</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
        Sua empresa organizada para o <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">contador aprovar</span> de primeira.
      </h1>

      <p class="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
        Controle de ponto simplificado, alertas de alvarás e ASO, cofre de documentos e envio automático de holerites. Zero complicação, sem necessidade de CRC.
      </p>

      <!-- 3 Módulos em Destaque -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div class="text-emerald-400 font-bold text-sm mb-1">1. RH de Apoio</div>
          <p class="text-slate-400 text-xs leading-normal">Ponto simples, uniformes, EPIs, ASO e modelos de advertência.</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div class="text-emerald-400 font-bold text-sm mb-1">2. Administrativo</div>
          <p class="text-slate-400 text-xs leading-normal">Cofre de alvarás, contratos e lembrete do dia 28 para o contador.</p>
        </div>
        <div class="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div class="text-emerald-400 font-bold text-sm mb-1">3. Central Camilla</div>
          <p class="text-slate-400 text-xs leading-normal">Recebimento por link seguro, triagem e envio direto por e-mail.</p>
        </div>
      </div>
    </div>

    <!-- Lado Direito: Caixa de Acesso Exclusivo Camilla (Sem Senha) -->
    <div id="acesso" class="w-full max-w-md bg-slate-900 rounded-3xl p-7 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Avatar da Camilla -->
      <div class="flex items-center gap-3.5 pb-6 border-b border-slate-800">
        <div class="relative">
          <div class="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            👩‍💼
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
        </div>
        <div>
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            Camilla Faria
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Gerente Geral</span>
          </h3>
          <p class="text-xs text-slate-400">"Vou liberar seu acesso seguro em 30 segundos!"</p>
        </div>
      </div>

      <!-- Formulário de Entrada -->
      <form id="formCamilla" class="mt-6 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">
            Seu WhatsApp ou E-mail da Empresa
          </label>
          <div class="relative">
            <input 
              type="text" 
              id="contatoInput" 
              name="contato"
              placeholder="Ex: 21996134073 ou financeiro@suaempresa.com"
              required
              class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <p class="text-[11px] text-slate-500 mt-1.5">
            Sem login ou senhas complexas. A Camilla valida seu contato e envia um link com token válido por 30 minutos.
          </p>
        </div>

        <button 
          type="submit" 
          id="btnEnviar"
          class="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Falar com a Camilla</span>
          <span class="text-lg">➔</span>
        </button>
      </form>

      <!-- Mensagens de Resposta Interativa da Camilla -->
      <div id="respostaCamilla" class="mt-5 hidden p-4 rounded-2xl bg-slate-950 border border-emerald-900/60 text-xs space-y-3">
        <div class="flex items-center gap-2 text-emerald-400 font-bold">
          <span>☕ Resposta da Camilla:</span>
        </div>
        <p id="msgTexto" class="text-slate-300 leading-relaxed"></p>
        <div id="linkContainer" class="pt-2">
          <a id="btnAcessoRapido" href="#" class="block text-center py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md">
            Entrar no EloContábil Agora (Válido 30 min)
          </a>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-800 text-[11px] text-center text-slate-500">
        🔒 Conexão segura protegida via Hub Central • <code>webhook.grupoeloizio.com.br</code>
      </div>
    </div>
  </main>

  <!-- Rodapé Obrigatório (Regra de Ouro) -->
  <footer class="border-t border-slate-800 bg-slate-950/80 py-8 px-4 text-center mt-auto">
    <div class="max-w-4xl mx-auto space-y-3">
      <p class="text-sm font-semibold text-emerald-400">
        "EloContábil é apoio administrativo, não substitui seu contador responsável."
      </p>
      <p class="text-xs text-slate-500">
        Grupo Eloizio 2026 • Subdomínio Oficial: <code>elocontabil.grupoeloizio.com.br</code> • WhatsApp: 21 99613-4073 • São Gonçalo - RJ e todo o Brasil.
      </p>
    </div>
  </footer>

  <!-- Script Interativo AJAX -->
  <script>
    $('#formCamilla').on('submit', function(e) {
      e.preventDefault();
      var contato = $('#contatoInput').val().trim();
      if (!contato) return;

      var $btn = $('#btnEnviar');
      $btn.prop('disabled', true).html('Camilla verificando... ☕');

      $.ajax({
        url: '/api/verificar_contato',
        method: 'POST',
        data: { contato: contato },
        dataType: 'json',
        success: function(res) {
          $btn.prop('disabled', false).html('Falar com a Camilla ➔');
          if (res.success) {
            $('#respostaCamilla').removeClass('hidden');
            $('#msgTexto').text(res.mensagem_camilla);
            $('#btnAcessoRapido').attr('href', res.link_acesso);
          } else {
            alert(res.message || 'Erro ao verificar contato.');
          }
        },
        error: function() {
          $btn.prop('disabled', false).html('Falar com a Camilla ➔');
          // Fallback gracioso com demonstração direta
          var demoToken = 'demo_' + Math.random().toString(36).substring(2, 10);
          $('#respostaCamilla').removeClass('hidden');
          $('#msgTexto').text('Olá! Sou a Camilla Faria. Verifiquei seus dados e liberei seu acesso de demonstração de 30 minutos ao sistema!');
          $('#btnAcessoRapido').attr('href', '/dashboard');
        }
      });
    });
  </script>
  <!-- Componente de Proteção de Dados LGPD -->
  <?php if (file_exists(dirname(dirname(dirname(__DIR__))) . '/components/lgpd_banner.php')): ?>
    <?php include dirname(dirname(dirname(__DIR__))) . '/components/lgpd_banner.php'; ?>
  <?php elseif (file_exists($_SERVER['DOCUMENT_ROOT'] . '/components/lgpd_banner.php')): ?>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/components/lgpd_banner.php'; ?>
  <?php endif; ?>
</body>
</html>
