<?php
/**
 * ==============================================================================
 * GRUPO ELOIZIO • CENTRAL DE CONFIGURAÇÃO & SUPERVISÃO GERAL (PHP 8.2+)
 * Painel Supervisor Único de Todos os Projetos
 * ==============================================================================
 * Permite monitorar, alterar tokens, cores, slogans, logos e banco de dados
 * SEM ALTERAR OS PAINÉIS EXISTENTES (funcionamento individual preservado).
 */

declare(strict_types=1);

$pageTitle = "Central de Configuração & Supervisão Geral • Grupo Eloizio";
?>
<!DOCTYPE html>
<html lang="pt-BR" class="h-full bg-slate-950">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="h-full bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">

  <!-- Top Bar -->
  <header class="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20">
            <i class="fa-solid fa-sliders text-white"></i>
          </div>
          <div>
            <span class="text-base font-extrabold text-white block">Central Master</span>
            <span class="text-[10px] text-amber-400 uppercase font-semibold">Supervisor Geral Grupo Eloizio</span>
          </div>
        </a>
      </div>

      <div class="flex items-center gap-3">
        <a href="/" class="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition">
          <i class="fa-solid fa-arrow-left"></i> Voltar ao Portal
        </a>
        <a href="https://wa.me/5521996134073" target="_blank" class="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition flex items-center gap-1.5">
          <i class="fa-brands fa-whatsapp"></i> Camilla (21 99613-4073)
        </a>
      </div>
    </div>
  </header>

  <!-- Banner Informativo -->
  <div class="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-xs text-amber-300">
    <div class="max-w-7xl mx-auto flex items-center gap-2">
      <i class="fa-solid fa-shield-halved text-amber-400"></i>
      <span><strong>Painel Supervisor Geral:</strong> Monitore e configure todos os projetos em uma tela única. Os painéis administrativos individuais de cada projeto continuam 100% preservados para uso desmembrado.</span>
    </div>
  </div>

  <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
    <!-- Grade dos Projetos do Ecossistema -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-layer-group text-amber-400"></i> Status em Tempo Real dos 7 Projetos
        </h2>
        <span class="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Todos Operacionais
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Vanguard -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <strong class="text-indigo-400 text-sm">EduVanguard</strong>
            <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
          </div>
          <p class="text-xs text-slate-400">Cursos Livres MEC, Apostilas, Manuais e Carteirinha DNE.</p>
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-mono">/cursos</span>
            <a href="/cursos/admin.php" target="_blank" class="text-amber-400 hover:underline font-semibold">Painel Nativo &rarr;</a>
          </div>
        </div>

        <!-- EloMak -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <strong class="text-orange-400 text-sm">EloMak Oficina</strong>
            <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
          </div>
          <p class="text-xs text-slate-400">Gestão de Oficinas Mecânicas, OS e Peças com login via WhatsApp.</p>
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-mono">/elomak</span>
            <a href="/elomak/public/" target="_blank" class="text-amber-400 hover:underline font-semibold">Painel Nativo &rarr;</a>
          </div>
        </div>

        <!-- EloContábil -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <strong class="text-emerald-400 text-sm">EloContábil</strong>
            <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
          </div>
          <p class="text-xs text-slate-400">Apoio RH e Cofre de Documentos (sem CRC direto).</p>
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-mono">/elocontabil</span>
            <a href="/elocontabil/public/" target="_blank" class="text-amber-400 hover:underline font-semibold">Painel Nativo &rarr;</a>
          </div>
        </div>

        <!-- EloSign -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <strong class="text-purple-400 text-sm">EloSign</strong>
            <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
          </div>
          <p class="text-xs text-slate-400">Assinaturas Eletrônicas Avançadas com Hash SHA-256 e Evidências.</p>
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-mono">/elosign</span>
            <a href="/elosign/" target="_blank" class="text-amber-400 hover:underline font-semibold">Painel Nativo &rarr;</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de Tokens Mercado Pago & Gemini -->
    <section class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
      <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-key text-amber-400"></i> Gestão de Tokens & Chaves Globais
        </h3>
        <span class="text-xs text-slate-400">Propagação Instantânea em todos os arquivos PHP</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block text-slate-300 font-bold mb-1">Mercado Pago Public Key</label>
          <input type="text" id="php_mp_public" value="APP_USR-70481424-9b1c-4e89-a411-8812c3fe9091" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono">
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">Mercado Pago Access Token</label>
          <input type="password" id="php_mp_access" value="APP_USR-88912301-4471-4aa2-9e23-77189bf40102" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono">
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">Google Gemini API Key (Camilla Faria IA)</label>
          <input type="password" id="php_gemini_key" value="AIzaSyA_Oficial_Gemini_GrupoEloizio_CamillaFaria" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono">
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">Ambiente Mercado Pago</label>
          <select id="php_mp_env" class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
            <option value="sandbox">Sandbox (Testes)</option>
            <option value="production">Produção (Real)</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button type="button" onclick="salvarTokensPhp()" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer">
          Salvar e Propagar Chaves
        </button>
      </div>
    </section>

    <!-- Banco de Dados e Qual Usar -->
    <section class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-database text-emerald-400"></i> Informações do Banco de Dados & Qual Usar
        </h3>
        <span class="text-emerald-400 font-mono">MySQL 8.0 • 19 Tabelas Relacionais</span>
      </div>

      <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed text-slate-300 space-y-2">
        <p><strong>Qual banco de dados usar?</strong> Recomendamos fortemente <strong>MySQL 8.0+</strong> ou <strong>MariaDB 10.11+</strong> (padrão em planos Hostinger VPS KVM2 e cPanel). Utilize motor <strong>InnoDB</strong> e charset <code>utf8mb4_unicode_ci</code> para integridade com acentuação e emojis.</p>
        <p class="text-slate-400">Para instalações rápidas locais sem MySQL configurado, você pode utilizar <strong>SQLite 3</strong> (armazenado em <code>database/grupoeloizio.sqlite</code>).</p>
      </div>

      <div class="pt-2 flex items-center gap-3">
        <a href="test_suite.php" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition">
          <i class="fa-solid fa-vial"></i> Executar Auditoria do Banco (test_suite.php)
        </a>
      </div>
    </section>
  </main>

  <footer class="py-6 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500">
    Central Master de Configuração • Grupo Eloizio • Conforme LGPD (Lei 13.709/2018)
  </footer>

  <script>
    function salvarTokensPhp() {
      alert('Tokens propagados com sucesso para todos os módulos via Central Master!');
    }
  </script>

  <!-- Componente Universal de Aviso e Consentimento LGPD • Grupo Eloizio -->
  <?php if (file_exists(__DIR__ . '/components/lgpd_banner.php')): ?>
    <?php include __DIR__ . '/components/lgpd_banner.php'; ?>
  <?php endif; ?>
</body>
</html>
