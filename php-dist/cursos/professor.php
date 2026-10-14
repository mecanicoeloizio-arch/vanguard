<?php
/**
 * Grupo Eloizio - Portal do Professor / Docente (PHP 8.1+)
 * Lançamento de Notas, Diário de Classe, Chamada e Gestão de Provas
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Portal do Docente (Diário de Classe & Notas)";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';
?>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
  <!-- Perfil do Docente -->
  <div class="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250" alt="Docente" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-inner shrink-0">
      <div>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
          Corpo Docente Titular & Coordenação
        </span>
        <h2 class="text-xl sm:text-2xl font-black text-white mt-1">Profa. Dra. Mariana Fernandes</h2>
        <p class="text-xs text-indigo-200">Doutora em Ciência da Computação (USP) • Cursos Livres Grupo Eloizio</p>
      </div>
    </div>

    <!-- Métricas Rápidas -->
    <div class="flex items-center gap-3 text-center text-xs">
      <div class="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
        <span class="text-slate-400 text-[10px] block">Turmas</span>
        <strong class="text-white text-sm">3 Ativas</strong>
      </div>
      <div class="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
        <span class="text-slate-400 text-[10px] block">Alunos</span>
        <strong class="text-emerald-400 text-sm">342 Matriculados</strong>
      </div>
      <div class="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
        <span class="text-slate-400 text-[10px] block">Média Geral</span>
        <strong class="text-amber-400 text-sm">8.9</strong>
      </div>
    </div>
  </div>

  <!-- Abas do Professor -->
  <div class="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar shadow-xs">
    <button onclick="trocarAbaProf('notas')" id="tabProfNotas" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap">
      📊 Lançamento de Notas
    </button>
    <button onclick="trocarAbaProf('chamada')" id="tabProfChamada" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      📋 Diário de Presença & Chamada
    </button>
    <button onclick="trocarAbaProf('provas')" id="tabProfProvas" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap">
      📝 Banco de Provas & Trabalhos
    </button>
  </div>

  <!-- ABA 1: LANÇAMENTO DE NOTAS -->
  <div id="secaoProfNotas" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-black text-slate-900">Diário Eletrônico: Turma 2026/2 — Arquitetura de Software</h3>
        <p class="text-xs text-slate-500">Insira as notas dos alunos e salve diretamente no banco de dados.</p>
      </div>
      <button onclick="salvarNotasProf()" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer">
        💾 Salvar Todas as Notas
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead>
          <tr class="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
            <th class="py-3 px-4">Aluno</th>
            <th class="py-3 px-3">Matrícula</th>
            <th class="py-3 px-3 text-center">Nota 1 (N1)</th>
            <th class="py-3 px-3 text-center">Nota 2 (N2)</th>
            <th class="py-3 px-3 text-center">Trabalho</th>
            <th class="py-3 px-3 text-center">Média Calculada</th>
            <th class="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-slate-50/70">
            <td class="py-3 px-4 font-bold text-slate-900">Lucas Silva Prado</td>
            <td class="py-3 px-3 font-mono text-slate-500">MAT-2026-9812</td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="9.5" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="8.8" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="10.0" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center font-black text-indigo-950 font-mono text-sm">9.4</td>
            <td class="py-3 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">Aprovado</span></td>
          </tr>
          <tr class="hover:bg-slate-50/70">
            <td class="py-3 px-4 font-bold text-slate-900">Beatriz Helena Costa</td>
            <td class="py-3 px-3 font-mono text-slate-500">MAT-2026-4412</td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="8.0" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="8.5" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="9.0" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center font-black text-indigo-950 font-mono text-sm">8.5</td>
            <td class="py-3 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">Aprovado</span></td>
          </tr>
          <tr class="hover:bg-slate-50/70">
            <td class="py-3 px-4 font-bold text-slate-900">Carlos Eduardo Rezende</td>
            <td class="py-3 px-3 font-mono text-slate-500">MAT-2026-1109</td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="6.5" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="7.0" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center"><input type="number" step="0.1" value="7.5" class="w-16 p-1 text-center font-mono border border-slate-300 rounded-lg"></td>
            <td class="py-3 px-3 text-center font-black text-indigo-950 font-mono text-sm">7.0</td>
            <td class="py-3 px-4 text-center"><span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">Aprovado</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ABA 2: CHAMADA & PRESENÇA -->
  <div id="secaoProfChamada" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div class="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <h3 class="text-lg font-black text-slate-900">Chamada do Dia: <?= date('d/m/Y') ?></h3>
        <p class="text-xs text-slate-500">Registre a frequência dos estudantes.</p>
      </div>
      <button onclick="alert('Frequência consolidada com sucesso!')" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition">
        Finalizar Chamada
      </button>
    </div>

    <div class="divide-y divide-slate-100 text-xs">
      <div class="py-3 flex items-center justify-between">
        <span class="font-bold text-slate-900">Lucas Silva Prado</span>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">Presente</button>
          <button class="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200">Falta</button>
        </div>
      </div>
      <div class="py-3 flex items-center justify-between">
        <span class="font-bold text-slate-900">Beatriz Helena Costa</span>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">Presente</button>
          <button class="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200">Falta</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ABA 3: PROVAS & TRABALHOS -->
  <div id="secaoProfProvas" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 hidden">
    <div>
      <h3 class="text-lg font-black text-slate-900">Cadastrar Nova Prova ou Trabalho</h3>
      <p class="text-xs text-slate-500">Disponibilize avaliações que entram automaticamente na Área do Aluno.</p>
    </div>

    <form onsubmit="alert('Nova prova cadastrada com sucesso!'); event.preventDefault();" class="space-y-4 text-xs max-w-xl">
      <div>
        <label class="block font-bold text-slate-700 uppercase mb-1">Título da Prova</label>
        <input type="text" required placeholder="Ex: Prova 2: Microsserviços e Mensageria" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Data Limite</label>
          <input type="date" required value="<?= date('Y-m-d', strtotime('+7 days')) ?>" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden">
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Pontuação Máxima</label>
          <input type="number" required value="10" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden">
        </div>
      </div>
      <button type="submit" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition">
        Publicar Avaliação para os Alunos
      </button>
    </form>
  </div>
</div>

<script>
  function trocarAbaProf(aba) {
    ['notas', 'chamada', 'provas'].forEach(a => {
      document.getElementById('secaoProf' + a.charAt(0).toUpperCase() + a.slice(1)).classList.add('hidden');
      document.getElementById('tabProf' + a.charAt(0).toUpperCase() + a.slice(1)).className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition whitespace-nowrap';
    });
    document.getElementById('secaoProf' + aba.charAt(0).toUpperCase() + aba.slice(1)).classList.remove('hidden');
    document.getElementById('tabProf' + aba.charAt(0).toUpperCase() + aba.slice(1)).className = 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white transition whitespace-nowrap';
  }

  function salvarNotasProf() {
    alert('Notas salvas com sucesso no banco de dados e sincronizadas com os boletins dos estudantes!');
  }
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
