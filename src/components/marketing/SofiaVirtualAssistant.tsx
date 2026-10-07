import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { askSofiaAssistant, diagnoseMediaWithSofia, getTimeGreeting, SofiaMessage } from '../../services/sofiaAI';
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
  Wrench,
  Briefcase,
  CheckCircle,
} from 'lucide-react';

export const SofiaVirtualAssistant: React.FC = () => {
  const {
    courses,
    setSelectedCourseForDetails,
    setOpenPaymentModal,
    addLead,
    sofiaSettings,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [interlocutorRole, setInterlocutorRole] = useState<'client' | 'technician' | 'subscriber'>('client');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { greeting } = getTimeGreeting();

  const activeCoupon = sofiaSettings?.activeCoupon || 'SOFIA15';
  const activeDiscount = sofiaSettings?.discountPercentage || 15;

  const [messages, setMessages] = useState<SofiaMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'sofia',
      text: `${greeting}! ✨ Eu sou a **Sofia**, a **Expert Vanguard** em Cursos, Carreiras e Estratégia Educacional do **Grupo Eloizio**!\n\nMeu papel é entender seu momento profissional e traçar a rota mais rápida para sua independência financeira através de competências práticas de alta demanda no mercado.\n\nConheço profundamente todas as nossas formações e os ganhos reais da profissão:\n\n• 🪡 **Mecânica & Manutenção de Máquinas de Costura** (com o mestre e CEO Eloizio Silva — profissão escassa com lucro de R$ 5.000 a R$ 15.000/mês consertando máquinas reta, overloque e galoneira);\n• 🚀 **Engenharia de Software Moderna & Arquitetura Cloud** (com a Profa. Dra. Mariana da USP — microsserviços, DevOps e salários de elite);\n• 💼 **Contabilidade & Assessoria Prática para MEI** (blindagem fiscal, NFS-e e regularização sem burocracia);\n• 🎨 **UI/UX Design de Produtos Digitais** (Figma profissional e produtos de alta conversão);\n• 📜 **Certificação Oficial MEC** (LDB 9.394/96) e Carteirinha Estudantil DNE Nacional (50% de meia-entrada).\n\n🎁 Para incentivar sua decisão agora, reservei seu cupom oficial **SOFIA15** (-15% OFF no Mercado Pago em até 12x).\n\nQual carreira ou habilidade você deseja transformar hoje?`,
      timestamp: 'Agora',
      suggestedActions: [
        { label: '🎁 Resgatar Cupom SOFIA15 (-15%)', action: 'coupon' },
        { label: '🪡 Mecânica de Máquinas (Alta Renda com Eloizio)', action: 'sewing_machines' },
        { label: '⚡ Engenharia de Software & Cloud (Elite Tech)', action: 'software_engineering' },
        { label: '💼 Contabilidade MEI & Prática Fiscal', action: 'accounting' },
        { label: '📜 Certificado Oficial MEC & Carteirinha DNE', action: 'certificate' },
        { label: '📲 Falar no WhatsApp Oficial', action: 'whatsapp' },
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

      const replyText = await askSofiaAssistant(text, courses, history, interlocutorRole);

      // Check if a course was mentioned to add quick action
      const matchedCourse = courses.find((c) =>
        replyText.toLowerCase().includes(c.title.toLowerCase())
      );

      const suggestedActions: { label: string; action: string; payload?: string }[] = [
        { label: `🎁 Quero Meu Desconto (${activeCoupon})`, action: 'lead_form' },
        { label: '📲 Continuar no WhatsApp Oficial', action: 'whatsapp' },
      ];

      if (matchedCourse) {
        suggestedActions.unshift({
          label: `✨ Conhecer "${matchedCourse.title.slice(0, 24)}..."`,
          action: 'view_course',
          payload: matchedCourse.id,
        });
      }

      const botMsg: SofiaMessage = {
        id: `bot_${Date.now()}`,
        sender: 'sofia',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions,
        recommendedCourse: matchedCourse,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: SofiaMessage = {
        id: `bot_fallback_${Date.now()}`,
        sender: 'sofia',
        text: `Compreendi perfeitamente sua necessidade! Como sua **Expert Vanguard**, te oriento a não adiar sua capacitação. Você pode conferir todos os nossos cursos na vitrine ou me chamar no WhatsApp oficial do Grupo Eloizio: **(21) 99613-4073** para emitir sua proposta com o cupom **${activeCoupon}** (-15% OFF)!`,
        timestamp: 'Agora',
        suggestedActions: [
          { label: '📲 WhatsApp Oficial', action: 'whatsapp' },
          { label: `🎁 Usar Cupom ${activeCoupon}`, action: 'coupon' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string, payload?: string) => {
    switch (action) {
      case 'coupon':
        handleSendMessage(`Como funciona o cupom de desconto ${activeCoupon} e quais as condições de pagamento no Mercado Pago?`);
        break;
      case 'sewing_machines':
        handleSendMessage('Quero saber todos os detalhes do curso de Mecânica e Manutenção de Máquinas de Costura com o CEO Eloizio!');
        break;
      case 'software_engineering':
        handleSendMessage('Me fale sobre a formação em Engenharia de Software Moderna e Arquitetura Cloud com a Profa. Mariana!');
        break;
      case 'accounting':
        handleSendMessage('Quais os diferenciais do curso de Contabilidade e Assessoria Prática para MEI?');
        break;
      case 'certificate':
        handleSendMessage('Como funciona a certificação oficial MEC e a Carteirinha de Estudante DNE?');
        break;
      case 'lead_form':
        setShowLeadForm(true);
        break;
      case 'all_courses':
        handleSendMessage('Quais todos os cursos disponíveis na vitrine do Grupo Eloizio?');
        break;
      case 'payment':
        handleSendMessage('Quais são as opções de parcelamento no Mercado Pago e pagamento via PIX?');
        break;
      case 'whatsapp': {
        const cleanPhone = '5521996134073';
        const msg = encodeURIComponent(
          `Olá Sofia! Vim pelo chat da plataforma e gostaria de conversar sobre os cursos do Grupo Eloizio com meu cupom de desconto ${activeCoupon}!`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
        break;
      }
      case 'view_course':
        if (payload) {
          const c = courses.find((item) => item.id === payload);
          if (c) {
            setSelectedCourseForDetails(c);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem (JPG, PNG, WEBP).');
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        const userMsg: SofiaMessage = {
          id: `user_img_${Date.now()}`,
          sender: 'user',
          text: `[Foto enviada: ${file.name}] - Solicitação de análise técnica para Sofia (Expert Vanguard)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mediaUrl: reader.result as string,
          isMultimedia: true,
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        const diagnosis = await diagnoseMediaWithSofia(base64Data, file.name, interlocutorRole);

        const botMsg: SofiaMessage = {
          id: `bot_diag_${Date.now()}`,
          sender: 'sofia',
          text: diagnosis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            { label: '🪡 Ver Curso de Mecânica com Eloizio', action: 'sewing_machines' },
            { label: '📲 Agendar Conserto no WhatsApp', action: 'whatsapp' },
            { label: `🎁 Cupom ${activeCoupon}`, action: 'coupon' },
          ],
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Falha ao processar a imagem. Tente novamente.');
      setUploadingImage(false);
      setIsTyping(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    const proposalCode = `PROP-SOFIA-${Math.floor(1000 + Math.random() * 9000)}`;

    addLead({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      courseInterest: leadCourse,
      status: 'proposta_enviada',
      source: 'chat_sofia',
      proposalCode,
      discountPercentage: activeDiscount,
      notes: `Lead qualificado pela Sofia (Expert Vanguard - ${interlocutorRole.toUpperCase()}) com cupom ${activeCoupon}.`,
    });

    setLeadSuccess(true);

    // Send confirmation in chat
    setTimeout(() => {
      const confirmMsg: SofiaMessage = {
        id: `bot_prop_${Date.now()}`,
        sender: 'sofia',
        text: `🎉 **Excelente decisão, ${leadName.split(' ')[0]}!**\n\nSua proposta oficial **${proposalCode}** para o curso **${leadCourse}** foi gerada com **15% de desconto** usando o cupom **${activeCoupon}**!\n\nNossa equipe comercial do Grupo Eloizio entrará em contato pelo seu WhatsApp (**${leadPhone}**) para confirmar sua matrícula em até 12x no Mercado Pago.`,
        timestamp: 'Agora',
        proposalDetails: {
          courseName: leadCourse,
          originalPrice: courses.find((c) => c.title === leadCourse)?.price || 1490,
          discountedPrice: (courses.find((c) => c.title === leadCourse)?.price || 1490) * 0.85,
          couponCode: activeCoupon,
          installmentsText: 'em até 12x no Mercado Pago',
        },
        suggestedActions: [
          {
            label: '💳 Finalizar Matrícula no Mercado Pago',
            action: 'payment',
          },
          {
            label: '📲 Confirmar no WhatsApp Agora',
            action: 'whatsapp',
          },
        ],
      };
      setMessages((prev) => [...prev, confirmMsg]);
      setShowLeadForm(false);
      setLeadSuccess(false);
      setLeadName('');
      setLeadEmail('');
      setLeadPhone('');
    }, 1500);
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border border-indigo-100 text-xs font-bold text-slate-800 flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sofia • Expert Vanguard</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative p-3 sm:p-3.5 rounded-full bg-linear-to-tr from-indigo-950 via-indigo-700 to-indigo-600 text-white shadow-xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center border-2 border-white/30"
            title="Conversar com Sofia • Expert Vanguard (Cursos & Estratégia de Carreira)"
          >
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-indigo-900 rounded-full animate-pulse" />
            </div>
            <span className="sr-only">Abrir Assistente Sofia</span>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed inset-x-2 sm:inset-x-auto sm:right-6 bottom-2 sm:bottom-6 z-50 w-auto sm:w-[430px] h-[85vh] sm:h-[650px] max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Sofia Vanguard */}
          <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-indigo-900 text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm leading-tight text-white">Sofia Vanguard</h3>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Expert em Cursos
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/90 font-medium">
                  Psicologia de Marketing & Estratégia Educacional
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
              <User className="w-3 h-3" /> Perfil de Atendimento:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setInterlocutorRole('client')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                  interlocutorRole === 'client'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Futuro Aluno
              </button>
              <button
                onClick={() => setInterlocutorRole('technician')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                  interlocutorRole === 'technician'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Técnico / Oficina
              </button>
              <button
                onClick={() => setInterlocutorRole('subscriber')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                  interlocutorRole === 'subscriber'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Aluno Ativo
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-md'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {m.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden max-h-48 border border-slate-200 bg-black">
                        <img src={m.mediaUrl} alt="Foto enviada" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                      {m.text}
                    </div>

                    {/* Proposal Card Inside Chat */}
                    {m.proposalDetails && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-slate-900">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-indigo-950">
                            {m.proposalDetails.courseName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            -15% OFF
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="text-slate-400 line-through text-[11px]">
                            R$ {m.proposalDetails.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-lg font-black text-emerald-700">
                            R$ {m.proposalDetails.discountedPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Cupom: <strong>{m.proposalDetails.couponCode}</strong> • {m.proposalDetails.installmentsText}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested Quick Actions */}
                  {m.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                      {m.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleActionClick(act.action, act.payload)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-[11px] font-bold text-slate-700 hover:text-indigo-900 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
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
                <span>Sofia está formulando a melhor estratégia para você...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Lead Capture Modal Inside Chat */}
          {showLeadForm && (
            <div className="p-4 bg-indigo-50/95 border-t border-indigo-200 animate-in slide-in-from-bottom-5 text-xs">
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
                  Proposta gerada pela Sofia! Entraremos em contato no seu WhatsApp!
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
                      placeholder="Ex: Carlos Mendes de Souza"
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
                        placeholder="aluno@email.com"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Curso Escolhido</label>
                    <select
                      value={leadCourse}
                      onChange={(e) => setLeadCourse(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white font-medium"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title} (R$ {(c.price * 0.85).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-1 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1"
                    >
                      <span>Ativar Cupom {activeCoupon} & Receber Proposta</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Active Coupon Strip */}
          <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Cupom Sofia Vanguard:</span>
              <span className="font-mono font-black text-indigo-950 uppercase">{activeCoupon}</span>
              <span className="text-emerald-700 font-bold">(-{activeDiscount}% OFF)</span>
            </div>
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
              placeholder="Pergunte à Sofia sobre cursos, carreira ou certificação MEC..."
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
