import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MailboxAccount, EmailMessage, EmailAttachment } from '../../types';
import {
  Mail,
  Send,
  Inbox,
  Trash2,
  FileText,
  ShieldAlert,
  Paperclip,
  Reply,
  Forward,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Users,
  Settings,
  Globe,
  ExternalLink,
  CreditCard,
  Printer,
  ChevronRight,
  Server,
  Key,
} from 'lucide-react';

export const WebmailPortal: React.FC = () => {
  const {
    mailboxes,
    emailMessages,
    activeMailbox,
    setActiveMailbox,
    createMailbox,
    sendEmailMessage,
    forwardEmailMessage,
    deleteEmailMessage,
    markEmailAsRead,
    updateMailSubscription,
    setActiveNavTab,
  } = useApp();

  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash' | 'spam'>('inbox');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'webmail' | 'admin'>('webmail');

  // Modais
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<EmailAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Modal Novo E-mail no Admin
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccPrefix, setNewAccPrefix] = useState('');
  const [newAccDomain, setNewAccDomain] = useState('grupoeloizio.com.br');
  const [newAccPlan, setNewAccPlan] = useState<'vanguard_student' | 'subscriber_pro' | 'subscriber_enterprise'>('vanguard_student');
  const [newAccCourse, setNewAccCourse] = useState('Mecânica e Manutenção de Máquinas de Costura');

  // Caixa postal atual selecionada
  const currentBox = mailboxes.find((b) => b.email.toLowerCase() === activeMailbox.toLowerCase()) || mailboxes[0];

  // Mensagens filtradas para a caixa e pasta atuais
  const folderMessages = emailMessages.filter((m) => {
    const isBox = m.mailbox.toLowerCase() === currentBox.email.toLowerCase();
    const isFolder = m.folder === currentFolder;
    const matchesSearch =
      !searchQuery ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fromEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bodyHtml.toLowerCase().includes(searchQuery.toLowerCase());
    return isBox && isFolder && matchesSearch;
  });

  // Contadores
  const unreadInboxCount = emailMessages.filter(
    (m) => m.mailbox.toLowerCase() === currentBox.email.toLowerCase() && m.folder === 'inbox' && !m.read
  ).length;

  const selectedMsg = emailMessages.find((m) => m.id === selectedMessageId);

  const handleSelectMessage = (msg: EmailMessage) => {
    setSelectedMessageId(msg.id);
    if (!msg.read) {
      markEmailAsRead(msg.id);
    }
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim()) return;

    setIsSending(true);
    const recipients = composeTo.split(',').map((t) => t.trim()).filter(Boolean);

    sendEmailMessage({
      fromEmail: currentBox.email,
      fromName: currentBox.name,
      to: recipients,
      subject: composeSubject.trim() || '(Sem Assunto)',
      bodyHtml: `<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;"><p>${composeBody.replace(/\n/g, '<br/>')}</p></div>`,
      attachments: composeAttachments,
    });

    setIsSending(false);
    setIsComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setComposeAttachments([]);
  };

  const handleReply = () => {
    if (!selectedMsg) return;
    setComposeTo(selectedMsg.fromEmail);
    setComposeSubject(`Re: ${selectedMsg.subject.replace(/^Re:\s*/i, '')}`);
    setComposeBody(`\n\n\n--- Em ${selectedMsg.date}, ${selectedMsg.fromName} escreveu:\n${selectedMsg.bodyHtml.replace(/<[^>]+>/g, '')}`);
    setIsComposeOpen(true);
  };

  const handleForward = () => {
    if (!selectedMsg) return;
    setComposeTo('');
    setComposeSubject(`Fwd: ${selectedMsg.subject.replace(/^Fwd:\s*/i, '')}`);
    setComposeBody(`\n\n--- Mensagem Encaminhada ---\nDe: ${selectedMsg.fromName} <${selectedMsg.fromEmail}>\nData: ${selectedMsg.date}\nAssunto: ${selectedMsg.subject}\n\n${selectedMsg.bodyHtml.replace(/<[^>]+>/g, '')}`);
    setComposeAttachments(selectedMsg.attachments || []);
    setIsComposeOpen(true);
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccPrefix.trim() || !newAccName.trim()) return;

    const fullEmail = `${newAccPrefix.trim().toLowerCase()}@${newAccDomain}`;
    const isStudent = newAccPlan === 'vanguard_student';

    createMailbox({
      email: fullEmail,
      name: newAccName.trim(),
      role: isStudent ? 'student' : 'subscriber',
      plan: newAccPlan,
      quotaMb: isStudent ? 1024 : (newAccPlan === 'subscriber_enterprise' ? 15360 : 5120),
      usedMb: 2,
      status: 'active',
      isStudentFree: isStudent,
      course: isStudent ? newAccCourse : undefined,
      subscriptionPaymentStatus: isStudent ? 'free_for_student' : 'pending_mercadopago',
    });

    setIsCreateAccountOpen(false);
    setNewAccName('');
    setNewAccPrefix('');
  };

  // Cota
  const quotaPct = Math.min(100, Math.round((currentBox.usedMb / Math.max(1, currentBox.quotaMb)) * 100));

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* HEADER: SUBDOMÍNIO & SELETOR DE CONTA */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-base tracking-tight text-white">Servidor de E-mail • Grupo Eloizio</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                webmail.grupoeloizio.com.br
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ✓ PHPMailer 6.9+ Ativo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Alunos Vanguard: <strong className="text-emerald-400">100% Gratuito</strong> • Assinantes: <strong className="text-amber-400">Mercado Pago</strong>
            </p>
          </div>
        </div>

        {/* Seletor de Conta Ativa e Modos */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Caixa:</span>
            <select
              value={currentBox.email}
              onChange={(e) => {
                setActiveMailbox(e.target.value);
                setSelectedMessageId(null);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer"
            >
              {mailboxes.map((b) => (
                <option key={b.id} value={b.email} className="bg-slate-800 text-white">
                  {b.name} ({b.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('webmail')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'webmail'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Webmail</span>
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Painel Servidor</span>
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: CLIENTE DE WEBMAIL (3 COLUNAS) */}
      {viewMode === 'webmail' && (
        <div className="flex-1 flex overflow-hidden">
          {/* COLUNA ESQUERDA: PASTAS, PLANO E COTA */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
            <div className="space-y-4">
              {/* Botão Escrever */}
              <button
                onClick={() => setIsComposeOpen(true)}
                className="w-full py-3 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Mensagem</span>
              </button>

              {/* Perfil da Conta Selecionada */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <span className="font-extrabold text-slate-900 block truncate">{currentBox.name}</span>
                <span className="text-[11px] font-mono text-slate-500 block truncate">{currentBox.email}</span>

                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  {currentBox.isStudentFree ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Aluno Gratuito
                    </span>
                  ) : currentBox.role === 'admin' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-white">
                      👑 Diretoria
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                      Assinante Pago (MP)
                    </span>
                  )}
                </div>
              </div>

              {/* Pastas */}
              <nav className="space-y-1 text-xs font-semibold">
                <button
                  onClick={() => setCurrentFolder('inbox')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                    currentFolder === 'inbox'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-indigo-600" />
                    <span>Caixa de Entrada</span>
                  </span>
                  {unreadInboxCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-black">
                      {unreadInboxCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentFolder('sent')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                    currentFolder === 'sent'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Send className="w-4 h-4 text-slate-500" />
                    <span>Enviados</span>
                  </span>
                </button>

                <button
                  onClick={() => setCurrentFolder('drafts')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                    currentFolder === 'drafts'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Rascunhos</span>
                  </span>
                </button>

                <button
                  onClick={() => setCurrentFolder('spam')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                    currentFolder === 'spam'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-slate-500" />
                    <span>Spam</span>
                  </span>
                </button>

                <button
                  onClick={() => setCurrentFolder('trash')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer ${
                    currentFolder === 'trash'
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Trash2 className="w-4 h-4 text-slate-500" />
                    <span>Lixeira</span>
                  </span>
                </button>
              </nav>
            </div>

            {/* Cota de Espaço */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                  Cota
                </span>
                <span className="font-mono text-[10px]">
                  {currentBox.usedMb} MB / {currentBox.quotaMb} MB
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full"
                  style={{ width: `${quotaPct}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Subdomínio: webmail.grupoeloizio.com.br
              </p>
            </div>
          </aside>

          {/* COLUNA DO MEIO: LISTA DE MENSAGENS */}
          <section className="w-80 sm:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar e-mails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-100 rounded-xl text-xs border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {folderMessages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Nenhum e-mail encontrado nesta pasta.
                </div>
              ) : (
                folderMessages.map((msg) => {
                  const isUnread = !msg.read;
                  const isSelected = msg.id === selectedMessageId;

                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-4 hover:bg-slate-50 cursor-pointer transition space-y-1.5 ${
                        isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : ''
                      } ${isUnread ? 'bg-white font-bold' : 'bg-slate-50/30 text-slate-600'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          {isUnread && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>}
                          <span className="text-xs text-slate-900 truncate font-extrabold">{msg.fromName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{msg.date}</span>
                      </div>

                      <h5 className="text-xs text-slate-800 line-clamp-1 font-semibold">
                        {msg.subject}
                      </h5>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="line-clamp-1 flex-1">
                          {msg.bodyHtml.replace(/<[^>]+>/g, '').substring(0, 50)}...
                        </span>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <span className="ml-2 text-indigo-600 font-bold shrink-0 flex items-center gap-0.5">
                            <Paperclip className="w-3 h-3" />
                            {msg.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* COLUNA DIREITA: LEITOR DE MENSAGEM SELECIONADA */}
          <main className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
            {!selectedMsg ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-200/60 flex items-center justify-center text-3xl">
                  ✉️
                </div>
                <h4 className="font-extrabold text-sm text-slate-700">Nenhum e-mail selecionado</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Selecione uma mensagem na lista à esquerda para ler o conteúdo, baixar anexos ou responder.
                </p>
              </div>
            ) : (
              <>
                {/* Barra de Ações */}
                <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReply}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Responder</span>
                    </button>
                    <button
                      onClick={handleForward}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Forward className="w-3.5 h-3.5" />
                      <span>Encaminhar</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteEmailMessage(selectedMsg.id);
                        setSelectedMessageId(null);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                    title="Imprimir"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Header da Mensagem */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                        {selectedMsg.subject}
                      </h2>
                      <span className="text-xs text-slate-400 font-mono shrink-0">
                        {selectedMsg.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {selectedMsg.fromName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-slate-900 truncate">{selectedMsg.fromName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono truncate">&lt;{selectedMsg.fromEmail}&gt;</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          Para: {selectedMsg.to.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Anexos */}
                  {selectedMsg.attachments && selectedMsg.attachments.length > 0 && (
                    <div className="bg-indigo-50/60 rounded-3xl p-5 border border-indigo-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-indigo-950 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Anexos da Mensagem</span>
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-200 text-indigo-900">
                          {selectedMsg.attachments.length} arquivo(s)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedMsg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="truncate">
                              <span className="text-xs font-bold text-slate-900 block truncate">{att.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{att.size}</span>
                            </div>
                            <a
                              href={att.url || '#'}
                              download={att.name}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black border border-indigo-200 shrink-0"
                            >
                              Baixar
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Corpo da Mensagem */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs min-h-[300px]">
                    <div
                      className="text-xs sm:text-sm text-slate-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedMsg.bodyHtml }}
                    />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      )}

      {/* VIEW 2: PAINEL ADMINISTRATIVO DO SERVIDOR DE E-MAIL */}
      {viewMode === 'admin' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                Gerência de Servidor de E-mail • PHPMailer 6.9+
              </span>
              <h2 className="text-2xl font-black text-white">
                Controle de Contas, Cotas e Planos de Assinatura
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Alunos matriculados no Vanguard têm e-mail estudantil gratuito. Assinantes externos são faturados via Mercado Pago.
              </p>
            </div>

            <button
              onClick={() => setIsCreateAccountOpen(true)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Endereço de E-mail</span>
            </button>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Total de Caixas Postais</span>
              <span className="text-2xl font-black text-slate-900">{mailboxes.length} Caixas</span>
              <p className="text-xs text-slate-500 mt-1">Domínios @grupoeloizio.com.br e @aluno.eduvanguard.com.br</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-emerald-600 block">Alunos Vanguard (Gratuito)</span>
              <span className="text-2xl font-black text-emerald-700">
                {mailboxes.filter((b) => b.isStudentFree).length} Contas
              </span>
              <p className="text-xs text-emerald-600 font-semibold mt-1">100% isentos de taxa de assinatura</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-black uppercase text-purple-600 block">Assinantes Mercado Pago</span>
              <span className="text-2xl font-black text-purple-700">
                {mailboxes.filter((b) => b.role === 'subscriber').length} Contas
              </span>
              <p className="text-xs text-purple-600 font-semibold mt-1">R$ 19,90/mês a R$ 39,90/mês</p>
            </div>
          </div>

          {/* Tabela de Contas */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">Caixas Postais Ativas no Servidor</h3>
                <p className="text-xs text-slate-500">webmail.grupoeloizio.com.br</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="p-4">Titular & Endereço</th>
                    <th className="p-4">Plano / Categoria</th>
                    <th className="p-4">Cota em Disco</th>
                    <th className="p-4">Status & Faturamento</th>
                    <th className="p-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mailboxes.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <strong className="text-slate-900 block">{b.name}</strong>
                        <span className="text-[11px] font-mono text-slate-500">{b.email}</span>
                      </td>
                      <td className="p-4">
                        {b.isStudentFree ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Aluno Vanguard (Gratuito)
                          </span>
                        ) : b.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-white">
                            Diretoria Geral
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                            Assinante Pro (Mercado Pago)
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-slate-700">{b.usedMb} MB / {b.quotaMb} MB</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Ativo
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setActiveMailbox(b.email);
                            setViewMode('webmail');
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Abrir Caixa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: COMPOR MENSAGEM */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-300" />
                <span>Nova Mensagem • PHPMailer Engine</span>
              </h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">De (Remetente)</label>
                <input
                  type="text"
                  readOnly
                  value={`${currentBox.name} <${currentBox.email}>`}
                  className="w-full px-3.5 py-2 bg-slate-100 rounded-xl text-slate-700 font-mono font-bold border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Para (Destinatários)</label>
                <input
                  type="text"
                  required
                  placeholder="aluno@aluno.eduvanguard.com.br, eloizio@grupoeloizio.com.br"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-xl text-slate-900 border border-slate-300 focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Assunto</label>
                <input
                  type="text"
                  required
                  placeholder="Informe o assunto do e-mail"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-xl text-slate-900 border border-slate-300 focus:border-indigo-600 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Mensagem</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Digite o conteúdo da mensagem..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full p-3.5 bg-white rounded-xl text-slate-900 border border-slate-300 focus:border-indigo-600 focus:outline-hidden leading-relaxed"
                ></textarea>
              </div>

              {composeAttachments.length > 0 && (
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1">
                  <span className="font-bold text-[11px] text-indigo-950">Anexos Vinculados ({composeAttachments.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {composeAttachments.map((att, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono">
                        📎 {att.name} ({att.size})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Enviando...' : 'Enviar E-mail via PHPMailer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR CONTA NO ADMIN */}
      {isCreateAccountOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Criar Novo Endereço de E-mail</h3>
              <button
                onClick={() => setIsCreateAccountOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo dos Santos"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Prefixo do E-mail</label>
                  <input
                    type="text"
                    required
                    placeholder="carlos.mecanica"
                    value={newAccPrefix}
                    onChange={(e) => setNewAccPrefix(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Domínio</label>
                  <select
                    value={newAccDomain}
                    onChange={(e) => setNewAccDomain(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:border-indigo-600 focus:outline-hidden"
                  >
                    <option value="grupoeloizio.com.br">@grupoeloizio.com.br</option>
                    <option value="aluno.eduvanguard.com.br">@aluno.eduvanguard.com.br</option>
                    <option value="eduvanguard.com.br">@eduvanguard.com.br</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Plano & Modalidade</label>
                <select
                  value={newAccPlan}
                  onChange={(e) => setNewAccPlan(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
                >
                  <option value="vanguard_student">🎓 Aluno Vanguard (100% Gratuito - 1 GB)</option>
                  <option value="subscriber_pro">💼 Assinante Pro (Pago via Mercado Pago - 5 GB)</option>
                  <option value="subscriber_enterprise">🏢 Assinante Enterprise (Pago via Mercado Pago - 15 GB)</option>
                </select>
              </div>

              {newAccPlan === 'vanguard_student' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Curso Livre Vinculado</label>
                  <input
                    type="text"
                    value={newAccCourse}
                    onChange={(e) => setNewAccCourse(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateAccountOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md"
                >
                  Criar Conta Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
