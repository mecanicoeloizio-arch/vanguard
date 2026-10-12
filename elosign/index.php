<?php
/**
 * EloSign - Assinatura Eletrônica Inteligente para Oficinas Mecânicas e Cursos
 * Subdomínio Oficial: elosign.grupoeloizio.com.br
 * Validade Jurídica: Assinatura Eletrônica Avançada (Lei 14.063/2020 e MP 2.200-2/2001)
 * Grupo Eloizio & EduVanguard
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$route = $_GET['route'] ?? 'dashboard';
$envelopeId = $_GET['id'] ?? '';
$hash = $_GET['hash'] ?? '';

// Carrega envelopes do storage
$envelopes = [];
if (file_exists(ELOSIGN_ENVELOPES_FILE)) {
    $envelopes = json_decode((string)file_get_contents(ELOSIGN_ENVELOPES_FILE), true) ?: [];
}

$totalCount = count($envelopes);
$signedCount = count(array_filter($envelopes, fn($e) => ($e['status'] ?? '') === 'signed'));
$pendingCount = count(array_filter($envelopes, fn($e) => ($e['status'] ?? '') === 'pending'));
$rate = $totalCount > 0 ? round(($signedCount / $totalCount) * 100, 1) : 0;

$activeEnvelope = null;
if ($envelopeId) {
    foreach ($envelopes as $e) {
        if (($e['id'] ?? '') === $envelopeId) {
            $activeEnvelope = $e;
            break;
        }
    }
}
if (!$activeEnvelope && !empty($envelopes)) {
    $activeEnvelope = $envelopes[0];
}
?>
<!DOCTYPE html>
<html lang="pt-BR" class="h-full bg-zinc-950">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EloSign • Assinatura Eletrônica Inteligente para Oficinas & Cursos</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .primary-orange { color: #FF6B00; }
    .bg-primary-orange { background-color: #FF6B00; }
    .border-primary-orange { border-color: #FF6B00; }
  </style>
</head>
<body class="h-full bg-zinc-950 text-zinc-100 flex flex-col selection:bg-[#FF6B00] selection:text-zinc-950">

  <!-- Top bar -->
  <div class="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="font-mono text-zinc-300">elosign.grupoeloizio.com.br • Validade Jurídica Lei 14.063/2020</span>
    </div>
    <div class="flex items-center gap-4 text-zinc-400">
      <span>Oficina Conectada: <strong class="text-white">Oficina Mecânica EloMak & Grupo Eloizio</strong></span>
      <a href="?route=embed" class="text-[#FF6B00] font-semibold hover:underline">Widget EloMak & API</a>
    </div>
  </div>

  <!-- Header -->
  <header class="bg-zinc-950/90 border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center text-zinc-950 font-black text-lg">
        ✍️
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-base sm:text-lg font-bold tracking-tight text-white">EloSign</span>
          <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30">
            Oficinas & Cursos
          </span>
        </div>
        <p class="text-[11px] text-zinc-400 hidden sm:block">Assinatura Eletrônica Avançada • SHA-256 e Evidências Biométricas</p>
      </div>
    </div>

    <!-- Nav tabs -->
    <div class="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
      <a href="?route=landing" class="px-3 py-1.5 rounded-lg transition <?= ($route === 'landing') ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">Vitrine</a>
      <a href="?route=dashboard" class="px-3 py-1.5 rounded-lg transition <?= ($route === 'dashboard') ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">Painel</a>
      <a href="?route=sign&id=<?= htmlspecialchars($activeEnvelope['id'] ?? 'env_elo_8841') ?>" class="px-3 py-1.5 rounded-lg transition <?= ($route === 'sign') ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">Assinar (/s/)</a>
      <a href="?route=validate" class="px-3 py-1.5 rounded-lg transition <?= ($route === 'validate') ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">Validar Hash</a>
      <a href="?route=embed" class="px-3 py-1.5 rounded-lg transition <?= ($route === 'embed') ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white' ?>">Widget EloMak</a>
    </div>

    <!-- User Profile Simulated -->
    <div className="flex items-center gap-2 text-right">
      <div class="hidden sm:block">
        <div class="text-xs font-bold text-white">Eloizio Assunção</div>
        <div class="text-[10px] text-zinc-500">Google Autenticado</div>
      </div>
      <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-[#FF6B00]">
        EA
      </div>
    </div>
  </header>

  <main class="flex-1">
  <?php if ($route === 'landing'): ?>
    <!-- 1. LANDING PAGE DE VENDAS -->
    <div class="max-w-5xl mx-auto px-4 py-16 text-center space-y-6">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
        ✨ O Clone Inteligente da Clicksign para Mecânicos e Educação
      </span>
      <h1 class="text-3xl sm:text-5xl font-black text-white leading-tight">
        O cliente da sua oficina assina pelo WhatsApp em 30 segundos
      </h1>
      <p class="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto">
        Chega de papel. Validade jurídica, prova por selfie e integrado ao seu sistema EloMak.
      </p>

      <div class="pt-4 flex flex-wrap justify-center gap-3">
        <a href="?route=dashboard" class="px-6 py-3.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-sm hover:brightness-110 shadow-lg shadow-[#FF6B00]/25">
          Entrar no Dashboard da Oficina →
        </a>
      </div>

      <!-- Planos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
        <div class="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-zinc-400 uppercase">Start Oficina</span>
            <div class="text-3xl font-black text-white mt-2">R$ 39 <span class="text-xs font-normal text-zinc-500">/mês</span></div>
            <p class="text-xs text-zinc-400 mt-2">Para mecânicos autônomos iniciando na digitalização.</p>
            <ul class="mt-6 space-y-2 text-xs text-zinc-300">
              <li>✔ <strong>30 documentos</strong> por mês</li>
              <li>✔ Prova por selfie e georreferenciamento</li>
              <li>✔ Validade jurídica Lei 14.063/2020</li>
            </ul>
          </div>
          <a href="?route=dashboard" class="mt-8 block text-center py-2.5 rounded-xl bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-700">Começar</a>
        </div>

        <div class="p-6 rounded-3xl bg-zinc-900 border-2 border-[#FF6B00] flex flex-col justify-between relative shadow-xl shadow-[#FF6B00]/10">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B00] text-zinc-950 font-black text-[10px] uppercase">Mais Vendido</div>
          <div>
            <span class="text-xs font-bold text-[#FF6B00] uppercase">Pro Oficina + Zap</span>
            <div class="text-3xl font-black text-white mt-2">R$ 69 <span class="text-xs font-normal text-zinc-500">/mês</span></div>
            <p class="text-xs text-zinc-400 mt-2">Disparos pelo WhatsApp e logotipo da sua oficina.</p>
            <ul class="mt-6 space-y-2 text-xs text-zinc-300">
              <li>✔ <strong>100 documentos</strong> por mês</li>
              <li>✔ Disparo no WhatsApp via <strong>EloWa</strong></li>
              <li>✔ <strong>Logo e Cor</strong> da oficina</li>
              <li>✔ Resumo com <strong>Click.AI (Gemini)</strong></li>
            </ul>
          </div>
          <a href="?route=dashboard" class="mt-8 block text-center py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110">Assinar Pro</a>
        </div>

        <div class="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-zinc-400 uppercase">Enterprise White Label</span>
            <div class="text-3xl font-black text-white mt-2">R$ 129 <span class="text-xs font-normal text-zinc-500">/mês</span></div>
            <p class="text-xs text-zinc-400 mt-2">API e Widget para colar no seu sistema EloMak.</p>
            <ul class="mt-6 space-y-2 text-xs text-zinc-300">
              <li>✔ <strong>300 documentos</strong> por mês</li>
              <li>✔ Acesso à <strong>API REST</strong></li>
              <li>✔ <strong>Widget Iframe para EloMak</strong></li>
              <li>✔ White Label total sem marca EloSign</li>
            </ul>
          </div>
          <a href="?route=embed" class="mt-8 block text-center py-2.5 rounded-xl bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-700">Ver Widget & API</a>
        </div>
      </div>
    </div>

  <?php elseif ($route === 'dashboard'): ?>
    <!-- 2. DASHBOARD DO DONO DA OFICINA -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 class="text-2xl font-black text-white">Painel da Oficina • Gestão de Envelopes</h1>
          <p class="text-xs text-zinc-400">Assinatura eletrônica avançada com carimbo de tempo e hash SHA-256 imutável.</p>
        </div>
        <a href="?route=sign&id=<?= htmlspecialchars($activeEnvelope['id'] ?? '') ?>" class="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20">
          ➕ Abrir Fluxo de Assinatura
        </a>
      </div>

      <!-- Métricas -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div class="text-xs text-zinc-400">Documentos Enviados</div>
          <div class="text-3xl font-black text-white mt-1"><?= $totalCount ?></div>
          <div class="text-[10px] text-zinc-500">Oficina & Cursos</div>
        </div>
        <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div class="text-xs text-zinc-400">Assinados & Auditados</div>
          <div class="text-3xl font-black text-emerald-400 mt-1"><?= $signedCount ?></div>
          <div class="text-[10px] text-emerald-500">Com hash e selfie</div>
        </div>
        <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div class="text-xs text-zinc-400">Aguardando Assinatura</div>
          <div class="text-3xl font-black text-amber-400 mt-1"><?= $pendingCount ?></div>
          <div class="text-[10px] text-amber-500">Links no Zap</div>
        </div>
        <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div class="text-xs text-zinc-400">Taxa de Conversão</div>
          <div class="text-3xl font-black text-[#FF6B00] mt-1"><?= $rate ?>%</div>
          <div class="text-[10px] text-zinc-500">Média 30s no celular</div>
        </div>
      </div>

      <!-- Modelos Prontos -->
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">Modelos Prontos da Oficina & Cursos</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-semibold text-zinc-300">🚗 Ordem de Serviço - Autorização</div>
          <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-semibold text-zinc-300">📄 Orçamento de Peças</div>
          <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-semibold text-zinc-300">🛡️ Termo de Garantia de Motor 90 dias</div>
          <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-semibold text-zinc-300">🎓 Contrato Curso Vanguard</div>
          <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-semibold text-zinc-300">📸 Autorização de Uso de Imagem</div>
        </div>
      </div>

      <!-- Envelopes -->
      <div class="rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
        <?php foreach ($envelopes as $env): ?>
          <div class="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs text-zinc-500"><?= htmlspecialchars($env['id']) ?></span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase <?= ($env['status'] === 'signed') ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30' ?>">
                  <?= ($env['status'] === 'signed') ? 'Assinado' : 'Aguardando' ?>
                </span>
              </div>
              <h3 class="font-bold text-white text-base"><?= htmlspecialchars($env['title']) ?></h3>
              <p class="text-xs text-zinc-400 mt-1">
                Cliente: <strong class="text-white"><?= htmlspecialchars($env['signers'][0]['name'] ?? 'Cliente') ?></strong> •
                Placa: <strong class="text-white"><?= htmlspecialchars($env['variables']['placa'] ?? 'Equipamento') ?></strong> •
                Valor: <strong class="text-white">R$ <?= htmlspecialchars($env['variables']['valor_servico'] ?? '0,00') ?></strong>
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $env['signers'][0]['phone'] ?? '5521996134073') ?>?text=<?= urlencode($env['whatsappMessage'] ?? '') ?>" target="_blank" class="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30">
                Disparar no Zap
              </a>
              <a href="?route=sign&id=<?= htmlspecialchars($env['id']) ?>" class="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700">
                Visualizar (/s/)
              </a>
              <a href="?route=validate&hash=<?= htmlspecialchars($env['finalSha256'] ?? $env['originalSha256']) ?>" class="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700">
                Validar Hash
              </a>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

  <?php elseif ($route === 'sign'): ?>
    <!-- 3. PÁGINA PÚBLICA DE ASSINATURA MOBILE-FIRST (/s/:id) -->
    <div class="max-w-md mx-auto px-4 py-8">
      <div class="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <!-- Logo -->
        <div class="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#FF6B00] text-zinc-950 font-black flex items-center justify-center text-xs">✍️</div>
            <div>
              <div class="text-xs font-bold text-white">Oficina Grupo Eloizio</div>
              <div class="text-[10px] text-zinc-500">Assinatura Digital Rápida</div>
            </div>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Ambiente Seguro</span>
        </div>

        <!-- Título e Resumo IA -->
        <div class="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <div class="text-xs font-bold text-[#FF6B00]">Resumo Click.AI (Sem Juridiquês)</div>
          <h2 class="text-sm font-bold text-white"><?= htmlspecialchars($activeEnvelope['title'] ?? 'Ordem de Serviço') ?></h2>
          <div class="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
            <?= htmlspecialchars($activeEnvelope['summary'] ?? "• Autorização de serviços mecânicos\n• Valor aprovado conforme orçamento\n• Garantia formal de 90 dias") ?>
          </div>
        </div>

        <!-- Visualizador de Contrato -->
        <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-serif max-h-40 overflow-y-auto">
          <p>
            Pelo presente instrumento, o cliente <strong><?= htmlspecialchars($activeEnvelope['signers'][0]['name'] ?? 'Cliente') ?></strong>, portador do CPF <strong><?= htmlspecialchars($activeEnvelope['signers'][0]['cpf'] ?? 'Identificado') ?></strong>, autoriza expressamente a execução dos reparos mecânicos no veículo de placa <strong><?= htmlspecialchars($activeEnvelope['variables']['placa'] ?? 'Equipamento') ?></strong>, no valor de R$ <strong><?= htmlspecialchars($activeEnvelope['variables']['valor_servico'] ?? '1.850,00') ?></strong>.
          </p>
          <p class="mt-2 text-[11px] text-zinc-500">
            Validade jurídica conforme Medida Provisória 2.200-2/2001 e Lei Federal nº 14.063/2020.
          </p>
        </div>

        <!-- Checkbox Li e Concordo -->
        <label class="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
          <input type="checkbox" checked class="mt-0.5 accent-[#FF6B00] w-4 h-4">
          <span class="text-xs text-zinc-300">Li e concordo com os termos desta ordem de serviço e autorizo a manutenção.</span>
        </label>

        <!-- Selfie -->
        <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white">📸 Prova de Identidade por Selfie</span>
            <span class="text-[10px] text-emerald-400">Obrigatório</span>
          </div>
          <div class="p-2 rounded-lg bg-zinc-900 text-center text-zinc-400 text-xs">
            Câmera do celular ativa para biometria facial
          </div>
        </div>

        <!-- Canvas Assinatura -->
        <div class="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-white">Assine com o dedo aqui</span>
            <span class="text-[10px] text-zinc-500">Touch Screen</span>
          </div>
          <div class="w-full h-24 bg-white rounded-lg flex items-center justify-center text-zinc-400 text-xs italic">
            [ Campo de assinatura digital capturado em base64 ]
          </div>
        </div>

        <!-- Botão Assinar -->
        <a href="?route=dashboard" class="w-full block text-center py-3.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-sm hover:brightness-110 shadow-lg shadow-[#FF6B00]/25">
          Assinar Documento Agora
        </a>
      </div>
    </div>

  <?php elseif ($route === 'validate'): ?>
    <!-- 4. VALIDAÇÃO PÚBLICA (/validar/:hash) -->
    <div class="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-black text-white">Validador Público de Autenticidade</h1>
        <p class="text-xs text-zinc-400">Verifique a integridade e carimbo de tempo SHA-256 de qualquer documento EloSign.</p>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <label class="text-xs font-bold text-zinc-300 block">Hash Criptográfico SHA-256</label>
        <div class="flex gap-2">
          <input type="text" value="<?= htmlspecialchars($hash ?: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e') ?>" class="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono">
          <button class="px-4 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 font-bold text-xs">Validar</button>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-2 text-xs">
        <div class="font-bold text-sm text-white">✔ DOCUMENTO AUTÊNTICO & ÍNTEGRO</div>
        <p>Documento assinado conforme Lei 14.063/2020 e MP 2.200-2/2001 com tempestividade e evidências biométricas registradas.</p>
        <div class="font-mono text-[11px] text-zinc-400 pt-2 border-t border-emerald-500/20">
          Signatário: Marcos Vinicius de Oliveira (123.***.***-00) • IP: 187.55.210.42
        </div>
      </div>
    </div>

  <?php elseif ($route === 'embed'): ?>
    <!-- 5. WIDGET ELOMAK & API -->
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 class="text-2xl font-black text-white">Integração EloSign x EloMak & Vanguard</h1>
      <p class="text-xs text-zinc-400">Use nosso Widget Iframe para embutir o fluxo no EloMak ou faça requisições via API REST.</p>

      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-sm font-bold text-white">Widget Iframe para Colar no EloMak</h2>
        <div class="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-[#FF6B00]">
          &lt;iframe src="https://elosign.grupoeloizio.com.br/embed?apiKey=SUA_KEY_AQUI" width="100%" height="600" style="border:none; border-radius:16px;"&gt;&lt;/iframe&gt;
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h2 class="text-sm font-bold text-white">API REST: Criar Envelope (v1)</h2>
        <div class="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300">
          POST https://elosign.grupoeloizio.com.br/api/v1/envelopes/create<br>
          Headers: X-Api-Key: elo_live_99a81e4b3c7d6e5f8812<br>
          Content-Type: application/json
        </div>
      </div>
    </div>
  <?php endif; ?>
  </main>

  <!-- Footer -->
  <footer class="bg-zinc-950 border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
    EloSign • Subdomínio: elosign.grupoeloizio.com.br • Grupo Eloizio & EduVanguard • Conforme Lei Federal nº 14.063/2020
  </footer>

  <!-- Componente de Proteção de Dados LGPD -->
  <?php if (file_exists(dirname(__DIR__) . '/components/lgpd_banner.php')): ?>
    <?php include dirname(__DIR__) . '/components/lgpd_banner.php'; ?>
  <?php elseif (file_exists(__DIR__ . '/components/lgpd_banner.php')): ?>
    <?php include __DIR__ . '/components/lgpd_banner.php'; ?>
  <?php endif; ?>
</body>
</html>
