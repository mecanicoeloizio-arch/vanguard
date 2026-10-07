<?php
/**
 * Grupo Eloizio - Calendário Acadêmico & Biblioteca Digital (PHP 8.1+)
 * Cronograma de Aulas, Provas, Plantões ao Vivo e Download de Apostilas Técnicas
 * Funciona diretamente na pasta public_html sem dependências!
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Calendário Acadêmico & Biblioteca Digital";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$eventos = getEventosCalendario();
$apostilas = getBibliotecaData();
?>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
  <!-- Header -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider">
        <span>📅 Semestre Letivo 2026 & Acervo Técnico</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-white">
        Calendário Acadêmico & Biblioteca Virtual
      </h1>
      <p class="text-xs sm:text-sm text-indigo-200">
        Fique por dentro das aulas inaugurais, plantões ao vivo com o CEO Eloizio Silva e baixe apostilas completas em PDF.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <a href="aluno.php" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition">
        📚 Ir para Minhas Aulas
      </a>
    </div>
  </div>

  <!-- Duas Colunas: Calendário Letivo e Biblioteca Digital -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Coluna 1: Calendário de Eventos (7 Colunas) -->
    <div class="lg:col-span-7 space-y-4">
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-lg font-black text-slate-900">Cronograma de Aulas & Eventos Oficiais</h2>
            <p class="text-xs text-slate-500">Datas importantes, plantões ao vivo e encerramento de módulos.</p>
          </div>
          <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Outubro / Novembro 2026</span>
        </div>

        <div class="space-y-3">
          <?php foreach ($eventos as $ev): ?>
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  <span class="text-[9px] uppercase"><?= date('M', strtotime($ev['date'])) ?></span>
                  <span class="text-base font-black leading-none"><?= date('d', strtotime($ev['date'])) ?></span>
                </div>
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded <?= ($ev['category'] === 'live') ? 'bg-emerald-100 text-emerald-800' : (($ev['category'] === 'exam') ? 'bg-rose-100 text-rose-800' : 'bg-indigo-100 text-indigo-800') ?>">
                      <?= $ev['category'] === 'live' ? 'Plantão Ao Vivo' : ($ev['category'] === 'exam' ? 'Avaliação' : 'Acadêmico') ?>
                    </span>
                    <span class="text-[11px] text-slate-400 font-mono">⏰ <?= $ev['time'] ?></span>
                  </div>
                  <h3 class="font-extrabold text-sm text-slate-900"><?= htmlspecialchars($ev['title']) ?></h3>
                  <p class="text-xs text-slate-500"><?= htmlspecialchars($ev['desc']) ?></p>
                </div>
              </div>

              <button onclick="alert('Lembrete salvo na sua agenda! Um aviso será enviado 15 minutos antes pelo WhatsApp.')" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold whitespace-nowrap cursor-pointer">
                + Salvar Agenda
              </button>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <!-- Coluna 2: Biblioteca Virtual & Apostilas (5 Colunas) -->
    <div class="lg:col-span-5 space-y-4">
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
        <div class="pb-3 border-b border-slate-100">
          <h2 class="text-lg font-black text-slate-900">Biblioteca Virtual de Apostilas</h2>
          <p class="text-xs text-slate-500">Material didático complementar em PDF para download gratuito.</p>
        </div>

        <div class="space-y-4">
          <?php foreach ($apostilas as $ap): ?>
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  <?= htmlspecialchars($ap['category']) ?>
                </span>
                <span class="text-[10px] text-slate-500 font-mono"><?= $ap['fileSize'] ?> • <?= $ap['pages'] ?> págs</span>
              </div>

              <div>
                <h3 class="font-bold text-sm text-slate-900"><?= htmlspecialchars($ap['title']) ?></h3>
                <span class="text-[11px] text-slate-500 block">Autor: <?= htmlspecialchars($ap['author']) ?></span>
                <p class="text-xs text-slate-600 mt-1 leading-relaxed"><?= htmlspecialchars($ap['description']) ?></p>
              </div>

              <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span class="text-[11px] text-emerald-700 font-bold">✓ PDF Liberado</span>
                <button onclick="alert('Download da apostila \'<?= addslashes($ap['title']) ?>\' iniciado com sucesso!')" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-1.5">
                  <span>📥 Baixar PDF</span>
                </button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
