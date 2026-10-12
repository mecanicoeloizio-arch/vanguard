import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ExternalLink, X, Check, Settings, Info, FileText } from 'lucide-react';

export const LGPDBanner: React.FC = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(true); // default true until checked to avoid flicker
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  // Cookie/Consent Preferences
  const [preferences, setPreferences] = useState({
    essential: true, // always true
    attendanceAI: true,
    analytics: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('grupoeloizio_lgpd_consent');
    if (!saved) {
      setHasConsented(false);
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.preferences) {
          setPreferences(parsed.preferences);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const acceptAll = () => {
    const consentData = {
      acceptedAt: new Date().toISOString(),
      accepted: true,
      version: '2.0',
      preferences: {
        essential: true,
        attendanceAI: true,
        analytics: true,
      },
    };
    localStorage.setItem('grupoeloizio_lgpd_consent', JSON.stringify(consentData));
    setHasConsented(true);
    setShowDetailsModal(false);
    setShowPreferencesModal(false);
  };

  const saveCustomPreferences = () => {
    const consentData = {
      acceptedAt: new Date().toISOString(),
      accepted: true,
      version: '2.0',
      preferences,
    };
    localStorage.setItem('grupoeloizio_lgpd_consent', JSON.stringify(consentData));
    setHasConsented(true);
    setShowPreferencesModal(false);
  };

  if (hasConsented) {
    return (
      <>
        {/* Discrete floating badge in bottom-left to reopen LGPD preferences anytime */}
        <div className="fixed bottom-3 left-3 z-30 no-print">
          <button
            onClick={() => setShowDetailsModal(true)}
            title="Privacidade & LGPD • Grupo Eloizio"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 shadow-md text-[11px] font-medium backdrop-blur-xs transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">LGPD • Privacidade</span>
          </button>
        </div>

        {/* Details & DPO Modal */}
        {showDetailsModal && renderDetailsModal()}
      </>
    );
  }

  function renderDetailsModal() {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Política de Privacidade & Proteção de Dados (LGPD)</h3>
                <p className="text-xs text-slate-400">Grupo Eloizio • Conforme a Lei Federal nº 13.709/2018</p>
              </div>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200">
              <strong>Compromisso de Segurança:</strong> O Grupo Eloizio adota medidas técnicas, administrativas e de governança para proteger integralmente os dados pessoais de seus alunos, clientes e parceiros contra acessos não autorizados.
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-1">1. Encarregado Oficial de Proteção de Dados (DPO)</h4>
              <p className="text-slate-400">
                Para exercer seus direitos de confirmação, retificação ou exclusão, contate diretamente nosso Encarregado:
                <br /><strong>Nome:</strong> Eloizio Assunção (CEO & DPO Oficial do Grupo Eloizio)
                <br /><strong>WhatsApp Pessoal:</strong> (21) 98764-8727
                <br /><strong>Central de Atendimento (Camilla Faria):</strong> (21) 99613-4073
                <br /><strong>E-mail Oficial DPO:</strong> dpo@grupoeloizio.com.br
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-1">2. Dados Coletados e Finalidades Estritas</h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li><strong>Identificação & Contato (WhatsApp/E-mail):</strong> Atendimento humanizado com a Gerente Camilla Faria, emissão de links de acesso e suporte pós-venda.</li>
                <li><strong>Cursos Livres Vanguard:</strong> Nome completo e CPF para emissão de Certificados com chave SHA-256 e Registro Acadêmico (Lei nº 9.394/96 Art. 42).</li>
                <li><strong>EloMak (Oficina Mecânica):</strong> Dados do cliente e do maquinário para Ordens de Serviço e termos de garantia técnica.</li>
                <li><strong>EloContábil:</strong> Organização de documentos fiscais e rotinas de RH sem exigência de CRC.</li>
                <li><strong>EloSign:</strong> Registro pericial de assinaturas (IP, carimbo do tempo, hash) com validade jurídica (MP 2.200-2/2001).</li>
                <li><strong>Mercado Pago:</strong> Processamento 100% criptografado e seguro com certificação PCI-DSS. Não armazenamos senhas de cartão de crédito.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-1">3. Seus Direitos como Titular (Art. 18 da LGPD)</h4>
              <p className="text-slate-400">
                Você pode solicitar a qualquer momento a confirmação de tratamento, acesso aos dados, correção de dados incompletos, portabilidade, anonimização ou exclusão de dados dispensáveis, bem como a revogação deste consentimento.
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setShowPreferencesModal(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              Configurar Preferências
            </button>
            <button
              onClick={acceptAll}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Aceitar e Salvar Consentimento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating LGPD Banner at Viewport Bottom */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-200 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="font-semibold text-white flex items-center gap-2">
                <span>Aviso de Privacidade & Proteção de Dados (LGPD • Lei nº 13.709/2018)</span>
                <span className="inline-block px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">
                  Ambiente Protegido
                </span>
              </p>
              <p className="mt-1 text-slate-400">
                O <strong>Grupo Eloizio</strong> utiliza cookies e dados estritamente necessários para viabilizar seus serviços educacionais (Cursos Livres Vanguard), oficina mecânica (EloMak), apoio contábil (EloContábil), assinaturas (EloSign) e atendimento exclusivo com a Gerente <strong>Camilla Faria</strong> com pagamentos 100% seguros no <strong>Mercado Pago</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-orange-400" />
              Direitos do Titular (DPO)
            </button>
            <button
              type="button"
              onClick={() => setShowPreferencesModal(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              Preferências
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-lg shadow-orange-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Aceitar e Prosseguir
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && renderDetailsModal()}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-400" />
                Preferências de Dados & Cookies
              </h3>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    Cookies Essenciais do Sistema
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">Obrigatório</span>
                  </div>
                  <p className="text-slate-400 mt-1">
                    Necessários para login, sessões ativas, navegação e segurança dos pagamentos Mercado Pago.
                  </p>
                </div>
                <input type="checkbox" checked disabled className="w-4 h-4 mt-1 accent-orange-500 cursor-not-allowed" />
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Atendimento Inteligente com Camilla Faria</div>
                  <p className="text-slate-400 mt-1">
                    Permite personalização do chat, lembrete de aniversário no 1º horário útil (com 15% OFF) e histórico de diagnósticos de máquinas.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.attendanceAI}
                  onChange={(e) => setPreferences({ ...preferences, attendanceAI: e.target.checked })}
                  className="w-4 h-4 mt-1 accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Métricas de Desempenho e Navegação</div>
                  <p className="text-slate-400 mt-1">
                    Ajuda nossa equipe técnica a identificar melhorias de velocidade e estabilidade das aulas e portais.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-4 h-4 mt-1 accent-orange-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveCustomPreferences}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl transition cursor-pointer"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
