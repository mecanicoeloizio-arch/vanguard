import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  X,
  MessageSquare,
  Send,
  PlusCircle,
  HelpCircle,
  FileText,
  DollarSign,
  GraduationCap,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const HelpDeskModal: React.FC = () => {
  const {
    showHelpDesk,
    setShowHelpDesk,
    currentUser,
    supportTickets,
    createSupportTicket,
    addTicketMessage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tickets' | 'new' | 'faq'>('tickets');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<'financeiro' | 'secretaria' | 'academico' | 'tecnico'>('academico');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [chatInput, setChatInput] = useState('');

  if (!showHelpDesk) return null;

  const userTickets = supportTickets.filter(
    (t) => currentUser?.role === 'admin' || t.userId === (currentUser?.id || 'visitor')
  );

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    createSupportTicket(
      {
        userId: currentUser?.id || 'visitor',
        userName: currentUser?.name || 'Visitante',
        userRole: currentUser?.role || 'student',
        category: newCategory,
        subject: newSubject,
        description: newDescription,
        priority: 'media',
      },
      newDescription
    );

    setNewSubject('');
    setNewDescription('');
    setActiveTab('tickets');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTicketId) return;
    addTicketMessage(selectedTicketId, chatInput);
    setChatInput('');
  };

  const faqs = [
    {
      q: 'Como solicito minha Carteirinha de Estudante Digital oficial?',
      a: 'Acesse a "Área do Aluno" > aba "Secretaria & Documentos". Selecione "Carteirinha Digital", efetue o pagamento da taxa de emissão via Mercado Pago (PIX ou Cartão) e ela estará disponível imediatamente para download com QR Code oficial DNE.',
    },
    {
      q: 'Como funciona a marcação de presença em tempo real?',
      a: 'Ao assistir à aula ou comparecer ao laboratório virtual, clique no botão "Marcar Presença Hoje" no painel do aluno. O sistema computa o horário e a chave de validação automaticamente.',
    },
    {
      q: 'Qual é o critério de aprovação das disciplinas?',
      a: 'A média mínima para aprovação direta é 7,0 calculada com peso de Provas (80%) e Trabalhos (20%), além de frequência mínima obrigatória de 75%.',
    },
    {
      q: 'O que fazer caso esteja sem conexão de internet?',
      a: 'Nossa plataforma possui tecnologia offline-first. Suas notas, materiais e anotações continuam acessíveis no seu navegador e sincronizam assim que sua rede voltar.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="p-3.5 sm:p-5 bg-linear-to-r from-indigo-700 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold leading-tight truncate">Central de Suporte & Atendimento</h3>
              <p className="text-xs text-indigo-100 hidden sm:block">Atendimento ágil para alunos, professores e coordenação</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelpDesk(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => { setActiveTab('tickets'); setSelectedTicketId(null); }}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Meus Chamados ({userTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'new'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            + Abrir Novo Ticket
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'faq'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Perguntas Frequentes (FAQ)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'tickets' && (
            <div>
              {selectedTicket ? (
                /* Ticket conversation view */
                <div className="flex flex-col h-[400px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <button
                        onClick={() => setSelectedTicketId(null)}
                        className="text-xs text-indigo-600 font-semibold hover:underline mb-1"
                      >
                        ← Voltar para lista de tickets
                      </button>
                      <h4 className="font-bold text-slate-900 text-base">{selectedTicket.subject}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {selectedTicket.category}
                        </span>
                        <span>• Aberto em {selectedTicket.createdAt}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {selectedTicket.status === 'resolvido' ? 'Resolvido' : 'Em Análise'}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {selectedTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl max-w-lg ${
                          msg.sender === (currentUser?.name || '')
                            ? 'ml-auto bg-indigo-600 text-white'
                            : 'mr-auto bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] mb-1 opacity-80">
                          <span className="font-bold">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Digite sua resposta para o suporte..."
                      className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar
                    </button>
                  </form>
                </div>
              ) : (
                /* Ticket list */
                <div className="space-y-3">
                  {userTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 font-medium">Nenhum chamado aberto ainda.</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Precisa de auxílio com notas, boletos ou declarações? Abra um chamado.
                      </p>
                    </div>
                  ) : (
                    userTickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wide">
                              {t.category}
                            </span>
                            <span className="text-xs text-slate-400">{t.createdAt}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{t.subject}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                              t.status === 'resolvido'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.status === 'resolvido' ? 'Resolvido' : 'Em Atendimento'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'new' && (
            <form onSubmit={handleCreateTicket} className="space-y-4 max-w-xl mx-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Categoria do Chamado
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'secretaria', label: 'Secretaria', icon: FileText },
                    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
                    { id: 'academico', label: 'Acadêmico', icon: GraduationCap },
                    { id: 'tecnico', label: 'Suporte TI', icon: LifeBuoy },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setNewCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                          newCategory === cat.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Ex: Dúvida sobre parcelamento do curso ou emissão de diploma"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mensagem Detalhada
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Descreva detalhadamente sua solicitação para agilizarmos a resposta..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer"
                >
                  Enviar Chamado
                </button>
              </div>
            </form>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
