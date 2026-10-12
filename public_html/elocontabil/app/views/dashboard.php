<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel EloContábil • Apoio Administrativo & RH</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    @media (max-width: 640px) {
      .table-card tr { display: flex; flex-direction: column; margin-bottom: 1rem; border: 1px solid #334155; border-radius: 0.75rem; padding: 0.75rem; background: #0f172a; }
      .table-card td { display: flex; justify-content: space-between; padding: 0.4rem 0; border: none; }
      .table-card thead { display: none; }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col">

  <!-- Topbar -->
  <header class="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg">
            E
          </div>
          <span class="text-base font-extrabold text-white">Elo<span class="text-emerald-400">Contábil</span></span>
        </a>
        <span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md hidden md:inline-block">
          Sessão Temporária (30 min)
        </span>
      </div>

      <!-- Abas de Navegação -->
      <nav class="flex items-center gap-1 sm:gap-2 text-xs font-bold">
        <button onclick="trocarAba('rh')" id="btn-tab-rh" class="tab-btn px-3 py-2 rounded-lg bg-emerald-600 text-white transition-all">
          1. RH de Apoio
        </button>
        <button onclick="trocarAba('admin')" id="btn-tab-admin" class="tab-btn px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all">
          2. Administrativo & Cofre
        </button>
        <button onclick="trocarAba('camilla')" id="btn-tab-camilla" class="tab-btn px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all">
          3. Central Camilla
        </button>
        <a href="/logout" class="px-3 py-2 rounded-lg text-slate-400 hover:text-rose-400 transition-all ml-2" title="Sair">
          Sair
        </a>
      </nav>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">

    <!-- ==================== ABA 1: RH DE APOIO ==================== -->
    <section id="aba-rh" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-2xl font-black text-white">Módulo 1: RH de Apoio Simplificado</h2>
          <p class="text-xs text-slate-400">Controle de ponto, ASO, EPIs, uniformes e modelos de advertência sem burocracia.</p>
        </div>
        <button onclick="$('#modalFuncionario').removeClass('hidden')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20">
          <span>+</span> Novo Funcionário
        </button>
      </div>

      <!-- Cards de Métricas de RH -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span class="text-xs text-slate-400 font-semibold">Funcionários Ativos</span>
          <div class="text-2xl font-extrabold text-white mt-1"><?= count($dadosRH['funcionarios'] ?? []) ?></div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span class="text-xs text-amber-400 font-semibold">ASO Vencendo / Alerta</span>
          <div class="text-2xl font-extrabold text-amber-300 mt-1"><?= count($dadosRH['asos_vencendo'] ?? []) ?></div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span class="text-xs text-slate-400 font-semibold">EPIs & Uniformes</span>
          <div class="text-2xl font-extrabold text-emerald-400 mt-1">100% Entregues</div>
        </div>
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span class="text-xs text-slate-400 font-semibold">Holerites do Mês</span>
          <div class="text-2xl font-extrabold text-teal-400 mt-1">Prontos p/ Envio</div>
        </div>
      </div>

      <!-- Tabela de Funcionários -->
      <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <h3 class="text-sm font-bold text-white mb-4">Quadro de Colaboradores & Vencimentos</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs table-card">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800">
                <th class="pb-3">Nome / Cargo</th>
                <th class="pb-3">CPF</th>
                <th class="pb-3">Admissão</th>
                <th class="pb-3">Vencimento ASO</th>
                <th class="pb-3">Uniforme</th>
                <th class="pb-3">Termo EPI</th>
                <th class="pb-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <?php foreach ($dadosRH['funcionarios'] as $func): ?>
                <tr class="hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 font-semibold text-white">
                    <?= htmlspecialchars($func['nome']) ?>
                    <span class="block text-[10px] text-slate-400 font-normal"><?= htmlspecialchars($func['cargo']) ?></span>
                  </td>
                  <td class="py-3 text-slate-300"><?= htmlspecialchars($func['cpf']) ?></td>
                  <td class="py-3 text-slate-300"><?= date('d/m/Y', strtotime($func['admissao'])) ?></td>
                  <td class="py-3 font-medium text-amber-300">
                    <?= !empty($func['vencimento_aso']) ? date('d/m/Y', strtotime($func['vencimento_aso'])) : 'Não informado' ?>
                  </td>
                  <td class="py-3 text-slate-300">Tam. <?= htmlspecialchars($func['tamanho_uniforme'] ?? 'G') ?></td>
                  <td class="py-3">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Entregue
                    </span>
                  </td>
                  <td class="py-3 text-right">
                    <button class="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold">
                      Holerite WhatsApp
                    </button>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modelos de Documentos RH Prontos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            📄 Modelos Prontos de Advertência e Termos
          </h3>
          <p class="text-xs text-slate-400">Gere com 1 clique modelos juridicamente alinhados com a CLT para entrega aos colaboradores.</p>
          <div class="space-y-2 pt-2">
            <button class="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong class="text-white block">Termo de Entrega de EPI e Uniforme (NR-06)</strong>
                <span class="text-slate-400 text-[11px]">Declaração de recebimento e responsabilidade de conservação.</span>
              </div>
              <span class="text-emerald-400 font-bold">Baixar</span>
            </button>
            <button class="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong class="text-white block">Advertência Disciplinar Escrita (Art. 482 CLT)</strong>
                <span class="text-slate-400 text-[11px]">Para atrasos reiterados ou descumprimento de normas.</span>
              </div>
              <span class="text-emerald-400 font-bold">Baixar</span>
            </button>
          </div>
        </div>

        <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            📋 Checklists de Admissão & Demissão
          </h3>
          <p class="text-xs text-slate-400">Envie o link do checklist diretamente pelo WhatsApp da Camilla para o novo contratado.</p>
          <div class="space-y-2 pt-2">
            <button class="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong class="text-white block">Checklist Admissional Completo</strong>
                <span class="text-slate-400 text-[11px]">RG, CPF, CTPS Digital, ASO Admissional e Comprovante.</span>
              </div>
              <span class="text-teal-400 font-bold">Disparar WhatsApp</span>
            </button>
            <button class="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong class="text-white block">Checklist de Desligamento Homologado</strong>
                <span class="text-slate-400 text-[11px]">Exame Demissional, chaves e conferência pré-contábil.</span>
              </div>
              <span class="text-teal-400 font-bold">Disparar WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== ABA 2: ADMINISTRATIVO & COFRE ==================== -->
    <section id="aba-admin" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-2xl font-black text-white">Módulo 2: Administrativo & Cofre de Documentos</h2>
          <p class="text-xs text-slate-400">Guarda segura de alvarás, contratos, contas básicas e agenda de envio ao contador.</p>
        </div>
        <button onclick="$('#modalDocumento').removeClass('hidden')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20">
          <span>+</span> Novo Documento no Cofre
        </button>
      </div>

      <!-- Alerta da Regra do Dia 28 para o Contador -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <span>📅 Lembrete de Ouro: Enviar Documentos ao Contador até Dia 28</span>
          </div>
          <p class="text-xs text-slate-300">
            A Camilla dispara lembretes automáticos por WhatsApp e E-mail para que nada atrase a apuração dos seus tributos.
          </p>
        </div>
        <button class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap">
          Encaminhar Pacote do Mês Agora
        </button>
      </div>

      <!-- Tabela do Cofre de Documentos -->
      <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800">
        <h3 class="text-sm font-bold text-white mb-4">Cofre de Documentos & Licenças com Alerta de Vencimento</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs table-card">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800">
                <th class="pb-3">Título do Documento</th>
                <th class="pb-3">Categoria</th>
                <th class="pb-3">Data de Vencimento</th>
                <th class="pb-3">Status</th>
                <th class="pb-3">Enviado ao Contador</th>
                <th class="pb-3 text-right">Arquivo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <?php foreach ($dadosAdmin['documentos'] as $doc): ?>
                <tr class="hover:bg-slate-800/40 transition-colors">
                  <td class="py-3 font-semibold text-white"><?= htmlspecialchars($doc['titulo']) ?></td>
                  <td class="py-3 text-slate-400"><?= htmlspecialchars($doc['categoria']) ?></td>
                  <td class="py-3 font-semibold <?= $doc['status'] === 'alerta' ? 'text-amber-400' : 'text-slate-300' ?>">
                    <?= date('d/m/Y', strtotime($doc['vencimento'])) ?>
                  </td>
                  <td class="py-3">
                    <?php if ($doc['status'] === 'alerta'): ?>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Vence em Breve</span>
                    <?php else: ?>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Válido</span>
                    <?php endif; ?>
                  </td>
                  <td class="py-3">
                    <?= $doc['enviado_ao_contador'] ? '✅ Sim (E-mail)' : '⏳ Pendente' ?>
                  </td>
                  <td class="py-3 text-right">
                    <button class="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]">
                      Baixar PDF
                    </button>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Resumo Financeiro Básico -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-white">Contas Básicas a Pagar</h3>
            <span class="text-xs font-bold text-rose-400">R$ <?= number_format($dadosAdmin['totalPagar'], 2, ',', '.') ?></span>
          </div>
          <p class="text-xs text-slate-400 leading-normal">
            Lançamentos simples para conferência prévia antes do fechamento com seu escritório contábil.
          </p>
        </div>

        <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-white">Previsão Básica a Receber</h3>
            <span class="text-xs font-bold text-emerald-400">R$ <?= number_format($dadosAdmin['totalReceber'], 2, ',', '.') ?></span>
          </div>
          <p class="text-xs text-slate-400 leading-normal">
            Conciliação primária de receitas por PIX e contratos vigentes da empresa.
          </p>
        </div>
      </div>
    </section>

    <!-- ==================== ABA 3: CENTRAL DA CAMILLA ==================== -->
    <section id="aba-camilla" class="space-y-6 hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-2xl font-black text-white">Módulo 3: Central da Camilla (Atendente Virtual)</h2>
          <p class="text-xs text-slate-400">Conectada ao Webhook Centralizado (webhook.grupoeloizio.com.br) para atendimento e triagem.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold text-emerald-400">Hub Centralizado Ativo</span>
        </div>
      </div>

      <!-- Banner da Camilla Faria -->
      <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-3xl font-bold shadow-lg">
          👩‍💼
        </div>
        <div class="space-y-1 text-center md:text-left flex-1">
          <h3 class="text-base font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
            Camilla Faria
            <span class="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">WhatsApp Oficial: 21 99613-4073</span>
          </h3>
          <p class="text-xs text-slate-400">
            "Olá! Eu recebo suas notas e holerites por link seguro temporário, envio lembretes amigáveis e encaminho tudo mastigadinho por e-mail para seu contador responsável."
          </p>
          <div class="text-[11px] text-slate-500 pt-1">
            Destinatário contábil cadastrado: <code class="text-slate-300">contabilidade@grupoeloizio.com.br</code>
          </div>
        </div>
      </div>

      <!-- Histórico de Disparos e Triagens -->
      <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 class="text-sm font-bold text-white">Atendimentos Recentes & Envios ao Contador</h3>
        <div class="space-y-3">
          <?php foreach ($dadosCamilla['historico'] as $hist): ?>
            <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                  <?= htmlspecialchars($hist['tipo']) ?>
                </span>
                <div>
                  <strong class="text-white block"><?= htmlspecialchars($hist['assunto']) ?></strong>
                  <span class="text-slate-400 text-[11px]">Para: <?= htmlspecialchars($hist['destinatario']) ?></span>
                </div>
              </div>
              <div class="flex items-center gap-3 text-right">
                <span class="text-[11px] text-emerald-400 font-semibold"><?= htmlspecialchars($hist['status']) ?></span>
                <span class="text-slate-500 text-[10px]"><?= htmlspecialchars($hist['data']) ?></span>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
  </main>

  <!-- Modais -->
  <!-- Modal Funcionário -->
  <div id="modalFuncionario" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
      <h3 class="text-base font-bold text-white">Cadastrar Novo Funcionário</h3>
      <form action="/acao/salvar_funcionario" method="POST" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">Nome Completo</label>
          <input type="text" name="nome" required class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Cargo</label>
          <input type="text" name="cargo" required class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-slate-400 mb-1">CPF</label>
            <input type="text" name="cpf" required class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Admissão</label>
            <input type="date" name="admissao" required class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-slate-400 mb-1">Vencimento ASO</label>
            <input type="date" name="vencimento_aso" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Tamanho Uniforme</label>
            <select name="tamanho_uniforme" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white">
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G" selected>G</option>
              <option value="GG">GG</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-2">
          <input type="checkbox" name="epi_entregue" id="epi_check" checked class="rounded" />
          <label for="epi_check" class="text-slate-300">Termo de EPI e Uniforme entregue e assinado</label>
        </div>
        <div class="flex items-center justify-end gap-2 pt-4">
          <button type="button" onclick="$('#modalFuncionario').addClass('hidden')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancelar</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Salvar Colaborador</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Documento Cofre -->
  <div id="modalDocumento" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
      <h3 class="text-base font-bold text-white">Adicionar Documento ao Cofre</h3>
      <form action="/acao/salvar_documento" method="POST" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">Título do Documento</label>
          <input type="text" name="titulo" placeholder="Ex: Alvará de Funcionamento 2027" required class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Categoria</label>
          <select name="categoria" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white">
            <option value="Alvarás e Licenças">Alvarás e Licenças</option>
            <option value="Contratos">Contratos</option>
            <option value="Certidões">Certidões</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Data de Vencimento</label>
          <input type="date" name="vencimento" required class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white" />
        </div>
        <div class="flex items-center gap-2 pt-2">
          <input type="checkbox" name="enviado_ao_contador" id="env_cont_check" checked class="rounded" />
          <label for="env_cont_check" class="text-slate-300">Marcar cópia enviada ao contador</label>
        </div>
        <div class="flex items-center justify-end gap-2 pt-4">
          <button type="button" onclick="$('#modalDocumento').addClass('hidden')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancelar</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Salvar no Cofre</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Rodapé Obrigatório (Regra de Ouro) -->
  <footer class="border-t border-slate-800 bg-slate-950/80 py-6 px-4 text-center mt-auto">
    <div class="max-w-4xl mx-auto space-y-2">
      <p class="text-xs font-semibold text-emerald-400">
        "EloContábil é apoio administrativo, não substitui seu contador responsável."
      </p>
      <p class="text-[11px] text-slate-500">
        Grupo Eloizio • Subdomínio: <code>elocontabil.grupoeloizio.com.br</code> • Apoio em São Gonçalo - RJ e todo o Brasil.
      </p>
    </div>
  </footer>

  <script>
    function trocarAba(aba) {
      $('#aba-rh, #aba-admin, #aba-camilla').addClass('hidden');
      $('#btn-tab-rh, #btn-tab-admin, #btn-tab-camilla').removeClass('bg-emerald-600 text-white').addClass('bg-slate-800 text-slate-300');
      
      $('#aba-' + aba).removeClass('hidden');
      $('#btn-tab-' + aba).removeClass('bg-slate-800 text-slate-300').addClass('bg-emerald-600 text-white');
    }

    // Leitura de parâmetros de URL para aba inicial
    var urlParams = new URLSearchParams(window.location.search);
    var tab = urlParams.get('tab');
    if (tab && ['rh', 'admin', 'camilla'].includes(tab)) {
      trocarAba(tab);
    }
  </script>
</body>
</html>
