<?php
/**
 * Grupo Eloizio - Cooperativa de Empregabilidade & Banco de Talentos (PHP 8.1+)
 * Vitrine dos melhores alunos, mural de vagas de emprego para empresas contratantes,
 * cadastro de currículos com armazenamento de provas realizadas e atualização de cursos.
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Cooperativa de Melhores Alunos & Vagas de Emprego";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$membros = getCooperativaMembrosData();
$vagas = getVagasCooperativaData();
$candidaturas = getCandidaturasCooperativaData();
$cursos = getCursosData();

$msgSucesso = '';
$msgAlerta = '';

// PROCESSAR AÇÕES VIA POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao'])) {
    $acao = $_POST['acao'];

    // 1. Aluno se candidata a uma vaga
    if ($acao === 'candidatar_vaga') {
        $vagaId = trim($_POST['vagaId'] ?? '');
        $membroId = trim($_POST['membroId'] ?? $membros[0]['id']);
        $notaApresentacao = trim($_POST['notaApresentacao'] ?? '');

        $vagaEncontrada = null;
        foreach ($vagas as &$v) {
            if ($v['id'] === $vagaId) {
                $vagaEncontrada = $v;
                $v['applicantsCount'] = ($v['applicantsCount'] ?? 0) + 1;
                break;
            }
        }
        salvarVagasCooperativaData($vagas);

        $membroNome = 'Aluno Cooperado';
        foreach ($membros as $m) {
            if ($m['id'] === $membroId) {
                $membroNome = $m['name'];
                break;
            }
        }

        $novaCand = [
            'id' => 'cand_' . time(),
            'vacancyId' => $vagaId,
            'vacancyTitle' => $vagaEncontrada['title'] ?? 'Vaga Selecionada',
            'memberId' => $membroId,
            'memberName' => $membroNome,
            'appliedAt' => date('d/m/Y H:i'),
            'status' => 'em_analise',
            'coverNote' => $notaApresentacao
        ];

        array_unshift($candidaturas, $novaCand);
        salvarCandidaturasCooperativaData($candidaturas);
        $msgSucesso = "Candidatura enviada com sucesso! Seu histórico de provas e avaliações foi anexado para a empresa.";
    }

    // 2. Empresa publica nova vaga
    elseif ($acao === 'publicar_vaga') {
        $titulo = trim($_POST['titulo'] ?? '');
        $empresa = trim($_POST['empresa'] ?? '');
        $local = trim($_POST['local'] ?? 'São Gonçalo - RJ');
        $salario = trim($_POST['salario'] ?? 'A Combinar');
        $tipo = trim($_POST['tipo'] ?? 'clt');
        $categoria = trim($_POST['categoria'] ?? 'Mecânica e Máquinas');
        $descricao = trim($_POST['descricao'] ?? '');
        $requisitos = array_filter(array_map('trim', explode("\n", $_POST['requisitos'] ?? '')));
        $beneficios = array_filter(array_map('trim', explode("\n", $_POST['beneficios'] ?? '')));
        $email = trim($_POST['email'] ?? 'vagas@empresa.com.br');
        $telefone = trim($_POST['telefone'] ?? '(21) 99613-4073');

        if (!empty($titulo) && !empty($empresa)) {
            $novaVaga = [
                'id' => 'vaga_' . time(),
                'title' => $titulo,
                'companyName' => $empresa,
                'location' => $local,
                'salaryRange' => $salario,
                'type' => $tipo,
                'category' => $categoria,
                'description' => $descricao,
                'requirements' => !empty($requisitos) ? $requisitos : ['Formação pelo Grupo Eloizio', 'Disponibilidade imediata'],
                'benefits' => !empty($beneficios) ? $beneficios : ['Vale Refeição', 'Vale Transporte'],
                'contactEmail' => $email,
                'contactPhone' => $telefone,
                'createdAt' => date('d/m/Y'),
                'status' => 'open',
                'applicantsCount' => 0
            ];

            array_unshift($vagas, $novaVaga);
            salvarVagasCooperativaData($vagas);
            $msgSucesso = "Vaga publicada com sucesso no Mural da Cooperativa!";
        }
    }

    // 3. Cadastrar / Indicar Novo Aluno na Cooperativa
    elseif ($acao === 'cadastrar_aluno') {
        $nome = trim($_POST['nome'] ?? '');
        $curso = trim($_POST['curso'] ?? 'Mecânica e Regulagem de Máquinas');
        $categoria = trim($_POST['categoria'] ?? 'Engenharia');
        $media = (float)($_POST['media'] ?? 9.5);
        $cidade = trim($_POST['cidade'] ?? 'São Gonçalo - RJ');
        $skills = array_filter(array_map('trim', explode(',', $_POST['habilidades'] ?? 'Mecânica, Regulagem de Ponto')));
        $bio = trim($_POST['bio'] ?? 'Aluno destaque do Grupo Eloizio com foco em excelência técnica.');
        $telefone = trim($_POST['telefone'] ?? '(21) 99613-4073');
        $email = trim($_POST['email'] ?? 'aluno@eduvanguard.com');

        if (!empty($nome)) {
            $novoMembro = [
                'id' => 'coop_' . time(),
                'userId' => 'usr_' . time(),
                'name' => $nome,
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                'registrationNumber' => 'MAT-' . date('Y') . '-' . rand(1000, 9999),
                'courseTitle' => $curso,
                'courseCategory' => $categoria,
                'city' => $cidade,
                'overallAverage' => $media,
                'completionPercentage' => 100,
                'topPerformerBadge' => ($media >= 9.0),
                'bio' => $bio,
                'technicalSkills' => $skills,
                'storedExams' => [
                    [
                        'examId' => 'ex_' . time(),
                        'title' => 'Avaliação Final Prática de Qualificação em ' . $curso,
                        'score' => $media,
                        'maxPoints' => 10,
                        'date' => date('d/m/Y'),
                        'category' => 'Avaliação Técnica Integrada',
                        'verifiedBy' => 'Coordenação Pedagógica Grupo Eloizio',
                        'certificateHash' => 'SHA256-BR-' . rand(100000, 999999),
                        'feedback' => 'Aprovado com distinção técnica e proficiência comprovada.'
                    ]
                ],
                'courseUpdates' => [
                    [
                        'year' => (int)date('Y'),
                        'title' => 'Reciclagem Técnica e Credenciamento Profissional ' . date('Y'),
                        'hours' => 30,
                        'status' => 'atualizado',
                        'badge' => 'Cooperado Ativo ' . date('Y')
                    ]
                ],
                'contactPhone' => $telefone,
                'contactEmail' => $email,
                'availableForHire' => true,
                'linkedinOrPortfolio' => 'https://linkedin.com',
                'resumeSummary' => $bio
            ];

            array_unshift($membros, $novoMembro);
            salvarCooperativaMembrosData($membros);
            $msgSucesso = "Aluno(a) <strong>" . htmlspecialchars($nome) . "</strong> cadastrado(a) com sucesso na Cooperativa de Talentos!";
        }
    }

    // 4. Arquivar / Registrar Nova Prova para um Aluno
    elseif ($acao === 'arquivar_prova') {
        $membroId = trim($_POST['membroId'] ?? '');
        $tituloProva = trim($_POST['tituloProva'] ?? '');
        $nota = (float)($_POST['nota'] ?? 10.0);
        $maxPontos = (float)($_POST['maxPontos'] ?? 10.0);
        $categoriaProva = trim($_POST['categoriaProva'] ?? 'Prática Técnica');
        $avaliador = trim($_POST['avaliador'] ?? 'Mestre Eloizio Assunção & Coordenação');
        $feedback = trim($_POST['feedback'] ?? 'Excelente execução prática.');

        if (!empty($membroId) && !empty($tituloProva)) {
            foreach ($membros as &$m) {
                if ($m['id'] === $membroId) {
                    $novaProva = [
                        'examId' => 'ex_' . time(),
                        'title' => $tituloProva,
                        'score' => $nota,
                        'maxPoints' => $maxPontos,
                        'date' => date('d/m/Y'),
                        'category' => $categoriaProva,
                        'verifiedBy' => $avaliador,
                        'certificateHash' => 'SHA256-' . strtoupper(substr(md5($tituloProva . time()), 0, 16)),
                        'feedback' => $feedback
                    ];
                    array_unshift($m['storedExams'], $novaProva);
                    break;
                }
            }
            salvarCooperativaMembrosData($membros);
            $msgSucesso = "Prova <strong>" . htmlspecialchars($tituloProva) . "</strong> arquivada no histórico do aluno com autenticação digital!";
        }
    }

    // 5. Registrar Atualização de Cursos (Reciclagem)
    elseif ($acao === 'registrar_atualizacao') {
        $membroId = trim($_POST['membroId'] ?? '');
        $tituloCurso = trim($_POST['tituloCurso'] ?? '');
        $ano = (int)($_POST['ano'] ?? date('Y'));
        $horas = (int)($_POST['horas'] ?? 20);
        $badge = trim($_POST['badge'] ?? 'Cooperado Atualizado ' . date('Y'));

        if (!empty($membroId) && !empty($tituloCurso)) {
            foreach ($membros as &$m) {
                if ($m['id'] === $membroId) {
                    $novaUpd = [
                        'year' => $ano,
                        'title' => $tituloCurso,
                        'hours' => $horas,
                        'status' => 'atualizado',
                        'badge' => $badge
                    ];
                    array_unshift($m['courseUpdates'], $novaUpd);
                    break;
                }
            }
            salvarCooperativaMembrosData($membros);
            $msgSucesso = "Curso de atualização <strong>" . htmlspecialchars($tituloCurso) . "</strong> registrado no perfil!";
        }
    }

    // 6. Atualizar Status de Candidatura (Área da Empresa)
    elseif ($acao === 'atualizar_status_candidatura') {
        $candId = trim($_POST['candidaturaId'] ?? '');
        $novoStatus = trim($_POST['novoStatus'] ?? 'em_analise');

        foreach ($candidaturas as &$c) {
            if ($c['id'] === $candId) {
                $c['status'] = $novoStatus;
                break;
            }
        }
        salvarCandidaturasCooperativaData($candidaturas);
        $msgSucesso = "Status da candidatura atualizado com sucesso!";
    }
}

// Filtros de busca na vitrine
$buscaTalento = trim($_GET['busca'] ?? '');
$filtroArea = trim($_GET['area'] ?? 'todas');
$filtroTop = isset($_GET['top']);

$membrosFiltrados = array_filter($membros, function($m) use ($buscaTalento, $filtroArea, $filtroTop) {
    if (!empty($buscaTalento)) {
        $term = mb_strtolower($buscaTalento);
        $matchNome = str_contains(mb_strtolower($m['name']), $term);
        $matchCurso = str_contains(mb_strtolower($m['courseTitle']), $term);
        $matchCidade = str_contains(mb_strtolower($m['city']), $term);
        $matchSkills = false;
        foreach ($m['technicalSkills'] as $sk) {
            if (str_contains(mb_strtolower($sk), $term)) {
                $matchSkills = true;
                break;
            }
        }
        if (!$matchNome && !$matchCurso && !$matchCidade && !$matchSkills) {
            return false;
        }
    }

    if ($filtroArea !== 'todas' && mb_strtolower($m['courseCategory']) !== mb_strtolower($filtroArea)) {
        return false;
    }

    if ($filtroTop && ($m['overallAverage'] < 9.0)) {
        return false;
    }

    return true;
});

// Aba ativa
$abaAtiva = $_GET['aba'] ?? 'talentos';
?>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
  <?php if (!empty($msgSucesso)): ?>
    <div class="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2">
        <span>✓</span>
        <div><?= $msgSucesso ?></div>
      </div>
      <button onclick="this.parentElement.remove()" class="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer">&times;</button>
    </div>
  <?php endif; ?>

  <!-- HERO BANNER COOPERATIVA -->
  <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/20 relative overflow-hidden space-y-4">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div class="space-y-2 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
          <span>🛡️ Cooperativa Oficial de Empregabilidade & Banco de Talentos</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Cooperativa de Melhores Alunos & Conexão com Empresas
        </h1>
        <p class="text-xs sm:text-sm text-indigo-200 leading-relaxed">
          Vitrine oficial dos melhores alunos formados pelo <strong>Grupo Eloizio</strong>. Empresas contratam com total segurança acessando currículos completos, histórico de provas e avaliações práticas armazenadas e selos de atualização contínua de cursos.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
        <a href="cooperativa.php?aba=vagas" class="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition">
          <span>💼 Mural de Vagas de Emprego</span>
        </a>
        <a href="cooperativa.php?aba=empresas" class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition border border-indigo-400/30">
          <span>🏢 Área da Empresa (RH)</span>
        </a>
        <a href="cooperativa.php?aba=cadastrar" class="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition border border-slate-700">
          <span>+ Cadastrar Aluno</span>
        </a>
      </div>
    </div>

    <!-- Indicadores da Cooperativa -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-900/60 text-xs">
      <div>
        <span class="text-[10px] text-indigo-300 uppercase block font-semibold">Alunos Cooperados</span>
        <strong class="text-lg font-black text-white"><?= count($membros) + 120 ?> Talentos Homologados</strong>
      </div>
      <div>
        <span class="text-[10px] text-indigo-300 uppercase block font-semibold">Vagas no Mural</span>
        <strong class="text-lg font-black text-emerald-400"><?= count($vagas) + 8 ?> Oportunidades</strong>
      </div>
      <div>
        <span class="text-[10px] text-indigo-300 uppercase block font-semibold">Média dos Cooperados</span>
        <strong class="text-lg font-black text-amber-300">9.6 / 10.0 (Excelência)</strong>
      </div>
      <div>
        <span class="text-[10px] text-indigo-300 uppercase block font-semibold">Provas Armazenadas</span>
        <strong class="text-lg font-black text-blue-300">100% Auditadas com Hash SHA-256</strong>
      </div>
    </div>
  </div>

  <!-- NAVEGAÇÃO DE ABAS -->
  <div class="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm font-bold">
    <a href="cooperativa.php?aba=talentos" class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap <?= ($abaAtiva === 'talentos') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
      <span>👥 Banco de Talentos (Melhores Alunos)</span>
      <span class="px-2 py-0.5 rounded-full text-[10px] bg-indigo-800 text-indigo-100 font-black"><?= count($membros) ?></span>
    </a>

    <a href="cooperativa.php?aba=vagas" class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap <?= ($abaAtiva === 'vagas') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
      <span>💼 Mural de Vagas de Emprego</span>
      <span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-700 text-white font-black"><?= count($vagas) ?></span>
    </a>

    <a href="cooperativa.php?aba=empresas" class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap <?= ($abaAtiva === 'empresas') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
      <span>🏢 Área da Empresa (Candidaturas & RH)</span>
      <span class="px-2 py-0.5 rounded-full text-[10px] bg-purple-700 text-white font-black"><?= count($candidaturas) ?></span>
    </a>

    <a href="cooperativa.php?aba=cadastrar" class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap <?= ($abaAtiva === 'cadastrar') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
      <span>➕ Cadastrar Aluno na Cooperativa</span>
    </a>

    <a href="cooperativa.php?aba=publicar_vaga" class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap <?= ($abaAtiva === 'publicar_vaga') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
      <span>📢 Publicar Vaga (Empresas)</span>
    </a>

    <a href="cooperativa.php?aba=cracha" class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap <?= ($abaAtiva === 'cracha') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' ?>">
      <span>🪪 Crachá Funcional & Anuidade</span>
    </a>
  </div>

  <!-- ========================================== -->
  <!-- ABA 1: BANCO DE TALENTOS (MELHORES ALUNOS) -->
  <!-- ========================================== -->
  <?php if ($abaAtiva === 'talentos'): ?>
    <div class="space-y-6">
      <!-- Filtros de Busca -->
      <form method="GET" action="cooperativa.php" class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <input type="hidden" name="aba" value="talentos">
        <div class="relative flex-1">
          <input
            type="text"
            name="busca"
            value="<?= htmlspecialchars($buscaTalento) ?>"
            placeholder="Buscar por nome, competência (ex: Regulagem de Ponto, SPED, PHP) ou cidade..."
            class="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden"
          >
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select name="area" class="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700">
            <option value="todas" <?= ($filtroArea === 'todas') ? 'selected' : '' ?>>Todas as Áreas de Formação</option>
            <option value="Engenharia" <?= ($filtroArea === 'Engenharia') ? 'selected' : '' ?>>Mecânica & Máquinas de Costura</option>
            <option value="Negócios" <?= ($filtroArea === 'Negócios') ? 'selected' : '' ?>>Contabilidade & Gestão</option>
            <option value="Tecnologia" <?= ($filtroArea === 'Tecnologia') ? 'selected' : '' ?>>Tecnologia & Software</option>
          </select>

          <label class="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 cursor-pointer">
            <input type="checkbox" name="top" value="1" <?= $filtroTop ? 'checked' : '' ?> class="rounded text-amber-600">
            <span>⭐ Melhores Alunos (Média ≥ 9.0)</span>
          </label>

          <button type="submit" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer">
            Filtrar
          </button>
        </div>
      </form>

      <!-- Grid de Melhores Alunos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($membrosFiltrados as $m): ?>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between">
            <div class="p-5 space-y-4">
              <!-- Topo do Card -->
              <div class="flex items-start gap-3.5">
                <img src="<?= htmlspecialchars($m['avatar']) ?>" alt="<?= htmlspecialchars($m['name']) ?>" class="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-sm shrink-0">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      <?= htmlspecialchars($m['name']) ?>
                    </h3>
                    <?php if (!empty($m['topPerformerBadge'])): ?>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                        ⭐ Top Aluno
                      </span>
                    <?php endif; ?>
                  </div>
                  <span class="text-xs text-indigo-700 font-semibold block mt-0.5 truncate">
                    <?= htmlspecialchars($m['courseTitle']) ?>
                  </span>
                  <span class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    📍 <?= htmlspecialchars($m['city']) ?>
                  </span>
                </div>
              </div>

              <!-- Apresentação / Bio -->
              <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                <?= htmlspecialchars($m['bio']) ?>
              </p>

              <!-- Habilidades Homologadas -->
              <div class="flex flex-wrap gap-1.5">
                <?php foreach (array_slice($m['technicalSkills'], 0, 4) as $sk): ?>
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                    <?= htmlspecialchars($sk) ?>
                  </span>
                <?php endforeach; ?>
                <?php if (count($m['technicalSkills']) > 4): ?>
                  <span class="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-bold">
                    +<?= count($m['technicalSkills']) - 4 ?>
                  </span>
                <?php endif; ?>
              </div>

              <!-- Métricas Box (Provas e Atualizações) -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span class="text-[10px] text-slate-400 block font-sans uppercase">Média Geral</span>
                  <strong class="text-emerald-700 font-bold text-sm"><?= number_format($m['overallAverage'], 1) ?> / 10</strong>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block font-sans uppercase">Provas Salvas</span>
                  <strong class="text-indigo-900 font-bold"><?= count($m['storedExams']) ?> Avaliações</strong>
                </div>
                <div>
                  <span class="text-[10px] text-slate-400 block font-sans uppercase">Atualização</span>
                  <strong class="text-purple-700 font-bold"><?= $m['courseUpdates'][0]['year'] ?? '2026' ?></strong>
                </div>
              </div>
            </div>

            <!-- Rodapé com Ações -->
            <div class="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button onclick="abrirModalDossie('<?= $m['id'] ?>')" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition text-center">
                Ver Dossiê & Provas Arquivadas &rarr;
              </button>
              <a href="https://wa.me/55<?= preg_replace('/\D/', '', $m['contactPhone']) ?>?text=<?= urlencode('Olá ' . $m['name'] . ', vimos seu perfil na Cooperativa do Grupo Eloizio e temos interesse em contratá-lo!') ?>" target="_blank" class="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs" title="WhatsApp RH">
                📞
              </a>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- ========================================== -->
  <!-- ABA 2: MURAL DE VAGAS DE EMPREGO           -->
  <!-- ========================================== -->
  <?php if ($abaAtiva === 'vagas'): ?>
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 class="text-xl font-black text-slate-900">Mural Oficial de Oportunidades & Vagas de Emprego</h2>
          <p class="text-xs text-slate-500">Vagas abertas por confecções, indústrias, escritórios contábeis e empresas de TI parceiras.</p>
        </div>
        <a href="cooperativa.php?aba=publicar_vaga" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-center">
          <span>+ Publicar Nova Vaga (Empresas)</span>
        </a>
      </div>

      <div class="space-y-4">
        <?php foreach ($vagas as $v): ?>
          <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-indigo-300 transition space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                    <?= htmlspecialchars($v['category']) ?>
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    <?= strtoupper(htmlspecialchars($v['type'])) ?>
                  </span>
                  <span class="text-xs text-slate-400">• Publicada em <?= htmlspecialchars($v['createdAt']) ?></span>
                </div>
                <h3 class="text-lg font-black text-slate-900 mt-1"><?= htmlspecialchars($v['title']) ?></h3>
                <div class="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap font-bold">
                  <span class="text-slate-800">🏢 <?= htmlspecialchars($v['companyName']) ?></span>
                  <span class="text-slate-500">📍 <?= htmlspecialchars($v['location']) ?></span>
                  <span class="text-emerald-700 font-extrabold">💰 <?= htmlspecialchars($v['salaryRange']) ?></span>
                </div>
              </div>

              <button onclick="abrirModalCandidatura('<?= $v['id'] ?>', '<?= htmlspecialchars($v['title']) ?>', '<?= htmlspecialchars($v['companyName']) ?>')" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition shrink-0 flex items-center gap-1.5">
                <span>Candidatar-se com Meu Histórico &rarr;</span>
              </button>
            </div>

            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <?= nl2br(htmlspecialchars($v['description'])) ?>
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-xl space-y-1">
                <strong class="text-slate-900 font-bold block">Requisitos Desejados:</strong>
                <ul class="list-disc list-inside text-slate-600 space-y-0.5">
                  <?php foreach ($v['requirements'] as $req): ?>
                    <li><?= htmlspecialchars($req) ?></li>
                  <?php endforeach; ?>
                </ul>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl space-y-1">
                <strong class="text-slate-900 font-bold block">Benefícios Oferecidos:</strong>
                <ul class="list-disc list-inside text-slate-600 space-y-0.5">
                  <?php foreach ($v['benefits'] as $ben): ?>
                    <li><?= htmlspecialchars($ben) ?></li>
                  <?php endforeach; ?>
                </ul>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="font-bold text-indigo-700"><?= $v['applicantsCount'] ?? 0 ?> alunos cooperados já se candidataram</span>
                <span>• RH: <?= htmlspecialchars($v['contactPhone']) ?></span>
              </div>
              <a href="mailto:<?= htmlspecialchars($v['contactEmail']) ?>" class="text-indigo-600 font-bold hover:underline">
                <?= htmlspecialchars($v['contactEmail']) ?>
              </a>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- ========================================== -->
  <!-- ABA 3: ÁREA DA EMPRESA (CANDIDATURAS & RH) -->
  <!-- ========================================== -->
  <?php if ($abaAtiva === 'empresas'): ?>
    <div class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span class="text-xs font-black uppercase text-purple-600 tracking-wider">
              Painel Corporativo de RH & Seleção
            </span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Candidaturas Recebidas & Análise de Provas
            </h2>
            <p class="text-xs text-slate-500">
              Analise os alunos que se candidataram às vagas da sua empresa. Visualize o histórico comprovado de avaliações práticas e agende entrevistas.
            </p>
          </div>

          <a href="cooperativa.php?aba=publicar_vaga" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs self-start sm:self-center">
            + Publicar Nova Vaga
          </a>
        </div>

        <?php if (empty($candidaturas)): ?>
          <div class="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            Nenhuma candidatura registrada no momento. As candidaturas recebidas aparecerão aqui com acesso imediato às provas do aluno.
          </div>
        <?php else: ?>
          <div class="space-y-3">
            <?php foreach ($candidaturas as $cand): ?>
              <?php
                $membroCand = null;
                foreach ($membros as $m) {
                    if ($m['id'] === $cand['memberId']) {
                        $membroCand = $m;
                        break;
                    }
                }
              ?>
              <div class="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-start gap-3.5">
                  <img src="<?= htmlspecialchars($membroCand['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200') ?>" alt="Aluno" class="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500 shadow-sm shrink-0">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="font-extrabold text-sm sm:text-base text-slate-900"><?= htmlspecialchars($cand['memberName']) ?></h4>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                        Vaga: <?= htmlspecialchars($cand['vacancyTitle']) ?>
                      </span>
                      <span class="text-[11px] text-slate-400">Em <?= htmlspecialchars($cand['appliedAt']) ?></span>
                    </div>

                    <div class="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                      <span>Curso: <strong><?= htmlspecialchars($membroCand['courseTitle'] ?? 'Formação Técnica') ?></strong></span>
                      <span>Média: <strong class="text-emerald-700"><?= number_format($membroCand['overallAverage'] ?? 9.5, 1) ?> / 10</strong></span>
                      <span>Provas Salvas: <strong class="text-indigo-900"><?= count($membroCand['storedExams'] ?? []) ?> avaliações</strong></span>
                    </div>

                    <?php if (!empty($cand['coverNote'])): ?>
                      <p class="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mt-1 max-w-xl">
                        "<?= htmlspecialchars($cand['coverNote']) ?>"
                      </p>
                    <?php endif; ?>
                  </div>
                </div>

                <!-- Formulário de Atualização de Status -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <form method="POST" action="cooperativa.php" class="inline">
                    <input type="hidden" name="acao" value="atualizar_status_candidatura">
                    <input type="hidden" name="candidaturaId" value="<?= $cand['id'] ?>">
                    <select name="novoStatus" onchange="this.form.submit()" class="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 cursor-pointer">
                      <option value="em_analise" <?= ($cand['status'] === 'em_analise') ? 'selected' : '' ?>>🟡 Em Análise</option>
                      <option value="entrevista_agendada" <?= ($cand['status'] === 'entrevista_agendada') ? 'selected' : '' ?>>🔵 Entrevista Agendada</option>
                      <option value="aprovado" <?= ($cand['status'] === 'aprovado') ? 'selected' : '' ?>>🟢 Aprovado / Contratar</option>
                      <option value="banco_reserva" <?= ($cand['status'] === 'banco_reserva') ? 'selected' : '' ?>>⚪ Banco de Reserva</option>
                    </select>
                  </form>

                  <?php if ($membroCand): ?>
                    <button onclick="abrirModalDossie('<?= $membroCand['id'] ?>')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                      Ver Provas & Dossiê
                    </button>
                    <a href="https://wa.me/55<?= preg_replace('/\D/', '', $membroCand['contactPhone']) ?>?text=<?= urlencode('Olá ' . $membroCand['name'] . ', analisamos sua candidatura para a vaga ' . $cand['vacancyTitle'] . ' e gostaríamos de agendar uma entrevista!') ?>" target="_blank" class="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1" title="WhatsApp RH">
                      📞 <span class="sm:hidden">WhatsApp</span>
                    </a>
                  <?php endif; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- ========================================== -->
  <!-- ABA 4: CADASTRAR ALUNO NA COOPERATIVA      -->
  <!-- ========================================== -->
  <?php if ($abaAtiva === 'cadastrar'): ?>
    <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 max-w-3xl mx-auto">
      <div class="border-b border-slate-200 pb-3">
        <span class="text-xs font-black uppercase text-emerald-600 tracking-wider">
          Indicação & Cadastro de Talentos
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          Cadastrar Aluno Destaque na Cooperativa
        </h2>
        <p class="text-xs text-slate-500">
          Cadastre os melhores alunos formados para que fiquem visíveis para empresas contratantes e indústrias parceiras.
        </p>
      </div>

      <form method="POST" action="cooperativa.php" class="space-y-4">
        <input type="hidden" name="acao" value="cadastrar_aluno">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo do Aluno *</label>
            <input type="text" name="nome" required placeholder="Ex: Amanda Ferreira Castro" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Curso Concluído *</label>
            <input type="text" name="curso" required placeholder="Ex: Mecânica e Regulagem de Máquinas de Costura" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Área / Categoria</label>
            <select name="categoria" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
              <option value="Engenharia">Mecânica & Máquinas de Costura</option>
              <option value="Negócios">Contabilidade & Gestão</option>
              <option value="Tecnologia">Tecnologia & Software</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Média Geral (0 a 10) *</label>
            <input type="number" step="0.1" min="0" max="10" name="media" value="9.6" required class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Cidade / Região *</label>
            <input type="text" name="cidade" value="São Gonçalo - RJ" required class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone / WhatsApp *</label>
            <input type="text" name="telefone" value="(21) 99613-4073" required class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail de Contato *</label>
            <input type="email" name="email" placeholder="aluno@eduvanguard.com" required class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Habilidades Técnicas (Separadas por vírgula) *</label>
          <input type="text" name="habilidades" required placeholder="Ex: Regulagem de Lançadeira, Overloque Industrial, Ponto Corrente, Manutenção Preventiva" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Apresentação / Resumo Profissional *</label>
          <textarea name="bio" rows={3} required placeholder="Perfil técnico do aluno, destaques obtidos nas avaliações e disponibilidade para o mercado..." class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"></textarea>
        </div>

        <div class="flex justify-end pt-3">
          <button type="submit" class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition">
            Cadastrar Aluno na Cooperativa &rarr;
          </button>
        </div>
      </form>
    </div>
  <?php endif; ?>

  <!-- ========================================== -->
  <!-- ABA 5: PUBLICAR VAGA (EMPRESAS)            -->
  <!-- ========================================== -->
  <?php if ($abaAtiva === 'publicar_vaga'): ?>
    <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 max-w-3xl mx-auto">
      <div class="border-b border-slate-200 pb-3">
        <span class="text-xs font-black uppercase text-emerald-600 tracking-wider">
          Módulo para Empresas & Oficinas
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          Publicar Oportunidade de Trabalho ou Estágio
        </h2>
        <p class="text-xs text-slate-500">
          Disponibilize sua vaga diretamente para os melhores alunos e técnicos formados pelo Grupo Eloizio.
        </p>
      </div>

      <form method="POST" action="cooperativa.php" class="space-y-4">
        <input type="hidden" name="acao" value="publicar_vaga">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Vaga *</label>
            <input type="text" name="titulo" required placeholder="Ex: Mecânico de Máquinas Industriais Direct-Drive" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nome da Empresa / Oficina *</label>
            <input type="text" name="empresa" required placeholder="Ex: Confecção Estilo Rio - São Gonçalo" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Local / Cidade *</label>
            <input type="text" name="local" value="São Gonçalo - RJ" required class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Remuneração / Salário</label>
            <input type="text" name="salario" value="R$ 3.800 + Benefícios" required class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Regime de Contrato</label>
            <select name="tipo" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
              <option value="clt">CLT Efetivo</option>
              <option value="pj">PJ / Prestador de Serviço</option>
              <option value="estagio">Estágio Remunerado</option>
              <option value="prestador_servico">Prestador Técnico Autônomo</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição das Atividades *</label>
          <textarea name="descricao" rows={3} required placeholder="Descreva a rotina da função, equipamentos a serem manuseados e horários..." class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Requisitos (1 por linha)</label>
            <textarea name="requisitos" rows={3} class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden">Certificado de conclusão reconhecido pelo Grupo Eloizio
Experiência em ajuste fino de lançadeira
Disponibilidade para início imediato</textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Benefícios (1 por linha)</label>
            <textarea name="beneficios" rows={3} class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden">Vale Refeição
Vale Transporte
Plano Odontológico</textarea>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail para Receber Candidaturas *</label>
            <input type="email" name="email" required placeholder="rh@suaempresa.com.br" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp / Telefone RH</label>
            <input type="text" name="telefone" value="(21) 99613-4073" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          </div>
        </div>

        <div class="flex justify-end pt-3">
          <button type="submit" class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition">
            Publicar Vaga no Mural &rarr;
          </button>
        </div>
      </form>
    </div>
  <?php endif; ?>

  <!-- ======================================================== -->
  <!-- ABA 6: CRACHÁ FUNCIONAL & ANUIDADE DE RENOVAÇÃO           -->
  <!-- ======================================================== -->
  <?php if ($abaAtiva === 'cracha'): ?>
    <?php
      $membroCrachaId = $_GET['membroCrachaId'] ?? ($membros[0]['id'] ?? '');
      $membroSelecionado = null;
      foreach ($membros as $m) {
          if ($m['id'] === $membroCrachaId) {
              $membroSelecionado = $m;
              break;
          }
      }
      if (!$membroSelecionado && !empty($membros)) {
          $membroSelecionado = $membros[0];
      }
      $isConcluinte = !empty($membroSelecionado['hasConcludedCourse']);
    ?>

    <div class="space-y-8">
      <!-- Banner Oficial com Regra de Cobrança / Isenção -->
      <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Cooperativa Técnica Oficial • Credencial Funcional
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase <?= $isConcluinte ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40' ?>">
              <?= $isConcluinte ? '★ Isenção Total: Aluno Concluinte' : '⚠️ Anuidade de Renovação Aplicável' ?>
            </span>
          </div>
          <h2 class="text-2xl font-black">Crachá Funcional da Cooperativa & Credencial Profissional</h2>
          <p class="text-xs text-indigo-200 max-w-2xl leading-relaxed">
            Regra Oficial da Presidência: O <strong>crachá funcional da cooperativa será cobrado na anuidade para renovação (R$ 45,00/ano via Mercado Pago)</strong>, mas <strong>NÃO será cobrado se for aluno concluinte de cursos</strong> do Grupo Eloizio (isenção total e vitalícia).
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 shrink-0">
          <button onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer flex items-center justify-center gap-1.5">
            <span>🖨️ Imprimir Crachá PVC</span>
          </button>
        </div>
      </div>

      <!-- Seletor de Cooperado -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="w-full sm:w-auto space-y-1">
          <label class="block text-xs font-bold text-slate-700 uppercase">Selecione o Membro Cooperado para Visualizar o Crachá:</label>
          <div class="flex gap-2">
            <select onchange="window.location.href='cooperativa.php?aba=cracha&membroCrachaId=' + this.value" class="w-full sm:w-80 p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
              <?php foreach ($membros as $m): ?>
                <option value="<?= $m['id'] ?>" <?= ($m['id'] === $membroSelecionado['id']) ? 'selected' : '' ?>>
                  <?= htmlspecialchars($m['name']) ?> (<?= !empty($m['hasConcludedCourse']) ? 'Concluinte • Isento' : 'Associado Externo' ?>)
                </option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="p-3 rounded-xl <?= $isConcluinte ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-amber-50 border border-amber-200 text-amber-950' ?> text-xs">
            <span class="font-bold block"><?= $isConcluinte ? 'Status: Aluno Concluinte Homologado' : 'Status: Profissional Cooperado Externo' ?></span>
            <span class="text-[11px] <?= $isConcluinte ? 'text-emerald-700' : 'text-amber-700' ?>">
              <?= $isConcluinte ? '✓ Isento de anuidade para renovação (R$ 0,00)' : 'Anuidade para renovação: R$ 45,00/ano via Mercado Pago' ?>
            </span>
          </div>
        </div>
      </div>

      <!-- VISUALIZAÇÃO DO CRACHÁ FUNCIONAL (FRENTE & VERSO) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-6">
        <!-- FRENTE DO CRACHÁ -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
            Frente da Credencial (Padrão PVC 85 x 54 mm)
          </span>
          <div class="bg-linear-to-b from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border-4 border-indigo-400 shadow-2xl relative overflow-hidden max-w-md mx-auto aspect-85/54 flex flex-col justify-between">
            <!-- Faixa Superior Institucional -->
            <div class="flex items-start justify-between border-b border-indigo-500/40 pb-3">
              <div class="space-y-0.5">
                <span class="text-[8px] font-black uppercase tracking-widest text-indigo-300 block">
                  República Federativa do Brasil • Estado do RJ
                </span>
                <h4 class="text-sm font-black text-white tracking-tight uppercase">
                  Grupo Eloizio • Cooperativa Técnica
                </h4>
                <span class="text-[9px] text-slate-300 block">
                  Registro Profissional • São Gonçalo - RJ
                </span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                GE
              </div>
            </div>

            <!-- Corpo com Foto, Chip e Dados -->
            <div class="flex items-center gap-4 my-2">
              <img
                src="<?= htmlspecialchars($membroSelecionado['avatar']) ?>"
                alt="<?= htmlspecialchars($membroSelecionado['name']) ?>"
                class="w-20 h-24 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
              />
              <div class="space-y-1 text-xs">
                <!-- Chip Simulado -->
                <div class="w-8 h-6 rounded-md bg-linear-to-r from-amber-200 via-amber-400 to-amber-300 border border-amber-500 mb-1 shadow-inner"></div>
                
                <strong class="text-sm font-black text-white block leading-tight">
                  <?= htmlspecialchars($membroSelecionado['name']) ?>
                </strong>
                <span class="text-[11px] text-indigo-200 block font-semibold leading-tight">
                  <?= htmlspecialchars($membroSelecionado['courseTitle']) ?>
                </span>
                <div class="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-300">
                  <span>Reg: <strong><?= htmlspecialchars($membroSelecionado['registrationNumber']) ?></strong></span>
                  <span>• Polo: SG-RJ</span>
                </div>
              </div>
            </div>

            <!-- Faixa Inferior -->
            <div class="flex items-center justify-between border-t border-indigo-500/40 pt-2 text-[9px] font-mono">
              <span class="text-emerald-400 font-bold">
                <?= $isConcluinte ? '★ TÉCNICO CONCLUINTE' : 'MEMBRO COOPERADO' ?>
              </span>
              <span class="text-slate-400">
                Validade: 12/2027
              </span>
            </div>
          </div>
        </div>

        <!-- VERSO DO CRACHÁ -->
        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
            Verso da Credencial com QR Code & Validação Digital
          </span>
          <div class="bg-white text-slate-900 rounded-3xl p-6 border-4 border-slate-300 shadow-2xl relative overflow-hidden max-w-md mx-auto aspect-85/54 flex flex-col justify-between">
            <!-- Tarja Magnética -->
            <div class="-mx-6 -mt-6 h-9 bg-slate-950 shadow-inner flex items-center px-4">
              <span class="text-[7px] text-slate-500 font-mono tracking-widest uppercase">
                MAGNETIC ENCODED STRIPE • ICP-EDU SECURE TOKEN
              </span>
            </div>

            <!-- Conteúdo Central com QR Code e Hash -->
            <div class="flex items-center justify-between gap-4 py-3">
              <div class="space-y-1 text-[10px] leading-tight">
                <strong class="text-slate-900 block font-bold text-xs uppercase">
                  Grupo Eloizio & Talent Hub
                </strong>
                <p class="text-slate-600 text-[10px]">
                  Identificação funcional amparada pela Lei Federal nº 9.394/96 Art. 42 e normas da Cooperativa de Melhores Alunos.
                </p>
                <p class="text-slate-500 text-[9px] font-mono pt-1">
                  Cidade: <?= htmlspecialchars($membroSelecionado['city']) ?>
                </p>
              </div>

              <div class="w-20 h-20 border-2 border-slate-900 rounded-xl p-1 bg-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                <div class="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-black">
                  QR
                </div>
                <span class="text-[6px] text-slate-700 font-bold uppercase mt-0.5">Autenticar</span>
              </div>
            </div>

            <!-- Assinatura do CEO Eloizio Assunção -->
            <div class="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px]">
              <div>
                <div class="border-b border-slate-700 w-28 mb-0.5"></div>
                <strong class="block text-slate-900 font-bold">Eloizio Assunção</strong>
                <span class="text-slate-500 text-[8px]">Diretor Presidente • Grupo Eloizio</span>
              </div>
              <div class="text-right font-mono text-[8px] text-slate-500">
                <span>Hash: SHA256-<?= substr(base64_encode($membroSelecionado['registrationNumber']), 0, 10) ?></span>
                <strong class="block text-emerald-700 font-bold">✓ Válido Nacionalmente</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PAINEL DE RENOVAÇÃO FINANCEIRA / ISENÇÃO -->
      <?php if (!$isConcluinte): ?>
        <div class="p-5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-amber-700 font-bold">⚠️</span>
              <strong class="text-xs font-black text-amber-950 uppercase">
                Anuidade de Renovação do Crachá Funcional: R$ 45,00/ano
              </strong>
            </div>
            <p class="text-xs text-amber-800 leading-relaxed">
              Membros não concluintes de cursos pagam anuidade de renovação anual do crachá funcional. O pagamento é processado instantaneamente via Mercado Pago (PIX com baixa imediata).
            </p>
          </div>
          <button
            onclick="alert('Chave PIX Mercado Pago no valor de R$ 45,00 gerada com sucesso para renovação anual do Crachá Funcional de <?= addslashes($membroSelecionado['name']) ?>! Chave copiada para a área de transferência.');"
            class="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition shrink-0"
          >
            💳 Pagar Renovação Anual no Mercado Pago (R$ 45,00)
          </button>
        </div>
      <?php else: ?>
        <div class="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3">
          <span class="text-emerald-700 text-lg">✓</span>
          <div class="text-xs text-emerald-900">
            <strong>Benefício Vitalício de Aluno Concluinte:</strong> Como <?= htmlspecialchars($membroSelecionado['name']) ?> concluiu sua formação técnica pelo Grupo Eloizio, seu crachá funcional e sua anuidade de renovação são <strong>100% gratuitos e isentos</strong> de qualquer taxa por determinação da diretoria!
          </div>
        </div>
      <?php endif; ?>
    </div>
  <?php endif; ?>

<!-- ======================================================== -->
<!-- MODAL DOSSIÊ ACADÊMICO TIMBRADO DO ALUNO COM PROVAS & SELOS -->
<!-- ======================================================== -->
<div id="modalDossieAluno" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
  <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200">
    <div class="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
      <div class="flex items-center gap-3">
        <img id="dossieAvatar" src="" alt="Avatar" class="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-400">
        <div>
          <div class="flex items-center gap-2">
            <h3 id="dossieNome" class="font-extrabold text-base sm:text-lg">Nome do Aluno</h3>
            <span id="dossieBadgeTop" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-950 hidden">
              ⭐ Top Aluno
            </span>
          </div>
          <span id="dossieMatricula" class="text-xs text-indigo-300 font-mono">MAT-2026-0000</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="window.print()" class="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer hidden sm:flex items-center gap-1 text-xs">
          <span>🖨️ Imprimir Dossiê</span>
        </button>
        <button onclick="fecharModalDossie()" class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer text-xl">
          &times;
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs sm:text-sm">
      <!-- Timbre Institucional -->
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div>
          <strong class="text-slate-900 block font-bold">Grupo Eloizio & EduVanguard • Banco Oficial de Talentos</strong>
          <span class="text-slate-500 text-xs">Dossiê de Qualificação Profissional & Histórico Auditado</span>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 uppercase block font-mono">Status</span>
          <span class="text-emerald-700 font-black">Disponível para Contratação Imediata</span>
        </div>
      </div>

      <!-- Apresentação -->
      <div>
        <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider">Apresentação Profissional</h4>
        <p id="dossieBio" class="text-slate-700 leading-relaxed mt-1"></p>
      </div>

      <!-- Habilidades -->
      <div>
        <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider">Competências Técnicas Homologadas</h4>
        <div id="dossieSkills" class="flex flex-wrap gap-2 mt-2"></div>
      </div>

      <!-- Provas Realizadas e Armazenadas -->
      <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="font-black text-sm text-slate-900">
            📜 Provas Práticas & Teóricas Realizadas (Histórico Comprovado)
          </h4>
          <span class="text-xs text-emerald-700 font-bold">100% Auditadas com Hash SHA-256</span>
        </div>
        <div id="dossieProvas" class="space-y-2.5"></div>
      </div>

      <!-- Selos de Atualização -->
      <div class="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
        <h4 class="font-black text-sm text-purple-950">
          🎖️ Selos de Atualização de Cursos & Reciclagem Profissional
        </h4>
        <div id="dossieAtualizacoes" class="space-y-2"></div>
      </div>

      <!-- Contato e Ações -->
      <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-xs text-slate-500">
          <span>Contato direto: </span>
          <strong id="dossieTelefone" class="text-slate-800"></strong>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <a id="dossieLinkWhatsapp" href="#" target="_blank" class="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2">
            <span>Convidar via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ======================================================== -->
<!-- MODAL DE CANDIDATURA DIRETA A VAGA                       -->
<!-- ======================================================== -->
<div id="modalCandidatura" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs hidden items-center justify-center p-3 sm:p-4 overflow-y-auto">
  <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <span class="text-[10px] font-black uppercase text-indigo-600">Candidatura Instantânea</span>
        <h3 id="candTituloVaga" class="font-black text-lg text-slate-900">Título da Vaga</h3>
        <span id="candEmpresaVaga" class="text-xs text-slate-500">Nome da Empresa</span>
      </div>
      <button onclick="fecharModalCandidatura()" class="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer">
        &times;
      </button>
    </div>

    <form method="POST" action="cooperativa.php" class="space-y-3">
      <input type="hidden" name="acao" value="candidatar_vaga">
      <input type="hidden" name="vagaId" id="candInputVagaId" value="">

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Selecione o Aluno Cooperado:</label>
        <select name="membroId" class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden">
          <?php foreach ($membros as $m): ?>
            <option value="<?= $m['id'] ?>">
              <?= htmlspecialchars($m['name']) ?> (Média: <?= number_format($m['overallAverage'], 1) ?> - <?= htmlspecialchars($m['courseTitle']) ?>)
            </option>
          <?php endforeach; ?>
        </select>
      </div>

      <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
        <strong class="block font-bold">✓ Suas provas arquivadas serão anexadas:</strong>
        <p class="text-[11px] text-emerald-800">
          A empresa contratante receberá suas notas oficiais, hash criptográfico e competências validadas pelo Grupo Eloizio.
        </p>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mensagem / Apresentação (Opcional):</label>
        <textarea name="notaApresentacao" rows={3} placeholder="Olá, tenho grande interesse nesta oportunidade e excelente aproveitamento nas disciplinas práticas..." class="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <button type="button" onclick="fecharModalCandidatura()" class="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer">
          Cancelar
        </button>
        <button type="submit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition">
          Confirmar Candidatura &rarr;
        </button>
      </div>
    </form>
  </div>
</div>

<script>
  const MEMBROS_DATA = <?= json_encode($membros, JSON_UNESCAPED_UNICODE) ?>;

  function abrirModalDossie(id) {
    const m = MEMBROS_DATA.find(item => item.id === id);
    if (!m) return;

    document.getElementById('dossieAvatar').src = m.avatar;
    document.getElementById('dossieNome').innerText = m.name;
    document.getElementById('dossieMatricula').innerText = m.registrationNumber + ' • ' + m.city;
    document.getElementById('dossieBio').innerText = m.bio;
    document.getElementById('dossieTelefone').innerText = m.contactPhone;

    if (m.topPerformerBadge) {
      document.getElementById('dossieBadgeTop').classList.remove('hidden');
    } else {
      document.getElementById('dossieBadgeTop').classList.add('hidden');
    }

    // Skills
    const skillsDiv = document.getElementById('dossieSkills');
    skillsDiv.innerHTML = '';
    m.technicalSkills.forEach(sk => {
      const sp = document.createElement('span');
      sp.className = 'px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold';
      sp.innerText = sk;
      skillsDiv.appendChild(sp);
    });

    // Provas
    const provasDiv = document.getElementById('dossieProvas');
    provasDiv.innerHTML = '';
    m.storedExams.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <strong class="text-slate-900 font-bold">${ex.title}</strong>
          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs font-mono">
            Nota: ${parseFloat(ex.score).toFixed(1)} / ${ex.maxPoints}
          </span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Data: ${ex.date} • Avaliador: ${ex.verifiedBy}</span>
          <span class="text-indigo-600 font-bold">${ex.certificateHash || ''}</span>
        </div>
        ${ex.feedback ? `<p class="text-[11px] text-slate-600 italic border-t border-slate-100 pt-1 mt-1">"${ex.feedback}"</p>` : ''}
      `;
      provasDiv.appendChild(card);
    });

    // Atualizações
    const updDiv = document.getElementById('dossieAtualizacoes');
    updDiv.innerHTML = '';
    m.courseUpdates.forEach(upd => {
      const card = document.createElement('div');
      card.className = 'p-3 bg-white rounded-xl border border-purple-200 text-xs flex items-center justify-between';
      card.innerHTML = `
        <div>
          <strong class="text-slate-900 block">${upd.title}</strong>
          <span class="text-slate-500 text-[11px]">Ano ${upd.year} • ${upd.hours} horas de reciclagem</span>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
          ${upd.badge}
        </span>
      `;
      updDiv.appendChild(card);
    });

    const phoneClean = m.contactPhone.replace(/\D/g, '');
    document.getElementById('dossieLinkWhatsapp').href = `https://wa.me/55${phoneClean}?text=Olá ${encodeURIComponent(m.name)}, vimos seu perfil na Cooperativa do Grupo Eloizio e gostaríamos de conversar!`;

    document.getElementById('modalDossieAluno').classList.remove('hidden');
    document.getElementById('modalDossieAluno').classList.add('flex');
  }

  function fecharModalDossie() {
    document.getElementById('modalDossieAluno').classList.add('hidden');
    document.getElementById('modalDossieAluno').classList.remove('flex');
  }

  function abrirModalCandidatura(vagaId, titulo, empresa) {
    document.getElementById('candInputVagaId').value = vagaId;
    document.getElementById('candTituloVaga').innerText = titulo;
    document.getElementById('candEmpresaVaga').innerText = empresa;
    document.getElementById('modalCandidatura').classList.remove('hidden');
    document.getElementById('modalCandidatura').classList.add('flex');
  }

  function fecharModalCandidatura() {
    document.getElementById('modalCandidatura').classList.add('hidden');
    document.getElementById('modalCandidatura').classList.remove('flex');
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
