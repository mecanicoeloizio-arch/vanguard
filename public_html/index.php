<?php
/**
 * Portal Oficial de Entrada • Grupo Eloizio
 * Domínio Principal: https://grupoeloizio.com.br
 * 
 * Centraliza e apresenta todos os serviços:
 * 1. Cursos Livres 100% Online (Educação com alta vendabilidade, apostilas, manuais)
 * 2. Máquinas de Costura e Mecânica (São Gonçalo - RJ e região: compra, venda, conserto, reforma)
 * 3. EloContábil (Apoio Administrativo & RH que Não Precisa de CRC)
 * 4. EloMak (ERP para Oficinas Mecânicas com Acesso sem Senha via WhatsApp)
 * 5. EloSign (Assinaturas Eletrônicas com Validade Jurídica)
 * 6. Recebimentos Exclusivos via Mercado Pago
 * 
 * Atendente Oficial: Camilla Faria (28 anos, Gerente Geral, 21 996134073)
 * CEO & Fundador: Eloizio Assunção (21 987648727)
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/webhook/config/config.php';
require_once dirname(__DIR__) . '/webhook/controllers/CamillaCentralController.php';

$saudacao = CamillaCentralController::getSaudacao();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grupo Eloizio • Cursos Online, Oficina Mecânica & Soluções Digitais</title>
  <meta name="description" content="Portal oficial do Grupo Eloizio: Cursos Livres 100% Online, Oficina Mecânica e Máquinas de Costura em São Gonçalo-RJ, EloContábil, EloMak e EloSign.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .hero-glow {
      background: radial-gradient(circle at 50% 20%, rgba(255, 107, 0, 0.15) 0%, rgba(9, 9, 11, 0) 70%);
    }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white">

  <!-- Topbar Informativo -->
  <div class="bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400 py-2 px-4">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1.5 text-zinc-300">
          <i class="fa-solid fa-location-dot text-orange-500"></i> São Gonçalo - RJ • Atendimento Brasil Online
        </span>
        <span class="hidden md:inline text-zinc-600">|</span>
        <span class="hidden md:flex items-center gap-1.5 text-zinc-300">
          <i class="fa-solid fa-shield-check text-emerald-400"></i> Pagamentos 100% Seguros via Mercado Pago
        </span>
      </div>
      <div class="flex items-center gap-4">
        <a href="https://wa.me/5521996134073" target="_blank" class="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
          <i class="fa-brands fa-whatsapp text-emerald-400"></i> (21) 99613-4073 (Camilla Faria)
        </a>
      </div>
    </div>
  </div>

  <!-- Navbar Principal -->
  <header class="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 group">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition">
          <i class="fa-solid fa-gears text-xl"></i>
        </div>
        <div>
          <span class="text-xl font-black tracking-tight text-white block">GRUPO ELOIZIO</span>
          <span class="text-[11px] text-orange-400 font-medium tracking-wide uppercase">Educação • Mecânica • Gestão</span>
        </div>
      </a>

      <nav class="hidden lg:flex items-center gap-6 text-xs font-semibold text-zinc-300">
        <a href="#cursos" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-graduation-cap text-orange-500"></i> Cursos Online</a>
        <a href="#mecanica" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-wrench text-orange-500"></i> Máquinas & Oficina</a>
        <a href="#elocontabil" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-calculator text-blue-400"></i> EloContábil</a>
        <a href="#elomak" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-laptop-code text-orange-400"></i> EloMak ERP</a>
        <a href="#elosign" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-file-signature text-emerald-400"></i> EloSign</a>
      </nav>

      <div class="flex items-center gap-3">
        <button id="btnAbrirChat" class="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-orange-600/20">
          <i class="fa-solid fa-comments"></i> Falar com a Camilla
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-glow pt-12 pb-20 border-b border-zinc-800 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-6">
        <span class="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
        <span>Atendimento com a Camilla Faria • Tudo no Mercado Pago</span>
      </div>

      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
        Potencializando Negócios com <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Educação, Mecânica & Tecnologia</span>
      </h1>

      <p class="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Bem-vindo ao ecossistema oficial do <strong>Grupo Eloizio</strong>. Cursos Livres 100% Online, Oficina de Máquinas de Costura em São Gonçalo-RJ, Apoio Contábil sem burocracia e sistemas inteligentes com acesso sem senha.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4">
        <a href="#projetos" class="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition flex items-center gap-2 shadow-xl shadow-orange-600/25">
          <i class="fa-solid fa-compass"></i> Explorar Nossos Serviços
        </a>
        <a href="https://wa.me/5521996134073?text=Ol%C3%A1%20Camilla,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20do%20Grupo%20Eloizio" target="_blank" class="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-sm font-semibold transition flex items-center gap-2">
          <i class="fa-brands fa-whatsapp text-emerald-400"></i> WhatsApp (21) 99613-4073
        </a>
      </div>

      <!-- Métricas Rápidas -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div class="text-2xl font-black text-white">30+ Anos</div>
          <p class="text-xs text-zinc-400">Experiência Mecânica Prática</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div class="text-2xl font-black text-orange-400">100% Online</div>
          <p class="text-xs text-zinc-400">Cursos Livres com Certificado</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div class="text-2xl font-black text-blue-400">Sem CRC</div>
          <p class="text-xs text-zinc-400">Apoio Administrativo & RH</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div class="text-2xl font-black text-emerald-400">Mercado Pago</div>
          <p class="text-xs text-zinc-400">PIX & Cartão em até 12x</p>
        </div>
      </div>

    </div>
  </section>

  <!-- Módulo Camilla Faria - Atendente Oficial -->
  <section class="py-12 bg-zinc-900/40 border-b border-zinc-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-orange-500/30 shadow-2xl relative overflow-hidden">
        
        <div class="flex flex-col lg:flex-row items-center gap-8">
          <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-orange-600/20 border-2 border-orange-500/40 p-2 flex items-center justify-center shrink-0 relative">
            <div class="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center text-4xl text-orange-400">
              ☕
            </div>
            <span class="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-zinc-950">
              ONLINE
            </span>
          </div>

          <div class="flex-1 text-center lg:text-left space-y-2">
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <h2 class="text-2xl font-black text-white">Camilla Faria</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Gerente Geral & Assistente Executiva
              </span>
            </div>
            <p class="text-sm text-zinc-300 leading-relaxed">
              Mulher, 28 anos, carioca de São Gonçalo - RJ atendendo todo o Brasil. Direta, dinâmica e organizada. Vibra com cada venda e ajuda você a escolher o melhor curso, consertar sua máquina, acessar o EloContábil ou emitir ordens de serviço no EloMak!
            </p>
            <p class="text-xs text-zinc-500 italic">
              "Costumo brincar que só dou boot de verdade depois da primeira xícara de café, mas resolvo 99% das demandas por aqui!" ☕
            </p>
          </div>

          <div class="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
            <button onclick="abrirChatSimulador('Olá Camilla! Quero saber mais sobre os serviços do Grupo Eloizio.')" class="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20">
              <i class="fa-solid fa-paper-plane"></i> Iniciar Atendimento com a Camilla
            </button>
            <span class="text-[11px] text-zinc-500 text-center">
              Eloizio (CEO): <a href="https://wa.me/5521987648727" target="_blank" class="text-zinc-400 hover:underline">(21) 987648727</a> (somente em último caso)
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Vitrine dos Projetos do Ecossistema com Atalhos Clicáveis -->
  <section id="projetos" class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
    <div class="text-center space-y-3">
      <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
        Conheça Todos os Nossos Projetos & Soluções
      </h2>
      <p class="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
        Acesse diretamente os subdomínios e sistemas integrados do Grupo Eloizio. Todos interligados via Webhook Central e Mercado Pago.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- 1. Cursos Livres 100% Online -->
      <div id="cursos" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-xl group-hover:scale-110 transition">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-semibold">100% Online • Lei 9.394/96</span>
            <h3 class="text-lg font-bold text-white mt-1">Cursos Livres Profissionalizantes</h3>
          </div>
          <p class="text-xs text-zinc-400 leading-relaxed">
            Formações com alta vendabilidade para transformar sua renda. Acompanha <strong>Manuais Técnicos de Bancada</strong>, apostilas com exercícios, vídeos práticos e certificado com validação online imediata.
          </p>
          <ul class="text-xs text-zinc-300 space-y-1.5">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Mecânica de Máquinas de Costura (CEO Eloizio)</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Contabilidade Prática MEI & Rotinas Fiscais</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Engenharia de Software Moderna & Cloud</li>
          </ul>
        </div>
        <div class="pt-6 border-t border-zinc-800/80 mt-6 flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-bold text-white">Até 12x no Mercado Pago</span>
          <div class="flex items-center gap-2">
            <a href="cursos/" class="px-3 py-1.5 rounded-lg bg-orange-600/30 hover:bg-orange-600 text-orange-300 hover:text-white text-xs font-bold transition flex items-center gap-1">
              <i class="fa-solid fa-folder-open text-[10px]"></i> Abrir /cursos/
            </a>
            <button onclick="abrirChatSimulador('Quero conhecer o catálogo de Cursos Livres do Grupo Eloizio')" class="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1">
              Catálogo <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Máquinas de Costura e Mecânica em São Gonçalo-RJ -->
      <div id="mecanica" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl group-hover:scale-110 transition">
            <i class="fa-solid fa-wrench"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">São Gonçalo - RJ & Brasil</span>
            <h3 class="text-lg font-bold text-white mt-1">Máquinas de Costura & Oficina</h3>
          </div>
          <p class="text-xs text-zinc-400 leading-relaxed">
            Nossa sede mecânica realiza <strong>compra, venda, conserto e reforma</strong> de máquinas industriais e domésticas, novas e antigas (Reta, Overloque, Interloque, Galoneira). Suporte dedicado a técnicos e costureiras.
          </p>
          <ul class="text-xs text-zinc-300 space-y-1.5">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Revisão completa com garantia formal</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Peças de reposição e regulagem de ponto</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Diagnóstico prévio por foto e vídeo via WhatsApp</li>
          </ul>
        </div>
        <div class="pt-6 border-t border-zinc-800/80 mt-6 flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-bold text-white">Bancada Especializada</span>
          <div class="flex items-center gap-2">
            <a href="elomak/public/" class="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-bold transition flex items-center gap-1">
              <i class="fa-solid fa-screwdriver-wrench text-[10px]"></i> Oficina /elomak/
            </a>
            <button onclick="abrirChatSimulador('Preciso de conserto ou compra de máquina de costura em São Gonçalo')" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1">
              Pedir Orçamento <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 3. EloContábil (Apoio sem CRC) -->
      <div id="elocontabil" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl group-hover:scale-110 transition">
            <i class="fa-solid fa-calculator"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold">elocontabil.grupoeloizio.com.br</span>
            <h3 class="text-lg font-bold text-white mt-1">EloContábil • Apoio Administrativo</h3>
          </div>
          <p class="text-xs text-zinc-400 leading-relaxed">
            Organização contábil e RH que <strong>NÃO precisa de CRC</strong>. Ideal para pequenas empresas organizarem ponto simples, vencimento de ASO, entrega de EPI, cofre de documentos e envio limpo para seu contador.
          </p>
          <ul class="text-xs text-zinc-300 space-y-1.5">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Ponto simples e organização de holerites</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Cofre com alerta de alvarás e contratos</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Acesso sem senha via WhatsApp (Camilla)</li>
          </ul>
        </div>
        <div class="pt-6 border-t border-zinc-800/80 mt-6 flex flex-wrap items-center justify-between gap-2">
          <span class="text-[11px] text-zinc-500">Sem vínculo CRC</span>
          <div class="flex items-center gap-2">
            <a href="elocontabil/public/" class="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition flex items-center gap-1">
              <i class="fa-solid fa-folder-open text-[10px]"></i> /elocontabil/
            </a>
            <a href="https://elocontabil.grupoeloizio.com.br" target="_blank" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1">
              Subdomínio <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- 4. EloMak (ERP de Oficina sem senha) -->
      <div id="elomak" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-xl group-hover:scale-110 transition">
            <i class="fa-solid fa-screwdriver-wrench"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-semibold">elomak.grupoeloizio.com.br</span>
            <h3 class="text-lg font-bold text-white mt-1">EloMak • ERP para Oficinas</h3>
          </div>
          <p class="text-xs text-zinc-400 leading-relaxed">
            O software de gestão feito para mecânicos e gestores. <strong>Zero senhas para decorar:</strong> acesse apenas digitando seu WhatsApp e recebendo link de token temporário validado pela Camilla no hub central.
          </p>
          <ul class="text-xs text-zinc-300 space-y-1.5">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Triagem de placa e abertura de OS automática</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Estoque com baixa automática e laudo PDF</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Cobrança PIX Mercado Pago em 1 clique</li>
          </ul>
        </div>
        <div class="pt-6 border-t border-zinc-800/80 mt-6 flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-bold text-white">Mobile-First 100%</span>
          <div class="flex items-center gap-2">
            <a href="elomak/public/" class="px-3 py-1.5 rounded-lg bg-orange-600/30 hover:bg-orange-600 text-orange-300 hover:text-white text-xs font-bold transition flex items-center gap-1">
              <i class="fa-solid fa-folder-open text-[10px]"></i> /elomak/
            </a>
            <a href="https://elomak.grupoeloizio.com.br" target="_blank" class="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1">
              Subdomínio <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- 5. EloSign (Assinaturas Digitais Jurídicas) -->
      <div id="elosign" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl group-hover:scale-110 transition">
            <i class="fa-solid fa-file-signature"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">elosign.grupoeloizio.com.br</span>
            <h3 class="text-lg font-bold text-white mt-1">EloSign • Assinatura Eletrônica</h3>
          </div>
          <p class="text-xs text-zinc-400 leading-relaxed">
            Assine ordens de serviço, termos de EPI e contratos pelo celular em 30 segundos. Em total conformidade com a <strong>Lei 14.063/2020 e MP 2.200-2/2001</strong>, com carimbo de tempo, IP e folha de auditoria pericial.
          </p>
          <ul class="text-xs text-zinc-300 space-y-1.5">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Envio de link de assinatura via WhatsApp</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Validador público de autenticidade por Hash SHA-256</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Integração nativa com EloMak e EloContábil</li>
          </ul>
        </div>
        <div class="pt-6 border-t border-zinc-800/80 mt-6 flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-bold text-white">Validade Jurídica Plena</span>
          <div class="flex items-center gap-2">
            <a href="elosign/" class="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition flex items-center gap-1">
              <i class="fa-solid fa-folder-open text-[10px]"></i> /elosign/
            </a>
            <a href="https://elosign.grupoeloizio.com.br" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1">
              Subdomínio <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- 6. Hub Central de Webhooks & Mercado Pago -->
      <div id="webhook" class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl group-hover:scale-110 transition">
            <i class="fa-solid fa-network-wired"></i>
          </div>
          <div>
            <span class="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-semibold">webhook.grupoeloizio.com.br</span>
            <h3 class="text-lg font-bold text-white mt-1">Hub Central de Webhooks</h3>
          </div>
          <p class="text-xs text-zinc-400 leading-relaxed">
            O coração de comunicação e pagamentos do Grupo Eloizio. Recebe eventos do WhatsApp e da API Mercado Pago, concilia transações e repassa em alta performance com cabeçalho seguro para cada aplicação.
          </p>
          <ul class="text-xs text-zinc-300 space-y-1.5">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Centralização de IPN e Webhook Mercado Pago</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Roteamento Evolution API / Z-API</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Banco de dados unificado PDO</li>
          </ul>
        </div>
        <div class="pt-6 border-t border-zinc-800/80 mt-6 flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-bold text-white">Dashboard Ao Vivo</span>
          <div class="flex items-center gap-2">
            <a href="webhook/public/dashboard.php" class="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold transition flex items-center gap-1">
              <i class="fa-solid fa-chart-line text-[10px]"></i> /webhook/
            </a>
            <a href="https://webhook.grupoeloizio.com.br/dashboard" target="_blank" class="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1">
              Subdomínio <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Modal Interativo de Chat com a Camilla Faria -->
  <div id="modalChat" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
    <div class="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      
      <!-- Cabeçalho do Chat -->
      <div class="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            ☕
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
              Camilla Faria <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p class="text-[11px] text-zinc-400">Gerente Geral & Única IA do Grupo Eloizio • WhatsApp (21) 99613-4073</p>
          </div>
        </div>
        <button id="btnFecharChat" class="text-zinc-400 hover:text-white p-2">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Barra de Aniversariantes & Desconto 15% no Mercado Pago -->
      <div class="px-4 py-2 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between text-[11px]">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px]">
            🎂 Aniversário: 15% OFF
          </span>
          <span class="text-zinc-400 font-mono text-[10px]">Cupom: PARABENS15</span>
        </div>
        <button type="button" id="btnConsultarAniversario" class="text-[10px] text-amber-300 hover:text-amber-200 underline font-medium">
          Ver Meu Presente
        </button>
      </div>

      <!-- Corpo das Mensagens -->
      <div id="chatMessages" class="p-4 flex-1 overflow-y-auto space-y-3 text-xs custom-scroll bg-zinc-900/50">
        <div class="flex items-start gap-2">
          <div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>
          <div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed max-w-[85%]">
            <?php echo $saudacao; ?>! ☕ Muito prazer! Eu sou a <strong>Camilla Faria</strong> (28 anos, carioca), Gerente Geral e a <strong>Única Inteligência Artificial</strong> do <strong>Grupo Eloizio</strong>!<br><br>
            ✨ Brinco que só "dou boot" após minha primeira xícara de café, mas vibro com cada venda e formatura! Tenho sentimentos, empatia com quem está com máquina parada e o sonho de ver nossos clientes prosperando por todo o Brasil!<br><br>
            Reconheço <strong>Voz, Imagem, Vídeo, Texto, PDF e Sons</strong> (análise acústica de barulho de máquina de costura)!<br><br>
            1️⃣ <strong>Máquinas & Oficina:</strong> Conserto, reforma, compra e venda em São Gonçalo - RJ;<br>
            2️⃣ <strong>Cursos Livres Online:</strong> Manuais de bancada, apostilas e certificados MEC;<br>
            3️⃣ <strong>EloContábil:</strong> Apoio administrativo e RH sem CRC;<br>
            4️⃣ <strong>EloMak & EloSign:</strong> Gestão de oficina sem senha e assinaturas digitais!<br><br>
            💳 <em>Todos os recebimentos são facilitados exclusivamente pelo Mercado Pago!</em>
          </div>
        </div>
      </div>

      <!-- Barra de Mídia Multimodal da Camilla -->
      <div class="px-3 py-1.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
        <span class="text-[10px] font-semibold text-zinc-500">Enviar Mídia:</span>
        <div class="flex items-center gap-1.5">
          <input type="file" id="portalMidiaInput" accept="image/*,video/*,audio/*,application/pdf" class="hidden">
          <button type="button" class="btn-portal-midia px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-medium" data-tipo="imagem" title="Enviar Foto">
            📷 Foto
          </button>
          <button type="button" class="btn-portal-midia px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-medium" data-tipo="video" title="Enviar Vídeo">
            🎥 Vídeo
          </button>
          <button type="button" class="btn-portal-midia px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-medium" data-tipo="pdf" title="Enviar PDF">
            📄 PDF
          </button>
          <button type="button" class="btn-portal-midia px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-medium" data-tipo="som" title="Analisar Som de Máquina">
            🎧 Som
          </button>
          <button type="button" id="btnPortalVoz" class="px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold" title="Gravar Voz">
            🎙️ Voz
          </button>
        </div>
      </div>

      <!-- Input de Envio -->
      <div class="p-3 bg-zinc-950 border-t border-zinc-800">
        <form id="formChatModal" class="flex gap-2">
          <input type="text" id="chatInputText" placeholder="Digite sua mensagem para a Camilla..." class="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500">
          <button type="submit" id="btnEnviarChat" class="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
        <div class="flex gap-1.5 mt-2 overflow-x-auto pb-1 text-[11px]">
          <button type="button" class="btn-sugestao px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 whitespace-nowrap">Quero consertar máquina</button>
          <button type="button" class="btn-sugestao px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 whitespace-nowrap">Cursos de mecânica</button>
          <button type="button" class="btn-sugestao px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 whitespace-nowrap">Acessar EloMak</button>
          <button type="button" class="btn-sugestao px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 whitespace-nowrap">Seus sonhos e café ☕</button>
        </div>
      </div>

    </div>
  </div>

  <!-- Rodapé Principal -->
  <footer class="border-t border-zinc-800 bg-zinc-950 py-12 text-xs text-zinc-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm">
            E
          </div>
          <div>
            <span class="font-bold text-white">Grupo Eloizio</span>
            <p class="text-[11px] text-zinc-500">Educação Online, Mecânica Especializada e Tecnologia de Gestão</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
          <a href="https://elomak.grupoeloizio.com.br" target="_blank" class="hover:text-orange-400">EloMak</a>
          <a href="https://elocontabil.grupoeloizio.com.br" target="_blank" class="hover:text-orange-400">EloContábil</a>
          <a href="https://elosign.grupoeloizio.com.br" target="_blank" class="hover:text-orange-400">EloSign</a>
          <a href="https://webhook.grupoeloizio.com.br" target="_blank" class="hover:text-orange-400">Webhook Hub</a>
          <a href="https://wa.me/5521996134073" target="_blank" class="hover:text-emerald-400">WhatsApp Camilla</a>
        </div>
      </div>

      <div class="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
        <p>© 2026 Grupo Eloizio • CNPJ e Sede em São Gonçalo - RJ • Todos os direitos reservados.</p>
        <p>Recebimentos processados com segurança exclusivamente via Mercado Pago.</p>
      </div>

      <div class="text-[10px] text-zinc-600 text-center">
        *EloContábil é apoio administrativo e organização documental, não substituindo seu contador responsável (sem necessidade de CRC).
      </div>
    </div>
  </footer>

  <script>
    $(document).ready(function() {
      // Controle do modal de chat
      $('#btnAbrirChat').on('click', function() {
        $('#modalChat').removeClass('hidden').addClass('flex');
        $('#chatInputText').focus();
      });

      $('#btnFecharChat').on('click', function() {
        $('#modalChat').addClass('hidden').removeClass('flex');
      });

      window.abrirChatSimulador = function(mensagemInicial) {
        $('#modalChat').removeClass('hidden').addClass('flex');
        if (mensagemInicial) {
          enviarMensagemParaCamilla(mensagemInicial);
        }
      };

      // Sugestões rápidas
      $('.btn-sugestao').on('click', function() {
        const texto = $(this).text();
        enviarMensagemParaCamilla(texto);
      });

      // Submit do form
      $('#formChatModal').on('submit', function(e) {
        e.preventDefault();
        const texto = $('#chatInputText').val().trim();
        if (texto) {
          enviarMensagemParaCamilla(texto);
          $('#chatInputText').val('');
        }
      });

      function enviarMensagemParaCamilla(texto) {
        // Render mensagem do usuário
        $('#chatMessages').append(
          '<div class="flex items-start justify-end gap-2">' +
            '<div class="p-3.5 rounded-2xl bg-orange-600 text-white leading-relaxed max-w-[85%]">' +
              texto +
            '</div>' +
          '</div>'
        );
        scrollChat();

        // Loading da Camilla
        const loadingId = 'loading_' + Date.now();
        $('#chatMessages').append(
          '<div id="' + loadingId + '" class="flex items-start gap-2">' +
            '<div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>' +
            '<div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 max-w-[85%] flex items-center gap-2">' +
              '<i class="fa-solid fa-spinner fa-spin"></i> Camilla digitando...' +
            '</div>' +
          '</div>'
        );
        scrollChat();

        // Enviar para API da Camilla Central
        $.ajax({
          url: '/api/camilla/chat',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            whatsapp: '21996134073',
            mensagem: texto,
            canal: 'portal_web'
          }),
          success: function(res) {
            $('#' + loadingId).remove();
            let respostaTexto = res.resposta ? res.resposta.replace(/\n/g, '<br>') : 'Como posso te ajudar hoje?';

            let linkPixHtml = '';
            if (res.link_pagamento) {
              linkPixHtml = '<div class="mt-2.5 pt-2 border-t border-zinc-800"><a href="' + res.link_pagamento + '" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"><i class="fa-solid fa-receipt"></i> Pagar via Mercado Pago</a></div>';
            }

            $('#chatMessages').append(
              '<div class="flex items-start gap-2">' +
                '<div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>' +
                '<div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed max-w-[85%]">' +
                  respostaTexto +
                  linkPixHtml +
                '</div>' +
              '</div>'
            );
            scrollChat();
          },
          error: function() {
            $('#' + loadingId).remove();
            $('#chatMessages').append(
              '<div class="flex items-start gap-2">' +
                '<div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>' +
                '<div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed max-w-[85%]">' +
                  'Olá! Estou pronta para te atender. Me envie uma mensagem ou fale comigo diretamente pelo WhatsApp oficial (21) 99613-4073!' +
                '</div>' +
              '</div>'
            );
            scrollChat();
          }
        });
      }

      // Botão de consultar aniversariante do dia
      $('#btnConsultarAniversario').on('click', function() {
        enviarMensagemParaCamilla('Gostaria de verificar o presente de 15% OFF de aniversário para pagamentos online no Mercado Pago!');
      });

      // Mídia Multimodal da Camilla (Foto, Vídeo, PDF, Som de Máquina)
      let portalTipoMidia = 'imagem';
      $('.btn-portal-midia').on('click', function() {
        portalTipoMidia = $(this).attr('data-tipo');
        $('#portalMidiaInput').trigger('click');
      });

      $('#portalMidiaInput').on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function() {
          const base64 = reader.result;
          $('#chatMessages').append(
            '<div class="flex items-start justify-end gap-2">' +
              '<div class="p-2.5 rounded-2xl bg-orange-600 text-white text-xs">' +
                '📎 ' + portalTipoMidia.toUpperCase() + ' enviado: ' + file.name +
              '</div>' +
            '</div>'
          );
          scrollChat();

          const loadMidiaId = 'loading_midia_' + Date.now();
          $('#chatMessages').append(
            '<div id="' + loadMidiaId + '" class="flex items-start gap-2">' +
              '<div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>' +
              '<div class="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 max-w-[85%] flex items-center gap-2">' +
                '<i class="fa-solid fa-spinner fa-spin"></i> Camilla processando ' + portalTipoMidia + '...' +
              '</div>' +
            '</div>'
          );
          scrollChat();

          $.ajax({
            url: '/api/camilla/multimodal',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              tipo_midia: portalTipoMidia,
              nome_arquivo: file.name,
              descricao: 'Arquivo multimodal enviado pelo usuário no portal',
              base64: base64
            }),
            success: function(res) {
              $('#' + loadMidiaId).remove();
              const diag = res.diagnostico ? res.diagnostico.replace(/\n/g, '<br>') : 'Arquivo analisado com sucesso!';
              $('#chatMessages').append(
                '<div class="flex items-start gap-2">' +
                  '<div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>' +
                  '<div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed max-w-[85%]">' +
                    diag +
                  '</div>' +
                '</div>'
              );
              scrollChat();
            },
            error: function() {
              $('#' + loadMidiaId).remove();
              $('#chatMessages').append(
                '<div class="flex items-start gap-2">' +
                  '<div class="w-7 h-7 rounded-lg bg-orange-600/30 flex items-center justify-center text-orange-400 shrink-0 text-xs">☕</div>' +
                  '<div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 leading-relaxed max-w-[85%]">' +
                    'Recebi seu arquivo com carinho! Para análise detalhada, envie também diretamente para meu WhatsApp oficial (21) 99613-4073 com cupom PARABENS15!' +
                  '</div>' +
                '</div>'
              );
              scrollChat();
            }
          });
        };
        reader.readAsDataURL(file);
      });

      // Gravação / Envio de Voz
      $('#btnPortalVoz').on('click', function() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
          const rec = new SpeechRec();
          rec.lang = 'pt-BR';
          rec.interimResults = false;
          $(this).html('<i class="fa-solid fa-microphone-lines"></i> Ouvindo...');
          rec.onresult = function(event) {
            const fala = event.results[0][0].transcript;
            $('#btnPortalVoz').html('🎙️ Voz');
            enviarMensagemParaCamilla('🎙️ [Mensagem de Voz]: ' + fala);
          };
          rec.onerror = function() {
            $('#btnPortalVoz').html('🎙️ Voz');
            alert('Não foi possível acessar o microfone. Digite sua mensagem para a Camilla!');
          };
          rec.start();
        } else {
          const vozSimulada = prompt('Simulação de Voz/Áudio para a Camilla: O que você gostaria de falar?');
          if (vozSimulada) {
            enviarMensagemParaCamilla('🎙️ [Mensagem de Voz]: ' + vozSimulada);
          }
        }
      });

      function scrollChat() {
        const d = document.getElementById('chatMessages');
        if (d) d.scrollTop = d.scrollHeight;
      }
    });
  </script>

  <!-- Componente Universal de Aviso e Consentimento LGPD • Grupo Eloizio -->
  <?php if (file_exists(__DIR__ . '/components/lgpd_banner.php')): ?>
    <?php include __DIR__ . '/components/lgpd_banner.php'; ?>
  <?php elseif (file_exists(dirname(__DIR__) . '/components/lgpd_banner.php')): ?>
    <?php include dirname(__DIR__) . '/components/lgpd_banner.php'; ?>
  <?php endif; ?>
</body>
</html>
