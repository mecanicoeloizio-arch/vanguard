import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpirationReminderItem, ExpirationDocType } from '../../types';
import {
  BellRing,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  FileText,
  Building,
  User,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  Trash2,
  X,
  Check,
} from 'lucide-react';

export const CamillaExpirationReminders: React.FC = () => {
  const {
    expirationSettings,
    updateExpirationSettings,
    expirationItems,
    addExpirationItem,
    updateExpirationItem,
    deleteExpirationItem,
    triggerExpirationNotification,
    renewExpirationItem,
  } = useApp();

  // Filtros
  const [filterType, setFilterType] = useState<'all' | 'ASO' | 'CND'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vencendo' | 'vencido' | 'em_dia'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados dos formulários e modais
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedItemToRenew, setSelectedItemToRenew] = useState<ExpirationReminderItem | null>(null);
  const [renewDate, setRenewDate] = useState('');

  // Feedback e Alertas
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [sendingNotificationId, setSendingNotificationId] = useState<string | null>(null);

  // Template Tab
  const [activeTemplateTab, setActiveTemplateTab] = useState<'aso' | 'cnd'>('aso');

  // Novo Item Form State
  const [newItemForm, setNewItemForm] = useState<{
    tipo: ExpirationDocType;
    subtipo: any;
    titulo: string;
    funcionarioOuEmpresa: string;
    cargoOuCnpj: string;
    whatsapp: string;
    email: string;
    empresaVinculada: string;
    dataExameOuEmissao: string;
    dataVencimento: string;
    observacoes: string;
  }>({
    tipo: 'ASO',
    subtipo: 'aso_periodico',
    titulo: 'ASO Periódico Anual - NR-7',
    funcionarioOuEmpresa: '',
    cargoOuCnpj: '',
    whatsapp: '219',
    email: '',
    empresaVinculada: 'EloMak Oficina Mecânica LTDA',
    dataExameOuEmissao: new Date().toISOString().split('T')[0],
    dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    observacoes: '',
  });

  const showFeedback = (type: 'success' | 'info' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  // Cálculos de datas e status
  const calculateDaysRemaining = (vencimento: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(vencimento);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtragem de itens
  const filteredItems = expirationItems.filter((item) => {
    const matchesType = filterType === 'all' || item.tipo === filterType;
    const days = calculateDaysRemaining(item.dataVencimento);
    let computedStatus: 'em_dia' | 'vencendo' | 'vencido' = 'em_dia';
    if (days < 0) computedStatus = 'vencido';
    else if (days <= 30) computedStatus = 'vencendo';

    const matchesStatus = filterStatus === 'all' || computedStatus === filterStatus;

    const q = searchQuery.toLowerCase();
    const matchesQuery =
      item.funcionarioOuEmpresa.toLowerCase().includes(q) ||
      item.titulo.toLowerCase().includes(q) ||
      item.cargoOuCnpj.toLowerCase().includes(q) ||
      item.empresaVinculada.toLowerCase().includes(q) ||
      item.whatsapp.includes(q);

    return matchesType && matchesStatus && matchesQuery;
  });

  // Estatísticas
  const totalCount = expirationItems.length;
  const asoCount = expirationItems.filter((i) => i.tipo === 'ASO').length;
  const cndCount = expirationItems.filter((i) => i.tipo === 'CND').length;
  const vencendoCount = expirationItems.filter((i) => {
    const d = calculateDaysRemaining(i.dataVencimento);
    return d >= 0 && d <= 30;
  }).length;
  const vencidosCount = expirationItems.filter((i) => calculateDaysRemaining(i.dataVencimento) < 0).length;

  const handleToggleAntecedencia = (dia: number) => {
    const current = expirationSettings.diasAntecedencia || [];
    let updated: number[];
    if (current.includes(dia)) {
      updated = current.filter((d) => d !== dia);
    } else {
      updated = [...current, dia].sort((a, b) => b - a);
    }
    updateExpirationSettings({ diasAntecedencia: updated });
    showFeedback('info', `Configuração de antecedência atualizada: ${updated.join(', ')} dias.`);
  };

  const handleManualNotification = async (item: ExpirationReminderItem) => {
    setSendingNotificationId(item.id);
    try {
      const res = await triggerExpirationNotification(item.id);
      showFeedback('success', res.message);
    } catch {
      showFeedback('error', 'Falha ao conectar à API de WhatsApp da Camilla.');
    } finally {
      setSendingNotificationId(null);
    }
  };

  const handleOpenRenewModal = (item: ExpirationReminderItem) => {
    setSelectedItemToRenew(item);
    // Sugerir +1 ano para ASO ou +180 dias para CND
    const daysToAdd = item.tipo === 'ASO' ? 365 : 180;
    const nextDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setRenewDate(nextDate);
    setIsRenewModalOpen(true);
  };

  const handleConfirmRenew = () => {
    if (!selectedItemToRenew || !renewDate) return;
    renewExpirationItem(selectedItemToRenew.id, renewDate);
    setIsRenewModalOpen(false);
    showFeedback(
      'success',
      `Documento ${selectedItemToRenew.tipo} de ${selectedItemToRenew.funcionarioOuEmpresa} renovado com sucesso até ${new Date(renewDate).toLocaleDateString('pt-BR')}!`
    );
    setSelectedItemToRenew(null);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.funcionarioOuEmpresa || !newItemForm.dataVencimento) {
      showFeedback('error', 'Preencha o nome do funcionário/empresa e a data de vencimento.');
      return;
    }

    addExpirationItem({
      tipo: newItemForm.tipo,
      subtipo: newItemForm.subtipo,
      titulo: newItemForm.titulo,
      funcionarioOuEmpresa: newItemForm.funcionarioOuEmpresa,
      cargoOuCnpj: newItemForm.cargoOuCnpj,
      whatsapp: newItemForm.whatsapp,
      email: newItemForm.email,
      empresaVinculada: newItemForm.empresaVinculada,
      dataExameOuEmissao: newItemForm.dataExameOuEmissao,
      dataVencimento: newItemForm.dataVencimento,
      status: 'em_dia',
      notificacaoAutomatica: true,
      totalNotificacoesEnviadas: 0,
      observacoes: newItemForm.observacoes,
    });

    setIsAddingModalOpen(false);
    showFeedback('success', `Novo monitoramento de ${newItemForm.tipo} adicionado com sucesso!`);
    setNewItemForm({
      tipo: 'ASO',
      subtipo: 'aso_periodico',
      titulo: 'ASO Periódico Anual - NR-7',
      funcionarioOuEmpresa: '',
      cargoOuCnpj: '',
      whatsapp: '219',
      email: '',
      empresaVinculada: 'EloMak Oficina Mecânica LTDA',
      dataExameOuEmissao: new Date().toISOString().split('T')[0],
      dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      observacoes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header do Módulo */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <BellRing className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  Lembretes Automáticos de Vencimento • Camilla IA
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    ASO & CND via WhatsApp
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Notificações preventivas automáticas no WhatsApp para funcionários (Atestados Ocupacionais NR-7) e empresas (Certidões Fiscais).
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Disparo: {expirationSettings.horarioDisparo}h (1º horário útil)
            </span>
            <button
              onClick={() => setIsAddingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Cadastrar ASO / CND
            </button>
          </div>
        </div>

        {/* Alerta de Feedback */}
        {feedbackMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs flex items-center justify-between border ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : feedbackMessage.type === 'error'
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-medium">{feedbackMessage.text}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" /> Total Monitorado
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalCount}</span>
            <span className="text-[10px] text-slate-500">({asoCount} ASO • {cndCount} CND)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Vencendo em 30 Dias
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">{vencendoCount}</span>
            <span className="text-[10px] text-amber-500/80">alerta preventivo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Vencidos / Críticos
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-300">{vencidosCount}</span>
            <span className="text-[10px] text-rose-500/80">ação imediata</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Motor WhatsApp
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-300">
              {expirationSettings.ativoAso && expirationSettings.ativoCnd ? 'Ativo' : 'Parcial'}
            </span>
            <span className="text-[10px] text-emerald-500">EloWa • 21 99613-4073</span>
          </div>
        </div>
      </div>

      {/* CARD 1: Configurações Globais dos Lembretes */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Parâmetros de Disparo Automático via WhatsApp
            </h3>
            <p className="text-xs text-slate-400">
              Defina as regras de antecedência, horário diário e personalize a mensagem oficial que a Camilla envia para os funcionários.
            </p>
          </div>
        </div>

        {/* Toggles Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <strong className="text-xs font-bold text-white block">Lembretes de ASO (Funcionários)</strong>
              <p className="text-[11px] text-slate-400">
                Avisa o colaborador para agendar o exame médico ocupacional periódico (NR-7).
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={expirationSettings.ativoAso}
                onChange={(e) => updateExpirationSettings({ ativoAso: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <strong className="text-xs font-bold text-white block">Lembretes de CND (Empresas & Clientes)</strong>
              <p className="text-[11px] text-slate-400">
                Avisa os sócios e o setor contábil sobre vencimentos de certidões da Receita, FGTS e CNDT.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={expirationSettings.ativoCnd}
                onChange={(e) => updateExpirationSettings({ ativoCnd: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Antecedência e Horário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold">
              Disparar Notificações com Antecedência de:
            </label>
            <div className="flex flex-wrap gap-2">
              {[30, 15, 7, 3, 0].map((dia) => {
                const isSelected = expirationSettings.diasAntecedencia?.includes(dia);
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => handleToggleAntecedencia(dia)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {dia === 0 ? 'No dia do vencimento' : `${dia} dias antes`}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-slate-500 block">
              A Camilla Faria fará a verificação diária e só enviará a mensagem nas datas selecionadas.
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-300 font-bold">
              Horário do Disparo Automático (1º Horário Útil)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={expirationSettings.horarioDisparo}
                onChange={(e) => updateExpirationSettings({ horarioDisparo: e.target.value })}
                className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
              />
              <div className="space-y-0.5">
                <span className="text-slate-400 text-xs block">Recomendado: 08:30</span>
                <span className="text-[10px] text-emerald-400 block">Horário comercial sem incomodar o funcionário</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notificar Gestor */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <strong className="text-white">Enviar Cópia de Segurança ao Diretor / Gestor do RH</strong>
            </div>
            <input
              type="checkbox"
              checked={expirationSettings.notificarGestorWhatsapp}
              onChange={(e) => updateExpirationSettings({ notificarGestorWhatsapp: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </div>
          {expirationSettings.notificarGestorWhatsapp && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900">
              <div>
                <label className="block text-slate-400 mb-1">WhatsApp do Gestor / RH</label>
                <input
                  type="text"
                  value={expirationSettings.whatsappGestor}
                  onChange={(e) => updateExpirationSettings({ whatsappGestor: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs"
                />
              </div>
              <div className="flex items-center text-[11px] text-slate-500 pt-5">
                Cópia resumida diária informando os colaboradores com exames vencendo.
              </div>
            </div>
          )}
        </div>

        {/* Templates de Mensagem */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <strong className="text-slate-200">Templates de Mensagens do WhatsApp</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTemplateTab('aso')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                  activeTemplateTab === 'aso'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Template ASO (Funcionários)
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab('cnd')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                  activeTemplateTab === 'cnd'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Template CND (Empresas)
              </button>
            </div>
          </div>

          {activeTemplateTab === 'aso' ? (
            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">
                Mensagem enviada pela Camilla Faria para o funcionário:
              </label>
              <textarea
                rows={3}
                value={expirationSettings.templateAso}
                onChange={(e) => updateExpirationSettings({ templateAso: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
              />
              <span className="text-[10px] text-slate-500 block">
                Variáveis disponíveis: <code className="text-amber-400">{'{nome_funcionario}'}</code>,{' '}
                <code className="text-amber-400">{'{tipo_documento}'}</code>,{' '}
                <code className="text-amber-400">{'{empresa}'}</code>,{' '}
                <code className="text-amber-400">{'{data_vencimento}'}</code>,{' '}
                <code className="text-amber-400">{'{dias_restantes}'}</code>.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-slate-400 font-medium">
                Mensagem enviada pela Camilla Faria para o sócio/gestor da empresa:
              </label>
              <textarea
                rows={3}
                value={expirationSettings.templateCnd}
                onChange={(e) => updateExpirationSettings({ templateCnd: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-400 transition"
              />
              <span className="text-[10px] text-slate-500 block">
                Variáveis disponíveis: <code className="text-emerald-400">{'{empresa}'}</code>,{' '}
                <code className="text-emerald-400">{'{cnpj}'}</code>,{' '}
                <code className="text-emerald-400">{'{tipo_documento}'}</code>,{' '}
                <code className="text-emerald-400">{'{data_vencimento}'}</code>,{' '}
                <code className="text-emerald-400">{'{dias_restantes}'}</code>.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: Tabela e Gestão de Vencimentos em Tempo Real */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Vencimentos Monitorados (ASO Funcionários & CND Empresas)
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhe a lista de colaboradores e empresas cadastradas com disparo de alertas no WhatsApp.
            </p>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por nome, cargo ou WhatsApp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="all">Todos os Tipos</option>
              <option value="ASO">Apenas ASO (Funcionários)</option>
              <option value="CND">Apenas CND (Empresas)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="vencendo">Vencendo em 30 Dias</option>
              <option value="vencido">Vencidos</option>
              <option value="em_dia">Em Dia</option>
            </select>
          </div>
        </div>

        {/* Tabela de Itens */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Documento</th>
                <th className="pb-3 font-semibold">Funcionário / Empresa</th>
                <th className="pb-3 font-semibold">Empresa Vinculada</th>
                <th className="pb-3 font-semibold">Vencimento</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Alertas Enviados</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nenhum vencimento encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const days = calculateDaysRemaining(item.dataVencimento);
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Em dia ({days} dias)
                    </span>
                  );
                  if (days < 0) {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Vencido há {Math.abs(days)} dias
                      </span>
                    );
                  } else if (days <= 30) {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Vence em {days} dias
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-950/60 transition">
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              item.tipo === 'ASO'
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.tipo}
                          </span>
                          <div>
                            <strong className="text-white block font-medium">{item.titulo}</strong>
                            <span className="text-[10px] text-slate-500 capitalize">{item.subtipo.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <strong className="text-slate-200 block">{item.funcionarioOuEmpresa}</strong>
                        <span className="text-[10px] text-slate-500 block">{item.cargoOuCnpj}</span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Smartphone className="w-2.5 h-2.5 text-emerald-400" /> {item.whatsapp}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3 text-slate-300 text-[11px]">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Building className="w-3 h-3 text-slate-500" /> {item.empresaVinculada}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3 font-mono text-[11px] text-slate-200">
                        {new Date(item.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </td>

                      <td className="py-3.5 pr-3">{statusBadge}</td>

                      <td className="py-3.5 pr-3">
                        <span className="text-[11px] text-slate-300 block font-semibold">
                          {item.totalNotificacoesEnviadas || 0} envios
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {item.ultimaNotificacaoEm || 'Ainda não notificado'}
                        </span>
                      </td>

                      <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={sendingNotificationId === item.id}
                          onClick={() => handleManualNotification(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold transition inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Enviar Lembrete via WhatsApp Agora"
                        >
                          <Send className="w-3 h-3" />
                          {sendingNotificationId === item.id ? 'Enviando...' : 'Notificar'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenRenewModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold transition inline-flex items-center gap-1 cursor-pointer"
                          title="Marcar como Renovado"
                        >
                          <RefreshCw className="w-3 h-3" /> Renovar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remover monitoramento de ${item.tipo} para ${item.funcionarioOuEmpresa}?`)) {
                              deleteExpirationItem(item.id);
                              showFeedback('info', 'Item removido do monitoramento.');
                            }
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CADASTRAR NOVO VENCIMENTO (ASO / CND) */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsAddingModalOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" /> Novo Lembrete de Vencimento
              </h3>
              <p className="text-xs text-slate-400">
                Cadastre um exame médico ocupacional (ASO) ou certidão fiscal (CND) para acompanhamento automático da Camilla Faria.
              </p>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tipo de Documento</label>
                  <select
                    value={newItemForm.tipo}
                    onChange={(e) => {
                      const t = e.target.value as ExpirationDocType;
                      setNewItemForm({
                        ...newItemForm,
                        tipo: t,
                        titulo: t === 'ASO' ? 'ASO Periódico Anual - NR-7' : 'Certidão Negativa de Débitos',
                        subtipo: t === 'ASO' ? 'aso_periodico' : 'cnd_receita_federal',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  >
                    <option value="ASO">ASO (Atestado Médico Ocupacional)</option>
                    <option value="CND">CND (Certidão Negativa de Débitos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subtipo</label>
                  <select
                    value={newItemForm.subtipo}
                    onChange={(e) => setNewItemForm({ ...newItemForm, subtipo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  >
                    {newItemForm.tipo === 'ASO' ? (
                      <>
                        <option value="aso_periodico">ASO Periódico</option>
                        <option value="aso_admissional">ASO Admissional</option>
                        <option value="aso_retorno">ASO Retorno ao Trabalho</option>
                        <option value="aso_demissional">ASO Demissional</option>
                      </>
                    ) : (
                      <>
                        <option value="cnd_receita_federal">Receita Federal & PGFN</option>
                        <option value="cnd_fgts">FGTS (Caixa CRF)</option>
                        <option value="cnd_trabalhista">Trabalhista (CNDT / TST)</option>
                        <option value="cnd_estadual">Estadual (ICMS)</option>
                        <option value="cnd_municipal">Municipal (ISS)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {newItemForm.tipo === 'ASO' ? 'Nome do Colaborador / Funcionário' : 'Razão Social / Nome da Empresa'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={newItemForm.tipo === 'ASO' ? 'Ex: Carlos Eduardo Silva' : 'Ex: EloMak Serviços LTDA'}
                  value={newItemForm.funcionarioOuEmpresa}
                  onChange={(e) => setNewItemForm({ ...newItemForm, funcionarioOuEmpresa: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {newItemForm.tipo === 'ASO' ? 'Cargo / Função' : 'CNPJ da Empresa'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={newItemForm.tipo === 'ASO' ? 'Ex: Mecânico Industrial' : '00.000.000/0001-00'}
                    value={newItemForm.cargoOuCnpj}
                    onChange={(e) => setNewItemForm({ ...newItemForm, cargoOuCnpj: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">WhatsApp para Lembrete</label>
                  <input
                    type="text"
                    required
                    placeholder="21996134073"
                    value={newItemForm.whatsapp}
                    onChange={(e) => setNewItemForm({ ...newItemForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Empresa Vinculada</label>
                  <select
                    value={newItemForm.empresaVinculada}
                    onChange={(e) => setNewItemForm({ ...newItemForm, empresaVinculada: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="EloMak Oficina Mecânica LTDA">EloMak Oficina Mecânica LTDA</option>
                    <option value="EduVanguard Treinamentos LTDA">EduVanguard Treinamentos LTDA</option>
                    <option value="EloContábil Assessoria Digital LTDA">EloContábil Assessoria Digital LTDA</option>
                    <option value="Grupo Eloizio Central">Grupo Eloizio Central</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={newItemForm.dataVencimento}
                    onChange={(e) => setNewItemForm({ ...newItemForm, dataVencimento: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Observações Internas (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Exames laboratoriais solicitados; clínica conveniada"
                  value={newItemForm.observacoes}
                  onChange={(e) => setNewItemForm({ ...newItemForm, observacoes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  Salvar e Iniciar Monitoramento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENOVAR VENCIMENTO */}
      {isRenewModalOpen && selectedItemToRenew && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsRenewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" /> Renovar {selectedItemToRenew.tipo}
              </h3>
              <p className="text-xs text-slate-400">
                Atualize a data de validade após a realização do novo exame ou emissão da certidão.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <strong className="text-white block">{selectedItemToRenew.funcionarioOuEmpresa}</strong>
              <span className="text-slate-400 block">{selectedItemToRenew.titulo}</span>
              <span className="text-slate-500 block text-[11px]">
                Vencimento anterior: {new Date(selectedItemToRenew.dataVencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-bold">Nova Data de Vencimento</label>
              <input
                type="date"
                value={renewDate}
                onChange={(e) => setRenewDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setIsRenewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRenew}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer"
              >
                Confirmar Renovação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
