import React, { useState, useEffect, useRef } from 'react';
import {
  FileSignature,
  ShieldCheck,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Camera,
  FileText,
  Share2,
  Copy,
  Download,
  ExternalLink,
  Code2,
  Send,
  Lock,
  Search,
  Check,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Key,
  Car,
  Settings,
  HelpCircle,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  Zap,
  QrCode,
  Building2,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Types
export interface Signer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: 'waiting' | 'signed';
  signedAt?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  signatureBase64?: string | null;
  selfieUrl?: string | null;
  docFrontUrl?: string | null;
  docBackUrl?: string | null;
}

export interface Envelope {
  id: string;
  title: string;
  summary: string;
  whatsappMessage: string;
  status: 'draft' | 'pending' | 'signed' | 'expired';
  originalSha256: string;
  finalSha256: string | null;
  templateId: string;
  createdAt: string;
  signedAt: string | null;
  authMethod: 'email_sms' | 'selfie_dynamic' | 'selfie_doc' | 'pix_validation';
  signers: Signer[];
  variables: Record<string, string>;
  signatureUrl: string;
}

export const EloSignApp: React.FC = () => {
  // Navigation / Views
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'create' | 'sign' | 'validate' | 'embed_docs'
  >('dashboard');

  // Workshop Brand Settings
  const [brandSettings, setBrandSettings] = useState({
    workshopName: 'Oficina Mecânica EloMak & Grupo Eloizio',
    primaryColor: '#FF6B00', // Laranja Oficina
    logoUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=200',
    ownerName: 'Eloizio Assunção (CEO)',
    ownerEmail: 'contato@grupoeloizio.com.br',
    apiKey: 'elo_live_99a81e4b3c7d6e5f8812',
  });

  // State
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeEnvelopeId, setActiveEnvelopeId] = useState<string>('env_elo_8841');
  const [validationHashInput, setValidationHashInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'signed' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Creation Flow (3 Steps)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [newTitle, setNewTitle] = useState('Ordem de Serviço - Autorização');
  const [selectedTemplate, setSelectedTemplate] = useState('tpl_os_autorizacao');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [variables, setVariables] = useState({
    nome_cliente: 'Marcos Vinicius de Oliveira',
    cpf: '123.456.789-00',
    telefone: '21996134073',
    placa: 'RIO-2026',
    valor_servico: '1.850,00',
    prazo_garantia: '90 dias',
  });
  const [signersList, setSignersList] = useState<Array<{ name: string; email: string; phone: string; cpf: string }>>([
    { name: 'Marcos Vinicius de Oliveira', email: 'marcos@email.com', phone: '21996134073', cpf: '123.456.789-00' },
  ]);
  const [authMethod, setAuthMethod] = useState<'selfie_dynamic' | 'selfie_doc' | 'email_sms' | 'pix_validation'>('selfie_dynamic');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiZapMsg, setAiZapMsg] = useState('');
  const [pastedOSText, setPastedOSText] = useState('');

  // Public Signature View State
  const [mobilePreviewMode, setMobilePreviewMode] = useState<boolean>(true);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState<string | null>(null);
  const [cnhFrontCaptured, setCnhFrontCaptured] = useState<string | null>(null);
  const [cnhBackCaptured, setCnhBackCaptured] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);

  // Canvas for signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Fetch initial envelopes
  const loadEnvelopes = async () => {
    try {
      const res = await fetch('/api/elosign/envelopes');
      const data = await res.json();
      if (data.success && Array.isArray(data.envelopes)) {
        setEnvelopes(data.envelopes);
        if (data.envelopes.length > 0 && !activeEnvelopeId) {
          setActiveEnvelopeId(data.envelopes[0].id);
        }
      }
    } catch {
      // Use fallback
    }
  };

  useEffect(() => {
    loadEnvelopes();
  }, []);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyNotice(`Copiado: ${label}`);
    setTimeout(() => setCopyNotice(null), 3000);
  };

  // Canvas Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // AI Function A: gerarTituloMensagem
  const callAiTitleAndMessage = async (contractText: string) => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/elosign/ai/generate-title-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto_pdf: contractText }),
      });
      const data = await res.json();
      if (data.titulo) setNewTitle(data.titulo);
      if (data.mensagem_whatsapp) setAiZapMsg(data.mensagem_whatsapp);
    } catch {
      // Fallback
    } finally {
      setAiGenerating(false);
    }
  };

  // AI Function B: resumirParaSignatario
  const callAiSummarize = async (contractText: string) => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/elosign/ai/summarize-signatory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto_pdf: contractText }),
      });
      const data = await res.json();
      if (data.markdown) setAiSummary(data.markdown);
    } catch {
      // Fallback
    } finally {
      setAiGenerating(false);
    }
  };

  // AI Function C: extrairDados
  const callAiExtractData = async (rawOSText: string) => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/elosign/ai/extract-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto_pdf: rawOSText }),
      });
      const data = await res.json();
      setVariables((prev) => ({
        ...prev,
        nome_cliente: data.nome_cliente || prev.nome_cliente,
        cpf: data.cpf || prev.cpf,
        telefone: data.telefone || prev.telefone,
        placa: data.placa || prev.placa,
        valor_servico: data.valor_total || prev.valor_servico,
      }));
      setCopyNotice('Dados da OS extraídos com sucesso pela IA Click.AI!');
      setTimeout(() => setCopyNotice(null), 3000);
    } catch {
      // Fallback
    } finally {
      setAiGenerating(false);
    }
  };

  // Create Envelope Action
  const handleCreateEnvelope = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/elosign/envelopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          templateId: selectedTemplate,
          authMethod,
          variables,
          signers: signersList,
          summary: aiSummary,
          whatsappMessage: aiZapMsg,
        }),
      });
      const data = await res.json();
      if (data.success && data.envelope) {
        await loadEnvelopes();
        setActiveEnvelopeId(data.envelope.id);
        setCurrentView('dashboard');
        setCopyNotice('Documento criado e link de assinatura gerado!');
        setTimeout(() => setCopyNotice(null), 3000);
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  // Sign Document Action
  const handleSignDocument = async (envelopeId: string) => {
    if (!agreedTerms) {
      alert('Você precisa marcar "Li e concordo com o documento" para prosseguir.');
      return;
    }
    if (!hasDrawn && !canvasRef.current) {
      alert('Por favor, assine seu nome no campo indicado.');
      return;
    }

    setIsSigning(true);
    try {
      const canvas = canvasRef.current;
      const signatureBase64 = canvas ? canvas.toDataURL('image/png') : null;

      // Geolocation
      let coords = null;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
          });
          coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch {
          // Denied or timeout
        }
      }

      const res = await fetch(`/api/elosign/envelopes/${envelopeId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signatureBase64,
          selfieUrl:
            selfieCaptured ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          docFrontUrl: cnhFrontCaptured,
          docBackUrl: cnhBackCaptured,
          geolocation: coords,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSignedSuccess(true);
        await loadEnvelopes();
      }
    } catch (e) {
      alert('Erro ao processar assinatura.');
    } finally {
      setIsSigning(false);
    }
  };

  // Download PDF with Audit Page via pdf-lib
  const handleDownloadSignedPdf = async (envelopeId: string) => {
    try {
      const res = await fetch('/api/elosign/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envelopeId }),
      });
      const data = await res.json();
      if (data.success && data.pdfBase64) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.pdfBase64}`;
        link.download = data.fileName || `EloSign_${envelopeId}_Auditoria.pdf`;
        link.click();
      }
    } catch {
      alert('Erro ao baixar documento assinado.');
    }
  };

  // Validate Document Hash Action
  const handleValidateHash = async (hashToValidate?: string) => {
    const target = (hashToValidate || validationHashInput).trim();
    if (!target) return;
    try {
      const res = await fetch(`/api/elosign/validate/${target}`);
      const data = await res.json();
      setValidationResult(data);
    } catch {
      setValidationResult({ success: false, valid: false, error: 'Erro de conexão com o validador.' });
    }
  };

  const activeEnvelope = envelopes.find((e) => e.id === activeEnvelopeId) || envelopes[0];

  const totalCount = envelopes.length;
  const signedCount = envelopes.filter((e) => e.status === 'signed').length;
  const pendingCount = envelopes.filter((e) => e.status === 'pending').length;
  const conversionRate = totalCount > 0 ? ((signedCount / totalCount) * 100).toFixed(0) : '0';

  const filteredEnvelopes = envelopes.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.variables?.nome_cliente && e.variables.nome_cliente.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* Top Banner & Subdomain Notice */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-zinc-300">
            elosign.grupoeloizio.com.br • SaaS de Assinatura Eletrônica Avançada (Lei 14.063/2020)
          </span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>
            Oficina Conectada: <strong className="text-zinc-200">{brandSettings.workshopName}</strong>
          </span>
          <button
            onClick={() => {
              setCurrentView('embed_docs');
            }}
            className="text-[#FF6B00] hover:underline flex items-center gap-1 font-semibold"
          >
            <Code2 className="w-3.5 h-3.5" /> Widget EloMak & API
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center text-zinc-950 font-black text-lg shadow-lg shadow-[#FF6B00]/20">
            ✍️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">EloSign</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30">
                Oficinas & Cursos
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Validade Jurídica Avançada • Clicksign Niched • SHA-256 Imutável
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === 'landing' ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vitrine & Planos
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === 'dashboard' ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Painel da Oficina
          </button>
          <button
            onClick={() => {
              setStep(1);
              setCurrentView('create');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentView === 'create' ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Novo Documento
          </button>
          <button
            onClick={() => {
              if (activeEnvelope) setCurrentView('sign');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition hidden md:flex items-center gap-1 ${
              currentView === 'sign' ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Assinar (/s/:id)
          </button>
          <button
            onClick={() => setCurrentView('validate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === 'validate' ? 'bg-[#FF6B00] text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Validar Hash
          </button>
        </div>

        {/* User Badge (Google Simulated Login) */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-bold text-zinc-200">Eloizio Assunção</span>
            <span className="text-[10px] text-zinc-500">Google Workspace Autenticado</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center font-bold text-xs text-[#FF6B00]">
            EA
          </div>
        </div>
      </header>

      {/* Copy Toast Notification */}
      <AnimatePresence>
        {copyNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 bg-[#FF6B00] text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> {copyNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 1. LANDING PAGE DE VENDAS                                  */}
      {/* ========================================================= */}
      {currentView === 'landing' && (
        <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Assinatura Eletrônica Nichada para Oficinas Mecânicas e Cursos</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              O cliente da sua oficina assina pelo WhatsApp em 30 segundos
            </h1>
            <p className="text-base sm:text-xl text-zinc-400">
              Chega de papel. Validade jurídica, prova por selfie e integrado ao seu sistema EloMak.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-sm hover:brightness-110 transition shadow-xl shadow-[#FF6B00]/25 flex items-center gap-2"
              >
                Acessar Painel da Oficina <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setCurrentView('create');
                }}
                className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-sm hover:bg-zinc-800 transition"
              >
                Testar Envio Grátis
              </button>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-14">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-[#FF6B00] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Validade Jurídica Plena</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Assinatura Eletrônica Avançada conforme a Lei Federal nº 14.063/2020 e MP 2.200-2/2001 com carimbo de tempo
                e hash SHA-256.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Prova por Selfie & CNH</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Evidência biométrica com captura fotográfica pelo celular e validação automática anti-fraude para blindar a oficina.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Click.AI Integrado</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                IA do Google AI Studio que resume termos técnicos em 3 bullets simples e envia mensagem persuasiva no WhatsApp.
              </p>
            </div>
          </div>

          {/* Planos Comerciais */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Planos simples para a sua oficina</h2>
              <p className="text-zinc-400 text-sm mt-1">Sem letras miúdas. Pagamento facilitado pelo Mercado Pago.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plano 1: R$ 39 */}
              <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Start Oficina</span>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">R$ 39</span>
                    <span className="text-zinc-400 text-xs">/mês</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Para mecânicos autônomos iniciando na digitalização.</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> <strong>30 documentos</strong> inclusos/mês
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Prova por Selfie e Geolocalização
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Validade Jurídica Lei 14.063/2020
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Página de Auditoria com SHA-256
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-8 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                >
                  Começar com Start
                </button>
              </div>

              {/* Plano 2: R$ 69 (Destaque) */}
              <div className="rounded-3xl bg-linear-to-b from-zinc-900 to-zinc-900/90 border-2 border-[#FF6B00] p-6 flex flex-col justify-between relative shadow-2xl shadow-[#FF6B00]/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FF6B00] text-zinc-950 font-black text-[10px] uppercase tracking-wider">
                  Mais Escolhido por Oficinas
                </div>
                <div>
                  <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">Pro Oficina + Zap</span>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">R$ 69</span>
                    <span className="text-zinc-400 text-xs">/mês</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Envio direto pelo WhatsApp e logotipo da sua oficina.</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> <strong>100 documentos</strong> inclusos/mês
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Envio automático no <strong>WhatsApp (EloWa)</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> <strong>Logo e Cor</strong> da sua oficina
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Resumo inteligente com Click.AI
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-8 w-full py-3 rounded-xl bg-[#FF6B00] text-zinc-950 hover:brightness-110 font-black text-xs transition shadow-lg shadow-[#FF6B00]/25"
                >
                  Assinar Plano Pro
                </button>
              </div>

              {/* Plano 3: R$ 129 */}
              <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Enterprise White Label</span>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white">R$ 129</span>
                    <span className="text-zinc-400 text-xs">/mês</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">API completa e Widget para colar no seu sistema EloMak.</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> <strong>300 documentos</strong> inclusos/mês
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> Acesso irrestrito à <strong>API REST</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> <strong>Widget Iframe para EloMak</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF6B00]" /> White Label total (sem marca EloSign)
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setCurrentView('embed_docs')}
                  className="mt-8 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                >
                  Conhecer API & Widget
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 2. DASHBOARD DO DONO DA OFICINA                            */}
      {/* ========================================================= */}
      {currentView === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Top Info & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                Painel do Mecânico • {brandSettings.workshopName}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Gerencie envelopes, ordens de serviço e termos com assinatura eletrônica avançada.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStep(1);
                  setCurrentView('create');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/20"
              >
                <Plus className="w-4 h-4" /> Novo Documento
              </button>
              <button
                onClick={loadEnvelopes}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
                title="Recarregar Envelopes"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span>Documentos Enviados</span>
                <FileText className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">{totalCount}</div>
              <div className="text-[10px] text-zinc-500 mt-1">Total acumulado na plataforma</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span>Assinados & Auditados</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{signedCount}</div>
              <div className="text-[10px] text-emerald-500/80 mt-1">Com hash SHA-256 final e selfie</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span>Aguardando Assinatura</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">{pendingCount}</div>
              <div className="text-[10px] text-amber-500/80 mt-1">Links ativos no WhatsApp/E-mail</div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 text-xs">
                <span>Taxa de Conversão</span>
                <Zap className="w-4 h-4 text-[#FF6B00]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FF6B00] mt-2">{conversionRate}%</div>
              <div className="text-[10px] text-zinc-500 mt-1">Média de assinatura em 30 segundos</div>
            </div>
          </div>

          {/* Modelos Prontos Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FileSignature className="w-3.5 h-3.5 text-[#FF6B00]" /> Modelos Prontos de Oficina & Cursos
              </span>
              <span className="text-[11px] text-zinc-500">Clique para iniciar um documento preenchido</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {[
                { id: 'tpl_os_autorizacao', title: 'Ordem de Serviço - Autorização', icon: Car },
                { id: 'tpl_orcamento', title: 'Orçamento de Peças', icon: FileText },
                { id: 'tpl_garantia_motor', title: 'Termo de Garantia de Motor 90 dias', icon: ShieldCheck },
                { id: 'tpl_contrato_vanguard', title: 'Contrato Curso Vanguard', icon: Building2 },
                { id: 'tpl_uso_imagem', title: 'Autorização de Uso de Imagem', icon: Camera },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    setNewTitle(tpl.title);
                    setStep(1);
                    setCurrentView('create');
                  }}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#FF6B00]/60 text-left transition flex items-center gap-2.5 group"
                >
                  <tpl.icon className="w-4 h-4 text-[#FF6B00] shrink-0 group-hover:scale-110 transition" />
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white line-clamp-1">
                    {tpl.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por cliente, ID ou termo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {(['all', 'pending', 'signed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${
                    statusFilter === st
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st === 'pending' ? 'Aguardando' : 'Assinados'}
                </button>
              ))}
            </div>
          </div>

          {/* Envelopes Table / List */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            {filteredEnvelopes.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Nenhum envelope localizado com os filtros selecionados.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80">
                {filteredEnvelopes.map((env) => {
                  const signer = env.signers?.[0];
                  const isSigned = env.status === 'signed';

                  return (
                    <div
                      key={env.id}
                      className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-zinc-800/30 transition"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-zinc-500">{env.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isSigned
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {isSigned ? 'Assinado & Auditado' : 'Aguardando Assinatura'}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(env.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-sm sm:text-base truncate">{env.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span>
                            Cliente: <strong className="text-zinc-200">{signer?.name || 'Cliente'}</strong>
                          </span>
                          {env.variables?.placa && (
                            <span>
                              Placa: <strong className="text-zinc-200">{env.variables.placa}</strong>
                            </span>
                          )}
                          {env.variables?.valor_servico && (
                            <span>
                              Valor: <strong className="text-zinc-200">R$ {env.variables.valor_servico}</strong>
                            </span>
                          )}
                        </div>
                        {env.summary && (
                          <p className="text-[11px] text-zinc-400 line-clamp-1 italic bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-800/60">
                            {env.summary.replace(/\n/g, ' ')}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* WhatsApp Dispatch Button */}
                        <a
                          href={`https://wa.me/${signer?.phone || '5521996134073'}?text=${encodeURIComponent(
                            env.whatsappMessage || `Assine seu documento na Oficina: ${env.signatureUrl}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5"
                          title="Enviar link no WhatsApp do cliente"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Enviar no Zap
                        </a>

                        {/* Copy Link */}
                        <button
                          onClick={() => handleCopy(env.signatureUrl, 'Link do Envelope')}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition flex items-center gap-1.5"
                          title="Copiar URL de assinatura"
                        >
                          <Copy className="w-3.5 h-3.5" /> Link /s/
                        </button>

                        {/* Open Signature View */}
                        <button
                          onClick={() => {
                            setActiveEnvelopeId(env.id);
                            setCurrentView('sign');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition flex items-center gap-1.5"
                          title="Abrir tela mobile de assinatura"
                        >
                          <Eye className="w-3.5 h-3.5" /> {isSigned ? 'Ver Documento' : 'Assinar Agora'}
                        </button>

                        {/* Download PDF if signed */}
                        {isSigned && (
                          <button
                            onClick={() => handleDownloadSignedPdf(env.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-bold text-xs hover:brightness-110 transition flex items-center gap-1.5"
                            title="Baixar PDF com Página de Auditoria Oficial"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF Auditado
                          </button>
                        )}

                        {/* Validate Hash */}
                        <button
                          onClick={() => {
                            setValidationHashInput(env.finalSha256 || env.originalSha256);
                            handleValidateHash(env.finalSha256 || env.originalSha256);
                            setCurrentView('validate');
                          }}
                          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
                          title="Verificar integridade do hash"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 3. FLUXO DE CRIAÇÃO DE DOCUMENTO (CORE EM 3 PASSOS)         */}
      {/* ========================================================= */}
      {currentView === 'create' && (
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Criar Novo Documento para Assinatura</h1>
              <p className="text-xs text-zinc-400">
                Passo {step} de 3 • Gere documentos em 30 segundos com validade jurídica Lei 14.063/2020.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs text-zinc-400 hover:text-white underline"
            >
              Cancelar e Voltar
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div
              className={`h-2 rounded-full transition ${
                step >= 1 ? 'bg-[#FF6B00]' : 'bg-zinc-800'
              }`}
            ></div>
            <div
              className={`h-2 rounded-full transition ${
                step >= 2 ? 'bg-[#FF6B00]' : 'bg-zinc-800'
              }`}
            ></div>
            <div
              className={`h-2 rounded-full transition ${
                step >= 3 ? 'bg-[#FF6B00]' : 'bg-zinc-800'
              }`}
            ></div>
          </div>

          {/* STEP 1: Upload ou Escolha de Modelo */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-zinc-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  Escolha o Modelo ou Envie um PDF
                </h2>

                {/* Template Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  {[
                    { id: 'tpl_os_autorizacao', title: 'Ordem de Serviço - Autorização' },
                    { id: 'tpl_orcamento', title: 'Orçamento de Peças' },
                    { id: 'tpl_garantia_motor', title: 'Termo de Garantia 90 dias' },
                    { id: 'tpl_contrato_vanguard', title: 'Contrato Curso Vanguard' },
                    { id: 'tpl_uso_imagem', title: 'Uso de Imagem & Depoimento' },
                    { id: 'custom_upload', title: '📄 Upload de PDF Próprio' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        if (tpl.id !== 'custom_upload') setNewTitle(tpl.title);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                        selectedTemplate === tpl.id
                          ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>

                {/* Paste OS Text with Click.AI Auto-Extraction */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Colar Ordem de Serviço / Orçamento (Preenchimento com IA)
                    </label>
                    <span className="text-[11px] text-zinc-500">Google Gemini</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Cole aqui o texto da OS do seu sistema (ex: Cliente Marcos, Placa RIO-2026, Retífica no valor de R$ 1.850,00)..."
                    value={pastedOSText}
                    onChange={(e) => setPastedOSText(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                  />
                  {pastedOSText && (
                    <button
                      type="button"
                      onClick={() => callAiExtractData(pastedOSText)}
                      disabled={aiGenerating}
                      className="px-3 py-1.5 rounded-lg bg-[#FF6B00] text-zinc-950 font-bold text-xs hover:brightness-110 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Extrair Dados Automaticamente via Click.AI
                    </button>
                  )}
                </div>

                {/* Template Variables Form */}
                <div className="pt-3 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Variáveis do Documento
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Nome do Cliente</label>
                      <input
                        type="text"
                        value={variables.nome_cliente}
                        onChange={(e) => setVariables({ ...variables, nome_cliente: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">CPF do Cliente</label>
                      <input
                        type="text"
                        value={variables.cpf}
                        onChange={(e) => setVariables({ ...variables, cpf: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Placa / Identificação da Máquina</label>
                      <input
                        type="text"
                        value={variables.placa}
                        onChange={(e) => setVariables({ ...variables, placa: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Valor do Serviço (R$)</label>
                      <input
                        type="text"
                        value={variables.valor_servico}
                        onChange={(e) => setVariables({ ...variables, valor_servico: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Prazo de Garantia</label>
                      <input
                        type="text"
                        value={variables.prazo_garantia}
                        onChange={(e) => setVariables({ ...variables, prazo_garantia: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-2"
                >
                  Avançar para Signatários <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Signatários */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-zinc-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  Adicionar Signatários (Quem deve assinar)
                </h2>
                <p className="text-xs text-zinc-400">
                  Os signatários receberão o link seguro direto no WhatsApp e no E-mail com validação em 30 segundos.
                </p>

                {signersList.map((sig, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">Signatário #{idx + 1} (Cliente Principal)</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Ordem: {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Nome Completo</label>
                        <input
                          type="text"
                          value={sig.name}
                          onChange={(e) => {
                            const copy = [...signersList];
                            copy[idx].name = e.target.value;
                            setSignersList(copy);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">WhatsApp com DDD</label>
                        <input
                          type="text"
                          value={sig.phone}
                          onChange={(e) => {
                            const copy = [...signersList];
                            copy[idx].phone = e.target.value;
                            setSignersList(copy);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">E-mail</label>
                        <input
                          type="email"
                          value={sig.email}
                          onChange={(e) => {
                            const copy = [...signersList];
                            copy[idx].email = e.target.value;
                            setSignersList(copy);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">CPF</label>
                        <input
                          type="text"
                          value={sig.cpf}
                          onChange={(e) => {
                            const copy = [...signersList];
                            copy[idx].cpf = e.target.value;
                            setSignersList(copy);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-2"
                >
                  Avançar para Autenticação <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Escolher Autenticação & Finalizar */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-zinc-950 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  Escolha o Nível de Autenticação & Evidência
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'selfie_dynamic',
                      title: 'Selfie Dinâmica com Câmera (Recomendado)',
                      desc: 'O cliente tira uma foto na hora pelo celular com prova de vivacidade e carimbo de tempo.',
                      icon: Camera,
                    },
                    {
                      id: 'selfie_doc',
                      title: 'Selfie + Documento (CNH Frente/Verso)',
                      desc: 'Exige foto do rosto e foto do documento oficial para máxima segurança jurídica em motores e retíficas.',
                      icon: UserCheck,
                    },
                    {
                      id: 'email_sms',
                      title: 'E-mail + Token SMS / WhatsApp',
                      desc: 'Validação por código de autenticação único enviado no celular do cliente.',
                      icon: Smartphone,
                    },
                    {
                      id: 'pix_validation',
                      title: 'Validação via PIX de R$ 1,00',
                      desc: 'O cliente faz um PIX simbólico de R$ 1 que atesta titularidade bancária instantânea.',
                      icon: Key,
                    },
                  ].map((auth) => (
                    <button
                      key={auth.id}
                      onClick={() => setAuthMethod(auth.id as any)}
                      className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                        authMethod === auth.id
                          ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <auth.icon className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs text-white">{auth.title}</div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{auth.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Click.AI Preview Generator */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> Click.AI: Título e Mensagem Amigável de WhatsApp
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const contractText = `Contrato de oficina mecânica para o cliente ${variables.nome_cliente}, veículo ${variables.placa}, serviço no valor de R$ ${variables.valor_servico} e garantia de ${variables.prazo_garantia}.`;
                        callAiTitleAndMessage(contractText);
                        callAiSummarize(contractText);
                      }}
                      className="text-[11px] text-[#FF6B00] hover:underline font-semibold"
                    >
                      Gerar Título & Resumo com IA
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 block mb-1">Título do Documento</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 block mb-1">Mensagem do WhatsApp</label>
                    <textarea
                      rows={2}
                      value={
                        aiZapMsg ||
                        `Olá ${variables.nome_cliente}! Aqui é da Oficina Grupo Eloizio. Segue o termo de autorização do serviço do seu maquinário para assinatura rápida pelo celular em 30 segundos.`
                      }
                      onChange={(e) => setAiZapMsg(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={handleCreateEnvelope}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-2 shadow-lg shadow-[#FF6B00]/25"
                >
                  {loading ? 'Gerando Criptografia SHA-256...' : 'Criar Envelope & Gerar Link'}
                </button>
              </div>
            </motion.div>
          )}
        </main>
      )}

      {/* ========================================================= */}
      {/* 4. PÁGINA PÚBLICA DE ASSINATURA MOBILE-FIRST (/s/:id)      */}
      {/* ========================================================= */}
      {currentView === 'sign' && activeEnvelope && (
        <main className="max-w-4xl mx-auto px-4 py-6">
          {/* Controls bar */}
          <div className="flex items-center justify-between mb-4 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-400">URL:</span>
              <span className="font-mono text-zinc-200">
                elosign.grupoeloizio.com.br/s/{activeEnvelope.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobilePreviewMode(!mobilePreviewMode)}
                className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white font-semibold transition"
              >
                {mobilePreviewMode ? 'Ver Modo Desktop' : 'Ver Modo Celular (90%)'}
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-zinc-400 hover:text-white underline"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Outer Mobile Frame Container */}
          <div className="flex justify-center">
            <div
              className={`w-full transition-all duration-300 ${
                mobilePreviewMode
                  ? 'max-w-md bg-zinc-900/90 border-4 border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-black/80'
                  : 'max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6'
              }`}
            >
              {signedSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-black text-white">Documento Assinado com Sucesso!</h2>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Sua assinatura eletrônica avançada foi processada e atestada pela plataforma EloSign conforme a Lei
                    Federal nº 14.063/2020 e MP 2.200-2/2001.
                  </p>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-left text-xs font-mono text-zinc-300">
                    <div>Status: CONCLUÍDO & REGISTRADO</div>
                    <div>Horário UTC: {new Date().toISOString()}</div>
                    <div>Hash Final: {activeEnvelope.finalSha256 || 'Calculado com evidências'}</div>
                  </div>
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleDownloadSignedPdf(activeEnvelope.id)}
                      className="w-full py-3 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Baixar Cópia Oficial com Auditoria
                    </button>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition"
                    >
                      Voltar ao Painel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Top: Workshop Logo & Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={brandSettings.logoUrl}
                        alt="Logo da Oficina"
                        className="w-8 h-8 rounded-lg object-cover border border-zinc-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{brandSettings.workshopName}</div>
                        <div className="text-[10px] text-zinc-500">Documento Oficial de Autorização</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Ambiente Seguro
                    </span>
                  </div>

                  {/* Card: Title & AI 3-Bullet Summary */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B00]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Resumo Simplificado do Documento (Click.AI)</span>
                    </div>
                    <h2 className="text-sm font-bold text-white leading-tight">{activeEnvelope.title}</h2>
                    <div className="text-xs text-zinc-300 space-y-1 pt-1 leading-relaxed whitespace-pre-line">
                      {activeEnvelope.summary ||
                        '• Autorização expressa de desmontagem e substituição de peças defeituosas\n• Valor acordado sem custos ocultos\n• Garantia formal de 90 dias sobre mão de obra'}
                    </div>
                  </div>

                  {/* PDF Embedded Document Viewer */}
                  <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 max-h-56 overflow-y-auto text-xs text-zinc-300 font-serif space-y-3 shadow-inner">
                    <div className="text-center font-bold text-zinc-400 uppercase tracking-widest text-[10px] font-sans">
                      TERMO DE PRESTAÇÃO DE SERVIÇOS & AUTORIZAÇÃO TÉCNICA
                    </div>
                    <p>
                      Pelo presente instrumento particular, o contratante{' '}
                      <strong>{activeEnvelope.variables?.nome_cliente || 'CLIENTE'}</strong>, portador do CPF{' '}
                      <strong>{activeEnvelope.variables?.cpf || 'Não informado'}</strong>, autoriza expressamente a execução
                      dos procedimentos técnicos e substituição de peças no veículo/equipamento de placa{' '}
                      <strong>{activeEnvelope.variables?.placa || 'RIO-2026'}</strong>.
                    </p>
                    <p>
                      <strong>Valor Total Acordado:</strong> R${' '}
                      {activeEnvelope.variables?.valor_servico || '1.850,00'}, com garantia formal de{' '}
                      <strong>{activeEnvelope.variables?.prazo_garantia || '90 dias'}</strong> a contar da entrega do
                      serviço concluído.
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Declaro ciência de que a presente assinatura eletrônica possui validade jurídica plena equivalente à
                      firma manuscrita, amparada pela Medida Provisória nº 2.200-2/2001 e pela Lei Federal nº 14.063/2020.
                    </p>
                  </div>

                  {/* Checkbox: Li e concordo */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded accent-[#FF6B00] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300 leading-tight">
                      <strong>Li e concordo</strong> integralmente com os termos deste documento e autorizo a execução dos
                      serviços mecânicos.
                    </span>
                  </label>

                  {/* Etapa de Autenticação: Selfie / CNH */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#FF6B00]" /> Prova de Identidade por Selfie
                      </span>
                      <span className="text-[10px] text-emerald-400">Exigência Legal</span>
                    </div>

                    {selfieCaptured ? (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-emerald-500/30">
                        <div className="flex items-center gap-2">
                          <img
                            src={selfieCaptured}
                            alt="Selfie"
                            className="w-10 h-10 rounded-lg object-cover border border-emerald-500/50"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-emerald-400 block">Selfie Capturada ✔</span>
                            <span className="text-[10px] text-zinc-400">Biometria Facial Registrada</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelfieCaptured(null)}
                          className="text-[11px] text-zinc-400 hover:text-white underline"
                        >
                          Tirar outra
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Simulate real selfie camera capture
                            setSelfieCaptured(
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
                            );
                          }}
                          className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#FF6B00]/60 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
                        >
                          <Camera className="w-4 h-4 text-[#FF6B00]" /> Abrir Câmera e Tirar Foto do Rosto
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Canvas para Assinatura Manuscrita */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <FileSignature className="w-3.5 h-3.5 text-[#FF6B00]" /> Assine com o dedo aqui
                      </span>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-[11px] text-zinc-400 hover:text-white underline"
                      >
                        Limpar
                      </button>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden border border-zinc-300 relative touch-none">
                      <canvas
                        ref={canvasRef}
                        width={360}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 cursor-crosshair block"
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-zinc-400 text-xs italic">
                          Desenhe sua assinatura com o dedo ou mouse
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botão Final: Assinar Documento */}
                  <button
                    onClick={() => handleSignDocument(activeEnvelope.id)}
                    disabled={isSigning || !agreedTerms}
                    className="w-full py-3.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-sm hover:brightness-110 disabled:opacity-50 transition shadow-xl shadow-[#FF6B00]/25 flex items-center justify-center gap-2"
                  >
                    {isSigning ? (
                      'Gravando Assinatura & Gerando Hash...'
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Assinar Documento Agora
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-center text-zinc-500">
                    Ao assinar, coletamos IP, carimbo de tempo UTC e evidências biométricas conforme a Lei 14.063/2020.
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 5. VALIDAÇÃO PÚBLICA DE DOCUMENTOS (/validar/:hash)         */}
      {/* ========================================================= */}
      {currentView === 'validate' && (
        <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF6B00] mx-auto shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Validador Público de Autenticidade</h1>
            <p className="text-xs text-zinc-400">
              Verifique a integridade e validade jurídica de qualquer documento assinado pela plataforma EloSign.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <label className="text-xs font-bold text-zinc-300 block">
              Insira o Hash Criptográfico SHA-256 do Documento
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
                value={validationHashInput}
                onChange={(e) => setValidationHashInput(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B00]"
              />
              <button
                onClick={() => handleValidateHash()}
                className="px-5 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-bold text-xs hover:brightness-110 transition"
              >
                Validar
              </button>
            </div>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div
              className={`p-6 rounded-2xl border ${
                validationResult.valid
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              } space-y-4`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    validationResult.valid ? 'bg-emerald-500 text-zinc-950 font-black' : 'bg-rose-500 text-white'
                  }`}
                >
                  {validationResult.valid ? <Check className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {validationResult.valid ? 'DOCUMENTO AUTÊNTICO & VÁLIDO' : 'HASH NÃO LOCALIZADO / VIOLADO'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {validationResult.legalNotice || validationResult.error}
                  </p>
                </div>
              </div>

              {validationResult.valid && validationResult.envelope && (
                <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/80 space-y-2 text-xs text-zinc-300">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-zinc-500 block">Título do Documento:</span>
                      <strong className="text-white">{validationResult.envelope.title}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Data de Assinatura:</span>
                      <strong className="text-white">{validationResult.envelope.signedAt}</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-zinc-500 block mb-1">Signatários Certificados:</span>
                    {validationResult.envelope.signers?.map((s: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-[11px] font-mono text-zinc-300">
                        <span>• {s.name} ({s.cpf})</span>
                        <span className="text-zinc-500">IP: {s.ip || '187.55.210.42'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* ========================================================= */}
      {/* 6. INTEGRAÇÃO ELOSIGN x ELOMAK E VANGUARD (API & WIDGET)   */}
      {/* ========================================================= */}
      {currentView === 'embed_docs' && (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Code2 className="w-6 h-6 text-[#FF6B00]" /> Integração EloSign x EloMak & Vanguard
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Embuta o EloSign dentro do ERP da oficina ou dispare assinaturas via API RESTful.
            </p>
          </div>

          {/* Widget Embed Showcase */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FF6B00]" /> Componente Widget Embutido no EloMak
            </h2>
            <p className="text-xs text-zinc-400">
              Cole o código iframe abaixo dentro da tela de Ordem de Serviço do seu sistema EloMak. O EloMak envia os
              dados via <code>postMessage</code> e o EloSign abre o fluxo pré-preenchido instantaneamente.
            </p>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-[#FF6B00] relative">
              <pre className="overflow-x-auto">
{`<iframe 
  src="https://elosign.grupoeloizio.com.br/embed?apiKey=${brandSettings.apiKey}" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 16px;"
></iframe>`}
              </pre>
              <button
                onClick={() =>
                  handleCopy(
                    `<iframe src="https://elosign.grupoeloizio.com.br/embed?apiKey=${brandSettings.apiKey}" width="100%" height="600" style="border: none; border-radius: 16px;"></iframe>`,
                    'Código do Iframe'
                  )
                }
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Test postMessage Simulator */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">
                Simulador Interativo: Disparar OS do EloMak para o EloSign
              </span>
              <button
                onClick={() => {
                  setVariables({
                    nome_cliente: 'Oficina Automotiva Vanguard Test',
                    cpf: '333.444.555-66',
                    telefone: '21996134073',
                    placa: 'ELO-2026',
                    valor_servico: '2.400,00',
                    prazo_garantia: '90 dias',
                  });
                  setStep(1);
                  setCurrentView('create');
                  setCopyNotice('Dados da OS recebidos via postMessage e formulário carregado!');
                  setTimeout(() => setCopyNotice(null), 3500);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF6B00]" /> Testar Recebimento de OS do EloMak (postMessage)
              </button>
            </div>
          </div>

          {/* API Documentation */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#FF6B00]" /> Documentação da API REST (v1)
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">POST</span>
              <span className="font-mono text-zinc-200">/api/v1/envelopes/create</span>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
              <pre>{`Headers:
X-Api-Key: ${brandSettings.apiKey}
Content-Type: application/json

Body:
{
  "title": "Ordem de Serviço #2026-90",
  "templateId": "tpl_os_autorizacao",
  "authMethod": "selfie_dynamic",
  "signers": [
    {
      "name": "João da Silva",
      "email": "joao@email.com",
      "phone": "21996134073",
      "cpf": "123.456.789-00"
    }
  ],
  "variables": {
    "nome_cliente": "João da Silva",
    "cpf": "123.456.789-00",
    "placa": "RIO-2026",
    "valor_servico": "1.450,00",
    "prazo_garantia": "90 dias"
  }
}`}</pre>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
