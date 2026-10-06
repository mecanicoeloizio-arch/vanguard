import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { askCamillaAssistant, diagnoseMediaWithCamilla, getTimeGreeting, SofiaMessage } from '../../services/sofiaAI';
import {
  Sparkles,
  X,
  Send,
  Phone,
  Gift,
  Loader2,
  Copy,
  Check,
  Bot,
  User,
  BookOpen,
  CreditCard,
  Award,
  Camera,
  Image as ImageIcon,
  Wrench,
  Briefcase,
  Coffee,
  CheckCircle,
} from 'lucide-react';

export const SofiaVirtualAssistant: React.FC = () => {
  const {
    courses,
    setSelectedCourseForDetails,
    setOpenPaymentModal,
    addLead,
    sofiaSettings,
    setActiveNavTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [interlocutorRole, setInterlocutorRole] = useState<'client' | 'technician' | 'subscriber'>('client');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { greeting, isMorning } = getTimeGreeting();

  const [messages, setMessages] = useState<SofiaMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'sofia',
      text: `${greeting}! ☕ Eu sou a **Camilla Faria**, 28 anos, Gerente Geral e Atendente Inteligente do **Grupo Eloizio** (grupoeloizio.com.br).\n\n${
        isMorning ? 'Bom, depois da minha primeira xícara de café já dei boot total e funciono a todo vapor!' : 'Prazer enorme ter você aqui conosco!'
      } Eu adoro organizar o caos administrativo e vibro com cada venda realizada! Aqui você encontra:\n\n• 💼 **Contabilidade & Assessoria 100% Online** (MEI, CNPJ e declarações ágeis);\n• 🎓 **Cursos Livres (100% Online)** com Certificação Oficial MEC e Carteirinha DNE;\n• 🪡 **Máquinas de Costura & Mecânica em São Gonçalo - RJ** (conserto, reforma e peças);\n• 💳 Pagamento facilitado em até 12x exclusivamente no **Mercado Pago** com cupom **CAMILLA15** (-15%)!\n\nVocê também pode enviar fotos de máquinas ou peças com defeito pelo botão de câmera para um pré-diagnóstico na hora. Como posso te atender hoje?`,
      timestamp: 'Agora',
      suggestedActions: [
        { label: '🎁 Resgatar Cupom CAMILLA15 (-15%)', action: 'coupon' },
        { label: '🪡 Máquinas de Costura & Oficina (São Gonçalo)', action: 'sewing_machines' },
        { label: '💼 Contabilidade & Assessoria 100% Online', action: 'accounting' },
        { label: '📚 Ver Cursos Livres com Registro MEC', action: 'all_courses' },
        { label: '💳 Pagamentos Mercado Pago (PIX e 12x)', action: 'payment' },
        { label: '📲 Falar no WhatsApp Oficial (21 996134073)', action: 'whatsapp' },
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Lead generation form state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCourse, setLeadCourse] = useState(courses[0]?.title || 'Engenharia de Software Moderna');
  const [leadSuccess, setLeadSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: SofiaMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'msg_welcome')
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.text,
        }));

      const replyText = await askCamillaAssistant(text, courses, history, interlocutorRole);

      // Check if a course was mentioned to add quick action
      const matchedCourse = courses.find((c) =>
        replyText.toLowerCase().includes(c.title.toLowerCase())
      );

      const suggestedActions: { label: string; action: string; payload?: string }[] = [
        { label: `🎁 Quero Meu Desconto (${sofiaSettings?.activeCoupon || 'CAMILLA15'})`, action: 'lead_form' },
        { label: '📲 Continuar no WhatsApp Oficial', action: 'whatsapp' },
      ];

      if (matchedCourse) {
        suggestedActions.unshift({
          label: `✨ Conhecer "${matchedCourse.title.slice(0, 24)}..."`,
          action: 'view_course',
          payload: matchedCourse.id,
        });
        suggestedActions.splice(1, 0, {
          label: '💳 Matricular pelo Mercado Pago',
          action: 'enroll_mp',
          payload: matchedCourse.id,
        });
      }

      const camillaReply: SofiaMessage = {
        id: `camilla_${Date.now()}`,
        sender: 'sofia',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions,
      };

      setMessages((prev) => [...prev, camillaReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `camilla_err_${Date.now()}`,
          sender: 'sofia',
          text: 'Tive uma breve oscilação na conexão, mas estou aqui! Pode falar comigo sobre os cursos, contabilidade ou máquinas de costura em São Gonçalo!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;

      // Add user photo message
      const photoMsg: SofiaMessage = {
        id: `user_photo_${Date.now()}`,
        sender: 'user',
        text: '📸 [Foto enviada para diagnóstico mecânico]',
        mediaUrl: base64Data,
        isMultimedia: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, photoMsg]);
      setIsTyping(true);
      setUploadingImage(false);

      try {
        const diagnosis = await diagnoseMediaWithCamilla(base64Data, file.name, interlocutorRole);

        const replyMsg: SofiaMessage = {
          id: `camilla_diag_${Date.now()}`,
          sender: 'sofia',
          text: diagnosis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            { label: '📲 Agendar Visita / WhatsApp (21 996134073)', action: 'whatsapp' },
            { label: '💳 Pagar Conserto no Mercado Pago', action: 'payment' },
            { label: '👤 Enviar Meus Dados para Orçamento', action: 'lead_form' },
          ],
        };

        setMessages((prev) => [...prev, replyMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `camilla_diag_err_${Date.now()}`,
            sender: 'sofia',
            text: 'Recebi sua foto! Pelo padrão do cabeçote e lançadeira, recomendamos uma revisão na nossa oficina em São Gonçalo - RJ. Me chame no WhatsApp oficial: 21 996134073!',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleActionClick = (action: string, payload?: string) => {
    if (action === 'coupon') {
      const coupon = sofiaSettings?.activeCoupon || 'CAMILLA15';
      navigator.clipboard.writeText(coupon);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
      handleSendMessage(`Gostaria de aplicar o cupom promocional ${coupon} com 15% de desconto!`);
    } else if (action === 'sewing_machines') {
      handleSendMessage('Quero saber sobre conserto e reforma de máquinas de costura e peças em São Gonçalo - RJ!');
    } else if (action === 'accounting') {
      handleSendMessage('Gostaria de informações sobre a Contabilidade e Assessoria 100% Online para MEI e empresas.');
    } else if (action === 'all_courses') {
      handleSendMessage('Quais são todas as formações e cursos livres com certificado oficial MEC disponíveis?');
    } else if (action === 'payment') {
      handleSendMessage('Como funciona o pagamento via Mercado Pago em 12x ou com desconto no PIX?');
    } else if (action === 'certificate') {
      handleSendMessage('Poderia me explicar o registro do certificado no MEC (LDB Art. 42) e a chave ICP-Edu?');
    } else if (action === 'whatsapp') {
      const wpp = '21996134073';
      const text = encodeURIComponent(
        `Olá Camilla Faria! Vim pelo site grupoeloizio.com.br e gostaria de informações sobre os serviços e cursos do Grupo Eloizio com o cupom CAMILLA15!`
      );
      window.open(`https://wa.me/55${wpp}?text=${text}`, '_blank');
    } else if (action === 'view_course' && payload) {
      const found = courses.find((c) => c.id === payload);
      if (found) {
        setSelectedCourseForDetails(found);
        setIsOpen(false);
      }
    } else if (action === 'enroll_mp' && payload) {
      const found = courses.find((c) => c.id === payload);
      if (found) {
        setSelectedCourseForDetails(found);
        setOpenPaymentModal(true);
        setIsOpen(false);
      }
    } else if (action === 'lead_form') {
      setShowLeadForm(true);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    addLead({
      name: leadName,
      email: leadEmail || 'interessado@grupoeloizio.com.br',
      phone: leadPhone,
      courseInterest: leadCourse,
      status: 'proposta_enviada',
      source: 'chat_sofia',
      proposalCode: `ELOIZIO-${Math.floor(1000 + Math.random() * 9000)}`,
      discountPercentage: 15,
      notes: `Lead qualificado pela Camilla Faria (${interlocutorRole.toUpperCase()}) com cupom CAMILLA15.`,
    });

    setLeadSuccess(true);
    setTimeout(() => {
      setLeadSuccess(false);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `lead_ack_${Date.now()}`,
          sender: 'sofia',
          text: `🎉 Que maravilha, ${leadName}! Já cadastrei sua solicitação com prioridade de atendimento no Grupo Eloizio com 15% de desconto garantido pelo cupom **CAMILLA15**! Nosso time e o CEO Eloizio entrarão em contato no WhatsApp ${leadPhone}!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2000);
  };

  const activeCoupon = sofiaSettings?.activeCoupon || 'CAMILLA15';
  const activeDiscount = sofiaSettings?.discountPercentage || 15;

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-indigo-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 animate-bounce">
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Camilla Faria • Grupo Eloizio</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative p-3 sm:p-3.5 rounded-full bg-linear-to-tr from-indigo-900 via-indigo-700 to-indigo-600 text-white shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center border-2 border-white/30"
            title="Conversar com Camilla Faria (Gerente Geral - Grupo Eloizio)"
          >
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-indigo-900 rounded-full animate-pulse" />
            </div>
            <span className="sr-only">Abrir Atendente Camilla Faria</span>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed inset-x-2 sm:inset-x-auto sm:right-6 bottom-2 sm:bottom-6 z-50 w-auto sm:w-[420px] h-[85vh] sm:h-[640px] max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-indigo-900 text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Bot className="w-6 h-6 text-indigo-200" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm leading-tight text-white">Camilla Faria</h3>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    28 anos • Carioca
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/90 font-medium">
                  Gerente Geral • Grupo Eloizio (São Gonçalo - RJ)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-10">
              <button
                onClick={() => handleActionClick('whatsapp')}
                className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition cursor-pointer"
                title="WhatsApp Oficial Grupo Eloizio (21 996134073)"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interlocutor Role Selector */}
          <div className="px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between text-[11px] border-b border-indigo-950">
            <span className="text-[10px] text-indigo-300 font-bold flex items-center gap-1">
              <User className="w-3 h-3" /> Falar como:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setInterlocutorRole('client')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                  interlocutorRole === 'client' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cliente Final
              </button>
              <button
                type="button"
                onClick={() => setInterlocutorRole('technician')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                  interlocutorRole === 'technician' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Técnico Mecânico
              </button>
              <button
                type="button"
                onClick={() => setInterlocutorRole('subscriber')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                  interlocutorRole === 'subscriber' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Assinante
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-linear-to-b from-slate-50 to-white text-xs">
            {messages.map((m) => {
              const isMe = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in-50`}
                >
                  <div className="flex items-end gap-2 max-w-[88%]">
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                        CF
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs shadow-xs ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                      }`}
                    >
                      {m.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/20 max-w-[240px]">
                          <img src={m.mediaUrl} alt="Mídia enviada para análise" className="w-full object-cover max-h-48" />
                        </div>
                      )}
                      {m.text}
                    </div>
                  </div>

                  {/* Suggested actions chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.action, act.payload)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-[11px] transition shadow-2xs hover:border-indigo-300 cursor-pointer flex items-center gap-1.5 text-left"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 px-1 font-medium">{m.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Camilla Faria está formulando a resposta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Lead Capture Modal Inside Chat */}
          {showLeadForm && (
            <div className="p-4 bg-indigo-50/90 border-t border-indigo-200 animate-in slide-in-from-bottom-5 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-indigo-600" /> Ativar Proposta com Cupom {activeCoupon} (-{activeDiscount}%)
                </span>
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {leadSuccess ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Proposta gerada! Camilla e o CEO Eloizio entrarão em contato!
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ex: Ana Clara Souza"
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">WhatsApp com DDD</label>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="(21) 99999-9999"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">Seu E-mail (LGPD)</label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="voce@exemplo.com"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Interesse Principal</label>
                    <select
                      value={leadCourse}
                      onChange={(e) => setLeadCourse(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white"
                    >
                      <option value="Oficina Mecânica & Máquinas de Costura (São Gonçalo)">
                        🪡 Máquinas de Costura & Conserto (São Gonçalo - RJ)
                      </option>
                      <option value="Contabilidade e Assessoria 100% Online">
                        💼 Contabilidade & Assessoria Digital (MEI/Empresas)
                      </option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          🎓 Curso: {c.title} ({c.workloadHours}h)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                  >
                    <Gift className="w-4 h-4" />
                    Ativar Cupom {activeCoupon} & Receber Proposta
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[10px] text-slate-400 font-bold shrink-0">Atalhos:</span>
            <button
              onClick={() => handleSendMessage('Quais serviços de máquinas de costura e mecânica vocês fazem em São Gonçalo - RJ?')}
              className="px-2 py-0.5 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition shrink-0 cursor-pointer text-[10px]"
            >
              🪡 Máquinas de Costura
            </button>
            <button
              onClick={() => handleSendMessage('Como funciona a assessoria contábil online e abertura de MEI?')}
              className="px-2 py-0.5 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition shrink-0 cursor-pointer text-[10px]"
            >
              💼 Contabilidade Online
            </button>
            <button
              onClick={() => handleSendMessage('Quais são todos os cursos cadastrados na plataforma?')}
              className="px-2 py-0.5 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition shrink-0 cursor-pointer text-[10px]"
            >
              📚 Todos os Cursos
            </button>
            <button
              onClick={() => handleSendMessage('Como funciona o pagamento via Mercado Pago em até 12x?')}
              className="px-2 py-0.5 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition shrink-0 cursor-pointer text-[10px]"
            >
              💳 Mercado Pago 12x
            </button>
          </div>

          {/* Quick Coupon Tag */}
          <div className="px-4 py-1.5 bg-indigo-50/70 border-t border-indigo-200/70 flex items-center justify-between text-[11px] text-indigo-900">
            <span className="font-bold flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-indigo-600" /> Cupom Oficial: <strong>{activeCoupon}</strong> (-{activeDiscount}%)
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeCoupon);
                setCopiedCoupon(true);
                setTimeout(() => setCopiedCoupon(false), 2000);
              }}
              className="font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedCoupon ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copiedCoupon ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          {/* Message Input Form with Camera/Image Upload */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage || isTyping}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer shrink-0 disabled:opacity-50"
              title="Enviar foto de máquina ou peça mecânica para diagnóstico"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Fale com a Camilla (Cursos, Máquinas ou Contabilidade)..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
