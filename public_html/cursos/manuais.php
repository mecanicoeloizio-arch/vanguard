<?php
/**
 * Grupo Eloizio - Manuais do Sistema & Documentação de Deploy (PHP 8.1+)
 * Instruções Completas para Alunos, Professores, Direção e Deploy em public_html
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Manuais do Sistema & Guia de Deploy cPanel";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';
?>

<div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
  <!-- Header -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider">
        <span>📖 Base de Conhecimento Oficial</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-white">
        Manuais do Sistema & Procedimentos Operacionais
      </h1>
      <p class="text-xs sm:text-sm text-indigo-200">
        Instruções detalhadas para alunos, professores, administração geral e guia de transporte para a pasta public_html.
      </p>
    </div>

    <div class="bg-white/10 p-4 rounded-2xl border border-white/20 text-xs space-y-1">
      <span class="text-slate-400 block text-[10px] uppercase font-bold">Credenciais Master:</span>
      <strong class="font-mono text-amber-300 text-sm block">ELOIZIO@MASTER2026</strong>
      <span class="text-slate-300 text-[11px]">Liberada para todos os módulos</span>
    </div>
  </div>

  <!-- Grade de Manuais -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Manual 1: Guia do Aluno -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
          📚
        </div>
        <div>
          <span class="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Módulo do Estudante</span>
          <h2 class="text-base font-black text-slate-900">Manual do Aluno</h2>
        </div>
      </div>
      <ul class="text-xs text-slate-600 space-y-2 leading-relaxed">
        <li>• <strong>Acesso às Aulas:</strong> Entre em <a href="aluno.php" class="text-indigo-600 font-bold hover:underline">aluno.php</a> para assistir às videoaulas, consultar transcrições e marcar aulas concluídas.</li>
        <li>• <strong>Simulador Interativo:</strong> Pratique medições elétricas e mecânicas no simulador técnico online.</li>
        <li>• <strong>Emissão de Certificado:</strong> Ao atingir 100% das aulas e nota mínima 7.0, clique no botão "Emitir Certificado Oficial" para gerar o documento com QR Code e Hash SHA-256.</li>
        <li>• <strong>Pagamento de Mensalidades:</strong> Liquidar parcelas via PIX instantâneo do Mercado Pago com baixa automática.</li>
      </ul>
    </div>

    <!-- Manual 2: Guia do Administrador -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
          ⚙️
        </div>
        <div>
          <span class="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Diretoria & Gestão</span>
          <h2 class="text-base font-black text-slate-900">Manual do Administrador & Direção</h2>
        </div>
      </div>
      <ul class="text-xs text-slate-600 space-y-2 leading-relaxed">
        <li>• <strong>Senha Master Oficial:</strong> A senha <code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-900 font-bold">ELOIZIO@MASTER2026</code> concede acesso irrestrito ao painel da Direção e destrava qualquer bloqueio de tentativas.</li>
        <li>• <strong>Preenchimento de Cursos via Texto:</strong> Cole o texto descritivo do curso em "Preencher Cursos via Texto" no painel da Direção. O sistema analisa o texto e publica o curso na vitrine instantaneamente.</li>
        <li>• <strong>Gestão de Propostas Comerciais:</strong> Acompanhe leads qualificados na página <a href="propostas.php" class="text-indigo-600 font-bold hover:underline">propostas.php</a> com cupom SOFIA15 e envio direto no WhatsApp.</li>
        <li>• <strong>Auditoria de Segurança:</strong> Monitore logs de acesso, integridade de certificados e relatórios financeiros.</li>
      </ul>
    </div>

    <!-- Manual 3: Guia do Professor -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
          👨‍🏫
        </div>
        <div>
          <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">Corpo Docente</span>
          <h2 class="text-base font-black text-slate-900">Manual do Professor</h2>
        </div>
      </div>
      <ul class="text-xs text-slate-600 space-y-2 leading-relaxed">
        <li>• <strong>Lançamento de Notas:</strong> No portal <a href="professor.php" class="text-indigo-600 font-bold hover:underline">professor.php</a>, insira as notas N1, N2 e Trabalhos para cálculo automático da média.</li>
        <li>• <strong>Chamada e Frequência:</strong> Registre presença diária dos estudantes com cálculo da porcentagem obrigatória para aprovação (mínimo 75%).</li>
        <li>• <strong>Propostas de Novos Cursos:</strong> Envie sugestões de novos módulos e treinamentos práticos para homologação da Diretoria.</li>
      </ul>
    </div>

    <!-- Manual 4: Guia de Deploy em Servidor cPanel / public_html -->
    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
          🚀
        </div>
        <div>
          <span class="text-[10px] font-black uppercase text-purple-600 tracking-wider">Deploy em Servidor Web</span>
          <h2 class="text-base font-black text-slate-900">Guia de Transporte para public_html</h2>
        </div>
      </div>
      <ul class="text-xs text-slate-600 space-y-2 leading-relaxed">
        <li>• <strong>Zero Dependências:</strong> Não é necessário rodar <code class="font-mono bg-slate-100 px-1">npm install</code> nem <code class="font-mono bg-slate-100 px-1">composer install</code> no servidor.</li>
        <li>• <strong>Transporte Direto:</strong> Copie todos os arquivos da pasta <code class="font-mono bg-slate-100 px-1">php-dist/</code> diretamente para a raiz da pasta <code class="font-mono bg-slate-100 px-1">public_html/</code> via cPanel File Manager ou FTP (FileZilla).</li>
        <li>• <strong>Requisitos Mínimos:</strong> PHP 7.4, 8.0, 8.1, 8.2 ou 8.3 com extensões padrão ativadas (cURL, JSON, OpenSSL).</li>
        <li>• <strong>Pronto para Uso:</strong> Acesse <code class="font-mono bg-slate-100 px-1">https://seudominio.com.br/index.php</code> e o portal estará 100% operacional.</li>
      </ul>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/footer.php'; ?>
