<?php
/**
 * Componente Universal de Aviso e Consentimento LGPD • Grupo Eloizio
 * Conformidade com a Lei Geral de Proteção de Dados (Lei Federal nº 13.709/2018)
 * Encarregado pelo Tratamento de Dados Pessoais (DPO): Eloizio Assunção (21 98764-8727 / dpo@grupoeloizio.com.br)
 */
?>
<!-- BANNER FLUTUANTE LGPD • GRUPO ELOIZIO -->
<div id="lgpd-banner-grupoeloizio" class="fixed bottom-0 inset-x-0 z-[9999] p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 text-zinc-200 shadow-2xl transition-all duration-300 transform translate-y-full opacity-0" style="display: none;">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <div class="flex items-start gap-3 flex-1">
      <div class="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0 mt-0.5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div class="text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <p class="font-semibold text-white flex items-center gap-2">
          <span>Privacidade & Proteção de Dados (LGPD - Lei 13.709/2018)</span>
          <span class="inline-block px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">Ambiente Seguro</span>
        </p>
        <p class="mt-1 text-zinc-400">
          O <strong>Grupo Eloizio</strong> respeita a sua privacidade. Coletamos e tratamos dados estritamente necessários (nome, WhatsApp, e-mail e dados de maquinário/documentos) para a execução de ordens de serviço, cursos livres, apoio administrativo e recebimentos via Mercado Pago. Seus dados nunca são comercializados.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
      <button type="button" onclick="openLgpdModal()" class="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border border-zinc-700/60 transition flex items-center gap-1.5">
        <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Saiba Mais (DPO)
      </button>
      <button type="button" onclick="acceptLgpdConsent()" class="px-4 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-lg shadow-lg shadow-orange-500/20 transition flex items-center gap-1.5 cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        Concordar e Continuar
      </button>
    </div>
  </div>
</div>

<!-- MODAL COMPLETO DE POLÍTICA DE PRIVACIDADE LGPD -->
<div id="lgpd-modal-grupoeloizio" class="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 opacity-0 pointer-events-none" style="display: none;">
  <div class="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
    <!-- Header -->
    <div class="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-orange-500/10 text-orange-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-white text-base">Política de Privacidade & Proteção de Dados</h3>
          <p class="text-xs text-zinc-400">Grupo Eloizio • Em conformidade com a Lei Federal nº 13.709/2018</p>
        </div>
      </div>
      <button onclick="closeLgpdModal()" class="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Body com scroll -->
    <div class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
      <div class="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200">
        <strong>Compromisso Oficial:</strong> O Grupo Eloizio adota medidas técnicas, administrativas e de segurança aptas a proteger os dados pessoais de acessos não autorizados e de qualquer forma de tratamento inadequado ou ilícito.
      </div>

      <div>
        <h4 class="font-semibold text-white text-sm mb-1">1. Encarregado pelo Tratamento de Dados (DPO)</h4>
        <p class="text-zinc-400">
          Para qualquer esclarecimento, retificação ou exclusão de dados pessoais, o titular pode contatar diretamente nosso Encarregado Oficial:
          <br><strong>Nome:</strong> Eloizio Assunção (CEO & DPO Grupo Eloizio)
          <br><strong>WhatsApp Pessoal:</strong> (21) 98764-8727
          <br><strong>Atendente Central (Camilla):</strong> (21) 99613-4073
          <br><strong>E-mail DPO:</strong> dpo@grupoeloizio.com.br
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-white text-sm mb-1">2. Dados Coletados e Suas Finalidades</h4>
        <ul class="list-disc list-inside space-y-1 text-zinc-400">
          <li><strong>WhatsApp e E-mail:</strong> Identificação, suporte ágil com a assistente Camilla Faria, envio de links temporários de acesso (30 min) e notificações de conclusão.</li>
          <li><strong>EloMak (Oficina Mecânica):</strong> Dados do cliente e do maquinário (placa, modelo, defeito) para emissão de Ordens de Serviço e termos de garantia.</li>
          <li><strong>Cursos Livres Vanguard:</strong> Nome completo e CPF para emissão de certificados digitais válidos sob a Lei 9.394/96 Art. 42.</li>
          <li><strong>EloContábil:</strong> Documentos administrativos e organização de folha/EPIs (Apoio administrativo, não substitui CRC).</li>
          <li><strong>EloSign:</strong> Evidências periciais (IP, carimbo de tempo, assinatura criptografada) para validade jurídica conforme MP 2.200-2/2001.</li>
          <li><strong>Mercado Pago:</strong> Transações financeiras com certificação PCI-DSS. Não armazenamos números de cartão de crédito.</li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold text-white text-sm mb-1">3. Direitos do Titular (Art. 18 da LGPD)</h4>
        <p class="text-zinc-400">
          Você tem direito a confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou inexatos, solicitar a anonimização ou eliminação dos dados dispensáveis, e revogar este consentimento a qualquer momento.
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-white text-sm mb-1">4. Felicitações de Aniversário & Benefícios</h4>
        <p class="text-zinc-400">
          Ao informar sua data de nascimento, você autoriza o envio de felicitações personalizadas pela nossa atendente virtual Camilla Faria no primeiro horário útil da sua data especial (a partir das 08h), com liberação do cupom comemorativo de 15% de desconto para compras online via Mercado Pago.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
      <span class="text-[11px] text-zinc-500">Versão 2026.1 • Lei 13.709/2018</span>
      <button type="button" onclick="acceptLgpdConsent()" class="px-5 py-2 text-xs font-semibold text-zinc-950 bg-orange-500 hover:bg-orange-400 rounded-lg transition">
        Entendi e Aceito os Termos
      </button>
    </div>
  </div>
</div>

<script>
(function() {
  const STORAGE_KEY = 'grupoeloizio_lgpd_accepted';
  const banner = document.getElementById('lgpd-banner-grupoeloizio');

  function checkConsent() {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted && banner) {
        banner.style.display = 'block';
        setTimeout(() => {
          banner.classList.remove('translate-y-full', 'opacity-0');
          banner.classList.add('translate-y-0', 'opacity-100');
        }, 300);
      }
    } catch (e) {
      if (banner) banner.style.display = 'block';
    }
  }

  window.acceptLgpdConsent = function() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
    if (banner) {
      banner.classList.add('translate-y-full', 'opacity-0');
      setTimeout(() => { banner.style.display = 'none'; }, 300);
    }
    closeLgpdModal();
  };

  window.openLgpdModal = function() {
    const modal = document.getElementById('lgpd-modal-grupoeloizio');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
      }, 10);
    }
  };

  window.closeLgpdModal = function() {
    const modal = document.getElementById('lgpd-modal-grupoeloizio');
    if (modal) {
      modal.classList.remove('opacity-100', 'pointer-events-auto');
      modal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkConsent);
  } else {
    checkConsent();
  }
})();
</script>
