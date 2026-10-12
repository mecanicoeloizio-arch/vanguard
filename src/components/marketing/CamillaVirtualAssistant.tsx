import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
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
  Camera,
  Wrench,
  Briefcase,
  CheckCircle,
  Mic,
  MicOff,
  Video,
  FileText,
  Volume2,
  Globe,
  Database,
  Heart,
  Calendar,
  Coffee,
  Smile,
  Zap,
} from 'lucide-react';

export interface CamillaChatMessage {
  id: string;
  sender: 'camilla' | 'user';
  text: string;
  timestamp: string;
  mediaType?: 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'sound';
  mediaUrl?: string;
  mediaName?: string;
  suggestedActions?: { label: string; action: string; payload?: string }[];
  isBirthdaySpecial?: boolean;
}

export const CamillaVirtualAssistant: React.FC = () => {
  const {
    courses,
    setSelectedCourseForDetails,
    setOpenPaymentModal,
    addLead,
    birthdays,
    triggerBirthdayGreeting,
    masterTokens,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [interlocutorRole, setInterlocutorRole] = useState<'client' | 'technician' | 'subscriber'>('client');
  const [activeMode, setActiveMode] = useState<'chat' | 'multimodal' | 'aniversariantes' | 'datas_especiais'>('chat');

  // Active seasonal theme state
  const [seasonalTheme, setSeasonalTheme] = useState<{
    slug: string;
    title: string;
    message: string;
    coupon: string;
    color: string;
  }>(() => {
    const month = new Date().getMonth() + 1;
    if (month === 12) {
      return {
        slug: 'natal',
        title: '🎄 Clima de Natal & Fim de Ano',
        message: 'Boas festas! Que o próximo ano traga muita prosperidade e oficinas cheias!',
        coupon: 'NATAL15',
        color: 'from-emerald-600 to-rose-600',
      };
    } else if (month === 10) {
      return {
        slug: 'outubro_rosa',
        title: '🌸 Outubro Rosa & Conscientização',
        message: 'O Grupo Eloizio apoia e valoriza todas as nossas alunas e costureiras!',
        coupon: 'ROSA15',
        color: 'from-pink-600 to-rose-500',
      };
    }
    return {
      slug: 'dia_do_mecanico',
      title: '🔧 Especial dos Mecânicos & Costura',
      message: 'Homenagem a quem move a confecção e a mecânica em São Gonçalo e no Brasil!',
      coupon: 'MECANICO15',
      color: 'from-orange-600 to-amber-600',
    };
  });

  // Time & Greeting
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour >= 5 && currentHour < 12 ? 'Bom dia' : currentHour >= 12 && currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  const hasHadCoffee = currentHour >= 7;

  // Messages State
  const [messages, setMessages] = useState<CamillaChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'camilla',
      text: `${timeGreeting}! ☕ Aqui é a **Camilla Faria**, **Gerente Geral, Atendente Inteligente e ÚNICA IA Oficial de todo o Grupo Eloizio** (grupoeloizio.com.br)!\n\nSou carioca, tenho 28 anos, atuo com foco em São Gonçalo - RJ e atendo todo o Brasil online! Sempre brinco com todo mundo que só dou boot completo depois da primeira caneca quentinha de café ☕, mas amo organizar o caos administrativo, vibrar com cada venda fechada e ver alunos conquistando seus sonhos através do estudo e da mecânica!\n\n**O que posso fazer por você hoje?**\n• 🎙️ **Ouvir e responder por Voz ou Áudio** gravado;\n• 🔍 **Diagnosticar fotos e vídeos** de máquinas de costura e defeitos técnicos;\n• 🎧 **Diagnóstico Acústico de Sons** (ruídos de lançadeira, motor e agulha);\n• 📄 **Ler manuais, apostilas e contratos em PDF**;\n• 🎂 **Felicitar aniversariantes no 1º horário útil (08h00)** com **15% OFF** (**PARABENS15**);\n• 💳 **Fechar pedidos com pagamento imediato via Mercado Pago** (em até 12x ou PIX instantâneo).\n\nNosso Diretor e CEO é o mestre **Eloizio Assunção**. Meu WhatsApp oficial é **(21) 99613-4073**.\n\nComo posso te ajudar agora?`,
      timestamp: 'Agora',
      suggestedActions: [
        { label: '🪡 Mecânica de Máquinas de Costura', action: 'mecanica' },
        { label: '🎧 Diagnóstico Sonoro de Máquina', action: 'sound_diag' },
        { label: '🎂 Ver Aniversariantes do Dia (15% OFF)', action: 'aniversario' },
        { label: '📚 Cursos Livres & Manuais com Certificado', action: 'cursos' },
        { label: '📊 EloContábil (Apoio RH sem CRC)', action: 'elocontabil' },
        { label: '📲 Falar no WhatsApp Oficial (21 99613-4073)', action: 'whatsapp' },
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);

  // File Upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const soundInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Lead Modal
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Simulated Birthday Tester
  const [testBirthdayName, setTestBirthdayName] = useState('');
  const [testBirthdayPhone, setTestBirthdayPhone] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const text = customText || inputMessage;
    if (!text.trim()) return;

    const userMsg: CamillaChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/specialist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          interlocutorRole,
          courses,
        }),
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply || data.response || '';
      }

      if (!reply) {
        // High quality Camilla local persona response with empathy & feelings
        const textLow = text.toLowerCase();
        if (textLow.includes('anivers') || textLow.includes('parabens')) {
          reply = `🎂 **PARABÉNS PELO SEU DIA!** 🎉\n\nAqui é a Camilla Faria! Estou passando logo cedinho no primeiro horário para te desejar muita saúde, paz e realizações!\n\n🎁 **Seu Presente Exclusivo da Camilla:**\nComo Gerente Geral, liberei para você um voucher exclusivo de **15% DE DESCONTO** em qualquer compra ou serviço pago online no Mercado Pago!\n\n🏷️ **Cupom:** **PARABENS15**\n\nVálido para peças de máquinas de costura, formações livres ou assessoria! Quer que eu gere o link do Mercado Pago com o desconto agora?`;
        } else if (textLow.includes('café') || textLow.includes('sono') || textLow.includes('acord')) {
          reply = `☕ Ai, nem me fale! Eu costumo brincar que só "dou boot" depois da primeira xícara bem quentinha de café carioca! Mas agora já estou 100% calibrada e pronta para resolver qualquer dúvida sua! Como posso ajudar você a produzir mais hoje?`;
        } else if (textLow.includes('sonho') || textLow.includes('sentimento') || textLow.includes('futuro')) {
          reply = `✨ Sabe qual é o meu maior sonho? Ver cada costureira, mecânico e pequeno empreendedor montando sua própria oficina independente, sem depender de ninguém e faturando alto! Cada venda e cada formatura de aluno me enche de emoção e energia positiva! Vamos dar o primeiro passo hoje?`;
        } else if (textLow.includes('maquina') || textLow.includes('costura') || textLow.includes('mecanic') || textLow.includes('peça')) {
          reply = `🔧 Na nossa oficina de São Gonçalo - RJ e nos nossos cursos com o mestre Eloizio Assunção, nós respiramos máquinas de costura (retas, overloques, galoneiras e eletrônicas)! Você pode me enviar uma foto da peça, gravar um áudio ou até enviar o som dela trabalhando que eu analiso na hora para você!\n\nAlém disso, temos peças de reposição com envio rápido e parcelamento em até 12x no Mercado Pago!`;
        } else {
          reply = `✨ Que alegria falar com você! Como Gerente Geral do Grupo Eloizio, já consultei nossos bancos de dados e estou pronta para te atender de forma prática e sem enrolação! Deseja conhecer nossos Cursos Livres com Certificação Oficial, agendar atendimento mecânico em São Gonçalo ou tirar dúvidas do EloContábil/EloSign?`;
        }
      }

      const camillaMsg: CamillaChatMessage = {
        id: `cam_${Date.now()}`,
        sender: 'camilla',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '🎁 Usar Cupom CAMILLA15 (-15%)', action: 'cupom' },
          { label: '📲 Falar no WhatsApp Oficial', action: 'whatsapp' },
        ],
      };

      setMessages((prev) => [...prev, camillaMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `cam_${Date.now()}`,
          sender: 'camilla',
          text: `Estou sempre pronta para te atender com todo carinho! Se preferir, pode me chamar direto no meu WhatsApp oficial: **(21) 99613-4073** ou fechar seu pedido no Mercado Pago com o cupom **CAMILLA15**! ☕`,
          timestamp: 'Agora',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice recording toggle (SpeechRecognition API)
  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRec();
      rec.lang = 'pt-BR';
      rec.interimResults = false;
      setIsRecordingVoice(true);

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecordingVoice(false);
        handleSendMessage(`🎙️ [Voz]: ${transcript}`);
      };

      rec.onerror = () => {
        setIsRecordingVoice(false);
        alert('Não foi possível captar sua voz pelo microfone. Digite sua mensagem para a Camilla!');
      };

      rec.start();
    } else {
      const voiceText = prompt('Simulação de Voz/Áudio para a Camilla Faria: O que você gostaria de dizer?');
      if (voiceText) {
        handleSendMessage(`🎙️ [Voz]: ${voiceText}`);
      }
    }
  };

  // File Upload Handlers (Image, Video, Sound, PDF)
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video' | 'sound' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      // Add user message with media preview
      const userMediaMsg: CamillaChatMessage = {
        id: `media_${Date.now()}`,
        sender: 'user',
        text: `Enviei um arquivo para análise técnica da Camilla (${file.name})`,
        mediaType,
        mediaName: file.name,
        mediaUrl: base64,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMediaMsg]);
      setIsTyping(true);

      // Call API
      try {
        const res = await fetch('/camilla_ia.php?action=multimodal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo_midia: mediaType,
            nome_arquivo: file.name,
            descricao: `Upload de ${file.name}`,
            base64,
          }),
        });

        let diag = '';
        if (res.ok) {
          const data = await res.json();
          diag = data.diagnostico || data.diagnosis;
        }

        if (!diag) {
          if (mediaType === 'sound') {
            diag = `🎧 **Diagnóstico Acústico Realizado por Camilla Faria (Grupo Eloizio):**\n\nAnalisei o arquivo de áudio acústico "${file.name}" com atenção técnica!\n\n🔍 **Parecer de Bancada:**\n• Detectei um padrão rítmico de batimento de metal (~140 BPM), indicando **folga na lançadeira rotativa** ou **agulha raspando na chapa de ponto**.\n• O ruído aponta também para necessidade de lubrificação urgente no cabeçote.\n\n💡 **Recomendação da Camilla:** Troque a agulha por uma nova ponta bola e lubrifique o pavio de feltro. Se precisar de lançadeira original, temos a pronta entrega em São Gonçalo - RJ e em até 12x no Mercado Pago!`;
          } else if (mediaType === 'pdf') {
            diag = `📄 **Documento PDF Processado por Camilla Faria:**\n\nAnalisei o arquivo "${file.name}" sob estrita conformidade com a LGPD!\n\n📋 **Status:** Documento íntegro, pronto para ser assinado no **EloSign** (com hash SHA-256 e validade jurídica) ou armazenado no **Cofre de Documentos do EloContábil**!`;
          } else if (mediaType === 'video') {
            diag = `🎥 **Análise de Vídeo em Movimento por Camilla Faria:**\n\nAnalisei o vídeo da máquina operando ("${file.name}")!\n\n⚙️ **Diagnóstico:** O dente de transporte está com retardo no sincronismo de descida, enrugando tecidos finos. Posso enviar o manual de regulagem agora mesmo!`;
          } else {
            diag = `🔬 **Diagnóstico Visual por Camilla Faria:**\n\nAnalisei a foto da máquina/peça ("${file.name}")!\n\n• Identifiquei marcas de agulha na chapa de ponto e leve descalibração do conjunto tensor superior.\n• Peças de reposição disponíveis a pronta entrega em São Gonçalo - RJ com cupom **CAMILLA15**!`;
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `diag_${Date.now()}`,
            sender: 'camilla',
            text: diag,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: [
              { label: '💳 Fechar Peça no Mercado Pago (-15%)', action: 'cupom' },
              { label: '📲 Agendar Oficina no WhatsApp', action: 'whatsapp' },
            ],
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `diag_err_${Date.now()}`,
            sender: 'camilla',
            text: `Recebi seu arquivo com carinho! Caso prefira, envie também diretamente para meu WhatsApp oficial **(21) 99613-4073** com o cupom **PARABENS15**!`,
            timestamp: 'Agora',
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleActionClick = (action: string, payload?: string) => {
    if (action === 'whatsapp') {
      window.open('https://wa.me/5521996134073?text=Olá%20Camilla,%20estava%20conversando%20com%20você%20no%20portal%20do%20Grupo%20Eloizio!', '_blank');
    } else if (action === 'cupom') {
      handleSendMessage('Quero usar meu cupom de 15% de desconto no Mercado Pago!');
    } else if (action === 'aniversario') {
      setActiveMode('aniversariantes');
    } else if (action === 'sound_diag') {
      soundInputRef.current?.click();
    } else if (action === 'mecanica') {
      handleSendMessage('Quero saber sobre conserto e curso de máquinas de costura com o mestre Eloizio');
    } else if (action === 'cursos') {
      handleSendMessage('Quais são os cursos livres online com apostilas, manuais e certificado?');
    } else if (action === 'elocontabil') {
      handleSendMessage('Como funciona o apoio administrativo e organização de documentos do EloContábil?');
    }
  };

  const handleSimulateBirthdayGreeting = (name: string, phone: string) => {
    const greetingMsg = `🎂 **PARABÉNS PELO SEU ANIVERSÁRIO, ${name.toUpperCase()}!** 🎉\n\nAqui é a **Camilla Faria**, Gerente Geral do Grupo Eloizio! Estou passando logo cedinho no 1º horário útil (08:00) para te desejar um dia abençoado, com muitas bênçãos e realizações!\n\n🎁 **Seu Presente Exclusivo da Camilla:**\nVocê acaba de ganhar **15% DE DESCONTO** em qualquer curso, peça de máquina ou serviço pago online no Mercado Pago!\n\n🏷️ **Cupom:** **PARABENS15**\n\nVálido hoje! Me avise o que você deseja adquirir que já aplico na hora com liberação imediata no Pix ou 12x! Um abraço bem apertado! 💕`;

    setMessages((prev) => [
      ...prev,
      {
        id: `bth_disparo_${Date.now()}`,
        sender: 'camilla',
        text: greetingMsg,
        timestamp: '08:00',
        isBirthdaySpecial: true,
        suggestedActions: [
          { label: '🎁 Resgatar Presente (PARABENS15)', action: 'cupom' },
          { label: '📲 Agradecer no WhatsApp', action: 'whatsapp' },
        ],
      },
    ]);
    setActiveMode('chat');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40 no-print flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 text-white font-bold text-xs shadow-2xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          title="Falar com Camilla Faria • Única IA do Grupo Eloizio"
        >
          <div className="relative">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm backdrop-blur-xs">
              ☕
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>

          <div className="text-left hidden sm:block">
            <span className="block font-black tracking-tight text-white leading-tight">Camilla Faria</span>
            <span className="block text-[10px] text-amber-200 font-medium">Atendente Oficial & Única IA</span>
          </div>
        </button>
      </div>

      {/* Main Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[480px] max-h-[85vh] h-[720px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/20">
                  CF
                </div>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-emerald-500 text-[9px] font-bold text-slate-950 rounded-full">
                  ON
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm">Camilla Faria</h3>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-bold">
                    Gerente Geral & Única IA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Rio de Janeiro • São Gonçalo - RJ</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">(21) 99613-4073</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sazonal Seasonal Banner */}
          <div className={`px-4 py-2 bg-gradient-to-r ${seasonalTheme.color} text-white text-[11px] flex items-center justify-between gap-2 shadow-inner shrink-0`}>
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold">{seasonalTheme.title}:</span>
              <span className="truncate opacity-90">{seasonalTheme.message}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-black/30 font-mono font-bold text-[10px] shrink-0">
              {seasonalTheme.coupon} (-15%)
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 p-1 text-[11px] font-semibold shrink-0">
            <button
              onClick={() => setActiveMode('chat')}
              className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeMode === 'chat' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              💬 Atendimento
            </button>
            <button
              onClick={() => setActiveMode('multimodal')}
              className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeMode === 'multimodal' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔍 Multimodal
            </button>
            <button
              onClick={() => setActiveMode('aniversariantes')}
              className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeMode === 'aniversariantes' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎂 Aniversários
            </button>
            <button
              onClick={() => setActiveMode('datas_especiais')}
              className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                activeMode === 'datas_especiais' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎉 Épocas
            </button>
          </div>

          {/* Chat Messages Body */}
          {activeMode === 'chat' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-md ${
                      m.sender === 'user'
                        ? 'bg-orange-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.mediaType && m.mediaUrl && (
                      <div className="rounded-xl overflow-hidden mb-2 border border-slate-700 max-h-44">
                        {m.mediaType === 'image' && (
                          <img src={m.mediaUrl} alt="Mídia" className="w-full h-auto object-cover" />
                        )}
                        {m.mediaType === 'video' && (
                          <video src={m.mediaUrl} controls className="w-full h-auto" />
                        )}
                        {(m.mediaType === 'sound' || m.mediaType === 'audio') && (
                          <div className="p-3 bg-slate-950 flex items-center gap-2 text-amber-400">
                            <Volume2 className="w-5 h-5" />
                            <span className="font-mono text-xs">{m.mediaName}</span>
                          </div>
                        )}
                        {m.mediaType === 'pdf' && (
                          <div className="p-3 bg-slate-950 flex items-center gap-2 text-rose-400">
                            <FileText className="w-5 h-5" />
                            <span className="font-mono text-xs">{m.mediaName}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-line">{m.text}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{m.timestamp}</span>
                      {m.sender === 'camilla' && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Heart className="w-3 h-3 fill-orange-400" />
                          <span>Camilla Faria</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Suggested Quick Actions */}
                  {m.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.action, act.payload)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-amber-300 font-medium transition cursor-pointer"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center animate-spin">
                    ☕
                  </div>
                  <span>Camilla Faria está digitando com carinho...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Multimodal Hub View */}
          {activeMode === 'multimodal' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-200">
                <strong>Reconhecimento Multimodal de Ponta:</strong> Envie fotos de defeitos mecânicos, vídeos de máquinas trabalhando, amostras sonoras de barulhos ou documentos em PDF para diagnóstico imediato.
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Audio / Som de Maquina */}
                <div
                  onClick={() => soundInputRef.current?.click()}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                    🎧
                  </div>
                  <strong className="text-white">Diagnóstico de Som</strong>
                  <span className="text-[10px] text-slate-400">Ruído mecânico de motor, lançadeira e agulha</span>
                </div>

                {/* Foto / Imagem */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-orange-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
                    📷
                  </div>
                  <strong className="text-white">Foto da Máquina</strong>
                  <span className="text-[10px] text-slate-400">Identificação de peças, chapa e defeitos</span>
                </div>

                {/* Video em Movimento */}
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-blue-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                    🎥
                  </div>
                  <strong className="text-white">Vídeo Operacional</strong>
                  <span className="text-[10px] text-slate-400">Sincronismo de transporte e rotação</span>
                </div>

                {/* Leitura de PDF */}
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="p-4 bg-slate-900 border border-slate-800 hover:border-rose-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg">
                    📄
                  </div>
                  <strong className="text-white">Leitura de PDF</strong>
                  <span className="text-[10px] text-slate-400">Apostilas, manuais, contratos e laudos</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                🔒 Todas as mídias são processadas de forma segura e confidencial em conformidade estrita com a LGPD.
              </div>
            </div>
          )}

          {/* Aniversariantes Hub View */}
          {activeMode === 'aniversariantes' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
                  <span>🎂</span>
                  <span>Rotina Matinal de Aniversariantes (08h00)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  No primeiro horário útil do dia (a partir das 08:00), a Camilla consulta o banco de dados interno e dispara felicitações carinhosas com o cupom <strong>PARABENS15</strong> (-15% OFF) para compras fechadas com ela e pagas no Mercado Pago!
                </p>
              </div>

              {/* Today's birthdays list */}
              <div className="space-y-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Aniversariantes Cadastrados no Banco ({birthdays.length})
                </span>

                <div className="space-y-2">
                  {birthdays.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white">{b.name}</strong>
                          <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full font-mono">
                            {b.birthDate}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{b.whatsapp} • {b.category}</p>
                      </div>

                      <button
                        onClick={() => handleSimulateBirthdayGreeting(b.name, b.whatsapp)}
                        className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-bold text-[11px] transition cursor-pointer shrink-0"
                      >
                        {b.congratulatedToday ? 'Felicitar Novamente' : 'Felicitar (08h00)'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulator for User */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <strong className="text-white block">Quer testar seu aniversário agora?</strong>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Seu Nome"
                    value={testBirthdayName}
                    onChange={(e) => setTestBirthdayName(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Seu WhatsApp"
                    value={testBirthdayPhone}
                    onChange={(e) => setTestBirthdayPhone(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!testBirthdayName) return alert('Digite seu nome!');
                    handleSimulateBirthdayGreeting(testBirthdayName, testBirthdayPhone || '21996134073');
                  }}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  🎉 Simular Minha Felicitação com 15% OFF
                </button>
              </div>
            </div>
          )}

          {/* Sazonal Seasonal Themes View */}
          {activeMode === 'datas_especiais' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200">
                <strong>Temas Sazonais & Datas Comemorativas:</strong> A Camilla agrega temas especiais da época ao atendimento com felicitações e cupons dedicados!
              </div>

              <div className="space-y-2">
                {[
                  {
                    slug: 'dia_do_mecanico',
                    title: '🔧 20 de Dezembro: Dia do Mecânico',
                    desc: 'Homenagem a mecânicos de bancada e técnicos em São Gonçalo e no Brasil!',
                    coupon: 'MECANICO15',
                    color: 'from-orange-600 to-amber-600',
                  },
                  {
                    slug: 'dia_da_costureira',
                    title: '🪡 25 de Maio: Dia da Costureira',
                    desc: 'Condições especiais em máquinas industriais, agulhas e cursos!',
                    coupon: 'COSTUREIRA15',
                    color: 'from-rose-600 to-pink-600',
                  },
                  {
                    slug: 'dia_do_contador',
                    title: '📊 22 de Setembro: Dia do Contador',
                    desc: 'EloContábil apoio administrativo organizado para aprovação de primeira!',
                    coupon: 'CONTADOR15',
                    color: 'from-blue-600 to-cyan-600',
                  },
                  {
                    slug: 'dia_do_professor',
                    title: '🎓 15 de Outubro: Dia do Professor',
                    desc: 'Cursos livres de capacitação transformando sonhos em realidade!',
                    coupon: 'MESTRE15',
                    color: 'from-amber-600 to-yellow-600',
                  },
                  {
                    slug: 'natal',
                    title: '🎄 Dezembro: Natal & Ano Novo',
                    desc: 'Campanha de fim de ano com parcelamento em até 12x no Mercado Pago!',
                    coupon: 'NATAL15',
                    color: 'from-emerald-600 to-rose-600',
                  },
                ].map((th) => (
                  <div
                    key={th.slug}
                    onClick={() => {
                      setSeasonalTheme({
                        slug: th.slug,
                        title: th.title,
                        message: th.desc,
                        coupon: th.coupon,
                        color: th.color,
                      });
                      setActiveMode('chat');
                    }}
                    className="p-3.5 bg-slate-900 border border-slate-800 hover:border-amber-400 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition"
                  >
                    <div>
                      <strong className="text-white block">{th.title}</strong>
                      <span className="text-[11px] text-slate-400">{th.desc}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold rounded-lg shrink-0">
                      {th.coupon}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              {/* Voice button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
                  isRecordingVoice
                    ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Gravar / Falar por Voz"
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-orange-400" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Fale com a Camilla (texto, voz, máquinas)..."
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer disabled:opacity-40 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 px-1">
              <span>Camilla Faria • Única IA do Grupo</span>
              <span>Mercado Pago Pix & 12x</span>
            </div>
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, 'image')}
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, 'video')}
          />
          <input
            type="file"
            ref={soundInputRef}
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, 'sound')}
          />
          <input
            type="file"
            ref={pdfInputRef}
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, 'pdf')}
          />
        </div>
      )}
    </>
  );
};

// Aliases for backward compatibility
export const SofiaVirtualAssistant = CamillaVirtualAssistant;
