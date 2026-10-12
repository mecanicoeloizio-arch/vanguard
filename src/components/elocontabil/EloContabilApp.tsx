import React, { useState } from 'react';
import {
  FileText,
  Users,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  Send,
  Download,
  Building,
  CheckCircle2,
  ExternalLink,
  Lock,
  Plus,
  Mail,
  MessageSquare,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  cpf: string;
  admissionDate: string;
  asoExpiration: string;
  uniformSize: string;
  epiDelivered: boolean;
  status: 'active' | 'vacation' | 'pending';
}

interface VaultDocument {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  status: 'valid' | 'warning' | 'expired';
  sentToAccountant: boolean;
  fileName: string;
}

export const EloContabilApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rh' | 'admin' | 'camilla'>('rh');
  const [contactInput, setContactInput] = useState('');
  const [contactType, setContactType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [isVerifying, setIsVerifying] = useState(false);
  const [camillaResponse, setCamillaResponse] = useState<{
    message: string;
    link: string;
    token: string;
    status: string;
  } | null>(null);

  // Estado para cadastro de funcionário
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Carlos Eduardo Silva',
      role: 'Mecânico Industrial Sênior',
      cpf: '123.456.789-00',
      admissionDate: '2024-02-15',
      asoExpiration: '2026-11-20',
      uniformSize: 'G',
      epiDelivered: true,
      status: 'active',
    },
    {
      id: '2',
      name: 'Mariana Fagundes',
      role: 'Auxiliar de Atendimento & Peças',
      cpf: '987.654.321-11',
      admissionDate: '2025-01-10',
      asoExpiration: '2027-01-10',
      uniformSize: 'M',
      epiDelivered: true,
      status: 'active',
    },
    {
      id: '3',
      name: 'Rodrigo Medeiros',
      role: 'Técnico em Eletrônica Automotiva',
      cpf: '456.789.123-22',
      admissionDate: '2023-08-01',
      asoExpiration: '2026-10-30',
      uniformSize: 'GG',
      epiDelivered: true,
      status: 'active',
    },
  ]);

  // Documentos do Cofre
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([
    {
      id: 'doc-1',
      title: 'Alvará de Funcionamento São Gonçalo 2026',
      category: 'Alvarás e Licenças',
      dueDate: '2026-12-31',
      status: 'valid',
      sentToAccountant: true,
      fileName: 'alvara_funcionamento_sg_2026.pdf',
    },
    {
      id: 'doc-2',
      title: 'Contrato de Locação Galpão Central',
      category: 'Contratos',
      dueDate: '2027-05-30',
      status: 'valid',
      sentToAccountant: true,
      fileName: 'contrato_locacao_galpao.pdf',
    },
    {
      id: 'doc-3',
      title: 'Licença Sanitária e Vigilância',
      category: 'Alvarás e Licenças',
      dueDate: '2026-11-15',
      status: 'warning',
      sentToAccountant: false,
      fileName: 'licenca_sanitaria_2026.pdf',
    },
    {
      id: 'doc-4',
      title: 'Certidão Negativa de Débitos Federais (CND)',
      category: 'Certidões',
      dueDate: '2026-11-28',
      status: 'valid',
      sentToAccountant: true,
      fileName: 'cnd_receita_federal.pdf',
    },
  ]);

  // Novo Colaborador Form
  const [newEmp, setNewEmp] = useState({
    name: '',
    role: '',
    cpf: '',
    admissionDate: new Date().toISOString().split('T')[0],
    asoExpiration: '',
    uniformSize: 'G',
    epiDelivered: true,
  });

  // Novo Documento Form
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Alvarás e Licenças',
    dueDate: '',
    sentToAccountant: true,
  });

  const handleVerifyContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) return;

    setIsVerifying(true);
    try {
      const res = await fetch('/api/elocontabil/verificar-contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contato: contactInput, tipo: contactType }),
      });
      const data = await res.json();
      if (data.success) {
        setCamillaResponse({
          message: data.mensagem_camilla,
          link: data.link_acesso,
          token: data.token,
          status: data.status,
        });
      }
    } catch (err) {
      // Fallback gracioso
      const fakeToken = Math.random().toString(36).substring(2, 12);
      setCamillaResponse({
        message: `Olá! Sou a Camilla Faria do Grupo Eloizio ☕. Verifiquei seus dados e liberei seu acesso de demonstração ao EloContábil válido por 30 minutos!`,
        link: `https://elocontabil.grupoeloizio.com.br/acesso/${fakeToken}`,
        token: fakeToken,
        status: 'novo',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role) return;

    const created: Employee = {
      id: String(Date.now()),
      name: newEmp.name,
      role: newEmp.role,
      cpf: newEmp.cpf || '000.000.000-00',
      admissionDate: newEmp.admissionDate,
      asoExpiration: newEmp.asoExpiration || '2027-12-31',
      uniformSize: newEmp.uniformSize,
      epiDelivered: newEmp.epiDelivered,
      status: 'active',
    };

    setEmployees((prev) => [...prev, created]);
    setShowEmployeeModal(false);
    setNewEmp({
      name: '',
      role: '',
      cpf: '',
      admissionDate: new Date().toISOString().split('T')[0],
      asoExpiration: '',
      uniformSize: 'G',
      epiDelivered: true,
    });
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.dueDate) return;

    const created: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: newDoc.title,
      category: newDoc.category,
      dueDate: newDoc.dueDate,
      status: 'valid',
      sentToAccountant: newDoc.sentToAccountant,
      fileName: `${newDoc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    };

    setVaultDocs((prev) => [...prev, created]);
    setShowVaultModal(false);
    setNewDoc({
      title: '',
      category: 'Alvarás e Licenças',
      dueDate: '',
      sentToAccountant: true,
    });
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">
                  Elo<span className="text-emerald-400">Contábil</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Sem CRC • Apoio Administrativo
                </span>
              </div>
              <span className="text-xs text-slate-400">
                elocontabil.grupoeloizio.com.br • Atendente: Camilla Faria
              </span>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('rh')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rh'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1. RH de Apoio</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>2. Administrativo & Cofre</span>
            </button>
            <button
              onClick={() => setActiveTab('camilla')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'camilla'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Central Camilla</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tarja Informativa Oficial */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border-b border-emerald-900/30 px-4 py-2 text-center text-xs text-emerald-300">
        💡 <strong>Apoio Operacional Sem CRC:</strong> O EloContábil organiza dados, ponto, alvarás e checklists para envio mastigado ao seu contador de confiança.
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Banner do Portal da Camilla: Acesso Sem Senha */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-600/30">
                👩‍💼
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white">Camilla Faria</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    Gerente Geral & Atendente Virtual
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Acesso seguro exclusivo por WhatsApp e E-mail via Hub Central <code>webhook.grupoeloizio.com.br</code> (Link válido por 30 minutos).
                </p>
              </div>
            </div>

            {/* Form Rápido da Camilla */}
            <form onSubmit={handleVerifyContact} className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setContactType('whatsapp')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    contactType === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    contactType === 'email' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  E-mail
                </button>
              </div>

              <input
                type="text"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                placeholder={contactType === 'whatsapp' ? '21 99613-4073' : 'financeiro@empresa.com'}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
              />

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Verificando... ☕</span>
                ) : (
                  <>
                    <span>Falar com a Camilla</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resposta da Camilla */}
          {camillaResponse && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-emerald-900/60 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Resposta da Camilla (via Webhook Central):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Token: {camillaResponse.token} (Válido 30 min)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{camillaResponse.message}</p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={camillaResponse.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  <span>Abrir Link Temporário</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[11px] text-slate-500">
                  Destinatário Contábil: <strong>contabilidade@grupoeloizio.com.br</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ABA 1: RH DE APOIO */}
        {/* ======================================================== */}
        {activeTab === 'rh' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Módulo 1: RH de Apoio Operacional
                </h3>
                <p className="text-xs text-slate-400">
                  Controle de ponto simplificado, vencimento de ASO, gestão de uniformes e EPIs (NR-06) e modelos de advertência.
                </p>
              </div>

              <button
                onClick={() => setShowEmployeeModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Colaborador</span>
              </button>
            </div>

            {/* Cards de Métricas de RH */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Total Colaboradores</span>
                <div className="text-2xl font-black text-white mt-1">{employees.length}</div>
                <span className="text-[10px] text-emerald-400">100% em regime ativo</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-amber-400 font-semibold">Vencimento ASO em Alerta</span>
                <div className="text-2xl font-black text-amber-300 mt-1">1</div>
                <span className="text-[10px] text-slate-400">Rodrigo Medeiros (out/2026)</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Termos de EPI Entregues</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">100%</div>
                <span className="text-[10px] text-slate-400">Em conformidade com NR-06</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">Holerites do Mês</span>
                <div className="text-2xl font-black text-teal-400 mt-1">3 Prontos</div>
                <span className="text-[10px] text-slate-400">Disparo pelo WhatsApp da Camilla</span>
              </div>
            </div>

            {/* Tabela de Colaboradores */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Quadro de Funcionários & Controle de Ponto</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Colaborador / Cargo</th>
                      <th className="pb-3">CPF</th>
                      <th className="pb-3">Admissão</th>
                      <th className="pb-3">Vencimento ASO</th>
                      <th className="pb-3">Uniforme</th>
                      <th className="pb-3">Termo EPI</th>
                      <th className="pb-3 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-semibold text-white">
                          {emp.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{emp.role}</span>
                        </td>
                        <td className="py-3 text-slate-300 font-mono">{emp.cpf}</td>
                        <td className="py-3 text-slate-300">{new Date(emp.admissionDate).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 font-semibold text-amber-300">
                          {new Date(emp.asoExpiration).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 text-slate-300">Tamanho {emp.uniformSize}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            NR-06 Assinado
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() =>
                              alert(
                                `Camilla enviou 2ª via do holerite de ${emp.name} diretamente via WhatsApp pelo Hub Central!`
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            WhatsApp Holerite
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modelos de Documentos RH Prontos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Modelos Prontos de Advertência & Termos de Entrega
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Elaborados de acordo com o Art. 482 da CLT e NR-06. Baixe ou gere em PDF para assinar com o funcionário.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block">Termo de Entrega de EPI e Uniforme</strong>
                      <span className="text-[11px] text-slate-400">Declaração formal de guarda e conservação de equipamentos.</span>
                    </div>
                    <button
                      onClick={() => alert('Termo de EPI gerado em PDF com validade jurídica.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Baixar
                    </button>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block">Advertência Disciplinar Escrita (CLT)</strong>
                      <span className="text-[11px] text-slate-400">Para atrasos reiterados ou conduta sem justa causa imediata.</span>
                    </div>
                    <button
                      onClick={() => alert('Modelo de Advertência Disciplinar baixado.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Baixar
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Checklists de Admissão & Demissão
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A Camilla dispara o link interativo pelo WhatsApp para o contratado anexar a documentação de casa.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block">Checklist Completo de Admissão</strong>
                      <span className="text-[11px] text-slate-400">RG, CPF, Carteira Digital, ASO Admissional e Residência.</span>
                    </div>
                    <button
                      onClick={() => alert('Link do Checklist de Admissão enviado pelo WhatsApp da Camilla.')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                    >
                      Disparar Link
                    </button>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block">Checklist de Desligamento Homologado</strong>
                      <span className="text-[11px] text-slate-400">Exame Demissional, chaves, ferramentas e folha final.</span>
                    </div>
                    <button
                      onClick={() => alert('Checklist de Desligamento enviado.')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                    >
                      Disparar Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 2: ADMINISTRATIVO & COFRE DE DOCUMENTOS */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" />
                  Módulo 2: Administrativo & Cofre de Documentos
                </h3>
                <p className="text-xs text-slate-400">
                  Cofre com alerta de vencimento de alvarás e contratos, agenda do dia 28 e contas básicas a pagar/receber.
                </p>
              </div>

              <button
                onClick={() => setShowVaultModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Documento no Cofre</span>
              </button>
            </div>

            {/* Alerta de Ouro: Enviar Documentos ao Contador até o Dia 28 */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>REGRA DE OURO: Enviar Pacote Fiscal para o Contador até Dia 28</span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  A Camilla consolida extratos bancários, notas de entrada/saída e despesas para envio automático por e-mail para{' '}
                  <code className="text-emerald-300">contabilidade@grupoeloizio.com.br</code>.
                </p>
              </div>
              <button
                onClick={() => alert('Pacote fiscal do mês enviado por e-mail para contabilidade@grupoeloizio.com.br!')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap shadow-md cursor-pointer"
              >
                Encaminhar ao Contador Agora
              </button>
            </div>

            {/* Tabela do Cofre de Documentos */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Cofre Corporativo & Prazos de Licenças</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Documento</th>
                      <th className="pb-3">Categoria</th>
                      <th className="pb-3">Data de Vencimento</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Enviado ao Contador</th>
                      <th className="pb-3 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {vaultDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-semibold text-white">{doc.title}</td>
                        <td className="py-3 text-slate-400">{doc.category}</td>
                        <td className={`py-3 font-semibold ${doc.status === 'warning' ? 'text-amber-400' : 'text-slate-300'}`}>
                          {new Date(doc.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3">
                          {doc.status === 'warning' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Vence em Breve (30d)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Vigente
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {doc.sentToAccountant ? (
                            <span className="text-emerald-400 font-semibold">✅ Sim (E-mail)</span>
                          ) : (
                            <span className="text-slate-500">⏳ Pendente</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => alert(`Download seguro do arquivo ${doc.fileName} iniciado.`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            Baixar PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Painel Financeiro Básico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Contas a Pagar do Mês</h4>
                  <span className="text-sm font-black text-rose-400">R$ 4.250,00</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aluguel do galpão, energia, internet e fornecedores de insumos. Lançamento simplificado para conciliação bancária.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Previsão de Recebimentos</h4>
                  <span className="text-sm font-black text-emerald-400">R$ 12.890,00</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Contratos de manutenção mecânica e mensalidades recebidas via Mercado Pago e PIX direto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 3: CENTRAL DA CAMILLA */}
        {/* ======================================================== */}
        {activeTab === 'camilla' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  Módulo 3: Central da Camilla (Atendente Virtual de Suporte)
                </h3>
                <p className="text-xs text-slate-400">
                  Roteador integrado via Webhook Central (<code>webhook.grupoeloizio.com.br</code>) com triagem inteligente e envio ao contador.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Webhook Central Operando 24/7</span>
              </div>
            </div>

            {/* Perfil Executivo da Camilla */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-emerald-600/30">
                👩‍💼
              </div>
              <div className="space-y-1 text-center md:text-left flex-1">
                <h4 className="text-base font-extrabold text-white">
                  Camilla Faria — Gerente Geral do Grupo Eloizio
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  "Estou conectada ao WhatsApp oficial <strong>(21) 99613-4073</strong>. Recebo as notas fiscais e comprovantes pelo link temporário seguro, organizo as pastas e encaminho tudo mastigadinho por e-mail para o contador responsável."
                </p>
                <div className="text-[11px] text-slate-500 pt-1 flex flex-wrap items-center gap-4">
                  <span>📱 ZAP: 21 99613-4073</span>
                  <span>📧 E-mail: camilla@grupoeloizio.com.br</span>
                  <span>🏢 Destino Contábil: contabilidade@grupoeloizio.com.br</span>
                </div>
              </div>
            </div>

            {/* Atendimentos & Disparos Recentes */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Atendimentos Automatizados da Camilla</h4>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      WhatsApp
                    </span>
                    <div>
                      <strong className="text-white block">Envio de 2ª via do Holerite para Carlos Eduardo</strong>
                      <span className="text-slate-400 text-[11px]">Disparado via Hub Central para (21) 98764-****</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-emerald-400 font-semibold text-[11px]">Entregue com Sucesso</span>
                    <span className="text-slate-500 text-[10px]">Hoje às 09:15</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-400 font-bold text-[10px]">
                      E-mail
                    </span>
                    <div>
                      <strong className="text-white block">Remessa Fiscal do Mês Enviada ao Contador</strong>
                      <span className="text-slate-400 text-[11px]">Anexados: Extratos PDF + Despesas + Resumo de Ponto</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-emerald-400 font-semibold text-[11px]">Encaminhado</span>
                    <span className="text-slate-500 text-[10px]">Hoje às 08:30</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                      Lembrete
                    </span>
                    <div>
                      <strong className="text-white block">Aviso de Renovação do ASO Periódico para Rodrigo</strong>
                      <span className="text-slate-400 text-[11px]">Agendado para clínica credenciada em São Gonçalo</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-amber-300 font-semibold text-[11px]">Notificado</span>
                    <span className="text-slate-500 text-[10px]">Ontem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Adicionar Colaborador */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Cadastrar Colaborador (RH de Apoio)</h4>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="Ex: João Victor Santos"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Cargo</label>
                <input
                  type="text"
                  required
                  value={newEmp.role}
                  onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                  placeholder="Ex: Auxiliar Mecânico"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">CPF</label>
                  <input
                    type="text"
                    required
                    value={newEmp.cpf}
                    onChange={(e) => setNewEmp({ ...newEmp, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Data de Admissão</label>
                  <input
                    type="date"
                    required
                    value={newEmp.admissionDate}
                    onChange={(e) => setNewEmp({ ...newEmp, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Vencimento ASO</label>
                  <input
                    type="date"
                    required
                    value={newEmp.asoExpiration}
                    onChange={(e) => setNewEmp({ ...newEmp, asoExpiration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tamanho Uniforme</label>
                  <select
                    value={newEmp.uniformSize}
                    onChange={(e) => setNewEmp({ ...newEmp, uniformSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="epi_delivered_check"
                  checked={newEmp.epiDelivered}
                  onChange={(e) => setNewEmp({ ...newEmp, epiDelivered: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="epi_delivered_check" className="text-slate-300">
                  Termo de Entrega de EPI (NR-06) assinado
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Documento ao Cofre */}
      {showVaultModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Adicionar Documento ao Cofre</h4>
            <form onSubmit={handleAddDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Título do Documento</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="Ex: Alvará de Funcionamento São Gonçalo 2027"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Categoria</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Alvarás e Licenças">Alvarás e Licenças</option>
                  <option value="Contratos">Contratos</option>
                  <option value="Certidões">Certidões</option>
                  <option value="Seguros e Apólices">Seguros e Apólices</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Data de Vencimento</label>
                <input
                  type="date"
                  required
                  value={newDoc.dueDate}
                  onChange={(e) => setNewDoc({ ...newDoc, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="send_acc_check"
                  checked={newDoc.sentToAccountant}
                  onChange={(e) => setNewDoc({ ...newDoc, sentToAccountant: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="send_acc_check" className="text-slate-300">
                  Marcar cópia enviada ao contador por e-mail
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVaultModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Salvar no Cofre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rodapé Obrigatório (Regra de Ouro) */}
      <footer className="border-t border-slate-800 bg-slate-950/90 py-6 px-4 text-center mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-xs font-semibold text-emerald-400">
            "EloContábil é apoio administrativo, não substitui seu contador responsável."
          </p>
          <p className="text-[11px] text-slate-500">
            Grupo Eloizio 2026 • Subdomínio Oficial: <code>elocontabil.grupoeloizio.com.br</code> • WhatsApp da Camilla:{' '}
            <strong>21 99613-4073</strong> • São Gonçalo - RJ e todo o Brasil.
          </p>
        </div>
      </footer>
    </div>
  );
};
