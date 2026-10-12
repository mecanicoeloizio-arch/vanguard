import React, { useState } from 'react';
import {
  Wrench,
  GraduationCap,
  Calculator,
  FileSignature,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  QrCode,
  Send,
  Coffee,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  Phone,
  Settings,
  Lock,
  ArrowRight,
  Database,
  Building2,
  Car,
  Clock,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GrupoEloizioPortal: React.FC = () => {
  const { setActiveNavTab, setOpenPaymentModal } = useApp();

  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'camilla' | 'user'; text: string; time: string; link?: string }>>([
    {
      sender: 'camilla',
      text: 'Olá! ☕ Bom dia! Eu sou a Camilla Faria, Gerente Geral e Atendente Inteligente do Grupo Eloizio (28 anos, carioca de São Gonçalo - RJ). Como posso te ajudar hoje? Temos Cursos Online, Conserto de Máquinas de Costura, EloContábil (RH sem CRC), EloMak para Oficinas e EloSign!',
      time: 'Agora'
    }
  ]);

  const [copiedKey, setCopiedKey] = useState(false);
  const [pixModalData, setPixModalData] = useState<{ id: string; qr: string; value: number } | null>(null);

  const handleSendToCamilla = async (textToSend?: string) => {
    const text = textToSend || chatMessage;
    if (!text.trim()) return;

    const userEntry = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userEntry]);
    if (!textToSend) setChatMessage('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/camilla/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp: '21996134073',
          mensagem: text,
          canal: 'portal_react'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'camilla',
            text: data.resposta || 'Com certeza! Estou à disposição para organizar tudo.',
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            link: data.link_pagamento
          }
        ]);
      } else {
        throw new Error('Falha na resposta');
      }
    } catch {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'camilla',
          text: 'Entendido perfeitamente! ☕ Se preferir, você também pode falar comigo diretamente no meu WhatsApp oficial (21) 99613-4073 ou pelo Mercado Pago.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleQuickPix = async (project: string, val: number) => {
    try {
      const res = await fetch('/api/checkout/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projeto: project,
          valor: val,
          descricao: `Adesão ${project.toUpperCase()} • Grupo Eloizio`,
          referencia: `${project}_portal_${Date.now()}`
        })
      });
      const data = await res.json();
      if (data && data.pix_copia_cola) {
        setPixModalData({
          id: data.transacao_id,
          qr: data.pix_copia_cola,
          value: val
        });
      }
    } catch {
      setOpenPaymentModal(true);
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Banner Superior de Boas-Vindas */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-orange-950/40 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              <span>Portal Central do Grupo Eloizio • grupoeloizio.com.br</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Excelência em <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Educação, Mecânica & Tecnologia</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Atuação integrada com sede em <strong>São Gonçalo - RJ</strong> e atendimento em todo o Brasil. Cursos Livres 100% Online, Oficina Especializada em Máquinas de Costura, EloContábil sem CRC, EloMak ERP e Assinaturas EloSign com recebimentos exclusivos via <strong>Mercado Pago</strong>.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => handleSendToCamilla('Olá Camilla! Quero conhecer as soluções do Grupo Eloizio')}
                className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-orange-600/20"
              >
                <Coffee className="w-4 h-4" /> Atendimento com Camilla Faria
              </button>
              <a
                href="https://wa.me/5521996134073"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-xs transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" /> WhatsApp Oficial (21) 99613-4073
              </a>
            </div>
          </div>
        </div>

        {/* Grade de Atalhos dos Projetos Integrados */}
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Nossos Projetos & Sistemas Integrados
              </h2>
              <p className="text-xs text-zinc-400">
                Acesse com um clique ou utilize no seu navegador com subdomínios dedicados
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-medium">
              ✓ Webhook Central & Mercado Pago Conectados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* EloMak */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                    elomak.grupoeloizio.com.br
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">EloMak • ERP Oficina Mecânica</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sistema sem senha com acesso WhatsApp 100% seguro. Triagem de placas via regex, abertura de OS em pré-atendimento, estoque e financeiro com Mercado Pago.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveNavTab('showcase')}
                  className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                >
                  Abrir no Sistema <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="https://elomak.grupoeloizio.com.br"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Abrir subdomínio oficial"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* EloContabil */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    elocontabil.grupoeloizio.com.br
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">EloContábil • Apoio sem CRC</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Apoio administrativo e RH limpo. Controle de ponto, vencimento de ASO e EPI, cofre de documentos com alerta de alvarás e envio organizado para o contador.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveNavTab('elocontabil')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  Acessar EloContábil <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="https://elocontabil.grupoeloizio.com.br"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Abrir subdomínio oficial"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* EloSign */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileSignature className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    elosign.grupoeloizio.com.br
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">EloSign • Assinatura Eletrônica</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Assinatura avançada com validade jurídica (Lei 14.063/2020), carimbo de tempo pericial, envio de link pelo WhatsApp e validador público por SHA-256.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveNavTab('elosign')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  Acessar EloSign <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="https://elosign.grupoeloizio.com.br"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  title="Abrir subdomínio oficial"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Cursos Livres 100% Online */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    Lei 9.394/96 Art. 42
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Cursos Livres Profissionalizantes</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Educação 100% online com alta vendabilidade. Manuais de bancada, apostilas de exercícios, vídeos práticos e certificação reconhecida para transformar sonhos em renda.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveNavTab('showcase')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                >
                  Ver Catálogo <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleQuickPix('cursos', 147.00)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Matrícula R$ 147
                </button>
              </div>
            </div>

            {/* Máquinas de Costura & Oficina (São Gonçalo-RJ) */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Settings className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    São Gonçalo - RJ
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Oficina & Máquinas de Costura</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Compra, venda, conserto e reforma de máquinas industriais e domésticas (novas e antigas). Peças originais, regulagem de laçada e suporte direto do CEO Eloizio.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => handleSendToCamilla('Preciso de conserto ou compra de máquina de costura em São Gonçalo')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  Solicitar Revisão <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-zinc-500">Bancada Especializada</span>
              </div>
            </div>

            {/* Hub Central de Webhooks */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 transition flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    webhook.grupoeloizio.com.br
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Hub de Webhooks & Pagamentos</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Roteador central para Evolution API, notificações IPN Mercado Pago e banco unificado. Encaminha com cabeçalho seguro e resposta de alta performance.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between">
                <a
                  href="https://webhook.grupoeloizio.com.br/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                >
                  Abrir Dashboard do Hub <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <span className="text-[10px] text-zinc-500 font-mono">Status 200 OK</span>
              </div>
            </div>

          </div>
        </div>

        {/* Central de Atendimento Camilla Faria Integrada */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-2xl text-orange-400">
                ☕
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Camilla Faria <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h3>
                <p className="text-xs text-zinc-400">Gerente Geral • (21) 99613-4073</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Camilla atende com gentileza e maestria técnica. Resolve suas dúvidas nos 3 pilares, emite ordens de serviço, gera Pix no Mercado Pago e organiza o caos.
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Atalhos Rápidos:
              </span>
              <div className="flex flex-col gap-1.5 text-xs">
                <button
                  onClick={() => handleSendToCamilla('Gostaria de matricular em um curso online com apostila e manual')}
                  className="text-left px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition"
                >
                  🎓 Matrícula em Curso Online
                </button>
                <button
                  onClick={() => handleSendToCamilla('Tenho uma máquina de costura quebrada em São Gonçalo')}
                  className="text-left px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition"
                >
                  🪡 Conserto de Máquina de Costura
                </button>
                <button
                  onClick={() => handleSendToCamilla('Como acesso o EloContábil para controlar ponto e cofre?')}
                  className="text-left px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition"
                >
                  📊 Acessar EloContábil (RH sem CRC)
                </button>
                <button
                  onClick={() => handleSendToCamilla('Quero gerar um PIX no Mercado Pago')}
                  className="text-left px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition"
                >
                  💳 Pagamento via Mercado Pago
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500">
              *Contato direto com o CEO Eloizio: (21) 987648727 (somente em último caso).
            </div>
          </div>

          {/* Janela de Chat da Camilla */}
          <div className="lg:col-span-2 flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden min-h-[380px]">
            <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
              <span className="font-semibold flex items-center gap-1.5 text-white">
                <MessageSquare className="w-4 h-4 text-orange-500" /> Chat com a Camilla Faria
              </span>
              <span className="text-[11px] text-zinc-500">Tempo real • Hub Central</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs max-h-[320px]">
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {item.sender === 'camilla' && (
                    <div className="w-6 h-6 rounded-lg bg-orange-600/30 flex items-center justify-center text-xs text-orange-400 shrink-0">
                      ☕
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      item.sender === 'user'
                        ? 'bg-orange-600 text-white rounded-br-xs'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{item.text}</p>
                    {item.link && (
                      <div className="mt-2 pt-2 border-t border-zinc-800">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Pagar no Mercado Pago
                        </a>
                      </div>
                    )}
                    <span className="block text-[10px] opacity-60 mt-1 text-right">{item.time}</span>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="w-6 h-6 rounded-lg bg-orange-600/30 flex items-center justify-center text-xs text-orange-400 shrink-0">
                    ☕
                  </div>
                  <span className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                    Camilla está digitando...
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendToCamilla();
              }}
              className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2"
            >
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Fale com a Camilla (cursos, máquinas, contabilidade, OS)..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Modal PIX Instantâneo do Mercado Pago */}
        {pixModalData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" /> PIX Mercado Pago Gerado
                </h3>
                <button
                  onClick={() => setPixModalData(null)}
                  className="text-zinc-400 hover:text-white text-xs"
                >
                  ✕ Fechar
                </button>
              </div>

              <div className="text-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400">Valor da Cobrança</span>
                <div className="text-2xl font-black text-emerald-400">
                  R$ {pixModalData.value.toFixed(2)}
                </div>
                <p className="text-[11px] text-zinc-500">Liberação e baixa imediata no sistema</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Código PIX Copia e Cola:</label>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] font-mono text-zinc-300 break-all max-h-24 overflow-y-auto">
                  {pixModalData.qr}
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(pixModalData.qr);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedKey ? 'Chave Copiada!' : 'Copiar Chave PIX'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
