import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  FileText,
  Boxes,
  Wallet,
  ArrowRight,
  RefreshCw,
  Send,
  Zap,
  Key,
  ExternalLink,
  Copy,
  Check,
  Building2,
  SlidersHorizontal,
  Plus,
  Search,
  MessageSquare,
  AlertTriangle,
  QrCode,
  FileSignature
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EloMakPortal: React.FC = () => {
  // Navigation tabs within EloMak Portal
  const [activeTab, setActiveTab] = useState<
    'overview' | 'camilla_auth' | 'webhook_sim' | 'os_management' | 'inventory_finance' | 'architecture'
  >('overview');

  // Camilla WhatsApp Flow State
  const [inputWhatsapp, setInputWhatsapp] = useState('21996134073');
  const [authLoading, setAuthLoading] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);

  // Webhook Hub Simulator State
  const [simSender, setSimSender] = useState('21998877112');
  const [simMessage, setSimMessage] = useState('1');
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [webhookLog, setWebhookLog] = useState<any[]>([]);

  // Copied alert
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // EloMak Metrics & Data
  const [metrics, setMetrics] = useState({
    faturamentoMes: 1850.00,
    osAbertas: 2,
    osFinalizadas: 5,
    contasReceber: 680.00,
    totalClientes: 48,
    pecasEstoque: 124,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 3000);
  };

  // Simular Verificação da Camilla (CamillaController::verificarNumero)
  const handleTestCamillaAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      // Gera token temporário
      const cleanPhone = inputWhatsapp.replace(/\D/g, '');
      const token = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const expira = new Date(Date.now() + 15 * 60000).toLocaleTimeString('pt-BR');
      const isKnown = cleanPhone.includes('996134073') || cleanPhone.includes('998877112');

      const mockResponse = {
        success: true,
        status: isKnown ? 'existente' : 'novo',
        tipo: cleanPhone.includes('996134073') ? 'dono' : (isKnown ? 'cliente' : 'novo'),
        nome: cleanPhone.includes('996134073') ? 'Mestre Eloizio Assunção' : (isKnown ? 'Marcos Vinicius' : 'Cliente Novo'),
        whatsapp: cleanPhone,
        token,
        link_acesso: `https://elomak.grupoeloizio.com.br/acesso/${token}`,
        expira_em: expira,
        mensagem_enviada: isKnown
          ? `Olá Marcos! Vi que seu número é da Oficina Mecânica EloMak & Grupo Eloizio de São Gonçalo - RJ. Quer continuar seu atendimento ou acessar o sistema EloMak? 1- Continuar 2- Acessar EloMak - Link rápido: https://elomak.grupoeloizio.com.br/acesso/${token}`
          : `Olá! Sou a Camilla do Grupo Eloizio. Número novo por aqui. Qual serviço deseja? 1-Mecânica 2-Sistema para minha oficina 3-Orçamento`,
        feedback: `Link temporário de 15 minutos despachado via Hub Central (webhook.grupoeloizio.com.br) para o WhatsApp ${cleanPhone}!`
      };

      await new Promise(r => setTimeout(r, 600));
      setAuthResult(mockResponse);
    } catch {
      // Error
    } finally {
      setAuthLoading(false);
    }
  };

  // Simular Envio de Webhook da Evolution API para o Hub Central
  const handleSimulateWebhook = async (presetText?: string) => {
    const textToSend = presetText || simMessage;
    setWebhookLoading(true);

    const logEntry: any = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      sender: simSender,
      text: textToSend,
      status: 'Processando...',
    };

    // Detecção de Regra conforme o webhook_receiver.php
    let respostaCamilla = '';
    const regexPlaca = /([A-Z]{3}[0-9][A-Z0-9][0-9]{2})/i;
    const matchPlaca = textToSend.replace(/-/g, '').toUpperCase().match(regexPlaca);

    if (matchPlaca) {
      respostaCamilla = `Perfeito! Anotei a placa *${matchPlaca[1]}* na sua ficha. Agora, por favor, me descreva resumidamente: qual defeito, barulho ou serviço você precisa que nossa equipe técnica avalie no veículo?`;
    } else if (textToSend.trim() === '1') {
      respostaCamilla = `Excelente! Já abri seu pré-atendimento (Protocolo *OS-2026-${Math.floor(100 + Math.random() * 899)}*). Por favor, me informe a *PLACA* do seu veículo (ex: RIO2026) para localizarmos o modelo exato no sistema.`;
    } else if (textToSend.trim() === '2') {
      const token = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      respostaCamilla = `🔑 *Seu Acesso Rápido ao EloMak:*\n\nClique no link abaixo para entrar no sistema da oficina sem precisar de senha (válido por 15 minutos):\n\n👉 https://elomak.grupoeloizio.com.br/acesso/${token}\n\nSe precisar de suporte, basta responder esta mensagem!`;
    } else if (textToSend.trim() === '3') {
      respostaCamilla = `Com certeza! Para gerarmos seu orçamento sem compromisso, por favor envie a *PLACA* do veículo e o *SERVIÇO DESEJADO* (ex: troca de óleo, embreagem, suspensão, freios, retífica de motor).`;
    } else {
      respostaCamilla = `Defeito registrado com sucesso! Nossa equipe técnica já está com seu chamado na tela. Quer acompanhar pelo sistema? Digite *2* a qualquer momento para receber seu link de acesso rápido!`;
    }

    await new Promise(r => setTimeout(r, 700));

    logEntry.status = 'Triado com Sucesso';
    logEntry.hub_forward = 'webhook.grupoeloizio.com.br -> /elomak/api/webhook_receiver.php';
    logEntry.secret_verified = 'X-Webhook-Secret: eloizio_secret_123';
    logEntry.camilla_reply = respostaCamilla;

    setWebhookLog(prev => [logEntry, ...prev]);
    setWebhookLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-[#FF6B00] selection:text-zinc-950 pb-16">
      
      {/* Top Banner */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-zinc-300">
            https://elomak.grupoeloizio.com.br • PHP 8.3 MVC Puro • MySQL 8.0 PDO • Mobile-First
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>Central Hub: <strong className="text-zinc-200">https://webhook.grupoeloizio.com.br</strong></span>
          <span className="text-[#FF6B00] font-bold">Camilla Oficial: 21 99613-4073</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg shadow-[#FF6B00]/25">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-tight">EloMak</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30">
                ERP Oficina
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Gestão Completa de Oficinas Mecânicas • Autenticação Exclusiva via WhatsApp
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold overflow-x-auto max-w-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#FF6B00] text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('camilla_auth')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'camilla_auth' ? 'bg-[#FF6B00] text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Login WhatsApp (Camilla)
          </button>
          <button
            onClick={() => setActiveTab('webhook_sim')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'webhook_sim' ? 'bg-[#FF6B00] text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Hub Central (Triagem)
          </button>
          <button
            onClick={() => setActiveTab('os_management')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'os_management' ? 'bg-[#FF6B00] text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" /> Ordens de Serviço
          </button>
          <button
            onClick={() => setActiveTab('inventory_finance')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'inventory_finance' ? 'bg-[#FF6B00] text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" /> Estoque & PIX
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'architecture' ? 'bg-[#FF6B00] text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Arquitetura & Nginx
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 bg-[#FF6B00] text-zinc-950 px-4 py-2 rounded-xl text-xs font-black shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> {copiedText}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* ========================================================= */}
        {/* TAB 1: VISÃO GERAL & PAINEL DE CONTROLE                    */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1 rounded-full border border-[#FF6B00]/20">
                  Sistema Completo & Pronto para Produção
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  EloMak • Gestão Inteligente para Oficinas Mecânicas
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Sem senhas fracas ou esquecidas. Login exclusivo via WhatsApp gerando token temporário de 15 minutos
                  com a atendente Camilla Faria. Integração centralizada com Hub de Webhook e assinatura eletrônica no EloSign.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('camilla_auth')}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black hover:brightness-110 transition flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" /> Testar Login WhatsApp
                  </button>
                  <button
                    onClick={() => setActiveTab('webhook_sim')}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-[#FF6B00]" /> Testar Hub & Triagem
                  </button>
                  <a
                    href="/elomak/public/index.php"
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold hover:text-white transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Abrir Document Root PHP (/elomak/public/)
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Cards de Métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Faturamento Mensal</span>
                  <Wallet className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-2">R$ 1.850,00</div>
                <div className="text-[10px] text-zinc-500 mt-1">OSs Finalizadas & Pagas</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>OSs Abertas</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 mt-2">2 em Andamento</div>
                <div className="text-[10px] text-zinc-500 mt-1">Na oficina hoje</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Contas a Receber</span>
                  <Zap className="w-4 h-4 text-[#FF6B00]" />
                </div>
                <div className="text-2xl font-black text-[#FF6B00] mt-2">R$ 680,00</div>
                <div className="text-[10px] text-zinc-500 mt-1">Cobranças PIX ativas</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Hub Central</span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-blue-400 mt-2">100% ONLINE</div>
                <div className="text-[10px] text-zinc-500 mt-1">webhook.grupoeloizio.com.br</div>
              </div>
            </div>

            {/* Destaques das Regras de Ouro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-[#FF6B00] uppercase">1. Webhook Centralizado</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  O EloMak nunca expõe o webhook da Evolution/Z-API diretamente. Todo recebimento passa por
                  <strong> https://webhook.grupoeloizio.com.br</strong> e é repassado internamente via cURL com <code>X-Webhook-Secret</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">2. Camilla no WhatsApp</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Login sem senha digitando apenas o WhatsApp. Triagem automática: Opção 1 abre pré-OS, Opção 2 gera link <code>/acesso/token</code>,
                  Opção 3 gera orçamento, e placas são detectadas via regex.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase">3. Mobile-First Total</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Interface desenhada para o mecânico na bancada de 320px a 4K. Tabelas se transformam em cards fluidos
                  no celular com acionamento por toque.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FLUXO DE AUTENTICAÇÃO CAMILLA (SEM SENHA)          */}
        {/* ========================================================= */}
        {activeTab === 'camilla_auth' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5 text-[#FF6B00]" />
                Simulador do Fluxo da Camilla (Login Sem Senha)
              </h2>
              <p className="text-xs text-zinc-400">
                O usuário digita seu WhatsApp na tela inicial de <code>elomak.grupoeloizio.com.br</code>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4">
              <form onSubmit={handleTestCamillaAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    WhatsApp com DDD (Dono da Oficina ou Cliente)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputWhatsapp}
                      onChange={e => setInputWhatsapp(e.target.value)}
                      placeholder="Ex: 21996134073"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B00]"
                    />
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="px-5 py-2.5 rounded-xl bg-[#FF6B00] text-zinc-950 font-black text-xs hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                    >
                      {authLoading ? 'Verificando...' : 'Acessar via WhatsApp'}
                    </button>
                  </div>
                </div>

                {/* Predefinições de teste rápido */}
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span>Números para teste rápido:</span>
                  <button
                    type="button"
                    onClick={() => setInputWhatsapp('21996134073')}
                    className="text-[#FF6B00] hover:underline"
                  >
                    21996134073 (Dono)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setInputWhatsapp('21998877112')}
                    className="text-[#FF6B00] hover:underline"
                  >
                    21998877112 (Cliente)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setInputWhatsapp('21977665544')}
                    className="text-[#FF6B00] hover:underline"
                  >
                    21977665544 (Novo Lead)
                  </button>
                </div>
              </form>

              {/* Resultado do Dispatch */}
              {authResult && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/40 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Despacho Realizado com Sucesso via Hub Central
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      Token Válido 15 Min
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono space-y-1">
                    <div><strong>Destinatário:</strong> {authResult.whatsapp} ({authResult.nome})</div>
                    <div><strong>Tipo Identificado:</strong> {authResult.tipo.toUpperCase()}</div>
                    <div><strong>Expira em:</strong> {authResult.expira_em}</div>
                    <div className="pt-2 text-zinc-400 italic">"{authResult.mensagem_enviada}"</div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={authResult.link_acesso}
                      target="_blank"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-center font-black text-xs transition"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline mr-1" />
                      Entrar no Sistema via Link Gerado (/acesso/{authResult.token.substring(0, 10)}...)
                    </a>
                    <button
                      onClick={() => copyToClipboard(authResult.link_acesso, 'Link de Acesso')}
                      className="px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                      title="Copiar Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SIMULADOR DO HUB CENTRAL & REGRAS DE TRIAGEM       */}
        {/* ========================================================= */}
        {activeTab === 'webhook_sim' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF6B00]" />
                  Hub Centralizado de Webhooks & Triagem da Camilla
                </h2>
                <p className="text-xs text-zinc-400">
                  Simulação do fluxo da Evolution API enviando para <code>https://webhook.grupoeloizio.com.br/webhook/evolution</code>
                  e o Hub repassando internamente para <code>/elomak/api/webhook_receiver.php</code>.
                </p>
              </div>
            </div>

            {/* Form de Simulação */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] block">
                Disparar Resposta do Cliente no WhatsApp
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Telefone Remetente</label>
                  <input
                    type="text"
                    value={simSender}
                    onChange={e => setSimSender(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-zinc-400 mb-1">Texto Enviado pelo Cliente</label>
                  <input
                    type="text"
                    value={simMessage}
                    onChange={e => setSimMessage(e.target.value)}
                    placeholder="Ex: 1, 2, 3 ou Placa RIO2026..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Botões das 4 Regras de Ouro de Triagem */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <span className="text-[11px] text-zinc-400 font-bold block">Testar Regras Específicas do Passo 4:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleSimulateWebhook('1')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#FF6B00] text-left text-xs transition"
                  >
                    <strong className="block text-white font-mono">Opção 1</strong>
                    <span className="text-[10px] text-zinc-400">Pré-OS / Pede Placa</span>
                  </button>
                  <button
                    onClick={() => handleSimulateWebhook('2')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#FF6B00] text-left text-xs transition"
                  >
                    <strong className="block text-white font-mono">Opção 2</strong>
                    <span className="text-[10px] text-zinc-400">Novo Link /acesso/</span>
                  </button>
                  <button
                    onClick={() => handleSimulateWebhook('3')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#FF6B00] text-left text-xs transition"
                  >
                    <strong className="block text-white font-mono">Opção 3</strong>
                    <span className="text-[10px] text-zinc-400">Pedir Orçamento</span>
                  </button>
                  <button
                    onClick={() => handleSimulateWebhook('Meu carro tem placa RIO2026 com barulho no freio')}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-[#FF6B00] text-left text-xs transition"
                  >
                    <strong className="block text-white font-mono">Regex Placa</strong>
                    <span className="text-[10px] text-zinc-400">Detecta RIO2026</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Log de Triagem do Webhook Receiver */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span>Histórico de Triagem em Tempo Real</span>
                <span className="font-mono text-[10px] text-zinc-500">X-Webhook-Secret: eloizio_secret_123</span>
              </h3>

              {webhookLog.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">Nenhum evento disparado ainda. Clique em uma das opções acima.</p>
              ) : (
                <div className="space-y-3">
                  {webhookLog.map(item => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-zinc-400 text-[11px]">{item.timestamp} • Remetente: {item.sender}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-zinc-300 font-mono text-[11px]">
                        Mensagem Recebida: <strong className="text-white">"{item.text}"</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 whitespace-pre-line leading-relaxed">
                        <span className="text-[#FF6B00] font-bold block mb-1">Resposta Automática da Camilla (via Hub Central):</span>
                        {item.camilla_reply}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ORDENS DE SERVIÇO & GERAÇÃO DE PDF                 */}
        {/* ========================================================= */}
        {activeTab === 'os_management' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#FF6B00]" />
                  Ordens de Serviço • Modelos Prontos & Garantia 90 Dias
                </h2>
                <p className="text-xs text-zinc-400">
                  Gerenciamento com laudo técnico, CDC Artigo 26 e integração de assinatura eletrônica com o EloSign.
                </p>
              </div>
              <a
                href="/elomak/public/index.php"
                target="_blank"
                className="px-4 py-2 rounded-xl bg-[#FF6B00] text-zinc-950 font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Nova OS no EloMak
              </a>
            </div>

            {/* Cards Demonstrativos de OS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-zinc-400">OS-2026-084</span>
                    <h3 className="text-base font-bold text-white mt-0.5">Retífica Completa de Cabeçote & Troca de Bielas</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Finalizada
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <div>Cliente: <strong className="text-white">Marcos Vinicius de Oliveira</strong></div>
                  <div>Veículo: <strong className="text-white font-mono">RIO2026 (Gol G6)</strong></div>
                  <div>Valor Total: <strong className="text-emerald-400 font-mono">R$ 1.850,00</strong></div>
                  <div>Garantia: <strong className="text-white">90 dias (CDC)</strong></div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
                  <strong>Laudo Técnico:</strong> Folga excessiva nos mancais eliminada, plaina de cabeçote com troca de retentores de válvulas e jogo de juntas Sabó.
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <a
                    href="https://elosign.grupoeloizio.com.br"
                    target="_blank"
                    className="text-[#FF6B00] hover:underline font-bold flex items-center gap-1"
                  >
                    <FileSignature className="w-3.5 h-3.5" /> Assinado via EloSign (#env_elo_8841)
                  </a>
                  <button
                    onClick={() => copyToClipboard('OS-2026-084: Gol G6 Placa RIO2026 - R$ 1.850,00', 'Dados da OS')}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Copiar dados"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-zinc-400">OS-2026-092</span>
                    <h3 className="text-base font-bold text-white mt-0.5">Revisão do Sistema de Freios & Discos Dianteiros</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Em Andamento
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <div>Cliente: <strong className="text-white">Carlos Eduardo Santos</strong></div>
                  <div>Veículo: <strong className="text-white font-mono">KPW3A45 (Onix LTZ)</strong></div>
                  <div>Valor Total: <strong className="text-blue-400 font-mono">R$ 680,00</strong></div>
                  <div>Garantia: <strong className="text-white">90 dias (CDC)</strong></div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
                  <strong>Diagnóstico:</strong> Pastilhas Fras-le aplicadas, par de discos ventilados Fremax instalados e sangria de fluido DOT 4 completada.
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <span className="text-amber-400 font-bold">Aguardando entrega ao cliente</span>
                  <a
                    href="https://elosign.grupoeloizio.com.br"
                    target="_blank"
                    className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
                  >
                    Gerar Envelope EloSign
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ESTOQUE & COBRANÇA PIX                             */}
        {/* ========================================================= */}
        {activeTab === 'inventory_finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Estoque com Baixa Automática */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-[#FF6B00]" /> Controle de Estoque & Peças
                  </h3>
                  <span className="text-xs text-zinc-500">Baixa automática na OS</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">OLEO-5W30-SYN • Óleo Sintético 5W30 1L</strong>
                      <span className="text-zinc-500 text-[11px]">Custo: R$ 28,50 | Venda: R$ 48,00</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">42 UN</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">FILT-OLEO-VW • Filtro de Óleo Gol/Fox</strong>
                      <span className="text-zinc-500 text-[11px]">Custo: R$ 15,00 | Venda: R$ 32,00</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">18 UN</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white block">PAST-FREIO-ONIX • Pastilhas Freio Dianteiro</strong>
                      <span className="text-zinc-500 text-[11px]">Custo: R$ 65,00 | Venda: R$ 135,00</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">8 UN (Mínimo: 3)</span>
                  </div>
                </div>
              </div>

              {/* Cobrança PIX Mercado Pago */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400" /> Cobrança PIX Instantânea
                  </h3>
                  <span className="text-xs text-emerald-400">EMV BR Code</span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center p-2 text-zinc-950 font-bold text-xs">
                    <QrCode className="w-24 h-24 text-zinc-950" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">Ordem de Serviço #OS-2026-084</span>
                    <strong className="text-lg font-black text-white font-mono">R$ 1.850,00</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono truncate">
                    00020126580014br.gov.bcb.pix0136elomak_67025204000053039865401850.005802BR5925OFICINA ELOMAK ELOIZIO6014SAO GONCALO62070503***6304
                  </div>
                  <button
                    onClick={() => copyToClipboard('00020126580014br.gov.bcb.pix0136elomak_67025204000053039865401850.005802BR5925OFICINA ELOMAK ELOIZIO6014SAO GONCALO62070503***6304', 'Código PIX')}
                    className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition"
                  >
                    Copiar Código PIX Copia e Cola
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: ARQUITETURA, NGINX E CÓDIGO FONTE                  */}
        {/* ========================================================= */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF6B00]" /> Estrutura do Projeto Gerado em Produção
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-zinc-300">
                  <strong className="text-[#FF6B00] block">/elomak/ (Core ERP):</strong>
                  <div>├── /public/ (index.php, assets/css, assets/js)</div>
                  <div>├── /app/controllers/ (Camilla, Os, Cliente, Estoque, Financeiro)</div>
                  <div>├── /app/views/ (login_whatsapp, dashboard, os_form, etc)</div>
                  <div>├── /config/ (config.php, database.php, whatsapp.php)</div>
                  <div>├── /api/ (webhook_receiver.php - RECEBE DO HUB)</div>
                  <div>├── /sql/ (elomak_database.sql)</div>
                  <div>└── /nginx/ (elomak.grupoeloizio.com.br.conf)</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-zinc-300">
                  <strong className="text-emerald-400 block">/webhook-central/ (Hub Obrigatório):</strong>
                  <div>├── /public/ (index.php router: /webhook/evolution e /send)</div>
                  <div>├── /config/ (config.php com WEBHOOK_SECRET)</div>
                  <div>├── /nginx/ (webhook.grupoeloizio.com.br.conf)</div>
                  <div className="pt-2 text-zinc-400">
                    * O Hub Central recebe da Evolution API e repassa com cabeçalho <code>X-Webhook-Secret</code> para o EloMak.
                  </div>
                </div>
              </div>
            </div>

            {/* Configuração NGINX Pronta */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Nginx Server Block (/elomak/nginx/elomak.grupoeloizio.com.br.conf)</h3>
                <button
                  onClick={() => copyToClipboard(`server {
    listen 80;
    listen 443 ssl http2;
    server_name elomak.grupoeloizio.com.br;
    root /var/www/grupoeloizio.com.br/elomak/public;
    index index.php index.html;
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        include fastcgi_params;
    }
}`, 'Nginx Conf')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Nginx
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
{`server {
    listen 80;
    listen 443 ssl http2;
    server_name elomak.grupoeloizio.com.br;

    root /var/www/grupoeloizio.com.br/elomak/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Bloqueio de pastas internas do sistema (Segurança Crítica)
    location ~ ^/(config|app|sql|storage/logs)/ {
        deny all;
        return 404;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}`}
              </pre>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
