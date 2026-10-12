<!DOCTYPE html>
<html lang="pt-BR" class="h-full bg-zinc-950">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EloMak • Acesso Exclusivo via WhatsApp com a Camilla</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- FontAwesome 6 CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="/assets/css/style.css">
  
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="h-full bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-[#FF6B00] selection:text-zinc-950">

  <!-- Top Hub Bar -->
  <div class="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-zinc-400">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="font-mono text-zinc-300">elomak.grupoeloizio.com.br • Autenticação Sem Senha</span>
    </div>
    <div class="flex items-center gap-2">
      <i class="fab fa-whatsapp text-emerald-400"></i>
      <span>Camilla Faria: <strong class="text-zinc-200">21 99613-4073</strong></span>
    </div>
  </div>

  <!-- Center Auth Card -->
  <main class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md space-y-6">

      <!-- Logo & Headline -->
      <div class="text-center space-y-2">
        <div class="w-16 h-16 rounded-3xl bg-[#FF6B00] text-zinc-950 flex items-center justify-center font-black text-2xl mx-auto shadow-2xl shadow-[#FF6B00]/25">
          <i class="fas fa-wrench"></i>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">EloMak</h1>
        <p class="text-xs sm:text-sm text-zinc-400">
          Sistema de Gestão de Oficinas Mecânicas • Grupo Eloizio
        </p>
      </div>

      <!-- Auth Form Card -->
      <div class="p-6 sm:p-8 rounded-3xl bg-zinc-900 border-2 border-zinc-800 shadow-2xl space-y-5 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/5 rounded-full blur-2xl pointer-events-none"></div>

        <div class="space-y-1">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <i class="fab fa-whatsapp text-[#FF6B00] text-lg"></i>
            Acesso Exclusivo via WhatsApp
          </h2>
          <p class="text-xs text-zinc-400 leading-relaxed">
            Sem senhas complicadas. Digite seu número para receber o link seguro de login gerado pela atendente Camilla.
          </p>
        </div>

        <!-- Form: WhatsApp only -->
        <form id="form-login-whatsapp" class="space-y-4">
          <div>
            <label for="whatsapp_input" class="block text-xs font-bold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Seu WhatsApp com DDD
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 text-sm">
                <i class="fab fa-whatsapp text-emerald-400"></i>
              </div>
              <input 
                type="tel" 
                id="whatsapp_input" 
                name="whatsapp" 
                placeholder="(21) 99613-4073" 
                value="21996134073"
                required 
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00] transition font-mono"
              >
            </div>
            <p class="text-[11px] text-zinc-500 mt-1.5">
              Ex: 21996134073 (Dono da Oficina, Mecânico ou Cliente).
            </p>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            id="btn-submit-whatsapp"
            class="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05E00] text-zinc-950 font-black text-sm transition shadow-xl shadow-[#FF6B00]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="fab fa-whatsapp text-lg"></i>
            <span>Acessar via WhatsApp</span>
          </button>
        </form>

        <!-- Feedback Container (Aparece após submeter) -->
        <div id="feedback-container" class="hidden pt-4 border-t border-zinc-800 space-y-3">
          <div class="p-3.5 rounded-2xl bg-zinc-950 border border-emerald-500/30 text-xs space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400 flex items-center gap-1.5">
                <i class="fas fa-check-circle"></i> Mensagem Despachada
              </span>
              <span id="feedback-status" class="text-[10px] uppercase font-bold text-zinc-500 font-mono"></span>
            </div>
            <div class="text-zinc-300">
              Olá, <strong id="feedback-nome" class="text-white"></strong>! O link de acesso seguro (válido por 15 minutos) foi gerado.
            </div>
            <div class="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono break-all" id="feedback-mensagem"></div>
            
            <!-- Botão de Acesso Imediato para teste direto no navegador -->
            <a 
              href="#" 
              id="feedback-link-btn" 
              class="block w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-center font-bold text-xs transition shadow-md shadow-emerald-500/20"
            >
              <i class="fas fa-arrow-right mr-1"></i> Entrar Agora com o Token Gerado
            </a>
          </div>
        </div>

      </div>

      <!-- Feature Badges -->
      <div class="grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-400">
        <div class="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <i class="fas fa-shield-alt text-[#FF6B00] block mb-1 text-sm"></i>
          <span>100% Sem Senhas</span>
        </div>
        <div class="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <i class="fas fa-bolt text-emerald-400 block mb-1 text-sm"></i>
          <span>Triagem WhatsApp</span>
        </div>
        <div class="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
          <i class="fas fa-file-signature text-blue-400 block mb-1 text-sm"></i>
          <span>EloSign Integrado</span>
        </div>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="py-4 text-center text-xs text-zinc-500 border-t border-zinc-900">
    EloMak • Sistema de Gestão para Oficinas • Grupo Eloizio & EduVanguard © 2026
  </footer>

  <!-- Componente de Proteção de Dados LGPD -->
  <?php if (file_exists(dirname(dirname(dirname(__DIR__))) . '/components/lgpd_banner.php')): ?>
    <?php include dirname(dirname(dirname(__DIR__))) . '/components/lgpd_banner.php'; ?>
  <?php elseif (file_exists($_SERVER['DOCUMENT_ROOT'] . '/components/lgpd_banner.php')): ?>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/components/lgpd_banner.php'; ?>
  <?php endif; ?>

  <!-- Toast Container -->
  <div id="toast-container"></div>

  <!-- jQuery 3.7 CDN -->
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/camilla.js"></script>
</body>
</html>
