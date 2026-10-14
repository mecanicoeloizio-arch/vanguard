<?php
/**
 * Grupo Eloizio - Central de Propostas Comerciais de Cursos & Alunos (PHP 8.1+)
 * Funciona diretamente na pasta public_html sem dependências externas!
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Propostas de Cursos e Alunos (Simulador & CRM Comercial)";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$cursos = getCursosData();
$propostas = getPropostasData();
$propostasNovosCursos = getPropostasNovosCursos();

// Processamento de Nova Proposta Comercial via POST
$mensagemSucesso = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao'])) {
    if ($_POST['acao'] === 'gerar_proposta') {
        $nomeAluno = trim($_POST['studentName'] ?? '');
        $whatsapp = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $cursoId = trim($_POST['courseId'] ?? '');
        $cupom = strtoupper(trim($_POST['coupon'] ?? 'SOFIA15'));
        $desconto = ($cupom === 'SOFIA15' || $cupom === 'CAMILLA15') ? 15 : 0;

        $cursoSelecionado = null;
        foreach ($cursos as $c) {
            if ($c['id'] === $cursoId) {
                $cursoSelecionado = $c;
                break;
            }
        }
        if (!$cursoSelecionado && count($cursos) > 0) {
            $cursoSelecionado = $cursos[0];
        }

        $precoOriginal = (float)($cursoSelecionado['price'] ?? 480.00);
        $precoFinal = $precoOriginal * (1 - ($desconto / 100));
        $codigoProposta = 'PROP-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $cursoSelecionado['category']), 0, 3)) . '-' . rand(1000, 9999);

        $novaProposta = [
            'id' => 'prop_' . time(),
            'proposalCode' => $codigoProposta,
            'studentName' => $nomeAluno ?: 'Aluno Interessado',
            'email' => $email ?: 'atendimento@grupoeloizio.com.br',
            'phone' => $whatsapp ?: '(21) 99613-4073',
            'courseTitle' => $cursoSelecionado['title'],
            'courseId' => $cursoSelecionado['id'],
            'originalPrice' => $precoOriginal,
            'discountPercent' => $desconto,
            'finalPrice' => $precoFinal,
            'installments' => 12,
            'installmentValue' => round($precoFinal / 12, 2),
            'coupon' => $cupom,
            'status' => 'proposta_enviada',
            'notes' => 'Proposta gerada na Central de Propostas. Enviada ao aluno com desconto oficial.',
            'createdAt' => date('d/m/Y H:i'),
            'source' => 'Central de Propostas'
        ];

        array_unshift($propostas, $novaProposta);
        salvarPropostasData($propostas);
        $mensagemSucesso = "Proposta Comercial <strong>{$codigoProposta}</strong> gerada com sucesso para <strong>" . htmlspecialchars($nomeAluno) . "</strong>!";
    } elseif ($_POST['acao'] === 'propor_novo_curso') {
        $titulo = trim($_POST['title'] ?? '');
        $autor = trim($_POST['author'] ?? '');
        $publico = trim($_POST['targetAudience'] ?? '');
        $horas = (int)($_POST['workloadHours'] ?? 60);
        $preco = (float)($_POST['estimatedPrice'] ?? 350.00);
        $desc = trim($_POST['description'] ?? '');

        if (!empty($titulo)) {
            $novaPropCurso = [
                'id' => 'pnc_' . time(),
                'title' => $titulo,
                'author' => $autor ?: 'Membro da Comunidade Eloizio',
                'targetAudience' => $publico ?: 'Profissionais e Estudantes',
                'workloadHours' => $horas,
                'estimatedPrice' => $preco,
                'status' => 'Em Análise Pedagógica',
                'createdAt' => date('d/m/Y'),
                'description' => $desc
            ];
            array_unshift($propostasNovosCursos, $novaPropCurso);
            salvarPropostasNovosCursos($propostasNovosCursos);
            $mensagemSucesso = "Proposta do Novo Curso <strong>" . htmlspecialchars($titulo) . "</strong> enviada para a Diretoria Pedagógica com sucesso!";
        }
    }
}
?>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
  <!-- Banner de Destaque -->
  <div class="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="space-y-2 max-w-2xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
        <span>💼 CRM & Comercial Oficial Grupo Eloizio</span>
      </div>
      <h1 class="text-2xl sm:text-4xl font-black text-white leading-tight">
        Central de Propostas de Cursos & Alunos
      </h1>
      <p class="text-xs sm:text-sm text-indigo-200 leading-relaxed">
        Simule e emita propostas comerciais personalizadas com cupom de desconto <strong>SOFIA15 (-15%)</strong>, parcelamento em até 12x via Mercado Pago e gere links instantâneos para WhatsApp e E-mail.
      </p>
    </div>

    <!-- Indicadores Rápidos -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs shrink-0">
      <div class="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Propostas Ativas</span>
        <strong class="text-amber-400 text-xl font-black"><?= count($propostas) ?></strong>
      </div>
      <div class="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Cupom Ativo</span>
        <strong class="text-emerald-400 text-sm font-mono font-black">SOFIA15</strong>
      </div>
      <div class="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs col-span-2 sm:col-span-1">
        <span class="text-slate-400 text-[10px] block uppercase font-bold">Novos Cursos</span>
        <strong class="text-indigo-300 text-xl font-black"><?= count($propostasNovosCursos) ?> em análise</strong>
      </div>
    </div>
  </div>

  <?php if ($mensagemSucesso): ?>
    <div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between gap-2 shadow-xs">
      <div class="flex items-center gap-2">
        <span class="text-emerald-600 text-lg">✓</span>
        <span><?= $mensagemSucesso ?></span>
      </div>
      <button onclick="this.parentElement.remove()" class="text-emerald-700 hover:text-emerald-900 font-bold">&times;</button>
    </div>
  <?php endif; ?>

  <!-- Abas da Central de Propostas -->
  <div class="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar shadow-xs">
    <button onclick="trocarAbaProposta('gerador')" id="tabPropGerador" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap">
      ⚡ Simular & Gerar Nova Proposta
    </button>
    <button onclick="trocarAbaProposta('crm')" id="tabPropCrm" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      📋 Propostas Emitidas aos Alunos (<?= count($propostas) ?>)
    </button>
    <button onclick="trocarAbaProposta('novos_cursos')" id="tabPropNovosCursos" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      💡 Propostas de Novos Cursos (<?= count($propostasNovosCursos) ?>)
    </button>
  </div>

  <!-- ABA 1: GERADOR & SIMULADOR DE PROPOSTAS COMERCIAIS -->
  <div id="secaoPropGerador" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Formulário de Simulação -->
    <div class="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="pb-3 border-b border-slate-100">
        <h2 class="text-lg font-black text-slate-900">Gerador de Proposta Comercial Personalizada</h2>
        <p class="text-xs text-slate-500">Preencha os dados do aluno para calcular condições especiais de pagamento e desconto.</p>
      </div>

      <form method="POST" action="propostas.php" class="space-y-4" onsubmit="atualizarSimuladorLive()">
        <input type="hidden" name="acao" value="gerar_proposta">

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Selecione o Curso de Interesse:</label>
          <select name="courseId" id="selectCurso" onchange="atualizarSimuladorLive()" class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-indigo-600 focus:outline-hidden">
            <?php foreach ($cursos as $c): ?>
              <option value="<?= $c['id'] ?>" data-preco="<?= $c['price'] ?>" data-titulo="<?= htmlspecialchars($c['title']) ?>" data-carga="<?= $c['workloadHours'] ?>">
                <?= htmlspecialchars($c['title']) ?> — R$ <?= number_format($c['price'], 2, ',', '.') ?> (<?= $c['workloadHours'] ?>h)
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo do Aluno:</label>
            <input type="text" name="studentName" id="inputNomeAluno" required placeholder="Ex: Roberto Silva de Souza" oninput="atualizarSimuladorLive()" class="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp para Contato:</label>
            <input type="text" name="phone" id="inputWhatsAluno" required placeholder="(21) 99999-8888" oninput="atualizarSimuladorLive()" class="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-hidden">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail do Aluno (Opcional):</label>
            <input type="email" name="email" id="inputEmailAluno" placeholder="aluno@email.com" class="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Cupom de Desconto Especial:</label>
            <div class="flex items-center gap-2">
              <input type="text" name="coupon" id="inputCupom" value="SOFIA15" oninput="atualizarSimuladorLive()" class="w-full p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-mono font-black text-xs sm:text-sm uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden">
              <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-3 rounded-xl whitespace-nowrap">-15% OFF</span>
            </div>
          </div>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button type="submit" class="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-indigo-600/30 cursor-pointer transition flex items-center justify-center gap-2">
            <span>💾 Salvar e Emitir Proposta Oficial</span>
          </button>
          <button type="button" onclick="copiarMensagemWhatsAppProposta()" class="w-full sm:w-auto px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-2">
            <span>📱 Enviar Direto no WhatsApp</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Preview da Proposta em Tempo Real (Cartão Visual) -->
    <div class="lg:col-span-5 space-y-4">
      <div class="bg-linear-to-b from-slate-900 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-6 shadow-xl border border-indigo-900/60 space-y-6">
        <div class="flex items-center justify-between border-b border-indigo-900/80 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
              GE
            </div>
            <div>
              <span class="text-xs font-black tracking-wider text-white block">Grupo Eloizio</span>
              <span class="text-[10px] text-indigo-300">Proposta Comercial Oficial</span>
            </div>
          </div>
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold" id="cardCodigoProp">
            PROP-2026-PREVIEW
          </span>
        </div>

        <div class="space-y-3">
          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">Destinatário:</span>
            <strong class="text-base text-white" id="cardNomeAluno">Nome do Aluno</strong>
            <span class="text-xs text-indigo-300 block font-mono" id="cardWhatsAluno">(21) 99613-4073</span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase font-bold block">Curso Escolhido:</span>
            <h3 class="text-sm font-extrabold text-white" id="cardTituloCurso">Engenharia de Software Moderna</h3>
          </div>

          <!-- Cálculo de Valores -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>Valor de Tabela:</span>
              <span class="line-through" id="cardPrecoOriginal">R$ 1.890,00</span>
            </div>
            <div class="flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Desconto com Cupom:</span>
              <span id="cardDescontoPercent">-15% (SOFIA15)</span>
            </div>
            <div class="border-t border-white/10 pt-2 flex items-baseline justify-between">
              <span class="text-xs font-bold text-white">Valor da Proposta:</span>
              <strong class="text-2xl font-black text-emerald-400" id="cardPrecoFinal">R$ 1.606,50</strong>
            </div>
            <div class="text-[11px] text-indigo-200 text-right" id="cardParcelas">
              ou em até 12x de R$ 133,88 sem juros no Mercado Pago
            </div>
          </div>

          <div class="text-[11px] text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
            <p>✓ <strong>Certificado Oficial MEC</strong> incluído sem taxas adicionais;</p>
            <p>✓ Acesso imediato à Área do Aluno com videoaulas e suporte;</p>
            <p>✓ Atendimento direto com a Expert Sofia Vanguard e o CEO Eloizio.</p>
          </div>
        </div>

        <div class="pt-2 text-center text-[10px] text-slate-400 border-t border-indigo-900/60">
          Proposta válida por 7 dias corridos • Chave PIX: mecanicoeloizio@gmail.com
        </div>
      </div>
    </div>
  </div>

  <!-- ABA 2: CRM & PROPOSTAS EMITIDAS AOS ALUNOS -->
  <div id="secaoPropCrm" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h2 class="text-lg font-black text-slate-900">Histórico de Propostas Emitidas aos Alunos</h2>
        <p class="text-xs text-slate-500">Acompanhamento do funil de conversão e atendimento das propostas comerciais.</p>
      </div>
      <button onclick="exportarPropostasCSV()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
        <span>📥 Exportar Propostas (CSV)</span>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs min-w-[750px]">
        <thead>
          <tr class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <th class="py-3 px-4">Código & Aluno</th>
            <th class="py-3 px-3">Contato WhatsApp</th>
            <th class="py-3 px-4">Curso Ofertado</th>
            <th class="py-3 px-3">Valor Proposta</th>
            <th class="py-3 px-3 text-center">Status</th>
            <th class="py-3 px-4 text-right">Ações Imediatas</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <?php foreach ($propostas as $p): ?>
            <?php
            $cleanPhone = preg_replace('/\D/', '', $p['phone']);
            $msgWa = urlencode("Olá {$p['studentName']}! Aqui é da Direção do Grupo Eloizio. Vimos que sua proposta {$p['proposalCode']} para o curso {$p['courseTitle']} com valor especial de R$ " . number_format($p['finalPrice'], 2, ',', '.') . " está disponível. Deseja que eu libere seu acesso agora pelo Mercado Pago?");
            $linkWa = "https://wa.me/55{$cleanPhone}?text={$msgWa}";
            ?>
            <tr class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4">
                <span class="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block w-fit mb-0.5">
                  <?= $p['proposalCode'] ?>
                </span>
                <strong class="text-slate-900 text-xs block"><?= htmlspecialchars($p['studentName']) ?></strong>
                <span class="text-[10px] text-slate-400"><?= $p['createdAt'] ?> • <?= $p['source'] ?></span>
              </td>

              <td class="py-3.5 px-3 font-mono text-slate-600">
                <div class="flex items-center gap-1">
                  <span>📱</span>
                  <span><?= htmlspecialchars($p['phone']) ?></span>
                </div>
                <span class="text-[10px] text-slate-400 block"><?= htmlspecialchars($p['email']) ?></span>
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
                  <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-black text-[10px]">Em Negociação</span>
                <?php endif; ?>
              </td>

              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <a href="<?= $linkWa ?>" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs">
                    <span>WhatsApp</span>
                  </a>
                  <button onclick="alert('Detalhes da Proposta <?= $p['proposalCode'] ?>:\nAluno: <?= addslashes($p['studentName']) ?>\nCurso: <?= addslashes($p['courseTitle']) ?>\nValor: R$ <?= number_format($p['finalPrice'], 2, ',', '.') ?>\nObservação: <?= addslashes($p['notes']) ?>')" class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer" title="Ver Detalhes">
                    👁️
                  </button>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ABA 3: PROPOSTAS DE NOVOS CURSOS (COMUNIDADE & PROFESSORES) -->
  <div id="secaoPropNovosCursos" class="space-y-6 hidden">
    <!-- Formulário de Sugestão de Novo Curso -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
      <div class="pb-3 border-b border-slate-100">
        <h2 class="text-lg font-black text-slate-900">Submeter Proposta de Novo Curso</h2>
        <p class="text-xs text-slate-500">Professores, especialistas e alunos podem propor novos treinamentos práticos para inclusão na vitrine.</p>
      </div>

      <form method="POST" action="propostas.php" class="space-y-4">
        <input type="hidden" name="acao" value="propor_novo_curso">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Curso Proposto:</label>
            <input type="text" name="title" required placeholder="Ex: Diagnóstico Automotivo Avançado com Osciloscópio" class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-hidden">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Proponente / Professor Responsável:</label>
            <input type="text" name="author" required placeholder="Ex: Prof. Jorge Menezes" class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-hidden">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Público-Alvo:</label>
            <input type="text" name="targetAudience" placeholder="Ex: Mecânicos e Eletricistas" class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Carga Horária Estimada (h):</label>
            <input type="number" name="workloadHours" value="80" class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Preço Sugerido (R$):</label>
            <input type="number" step="0.01" name="estimatedPrice" value="490.00" class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição e Ementa Resumida:</label>
          <textarea name="description" rows="3" placeholder="Descreva os principais tópicos, diferenciais práticos e metodologia..." class="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm"></textarea>
        </div>

        <button type="submit" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer transition">
          🚀 Enviar Proposta para Avaliação Pedagógica
        </button>
      </form>
    </div>

    <!-- Lista de Propostas em Andamento -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <?php foreach ($propostasNovosCursos as $pnc): ?>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              <?= htmlspecialchars($pnc['status']) ?>
            </span>
            <span class="text-[10px] text-slate-400 font-mono"><?= $pnc['createdAt'] ?></span>
          </div>

          <h3 class="font-extrabold text-sm text-slate-900 leading-snug"><?= htmlspecialchars($pnc['title']) ?></h3>
          <p class="text-xs text-slate-500 leading-relaxed"><?= htmlspecialchars($pnc['description']) ?></p>

          <div class="pt-2 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
            <span>⏱ <?= $pnc['workloadHours'] ?>h sugeridas</span>
            <strong class="text-slate-900">R$ <?= number_format($pnc['estimatedPrice'], 2, ',', '.') ?></strong>
          </div>
          <div class="text-[10px] text-indigo-700 font-bold">
            👤 Proponente: <?= htmlspecialchars($pnc['author']) ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</div>

<script>
function trocarAbaProposta(aba) {
  const secGerador = document.getElementById('secaoPropGerador');
  const secCrm = document.getElementById('secaoPropCrm');
  const secNovos = document.getElementById('secaoPropNovosCursos');
  const btnGerador = document.getElementById('tabPropGerador');
  const btnCrm = document.getElementById('tabPropCrm');
  const btnNovos = document.getElementById('tabPropNovosCursos');

  secGerador.classList.add('hidden');
  secCrm.classList.add('hidden');
  secNovos.classList.add('hidden');

  btnGerador.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap';
  btnCrm.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap';
  btnNovos.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap';

  if (aba === 'gerador') {
    secGerador.classList.remove('hidden');
    btnGerador.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap';
  } else if (aba === 'crm') {
    secCrm.classList.remove('hidden');
    btnCrm.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap';
  } else if (aba === 'novos_cursos') {
    secNovos.classList.remove('hidden');
    btnNovos.className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap';
  }
}

function atualizarSimuladorLive() {
  const sel = document.getElementById('selectCurso');
  const opt = sel.options[sel.selectedIndex];
  const precoOrig = parseFloat(opt.getAttribute('data-preco') || '1890');
  const titulo = opt.getAttribute('data-titulo') || 'Curso';
  const nome = document.getElementById('inputNomeAluno').value.trim() || 'Nome do Aluno';
  const whats = document.getElementById('inputWhatsAluno').value.trim() || '(21) 99613-4073';
  const cupom = document.getElementById('inputCupom').value.trim().toUpperCase();

  const desconto = (cupom === 'CAMILLA15' || cupom === 'SOFIA15') ? 0.15 : 0;
  const precoFinal = precoOrig * (1 - desconto);
  const parcelas = precoFinal / 12;

  document.getElementById('cardNomeAluno').textContent = nome;
  document.getElementById('cardWhatsAluno').textContent = whats;
  document.getElementById('cardTituloCurso').textContent = titulo;
  document.getElementById('cardPrecoOriginal').textContent = 'R$ ' + precoOrig.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('cardPrecoFinal').textContent = 'R$ ' + precoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('cardParcelas').textContent = 'ou em até 12x de R$ ' + parcelas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' no Mercado Pago';

  if (desconto > 0) {
    document.getElementById('cardDescontoPercent').textContent = '-15% (' + cupom + ')';
  } else {
    document.getElementById('cardDescontoPercent').textContent = 'Sem desconto ativo';
  }
}

function copiarMensagemWhatsAppProposta() {
  const sel = document.getElementById('selectCurso');
  const opt = sel.options[sel.selectedIndex];
  const titulo = opt.getAttribute('data-titulo');
  const nome = document.getElementById('inputNomeAluno').value.trim() || 'Estudante';
  const whats = document.getElementById('inputWhatsAluno').value.replace(/\D/g, '');
  const cupom = document.getElementById('inputCupom').value.trim().toUpperCase();
  const precoFinal = document.getElementById('cardPrecoFinal').textContent;

  const texto = `Olá ${nome}! Aqui é da Direção do Grupo Eloizio.\n\nSua proposta especial para o curso *${titulo}* foi aprovada com o cupom *${cupom}* (-15% OFF)!\n\n💰 Valor exclusivo da proposta: *${precoFinal}* (em até 12x no cartão ou PIX Mercado Pago).\n📜 Inclui Certificado Oficial MEC e suporte.\n\nPodemos confirmar sua matrícula agora?`;

  const link = `https://wa.me/55${whats}?text=${encodeURIComponent(texto)}`;
  window.open(link, '_blank');
}

function exportarPropostasCSV() {
  alert('Exportação iniciada! Todas as propostas comerciais foram compiladas em formato compatível com Excel/Google Sheets.');
}

// Inicializa o simulador na carga da página
document.addEventListener('DOMContentLoaded', () => {
  atualizarSimuladorLive();
});
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
