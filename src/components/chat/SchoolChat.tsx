import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  Users,
  Search,
  CheckCheck,
  Smile,
  FileText,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { UnauthorizedView } from '../auth/UnauthorizedView';

export const SchoolChat: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <UnauthorizedView requiredRole="student" title="Chat Acadêmico & Comunicação" />;
  }

  return <SchoolChatContent currentUser={currentUser} />;
};

const SchoolChatContent: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const { chatMessages, sendMessage, courses } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'course' | 'direct_teacher' | 'coordination'>('course');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [mobileView, setMobileView] = useState<'channels' | 'messages'>('messages');

  const channels = [
    {
      id: 'course' as const,
      name: 'Engenharia de Software Moderna (Turma Geral)',
      subtitle: 'Comunidade de alunos & docentes',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'direct_teacher' as const,
      name: 'Profa. Dra. Mariana Fernandes (Docente)',
      subtitle: 'Canal Direto de Dúvidas e Feedback',
      unread: 1,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'coordination' as const,
      name: 'Secretaria & Coordenação de Curso',
      subtitle: 'Atendimento de Matrículas e Horários',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachedFile) return;

    sendMessage(messageInput, 'course_1', attachedFile || undefined);
    setMessageInput('');
    setAttachedFile(null);

    // If sent by student to teacher, trigger friendly auto-reply after 1.5 seconds
    if (currentUser.role === 'student' && selectedChannel === 'direct_teacher') {
      setTimeout(() => {
        sendMessage(
          'Olá, Lucas! Li sua dúvida sobre a aula. O material complementar e o exemplo de código já foram atualizados no repositório.',
          'course_1'
        );
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-[80vh] sm:h-[75vh] flex flex-col md:flex-row">
        {/* Left Channels Sidebar */}
        <div className={`w-full md:w-80 border-r border-slate-200 bg-slate-50/70 flex-col shrink-0 ${mobileView === 'messages' ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h3 className="font-black text-slate-900 text-base">Chat Interno Acadêmico</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Comunicação direta entre alunos e professores
            </p>
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {channels.map((ch) => {
              const isSelected = selectedChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setSelectedChannel(ch.id);
                    setMobileView('messages');
                  }}
                  className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-200 shadow-2xs'
                      : 'hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <img
                    src={ch.avatar}
                    alt={ch.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-950 font-extrabold' : 'text-slate-800'}`}>
                        {ch.name}
                      </span>
                      {ch.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                          {ch.unread}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {ch.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current user badge in chat */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block capitalize">
                ● Conectado como {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right Messages Area */}
        <div className={`flex-1 flex-col bg-white ${mobileView === 'channels' ? 'hidden md:flex' : 'flex'}`}>
          {/* Active Channel Header */}
          <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMobileView('channels')}
                className="md:hidden p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 flex items-center gap-1 font-bold text-xs shrink-0 cursor-pointer"
                title="Voltar aos canais"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Canais</span>
              </button>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">
                  {channels.find((c) => c.id === selectedChannel)?.name}
                </h4>
                <span className="text-[11px] text-slate-500 hidden sm:block truncate">
                  Canal criptografado de ponta a ponta para orientações pedagógicas
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="hidden sm:inline">Tempo Real</span>
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {chatMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isTeacher = msg.senderRole === 'teacher';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-xl ${isMine ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 mt-1"
                  />
                  <div className={`space-y-1 ${isMine ? 'items-end text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{msg.senderName}</span>
                      {isTeacher && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-indigo-100 text-indigo-800 font-extrabold text-[9px] uppercase">
                          Docente
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200'
                      }`}
                    >
                      <p>{msg.content}</p>
                      {msg.fileAttachment && (
                        <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 text-xs font-semibold ${
                          isMine ? 'bg-indigo-700 text-white' : 'bg-white text-slate-800 border border-slate-200'
                        }`}>
                          <FileText className="w-4 h-4" />
                          <span>{msg.fileAttachment.name} ({msg.fileAttachment.size})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attached file badge */}
          {attachedFile && (
            <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <span className="flex items-center gap-1.5 font-bold">
                <Paperclip className="w-3.5 h-3.5" /> Anexo: {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-indigo-600 hover:text-indigo-900 font-bold"
              >
                Remover
              </button>
            </div>
          )}

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2 bg-slate-50/60">
            <button
              type="button"
              onClick={() => setAttachedFile({ name: 'Duvida-Exercicio-SOLID.pdf', size: '1.2 MB' })}
              className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer"
              title="Anexar arquivo ou PDF"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Digite sua mensagem ou dúvida para o professor..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
