<?php
/**
 * Grupo Eloizio - Rodapé Universal Oficial (PHP 8.1+)
 */

declare(strict_types=1);
?>
  </main>

  <!-- Rodapé Institucional -->
  <footer class="bg-slate-950 text-white border-t border-indigo-950/80 pt-12 pb-8 mt-16 shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <!-- Coluna 1 -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
              GE
            </div>
            <span class="font-black text-base text-white">Grupo Eloizio</span>
          </div>
          <p class="text-slate-400 leading-relaxed">
            Plataforma educacional integrada para Direção, Professores e Alunos com cursos online, emissão de certificados oficiais, contabilidade digital e assistência técnica mecânica em São Gonçalo - RJ.
          </p>
          <div class="pt-1 text-[11px] text-emerald-400 font-bold">
            ✓ Conforme Lei nº 9.394/96 (Cursos Livres com Certificação)
          </div>
        </div>

        <!-- Coluna 2 -->
        <div class="space-y-2">
          <span class="font-bold text-white uppercase tracking-wider block mb-1">Portais & Ambientes</span>
          <ul class="space-y-1.5 text-slate-400">
            <li><a href="index.php" class="hover:text-white transition">🎓 Vitrine de Cursos Oficiais</a></li>
            <li><a href="aluno.php" class="hover:text-white transition">📚 Portal do Aluno (Boletim & Aulas)</a></li>
            <li><a href="professor.php" class="hover:text-white transition">👨‍🏫 Portal do Professor (Notas & Chamada)</a></li>
            <li><a href="admin.php" class="hover:text-white transition">⚙️ Direção & Gestão Administrativa</a></li>
            <li><a href="propostas.php" class="hover:text-white transition">💼 Central de Propostas Comerciais</a></li>
            <li><a href="validar_certificado.php" class="hover:text-white transition">📜 Validador Oficial de Certificados</a></li>
          </ul>
        </div>

        <!-- Coluna 3 -->
        <div class="space-y-2">
          <span class="font-bold text-white uppercase tracking-wider block mb-1">Serviços & Recursos</span>
          <ul class="space-y-1.5 text-slate-400">
            <li><a href="calendario.php" class="hover:text-white transition">📅 Calendário Acadêmico & Biblioteca</a></li>
            <li><a href="chat.php" class="hover:text-white transition">💬 Chat Interno Institucional</a></li>
            <li><a href="manuais.php" class="hover:text-white transition">📖 Manuais e Guia de Deploy cPanel</a></li>
            <li><span class="text-slate-500">💳 Mercado Pago (PIX com QR Code)</span></li>
            <li><span class="text-slate-400">🤖 Camilla Faria (Única IA Oficial do Grupo Eloizio)</span></li>
          </ul>
        </div>

        <!-- Coluna 4 -->
        <div class="space-y-2">
          <span class="font-bold text-white uppercase tracking-wider block mb-1">Contato & Unidades</span>
          <div class="space-y-1.5 text-slate-400">
            <div>📍 <strong>Sede:</strong> São Gonçalo - RJ</div>
            <div>📱 <strong>WhatsApp Atendimento:</strong> (21) 99613-4073</div>
            <div>📞 <strong>Diretoria Geral (Eloizio):</strong> (21) 98764-8727</div>
            <div>✉️ <strong>E-mail:</strong> mecanicoeloizio@gmail.com</div>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © <?= date('Y') ?> Grupo Eloizio — Todos os direitos reservados. Portal 100% PHP 8, HTML5, CSS3, jQuery, JS e cURL.
        </div>
        <div class="flex items-center gap-3">
          <span>Segurança SHA-256</span>
          <span>•</span>
          <span>Conforme LGPD</span>
          <span>•</span>
          <span class="text-emerald-400 font-mono">Deploy: public_html pronto</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Componente Universal de Aviso e Consentimento LGPD • Grupo Eloizio -->
  <?php if (file_exists(dirname(__DIR__) . '/components/lgpd_banner.php')): ?>
    <?php include dirname(__DIR__) . '/components/lgpd_banner.php'; ?>
  <?php elseif (file_exists(__DIR__ . '/components/lgpd_banner.php')): ?>
    <?php include __DIR__ . '/components/lgpd_banner.php'; ?>
  <?php endif; ?>

  <!-- Widget Flutuante da Camilla Faria (ÚNICA IA do Grupo Eloizio: Voz, Foto, Vídeo, PDF, Sons e Aniversariantes) -->
  <div id="camillaFloatingContainer" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none">
    <!-- Janela de Conversa da Camilla -->
    <div id="camillaChatBox" class="w-[92vw] sm:w-[440px] h-[610px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 hidden flex-col overflow-hidden mb-3">
      <!-- Cabeçalho Camilla -->
      <div class="bg-gradient-to-r from-slate-950 via-zinc-900 to-orange-950 text-white p-4 flex items-center justify-between border-b border-orange-950/60">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-zinc-950 flex items-center justify-center font-black text-sm shadow-md border border-orange-400/30">
            ☕
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h4 class="font-extrabold text-sm text-white leading-tight">Camilla Faria</h4>
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <span class="text-[10px] text-orange-200 block">Gerente Geral & Única IA do Grupo Eloizio</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <a href="https://wa.me/5521996134073" target="_blank" class="p-1.5 bg-emerald-600/40 hover:bg-emerald-600 rounded-xl text-white transition text-xs" title="WhatsApp Oficial (21 99613-4073)">
            📱
          </a>
          <button id="btnFecharCamilla" class="p-1.5 text-slate-400 hover:text-white rounded-xl text-lg leading-none cursor-pointer">
            &times;
          </button>
        </div>
      </div>

      <!-- Barra de Cupom, Perfil & Aniversariantes -->
      <div class="bg-zinc-900 px-3 py-2 text-[11px] text-zinc-200 flex flex-wrap items-center justify-between gap-1 border-b border-zinc-800">
        <div class="flex items-center gap-1.5">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-[10px]">
            🎂 Aniversário: 15% OFF
          </span>
          <span class="text-zinc-400 font-mono text-[10px]">Cupom: PARABENS15</span>
        </div>
        <button id="btnVerificarAniversario" class="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold transition">
          Ver Meu Aniversário
        </button>
      </div>

      <!-- Área de Mensagens -->
      <div id="camillaMsgsArea" class="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/70">
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div class="flex items-center gap-1.5">
            <span class="text-xs">☕</span>
            <strong class="text-zinc-950 font-bold">Camilla Faria:</strong>
          </div>
          <p class="text-slate-700 leading-relaxed">
            Olá! 💕 Eu sou a <strong>Camilla Faria</strong> (28 anos, carioca), Gerente Geral e a <strong>Única Inteligência Artificial Oficial do Grupo Eloizio</strong>! Brinco sempre que só dou boot completo após a 1ª xícara de café, mas vibro muito com cada venda e formatura!
          </p>
          <p class="text-slate-700 leading-relaxed">
            Tenho reconhecimento completo de <strong>Voz, Imagem, Vídeo, Texto, PDF e Sons</strong> (análise acústica de barulho de máquina de costura)!
          </p>
          <div class="pt-1 flex flex-wrap gap-1.5">
            <button class="camilla-btn-rapido text-[11px] bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 px-2.5 py-1 rounded-lg font-semibold transition" data-msg="Quero saber detalhes do curso de Mecânica de Máquinas com o CEO Eloizio!">
              🪡 Mecânica de Máquinas
            </button>
            <button class="camilla-btn-rapido text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 px-2.5 py-1 rounded-lg font-semibold transition" data-msg="Qual o seu sonho e como você organiza tudo aqui?">
              ☕ Seus Sonhos & Café
            </button>
            <button class="camilla-btn-rapido text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold transition" data-msg="Como funciona o desconto de 15% para aniversariantes no Mercado Pago?">
              🎁 Desconto de 15% (PARABENS15)
            </button>
            <button class="camilla-btn-rapido text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 px-2.5 py-1 rounded-lg font-semibold transition" data-msg="Como o EloContábil e o EloSign se integram ao grupo?">
              📋 EloContábil & EloSign
            </button>
          </div>
        </div>
      </div>

      <!-- Barra Multimodal: Foto, Vídeo, PDF, Áudio / Ruído -->
      <div class="px-2.5 py-1.5 bg-zinc-100 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-600">
        <span class="text-[10px] font-medium text-zinc-500">Multimodal:</span>
        <div class="flex items-center gap-1">
          <input type="file" id="camillaMidiaInput" accept="image/*,video/*,audio/*,application/pdf" class="hidden">
          <button type="button" class="btn-midia px-2 py-0.5 rounded bg-white hover:bg-orange-50 border border-zinc-200 text-zinc-700 text-[10px] font-semibold" data-type="imagem" title="Enviar Foto">
            📷 Foto
          </button>
          <button type="button" class="btn-midia px-2 py-0.5 rounded bg-white hover:bg-orange-50 border border-zinc-200 text-zinc-700 text-[10px] font-semibold" data-type="video" title="Enviar Vídeo">
            🎥 Vídeo
          </button>
          <button type="button" class="btn-midia px-2 py-0.5 rounded bg-white hover:bg-orange-50 border border-zinc-200 text-zinc-700 text-[10px] font-semibold" data-type="pdf" title="Enviar PDF">
            📄 PDF
          </button>
          <button type="button" class="btn-midia px-2 py-0.5 rounded bg-white hover:bg-orange-50 border border-zinc-200 text-zinc-700 text-[10px] font-semibold" data-type="som" title="Analisar Ruído de Máquina">
            🎧 Som
          </button>
          <button type="button" id="btnGravarVoz" class="px-2 py-0.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold" title="Gravar Mensagem de Voz">
            🎙️ Voz
          </button>
        </div>
      </div>

      <!-- Barra de Input com Mensagem -->
      <div class="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input type="text" id="camillaInputMsg" placeholder="Pergunte à Camilla Faria..." class="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden">
        <button type="button" id="btnEnviarCamilla" class="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer">
          Enviar
        </button>
      </div>
    </div>

    <!-- Botão Flutuante Oficial -->
    <button id="btnAbrirCamilla" class="px-4 py-3 bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-950 hover:from-zinc-900 hover:to-orange-900 text-white rounded-2xl shadow-xl flex items-center gap-3 transition cursor-pointer border border-orange-500/30 group">
      <div class="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-sm">
        ☕
      </div>
      <div class="text-left">
        <span class="block text-xs font-black leading-tight text-white">Falar com a Camilla</span>
        <span class="block text-[10px] text-orange-200 leading-tight">Única IA • Grupo Eloizio</span>
      </div>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1"></span>
    </button>
  </div>

  <!-- Script jQuery + JS para a Camilla Faria (100% autônomo na public_html) -->
  <script>
  $(document).ready(function() {
    // Abrir/Fechar Chat
    $('#btnAbrirCamilla').on('click', function() {
      $('#camillaChatBox').toggleClass('hidden flex');
      if (!$('#camillaChatBox').hasClass('hidden')) {
        $('#camillaInputMsg').focus();
        scrollCamillaChat();
      }
    });

    $('#btnFecharCamilla').on('click', function() {
      $('#camillaChatBox').addClass('hidden').removeClass('flex');
    });

    // Enviar mensagem rápida de botão
    $(document).on('click', '.camilla-btn-rapido', function() {
      const msg = $(this).attr('data-msg');
      if (msg) {
        enviarMensagemCamilla(msg);
      }
    });

    // Botão de verificar aniversariante
    $('#btnVerificarAniversario').on('click', function() {
      enviarMensagemCamilla('Gostaria de consultar as felicitações de aniversário do dia e meu cupom de 15% OFF!');
    });

    // Enviar mensagem digitada
    $('#btnEnviarCamilla').on('click', function() {
      const texto = $('#camillaInputMsg').val().trim();
      if (texto) {
        enviarMensagemCamilla(texto);
      }
    });

    $('#camillaInputMsg').on('keydown', function(e) {
      if (e.key === 'Enter') {
        const texto = $(this).val().trim();
        if (texto) {
          enviarMensagemCamilla(texto);
        }
      }
    });

    // Botões de Mídia Multimodal
    let tipoMidiaAtual = 'imagem';
    $('.btn-midia').on('click', function() {
      tipoMidiaAtual = $(this).attr('data-type');
      $('#camillaMidiaInput').trigger('click');
    });

    $('#camillaMidiaInput').on('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function() {
        const base64 = reader.result;
        $('#camillaMsgsArea').append(`
          <div class="text-right">
            <span class="bg-orange-600 text-white p-2 rounded-xl inline-block text-[11px]">
              📎 ${tipoMidiaAtual.toUpperCase()} enviado (${file.name})
            </span>
          </div>
        `);
        scrollCamillaChat();

        const typingId = 'typing_' + Date.now();
        $('#camillaMsgsArea').append(`
          <div id="${typingId}" class="bg-white p-2.5 rounded-2xl border border-slate-200 text-slate-400 italic text-[11px]">
            ☕ Camilla Faria analisando ${tipoMidiaAtual}...
          </div>
        `);
        scrollCamillaChat();

        $.ajax({
          url: 'camilla_ia.php?action=multimodal',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            tipo_midia: tipoMidiaAtual,
            nome_arquivo: file.name,
            descricao: 'Arquivo multimodal enviado pelo usuário',
            base64: base64
          }),
          success: function(data) {
            $('#' + typingId).remove();
            const diag = data.diagnostico || 'Arquivo processado com sucesso pela Camilla!';
            $('#camillaMsgsArea').append(`
              <div class="bg-white p-3 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
                <div class="flex items-center gap-1.5"><span class="text-xs">🔬</span><strong class="text-zinc-950 font-bold">Camilla Faria (Diagnóstico Multimodal):</strong></div>
                <div class="whitespace-pre-line text-slate-800">${diag}</div>
              </div>
            `);
            scrollCamillaChat();
          },
          error: function() {
            $('#' + typingId).remove();
            $('#camillaMsgsArea').append(`
              <div class="bg-rose-50 p-2.5 rounded-xl text-rose-800 text-[11px]">
                Falha ao processar arquivo no servidor. Me chame diretamente no WhatsApp: (21) 99613-4073 com cupom PARABENS15!
              </div>
            `);
            scrollCamillaChat();
          }
        });
      };
      reader.readAsDataURL(file);
    });

    // Gravação de voz com Web Speech / Microfone
    $('#btnGravarVoz').on('click', function() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SpeechRec();
        rec.lang = 'pt-BR';
        rec.interimResults = false;
        $(this).text('🔴 Gravando...');
        rec.onresult = function(event) {
          const fala = event.results[0][0].transcript;
          $('#btnGravarVoz').text('🎙️ Voz');
          enviarMensagemCamilla('🎙️ [Voz]: ' + fala);
        };
        rec.onerror = function() {
          $('#btnGravarVoz').text('🎙️ Voz');
          alert('Microfone não acessível. Digite sua mensagem para a Camilla!');
        };
        rec.start();
      } else {
        const audioSimulado = prompt('Simulação de Voz/Áudio para a Camilla: O que você gostaria de falar?');
        if (audioSimulado) {
          enviarMensagemCamilla('🎙️ [Áudio]: ' + audioSimulado);
        }
      }
    });

    function enviarMensagemCamilla(texto) {
      $('#camillaInputMsg').val('');
      $('#camillaMsgsArea').append(`
        <div class="text-right">
          <span class="bg-orange-600 text-white p-2.5 rounded-2xl inline-block max-w-[85%] font-medium">
            ${texto}
          </span>
        </div>
      `);
      scrollCamillaChat();

      const typingId = 'typing_' + Date.now();
      $('#camillaMsgsArea').append(`
        <div id="${typingId}" class="bg-white p-2.5 rounded-2xl border border-slate-200 text-slate-400 italic text-[11px]">
          ☕ Camilla Faria digitando...
        </div>
      `);
      scrollCamillaChat();

      $.ajax({
        url: 'camilla_ia.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          mensagem: texto,
          canal: 'cursos_web'
        }),
        success: function(data) {
          $('#' + typingId).remove();
          const resposta = data.resposta || 'Camilla Faria pronta para atender você no WhatsApp: (21) 99613-4073!';
          let linkPixHtml = '';
          if (data.link_pagamento) {
            linkPixHtml = `<div class="mt-2 pt-2 border-t border-slate-100">
              <a href="${data.link_pagamento}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg">
                💳 Pagar com 15% OFF via Mercado Pago
              </a>
            </div>`;
          }

          $('#camillaMsgsArea').append(`
            <div class="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
              <div class="flex items-center gap-1.5">
                <span class="text-xs">☕</span>
                <strong class="text-zinc-950 font-bold">Camilla Faria:</strong>
              </div>
              <div class="whitespace-pre-line text-slate-800 leading-relaxed">${resposta}</div>
              ${linkPixHtml}
            </div>
          `);
          scrollCamillaChat();
        },
        error: function() {
          $('#' + typingId).remove();
          $('#camillaMsgsArea').append(`
            <div class="bg-white p-3 rounded-2xl border border-slate-200 space-y-1 shadow-2xs">
              <strong class="text-zinc-950 block">Camilla Faria:</strong>
              <p class="text-slate-800">
                Estou pronta para te atender! Me chame diretamente no WhatsApp oficial do Grupo Eloizio: <strong>(21) 99613-4073</strong> com cupom especial <strong>PARABENS15</strong> (-15% OFF)!
              </p>
            </div>
          `);
          scrollCamillaChat();
        }
      });
    }

    function scrollCamillaChat() {
      const area = document.getElementById('camillaMsgsArea');
      if (area) {
        area.scrollTop = area.scrollHeight;
      }
    }
  });
  </script>

  <!-- Componente Universal de Aviso e Consentimento LGPD • Grupo Eloizio -->
  <?php 
  $lgpdPaths = [
      __DIR__ . '/../components/lgpd_banner.php',
      dirname(__DIR__, 2) . '/components/lgpd_banner.php',
      __DIR__ . '/components/lgpd_banner.php',
      dirname(__DIR__) . '/components/lgpd_banner.php'
  ];
  foreach ($lgpdPaths as $path) {
      if (file_exists($path)) {
          include $path;
          break;
      }
  }
  ?>
</body>
</html>
