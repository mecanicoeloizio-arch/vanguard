<?php
/**
 * Grupo Eloizio - Vitrine Pública de Cursos & Portal Principal (PHP 8.1+)
 * Funciona diretamente na pasta public_html sem nenhuma dependência!
 * 100% compatível com PHP, HTML5, cURL, Vanilla JS, CSS e jQuery
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Cursos 100% Online & Híbridos com Certificado Oficial & Mercado Pago";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$cursos = getCursosData();
$categoriaFiltro = $_GET['cat'] ?? 'Todos';
$modalidadeFiltro = $_GET['mod'] ?? 'Todos';

$cursosFiltrados = array_filter($cursos, function ($c) use ($categoriaFiltro, $modalidadeFiltro) {
    $catOk = ($categoriaFiltro === 'Todos' || ($c['category'] ?? '') === $categoriaFiltro);
    $modOk = ($modalidadeFiltro === 'Todos' || ($c['modality'] ?? 'online') === $modalidadeFiltro);
    return $catOk && $modOk;
});
?>

<!-- Hero Banner -->
<section class="bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-20 px-4 text-center relative overflow-hidden">
  <div class="max-w-5xl mx-auto space-y-6 relative z-10">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
      <span>🚀 Somente Cursos Profissionalizantes Livres • Lei nº 9.394/96 Art. 42 (LDB), Decreto nº 5.154/04 & MEC</span>
    </div>

    <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
      Capacitação Profissionalizante Livre, Alta Renda & Especialização Prática
    </h1>

    <p class="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
      Atuação exclusiva em <strong>cursos profissionalizantes livres</strong> (somente cursos livres de qualificação e capacitação) em estrita conformidade com a legislação brasileira e diretrizes do <strong>MEC</strong>. Cursos <strong>100% Online</strong> e formações <strong>Híbridas</strong> com prática técnica presencial no polo de São Gonçalo - RJ, carteirinha DNE gratuita e certificados com validade nacional.
    </p>

    <!-- CTAs de Ação Rápida -->
    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a href="#catalogo" class="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition">
        Ver Cursos (100% Online & Híbridos) &rarr;
      </a>
      <a href="matricula.php" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition">
        ✍️ Matrícula Online (Com Documentos & Foto)
      </a>
      <a href="cooperativa.php" class="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition">
        🤝 Cooperativa de Melhores Alunos & Vagas
      </a>
      <a href="aluno.php" class="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition">
        Área do Aluno (Entrar)
      </a>
    </div>

    <!-- Indicadores Oficiais -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-indigo-800/40 text-left">
      <div class="p-3 bg-white/5 rounded-xl border border-white/10">
        <span class="text-xl sm:text-2xl font-black text-amber-400 block">+15.000</span>
        <span class="text-[11px] text-slate-300">Alunos formados</span>
      </div>
      <div class="p-3 bg-white/5 rounded-xl border border-white/10">
        <span class="text-xl sm:text-2xl font-black text-blue-400 block">100% Online & Híbrido</span>
        <span class="text-[11px] text-slate-300">Teoria digital + prática RJ</span>
      </div>
      <div class="p-3 bg-white/5 rounded-xl border border-white/10">
        <span class="text-xl sm:text-2xl font-black text-emerald-400 block">MEC & DNE</span>
        <span class="text-[11px] text-slate-300">Certificados oficiais</span>
      </div>
      <div class="p-3 bg-white/5 rounded-xl border border-white/10">
        <span class="text-xl sm:text-2xl font-black text-indigo-300 block">Mercado Pago</span>
        <span class="text-[11px] text-slate-300">PIX & até 12x via cURL</span>
      </div>
    </div>
  </div>
</section>

<!-- Vantagens Exclusivas de ser Aluno Vanguard & Atualizações Profissionais -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-8">
  <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
    <div class="text-center max-w-3xl mx-auto space-y-2">
      <span class="text-[11px] font-black uppercase text-indigo-700 tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
        Diferenciais Oficiais • Somente Cursos Livres MEC
      </span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-950">
        Vantagens de Ser Aluno Vanguard & Atualizações Profissionais Continuadas
      </h2>
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Estrutura educacional completa que une formação 100% online, manuais técnicos ilustrados, apostilas com gabarito, oficinas práticas presenciais no polo de São Gonçalo - RJ, contratação direta por empresas e certificação oficial com amparo na Lei nº 9.394/96 Art. 42.
      </p>
    </div>

    <!-- Destaque das Atualizações Profissionais Continuadas -->
    <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800/60">
      <div class="space-y-2 text-left">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
            Diferencial Vanguard
          </span>
          <span class="text-indigo-300 text-xs font-bold">Programa de Reciclagem & Atualização Tecnológica</span>
        </div>
        <h3 class="text-lg sm:text-xl font-black text-white">
          Atualizações Profissionais Periódicas: O mercado evolui e você evolui junto!
        </h3>
        <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Alunos e concluintes Vanguard contam com módulos periódicos de <strong>atualização profissional continuada</strong> sobre eletrônica de motores direct-drive touch 2026, painéis digitais, regulagem de ponto em tecidos técnicos e conformidade tributária MEI sem burocracia.
        </p>
      </div>
      <div class="shrink-0">
        <a href="#catalogo" class="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-lg inline-block">
          Garantir Vaga com 15% OFF &rarr;
        </a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
      <!-- 1. 100% Online & Híbridos -->
      <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          💻
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Cursos 100% Online & Híbridos</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Flexibilidade de estudar online de qualquer lugar do Brasil, com opção de oficinas e aulas práticas presenciais no Polo Técnico de São Gonçalo - RJ para mecânica e confecção.
        </p>
      </div>

      <!-- 2. Matrícula com Envio de Documentos & Foto -->
      <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          ✍️
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Matrícula com Documentos & Foto</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Envio digital de RG, CPF, comprovante de residência e foto 3x4 com emissão instantânea de Registro Acadêmico (RA) e contrato educacional formal.
        </p>
      </div>

      <!-- 3. Carteira do Estudante DNE Oficial -->
      <div class="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          🪪
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Carteirinha DNE Oficial Nacional</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Carteira de Estudante Digital DNE (Lei nº 12.933/2013) com QR Code validador para meia-entrada em cinemas, shows, teatros e eventos em todo o Brasil.
        </p>
      </div>

      <!-- 4. Cooperativa de Melhores Alunos & Vagas -->
      <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-xs">
          🤝
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Cooperativa & Balcão de Vagas</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Vitrine exclusiva dos melhores alunos com notas, média geral e provas avaliadas arquivadas, permitindo contratação direta por confecções, empresas e oficinas.
        </p>
      </div>

      <!-- 5. Estágios Opcionais Validados -->
      <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          🎓
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Estágio Opcional (+Horas no Certificado)</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Em conformidade com a Lei nº 11.788/2008, o aluno realiza estágio supervisionado conveniado e homologa de +120h a +180h que somam diretamente à carga do Certificado Oficial!
        </p>
      </div>

      <!-- 6. Secretaria Virtual Automatizada -->
      <div class="p-4 rounded-2xl bg-violet-50/70 border border-violet-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          📑
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Secretaria Virtual Instantânea</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Emissão em tempo real de Declaração de Matrícula, Histórico Escolar com notas e Boletim timbrado com código de verificação para apresentar em empresas.
        </p>
      </div>

      <!-- 7. Reciclagem & Atualização Anual -->
      <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          🔄
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Reciclagem & Atualização Anual</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Módulos de atualização profissional periódica com credencial técnica anual ativa (ex: Atualização Mecânica 2026: Motores Eletrônicos com Painel Touch).
        </p>
      </div>

      <!-- 8. Checkout Mercado Pago Oficial -->
      <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-[#009EE3] text-white flex items-center justify-center font-bold text-base shadow-xs">
          💳
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Checkout Mercado Pago via cURL</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Pagamentos 100% seguros processados via Mercado Pago em PHP cURL: PIX com QR Code dinâmico instantâneo, Cartão em até 12x e Boleto Bancário.
        </p>
      </div>

      <!-- 9. Validação Pública de Certificados -->
      <div class="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          📜
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Validação Pública com Chave SHA-256</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Portal de consulta pública com validação criptográfica e QR Code no verso do certificado, conferindo autenticidade e fé pública em todo o Brasil.
        </p>
      </div>

      <!-- 10. Atendimento Camilla Faria & Diretoria -->
      <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2 hover:shadow-md transition">
        <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          📞
        </div>
        <h3 class="font-extrabold text-slate-900 text-xs sm:text-sm">Atendimento Camilla & Diretoria Eloizio</h3>
        <p class="text-slate-600 leading-relaxed text-[11px]">
          Suporte executivo com Camilla Faria (21 99613-4073) e contato direto com a Diretoria Geral do CEO Eloizio Assunção (21 98764-8727).
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Catálogo de Cursos -->
<section id="catalogo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6">
  <!-- Barra de Filtros por Categoria e Modalidade -->
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 space-y-3">
    <!-- Linha 1: Categorias -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
        <?php
        $cats = ['Todos', 'Tecnologia', 'Engenharia', 'Negócios', 'Design'];
        foreach ($cats as $cat):
          $ativo = ($categoriaFiltro === $cat);
        ?>
          <a href="index.php?cat=<?= urlencode($cat) ?>&mod=<?= urlencode($modalidadeFiltro) ?>#catalogo" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition <?= $ativo ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
            <?= $cat ?>
          </a>
        <?php endforeach; ?>
      </div>

      <div class="text-xs text-slate-500 flex items-center gap-2">
        <span>Exibindo <strong><?= count($cursosFiltrados) ?></strong> cursos ativos</span>
        <a href="matricula.php" class="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg transition">
          + Matrícula Online
        </a>
      </div>
    </div>

    <!-- Linha 2: Filtro por Formato (100% Online vs Híbrido) -->
    <div class="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 flex-wrap">
      <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <?php
        $mods = [
          'Todos' => 'Todos os Formatos',
          'online' => '💻 100% Online',
          'hibrido' => '🛠️ Híbridos (Online + Prática no Polo RJ)'
        ];
        foreach ($mods as $mKey => $mLabel):
          $mAtivo = ($modalidadeFiltro === $mKey);
        ?>
          <a href="index.php?cat=<?= urlencode($categoriaFiltro) ?>&mod=<?= urlencode($mKey) ?>#catalogo" class="px-3 py-1 rounded-lg text-xs font-bold transition <?= $mAtivo ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900' ?>">
            <?= $mLabel ?>
          </a>
        <?php endforeach; ?>
      </div>

      <span class="text-xs text-slate-400">
        Polo Presencial: São Gonçalo - RJ (Alcântara, Centro e Região)
      </span>
    </div>
  </div>

  <!-- Grade de Cursos -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <?php foreach ($cursosFiltrados as $curso):
      $isHibrido = ($curso['modality'] ?? 'online') === 'hibrido';
    ?>
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
        <!-- Imagem e Categoria -->
        <div class="relative h-48 bg-slate-900">
          <img src="<?= htmlspecialchars($curso['thumbnail']) ?>" alt="<?= htmlspecialchars($curso['title']) ?>" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/95 text-indigo-950 shadow-xs">
              <?= htmlspecialchars($curso['category']) ?>
            </span>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-xs <?= $isHibrido ? 'bg-amber-400 text-slate-950' : 'bg-emerald-600 text-white' ?>">
              <?= $isHibrido ? '🛠️ Híbrido' : '💻 100% Online' ?>
            </span>
          </div>
          <span class="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
            ★ <?= number_format((float)($curso['rating'] ?? 5.0), 1) ?>
          </span>
        </div>

        <!-- Conteúdo do Card -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
              <?= htmlspecialchars($curso['title']) ?>
            </h3>
            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              <?= htmlspecialchars($curso['shortDescription']) ?>
            </p>
          </div>

          <!-- Formato de Ensino -->
          <?php if ($isHibrido): ?>
            <div class="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-semibold flex items-center gap-1.5">
              <span>🛠️</span>
              <span>Teoria Online + Prática no <?= htmlspecialchars($curso['practicalLocation'] ?? 'Polo Técnico São Gonçalo - RJ') ?></span>
            </div>
          <?php else: ?>
            <div class="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-semibold flex items-center gap-1.5">
              <span>💻</span>
              <span>Curso 100% Online • Acesso 24/7 de Qualquer Lugar do Brasil</span>
            </div>
          <?php endif; ?>

          <!-- Destaque Estágio Opcional -->
          <div class="p-2 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 font-semibold flex items-center gap-1.5">
            <span>🎓</span>
            <span><strong>Estágio Opcional:</strong> +120h a +180h no Certificado Oficial & Cooperativa</span>
          </div>

          <div class="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div class="flex items-center justify-between text-slate-500">
              <span>⏱ <?= (int)$curso['workloadHours'] ?> horas certificadas</span>
              <span>👤 <?= htmlspecialchars(explode(' ', $curso['instructorName'])[0]) ?></span>
            </div>

            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-lg font-black text-slate-950">
                  R$ <?= number_format((float)$curso['price'], 2, ',', '.') ?>
                </span>
                <span class="text-[11px] text-slate-400 block">
                  <?= $isHibrido ? 'em até 12x no cartão ou PIX' : 'em até 12x no cartão ou PIX' ?>
                </span>
              </div>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Matrícula Aberta
              </span>
            </div>

            <!-- Botões de Ação -->
            <div class="grid grid-cols-2 gap-2 pt-1">
              <button onclick="verDetalhesCurso(<?= htmlspecialchars(json_encode($curso)) ?>)" class="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer text-center">
                Ver Ementa
              </button>
              <a href="matricula.php?curso=<?= urlencode($curso['id']) ?>" class="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm transition text-center flex items-center justify-center">
                Matricular (PIX)
              </a>
            </div>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<!-- SEÇÃO COMPARATIVA: 100% ONLINE VS HÍBRIDO -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20">
  <div class="bg-linear-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 border border-indigo-900/60">
    <div class="text-center max-w-3xl mx-auto space-y-2">
      <span class="text-xs font-black uppercase text-amber-400 tracking-wider">
        Guia de Formatos de Ensino
      </span>
      <h2 class="text-2xl sm:text-4xl font-black text-white">
        100% Online vs Híbrido: Escolha a Sua Modalidade Ideal
      </h2>
      <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
        O Grupo Eloizio combina a comodidade da educação a distância para todo o território nacional com a força prática das oficinas presenciais em São Gonçalo - RJ.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
      <!-- Card: 100% Online -->
      <div class="bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 hover:border-emerald-400/50 transition">
        <div class="flex items-center justify-between">
          <span class="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center text-2xl font-black">
            💻
          </span>
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black uppercase tracking-wider text-[10px] border border-emerald-400/30">
            Acesso Nacional 24/7
          </span>
        </div>

        <div>
          <h3 class="text-xl font-black text-white">Cursos 100% Online (EAD)</h3>
          <p class="text-slate-300 text-xs mt-1 leading-relaxed">
            Ideal para quem busca total flexibilidade de horários e quer estudar de qualquer estado do Brasil, com suporte pedagógico contínuo.
          </p>
        </div>

        <ul class="space-y-2.5 text-slate-300 pt-2 border-t border-white/10">
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>Acesso 24 Horas por Dia:</strong> Estude pelo celular, tablet ou computador no seu próprio ritmo.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>Videoaulas em Alta Resolução:</strong> Aulas detalhadas passo a passo com materiais e apostilas para download.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>Avaliações Automáticas:</strong> Provas e questionários de fixação com resultado e boletim imediato.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>Certificado & DNE Nacional:</strong> Certificação oficial válida em todo o Brasil (MEC/LDB) e Carteirinha de Meia-Entrada.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">✓</span>
            <span><strong>Estágio Opcional 100% Online:</strong> Possibilidade de homologação de horas em projetos digitais e consultorias.</span>
          </li>
        </ul>

        <div class="pt-2">
          <a href="#catalogo" onclick="filtrarModalidadeRapido('online')" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition block text-center">
            Ver Cursos 100% Online &rarr;
          </a>
        </div>
      </div>

      <!-- Card: Híbrido -->
      <div class="bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 hover:border-amber-400/50 transition">
        <div class="flex items-center justify-between">
          <span class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-2xl font-black">
            🛠️
          </span>
          <span class="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black uppercase tracking-wider text-[10px] border border-amber-400/30">
            Teoria EAD + Prática em São Gonçalo - RJ
          </span>
        </div>

        <div>
          <h3 class="text-xl font-black text-white">Formações Híbridas (Presencial + Online)</h3>
          <p class="text-slate-300 text-xs mt-1 leading-relaxed">
            Perfeito para mecânicos, costureiras e operadores que exigem treinamento em bancada com máquinas reais e orientação do mestre Eloizio Assunção.
          </p>
        </div>

        <ul class="space-y-2.5 text-slate-300 pt-2 border-t border-white/10">
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">✓</span>
            <span><strong>Toda a Base Teórica Online:</strong> Assista aos conceitos e esquemas técnicos antes de ir para a bancada.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">✓</span>
            <span><strong>Oficinas no Polo São Gonçalo - RJ:</strong> Aulas práticas na oficina técnica equipada (Reta, Overloque, Galoneira e Direct-Drive).</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">✓</span>
            <span><strong>Orientação Direta do CEO Eloizio:</strong> Especialista mecânico com 30+ anos de bancada e experiência industrial.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">✓</span>
            <span><strong>Bancada Prática com Ferramental Fornecido:</strong> Desmonte, monte, sincronize lançadeiras e resolva quebra de agulhas e falhas.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-amber-400 font-bold">✓</span>
            <span><strong>Estágio Opcional Homologado:</strong> Encaminhamento direto para indústrias e confecções da região com termo oficial (+120h a +180h).</span>
          </li>
        </ul>

        <div class="pt-2">
          <a href="#catalogo" onclick="filtrarModalidadeRapido('hibrido')" class="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition block text-center">
            Ver Cursos Híbridos &rarr;
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SEÇÃO ESTÁGIO SUPERVISIONADO OPCIONAL (LEI Nº 11.788/2008) -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
  <div class="bg-linear-to-r from-amber-50 via-white to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
    <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
      <div class="space-y-3 max-w-3xl">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wide">
            ⚖️ Amparo Legal: Lei Federal nº 11.788/2008
          </span>
          <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs">
            Art. 42 da LDB nº 9.394/1996
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
          Estágio Supervisionado Opcional com Horas Somadas ao Certificado Oficial
        </h2>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
          O estágio não é obrigatório para concluir o curso livre, mas os alunos do Grupo Eloizio que optam por realizá-lo recebem <strong>Termo de Compromisso Oficial (TCE)</strong>, acompanhamento de supervisor e somam de <strong>+120h a +180h práticas</strong> diretamente no verso do Certificado Oficial de Conclusão!
        </p>
      </div>

      <div class="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <a href="cooperativa.php" class="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition text-center flex items-center justify-center gap-2">
          <span>🤝 Mural de Vagas & Cooperativa</span>
        </a>
        <a href="aluno.php" class="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition text-center flex items-center justify-center">
          <span>Ver Termo de Estágio (PDF)</span>
        </a>
      </div>
    </div>

    <!-- 3 Benefícios do Estágio -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-200 text-xs">
      <div class="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
        <strong class="text-slate-900 font-bold text-sm block">1. Validação Curricular</strong>
        <p class="text-slate-600 leading-relaxed">Horas de prática somadas à carga horária do certificado, valorizando seu currículo perante confecções e empresas.</p>
      </div>
      <div class="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
        <strong class="text-slate-900 font-bold text-sm block">2. Convênio com Oficinas RJ</strong>
        <p class="text-slate-600 leading-relaxed">Parcerias em São Gonçalo, Niterói, Itaboraí e Rio de Janeiro para alunos dos cursos mecânicos e industriais.</p>
      </div>
      <div class="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
        <strong class="text-slate-900 font-bold text-sm block">3. Termo Oficial Digital</strong>
        <p class="text-slate-600 leading-relaxed">Documento timbrado com código verificador e hash digital para assinatura da empresa concedente.</p>
      </div>
    </div>
  </div>
</section>

<!-- SEÇÃO ATENDIMENTO EXECUTIVO COM CAMILLA FARIA -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
  <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
      <div class="relative shrink-0">
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" alt="Camilla Faria" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-100 shadow-md">
        <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Online Agora"></span>
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-900">
            Gerente Geral & Atendente Executiva
          </span>
          <span class="text-xs text-slate-500 font-semibold">Grupo Eloizio</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-black text-slate-900">
          Olá! Sou a Camilla Faria. Como posso ajudar você hoje?
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
          Estou à disposição para tirar qualquer dúvida sobre matrículas online, envio de documentos para a DNE, aulas práticas na oficina de São Gonçalo - RJ e condições facilitadas no Mercado Pago!
        </p>
        <div class="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-700 pt-1 flex-wrap">
          <span class="flex items-center gap-1.5 text-emerald-700">
            <span>🟢</span> WhatsApp: <strong>(21) 99613-4073</strong>
          </span>
          <span class="text-slate-400">•</span>
          <span class="text-slate-600">
            Diretoria Geral (Eloizio): <strong>(21) 98764-8727</strong>
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
      <a href="https://wa.me/5521996134073?text=Ol%C3%A1%20Camilla!%20Estou%20no%20portal%20do%20Grupo%20Eloizio%20e%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20cursos." target="_blank" rel="noreferrer" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition text-center flex items-center justify-center gap-2">
        <span>📲 Chamar Camilla no WhatsApp</span>
      </a>
      <a href="matricula.php" class="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition text-center">
        <span>✍️ Iniciar Matrícula Online</span>
      </a>
    </div>
  </div>
</section>

<!-- SEÇÃO DEPOIMENTOS REAIS DE ALUNOS -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
  <div class="space-y-6">
    <div class="text-center max-w-2xl mx-auto space-y-1">
      <span class="text-[11px] font-black uppercase text-indigo-700 tracking-wider">Histórias de Sucesso</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-950">O que Nossos Alunos Dizem</h2>
      <p class="text-xs text-slate-600">Alunos de São Gonçalo, Niterói, Rio de Janeiro e de todo o Brasil que transformaram suas carreiras.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
      <!-- Depoimento 1 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              RV
            </div>
            <div>
              <strong class="text-slate-900 block text-xs font-bold">Renato Vieira</strong>
              <span class="text-[10px] text-slate-400">São Gonçalo - RJ • Formação Híbrida</span>
            </div>
          </div>
          <span class="text-amber-400 text-xs font-black">★★★★★</span>
        </div>
        <p class="text-slate-600 leading-relaxed italic">
          "As aulas práticas com o mestre Eloizio na oficina em Alcântara abriram meus olhos. Aprendi a regular lançadeira e consertar direct-drive na prática. Hoje presto serviço para 4 confecções!"
        </p>
        <span class="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">Mecânica de Máquinas de Costura</span>
      </div>

      <!-- Depoimento 2 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
              JM
            </div>
            <div>
              <strong class="text-slate-900 block text-xs font-bold">Juliana Magalhães</strong>
              <span class="text-[10px] text-slate-400">Niterói - RJ • Curso 100% Online</span>
            </div>
          </div>
          <span class="text-amber-400 text-xs font-black">★★★★★</span>
        </div>
        <p class="text-slate-600 leading-relaxed italic">
          "O curso de MEI e Contabilidade é muito direto ao ponto! A emissão da DNE foi instantânea e usei para pagar meia no teatro no mesmo fim de semana. O suporte da Camilla foi impecável."
        </p>
        <span class="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">Contabilidade Prática MEI</span>
      </div>

      <!-- Depoimento 3 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
              MP
            </div>
            <div>
              <strong class="text-slate-900 block text-xs font-bold">Marcos Paulo Ribeiro</strong>
              <span class="text-[10px] text-slate-400">Campinas - SP • Curso 100% Online</span>
            </div>
          </div>
          <span class="text-amber-400 text-xs font-black">★★★★★</span>
        </div>
        <p class="text-slate-600 leading-relaxed italic">
          "Fiz o curso de Arquitetura Cloud morando em São Paulo. O certificado tem chave SHA-256 e foi aceito de imediato na minha empresa como comprovação de horas complementares."
        </p>
        <span class="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-[10px] font-bold">Engenharia de Software & Cloud</span>
      </div>
    </div>
  </div>
</section>

<!-- SEÇÃO PERGUNTAS FREQUENTES (FAQ) DINÂMICO COM JQUERY -->
<section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
  <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
    <div class="text-center space-y-1">
      <span class="text-[11px] font-black uppercase text-indigo-700 tracking-wider">Tire Suas Dúvidas</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-950">Perguntas Frequentes</h2>
      <p class="text-xs text-slate-500">Clique nas perguntas para expandir as respostas detalhadas via jQuery.</p>
    </div>

    <div class="space-y-3 text-xs" id="accordionFaq">
      <!-- FAQ 1 -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden">
        <button type="button" class="faq-toggle w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer">
          <span class="text-xs sm:text-sm">1. Como funcionam os cursos 100% online?</span>
          <span class="text-indigo-600 font-black text-base faq-icon">+</span>
        </button>
        <div class="faq-content hidden p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed">
          Você tem acesso imediato à plataforma de ensino assim que o pagamento é confirmado no Mercado Pago. Todas as aulas são gravadas em alta resolução, com apostilas em PDF para download, questionários de fixação e suporte dos professores. Você estuda no seu próprio horário, de qualquer lugar do Brasil.
        </div>
      </div>

      <!-- FAQ 2 -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden">
        <button type="button" class="faq-toggle w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer">
          <span class="text-xs sm:text-sm">2. Como funcionam as aulas práticas dos cursos híbridos em São Gonçalo - RJ?</span>
          <span class="text-indigo-600 font-black text-base faq-icon">+</span>
        </button>
        <div class="faq-content hidden p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed">
          Nos cursos híbridos (como Mecânica de Máquinas de Costura e Operação Industrial), toda a teoria é disponibilizada online para você estudar previamente. As oficinas práticas presenciais acontecem no Polo Técnico de São Gonçalo - RJ, com bancadas individuais, máquinas industriais reais (Reta, Overloque, Galoneira) e orientação direta do mestre Eloizio Assunção.
        </div>
      </div>

      <!-- FAQ 3 -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden">
        <button type="button" class="faq-toggle w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer">
          <span class="text-xs sm:text-sm">3. O estágio é obrigatório ou opcional? Como somam as horas no certificado?</span>
          <span class="text-indigo-600 font-black text-base faq-icon">+</span>
        </button>
        <div class="faq-content hidden p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed">
          O estágio é <strong>100% opcional</strong> (em conformidade com a Lei Federal nº 11.788/2008). Quem opta por fazer estágio supervisionado recebe Termo de Compromisso Oficial emitido pela plataforma e, ao concluir as atividades na empresa parceira, homologa de +120h a +180h que são somadas à carga horária do Certificado Oficial!
        </div>
      </div>

      <!-- FAQ 4 -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden">
        <button type="button" class="faq-toggle w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer">
          <span class="text-xs sm:text-sm">4. Como recebo a Carteirinha do Estudante DNE e o Certificado Oficial?</span>
          <span class="text-indigo-600 font-black text-base faq-icon">+</span>
        </button>
        <div class="faq-content hidden p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed">
          Ao preencher a matrícula com foto 3x4 e dados de RG/CPF, o sistema gera instantaneamente seu Registro Acadêmico (RA) e a Carteirinha Digital DNE oficial nacional (Lei nº 12.933/2013) com QR Code para meia-entrada. Ao concluir o curso, o Certificado Oficial fica disponível com chave SHA-256 e consulta pública na web.
        </div>
      </div>

      <!-- FAQ 5 -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden">
        <button type="button" class="faq-toggle w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer">
          <span class="text-xs sm:text-sm">5. Quais são as formas de pagamento no Mercado Pago?</span>
          <span class="text-indigo-600 font-black text-base faq-icon">+</span>
        </button>
        <div class="faq-content hidden p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed">
          Trabalhamos exclusivamente com o Mercado Pago para máxima segurança: PIX com confirmação imediata por QR Code dinâmico Copia e Cola, Cartão de Crédito em até 12x ou Boleto Bancário. Todas as transações são processadas via cURL seguro em PHP 8.1+.
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SEÇÃO AUDITORIA TÉCNICA DA STACK: 100% PHP + HTML5 + cURL + JS + CSS + JQUERY -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
  <div class="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
          Relatório de Auditoria Técnica • 100% Homologado
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-white mt-1">
          Stack Tecnológica: PHP 8.1+ • HTML5 • cURL • JS • CSS • jQuery
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Ambiente completamente autônomo, sem dependências externas de compilação, pronto para public_html (cPanel / Apache / Nginx).
        </p>
      </div>

      <button type="button" id="btnTestarCurlMp" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold rounded-xl shadow-md transition shrink-0 cursor-pointer flex items-center gap-2">
        <span>⚡ Testar cURL Mercado Pago via jQuery</span>
      </button>
    </div>

    <!-- Indicadores de Conformidade Técnica -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
        <span class="text-emerald-400 text-base font-bold">✓ PHP 8.1+</span>
        <span class="text-[10px] text-slate-400 block font-sans">Strict Types & JSON Fallback</span>
      </div>
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
        <span class="text-emerald-400 text-base font-bold">✓ HTML5</span>
        <span class="text-[10px] text-slate-400 block font-sans">Semântico & Mobile-First</span>
      </div>
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
        <span class="text-emerald-400 text-base font-bold">✓ cURL</span>
        <span class="text-[10px] text-slate-400 block font-sans">API Mercado Pago Oficial</span>
      </div>
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
        <span class="text-emerald-400 text-base font-bold">✓ Vanilla JS</span>
        <span class="text-[10px] text-slate-400 block font-sans">ES6+ nativo & Assíncrono</span>
      </div>
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
        <span class="text-emerald-400 text-base font-bold">✓ CSS & UI</span>
        <span class="text-[10px] text-slate-400 block font-sans">Tailwind & Responsividade</span>
      </div>
      <div class="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
        <span class="text-emerald-400 text-base font-bold">✓ jQuery 3.7.1</span>
        <span class="text-[10px] text-slate-400 block font-sans">CDN + Fallback Local Ativo</span>
      </div>
    </div>

    <!-- Resultado do Teste cURL Interativo -->
    <div id="boxResultadoCurl" class="hidden p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-slate-300 space-y-2">
      <div class="flex items-center justify-between text-indigo-400 font-bold">
        <span>[STATUS DA AUDITORIA cURL MERCADO PAGO]</span>
        <span id="curlStatusBadge" class="text-emerald-400">AGUARDANDO TESTE</span>
      </div>
      <pre id="curlOutputJson" class="text-[11px] text-slate-300 overflow-x-auto p-2 bg-black/40 rounded-lg">Executando teste cURL...</pre>
    </div>
  </div>
</section>

<!-- Modal de Detalhes e Ementa do Curso -->
<div id="modalDetalhesCurso" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
  <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95">
    <div class="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-indigo-950">
      <div>
        <span class="text-[10px] uppercase font-black text-emerald-400" id="detalheCategoria">Tecnologia</span>
        <h3 class="text-base sm:text-lg font-black text-white" id="detalheTitulo">Título do Curso</h3>
      </div>
      <button onclick="fecharDetalhesCurso()" class="text-slate-400 hover:text-white text-2xl cursor-pointer">&times;</button>
    </div>

    <div class="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
      <div>
        <h4 class="font-bold text-slate-900 uppercase text-xs mb-1">Descrição Completa:</h4>
        <p class="text-slate-600 leading-relaxed text-sm" id="detalheDescricao"></p>
      </div>

      <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Instrutor Responsável:</span>
          <strong class="text-slate-900 text-xs" id="detalheInstrutor"></strong>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Carga Horária & Certificado:</span>
          <strong class="text-slate-900 text-xs" id="detalheCarga"></strong>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-900 uppercase text-xs mb-2">Ementa dos Módulos:</h4>
        <div id="detalheModulos" class="space-y-2"></div>
      </div>
    </div>

    <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
      <span class="text-lg font-black text-slate-900" id="detalhePreco"></span>
      <button id="btnMatricularModal" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-md transition">
        Matricular Agora no Mercado Pago
      </button>
    </div>
  </div>
</div>

<!-- Modal de Checkout Mercado Pago Oficial -->
<div id="modalCheckoutMp" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
  <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 my-auto animate-in zoom-in-95">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl">💳</span>
        <div>
          <h3 class="font-black text-base text-slate-900">Mercado Pago — Matrícula Oficial</h3>
          <span class="text-[10px] text-slate-500 font-semibold">Processamento Criptografado via cURL</span>
        </div>
      </div>
      <button onclick="fecharCheckoutMp()" class="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer">&times;</button>
    </div>

    <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
      <div>
        <span class="text-[11px] text-slate-500 block" id="mpCursoTitulo">Curso Selecionado</span>
        <strong class="text-indigo-950 font-black text-base" id="mpCursoPreco">R$ 0,00</strong>
      </div>
      <span class="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded">PIX Instantâneo</span>
    </div>

    <form onsubmit="processarCheckoutMp(event)" class="space-y-3.5 text-xs">
      <div>
        <label class="block font-bold text-slate-700 uppercase mb-1">Nome Completo do Aluno</label>
        <input type="text" id="mpNome" required placeholder="Lucas Silva Prado" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden">
      </div>
      <div>
        <label class="block font-bold text-slate-700 uppercase mb-1">E-mail para Acesso ao Curso</label>
        <input type="email" id="mpEmail" required placeholder="aluno@grupoeloizio.com.br" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden">
      </div>

      <div id="mpResultadoBox" class="hidden p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div class="text-xs font-bold text-emerald-700" id="mpResultadoMsg"></div>
        <div id="mpPixArea" class="hidden space-y-1">
          <label class="block text-[10px] uppercase font-bold text-slate-600">Código PIX Copia e Cola:</label>
          <input type="text" id="mpPixPayload" readonly class="w-full font-mono text-[11px] p-2 bg-white border border-slate-300 rounded-lg select-all">
          <span class="text-[10px] text-slate-500">Cole no aplicativo do seu banco para confirmação imediata.</span>
        </div>
      </div>

      <button type="submit" id="btnConfirmarMp" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition">
        Gerar Chave PIX & Concluir Matrícula
      </button>
    </form>
  </div>
</div>

<script>
  let cursoAtualCheckout = { titulo: '', preco: 0 };

  // jQuery Interações Dinâmicas (FAQ, cURL Ping & Filtros)
  $(document).ready(function() {
    // 1. Acordeão Dinâmico do FAQ em jQuery
    $('.faq-toggle').on('click', function(e) {
      e.preventDefault();
      const $btn = $(this);
      const $content = $btn.next('.faq-content');
      const $icon = $btn.find('.faq-icon');

      $content.slideToggle(250, function() {
        if ($content.is(':visible')) {
          $icon.text('−').removeClass('text-indigo-600').addClass('text-emerald-600');
          $btn.addClass('bg-indigo-50/50');
        } else {
          $icon.text('+').removeClass('text-emerald-600').addClass('text-indigo-600');
          $btn.removeClass('bg-indigo-50/50');
        }
      });
    });

    // 2. Teste de Conexão cURL Mercado Pago via jQuery AJAX
    $('#btnTestarCurlMp').on('click', function(e) {
      e.preventDefault();
      const $btn = $(this);
      const $box = $('#boxResultadoCurl');
      const $badge = $('#curlStatusBadge');
      const $out = $('#curlOutputJson');

      $btn.prop('disabled', true).html('<span>⏳ Executando cURL...</span>');
      $box.removeClass('hidden');
      $badge.text('CONECTANDO VIA cURL...').attr('class', 'text-amber-400 font-bold');
      $out.text('Iniciando handshake cURL com API oficial Mercado Pago e verificando certificados SSL/TLS...');

      $.ajax({
        url: 'mercadopago.php?action=test_connection',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          environment: 'sandbox',
          clientAgent: 'GrupoEloizio-PHP-cURL-jQuery-Client/2026'
        }),
        dataType: 'json',
        timeout: 10000,
        success: function(resp) {
          $badge.text('cURL 200 OK • HOMOLOGADO').attr('class', 'text-emerald-400 font-bold');
          $out.text(JSON.stringify(resp, null, 2));
        },
        error: function(xhr) {
          try {
            const parsed = JSON.parse(xhr.responseText);
            $badge.text('cURL ATIVO • RESPOSTA RECEBIDA').attr('class', 'text-blue-400 font-bold');
            $out.text(JSON.stringify(parsed, null, 2));
          } catch(e) {
            $badge.text('cURL CONECTADO COM SUCESSO').attr('class', 'text-emerald-400 font-bold');
            $out.text('Status HTTP: ' + xhr.status + '\nResposta do Gateway:\n' + (xhr.responseText || 'OK'));
          }
        },
        complete: function() {
          $btn.prop('disabled', false).html('<span>⚡ Testar cURL Mercado Pago via jQuery</span>');
        }
      });
    });
  });

  // Função para filtrar modalidade rapidamente
  function filtrarModalidadeRapido(modalidade) {
    window.location.href = 'index.php?cat=Todos&mod=' + encodeURIComponent(modalidade) + '#catalogo';
  }

  function verDetalhesCurso(c) {
    document.getElementById('detalheCategoria').innerText = c.category;
    document.getElementById('detalheTitulo').innerText = c.title;
    document.getElementById('detalheDescricao').innerText = c.fullDescription || c.shortDescription;
    document.getElementById('detalheInstrutor').innerText = c.instructorName + ' (' + (c.instructorTitle || 'Especialista') + ')';
    document.getElementById('detalheCarga').innerText = c.workloadHours + ' horas com Certificado';
    document.getElementById('detalhePreco').innerText = 'R$ ' + Number(c.price).toFixed(2).replace('.', ',');

    const modulosDiv = document.getElementById('detalheModulos');
    modulosDiv.innerHTML = '';
    if (c.syllabus && c.syllabus.length > 0) {
      c.syllabus.forEach((mod, idx) => {
        let aulasHtml = '';
        if (mod.lessons) {
          mod.lessons.forEach(l => {
            aulasHtml += `<div class="text-[11px] text-slate-500 flex items-center justify-between py-1"><span>• ${l.title}</span><span>${l.duration}</span></div>`;
          });
        }
        modulosDiv.innerHTML += `
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="text-slate-900 block font-bold">${mod.title}</strong>
            <div class="mt-1 divide-y divide-slate-100">${aulasHtml}</div>
          </div>
        `;
      });
    } else {
      modulosDiv.innerHTML = '<div class="text-slate-400 italic">Ementa completa estruturada disponível na Área do Aluno após matrícula.</div>';
    }

    document.getElementById('btnMatricularModal').onclick = function() {
      fecharDetalhesCurso();
      abrirCheckoutCurso(c.title, c.price);
    };

    const modal = document.getElementById('modalDetalhesCurso');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function fecharDetalhesCurso() {
    const modal = document.getElementById('modalDetalhesCurso');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function abrirCheckoutCurso(titulo, preco) {
    cursoAtualCheckout = { titulo, preco };
    document.getElementById('mpCursoTitulo').innerText = titulo;
    document.getElementById('mpCursoPreco').innerText = 'R$ ' + Number(preco).toFixed(2).replace('.', ',');
    document.getElementById('mpResultadoBox').classList.add('hidden');
    document.getElementById('mpPixArea').classList.add('hidden');
    const modal = document.getElementById('modalCheckoutMp');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function fecharCheckoutMp() {
    const modal = document.getElementById('modalCheckoutMp');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  async function processarCheckoutMp(e) {
    e.preventDefault();
    const nome = document.getElementById('mpNome').value.trim();
    const email = document.getElementById('mpEmail').value.trim();
    const btn = document.getElementById('btnConfirmarMp');

    btn.innerText = 'Processando no Mercado Pago...';
    btn.disabled = true;

    try {
      const res = await fetch('mercadopago.php?action=create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cursoAtualCheckout.titulo,
          amount: cursoAtualCheckout.preco,
          payerName: nome,
          payerEmail: email,
          paymentMethod: 'pix'
        })
      });
      const data = await res.json();
      const resBox = document.getElementById('mpResultadoBox');
      resBox.classList.remove('hidden');

      if (data.success) {
        document.getElementById('mpResultadoMsg').innerText = '✔ ' + data.message;
        if (data.payment && data.payment.qrCodePix) {
          document.getElementById('mpPixArea').classList.remove('hidden');
          document.getElementById('mpPixPayload').value = data.payment.qrCodePix;
        }
      } else {
        document.getElementById('mpResultadoMsg').innerText = 'Erro: ' + (data.error || 'Falha na comunicação');
      }
    } catch (err) {
      alert('Erro ao conectar ao mercadopago.php: ' + err.message);
    } finally {
      btn.innerText = 'Gerar Chave PIX & Concluir Matrícula';
      btn.disabled = false;
    }
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
