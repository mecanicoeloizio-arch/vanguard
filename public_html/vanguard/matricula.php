<?php
/**
 * Grupo Eloizio - Formulário de Matrícula Oficial 2026 (PHP 8.1+)
 * Cadastro completo de dados, upload de foto 3x4, documentos comprobatórios,
 * aceite de contrato de prestação de serviços e checkout via Mercado Pago.
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Formulário Oficial de Matrícula 2026";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$cursos = getCursosData();
$cursoPreselecionadoId = $_GET['curso'] ?? ($cursos[0]['id'] ?? 'course_1');

$matriculaSucesso = false;
$dadosMatriculaConfirmada = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao']) && $_POST['acao'] === 'realizar_matricula') {
    $nomeCompleto = trim($_POST['nomeCompleto'] ?? '');
    $cpf = trim($_POST['cpf'] ?? '');
    $rg = trim($_POST['rg'] ?? '');
    $orgao = trim($_POST['orgaoEmissor'] ?? 'DETRAN/RJ');
    $nascimento = trim($_POST['nascimento'] ?? '2000-01-01');
    $genero = trim($_POST['genero'] ?? 'Prefiro não informar');
    $email = trim($_POST['email'] ?? '');
    $telefone = trim($_POST['telefone'] ?? '');
    $nomeMae = trim($_POST['nomeMae'] ?? '');
    $nomePai = trim($_POST['nomePai'] ?? '');

    $cep = trim($_POST['cep'] ?? '');
    $rua = trim($_POST['rua'] ?? '');
    $numero = trim($_POST['numero'] ?? '');
    $complemento = trim($_POST['complemento'] ?? '');
    $bairro = trim($_POST['bairro'] ?? '');
    $cidade = trim($_POST['cidade'] ?? 'São Gonçalo');
    $estado = trim($_POST['estado'] ?? 'RJ');

    $cursoId = trim($_POST['cursoId'] ?? 'course_1');
    $modalidade = trim($_POST['modalidade'] ?? 'online');
    $escolaridade = trim($_POST['escolaridade'] ?? 'Ensino Médio Completo');
    $formaPagamento = trim($_POST['formaPagamento'] ?? 'pix');
    $termosAceitos = isset($_POST['termosAceitos']);

    // Identificar curso
    $cursoSelecionado = null;
    foreach ($cursos as $c) {
        if ($c['id'] === $cursoId) {
            $cursoSelecionado = $c;
            break;
        }
    }
    if (!$cursoSelecionado) {
        $cursoSelecionado = $cursos[0];
    }

    if (!empty($nomeCompleto) && !empty($cpf) && $termosAceitos) {
        $regNumber = 'MAT-' . date('Y') . '-' . rand(1000, 9999);
        $certCode = 'CERT-' . date('Y') . '-BR-' . rand(1000, 9999);
        $certHash = hash('sha256', $regNumber . $cpf . time());

        $novoAluno = [
            'id' => 'usr_' . time(),
            'name' => $nomeCompleto,
            'email' => $email,
            'phone' => $telefone,
            'cpf' => $cpf,
            'registrationNumber' => $regNumber,
            'course' => $cursoSelecionado['title'],
            'courseId' => $cursoSelecionado['id'],
            'progress' => 0,
            'average' => 10.0,
            'status' => 'Matriculado (Ativo)',
            'certificateCode' => $certCode,
            'certificateHash' => $certHash,
            'enrolledAt' => date('d/m/Y'),
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            'city' => $cidade . ' - ' . $estado,
        ];

        $alunos = getAlunosData();
        array_unshift($alunos, $novoAluno);
        salvarAlunosData($alunos);

        $matriculaSucesso = true;
        $dadosMatriculaConfirmada = [
            'aluno' => $novoAluno,
            'curso' => $cursoSelecionado,
            'modalidade' => $modalidade,
            'formaPagamento' => $formaPagamento,
            'dataMatricula' => date('d/m/Y H:i:s'),
        ];
    }
}
?>

<div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
  <?php if ($matriculaSucesso && $dadosMatriculaConfirmada): ?>
    <!-- TELA DE COMPROVANTE & SUCESSO DE MATRÍCULA -->
    <div class="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-3xl mx-auto shadow-inner">
        ✓
      </div>

      <div>
        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
          Matrícula Homologada & Ativa
        </span>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          Parabéns, <?= htmlspecialchars(explode(' ', $dadosMatriculaConfirmada['aluno']['name'])[0]) ?>!
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          Sua matrícula foi realizada com sucesso e registrada no livro acadêmico do Grupo Eloizio.
        </p>
      </div>

      <!-- Recibo Oficial Timbrado -->
      <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 font-mono text-xs max-w-2xl mx-auto shadow-xs">
        <div class="flex justify-between border-b border-slate-200 pb-2">
          <span class="text-slate-500 font-sans font-bold">Número de Matrícula:</span>
          <strong class="text-indigo-950 font-black text-sm"><?= $dadosMatriculaConfirmada['aluno']['registrationNumber'] ?></strong>
        </div>
        <div class="flex justify-between border-b border-slate-200 pb-2">
          <span class="text-slate-500 font-sans font-bold">Aluno:</span>
          <strong class="text-slate-900 font-sans"><?= htmlspecialchars($dadosMatriculaConfirmada['aluno']['name']) ?> (CPF: <?= htmlspecialchars($dadosMatriculaConfirmada['aluno']['cpf']) ?>)</strong>
        </div>
        <div class="flex justify-between border-b border-slate-200 pb-2">
          <span class="text-slate-500 font-sans font-bold">Curso:</span>
          <strong class="text-slate-900 font-sans"><?= htmlspecialchars($dadosMatriculaConfirmada['curso']['title']) ?></strong>
        </div>
        <div class="flex justify-between border-b border-slate-200 pb-2">
          <span class="text-slate-500 font-sans font-bold">Modalidade:</span>
          <strong class="text-slate-900 uppercase font-sans"><?= htmlspecialchars($dadosMatriculaConfirmada['modalidade']) ?></strong>
        </div>
        <div class="flex justify-between border-b border-slate-200 pb-2">
          <span class="text-slate-500 font-sans font-bold">Forma de Pagamento:</span>
          <strong class="text-emerald-700 uppercase font-sans font-bold"><?= htmlspecialchars($dadosMatriculaConfirmada['formaPagamento']) ?> (Mercado Pago)</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500 font-sans font-bold">Hash de Autenticação Digital:</span>
          <span class="text-[10px] text-slate-600 select-all font-mono break-all"><?= $dadosMatriculaConfirmada['aluno']['certificateHash'] ?></span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
        <a href="aluno.php" class="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition">
          Acessar Sala de Aulas (Portal do Aluno) &rarr;
        </a>
        <button onclick="window.print()" class="w-full sm:w-auto px-5 py-3.5 border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer">
          <span>🖨️ Imprimir Comprovante de Matrícula</span>
        </button>
      </div>
    </div>
  <?php else: ?>
    <!-- CABEÇALHO DO FORMULÁRIO -->
    <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-indigo-900/50 shadow-xl space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider mb-2">
            <span>Processo Seletivo & Matrícula 2026</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">Formulário Oficial de Matrícula</h1>
          <p class="text-xs text-indigo-200">Preencha seus dados para registro acadêmico, emissão de carteirinha DNE e contrato educacional.</p>
        </div>

        <button type="button" onclick="preencherExemploMatricula()" class="px-4 py-2 bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 border border-indigo-600/50 font-bold text-xs rounded-xl shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-center">
          ✨ Preencher Exemplo de Demonstração
        </button>
      </div>
    </div>

    <!-- FORMULÁRIO COMPLETO COM TODAS AS ETAPAS -->
    <form method="POST" action="matricula.php" enctype="multipart/form-data" class="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
      <input type="hidden" name="acao" value="realizar_matricula">

      <!-- SEÇÃO 1: DADOS PESSOAIS & IDENTIFICAÇÃO CIVIL -->
      <div class="space-y-4">
        <div class="border-b border-slate-200 pb-2">
          <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
            <span>👤</span> 1. Dados Pessoais & Identificação Civil
          </h2>
          <span class="text-xs text-slate-500">Dados cadastrais oficiais para registro no Ministério da Educação e conselhos.</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo *</label>
            <input type="text" name="nomeCompleto" id="matNome" required placeholder="Ex: Lucas Silva Prado" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">CPF *</label>
            <input type="text" name="cpf" id="matCpf" required placeholder="000.000.000-00" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">RG *</label>
              <input type="text" name="rg" id="matRg" required placeholder="00.000.000-0" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Órgão Emissor</label>
              <input type="text" name="orgaoEmissor" id="matOrgao" value="DETRAN/RJ" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Data de Nascimento *</label>
            <input type="date" name="nascimento" id="matNascimento" required value="1998-05-14" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Gênero / Sexo</label>
            <select name="genero" id="matGenero" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
              <option value="Prefiro não informar">Prefiro não informar</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Estado Civil</label>
            <select name="estadoCivil" id="matEstadoCivil" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="União Estável">União Estável</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail Principal *</label>
            <input type="email" name="email" id="matEmail" required placeholder="seu.email@exemplo.com" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone / WhatsApp *</label>
            <input type="tel" name="telefone" id="matTelefone" required placeholder="(21) 99999-9999" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo da Mãe *</label>
            <input type="text" name="nomeMae" id="matMae" required placeholder="Nome completo da genitora" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Pai (Opcional)</label>
            <input type="text" name="nomePai" id="matPai" placeholder="Nome completo do genitor" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
        </div>
      </div>

      <!-- SEÇÃO 2: ENDEREÇO & RESIDÊNCIA -->
      <div class="space-y-4">
        <div class="border-b border-slate-200 pb-2">
          <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
            <span>📍</span> 2. Endereço & Residência
          </h2>
          <span class="text-xs text-slate-500">Endereço comprovado para cadastro fiscal e emissão de notas fiscais.</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">CEP *</label>
            <input type="text" name="cep" id="matCep" required onblur="consultarCepPhp(this.value)" placeholder="24440-400" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Rua / Logradouro *</label>
            <input type="text" name="rua" id="matRua" required placeholder="Rua Doutor Nilo Peçanha" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Número *</label>
            <input type="text" name="numero" id="matNumero" required placeholder="450" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Complemento</label>
            <input type="text" name="complemento" id="matComplemento" placeholder="Apt 302" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Bairro *</label>
            <input type="text" name="bairro" id="matBairro" required placeholder="Centro" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Cidade *</label>
            <input type="text" name="cidade" id="matCidade" required value="São Gonçalo" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Estado (UF) *</label>
            <input type="text" name="estado" id="matEstado" required value="RJ" maxlength="2" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold uppercase focus:bg-white focus:outline-hidden">
          </div>
        </div>
      </div>

      <!-- SEÇÃO 3: CURSO & MODALIDADE -->
      <div class="space-y-4">
        <div class="border-b border-slate-200 pb-2">
          <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
            <span>🎓</span> 3. Curso Escolhido, Modalidade & Escolaridade Anterior
          </h2>
          <span class="text-xs text-slate-500">Selecione a formação desejada e o formato de aprendizado.</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Curso Desejado *</label>
            <select name="cursoId" id="matCursoId" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
              <?php foreach ($cursos as $c): ?>
                <option value="<?= $c['id'] ?>" <?= ($c['id'] === $cursoPreselecionadoId) ? 'selected' : '' ?>>
                  <?= htmlspecialchars($c['title']) ?> (<?= $c['workloadHours'] ?>h) — R$ <?= number_format($c['price'], 2, ',', '.') ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Modalidade de Ensino *</label>
            <select name="modalidade" id="matModalidade" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
              <option value="online">100% Online (Acesso Instantâneo)</option>
              <option value="hibrido">Híbrido (Online + Plantão Prático)</option>
              <option value="presencial_sg">Presencial na Oficina São Gonçalo</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Escolaridade Anterior *</label>
            <select name="escolaridade" id="matEscolaridade" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden">
              <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
              <option value="Ensino Médio Completo" selected>Ensino Médio Completo</option>
              <option value="Ensino Técnico">Ensino Técnico Concluído</option>
              <option value="Ensino Superior Completo">Ensino Superior Completo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 4: FOTO 3X4 DO ALUNO & DOCUMENTOS -->
      <div class="space-y-4">
        <div class="border-b border-slate-200 pb-2">
          <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
            <span>📷</span> 4. Foto 3x4 do Aluno & Documentos Comprobatórios
          </h2>
          <span class="text-xs text-slate-500">A foto será utilizada na Carteirinha Digital de Estudante DNE e no Registro Geral.</span>
        </div>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
          <img id="previewFotoAluno" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" alt="Foto do Aluno" class="w-24 h-32 rounded-xl object-cover border-2 border-indigo-600 shadow-md shrink-0">
          <div class="space-y-2 text-center sm:text-left">
            <strong class="text-slate-900 text-sm block">Foto 3x4 de Rosto do Aluno</strong>
            <p class="text-xs text-slate-500">Envie uma foto recente de frente com fundo claro.</p>
            <input type="file" name="fotoAluno" accept="image/*" onchange="previewImagemUpload(event)" class="text-xs file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="block text-slate-800">1. RG / CNH (Frente e Verso) *</strong>
            <input type="file" name="docRg" class="mt-1 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-800">
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="block text-slate-800">2. CPF Digitalizado / Comprovante Receita Federal *</strong>
            <input type="file" name="docCpf" class="mt-1 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-800">
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="block text-slate-800">3. Comprovante de Residência Recente (Máx. 90 dias) *</strong>
            <input type="file" name="docResidencia" class="mt-1 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-800">
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong class="block text-slate-800">4. Histórico Escolar / Certificado de Ensino Médio</strong>
            <input type="file" name="docHistorico" class="mt-1 text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-800">
          </div>
        </div>
      </div>

      <!-- SEÇÃO 5: TERMOS CONTRATUAIS & FORMA DE PAGAMENTO -->
      <div class="space-y-4">
        <div class="border-b border-slate-200 pb-2">
          <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
            <span>🛡️</span> 5. Contrato de Prestação de Serviços Educacionais & Pagamento
          </h2>
          <span class="text-xs text-slate-500">Termos legais conforme a Lei Federal nº 9.394/96 Art. 42 (Cursos Profissionalizantes Livres), Decreto nº 5.154/04 (MEC) e checkout no Mercado Pago.</span>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono text-[11px] max-h-36 overflow-y-auto leading-relaxed">
          <strong class="text-slate-900 block font-bold">CONTRATO DE MATRÍCULA E PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS (CURSO LIVRE)</strong>
          <p>Pelo presente instrumento, a CONTRATADA compromete-se a fornecer o acesso às aulas, material didático e expedição de Certificado de Curso Livre Profissionalizante registrado no Livro Oficial com amparo na Lei nº 9.394/96 Art. 42 e Decreto Federal nº 5.154/2004 (normas MEC para Educação Profissional de Nível Livre). O CONTRATANTE terá acesso facultativo ao Banco de Talentos da Cooperativa EduVanguard de Empregabilidade para empresas parceiras.</p>
        </div>

        <label class="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
          <input type="checkbox" name="termosAceitos" id="matTermos" required class="w-4 h-4 mt-0.5 rounded text-emerald-600 cursor-pointer">
          <span class="text-xs text-emerald-950 font-bold leading-tight">
            Li e aceito os termos do Contrato de Matrícula e autorizo o processamento com base na LGPD.
          </span>
        </label>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Forma de Pagamento Oficial via Mercado Pago</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label class="p-3.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-950 flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input type="radio" name="formaPagamento" value="pix" checked class="text-emerald-600">
              <span>PIX Instantâneo (-15% OFF)</span>
            </label>
            <label class="p-3.5 rounded-xl border border-indigo-200 bg-white text-slate-800 flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input type="radio" name="formaPagamento" value="cartao_credito" class="text-indigo-600">
              <span>Cartão de Crédito (até 12x)</span>
            </label>
            <label class="p-3.5 rounded-xl border border-indigo-200 bg-white text-slate-800 flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input type="radio" name="formaPagamento" value="boleto" class="text-indigo-600">
              <span>Boleto Bancário</span>
            </label>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200 flex justify-end">
        <button type="submit" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg cursor-pointer transition flex items-center gap-2">
          <span>✓ Finalizar Matrícula Oficial &rarr;</span>
        </button>
      </div>
    </form>
  <?php endif; ?>
</div>

<script>
  function preencherExemploMatricula() {
    document.getElementById('matNome').value = 'Lucas Silva Prado';
    document.getElementById('matCpf').value = '123.456.789-00';
    document.getElementById('matRg').value = '28.912.443-1';
    document.getElementById('matEmail').value = 'lucas.silva@aluno.eduvanguard.com';
    document.getElementById('matTelefone').value = '(21) 98112-9988';
    document.getElementById('matMae').value = 'Maria Silva Prado';
    document.getElementById('matPai').value = 'Antônio Carlos Prado';
    document.getElementById('matCep').value = '24440-400';
    document.getElementById('matRua').value = 'Rua Doutor Nilo Peçanha';
    document.getElementById('matNumero').value = '450';
    document.getElementById('matComplemento').value = 'Apt 302';
    document.getElementById('matBairro').value = 'Centro';
    document.getElementById('matCidade').value = 'São Gonçalo';
    document.getElementById('matEstado').value = 'RJ';
    document.getElementById('matTermos').checked = true;
  }

  function previewImagemUpload(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('previewFotoAluno').src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  async function consultarCepPhp(cep) {
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          document.getElementById('matRua').value = data.logradouro || '';
          document.getElementById('matBairro').value = data.bairro || '';
          document.getElementById('matCidade').value = data.localidade || 'São Gonçalo';
          document.getElementById('matEstado').value = data.uf || 'RJ';
        }
      } catch (e) {
        console.warn('Erro ao consultar CEP:', e);
      }
    }
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
