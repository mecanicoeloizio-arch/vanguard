<?php
/**
 * EloMak - Layout Header Padrão
 * Design: Zinc-950, Zinc-900, Laranja #FF6B00, Inter
 * Grupo Eloizio 2026 • PHP 8.3
 */

declare(strict_types=1);

$user = getLoggedUser();
$currentPage = $_SERVER['REQUEST_URI'] ?? '/dashboard';
?>
<!DOCTYPE html>
<html lang="pt-BR" class="h-full bg-zinc-950">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle ?? 'EloMak - Gestão de Oficinas') ?></title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- FontAwesome 6 CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Custom CSS -->
  <link rel="stylesheet" href="/assets/css/style.css">
  
  <style>
    body { font-family: 'Inter', sans-serif; }
    .primary-orange { color: #FF6B00; }
    .bg-primary-orange { background-color: #FF6B00; }
    .border-primary-orange { border-color: #FF6B00; }
  </style>
</head>
<body class="h-full bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-[#FF6B00] selection:text-zinc-950">

  <!-- Top Hub Notice -->
  <div class="bg-zinc-900/90 border-b border-zinc-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-zinc-400">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="font-mono text-zinc-300">elomak.grupoeloizio.com.br • Hub Central: webhook.grupoeloizio.com.br</span>
    </div>
    <div class="flex items-center gap-3">
      <span>Atendente: <strong class="text-[#FF6B00]">Camilla Faria (21 99613-4073)</strong></span>
      <a href="https://elosign.grupoeloizio.com.br" target="_blank" class="text-zinc-300 hover:text-white underline">
        <i class="fas fa-file-signature text-[#FF6B00]"></i> EloSign Digital
      </a>
    </div>
  </div>

  <!-- Header / Navigation -->
  <header class="bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 py-3 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Brand & Mobile Toggle -->
      <div class="flex items-center gap-3">
        <button id="btn-toggle-menu" class="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white">
          <i class="fas fa-bars"></i>
        </button>

        <a href="/dashboard" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-[#FF6B00] text-zinc-950 flex items-center justify-center font-black text-lg shadow-lg shadow-[#FF6B00]/20">
            <i class="fas fa-wrench"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-black tracking-tight text-white">EloMak</span>
              <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30">Oficinas</span>
            </div>
            <p class="text-[10px] text-zinc-400 hidden sm:block">Gestão Inteligente & Triagem WhatsApp</p>
          </div>
        </a>
      </div>

      <!-- Desktop Nav Links -->
      <nav class="hidden lg:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
        <a href="/dashboard" class="px-3 py-1.5 rounded-xl transition <?= (strpos($currentPage, '/dashboard') !== false) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">
          <i class="fas fa-chart-line mr-1"></i> Dashboard
        </a>
        <a href="/os" class="px-3 py-1.5 rounded-xl transition <?= (strpos($currentPage, '/os') !== false) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">
          <i class="fas fa-file-invoice mr-1"></i> Ordens de Serviço
        </a>
        <a href="/orcamentos" class="px-3 py-1.5 rounded-xl transition <?= (strpos($currentPage, '/orcamentos') !== false) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">
          <i class="fas fa-calculator mr-1"></i> Orçamentos
        </a>
        <a href="/clientes" class="px-3 py-1.5 rounded-xl transition <?= (strpos($currentPage, '/clientes') !== false) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">
          <i class="fas fa-users mr-1"></i> Clientes & Carros
        </a>
        <a href="/estoque" class="px-3 py-1.5 rounded-xl transition <?= (strpos($currentPage, '/estoque') !== false) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">
          <i class="fas fa-boxes-stacked mr-1"></i> Estoque & Peças
        </a>
        <a href="/financeiro" class="px-3 py-1.5 rounded-xl transition <?= (strpos($currentPage, '/financeiro') !== false) ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">
          <i class="fas fa-wallet mr-1"></i> Financeiro
        </a>
      </nav>

      <!-- User Profile & Logout -->
      <div class="flex items-center gap-3">
        <?php if ($user): ?>
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-xs font-bold text-white"><?= htmlspecialchars($user['nome_oficina'] ?? $user['nome']) ?></span>
            <span class="text-[10px] text-zinc-500 font-mono"><?= htmlspecialchars($user['whatsapp']) ?></span>
          </div>
          <a href="/logout" class="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition" title="Sair do Sistema">
            <i class="fas fa-right-from-bracket"></i>
          </a>
        <?php else: ?>
          <a href="/" class="px-4 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 font-bold text-xs hover:brightness-110">
            <i class="fab fa-whatsapp mr-1"></i> Acessar
          </a>
        <?php endif; ?>
      </div>

    </div>
  </header>

  <!-- Mobile Drawer Menu -->
  <div id="mobile-sidebar" class="lg:hidden hidden bg-zinc-900 border-b border-zinc-800 px-4 py-3 space-y-1 text-sm font-semibold">
    <a href="/dashboard" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-chart-line w-6 text-[#FF6B00]"></i> Dashboard</a>
    <a href="/os" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-file-invoice w-6 text-[#FF6B00]"></i> Ordens de Serviço</a>
    <a href="/os/novo" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-plus w-6 text-[#FF6B00]"></i> Nova OS Rápida</a>
    <a href="/orcamentos" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-calculator w-6 text-[#FF6B00]"></i> Orçamentos</a>
    <a href="/clientes" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-users w-6 text-[#FF6B00]"></i> Clientes & Veículos</a>
    <a href="/estoque" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-boxes-stacked w-6 text-[#FF6B00]"></i> Estoque de Peças</a>
    <a href="/financeiro" class="block px-3 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white"><i class="fas fa-wallet w-6 text-[#FF6B00]"></i> Financeiro & PIX</a>
  </div>

  <!-- Main Content Wrapper -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
    <?php if (!empty($_SESSION['flash_success'])): ?>
      <div class="mb-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fas fa-check-circle text-emerald-400 text-sm"></i>
          <span><?= htmlspecialchars($_SESSION['flash_success']) ?></span>
        </div>
        <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
      </div>
      <?php unset($_SESSION['flash_success']); ?>
    <?php endif; ?>

    <?php if (!empty($_SESSION['flash_error'])): ?>
      <div class="mb-5 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fas fa-triangle-exclamation text-rose-400 text-sm"></i>
          <span><?= htmlspecialchars($_SESSION['flash_error']) ?></span>
        </div>
        <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-white"><i class="fas fa-times"></i></button>
      </div>
      <?php unset($_SESSION['flash_error']); ?>
    <?php endif; ?>
