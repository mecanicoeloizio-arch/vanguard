<?php
/**
 * Grupo Eloizio - Cabeçalho Universal & Navbar Responsiva (PHP 8.1+)
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$currentUser = $_SESSION['user'] ?? null;
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $pageTitle ?? 'Grupo Eloizio - Cursos Online & Gestão Integrada' ?></title>
  <meta name="description" content="Grupo Eloizio: Cursos Livres com Certificação Oficial MEC, Contabilidade Digital e Oficina Mecânica de Máquinas de Costura em São Gonçalo - RJ.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white flex flex-col min-h-screen">

  <!-- Top Announcement Bar -->
  <header class="bg-slate-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-indigo-950/60 shrink-0">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Atendimento Oficial Grupo Eloizio • WhatsApp: <strong>(21) 99613-4073</strong></span>
      </div>
      <div class="flex items-center gap-3 text-slate-300 text-[11px]">
        <span>Diretoria Geral (Eloizio): (21) 98764-8727</span>
        <span class="text-indigo-400">•</span>
        <span class="font-mono text-amber-300 font-bold">Senha Master: ELOIZIO@MASTER2026</span>
      </div>
    </div>
  </header>

  <!-- Navbar Principal Sticky -->
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <!-- Logo -->
      <a href="index.php" class="flex items-center gap-2.5 shrink-0">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-indigo-600 to-indigo-900 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md">
          GE
        </div>
        <div>
          <span class="text-sm sm:text-base font-black tracking-tight leading-none text-slate-950 block">Grupo Eloizio</span>
          <span class="text-[10px] text-slate-500 font-semibold tracking-wide">São Gonçalo - RJ & Online</span>
        </div>
      </a>

      <!-- Desktop Navigation Menu -->
      <div class="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700">
        <a href="index.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'index.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          🎓 Vitrine de Cursos
        </a>
        <a href="aluno.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'aluno.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          📚 Área do Aluno
        </a>
        <a href="professor.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'professor.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          👨‍🏫 Área do Professor
        </a>
        <a href="admin.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'admin.php' || $currentPage === 'admin.html') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          ⚙️ Direção & Gestão
        </a>
        <a href="propostas.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'propostas.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          💼 Propostas & Descontos
        </a>
        <a href="validar_certificado.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'validar_certificado.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          📜 Validar Certificado
        </a>
        <a href="calendario.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'calendario.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          📅 Calendário & Biblioteca
        </a>
        <a href="chat.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'chat.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          💬 Chat
        </a>
        <a href="manuais.php" class="px-3 py-2 rounded-xl transition <?= ($currentPage === 'manuais.php') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-100 hover:text-slate-900' ?>">
          📖 Manuais
        </a>
      </div>

      <!-- Auth Controls & Mobile Menu Button -->
      <div class="flex items-center gap-2">
        <?php if ($currentUser): ?>
          <div class="flex items-center gap-2 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-bold">
            <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
              <?= strtoupper(substr($currentUser['name'] ?? 'U', 0, 1)) ?>
            </span>
            <span class="hidden sm:inline text-slate-800"><?= htmlspecialchars(explode(' ', $currentUser['name'])[0]) ?></span>
            <a href="auth.php?action=logout" class="text-rose-600 hover:text-rose-800 ml-1 text-[11px]" title="Sair">Sair</a>
          </div>
        <?php else: ?>
          <button onclick="abrirModalAuthUniversal()" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
            <span>🔒 Login / Master</span>
          </button>
        <?php endif; ?>

        <!-- Mobile Drawer Toggle Button -->
        <button onclick="toggleMenuMobile()" class="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div id="mobileDrawer" class="hidden xl:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 animate-in fade-in">
      <a href="index.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">🎓 Vitrine de Cursos</a>
      <a href="aluno.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">📚 Área do Aluno</a>
      <a href="professor.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">👨‍🏫 Área do Professor</a>
      <a href="admin.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">⚙️ Direção & Gestão (Admin)</a>
      <a href="propostas.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">💼 Propostas & Descontos</a>
      <a href="validar_certificado.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">📜 Validar Certificado</a>
      <a href="calendario.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">📅 Calendário & Biblioteca</a>
      <a href="chat.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">💬 Chat Interno</a>
      <a href="manuais.php" class="block px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100">📖 Manuais do Sistema</a>
    </div>
  </nav>

  <!-- Modal Universal de Login & Senha Master -->
  <div id="modalAuthUniversal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95">
      <!-- Modal Header -->
      <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900/50">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-bold">
            🔒
          </div>
          <div>
            <div class="text-[10px] uppercase font-black tracking-widest text-emerald-400">Acesso Seguro • Produção</div>
            <h3 class="font-extrabold text-base text-white">Grupo Eloizio — Login</h3>
          </div>
        </div>
        <button onclick="fecharModalAuthUniversal()" class="text-slate-400 hover:text-white text-xl p-1 cursor-pointer">&times;</button>
      </div>

      <!-- Barra de Senha Master Oficial -->
      <div class="bg-linear-to-r from-amber-50 to-indigo-50 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between gap-2">
        <div>
          <div class="text-[10px] font-black uppercase text-amber-900 tracking-wider">Senha Master Definida:</div>
          <div class="font-mono font-black text-xs text-indigo-950 select-all">ELOIZIO@MASTER2026</div>
        </div>
        <button type="button" onclick="preencherCredenciaisUniversal('mecanicoeloizio@gmail.com', 'ELOIZIO@MASTER2026')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-black cursor-pointer shadow-2xs">
          ⚡ Preencher Master
        </button>
      </div>

      <div class="p-4 sm:p-6 space-y-4">
        <div id="authUniversalErro" class="hidden p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl"></div>
        <div id="authUniversalSucesso" class="hidden p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl"></div>

        <!-- Atalhos de Perfis Oficiais -->
        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
          <span class="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Acesso com 1 Clique (Perfis Prontos):</span>
          <div class="grid grid-cols-2 gap-1.5 text-[11px]">
            <button type="button" onclick="preencherCredenciaisUniversal('mecanicoeloizio@gmail.com', 'ELOIZIO@MASTER2026')" class="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-left font-bold text-amber-950">
              👑 Eloizio (CEO Master)
            </button>
            <button type="button" onclick="preencherCredenciaisUniversal('sofia@grupoeloizio.com.br', 'ELOIZIO@MASTER2026')" class="p-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-left font-bold text-indigo-950">
              ✨ Sofia (Expert Vanguard)
            </button>
            <button type="button" onclick="preencherCredenciaisUniversal('aluno@grupoeloizio.com.br', 'ELOIZIO@MASTER2026')" class="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-left font-bold text-emerald-950">
              🎓 Aluno Lucas Prado
            </button>
            <button type="button" onclick="preencherCredenciaisUniversal('mariana.fernandes@grupoeloizio.com.br', 'ELOIZIO@MASTER2026')" class="p-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left font-bold text-purple-950">
              👩‍🏫 Profa. Mariana (Docente)
            </button>
          </div>
        </div>

        <form onsubmit="executarLoginUniversal(event)" class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail de Acesso</label>
            <input type="email" id="inputAuthEmail" required placeholder="mecanicoeloizio@gmail.com" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Senha de Acesso</label>
            <input type="password" id="inputAuthSenha" required placeholder="Digite sua senha ou a Senha Master" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden">
          </div>

          <button type="submit" id="btnSubmitUniversal" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition">
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  </div>

  <script>
    function toggleMenuMobile() {
      const el = document.getElementById('mobileDrawer');
      el.classList.toggle('hidden');
    }

    function abrirModalAuthUniversal() {
      const modal = document.getElementById('modalAuthUniversal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function fecharModalAuthUniversal() {
      const modal = document.getElementById('modalAuthUniversal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function preencherCredenciaisUniversal(email, senha) {
      document.getElementById('inputAuthEmail').value = email;
      document.getElementById('inputAuthSenha').value = senha;
    }

    async function executarLoginUniversal(e) {
      e.preventDefault();
      const email = document.getElementById('inputAuthEmail').value.trim();
      const password = document.getElementById('inputAuthSenha').value.trim();
      const erroBox = document.getElementById('authUniversalErro');
      const sucessoBox = document.getElementById('authUniversalSucesso');
      const btn = document.getElementById('btnSubmitUniversal');

      erroBox.classList.add('hidden');
      sucessoBox.classList.add('hidden');
      btn.innerText = 'Verificando...';
      btn.disabled = true;

      try {
        const res = await fetch('auth.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success && data.user) {
          sucessoBox.innerText = 'Login realizado com sucesso! Redirecionando...';
          sucessoBox.classList.remove('hidden');
          setTimeout(() => {
            if (data.user.role === 'admin') location.href = 'admin.php';
            else if (data.user.role === 'teacher') location.href = 'professor.php';
            else location.href = 'aluno.php';
          }, 800);
        } else {
          erroBox.innerText = data.error || 'Credenciais inválidas.';
          erroBox.classList.remove('hidden');
        }
      } catch (err) {
        erroBox.innerText = 'Erro ao conectar ao auth.php: ' + err.message;
        erroBox.classList.remove('hidden');
      } finally {
        btn.innerText = 'Entrar no Sistema';
        btn.disabled = false;
      }
    }
  </script>

  <!-- Conteúdo Principal da Página -->
  <main class="flex-1">
