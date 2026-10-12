import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatsAppInstance, WhatsAppMessage, WhatsAppMediaAttachment } from '../../types';
import {
  MessageSquare,
  Send,
  Paperclip,
  Mic,
  Video,
  FileText,
  Forward,
  Plus,
  RefreshCw,
  Search,
  CheckCheck,
  Check,
  Smartphone,
  QrCode,
  ShieldCheck,
  ExternalLink,
  CreditCard,
  Layers,
  Activity,
  Users,
  Settings,
  X,
  Play,
  Download,
  AlertCircle,
  ChevronRight,
  BatteryCharging,
  Wifi,
} from 'lucide-react';

export const ElowaWhatsAppPortal: React.FC = () => {
  const {
    whatsappInstances,
    whatsappMessages,
    activeWhatsappInstanceId,
    setActiveWhatsappInstanceId,
    createWhatsappInstance,
    sendWhatsappMessage,
    forwardWhatsappMessage,
    updateWhatsappSubscription,
  } = useApp();

  const [viewMode, setViewMode] = useState<'chat' | 'admin'>('chat');
  const [searchChat, setSearchChat] = useState('');

  // Instância ativa
  const currentInstance =
    whatsappInstances.find((i) => i.id === activeWhatsappInstanceId) ||
    whatsappInstances[0];

  // Agrupamento de conversas para a instância ativa
  const instanceMessages = whatsappMessages.filter(
    (m) => m.instanceId === currentInstance.id
  );

  const chatMap: Record<
    string,
    { phone: string; name: string; lastMessage: string; lastTime: string; unreadCount: number }
  > = {};

  instanceMessages.forEach((m) => {
    const key = m.chatPhone;
    if (!chatMap[key]) {
      chatMap[key] = {
        phone: m.chatPhone,
        name: m.chatName,
        lastMessage: m.text || (m.type === 'audio' ? '🎵 Mensagem de voz' : m.type === 'pdf' ? '📄 Documento PDF' : '🎥 Vídeo'),
        lastTime: m.timestamp,
        unreadCount: !m.fromMe && m.status !== 'read' ? 1 : 0,
      };
    }
  });

  const chatList = Object.values(chatMap).filter(
    (c) =>
      c.name.toLowerCase().includes(searchChat.toLowerCase()) ||
      c.phone.includes(searchChat)
  );

  const [activeChatPhone, setActiveChatPhone] = useState<string>(
    chatList[0]?.phone || '5521987648727'
  );

  const activeChat = chatList.find((c) => c.phone === activeChatPhone) || {
    phone: activeChatPhone,
    name: activeChatPhone === '5521987648727' ? 'Eloizio Assunção (CEO Direção)' : `Contato ${activeChatPhone}`,
    lastMessage: '',
    lastTime: '',
    unreadCount: 0,
  };

  const activeMessages = instanceMessages.filter(
    (m) => m.chatPhone === activeChatPhone
  );

  // Estado do Compositor
  const [inputText, setInputText] = useState('');
  const [pendingMedia, setPendingMedia] = useState<WhatsAppMediaAttachment | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Modais
  const [showNewInstanceModal, setShowNewInstanceModal] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [newInstancePhone, setNewInstancePhone] = useState('');
  const [newInstanceRole, setNewInstanceRole] = useState<'student' | 'subscriber'>('student');

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardTargetPhones, setForwardTargetPhones] = useState('');
  const [forwardingMessage, setForwardingMessage] = useState<WhatsAppMessage | null>(null);

  const [showPairingModal, setShowPairingModal] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !pendingMedia) return;

    sendWhatsappMessage({
      instanceId: currentInstance.id,
      chatPhone: activeChatPhone,
      chatName: activeChat.name,
      type: pendingMedia ? pendingMedia.type : 'text',
      text: inputText.trim(),
      media: pendingMedia,
    });

    setInputText('');
    setPendingMedia(null);
    setShowAttachmentMenu(false);
  };

  const handleSelectMediaType = (type: 'pdf' | 'video' | 'audio') => {
    setShowAttachmentMenu(false);
    if (type === 'pdf') {
      setPendingMedia({
        type: 'pdf',
        fileName: 'Manual_Tecnico_Regulagem_Mecanica_2026.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        size: '2.4 MB',
        pages: 52,
      });
    } else if (type === 'video') {
      setPendingMedia({
        type: 'video',
        fileName: 'Video_Demonstracao_Pratica_Bancada.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        size: '8.2 MB',
        duration: 60,
      });
    } else if (type === 'audio') {
      setPendingMedia({
        type: 'audio',
        fileName: 'audio_gravado_camilla.ogg',
        url: 'https://actions.google.com/sounds/v1/human_voices/speaking_sample.ogg',
        size: '340 KB',
        duration: 24,
      });
    }
  };

  const handleCreateNewInstance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstancePhone.trim()) return;

    createWhatsappInstance({
      name: newInstanceName.trim() || 'Nova Conexão WhatsApp',
      phone: newInstancePhone.trim(),
      role: newInstanceRole,
      plan: newInstanceRole === 'student' ? 'vanguard_student' : 'subscriber_pro',
    });

    setShowNewInstanceModal(false);
    setNewInstanceName('');
    setNewInstancePhone('');
  };

  const handleConfirmForward = () => {
    if (!forwardingMessage || !forwardTargetPhones.trim()) return;
    const phones = forwardTargetPhones.split(',').map((p) => p.trim()).filter(Boolean);

    forwardWhatsappMessage(forwardingMessage.id, phones, currentInstance.id);
    setShowForwardModal(false);
    setForwardingMessage(null);
    setForwardTargetPhones('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Bar EloWa */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-500 via-teal-600 to-green-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-white">EloWa • WhatsApp Multi-Device</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                elowa.grupoeloizio.com.br
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                ZAP Camilla & Vanguard: (21) 99613-4073
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Motor Baileys Socket • Texto, Áudio, Vídeo e PDF • Vanguard Alunos (Grátis) & Assinantes MP
            </p>
          </div>
        </div>

        {/* Controles de Instância e Modo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Seletor de Instância */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">WhatsApp:</span>
            <select
              value={currentInstance.id}
              onChange={(e) => setActiveWhatsappInstanceId(e.target.value)}
              className="bg-transparent text-emerald-400 font-extrabold text-xs focus:outline-hidden cursor-pointer"
            >
              {whatsappInstances.map((inst) => (
                <option key={inst.id} value={inst.id} className="bg-slate-900 text-white">
                  {inst.name} ({inst.phoneDisplay})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle entre Chat e Admin */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'chat'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Web Chat</span>
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Painel Admin</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewInstanceModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Novo WhatsApp</span>
          </button>
        </div>
      </header>

      {/* VIEW 1: WEB CHAT COMPLETO */}
      {viewMode === 'chat' && (
        <div className="flex-1 flex overflow-hidden">
          {/* COLUNA ESQUERDA: LISTA DE CHATS */}
          <aside className="w-80 sm:w-96 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
            {/* Info da Instância Selecionada */}
            <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-white truncate">{currentInstance.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {currentInstance.phoneDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                {currentInstance.isMaster ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    👑 MASTER OFICIAL CAMILLA
                  </span>
                ) : currentInstance.isStudentFree ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ ALUNO VANGUARD (GRÁTIS)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    💳 ASSINANTE PRO (MERCADO PAGO)
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-400" />
                  {currentInstance.battery}%
                </span>
              </div>

              {/* Busca */}
              <div className="relative pt-1">
                <input
                  type="text"
                  placeholder="Pesquisar conversas..."
                  value={searchChat}
                  onChange={(e) => setSearchChat(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-800 text-xs text-white rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Lista de Conversas */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {chatList.map((chat) => {
                const isSelected = chat.phone === activeChatPhone;
                return (
                  <div
                    key={chat.phone}
                    onClick={() => setActiveChatPhone(chat.phone)}
                    className={`flex items-center gap-3 p-3.5 transition hover:bg-slate-900 cursor-pointer ${
                      isSelected ? 'bg-slate-800/90 border-l-4 border-emerald-500' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{chat.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{chat.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{chat.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* COLUNA DIREITA: CONVERSA ABERTA & MENSAGENS */}
          <main className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
            {/* Header da Conversa */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-inner">
                  {activeChat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">{activeChat.name}</h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {activeChat.phone}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Instância Transmissora: <strong className="text-slate-300">{currentInstance.name}</strong> • Baileys Gateway
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPairingModal(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ver Pareamento</span>
                </button>
              </div>
            </div>

            {/* Feed de Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/90">
              {activeMessages.map((msg) => {
                const isMe = msg.fromMe;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-lg rounded-2xl p-3.5 shadow-md space-y-2 ${
                        isMe
                          ? 'bg-emerald-800/90 text-white rounded-tr-xs'
                          : 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={isMe ? 'text-emerald-200' : 'text-emerald-400'}>
                          {isMe ? currentInstance.name : msg.chatName}
                        </span>
                        <span className="font-mono text-slate-300">{msg.timestamp}</span>
                      </div>

                      {/* Texto */}
                      {msg.text && (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}

                      {/* Áudio */}
                      {msg.type === 'audio' && msg.media && (
                        <div className="bg-black/30 rounded-xl p-2.5 space-y-1.5 border border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🎙️</span>
                            <span className="text-[11px] font-bold text-emerald-300">Mensagem de Voz / Áudio</span>
                            <span className="text-[10px] font-mono text-slate-400 ml-auto">
                              {msg.media.duration || 24}s
                            </span>
                          </div>
                          <audio controls className="w-full h-8">
                            <source src={msg.media.url} type="audio/ogg" />
                            Seu navegador não suporta reprodução de áudio.
                          </audio>
                        </div>
                      )}

                      {/* Vídeo */}
                      {msg.type === 'video' && msg.media && (
                        <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 space-y-1.5">
                          <video controls className="w-full max-h-60 rounded-lg">
                            <source src={msg.media.url} type="video/mp4" />
                            Seu navegador não suporta vídeos.
                          </video>
                          <div className="p-2 flex items-center justify-between text-[11px] text-slate-300">
                            <span className="truncate">🎥 {msg.media.fileName}</span>
                            <span className="font-mono text-[10px]">{msg.media.size}</span>
                          </div>
                        </div>
                      )}

                      {/* PDF */}
                      {msg.type === 'pdf' && msg.media && (
                        <div className="bg-black/30 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-2xl">📄</span>
                            <div className="truncate">
                              <strong className="text-xs text-white block truncate">{msg.media.fileName}</strong>
                              <span className="text-[10px] text-slate-400 font-mono">{msg.media.size}</span>
                            </div>
                          </div>
                          <a
                            href={msg.media.url}
                            download={msg.media.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black shrink-0 transition"
                          >
                            Baixar PDF
                          </a>
                        </div>
                      )}

                      {/* Rodapé com Encaminhar e Status */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                        <button
                          onClick={() => {
                            setForwardingMessage(msg);
                            setShowForwardModal(true);
                          }}
                          className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Forward className="w-3 h-3" />
                          <span>Encaminhar</span>
                        </button>
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Baileys Socket</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compositor de Mensagem */}
            <footer className="p-3 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2">
              {/* Preview de Mídia Selecionada */}
              {pendingMedia && (
                <div className="flex items-center justify-between bg-slate-900 border border-emerald-500/30 p-2.5 rounded-xl text-xs text-white">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg">
                      {pendingMedia.type === 'pdf' ? '📄' : pendingMedia.type === 'video' ? '🎥' : '🎙️'}
                    </span>
                    <span className="font-bold truncate">{pendingMedia.fileName}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {pendingMedia.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setPendingMedia(null)}
                    className="text-slate-400 hover:text-rose-400 font-bold text-sm cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Menu de Anexos */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-base transition cursor-pointer"
                    title="Adicionar Anexo"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {showAttachmentMenu && (
                    <div className="absolute bottom-12 left-0 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl w-48 space-y-1 z-30">
                      <button
                        type="button"
                        onClick={() => handleSelectMediaType('pdf')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>Documento PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectMediaType('video')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Video className="w-4 h-4 text-indigo-400" />
                        <span>Vídeo Explicativo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectMediaType('audio')}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-amber-400" />
                        <span>Gravar / Áudio</span>
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={`Digite uma mensagem para ${activeChat.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 text-xs sm:text-sm text-white rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden"
                />

                <button
                  type="button"
                  onClick={() => handleSelectMediaType('audio')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 text-base transition cursor-pointer"
                  title="Áudio"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Enviar</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </footer>
          </main>
        </div>
      )}

      {/* VIEW 2: PAINEL ADMINISTRATIVO GERAL */}
      {viewMode === 'admin' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Banner Principal */}
          <div className="bg-linear-to-r from-slate-950 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ✓ ZAP Oficial: (21) 99613-4073
                </span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  ⚡ Autonomia Camilla Faria Master
                </span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  💳 Faturamento Mercado Pago
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Controle Geral de Instâncias Baileys & Roteamento Vanguard
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Todas as notificações educacionais (matrículas, boletos PIX e certificados) são processadas por este servidor. Alunos têm acesso gratuito para tirar dúvidas com professores; assinantes externos (oficinas e técnicos) pagam mensalidade recorrente no Mercado Pago.
              </p>
            </div>

            <button
              onClick={() => setShowNewInstanceModal(true)}
              className="px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Conectar Nova Instância</span>
            </button>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Total de Instâncias</span>
              <span className="text-2xl font-black text-white">{whatsappInstances.length} Conexões</span>
              <p className="text-xs text-emerald-400 font-semibold mt-1">Conectadas via Baileys Socket WSS</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xs">
              <span className="text-[10px] font-black uppercase text-emerald-400 block">Alunos Vanguard (Grátis)</span>
              <span className="text-2xl font-black text-emerald-400">
                {whatsappInstances.filter((i) => i.isStudentFree).length} Alunos
              </span>
              <p className="text-xs text-slate-400 mt-1">100% isentos de taxa de assinatura</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xs">
              <span className="text-[10px] font-black uppercase text-purple-400 block">Assinantes Mercado Pago</span>
              <span className="text-2xl font-black text-purple-400">
                {whatsappInstances.filter((i) => i.role === 'subscriber').length} Oficinas
              </span>
              <p className="text-xs text-slate-400 mt-1">R$ 49,90/mês a R$ 89,90/mês</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xs">
              <span className="text-[10px] font-black uppercase text-amber-400 block">Total de Mensagens</span>
              <span className="text-2xl font-black text-white">
                {whatsappMessages.length} Transmitidas
              </span>
              <p className="text-xs text-amber-300 font-semibold mt-1">Texto, Áudio, Vídeo e PDFs</p>
            </div>
          </div>

          {/* Tabela de Instâncias */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-white">Instâncias WhatsApp no Servidor</h3>
                <p className="text-xs text-slate-400">elowa.grupoeloizio.com.br</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Engine: @whiskeysockets/baileys 6.7+
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Instância</th>
                    <th className="p-4">Número</th>
                    <th className="p-4">Tipo & Plano</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Tráfego</th>
                    <th className="p-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {whatsappInstances.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4">
                        <div className="font-bold text-white">{inst.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{inst.id}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        {inst.phoneDisplay}
                      </td>
                      <td className="p-4">
                        {inst.isMaster ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                            MASTER OFICIAL CAMILLA
                          </span>
                        ) : inst.isStudentFree ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            ALUNO (GRATUITO)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
                            ASSINANTE PRO (R$ 49,90)
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Online
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        ↑ {inst.totalSent} | ↓ {inst.totalReceived}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setActiveWhatsappInstanceId(inst.id);
                            setViewMode('chat');
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Abrir Chat &rarr;
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

      {/* MODAL: NOVA INSTÂNCIA WHATSAPP */}
      {showNewInstanceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewInstance}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-white animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">Conectar Novo WhatsApp EloWa</h3>
              <button
                type="button"
                onClick={() => setShowNewInstanceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nome / Identificação</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Suporte Técnico São Gonçalo"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Número de WhatsApp (com DDD)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 21996134073"
                  value={newInstancePhone}
                  onChange={(e) => setNewInstancePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Perfil de Usuário</label>
                <select
                  value={newInstanceRole}
                  onChange={(e) => setNewInstanceRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white"
                >
                  <option value="student">Aluno Vanguard (Gratuito)</option>
                  <option value="subscriber">Assinante Pro (Mercado Pago)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">Código de Pareamento Baileys Automático:</span>
                <div className="text-lg font-black font-mono text-emerald-400">
                  ELOW-{newInstancePhone.slice(-4) || '9613'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewInstanceModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
              >
                Criar Conexão Baileys
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ENCAMINHAR MENSAGEM */}
      {showForwardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white">↪ Encaminhar Mensagem EloWa</h3>
              <button onClick={() => setShowForwardModal(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700 italic truncate">
              {forwardingMessage?.text || '(Arquivo de mídia)'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Destinatários (telefones separados por vírgula):
              </label>
              <input
                type="text"
                placeholder="21987648727, 21998877665"
                value={forwardTargetPhones}
                onChange={(e) => setForwardTargetPhones(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForwardModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmForward}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Encaminhar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE E PAIRING CODE */}
      {showPairingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 text-white text-center">
            <h3 className="font-black text-base text-white">Pareamento WhatsApp Baileys</h3>
            <p className="text-xs text-slate-400">
              Instância: <strong>{currentInstance.name}</strong>
            </p>

            <div className="bg-white p-4 rounded-2xl mx-auto inline-block shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ELOWA_BAILEYS_${currentInstance.id}`}
                alt="QR Code Baileys"
                className="w-44 h-44"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Código de Pareamento de 8 dígitos:</span>
              <span className="text-xl font-black font-mono text-emerald-400">
                {currentInstance.pairingCode || 'ELOW-9613'}
              </span>
            </div>

            <button
              onClick={() => setShowPairingModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
