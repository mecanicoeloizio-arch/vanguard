<?php
/**
 * Grupo Eloizio - Vitrine Pública de Cursos & Portal Principal (PHP 8.1+)
 * Funciona diretamente na pasta public_html sem nenhuma dependência!
 */

declare(strict_types=1);

$pageTitle = "Grupo Eloizio - Cursos 100% Online com Certificado Oficial & Checkout Mercado Pago";
require_once __DIR__ . '/dados.php';
require_once __DIR__ . '/header.php';

$cursos = getCursosData();
$categoriaFiltro = $_GET['cat'] ?? 'Todos';

$cursosFiltrados = array_filter($cursos, function ($c) use ($categoriaFiltro) {
    if ($categoriaFiltro === 'Todos') return true;
    return $c['category'] === $categoriaFiltro;
});
?>

<!-- Hero Banner -->
<section class="bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-20 px-4 text-center relative overflow-hidden">
  <div class="max-w-5xl mx-auto space-y-5 relative z-10">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
      <span>🚀 Certificação Válida em Todo o Brasil • Cursos Livres MEC</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
      Capacitação Prática, Alta Renda & Especialização Profissional
    </h1>
    <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
      Aprenda do zero ao avançado com quem atua no mercado. Cursos de Engenharia de Software, Mecânica de Máquinas de Costura em São Gonçalo - RJ e Contabilidade para MEI.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a href="#catalogo" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition">
        Ver Catálogo de Cursos &rarr;
      </a>
      <a href="aluno.php" class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition">
        Já sou Aluno (Entrar no Portal)
      </a>
    </div>
  </div>
</section>

<!-- Catálogo de Cursos -->
<section id="catalogo" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
  <!-- Barra de Filtros por Categoria -->
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
      <?php
      $cats = ['Todos', 'Tecnologia', 'Engenharia', 'Negócios', 'Design'];
      foreach ($cats as $cat):
        $ativo = ($categoriaFiltro === $cat);
      ?>
        <a href="index.php?cat=<?= urlencode($cat) ?>#catalogo" class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition <?= $ativo ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
          <?= $cat ?>
        </a>
      <?php endforeach; ?>
    </div>

    <div class="text-xs text-slate-500 flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
      <span>Exibindo <strong><?= count($cursosFiltrados) ?></strong> cursos ativos</span>
      <a href="admin.php" class="text-indigo-600 font-bold hover:underline flex items-center gap-1">
        <span>+ Importar via Texto</span>
      </a>
    </div>
  </div>

  <!-- Grade de Cursos -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <?php foreach ($cursosFiltrados as $curso): ?>
      <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
        <!-- Imagem e Categoria -->
        <div class="relative h-48 bg-slate-900">
          <img src="<?= htmlspecialchars($curso['thumbnail']) ?>" alt="<?= htmlspecialchars($curso['title']) ?>" class="w-full h-full object-cover">
          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/95 text-indigo-950 shadow-xs">
            <?= htmlspecialchars($curso['category']) ?> • <?= htmlspecialchars($curso['level']) ?>
          </span>
          <span class="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
            ★ <?= number_format($curso['rating'], 1) ?>
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

          <div class="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div class="flex items-center justify-between text-slate-500">
              <span>⏱ <?= (int)$curso['workloadHours'] ?> horas certificadas</span>
              <span>👤 <?= htmlspecialchars(explode(' ', $curso['instructorName'])[0]) ?></span>
            </div>

            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-lg font-black text-slate-950">
                  R$ <?= number_format($curso['price'], 2, ',', '.') ?>
                </span>
                <span class="text-[11px] text-slate-400 block">em até 12x no cartão ou PIX</span>
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
              <button onclick="abrirCheckoutCurso('<?= htmlspecialchars(addslashes($curso['title'])) ?>', <?= (float)$curso['price'] ?>)" class="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm transition cursor-pointer text-center">
                Matricular (PIX)
              </button>
            </div>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
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
