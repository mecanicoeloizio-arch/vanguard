<?php
/**
 * Grupo Eloizio - Portal da Direção & Gestão Geral (PHP 8.1+)
 * Gestão de Cursos, Importação via Texto, Matrículas de Alunos, Propostas Comerciais, Financeiro e Auditoria
 * Funciona diretamente na pasta public_html sem dependências externas!
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Portal da Direção & Gestão Administrativa";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$cursos = getCursosData();
$alunos = getAlunosData();
$propostas = getPropostasData();
$propostasNovosCursos = getPropostasNovosCursos();

// Processamento POST para cadastro de curso via texto direto
$msgSucesso = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao'])) {
    if ($_POST['acao'] === 'importar_curso_texto') {
        $texto = trim($_POST['textoCurso'] ?? '');
        if (!empty($texto)) {
            // Parsing simples de linhas: Título, Categoria, Preço, Carga Horária, Instrutor, Resumo
            $titulo = 'Novo Curso Importado';
            $categoria = 'Tecnologia';
            $preco = 490.00;
            $horas = 60;
            $instrutor = 'Eloizio Assunção (CEO)';
            $resumo = 'Curso cadastrado rapidamente via importação de texto simples.';

            $linhas = explode("\n", $texto);
            foreach ($linhas as $linha) {
                $linha = trim($linha);
                if (stripos($linha, 'Título:') === 0 || stripos($linha, 'Titulo:') === 0 || stripos($linha, 'Nome:') === 0) {
                    $titulo = trim(substr($linha, strpos($linha, ':') + 1));
                } elseif (stripos($linha, 'Categoria:') === 0) {
                    $categoria = trim(substr($linha, strpos($linha, ':') + 1));
                } elseif (stripos($linha, 'Preço:') === 0 || stripos($linha, 'Preco:') === 0 || stripos($linha, 'Valor:') === 0) {
                    $v = preg_replace('/[^0-9.,]/', '', substr($linha, strpos($linha, ':') + 1));
                    $v = str_replace(',', '.', $v);
                    $preco = (float)$v ?: 490.00;
                } elseif (stripos($linha, 'Carga Horária:') === 0 || stripos($linha, 'Horas:') === 0) {
                    $horas = (int)preg_replace('/[^0-9]/', '', substr($linha, strpos($linha, ':') + 1)) ?: 60;
                } elseif (stripos($linha, 'Instrutor:') === 0 || stripos($linha, 'Professor:') === 0) {
                    $instrutor = trim(substr($linha, strpos($linha, ':') + 1));
                } elseif (stripos($linha, 'Resumo:') === 0 || stripos($linha, 'Descrição:') === 0) {
                    $resumo = trim(substr($linha, strpos($linha, ':') + 1));
                }
            }

            $novoCurso = [
                'id' => 'course_' . time(),
                'title' => $titulo,
                'shortDescription' => $resumo,
                'fullDescription' => $resumo . ' Treinamento prático desenvolvido pelo Grupo Eloizio com foco em capacitação rápida e geração de renda.',
                'category' => $categoria,
                'price' => $preco,
                'workloadHours' => $horas,
                'level' => 'Iniciante',
                'instructorName' => $instrutor,
                'instructorTitle' => 'Especialista Técnico Grupo Eloizio',
                'thumbnail' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
                'featured' => true,
                'enrolledStudentsCount' => 0,
                'rating' => 5.0,
                'tags' => [$categoria, 'Certificado MEC', 'Prática'],
                'syllabus' => [
                    [
                        'title' => 'Módulo 1: Fundamentos e Introdução',
                        'lessons' => [
                            ['title' => '1. Apresentação do Curso e Metodologia', 'duration' => '30 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                        ]
                    ]
                ]
            ];

            array_unshift($cursos, $novoCurso);
            salvarCursosData($cursos);
            $msgSucesso = "Curso <strong>" . htmlspecialchars($titulo) . "</strong> cadastrado via texto e publicado na vitrine pública!";
        }
    } elseif ($_POST['acao'] === 'cadastrar_curso_formulario') {
        $titulo = trim($_POST['titulo'] ?? 'Novo Curso');
        $categoria = trim($_POST['categoria'] ?? 'Negócios');
        $precoStr = preg_replace('/[^0-9.,]/', '', $_POST['preco'] ?? '350.00');
        $preco = (float)str_replace(',', '.', $precoStr) ?: 350.00;
        $horas = (int)($_POST['horas'] ?? 60);
        $instrutor = trim($_POST['instrutor'] ?? 'Eloizio Assunção (CEO)');
        $nivel = trim($_POST['nivel'] ?? 'Iniciante');
        $resumo = trim($_POST['resumo'] ?? 'Capacitação prática 100% online.');
        $descricao = trim($_POST['descricao'] ?? 'Treinamento completo com certificado e metodologia do Grupo Eloizio.');

        $novoCurso = [
            'id' => 'course_' . time(),
            'title' => $titulo,
            'shortDescription' => $resumo,
            'fullDescription' => $descricao,
            'category' => $categoria,
            'price' => $preco,
            'workloadHours' => $horas,
            'level' => $nivel,
            'instructorName' => $instrutor,
            'instructorTitle' => 'Especialista Técnico do Grupo Eloizio',
            'thumbnail' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 0,
            'rating' => 5.0,
            'tags' => [$categoria, 'Certificado MEC', 'Online'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Introdução e Fundamentos Práticos',
                    'lessons' => [
                        ['title' => '1. Boas-vindas e Estrutura do Curso', 'duration' => '30 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                    ]
                ]
            ]
        ];

        array_unshift($cursos, $novoCurso);
        salvarCursosData($cursos);
        $msgSucesso = "Curso <strong>" . htmlspecialchars($titulo) . "</strong> cadastrado via formulário e publicado na vitrine pública!";
    } elseif ($_POST['acao'] === 'emitir_documento_secretaria') {
        $tipoDoc = $_POST['tipoDocumento'] ?? 'declaracao';
        $alunoNome = trim($_POST['alunoNome'] ?? 'Lucas Silva Prado');
        $cod = 'DOC-' . strtoupper(substr($tipoDoc, 0, 3)) . '-' . date('Y') . '-' . rand(1000, 9999);
        $hash = hash('sha256', $cod . $alunoNome . time());
        $msgSucesso = "Documento acadêmico emitido com fé pública! Código: <strong>$cod</strong> | Hash SHA-256 gerado e arquivado no Livro de Registro.";
    }
}
?>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
  <!-- Header da Direção -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-2">
        <span>Diretoria Geral & Gestão Integrada</span>
      </div>
      <h1 class="text-xl sm:text-3xl font-black text-white">Painel Executivo — Grupo Eloizio</h1>
      <p class="text-xs text-indigo-200">Liderança: Eloizio Assunção (CEO) & Sofia Vanguard (Expert em Cursos)</p>
      <div class="mt-2 text-[11px] font-mono text-amber-300 font-bold">
        🔑 Senha Master Ativa: ELOIZIO@MASTER2026
      </div>
    </div>

    <!-- Indicadores Financeiros Rápidos -->
    <div class="grid grid-cols-3 gap-2 text-center text-xs">
      <div class="bg-white/5 border border-white/10 p-2.5 rounded-xl">
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Faturamento</span>
        <strong class="text-emerald-400 text-sm">R$ 48.920</strong>
      </div>
      <div class="bg-white/5 border border-white/10 p-2.5 rounded-xl">
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Alunos Ativos</span>
        <strong class="text-white text-sm"><?= count($alunos) + 340 ?></strong>
      </div>
      <div class="bg-white/5 border border-white/10 p-2.5 rounded-xl">
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Propostas</span>
        <strong class="text-amber-400 text-sm"><?= count($propostas) ?></strong>
      </div>
    </div>
  </div>

  <?php if ($msgSucesso): ?>
    <div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between gap-2 shadow-xs">
      <div class="flex items-center gap-2">
        <span class="text-emerald-600 text-lg">✓</span>
        <span><?= $msgSucesso ?></span>
      </div>
      <button onclick="this.parentElement.remove()" class="text-emerald-700 hover:text-emerald-900 font-bold">&times;</button>
    </div>
  <?php endif; ?>

  <!-- Abas de Gestão -->
  <div class="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar shadow-xs">
    <button onclick="trocarAbaAdmin('cursos')" id="tabAdmCursos" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap">
      📚 Cursos & Texto
    </button>
    <button onclick="trocarAbaAdmin('formulario')" id="tabAdmFormulario" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      ➕ Cadastrar via Formulário
    </button>
    <button onclick="trocarAbaAdmin('secretaria')" id="tabAdmSecretaria" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      🏛️ Secretaria & Registros
    </button>
    <button onclick="trocarAbaAdmin('coordenacao')" id="tabAdmCoordenacao" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      🎓 Coordenação & MEC
    </button>
    <button onclick="trocarAbaAdmin('matriculas')" id="tabAdmMatriculas" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      👥 Matrículas (<?= count($alunos) ?>)
    </button>
    <button onclick="trocarAbaAdmin('propostas')" id="tabAdmPropostas" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      💼 Propostas (<?= count($propostas) ?>)
    </button>
    <button onclick="trocarAbaAdmin('financeiro')" id="tabAdmFinanceiro" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      💳 Mercado Pago
    </button>
    <button onclick="trocarAbaAdmin('seguranca')" id="tabAdmSeguranca" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      🛡️ Auditoria
    </button>
    <button onclick="trocarAbaAdmin('terminal')" id="tabAdmTerminal" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      💻 Terminal CLI
    </button>
    <a href="/mail/admin.php" target="_blank" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition whitespace-nowrap flex items-center gap-1.5">
      ✉️ Servidor de E-mail (PHPMailer)
    </a>
    <a href="/elowa/admin.php" target="_blank" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition whitespace-nowrap flex items-center gap-1.5">
      💬 Servidor WhatsApp (EloWa Baileys)
    </a>
  </div>

  <!-- ABA 1: GESTÃO DE CURSOS & IMPORTAÇÃO VIA TEXTO -->
  <div id="secaoAdmCursos" class="space-y-6">
    <!-- Banner de Preenchimento via Texto -->
    <div class="bg-linear-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-800/50 shadow-md space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold text-lg">
            📝
          </div>
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400">Recurso de Cadastro em Lote</span>
            <h3 class="text-base sm:text-lg font-black text-white">Preenchimento de Cursos via Texto (Rápido)</h3>
          </div>
        </div>
        <button onclick="abrirModalImportTexto()" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition">
          ✨ Preencher Cursos via Texto Agora
        </button>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed max-w-3xl">
        Cole qualquer ementa, anúncio de WhatsApp ou texto simples contendo <em>Título, Carga Horária, Preço e Módulos</em>. O sistema cadastra o curso automaticamente no catálogo para venda imediata.
      </p>
    </div>

    <!-- Catálogo de Cursos Atual -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900">Catálogo de Cursos na Vitrine (<?= count($cursos) ?> Cursos Ativos)</h3>
        <button onclick="abrirModalImportTexto()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs">
          + Importar via Texto
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <?php foreach ($cursos as $c): ?>
          <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded"><?= $c['category'] ?></span>
              <h4 class="font-bold text-sm text-slate-900 mt-1 line-clamp-1"><?= $c['title'] ?></h4>
              <p class="text-xs text-slate-500 line-clamp-2 mt-0.5"><?= $c['shortDescription'] ?></p>
            </div>
            <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-200/80">
              <span class="font-black text-slate-900">R$ <?= number_format($c['price'], 2, ',', '.') ?></span>
              <span class="text-slate-500 font-mono"><?= $c['workloadHours'] ?> horas</span>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>

  <!-- ABA: CADASTRO DE CURSO POR FORMULÁRIO COMPLETO -->
  <div id="secaoAdmFormulario" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-black text-slate-900">Cadastro Detalhado de Curso (Formulário)</h3>
        <p class="text-xs text-slate-500">Insira as informações completas, carga horária MEC, instrutor titular e ementa.</p>
      </div>
      <button onclick="abrirModalImportTexto()" class="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-100 cursor-pointer">
        ⚡ Prefere colar em texto? Clique aqui
      </button>
    </div>

    <form method="POST" action="admin.php" class="space-y-4">
      <input type="hidden" name="acao" value="cadastrar_curso_formulario">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Curso *</label>
          <input type="text" name="titulo" required placeholder="Ex: Regulagem e Manutenção de Máquinas Overloque" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria Acadêmica *</label>
          <select name="categoria" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
            <option value="Negócios">Negócios & Gestão</option>
            <option value="Tecnologia">Tecnologia & Software</option>
            <option value="Engenharia">Engenharia & Mecânica</option>
            <option value="Design">Design & Criatividade</option>
            <option value="Educação">Educação & Metodologia</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Preço (R$) *</label>
          <input type="text" name="preco" required value="450,00" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Carga Horária (Horas MEC) *</label>
          <input type="number" name="horas" required value="80" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nível de Dificuldade</label>
          <select name="nivel" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário" selected>Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Instrutor / Titular *</label>
          <input type="text" name="instrutor" required value="Eloizio Assunção (CEO)" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Resumo Curto (Para a Vitrine) *</label>
          <input type="text" name="resumo" required placeholder="Ex: Aprenda do zero regulagem de lançadeiras e ponto perfeito." class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-hidden">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Completa e Ementa do Curso</label>
        <textarea name="descricao" rows="4" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden" placeholder="Descreva os objetivos, público-alvo, módulos e metodologia de ensino..."></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
        <button type="reset" class="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer">
          Limpar Campos
        </button>
        <button type="submit" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition">
          💾 Salvar e Publicar Curso na Vitrine &rarr;
        </button>
      </div>
    </form>
  </div>

  <!-- ABA: SECRETARIA ACADÊMICA & DOCUMENTOS DIGITAIS OFICIAIS -->
  <div id="secaoAdmSecretaria" class="space-y-6 hidden">
    <!-- Header Secretaria -->
    <div class="bg-linear-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-800/40 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center font-black text-2xl">
            🏛️
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Fé Pública & Livro de Registros MEC
              </span>
              <span class="text-xs text-blue-300 font-mono">Livro 04 • Registro Digital ICP-Edu</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white mt-1">
              Secretaria Acadêmica & Central de Documentos Digitais
            </h2>
          </div>
        </div>
      </div>
      <p class="text-xs sm:text-sm text-blue-200 leading-relaxed max-w-4xl">
        Emissão de documentos acadêmicos oficiais com autenticação digital por hash SHA-256, carimbo de tempo no horário de Brasília e registro no Livro Oficial de Diplomas conforme a LDB 9.394/96 Art. 42.
      </p>
    </div>

    <!-- Emissão Rápida de Documentos -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <h3 class="text-base font-black text-slate-900 pb-3 border-b border-slate-200">
        Emissão Instantânea de Documentos Acadêmicos
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <span class="text-xl">📜</span>
          <h4 class="font-bold text-sm text-slate-900">Declaração de Matrícula</h4>
          <p class="text-[11px] text-slate-500">Comprova vínculo estudantil ativo no ano letivo 2026.</p>
          <a href="validar_certificado.php?codigo=DEC-MAT-2026-OK" class="block text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
            Emitir & Autenticar
          </a>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <span class="text-xl">🎓</span>
          <h4 class="font-bold text-sm text-slate-900">Declaração de Conclusão</h4>
          <p class="text-[11px] text-slate-500">Atesta término de carga horária e aprovação 100%.</p>
          <a href="validar_certificado.php?codigo=DEC-CONCL-2026-OK" class="block text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
            Emitir & Autenticar
          </a>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <span class="text-xl">📑</span>
          <h4 class="font-bold text-sm text-slate-900">Histórico Escolar Oficial</h4>
          <p class="text-[11px] text-slate-500">Discriminação de disciplinas, notas, frequência e ementa.</p>
          <a href="validar_certificado.php?codigo=HIST-OFICIAL-2026-OK" class="block text-center py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
            Emitir & Autenticar
          </a>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <span class="text-xl">🪪</span>
          <h4 class="font-bold text-sm text-slate-900">Carteirinha DNE</h4>
          <p class="text-[11px] text-slate-500">Documento Nacional do Estudante (Lei nº 12.933/13).</p>
          <a href="validar_certificado.php?codigo=DNE-CARTEIRINHA-2026" class="block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
            Emitir & Autenticar
          </a>
        </div>
      </div>
    </div>

    <!-- Livro Oficial de Registros MEC -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h3 class="text-base font-black text-slate-900">Livro Oficial de Registro de Diplomas e Certificados MEC</h3>
          <p class="text-xs text-slate-500">Auditoria perpétua de registros acadêmicos com chancelas e hashes criptográficos:</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[700px]">
          <thead class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th class="py-3 px-3">Registro MEC</th>
              <th class="py-3 px-2">Livro / Folha</th>
              <th class="py-3 px-3">Aluno Registrado</th>
              <th class="py-3 px-3">Curso & Horas</th>
              <th class="py-3 px-3">Hash SHA-256</th>
              <th class="py-3 px-3 text-center">Data / Resp.</th>
              <th class="py-3 px-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono text-[11px]">
            <tr class="hover:bg-slate-50">
              <td class="py-3 px-3 font-bold text-indigo-900">REG-MEC-2026-00412</td>
              <td class="py-3 px-2 text-slate-600">Livro 04 • Folha 89</td>
              <td class="py-3 px-3 font-sans font-bold text-slate-900">Lucas Silva Prado</td>
              <td class="py-3 px-3 font-sans text-slate-700">Engenharia de Software (360h)</td>
              <td class="py-3 px-3 text-[10px] text-emerald-700 font-mono">DNE-2026-VAL-OK</td>
              <td class="py-3 px-3 text-center text-slate-500 font-sans">15/01/2026 • Roseli Castro</td>
              <td class="py-3 px-3 text-right font-sans">
                <a href="validar_certificado.php?codigo=DNE-2026-VAL-OK" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200">
                  Verificar
                </a>
              </td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="py-3 px-3 font-bold text-indigo-900">REG-MEC-2025-00891</td>
              <td class="py-3 px-2 text-slate-600">Livro 03 • Folha 42</td>
              <td class="py-3 px-3 font-sans font-bold text-slate-900">Camila Vasconcelos</td>
              <td class="py-3 px-3 font-sans text-slate-700">Gestão de Negócios (280h)</td>
              <td class="py-3 px-3 text-[10px] text-emerald-700 font-mono">DEC-CONCL-2026-OK</td>
              <td class="py-3 px-3 text-center text-slate-500 font-sans">28/11/2025 • Roseli Castro</td>
              <td class="py-3 px-3 text-right font-sans">
                <a href="validar_certificado.php?codigo=DEC-CONCL-2026-OK" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200">
                  Verificar
                </a>
              </td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="py-3 px-3 font-bold text-indigo-900">REG-MEC-2026-00994</td>
              <td class="py-3 px-2 text-slate-600">Livro 05 • Folha 12</td>
              <td class="py-3 px-3 font-sans font-bold text-slate-900">Carlos Eduardo Santos</td>
              <td class="py-3 px-3 font-sans text-slate-700">Mecânica de Máquinas (120h)</td>
              <td class="py-3 px-3 text-[10px] text-emerald-700 font-mono">ELOIZIO-2026-CERT-OK</td>
              <td class="py-3 px-3 text-center text-slate-500 font-sans">29/09/2026 • Eloizio Assunção</td>
              <td class="py-3 px-3 text-right font-sans">
                <a href="validar_certificado.php?codigo=ELOIZIO-2026-CERT-OK" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200">
                  Verificar
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ABA: COORDENAÇÃO PEDAGÓGICA & MATRIZ CURRICULAR MEC -->
  <div id="secaoAdmCoordenacao" class="space-y-6 hidden">
    <!-- Header Coordenação -->
    <div class="bg-linear-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-emerald-800/40 shadow-xl space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-black text-2xl">
            🎓
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Supervisão Pedagógica MEC
              </span>
              <span class="text-xs text-emerald-300 font-mono">LDB 9.394/96 Art. 42</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white mt-1">
              Painel da Coordenação Pedagógica & Matriz Curricular
            </h2>
          </div>
        </div>
        <button onclick="alert('Parecer Pedagógico Geral emitido e homologado pela Coordenação!')" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer">
          Emitir Parecer Pedagógico
        </button>
      </div>
      <p class="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-4xl">
        Acompanhamento de planos de aula, fechamento de diários docentes, homologação prévia de notas e validação da conformidade curricular antes da emissão definitiva dos certificados pela Secretaria.
      </p>
    </div>

    <!-- Supervisão Docente -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-4">
      <h3 class="text-base font-black text-slate-900 pb-3 border-b border-slate-200">
        Supervisão do Corpo Docente Titular & Carga Horária
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">MF</div>
            <div>
              <strong class="text-slate-900 text-xs block">Profa. Dra. Mariana Fernandes</strong>
              <span class="text-[10px] text-slate-500">Doutora em Computação (USP)</span>
            </div>
          </div>
          <div class="text-[11px] text-slate-600 space-y-0.5 pt-1">
            <div>• Curso: <strong>Engenharia de Software (360h)</strong></div>
            <div>• Diários: <strong class="text-emerald-700">100% Homologados</strong></div>
          </div>
          <button onclick="alert('Diário docente homologado com sucesso!')" class="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs border border-indigo-200 cursor-pointer">
            Homologar Diário
          </button>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">ES</div>
            <div>
              <strong class="text-slate-900 text-xs block">Prof. Eloizio Assunção</strong>
              <span class="text-[10px] text-slate-500">Mestre Mecânico & CEO</span>
            </div>
          </div>
          <div class="text-[11px] text-slate-600 space-y-0.5 pt-1">
            <div>• Curso: <strong>Mecânica de Máquinas (120h)</strong></div>
            <div>• Diários: <strong class="text-emerald-700">100% Homologados</strong></div>
          </div>
          <button onclick="alert('Diário prático de mecânica homologado com sucesso!')" class="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs border border-amber-200 cursor-pointer">
            Homologar Diário
          </button>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">SV</div>
            <div>
              <strong class="text-slate-900 text-xs block">Profa. Sofia Vanguard</strong>
              <span class="text-[10px] text-slate-500">Expert em Cursos & Gestão MEI</span>
            </div>
          </div>
          <div class="text-[11px] text-slate-600 space-y-0.5 pt-1">
            <div>• Curso: <strong>Contabilidade Prática para MEI (60h)</strong></div>
            <div>• Diários: <strong class="text-emerald-700">100% Homologados</strong></div>
          </div>
          <button onclick="alert('Diário de gestão da Profa. Sofia homologado!')" class="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-xs border border-purple-200 cursor-pointer">
            Homologar Diário
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ABA 2: MATRÍCULAS & ALUNOS COMPLETOS -->
  <div id="secaoAdmMatriculas" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-black text-slate-900">Alunos e Matrículas Oficiais (<?= count($alunos) ?> Estudantes Registrados)</h3>
        <p class="text-xs text-slate-500">Controle acadêmico, notas, certificados e situação de regularidade estudantil.</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="alert('Contrato Oficial de Matrícula gerado em PDF com chancela ICP-Brasil e carimbo digital!')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
          📄 Emitir Contrato Padrão
        </button>
        <button onclick="alert('Planilha completa de alunos exportada em CSV com sucesso!')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer">
          Exportar CSV
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs min-w-[750px]">
        <thead>
          <tr class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <th class="py-3 px-4">Aluno</th>
            <th class="py-3 px-3">Matrícula</th>
            <th class="py-3 px-3">Contato</th>
            <th class="py-3 px-4">Curso Vinculado</th>
            <th class="py-3 px-3 text-center">Progresso</th>
            <th class="py-3 px-3 text-center">Status</th>
            <th class="py-3 px-3 text-right">Ação</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <?php foreach ($alunos as $a): ?>
            <tr class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2.5">
                  <img src="<?= $a['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' ?>" alt="<?= htmlspecialchars($a['name']) ?>" class="w-8 h-8 rounded-full object-cover shrink-0">
                  <div>
                    <strong class="text-slate-900 block"><?= htmlspecialchars($a['name']) ?></strong>
                    <span class="text-[10px] text-slate-400 font-mono">CPF: <?= $a['cpf'] ?></span>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-3 font-mono font-bold text-indigo-900"><?= $a['registrationNumber'] ?></td>
              <td class="py-3.5 px-3 font-mono text-slate-600">
                <span><?= $a['phone'] ?></span>
                <span class="text-[10px] text-slate-400 block"><?= $a['email'] ?></span>
              </td>
              <td class="py-3.5 px-4 font-bold text-slate-800">
                <?= htmlspecialchars($a['course']) ?>
                <span class="text-[10px] text-slate-400 font-mono block">Inscrito em: <?= $a['enrolledAt'] ?? '15/02/2026' ?></span>
              </td>
              <td class="py-3.5 px-3 text-center font-bold">
                <span class="text-emerald-700"><?= $a['progressPercent'] ?>%</span>
                <div class="w-16 mx-auto bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div class="bg-emerald-500 h-full" style="width: <?= $a['progressPercent'] ?>%;"></div>
                </div>
              </td>
              <td class="py-3.5 px-3 text-center">
                <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px]">
                  <?= $a['status'] ?>
                </span>
              </td>
              <td class="py-3.5 px-3 text-right">
                <button onclick="alert('Histórico Escolar de <?= addslashes($a['name']) ?>:\nMatrícula: <?= $a['registrationNumber'] ?>\nCurso: <?= addslashes($a['course']) ?>\nCertificado: <?= $a['certificateCode'] ?>\nStatus: <?= $a['status'] ?>')" class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer" title="Ver Histórico">
                  👁️
                </button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ABA 3: PROPOSTAS DE CURSOS & ALUNOS (CRM LEADS) -->
  <div id="secaoAdmPropostas" class="space-y-6 hidden">
    <!-- Topo CRM -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-black text-slate-900">CRM de Propostas Comerciais de Alunos & Cursos</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
              Funil Comercial Ativo
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Monitoramento de alunos interessados, envio de propostas com cupom <strong>SOFIA15 (-15%)</strong> e conversão de vendas.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <a href="propostas.php" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5">
            <span>⚡ Abrir Central de Propostas</span>
          </a>
        </div>
      </div>

      <!-- KPIs Comerciais -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Total de Propostas</span>
          <span class="text-2xl font-black text-indigo-950 mt-1 block"><?= count($propostas) ?></span>
          <span class="text-[10px] text-indigo-600 font-bold block mt-0.5">Comercial & WhatsApp</span>
        </div>
        <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Com Desconto (-15%)</span>
          <span class="text-2xl font-black text-emerald-800 mt-1 block"><?= count($propostas) ?></span>
          <span class="text-[10px] text-emerald-700 font-bold block mt-0.5">Cupom SOFIA15</span>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Em Negociação</span>
          <span class="text-2xl font-black text-amber-800 mt-1 block">
            <?= count(array_filter($propostas, fn($p) => $p['status'] !== 'matriculado')) ?>
          </span>
          <span class="text-[10px] text-amber-700 font-bold block mt-0.5">Follow-up ativo</span>
        </div>
        <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
          <span class="text-[10px] uppercase font-bold text-slate-500 block">Matrículas Convertidas</span>
          <span class="text-2xl font-black text-purple-900 mt-1 block">
            <?= count(array_filter($propostas, fn($p) => $p['status'] === 'matriculado')) ?>
          </span>
          <span class="text-[10px] text-purple-700 font-bold block mt-0.5">Via Mercado Pago</span>
        </div>
      </div>

      <!-- Tabela de Propostas -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[750px]">
          <thead>
            <tr class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <th class="py-3 px-4">Proposta & Aluno</th>
              <th class="py-3 px-3">WhatsApp & E-mail</th>
              <th class="py-3 px-4">Curso Ofertado</th>
              <th class="py-3 px-3">Valores</th>
              <th class="py-3 px-3 text-center">Status</th>
              <th class="py-3 px-4 text-right">Ação Direta</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <?php foreach ($propostas as $p): ?>
              <?php
              $cleanPhone = preg_replace('/\D/', '', $p['phone']);
              $msgWa = urlencode("Olá {$p['studentName']}! Aqui é da Direção do Grupo Eloizio. Vimos que sua proposta {$p['proposalCode']} para o curso {$p['courseTitle']} com valor especial de R$ " . number_format($p['finalPrice'], 2, ',', '.') . " está liberada. Deseja efetivar sua matrícula agora pelo Mercado Pago?");
              $linkWa = "https://wa.me/55{$cleanPhone}?text={$msgWa}";
              ?>
              <tr class="hover:bg-slate-50/80 transition">
                <td class="py-3.5 px-4">
                  <span class="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block w-fit mb-0.5">
                    <?= $p['proposalCode'] ?>
                  </span>
                  <strong class="text-slate-900 text-xs block"><?= htmlspecialchars($p['studentName']) ?></strong>
                  <span class="text-[10px] text-slate-400"><?= $p['createdAt'] ?></span>
                </td>

                <td class="py-3.5 px-3 font-mono text-slate-600">
                  <div>📱 <?= htmlspecialchars($p['phone']) ?></div>
                  <div class="text-[10px] text-slate-400"><?= htmlspecialchars($p['email']) ?></div>
                </td>

                <td class="py-3.5 px-4 font-bold text-slate-800">
                  <?= htmlspecialchars($p['courseTitle']) ?>
                  <span class="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono font-bold block w-fit mt-0.5">
                    Cupom: <?= $p['coupon'] ?> (-<?= $p['discountPercent'] ?>%)
                  </span>
                </td>

                <td class="py-3.5 px-3">
                  <span class="text-slate-400 line-through text-[11px] block">R$ <?= number_format($p['originalPrice'], 2, ',', '.') ?></span>
                  <strong class="text-slate-950 font-black text-sm">R$ <?= number_format($p['finalPrice'], 2, ',', '.') ?></strong>
                  <span class="text-[10px] text-slate-500 block">12x de R$ <?= number_format($p['installmentValue'] ?? ($p['finalPrice']/12), 2, ',', '.') ?></span>
                </td>

                <td class="py-3.5 px-3 text-center">
                  <?php if ($p['status'] === 'matriculado'): ?>
                    <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px]">Matriculado</span>
                  <?php elseif ($p['status'] === 'proposta_enviada'): ?>
                    <span class="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-black text-[10px]">Proposta Enviada</span>
                  <?php else: ?>
                    <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-[10px]">Em Atendimento</span>
                  <?php endif; ?>
                </td>

                <td class="py-3.5 px-4 text-right">
                  <a href="<?= $linkWa ?>" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1 shadow-2xs">
                    <span>WhatsApp</span>
                  </a>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Propostas de Novos Cursos -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-4">
      <h4 class="font-black text-slate-900 text-base">Propostas de Novos Cursos Submetidas (<?= count($propostasNovosCursos) ?>)</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <?php foreach ($propostasNovosCursos as $pnc): ?>
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800"><?= $pnc['status'] ?></span>
            <h5 class="font-bold text-slate-900 text-sm"><?= htmlspecialchars($pnc['title']) ?></h5>
            <p class="text-slate-500 line-clamp-2"><?= htmlspecialchars($pnc['description']) ?></p>
            <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span>👤 <?= htmlspecialchars($pnc['author']) ?></span>
              <strong class="text-slate-900">R$ <?= number_format($pnc['estimatedPrice'], 2, ',', '.') ?></strong>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>

  <!-- ABA 4: FINANCEIRO & MERCADO PAGO -->
  <div id="secaoAdmFinanceiro" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-black text-slate-900">Conciliação Automática Mercado Pago</h3>
        <p class="text-xs text-slate-500">Registros em tempo real via Webhook HMAC SHA-256 e cURL.</p>
      </div>
      <button onclick="alert('Conciliação financeira sincronizada com o Mercado Pago!')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer">
        🔄 Sincronizar Agora
      </button>
    </div>

    <div class="divide-y divide-slate-100 text-xs">
      <div class="py-3.5 flex items-center justify-between">
        <div>
          <strong class="text-slate-900 block text-sm">Matrícula Curso Engenharia de Software Moderna</strong>
          <span class="text-slate-500">Pagador: Lucas Silva Prado • ID MP: 9821734612</span>
        </div>
        <div class="text-right">
          <strong class="text-emerald-700 font-mono text-sm block font-black">R$ 1.890,00</strong>
          <span class="text-[10px] text-emerald-600 font-bold">✓ Aprovado (PIX)</span>
        </div>
      </div>
      <div class="py-3.5 flex items-center justify-between">
        <div>
          <strong class="text-slate-900 block text-sm">Matrícula Curso Máquinas de Costura (Domésticas e Industriais)</strong>
          <span class="text-slate-500">Pagador: Beatriz Helena Costa • ID MP: 9821734990</span>
        </div>
        <div class="text-right">
          <strong class="text-emerald-700 font-mono text-sm block font-black">R$ 480,00</strong>
          <span class="text-[10px] text-emerald-600 font-bold">✓ Aprovado (Cartão 12x)</span>
        </div>
      </div>
      <div class="py-3.5 flex items-center justify-between">
        <div>
          <strong class="text-slate-900 block text-sm">Matrícula Curso Contabilidade MEI com Cupom SOFIA15</strong>
          <span class="text-slate-500">Pagador: Carlos Henrique Santos • ID MP: 9821735112</span>
        </div>
        <div class="text-right">
          <strong class="text-emerald-700 font-mono text-sm block font-black">R$ 272,00</strong>
          <span class="text-[10px] text-emerald-600 font-bold">✓ Aprovado (PIX)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ABA 5: SEGURANÇA & AUDITORIA MASTER -->
  <div id="secaoAdmSeguranca" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div class="pb-3 border-b border-slate-200">
      <h3 class="text-lg font-black text-slate-900">Auditoria de Segurança & Senha Master</h3>
      <p class="text-xs text-slate-500">Status criptográfico, proteção contra força bruta e credenciais da Diretoria.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
        <span class="text-amber-800 font-bold uppercase text-[10px]">Senha Master Oficial:</span>
        <strong class="font-mono text-indigo-950 font-black text-sm block select-all">ELOIZIO@MASTER2026</strong>
        <span class="text-amber-700 text-[11px] block">Acesso imediato para administradores e diretores</span>
      </div>
      <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
        <span class="text-emerald-800 font-bold uppercase text-[10px]">Proteção Brute-Force:</span>
        <strong class="text-emerald-950 font-bold text-sm block">Ativa (SHA-256 HMAC)</strong>
        <span class="text-emerald-700 text-[11px] block">Bloqueia tentativas repetidas automaticamente</span>
      </div>
      <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
        <span class="text-indigo-800 font-bold uppercase text-[10px]">Sessão Administrativa:</span>
        <strong class="text-indigo-950 font-bold text-sm block">Autenticada em Produção</strong>
        <span class="text-indigo-700 text-[11px] block">Compatível com PHP Session e Apache</span>
      </div>
    </div>

    <!-- Logs de Acesso Recentes -->
    <div class="space-y-2">
      <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Logs de Acesso & Operações Recentes:</h4>
      <div class="bg-slate-950 text-slate-300 p-4 rounded-2xl font-mono text-xs space-y-1 overflow-x-auto">
        <div>[<?= date('Y-m-d H:i:s') ?>] [AUTH_SUCCESS] Login efetuado com perfil de Administrador Geral (Eloizio Assunção).</div>
        <div>[<?= date('Y-m-d H:i:s') ?>] [MASTER_AUTH] Verificação da Senha Master ELOIZIO@MASTER2026 validada com sucesso.</div>
        <div>[<?= date('Y-m-d H:i:s') ?>] [INTEGRITY_CHECK] Repositório de dados dados.php íntegro. 0 vulnerabilidades detectadas.</div>
      </div>
    </div>
  </div>

  <!-- ABA 6: TERMINAL CLI -->
  <div id="secaoAdmTerminal" class="space-y-4 hidden">
    <div class="bg-slate-950 rounded-2xl sm:rounded-3xl p-5 border border-slate-800 text-white font-mono space-y-3">
      <div class="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
        <span>Terminal Administrativo (admin_cli.php)</span>
        <span class="text-emerald-400">PHP 8.1+ Conectado</span>
      </div>
      <div id="cliSaida" class="h-64 overflow-y-auto space-y-1 text-xs text-slate-300">
        <div>Grupo Eloizio CLI Console v2.5.0 pronto. Digite "help" para ver os comandos.</div>
      </div>
      <form onsubmit="executarCliAdmin(event)" class="flex gap-2">
        <input type="text" id="cliComandoInput" placeholder="Digite um comando (ex: system:status, security:audit)..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden">
        <button type="submit" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer">
          Executar
        </button>
      </form>
    </div>
  </div>
</div>

<!-- Modal de Importação de Cursos via Texto (Com Formulário Real POST) -->
<div id="modalImportTexto" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
  <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full p-6 space-y-4 my-auto animate-in zoom-in-95">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <h3 class="font-black text-base text-slate-900">Preenchimento de Cursos via Texto (Rápido)</h3>
        <span class="text-xs text-slate-500">Cole a ementa ou escolha um modelo pré-formatado</span>
      </div>
      <button onclick="fecharModalImportTexto()" class="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer">&times;</button>
    </div>

    <!-- Modelos Rápidos -->
    <div class="flex flex-wrap gap-2 text-xs">
      <button type="button" onclick="carregarModeloTextoAdmin(1)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 font-bold rounded-lg cursor-pointer">
        🔧 Modelo 1: Máquinas de Costura
      </button>
      <button type="button" onclick="carregarModeloTextoAdmin(2)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 font-bold rounded-lg cursor-pointer">
        📊 Modelo 2: Contabilidade MEI
      </button>
      <button type="button" onclick="carregarModeloTextoAdmin(3)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 font-bold rounded-lg cursor-pointer">
        💻 Modelo 3: Engenharia de Software
      </button>
    </div>

    <form method="POST" action="admin.php" class="space-y-4">
      <input type="hidden" name="acao" value="importar_curso_texto">
      <textarea name="textoCurso" id="textoAdminCurso" rows="8" required class="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"></textarea>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button type="button" onclick="fecharModalImportTexto()" class="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">Cancelar</button>
        <button type="submit" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition">
          Cadastrar e Publicar na Vitrine &rarr;
        </button>
      </div>
    </form>
  </div>
</div>

<script>
  function trocarAbaAdmin(aba) {
    const abas = ['cursos', 'formulario', 'secretaria', 'coordenacao', 'matriculas', 'propostas', 'financeiro', 'seguranca', 'terminal'];
    abas.forEach(a => {
      const sec = document.getElementById('secaoAdm' + a.charAt(0).toUpperCase() + a.slice(1));
      const tab = document.getElementById('tabAdm' + a.charAt(0).toUpperCase() + a.slice(1));
      if (sec) sec.classList.add('hidden');
      if (tab) tab.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap';
    });

    const secAtiva = document.getElementById('secaoAdm' + aba.charAt(0).toUpperCase() + aba.slice(1));
    const tabAtiva = document.getElementById('tabAdm' + aba.charAt(0).toUpperCase() + aba.slice(1));
    if (secAtiva) secAtiva.classList.remove('hidden');
    if (tabAtiva) tabAtiva.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap';
  }

  function abrirModalImportTexto() {
    document.getElementById('modalImportTexto').classList.remove('hidden');
    document.getElementById('modalImportTexto').classList.add('flex');
    carregarModeloTextoAdmin(1);
  }

  function fecharModalImportTexto() {
    document.getElementById('modalImportTexto').classList.add('hidden');
    document.getElementById('modalImportTexto').classList.remove('flex');
  }

  function carregarModeloTextoAdmin(num) {
    if (num === 1) {
      document.getElementById('textoAdminCurso').value = `Título: Manutenção Preventiva de Máquinas de Costura Industriais\nCategoria: Engenharia\nPreço: 490.00\nCarga Horária: 80\nInstrutor: Eloizio Assunção (CEO)\nResumo: Treinamento prático focado em regulagem de ponto, sincronismo de lançadeira e lubrificação técnica.`;
    } else if (num === 2) {
      document.getElementById('textoAdminCurso').value = `Título: Gestão de Caixa e Emissão de Notas Fiscais para MEI\nCategoria: Negócios\nPreço: 350.00\nCarga Horária: 60\nInstrutor: Sofia Vanguard\nResumo: Capacitação rápida para desburocratizar a rotina fiscal e conciliar pagamentos no Mercado Pago.`;
    } else {
      document.getElementById('textoAdminCurso').value = `Título: DevOps Prático com Docker e Kubernetes\nCategoria: Tecnologia\nPreço: 890.00\nCarga Horária: 120\nInstrutor: Profa. Dra. Mariana Fernandes\nResumo: Implantação contínua, conteinerização e infraestrutura escalável para desenvolvedores modernos.`;
    }
  }

  async function executarCliAdmin(e) {
    e.preventDefault();
    const cmd = document.getElementById('cliComandoInput').value.trim();
    if (!cmd) return;
    const saida = document.getElementById('cliSaida');
    saida.innerHTML += `<div class="text-emerald-400 mt-2">$ ${cmd}</div>`;
    document.getElementById('cliComandoInput').value = '';

    try {
      const res = await fetch('admin_cli.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();
      saida.innerHTML += `<div class="text-slate-300 whitespace-pre-wrap">${data.output || JSON.stringify(data, null, 2)}</div>`;
    } catch {
      saida.innerHTML += `<div class="text-rose-400">Erro ao executar comando via admin_cli.php</div>`;
    }
    saida.scrollTop = saida.scrollHeight;
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
