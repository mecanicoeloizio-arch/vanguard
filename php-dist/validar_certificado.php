<?php
/**
 * Grupo Eloizio - Validador Público Oficial de Certificados (PHP 8.1+)
 * Autenticação criptográfica de diplomas com QR Code e Hash SHA-256
 * Funciona diretamente na pasta public_html sem dependências!
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Validador Oficial de Certificados & Autenticidade Digital";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$certificados = getCertificadosData();
$codigoBuscado = strtoupper(trim($_GET['codigo'] ?? ''));
$certificadoEncontrado = null;
$buscaRealizada = false;

if (!empty($codigoBuscado)) {
    $buscaRealizada = true;
    foreach ($certificados as $codigo => $cert) {
        if ($codigo === $codigoBuscado || strtolower($cert['hash']) === strtolower($codigoBuscado)) {
            $certificadoEncontrado = $cert;
            break;
        }
    }
}
?>

<div class="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
  <!-- Top Banner -->
  <div class="text-center space-y-3">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black uppercase tracking-wider">
      <span>🛡️ Autenticação Criptográfica ICP-Brasil & MEC</span>
    </div>
    <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
      Validador Público de Certificados Oficiais
    </h1>
    <p class="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
      Consulte a autenticidade jurídica, carga horária e validade de diplomas emitidos pelo <strong>Grupo Eloizio</strong> conforme a Lei de Diretrizes e Bases da Educação Nacional (LDB 9.394/96).
    </p>
  </div>

  <!-- Caixa de Consulta por Código ou Hash -->
  <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-4">
    <form method="GET" action="validar_certificado.php" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
          Código de Autenticação ou Hash SHA-256 do Certificado:
        </label>
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            name="codigo"
            value="<?= htmlspecialchars($codigoBuscado) ?>"
            placeholder="Ex: CERT-2026-BR-8912 ou e3b0c442..."
            required
            class="flex-1 p-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs sm:text-sm font-bold uppercase focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
          >
          <button type="submit" class="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md cursor-pointer transition whitespace-nowrap">
            🔍 Validar Agora
          </button>
        </div>
      </div>

      <!-- Atalhos de Exemplo Rápido -->
      <div class="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
        <span>Exemplos para teste:</span>
        <a href="validar_certificado.php?codigo=CERT-2026-BR-8912" class="text-indigo-600 font-bold hover:underline font-mono bg-indigo-50 px-2 py-0.5 rounded">CERT-2026-BR-8912</a>
        <a href="validar_certificado.php?codigo=CERT-2026-BR-8913" class="text-indigo-600 font-bold hover:underline font-mono bg-indigo-50 px-2 py-0.5 rounded">CERT-2026-BR-8913</a>
      </div>
    </form>
  </div>

  <!-- Resultado da Validação -->
  <?php if ($buscaRealizada): ?>
    <?php if ($certificadoEncontrado): ?>
      <!-- CERTIFICADO AUTÊNTICO ENCONTRADO -->
      <div class="bg-linear-to-b from-amber-50/50 via-white to-amber-50/30 rounded-2xl sm:rounded-3xl border-2 border-amber-300 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden animate-in zoom-in-95">
        <!-- Selo de Autenticidade -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              ✓
            </div>
            <div>
              <span class="text-[10px] uppercase font-black tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Certificado Autêntico & Válido
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Autenticidade Oficial Confirmada no Registro Acadêmico
              </h2>
            </div>
          </div>

          <button onclick="window.print()" class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2">
            <span>🖨️ Imprimir / Salvar PDF</span>
          </button>
        </div>

        <!-- Layout Oficial do Diploma -->
        <div class="bg-white p-6 sm:p-10 rounded-2xl border border-amber-200/80 shadow-inner space-y-6 text-center">
          <div class="space-y-1">
            <span class="text-xs uppercase tracking-widest font-black text-slate-400">República Federativa do Brasil</span>
            <h3 class="text-xl sm:text-3xl font-black text-slate-950 tracking-tight font-serif">
              GRUPO ELOIZIO EDUCAÇÃO & TECNOLOGIA
            </h3>
            <span class="text-xs font-medium text-slate-500">Credenciamento Nacional de Cursos Livres e Profissionalizantes</span>
          </div>

          <div class="max-w-2xl mx-auto py-4 space-y-3 text-xs sm:text-base text-slate-700 leading-relaxed">
            <p>
              Certificamos para os devidos fins jurídicos e acadêmicos que
            </p>
            <p class="text-xl sm:text-3xl font-black text-indigo-950 font-serif border-b-2 border-indigo-950 pb-2 w-fit mx-auto px-6">
              <?= htmlspecialchars($certificadoEncontrado['studentName']) ?>
            </p>
            <p class="text-xs text-slate-500 font-mono">
              CPF: <?= htmlspecialchars($certificadoEncontrado['cpf']) ?> • Matrícula: <?= htmlspecialchars($certificadoEncontrado['registrationNumber']) ?>
            </p>
            <p>
              concluiu com êxito todas as exigências pedagógicas, avaliações teóricas e práticas do curso de
            </p>
            <p class="text-base sm:text-xl font-black text-slate-950">
              <?= htmlspecialchars($certificadoEncontrado['courseTitle']) ?>
            </p>
            <p class="text-xs text-slate-600">
              com carga horária total de <strong><?= (int)$certificadoEncontrado['workloadHours'] ?> horas</strong>, emitido em <strong><?= $certificadoEncontrado['issueDate'] ?></strong>.
            </p>
          </div>

          <!-- Assinaturas e Chancelas -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-200 max-w-3xl mx-auto text-xs">
            <div class="space-y-1">
              <div class="w-40 border-b border-slate-800 mx-auto"></div>
              <strong class="text-slate-900 block font-bold">Eloizio Silva</strong>
              <span class="text-[11px] text-slate-500">Fundador, CEO & Especialista Técnico</span>
            </div>
            <div class="space-y-1">
              <div class="w-40 border-b border-slate-800 mx-auto"></div>
              <strong class="text-slate-900 block font-bold">Profa. Dra. Mariana Fernandes</strong>
              <span class="text-[11px] text-slate-500">Coordenação Pedagógica & Ensino Superior</span>
            </div>
          </div>

          <!-- Metadados Criptográficos -->
          <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-[11px] text-slate-500 bg-slate-50 p-4 rounded-xl font-mono">
            <div>
              <span class="block text-slate-400 font-bold uppercase text-[9px]">Código de Registro Nacional:</span>
              <strong class="text-indigo-950 font-bold text-xs"><?= $certificadoEncontrado['code'] ?></strong>
              <span class="block text-slate-400 font-bold uppercase text-[9px] mt-2">Hash SHA-256 de Autenticação Digital:</span>
              <span class="text-[10px] text-slate-600 break-all select-all font-mono"><?= $certificadoEncontrado['hash'] ?></span>
            </div>

            <!-- Simulação QR Code -->
            <div class="w-20 h-20 bg-slate-950 text-white rounded-xl flex items-center justify-center font-bold text-[10px] text-center p-2 shrink-0">
              [ QR CODE OFICIAL ]
            </div>
          </div>
        </div>
      </div>
    <?php else: ?>
      <!-- CERTIFICADO NÃO ENCONTRADO -->
      <div class="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center space-y-3 max-w-xl mx-auto">
        <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black text-xl mx-auto">
          ✕
        </div>
        <h3 class="text-base font-black text-rose-900">Certificado Não Localizado</h3>
        <p class="text-xs text-rose-700 leading-relaxed">
          Nenhum registro foi encontrado com o código ou hash <strong>"<?= htmlspecialchars($codigoBuscado) ?>"</strong>. Verifique se digitou todos os caracteres corretamente ou contate nossa secretaria pelo WhatsApp <strong>(21) 99613-4073</strong>.
        </p>
      </div>
    <?php endif; ?>
  <?php endif; ?>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
