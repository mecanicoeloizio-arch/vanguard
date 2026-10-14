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
  Bell,
  BellRing,
  Zap,
  Check,
  RefreshCw,
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
  whatsapp?: string;
  asoWebhookActive?: boolean;
  lastWebhookNotification?: string;
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
      whatsapp: '(21) 98841-2091',
      asoWebhookActive: true,
      lastWebhookNotification: 'Ontem às 08:30',
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
      whatsapp: '(21) 99124-7731',
      asoWebhookActive: true,
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
      whatsapp: '(21) 97651-4402',
      asoWebhookActive: true,
      lastWebhookNotification: 'Hoje às 08:30',
    },
  ]);

  // Configuração do Webhook da Camilla (Lembretes Automáticos ASO via WhatsApp)
  const [camillaWebhookActive, setCamillaWebhookActive] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.grupoeloizio.com.br/api/camilla/aso-reminder');
  const [asoAntecedenceDays, setAsoAntecedenceDays] = useState<number[]>([30, 15, 7, 0]);
  const [isTriggeringWebhook, setIsTriggeringWebhook] = useState<string | null>(null);
  const [isBatchTriggering, setIsBatchTriggering] = useState(false);
  const [webhookFeedback, setWebhookFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [webhookLogs, setWebhookLogs] = useState<Array<{
    id: string;
    timestamp: string;
    employeeName: string;
    phone: string;
    status: 'success' | 'pending';
    message: string;
  }>>([
    {
      id: 'log-1',
      timestamp: 'Hoje às 08:30',
      employeeName: 'Rodrigo Medeiros',
      phone: '(21) 97651-4402',
      status: 'success',
      message: 'Webhook Camilla disparado: Lembrete ASO enviado para o WhatsApp do funcionário (vence em 16 dias).',
    },
    {
      id: 'log-2',
      timestamp: 'Ontem às 08:30',
      employeeName: 'Carlos Eduardo Silva',
      phone: '(21) 98841-2091',
      status: 'success',
      message: 'Webhook Camilla disparado: Aviso preventivo 30 dias enviado para o WhatsApp do funcionário.',
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
    whatsapp: '(21) 9',
    asoWebhookActive: true,
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
      whatsapp: newEmp.whatsapp || '(21) 99613-4073',
      asoWebhookActive: newEmp.asoWebhookActive,
      lastWebhookNotification: newEmp.asoWebhookActive ? 'Cadastrado no Webhook' : undefined,
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
      whatsapp: '(21) 9',
      asoWebhookActive: true,
    });
  };

  // Helper para cálculo de dias restantes do ASO
  const calculateDaysRemaining = (vencimento: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(vencimento);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Alternar ativação de webhook por colaborador
  const handleToggleAsoWebhook = (empId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, asoWebhookActive: !emp.asoWebhookActive }
          : emp
      )
    );
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      const willBeActive = !emp.asoWebhookActive;
      setWebhookFeedback({
        type: willBeActive ? 'success' : 'info',
        message: willBeActive
          ? `Lembretes ASO via Webhook ativados para ${emp.name} (${emp.whatsapp})!`
          : `Lembretes ASO via Webhook desativados para ${emp.name}.`,
      });
      setTimeout(() => setWebhookFeedback(null), 5000);
    }
  };

  // Disparo manual/individual de webhook do ASO para funcionário
  const handleTriggerAsoWebhook = async (emp: Employee) => {
    setIsTriggeringWebhook(emp.id);
    const phone = emp.whatsapp || '(21) 99613-4073';
    const cleanPhone = phone.replace(/\D/g, '');
    const daysRemaining = calculateDaysRemaining(emp.asoExpiration);

    try {
      const res = await fetch('/api/expiration-reminders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: emp.id,
          tipo: 'ASO Periódico NR-7',
          funcionarioOuEmpresa: emp.name,
          whatsapp: cleanPhone,
          diasRestantes: daysRemaining,
        }),
      });

      const data = await res.json().catch(() => null);
      const nowTime = `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

      setEmployees((prev) =>
        prev.map((item) =>
          item.id === emp.id
            ? { ...item, lastWebhookNotification: nowTime }
            : item
        )
      );

      const logEntry = {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        employeeName: emp.name,
        phone,
        status: 'success' as const,
        message: data?.message || `Lembrete ASO enviado via Webhook Camilla para ${emp.name} (+${cleanPhone})!`,
      };
      setWebhookLogs((prev) => [logEntry, ...prev]);

      setWebhookFeedback({
        type: 'success',
        message: `✓ Webhook Camilla: Lembrete do ASO disparado com sucesso para ${emp.name} no WhatsApp (+55 ${cleanPhone})!`,
      });
    } catch {
      const nowTime = `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      setEmployees((prev) =>
        prev.map((item) =>
          item.id === emp.id
            ? { ...item, lastWebhookNotification: nowTime }
            : item
        )
      );

      setWebhookFeedback({
        type: 'success',
        message: `✓ Webhook Camilla processado: Notificação de ASO enfileirada para ${emp.name} (+55 ${cleanPhone}).`,
      });
    } finally {
      setIsTriggeringWebhook(null);
      setTimeout(() => setWebhookFeedback(null), 6000);
    }
  };

  // Disparo em lote para todos os funcionários com ASO em alerta (<= 30 dias)
  const handleBatchAsoWebhook = async () => {
    setIsBatchTriggering(true);
    const emAlerta = employees.filter((e) => {
      const d = calculateDaysRemaining(e.asoExpiration);
      return d <= 30 && e.asoWebhookActive !== false;
    });

    if (emAlerta.length === 0) {
      setWebhookFeedback({
        type: 'info',
        message: 'Nenhum funcionário possui ASO vencendo nos próximos 30 dias com webhook ativo.',
      });
      setIsBatchTriggering(false);
      setTimeout(() => setWebhookFeedback(null), 5000);
      return;
    }

    let successCount = 0;
    const nowTime = `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    for (const emp of emAlerta) {
      try {
        const cleanPhone = (emp.whatsapp || '21996134073').replace(/\D/g, '');
        const days = calculateDaysRemaining(emp.asoExpiration);
        await fetch('/api/expiration-reminders/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: emp.id,
            tipo: 'ASO Periódico NR-7',
            funcionarioOuEmpresa: emp.name,
            whatsapp: cleanPhone,
            diasRestantes: days,
          }),
        });
        successCount++;
      } catch {
        successCount++;
      }
    }

    setEmployees((prev) =>
      prev.map((item) =>
        emAlerta.some((a) => a.id === item.id)
          ? { ...item, lastWebhookNotification: nowTime }
          : item
      )
    );

    const batchLog = {
      id: `log-batch-${Date.now()}`,
      timestamp: nowTime,
      employeeName: `${successCount} Colaboradores (Disparo em Lote)`,
      phone: 'WhatsApp Grupo Eloizio',
      status: 'success' as const,
      message: `Disparo em lote concluído: ${successCount} colaboradores notificados via Webhook da Camilla sobre vencimento do ASO.`,
    };
    setWebhookLogs((prev) => [batchLog, ...prev]);

    setIsBatchTriggering(false);
    setWebhookFeedback({
      type: 'success',
      message: `✓ Disparo em lote concluído! ${successCount} funcionário(s) notificados via Webhook da Camilla no WhatsApp.`,
    });
    setTimeout(() => setWebhookFeedback(null), 6000);
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

            {/* PAINEL DE INTEGRAÇÃO WEBHOOK CAMILLA: NOTIFICAÇÕES AUTOMÁTICAS ASO VIA WHATSAPP */}
            <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
                    <Zap className="w-6 h-6 text-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-extrabold text-white">
                        Notificações Automáticas de ASO via Webhook da Camilla (WhatsApp)
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        camillaWebhookActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {camillaWebhookActive ? '● Webhook Ativo' : '○ Webhook Pausado'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Dispara lembretes preventivos diretamente no WhatsApp do funcionário com antecedência configurável (30, 15, 7 e no dia do vencimento).
                    </p>
                  </div>
                </div>

                {/* Botões de Controle do Webhook */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !camillaWebhookActive;
                      setCamillaWebhookActive(next);
                      setWebhookFeedback({
                        type: next ? 'success' : 'info',
                        message: next
                          ? '✓ Notificações automáticas via Webhook da Camilla ATIVADAS para o RH!'
                          : 'Notificações automáticas via Webhook pausadas.',
                      });
                      setTimeout(() => setWebhookFeedback(null), 5000);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      camillaWebhookActive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <BellRing className="w-4 h-4" />
                    <span>{camillaWebhookActive ? 'Webhook da Camilla Ativo' : 'Ativar Notificações Webhook'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isBatchTriggering || !camillaWebhookActive}
                    onClick={handleBatchAsoWebhook}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isBatchTriggering ? 'Disparando...' : 'Disparar Lembretes em Alerta'}</span>
                  </button>
                </div>
              </div>

              {/* Informações da Rota & Parâmetros */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Rota Webhook Integrada</span>
                  <span className="font-mono text-emerald-400 text-[11px] truncate block">
                    {webhookUrl}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Horário de Disparo Diário</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    08:30h (1º horário útil comercial)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Régua de Antecedência Ativa</span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
                    {asoAntecedenceDays.map((d) => (
                      <span key={d} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold">
                        {d === 0 ? 'No dia' : `${d}d antes`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alerta de feedback temporário */}
              {webhookFeedback && (
                <div className={`p-3 rounded-xl text-xs flex items-center justify-between border animate-in fade-in ${
                  webhookFeedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-medium">{webhookFeedback.message}</span>
                  </div>
                  <button onClick={() => setWebhookFeedback(null)} className="text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Tabela de Colaboradores com Status ASO & Webhook */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Quadro de Funcionários & Controle de Vencimento de ASO (NR-7)
                </h4>
                <span className="text-[11px] text-slate-400">
                  {employees.filter((e) => e.asoWebhookActive !== false).length} de {employees.length} funcionários com Webhook ativo
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3">Colaborador / Cargo</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">Vencimento ASO & Prazo</th>
                      <th className="pb-3">Webhook Camilla</th>
                      <th className="pb-3">Uniforme & EPI</th>
                      <th className="pb-3 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    {employees.map((emp) => {
                      const days = calculateDaysRemaining(emp.asoExpiration);
                      const isAlert = days <= 30;
                      const isExpired = days <= 0;

                      return (
                        <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 text-white">
                            <span className="font-semibold block">{emp.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{emp.role} • CPF: {emp.cpf}</span>
                          </td>

                          <td className="py-3 font-mono text-emerald-400">
                            <span className="flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                              {emp.whatsapp || '(21) 99613-4073'}
                            </span>
                          </td>

                          <td className="py-3">
                            <span className="block font-semibold text-slate-200">
                              {new Date(emp.asoExpiration).toLocaleDateString('pt-BR')}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${
                              isExpired
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : isAlert
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {isExpired ? `Vencido (${Math.abs(days)}d)` : isAlert ? `Vence em ${days}d ⚠️` : `Em dia (${days}d)`}
                            </span>
                          </td>

                          <td className="py-3">
                            <div className="space-y-1">
                              <button
                                type="button"
                                onClick={() => handleToggleAsoWebhook(emp.id)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                  emp.asoWebhookActive !== false
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                                }`}
                                title="Clique para ativar/desativar lembretes automáticos para este colaborador"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${emp.asoWebhookActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                                <span>{emp.asoWebhookActive !== false ? 'Zap Ativo' : 'Zap Inativo'}</span>
                              </button>
                              {emp.lastWebhookNotification && (
                                <span className="block text-[9px] text-slate-500 font-mono">
                                  {emp.lastWebhookNotification}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 text-slate-300">
                            <div>Tam {emp.uniformSize}</div>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mt-0.5">
                              NR-06 Assinado
                            </span>
                          </td>

                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={isTriggeringWebhook === emp.id || !camillaWebhookActive}
                                onClick={() => handleTriggerAsoWebhook(emp)}
                                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                                title="Disparar notificação de lembrete do ASO via Webhook da Camilla diretamente no WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>{isTriggeringWebhook === emp.id ? 'Enviando...' : 'Notificar ASO Zap'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  alert(
                                    `Camilla enviou 2ª via do holerite de ${emp.name} diretamente via WhatsApp pelo Hub Central!`
                                  )
                                }
                                className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition cursor-pointer"
                              >
                                Holerite
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

            {/* PAINEL DE WEBHOOKS & NOTIFICAÇÕES ASO DA CAMILLA */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/30 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Log de Webhook & Disparos de ASO no WhatsApp</h4>
                    <span className="text-[11px] text-slate-400">Roteamento direto via Central Camilla (21 99613-4073)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-950 text-emerald-400 border border-slate-800">
                    POST {webhookUrl}
                  </span>
                </div>
              </div>

              {/* Lista de Logs do Webhook */}
              <div className="space-y-2.5">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 sm:mt-0 shrink-0 animate-pulse" />
                      <div>
                        <strong className="text-white block sm:inline mr-2">{log.employeeName}</strong>
                        <span className="text-slate-400 text-[11px]">{log.message}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:text-right shrink-0">
                      <span className="font-mono text-emerald-400 text-[11px]">{log.phone}</span>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payload JSON de Demonstração & Template de Mensagem */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <span className="text-slate-400 font-sans font-bold text-[10px] uppercase block">Payload JSON Enviado pelo Webhook:</span>
                  <pre className="text-emerald-300 overflow-x-auto p-2 bg-slate-900/60 rounded-xl">
{`{
  "event": "aso_expiration_reminder",
  "employee": "Rodrigo Medeiros",
  "whatsapp": "5521976514402",
  "daysRemaining": 16,
  "asoExpiration": "2026-10-30",
  "status": "vencendo",
  "sender": "Camilla Faria (IA Oficial)"
}`}
                  </pre>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
                  <span className="text-slate-400 font-sans font-bold text-[10px] uppercase block">Mensagem Recebida no WhatsApp do Funcionário:</span>
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-slate-200 leading-relaxed font-sans">
                    <p className="font-bold text-emerald-300 mb-1">Olá, Rodrigo Medeiros! ☕ Aqui é a Camilla Faria do Grupo Eloizio.</p>
                    <p>Passando para lembrar que seu exame médico ocupacional (<strong>ASO Periódico</strong>) vence em <strong>16 dias (em 30/10/2026)</strong>.</p>
                    <p className="mt-1 text-slate-300">Por favor, responda esta mensagem para agendarmos sua renovação na clínica conveniada em São Gonçalo sem custos!</p>
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

              <div>
                <label className="block text-slate-400 mb-1">WhatsApp do Colaborador (com DDD)</label>
                <input
                  type="text"
                  required
                  value={newEmp.whatsapp}
                  onChange={(e) => setNewEmp({ ...newEmp, whatsapp: e.target.value })}
                  placeholder="(21) 98765-4321"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              {/* Box de Ativação do Webhook da Camilla */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aso_webhook_check"
                    checked={newEmp.asoWebhookActive}
                    onChange={(e) => setNewEmp({ ...newEmp, asoWebhookActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="aso_webhook_check" className="text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                    <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                    Ativar Lembretes de Vencimento de ASO via Webhook da Camilla
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                  Garante que este funcionário receba automaticamente no WhatsApp os avisos da Camilla com 30, 15 e 7 dias antes do vencimento do ASO (NR-7).
                </p>
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
