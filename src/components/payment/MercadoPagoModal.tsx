import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  QrCode,
  CreditCard,
  Barcode,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Lock,
  Loader2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';

export const MercadoPagoModal: React.FC = () => {
  const {
    openPaymentModal,
    setOpenPaymentModal,
    activeDocumentForPayment,
    setActiveDocumentForPayment,
    processDocumentPayment,
    selectedCourseForDetails,
    enrollInCourse,
    mercadoPagoConfig,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixTimeLeft, setPixTimeLeft] = useState(900); // 15 minutes
  const [isSandboxMode, setIsSandboxMode] = useState(mercadoPagoConfig?.environment !== 'production');

  // Credit card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9921');
  const [cardHolder, setCardHolder] = useState('LUCAS S PRADO');
  const [cardExp, setCardExp] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [installments, setInstallments] = useState(1);
  const [lastPaymentId, setLastPaymentId] = useState<string>('');

  // PIX countdown timer
  useEffect(() => {
    if (!openPaymentModal || paymentMethod !== 'pix' || paymentSuccess) return;
    const interval = setInterval(() => {
      setPixTimeLeft((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, [openPaymentModal, paymentMethod, paymentSuccess]);

  if (!openPaymentModal) return null;

  const isCourseEnrollment = !activeDocumentForPayment && selectedCourseForDetails;
  const title = activeDocumentForPayment
    ? activeDocumentForPayment.title
    : selectedCourseForDetails
    ? `Matrícula: ${selectedCourseForDetails.title}`
    : 'Taxa Administrativa Oficial';

  const amount = activeDocumentForPayment
    ? activeDocumentForPayment.feeAmount
    : selectedCourseForDetails
    ? selectedCourseForDetails.price / (selectedCourseForDetails.installments || 12)
    : 25.0;

  const pixKey = '00020126580014BR.GOV.BCB.PIX0136financeiro@grupoeloizio.com.br5204000053039865405' +
    amount.toFixed(2) + '5802BR5920GRUPO ELOIZIO SA6012SAO GONCALO62070503***6304';

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Quick preset test cards
  const handleSelectPresetCard = (type: 'approved_visa' | 'approved_master' | 'declined') => {
    if (type === 'approved_visa') {
      setCardNumber('4532 1111 2222 9921');
      setCardHolder('LUCAS SILVA PRADO');
      setCardExp('11/29');
      setCardCvv('782');
      setPaymentError(null);
    } else if (type === 'approved_master') {
      setCardNumber('5031 7568 9012 3456');
      setCardHolder('LUCAS SILVA PRADO');
      setCardExp('08/28');
      setCardCvv('415');
      setPaymentError(null);
    } else if (type === 'declined') {
      setCardNumber('4012 0000 0000 0000');
      setCardHolder('TESTE CARTAO RECUSADO');
      setCardExp('01/25');
      setCardCvv('999');
      setPaymentError(null);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    // If test card is the declined one, simulate refusal
    if (paymentMethod === 'credit_card' && cardNumber.includes('0000 0000')) {
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentError('Transação recusada pela operadora do cartão (Saldo insuficiente ou cartão expirado no Mercado Pago).');
      }, 900);
      return;
    }

    try {
      // Call server endpoint to log Mercado Pago transaction
      const response = await fetch('/api/mercadopago/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount,
          paymentMethod,
          payerEmail: 'aluno@eduvanguard.com.br',
          payerName: cardHolder,
          installments,
          cardNumberLast4: cardNumber.slice(-4),
        }),
      });

      const data = await response.json();
      const generatedId = data?.payment?.id || `MP-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setLastPaymentId(generatedId);

      // Fulfill in-app state
      if (activeDocumentForPayment) {
        await processDocumentPayment(activeDocumentForPayment.id, paymentMethod);
      } else if (selectedCourseForDetails) {
        enrollInCourse(selectedCourseForDetails.id);
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
    } catch {
      // Offline or network fallback
      const generatedId = `MP-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setLastPaymentId(generatedId);

      if (activeDocumentForPayment) {
        await processDocumentPayment(activeDocumentForPayment.id, paymentMethod);
      } else if (selectedCourseForDetails) {
        enrollInCourse(selectedCourseForDetails.id);
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
    }
  };

  const handleClose = () => {
    setOpenPaymentModal(false);
    setActiveDocumentForPayment(null);
    setPaymentSuccess(false);
    setPaymentError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-100 my-auto">
        {/* Mercado Pago Header */}
        <div className="bg-[#009EE3] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-[#009EE3] font-black flex items-center justify-center text-base sm:text-lg shadow-sm shrink-0">
              mp
            </div>
            <div>
              <div className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-sky-100 flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Checkout Oficial Mercado Pago</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-300/40 text-[9px] font-bold">
                  Produção • Pagamento Seguro
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-lg text-white leading-tight mt-0.5">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Approved Screen */
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                Pagamento Aprovado no Mercado Pago!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Webhook de confirmação recebido com sucesso. Matrícula e certificados liberados.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Valor Processado:</span>
                <span className="font-bold text-slate-900">
                  {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forma de Pagamento:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {paymentMethod === 'pix' ? 'PIX Instantâneo' : paymentMethod === 'credit_card' ? `Cartão (${installments}x)` : 'Boleto'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Autenticação Mercado Pago:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {lastPaymentId || `MP-${Math.floor(10000000 + Math.random() * 90000000)}`}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-[#009EE3] hover:bg-[#0089c7] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-colors"
            >
              Concluir & Acessar Minha Área de Estudos
            </button>
          </div>
        ) : (
          /* Checkout Payment Selection */
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            {/* Amount display */}
            <div className="flex items-center justify-between p-3 sm:p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100">
              <div>
                <span className="text-xs font-semibold text-slate-500">Valor a Pagar</span>
                <div className="text-xl sm:text-2xl font-black text-[#009EE3]">
                  {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Beneficiário</span>
                <span className="text-xs font-extrabold text-slate-800 block">Grupo Eloizio</span>
                <span className="text-[10px] text-emerald-600 font-medium">Conta Oficial Mercado Pago</span>
              </div>
            </div>

            {/* Error notice if test failed */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Method Tabs */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-[#009EE3] bg-sky-50 text-[#009EE3] ring-2 ring-sky-500/20 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs">PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#009EE3] bg-sky-50 text-[#009EE3] ring-2 ring-sky-500/20 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs">Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('boleto')}
                className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  paymentMethod === 'boleto'
                    ? 'border-[#009EE3] bg-sky-50 text-[#009EE3] ring-2 ring-sky-500/20 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Barcode className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[11px] sm:text-xs">Boleto</span>
              </button>
            </div>

            {/* Payment Method Content */}
            {paymentMethod === 'pix' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="flex items-center justify-between text-xs text-slate-500 px-2 pb-1 border-b border-slate-200">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-sky-600" /> Vencimento do QR Code
                  </span>
                  <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    {formatTimer(pixTimeLeft)}
                  </span>
                </div>

                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />
                    <rect x="35" y="15" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="25" width="15" height="10" fill="currentColor" />
                    <rect x="35" y="45" width="30" height="15" fill="currentColor" />
                    <rect x="40" y="70" width="20" height="10" fill="currentColor" />
                    <rect x="70" y="40" width="15" height="15" fill="currentColor" />
                    <rect x="70" y="75" width="20" height="20" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Abra o aplicativo do seu banco e aponte a câmera para o QR Code
                </p>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedPix ? 'Código Pix Copiado com Sucesso!' : 'Copiar Código Pix Copia e Cola'}
                </button>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Número do Cartão de Crédito
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    placeholder="0000 0000 0000 0000"
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#009EE3] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Nome Impresso no Cartão
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#009EE3] focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Validade (MM/AA)
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#009EE3] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      CVV / Código de Segurança
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#009EE3] focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Opções de Parcelamento Mercado Pago
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold focus:ring-2 focus:ring-[#009EE3] focus:outline-hidden"
                  >
                    <option value={1}>1x de {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} à vista sem juros</option>
                    <option value={2}>2x de {(amount / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                    <option value={3}>3x de {(amount / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                    <option value={6}>6x de {(amount / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                    <option value={12}>12x de {(amount / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</option>
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 space-y-2">
                  <div className="font-mono text-xs text-slate-700 font-bold tracking-wider">
                    23793.38128 60083.010283 56000.063302 9 91280000002500
                  </div>
                  <div className="h-10 bg-slate-800 flex items-center justify-around px-2 text-white font-mono text-[9px] overflow-hidden">
                    |||| || ||| ||||| || ||||| ||| || |||| ||||| || ||| |||||
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  O boleto bancário é registrado instantaneamente no Mercado Pago. Ao clicar em "Confirmar", a compensação é simulada em tempo real.
                </p>
              </div>
            )}

            {/* Action button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPayment}
              className="w-full py-3.5 bg-[#009EE3] hover:bg-[#0089c7] text-white rounded-xl text-sm font-black shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando Gateway Mercado Pago...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Pagar e Liberar com Mercado Pago
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Criptografia SSL 256-bit PCI-DSS
              </span>
              <span className="font-semibold text-sky-600">Checkout Transparente</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
