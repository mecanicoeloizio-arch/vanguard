<?php
/**
 * Grupo Eloizio - Portal Acadêmico do Aluno (PHP 8.1+)
 * Aulas, LMS, Boletim Oficial, Provas Online, Emissão de Certificados e Financeiro
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Portal do Aluno (Aulas, Boletim & Certificados)";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$aluno = getAlunoPadrao();
?>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
  <!-- Cartão de Boas-Vindas & Identidade Estudantil -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-900/50 space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3.5 sm:gap-4">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" alt="<?= htmlspecialchars($aluno['name']) ?>" class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-inner shrink-0">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <?= $aluno['status'] ?>
            </span>
            <span class="text-xs text-indigo-300 font-mono">Reg: <?= $aluno['registrationNumber'] ?></span>
          </div>
          <h2 class="text-lg sm:text-2xl font-black text-white mt-1"><?= $aluno['name'] ?></h2>
          <p class="text-xs sm:text-sm text-indigo-200"><?= $aluno['course'] ?></p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="abrirCertificadoImpressao()" class="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 cursor-pointer transition flex items-center gap-1.5">
          <span>📜 Emitir Certificado Oficial</span>
        </button>
      </div>
    </div>

    <!-- Progresso do Curso -->
    <div class="space-y-1.5 pt-2 border-t border-indigo-900/60">
      <div class="flex items-center justify-between text-xs text-indigo-300 font-bold">
        <span>Progresso Geral do Curso</span>
        <span><?= $aluno['progressPercent'] ?>% Concluído</span>
      </div>
      <div class="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-indigo-800/40">
        <div class="bg-linear-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all" style="width: <?= $aluno['progressPercent'] ?>%;"></div>
      </div>
    </div>
  </div>

  <!-- Banner do Servidor de E-mail Institucional Gratuito Vanguard -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-400/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-lg">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-xl shrink-0">
        ✉️
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-extrabold text-sm sm:text-base text-white">E-mail Institucional Oficial Gratuito</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
            ✓ Aluno Vanguard 100% Grátis
          </span>
        </div>
        <p class="text-xs text-indigo-200 mt-0.5 font-mono">
          <?= htmlspecialchars($aluno['email'] ?? 'lucas.silva@aluno.eduvanguard.com.br') ?> • Subdomínio: webmail.grupoeloizio.com.br (PHPMailer 6.9+)
        </p>
      </div>
    </div>
    <a href="/mail/?box=<?= urlencode($aluno['email'] ?? 'lucas.silva@aluno.eduvanguard.com.br') ?>" target="_blank" class="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30">
      <span>Abrir Meu Webmail</span>
      <span>&rarr;</span>
    </a>
  </div>

  <!-- Banner EloWa WhatsApp Oficial Aluno -->
  <div class="bg-linear-to-r from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-lg">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-600/40 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
        💬
      </div>
      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-extrabold text-sm sm:text-base text-white">Canal de WhatsApp Oficial EloWa</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
            ✓ Aluno Vanguard 100% Grátis
          </span>
        </div>
        <p class="text-xs text-emerald-200 mt-0.5 font-mono">
          Suporte Direto com Camilla Faria: (21) 99613-4073 • Subdomínio: elowa.grupoeloizio.com.br
        </p>
      </div>
    </div>
    <a href="/elowa/?inst=inst_aluno_lucas" target="_blank" class="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30">
      <span>Acessar WhatsApp EloWa</span>
      <span>&rarr;</span>
    </a>
  </div>

  <!-- Barra de Abas do Aluno -->
  <div class="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar shadow-xs">
    <button onclick="trocarAbaAluno('aulas')" id="btnAbaAulas" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap">
      📺 Minhas Aulas (LMS)
    </button>
    <button onclick="trocarAbaAluno('boletim')" id="btnAbaBoletim" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      📊 Boletim Escolar
    </button>
    <button onclick="trocarAbaAluno('simulador')" id="btnAbaSimulador" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      🔬 Simulador Técnico & Diagnóstico
    </button>
    <button onclick="trocarAbaAluno('provas')" id="btnAbaProvas" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      📝 Avaliações & Quizzes
    </button>
    <button onclick="trocarAbaAluno('documentos')" id="btnAbaDocumentos" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      📜 Certificado & Documentos
    </button>
    <button onclick="trocarAbaAluno('financeiro')" id="btnAbaFinanceiro" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      💳 Financeiro & Mensalidades
    </button>
  </div>

  <!-- ABA 1: AULAS & LMS PLAYER -->
  <div id="secaoAulas" class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Player de Vídeo e Transcrição -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-800">
          <div class="relative aspect-video bg-black flex items-center justify-center">
            <video id="playerVideo" controls class="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800">
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
          <div class="p-4 sm:p-6 text-white space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="text-xs font-mono text-emerald-400 font-bold">Módulo 1 • Aula 1</span>
              <button onclick="concluirAulaAtual()" id="btnConcluirAula" class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-black cursor-pointer transition">
                ✓ Marcar como Concluída
              </button>
            </div>
            <h3 class="text-lg sm:text-xl font-black text-white" id="tituloAulaAtual">
              1. Introdução à Arquitetura Orientada a Eventos
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Compreenda a separação de responsabilidades, desacoplamento assíncrono e transição de sistemas monolíticos para microsserviços.
            </p>
          </div>
        </div>

        <!-- Transcrição da Aula & Materiais -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h4 class="font-black text-sm text-slate-900">Transcrição & Resumo da Aula:</h4>
          <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            "Olá a todos. Nesta aula vamos aprofundar na transição de sistemas monolíticos para arquiteturas dirigidas por eventos. Veremos conceitos de pub/sub, mensageria e consistência eventual garantindo integridade transacional."
          </p>
          <div class="flex items-center gap-2 pt-2">
            <span class="text-xs font-bold text-slate-700">Materiais Complementares:</span>
            <a href="#" onclick="alert('Download do PDF liberado!')" class="text-xs text-indigo-600 font-bold hover:underline">📥 Slides-Aula-01.pdf (2.4 MB)</a>
          </div>
        </div>
      </div>

      <!-- Grade de Módulos e Aulas -->
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 h-fit">
        <h4 class="font-black text-sm text-slate-900 flex items-center justify-between">
          <span>Conteúdo Programático</span>
          <span class="text-xs text-indigo-600 font-bold">5 Aulas</span>
        </h4>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
            <strong class="text-indigo-950 font-bold block">Módulo 1: Fundamentos de Arquitetura</strong>
            <div class="space-y-1.5">
              <button onclick="carregarAula(1, '1. Introdução à Arquitetura Orientada a Eventos')" class="w-full text-left p-2 rounded-lg bg-white border border-indigo-100 font-bold text-indigo-900 flex items-center justify-between">
                <span>1. Arquitetura Orientada a Eventos</span>
                <span class="text-[10px] text-emerald-600">✓ Feita</span>
              </button>
              <button onclick="carregarAula(2, '2. Princípios SOLID e Design Patterns')" class="w-full text-left p-2 rounded-lg hover:bg-white/80 text-slate-700 flex items-center justify-between">
                <span>2. Princípios SOLID Práticos</span>
                <span class="text-[10px] text-emerald-600">✓ Feita</span>
              </button>
              <button onclick="carregarAula(3, '3. Modelagem de Domínio com DDD e CQRS')" class="w-full text-left p-2 rounded-lg hover:bg-white/80 text-slate-700 flex items-center justify-between">
                <span>3. Modelagem de Domínio DDD</span>
                <span class="text-[10px] text-slate-400">45m</span>
              </button>
            </div>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <strong class="text-slate-900 font-bold block">Módulo 2: Resiliência & Criptografia</strong>
            <div class="space-y-1.5">
              <button onclick="carregarAula(4, '4. Criptografia em Trânsito e em Repouso')" class="w-full text-left p-2 rounded-lg hover:bg-white text-slate-700 flex items-center justify-between">
                <span>4. Criptografia AES e LGPD</span>
                <span class="text-[10px] text-slate-400">48m</span>
              </button>
              <button onclick="carregarAula(5, '5. Observabilidade e Logs Distribuídos')" class="w-full text-left p-2 rounded-lg hover:bg-white text-slate-700 flex items-center justify-between">
                <span>5. Observabilidade e Métricas</span>
                <span class="text-[10px] text-slate-400">55m</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ABA 2: BOLETIM ESCOLAR OFICIAL -->
  <div id="secaoBoletim" class="space-y-6 hidden">
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span class="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Histórico Acadêmico Regular</span>
          <h3 class="text-xl font-black text-slate-900">Boletim Escolar Oficial — Semestre 2026/2</h3>
          <p class="text-xs text-slate-500 mt-0.5">Aluno: <?= $aluno['name'] ?> • Matrícula: <?= $aluno['registrationNumber'] ?></p>
        </div>
        <button onclick="window.print()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
          <span>🖨️ Imprimir Boletim Oficial</span>
        </button>
      </div>

      <!-- Tabela do Boletim -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <th class="py-3 px-4">Disciplina</th>
              <th class="py-3 px-3 text-center">N1</th>
              <th class="py-3 px-3 text-center">N2</th>
              <th class="py-3 px-3 text-center">Trabalho</th>
              <th class="py-3 px-3 text-center">Média</th>
              <th class="py-3 px-3 text-center">Frequência</th>
              <th class="py-3 px-4 text-center">Situação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <?php foreach ($aluno['grades'] as $g): ?>
              <tr class="hover:bg-slate-50/70 transition">
                <td class="py-3.5 px-4 font-bold text-slate-900"><?= $g['subject'] ?></td>
                <td class="py-3.5 px-3 text-center font-mono"><?= number_format($g['n1'], 1) ?></td>
                <td class="py-3.5 px-3 text-center font-mono"><?= number_format($g['n2'], 1) ?></td>
                <td class="py-3.5 px-3 text-center font-mono"><?= number_format($g['trabalho'], 1) ?></td>
                <td class="py-3.5 px-3 text-center font-mono font-black text-indigo-950 text-sm"><?= number_format($g['media'], 1) ?></td>
                <td class="py-3.5 px-3 text-center font-mono font-bold text-slate-600"><?= $g['frequencia'] ?></td>
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black <?= $g['status'] === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' ?>">
                    <?= $g['status'] ?>
                  </span>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ABA INTERATIVA: SIMULADOR TÉCNICO & DIAGNÓSTICO -->
  <div id="secaoSimulador" class="space-y-6 hidden">
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span class="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Laboratório Prático Virtual</span>
          <h3 class="text-xl font-black text-slate-900">Simulador Técnico & Osciloscópio Digital</h3>
          <p class="text-xs text-slate-500 mt-0.5">Teste componentes, ajuste rotação do motor direct-drive e verifique o ponto e sincronismo.</p>
        </div>
        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black self-start sm:self-auto">
          ● Bancada Operacional
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Controles Interativos -->
        <div class="lg:col-span-5 space-y-4">
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 uppercase mb-1">Componente em Teste:</label>
              <select id="simComponente" onchange="atualizarOsciloscopioSimulador()" class="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold">
                <option value="sensor_hall">Sensor Hall de Posição da Agulha (Motor Direct-Drive)</option>
                <option value="solenoide_corte">Válvula Solenoide de Corte Automático de Linha</option>
                <option value="lancadeira">Sincronismo de Lançadeira & Barra de Agulha</option>
                <option value="tensao_linha">Regulador Eletrônico de Tensão de Linha</option>
              </select>
            </div>

            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Velocidade de Trabalho (RPM):</span>
                <span id="rpmValor" class="font-mono text-indigo-600 font-black">2.800 RPM</span>
              </div>
              <input type="range" id="simRpm" min="500" max="5000" step="100" value="2800" oninput="atualizarOsciloscopioSimulador()" class="w-full accent-indigo-600 cursor-pointer">
            </div>

            <div>
              <div class="flex justify-between font-bold text-slate-700 mb-1">
                <span>Tensão de Alimentação (V):</span>
                <span id="tensaoValor" class="font-mono text-indigo-600 font-black">24.0 V DC</span>
              </div>
              <input type="range" id="simTensao" min="12" max="36" step="0.5" value="24" oninput="atualizarOsciloscopioSimulador()" class="w-full accent-indigo-600 cursor-pointer">
            </div>

            <button type="button" onclick="executarDiagnosticoSimulador()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer">
              ⚡ Executar Diagnóstico em Tempo Real
            </button>
          </div>
        </div>

        <!-- Tela do Osciloscópio Visual & Diagnóstico -->
        <div class="lg:col-span-7 space-y-3">
          <div class="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-white space-y-2">
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
              <span class="text-emerald-400">CH1: 5.0V/DIV • 2ms/DIV</span>
              <span id="simStatusOnda" class="text-emerald-400 font-bold">SINAL ESTÁVEL (PWM)</span>
            </div>

            <!-- Gráfico SVG Animado Simulando Osciloscópio -->
            <div class="h-36 w-full bg-slate-900/90 rounded-xl relative overflow-hidden flex items-center justify-center p-2 border border-slate-800">
              <svg id="svgOsciloscopio" class="w-full h-full text-emerald-400" viewBox="0 0 500 100" preserveAspectRatio="none">
                <path id="pathOnda" d="M 0,50 Q 25,10 50,50 T 100,50 T 150,50 T 200,50 T 250,50 T 300,50 T 350,50 T 400,50 T 450,50 T 500,50" fill="none" stroke="currentColor" stroke-width="2.5" />
              </svg>
              <div class="absolute inset-0 grid grid-cols-10 grid-rows-4 pointer-events-none opacity-15">
                <div class="border border-emerald-500"></div><div class="border border-emerald-500"></div><div class="border border-emerald-500"></div><div class="border border-emerald-500"></div><div class="border border-emerald-500"></div>
                <div class="border border-emerald-500"></div><div class="border border-emerald-500"></div><div class="border border-emerald-500"></div><div class="border border-emerald-500"></div><div class="border border-emerald-500"></div>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-1">
              <span>Frequência: <strong id="simFreq" class="text-emerald-400">93.3 Hz</strong></span>
              <span>Duty Cycle: <strong id="simDuty" class="text-emerald-400">50%</strong></span>
            </div>
          </div>

          <!-- Caixa de Laudo do Especialista -->
          <div id="simLaudoBox" class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span class="font-bold text-slate-900 block">Laudo Técnico da Bancada:</span>
            <p id="simLaudoTexto" class="text-slate-600 leading-relaxed">
              O componente selecionado está respondendo com curvas ideais dentro dos parâmetros operacionais de fábrica. Sincronismo perfeito sem perda de ponto.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ABA 3: AVALIAÇÕES & PROVAS ONLINE -->
  <div id="secaoProvas" class="space-y-6 hidden">
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="pb-4 border-b border-slate-200">
        <span class="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Avaliação de Fixação</span>
        <h3 class="text-xl font-black text-slate-900">Prova Online: Padrões de Projeto & Arquitetura de Software</h3>
        <p class="text-xs text-slate-500 mt-0.5">Responda às questões e receba o resultado com nota oficial imediatamente.</p>
      </div>

      <form onsubmit="calcularNotaProva(event)" class="space-y-6 text-xs">
        <!-- Questão 1 -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <strong class="text-slate-900 text-sm block">1. No princípio SOLID, qual o significado do "O" (Open/Closed Principle)?</strong>
          <div class="space-y-2 text-slate-700">
            <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
              <input type="radio" name="q1" value="correta" required>
              <span>Entidades de software devem ser abertas para extensão, mas fechadas para modificação.</span>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
              <input type="radio" name="q1" value="errada">
              <span>Um arquivo deve conter apenas uma função aberta por classe.</span>
            </label>
          </div>
        </div>

        <!-- Questão 2 -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <strong class="text-slate-900 text-sm block">2. Qual a função primordial de uma arquitetura baseada em microsserviços?</strong>
          <div class="space-y-2 text-slate-700">
            <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
              <input type="radio" name="q2" value="correta" required>
              <span>Garantir escalabilidade independente e desacoplamento de serviços e bancos.</span>
            </label>
            <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
              <input type="radio" name="q2" value="errada">
              <span>Agrupar todas as tabelas em um único banco de dados compartilhado.</span>
            </label>
          </div>
        </div>

        <div id="resultadoProvaBox" class="hidden p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs"></div>

        <button type="submit" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer">
          Enviar Respostas & Calcular Nota Oficial
        </button>
      </form>
    </div>
  </div>

  <!-- ABA 4: CERTIFICADO & DOCUMENTOS ESCOLARES -->
  <div id="secaoDocumentos" class="space-y-6 hidden">
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 class="text-xl font-black text-slate-900">Secretaria Virtual & Normas de Emissão de Documentos</h3>
          <p class="text-xs text-slate-500 mt-0.5">Expedição com fé pública educacional, QR Code ICP e autenticação digital.</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          ✓ Mensalidades em Dia (Quites)
        </span>
      </div>

      <!-- Resumo das Políticas Acadêmicas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
          <strong class="text-emerald-900 font-bold block">1ª Via da Carteirinha DNE:</strong>
          <span class="text-emerald-700">100% Gratuita para matriculados ativos com QR Code nacional.</span>
        </div>
        <div class="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
          <strong class="text-sky-900 font-bold block">Certificado Oficial (1ª Via):</strong>
          <span class="text-sky-700">Gratuito com mensalidades em dia e quites (LDB nº 9.394/96).</span>
        </div>
        <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
          <strong class="text-amber-900 font-bold block">Documentos & 2ª Via:</strong>
          <span class="text-amber-700">Liberados após confirmação das taxas definidas pela secretaria via Mercado Pago.</span>
        </div>
        <div class="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
          <strong class="text-purple-900 font-bold block">Crachá da Cooperativa:</strong>
          <span class="text-purple-700">Anuidade na renovação; <strong>ISENTO (R$ 0,00)</strong> para alunos concluintes!</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Carteirinha Estudantil DNE (1ª Via Gratuita) -->
        <div class="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-black text-sm text-slate-900">Carteirinha Estudantil Digital Oficial (DNE)</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-900">1ª Via Gratuita</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Padrão nacional DNE (Lei nº 12.933/2013) com QR Code criptografado para meia-entrada em eventos culturais, esportivos e transporte.
            </p>
          </div>
          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
            <span class="text-xs text-emerald-900 font-bold">1ª Via: R$ 0,00 • 2ª Via: R$ 20,00</span>
            <button onclick="abrirCarteirinhaDneModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-xs">
              🪪 Visualizar 1ª Via Gratuita
            </button>
          </div>
        </div>

        <!-- Certificado Oficial de Conclusão (1ª Via Gratuita com Mensalidade em Dia) -->
        <div class="p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 space-y-3 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-black text-sm text-slate-900">Certificado Oficial de Conclusão MEC</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-200 text-indigo-900">Gratuito (Quites)</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Emitido nos termos da Lei nº 9.394/96 com carga oficial, assinatura do CEO Eloizio Assunção e registro no Livro Geral de Diplomas.
            </p>
          </div>
          <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between">
            <span class="text-xs text-indigo-900 font-bold">1ª Via: R$ 0,00 • 2ª Via: R$ 45,00</span>
            <button onclick="abrirCertificadoImpressao()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-xs">
              📜 Visualizar & Imprimir Certificado
            </button>
          </div>
        </div>

        <!-- Histórico Escolar Oficial (Taxa de Secretaria) -->
        <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-slate-900">Histórico Escolar Oficial com Notas & Ementa</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">Taxa R$ 25,00</span>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Discriminação de módulos, médias, frequência e carga horária para aproveitamento de estudos e transferências. Liberado após confirmação do pagamento.
            </p>
          </div>
          <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span class="text-xs text-slate-500">Taxa Secretaria: <strong>R$ 25,00</strong></span>
            <button onclick="solicitarDocumentoSecretaria('Histórico Escolar Oficial', 25)" class="px-4 py-2 bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs">
              💳 Pagar Taxa & Liberar
            </button>
          </div>
        </div>

        <!-- Declaração de Matrícula Regular / Estágio (Taxa de Secretaria) -->
        <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-slate-900">Declaração de Matrícula Regular / Estágio</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">Taxa R$ 15,00</span>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Comprova vínculo acadêmico ativo com carimbo digital e chave de validação pública. Liberada após confirmação do pagamento de valores da secretaria.
            </p>
          </div>
          <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span class="text-xs text-slate-500">Taxa Secretaria: <strong>R$ 15,00</strong></span>
            <button onclick="solicitarDocumentoSecretaria('Declaração de Matrícula Regular', 15)" class="px-4 py-2 bg-[#009EE3] hover:bg-[#0089c7] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs">
              💳 Pagar Taxa & Liberar
            </button>
          </div>
        </div>
      </div>

      <!-- Banner Informativo: Crachá Funcional da Cooperativa -->
      <div class="p-5 bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-1">
          <span class="text-[10px] uppercase font-black tracking-wider text-amber-300 block">Cooperativa de Talentos & Credenciamento</span>
          <h4 class="text-sm sm:text-base font-black">Crachá Funcional da Cooperativa (Isenção Concluintes)</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            Crachá funcional em PVC com QR Code para prestação de serviços. Cobrado na anuidade para renovação (R$ 45/ano); <strong>ISENTO (R$ 0,00) para alunos concluintes de cursos</strong>!
          </p>
        </div>
        <a href="cooperativa.php" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition whitespace-nowrap">
          Acessar Cooperativa & Crachá &rarr;
        </a>
      </div>
    </div>
  </div>

  <!-- ABA 5: FINANCEIRO & MENSALIDADES -->
  <div id="secaoFinanceiro" class="space-y-6 hidden">
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 class="text-xl font-black text-slate-900">Histórico Financeiro & Mensalidades</h3>
        <p class="text-xs text-slate-500 mt-0.5">Controle de pagamentos integrado ao Mercado Pago.</p>
      </div>

      <div class="divide-y divide-slate-100">
        <?php foreach ($aluno['financial'] as $f): ?>
          <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong class="text-slate-900 text-sm block"><?= $f['description'] ?></strong>
              <span class="text-slate-500">Vencimento: <?= $f['dueDate'] ?> • Forma: <?= $f['method'] ?></span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono font-black text-slate-900 text-sm">R$ <?= number_format($f['amount'], 2, ',', '.') ?></span>
              <?php if ($f['status'] === 'paid'): ?>
                <span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-[11px]">✓ Pago</span>
              <?php else: ?>
                <button onclick="alert('Chave PIX Mercado Pago gerada para pagamento imediato!')" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs">
                  Pagar PIX
                </button>
              <?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</div>

<!-- Modal do Certificado Oficial em Alta Definição -->
<div id="modalCertificadoOficial" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-6 overflow-y-auto">
  <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 border-8 border-indigo-950 my-auto text-center space-y-6 relative print:p-0 print:border-none">
    <button onclick="fecharCertificadoImpressao()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-2xl print:hidden cursor-pointer">&times;</button>
    
    <div class="space-y-2">
      <div class="w-16 h-16 rounded-2xl bg-indigo-900 text-white flex items-center justify-center mx-auto text-2xl font-black">
        GE
      </div>
      <h2 class="text-2xl sm:text-3xl font-black uppercase text-indigo-950 tracking-wider">Grupo Eloizio — República Federativa do Brasil</h2>
      <span class="text-xs font-bold text-slate-500 tracking-widest uppercase block">Registro Oficial de Cursos Profissionalizantes Livres • Lei Federal nº 9.394/96 Art. 42 & Decreto nº 5.154/2004 (MEC)</span>
    </div>

    <div class="py-6 border-y-2 border-indigo-900/30 space-y-4">
      <p class="text-sm text-slate-700">Certificamos com honras acadêmicas que</p>
      <h3 class="text-2xl sm:text-4xl font-black text-indigo-950 font-serif"><?= $aluno['name'] ?></h3>
      <p class="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
        concluiu com aproveitamento de excelência o curso livre de qualificação profissionalizante em <strong><?= $aluno['course'] ?></strong>, com carga horária oficial de <strong>360 horas</strong>, obtendo média final <strong>9.4</strong>.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-8 pt-4 text-xs">
      <div class="border-t border-slate-400 pt-2 text-center">
        <strong class="block text-slate-900 font-bold">Eloizio Assunção</strong>
        <span class="text-slate-500 text-[11px]">Fundador & Diretor Geral do Grupo Eloizio</span>
      </div>
      <div class="border-t border-slate-400 pt-2 text-center">
        <strong class="block text-slate-900 font-bold">Profa. Dra. Mariana Fernandes</strong>
        <span class="text-slate-500 text-[11px]">Coordenação Acadêmica & Registro MEC</span>
      </div>
    </div>

    <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-4 border-t border-slate-100">
      <span>Autenticidade: <?= $aluno['certificateCode'] ?></span>
      <span>Hash: <?= substr($aluno['certificateHash'], 0, 24) ?>...</span>
    </div>

    <div class="pt-4 print:hidden flex justify-center gap-3">
      <button onclick="window.print()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer">
        🖨️ Imprimir Certificado em Papel Timbrado
      </button>
      <button onclick="fecharCertificadoImpressao()" class="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
        Fechar
      </button>
    </div>
  </div>
</div>

<!-- Modal da Carteirinha Estudantil Digital Oficial DNE (1ª Via Gratuita) -->
<div id="modalCarteirinhaDne" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-6 overflow-y-auto">
  <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border-4 border-emerald-500 my-auto text-center space-y-5 relative">
    <button onclick="fecharCarteirinhaDneModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-2xl print:hidden cursor-pointer">&times;</button>

    <div class="space-y-1">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
        1ª Via Gratuita • Padrão DNE Nacional
      </span>
      <h3 class="text-lg font-black text-slate-950 uppercase">Documento Nacional do Estudante (DNE)</h3>
      <p class="text-[11px] text-slate-500">Amparo Legal: Lei Federal nº 12.933/2013 e Decreto nº 8.537/2015</p>
    </div>

    <!-- Cartão DNE em Formato Credencial -->
    <div class="bg-linear-to-b from-slate-950 via-emerald-950 to-slate-900 text-white rounded-2xl p-5 border-2 border-emerald-400 shadow-lg text-left space-y-3">
      <div class="flex items-start justify-between border-b border-emerald-500/40 pb-2">
        <div>
          <span class="text-[8px] font-black uppercase text-emerald-300 block">República Federativa do Brasil</span>
          <strong class="text-xs font-black uppercase block text-white">Grupo Eloizio • Ensino Profissional</strong>
          <span class="text-[9px] text-slate-300">Polo São Gonçalo - RJ</span>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
          DNE
        </div>
      </div>

      <div class="flex items-center gap-3">
        <img src="<?= $aluno['avatar'] ?>" alt="<?= $aluno['name'] ?>" class="w-16 h-20 rounded-xl object-cover border border-emerald-300 shrink-0">
        <div class="space-y-0.5 text-xs">
          <span class="text-[10px] text-emerald-300 block font-bold">ALUNO REGULAR MATRICULADO</span>
          <strong class="text-sm font-black text-white block"><?= $aluno['name'] ?></strong>
          <span class="text-[11px] text-slate-200 block"><?= $aluno['course'] ?></span>
          <div class="text-[10px] text-slate-400 font-mono pt-1">
            <span>RA: <strong><?= $aluno['registrationNumber'] ?></strong></span>
            <span> • CPF: <?= $aluno['cpf'] ?></span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-emerald-500/40 pt-2 text-[9px] font-mono">
        <span class="text-emerald-300 font-bold">Autenticação: DNE-2026-VAL-OK</span>
        <span class="text-slate-400">Validade: 31/03/2027</span>
      </div>
    </div>

    <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
      <span>Fé Pública: ICP-Brasil</span>
      <span class="text-emerald-700 font-bold">✓ 1ª Via Gratuita Liberada</span>
    </div>

    <div class="print:hidden flex justify-center gap-2 pt-2">
      <button onclick="window.print()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer">
        🖨️ Imprimir Carteirinha
      </button>
      <button onclick="fecharCarteirinhaDneModal()" class="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
        Fechar
      </button>
    </div>
  </div>
</div>

<script>
  function abrirCarteirinhaDneModal() {
    document.getElementById('modalCarteirinhaDne').classList.remove('hidden');
    document.getElementById('modalCarteirinhaDne').classList.add('flex');
  }

  function fecharCarteirinhaDneModal() {
    document.getElementById('modalCarteirinhaDne').classList.add('hidden');
    document.getElementById('modalCarteirinhaDne').classList.remove('flex');
  }

  function solicitarDocumentoSecretaria(nomeDoc, taxa) {
    const pagar = confirm(`O documento escolar "${nomeDoc}" será liberado após a confirmação do pagamento da taxa de R$ ${taxa.toFixed(2).replace('.', ',')} definida pela secretaria.\n\nDeseja gerar o PIX / Checkout no Mercado Pago agora?`);
    if (pagar) {
      alert(`Chave PIX Mercado Pago no valor de R$ ${taxa.toFixed(2).replace('.', ',')} gerada com sucesso!\n\nApós o pagamento, o documento será liberado imediatamente para download e impressão com carimbo digital.`);
    }
  }

  function trocarAbaAluno(aba) {
    const abas = ['aulas', 'boletim', 'simulador', 'provas', 'documentos', 'financeiro'];
    abas.forEach(a => {
      document.getElementById('secao' + a.charAt(0).toUpperCase() + a.slice(1)).classList.add('hidden');
      document.getElementById('btnAba' + a.charAt(0).toUpperCase() + a.slice(1)).className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap';
    });
    document.getElementById('secao' + aba.charAt(0).toUpperCase() + aba.slice(1)).classList.remove('hidden');
    document.getElementById('btnAba' + aba.charAt(0).toUpperCase() + aba.slice(1)).className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap';
  }

  function atualizarOsciloscopioSimulador() {
    const rpm = document.getElementById('simRpm').value;
    const tensao = document.getElementById('simTensao').value;
    const comp = document.getElementById('simComponente').value;

    document.getElementById('rpmValor').textContent = Number(rpm).toLocaleString('pt-BR') + ' RPM';
    document.getElementById('tensaoValor').textContent = Number(tensao).toFixed(1) + ' V DC';

    const freq = (rpm / 60 * 2).toFixed(1);
    document.getElementById('simFreq').textContent = freq + ' Hz';

    // Alternar forma da curva SVG de acordo com a rotação
    const amp = Math.min(45, (tensao / 24) * 35);
    const path = document.getElementById('pathOnda');
    path.setAttribute('d', `M 0,50 Q 25,${50 - amp} 50,50 T 100,50 T 150,50 T 200,50 T 250,50 T 300,50 T 350,50 T 400,50 T 450,50 T 500,50`);
  }

  function executarDiagnosticoSimulador() {
    const rpm = document.getElementById('simRpm').value;
    const tensao = document.getElementById('simTensao').value;
    const comp = document.getElementById('simComponente').value;
    const laudo = document.getElementById('simLaudoTexto');

    if (tensao < 18) {
      laudo.innerHTML = '<span class="text-rose-600 font-bold">⚠️ ALERTA DE SUBTENSÃO:</span> Tensão abaixo de 18V provoca falha no disparo do solenoide e parada irregular da barra de agulha. Verifique a fonte chaveada de 24V.';
      document.getElementById('simStatusOnda').textContent = 'ANOMALIA: SUBTENSÃO';
      document.getElementById('simStatusOnda').className = 'text-rose-400 font-bold';
    } else if (rpm > 4200) {
      laudo.innerHTML = '<span class="text-amber-600 font-bold">⚠️ ALERTA DE ALTA VELOCIDADE:</span> Em rotações acima de 4.200 RPM, certifique-se de que o óleo lubrificante está pressurizado na bomba para evitar superaquecimento da lançadeira rotativa.';
      document.getElementById('simStatusOnda').textContent = 'ALERTA: LIMITE DE RPM';
      document.getElementById('simStatusOnda').className = 'text-amber-400 font-bold';
    } else {
      laudo.innerHTML = '<span class="text-emerald-700 font-bold">✓ DIAGNÓSTICO 100% CONFORME:</span> Sensor e atuador operando em regime nominal. Tempo de laçada e ponto calibrados com sucesso conforme especificações do Grupo Eloizio.';
      document.getElementById('simStatusOnda').textContent = 'SINAL ESTÁVEL (PWM)';
      document.getElementById('simStatusOnda').className = 'text-emerald-400 font-bold';
    }
  }

  function carregarAula(num, titulo) {
    document.getElementById('tituloAulaAtual').innerText = titulo;
    const player = document.getElementById('playerVideo');
    player.currentTime = 0;
    player.play();
  }

  function concluirAulaAtual() {
    alert('Parabéns! Aula registrada como concluída com sucesso no seu histórico acadêmico.');
  }

  function calcularNotaProva(e) {
    e.preventDefault();
    const resBox = document.getElementById('resultadoProvaBox');
    resBox.classList.remove('hidden');
    resBox.innerHTML = '<strong>✔ Avaliação Corrigida: Nota 10.0 / 10.0!</strong> Parabéns, Lucas! Seu desempenho foi lançado no Boletim Escolar.';
  }

  function abrirCertificadoImpressao() {
    const modal = document.getElementById('modalCertificadoOficial');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function fecharCertificadoImpressao() {
    const modal = document.getElementById('modalCertificadoOficial');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
