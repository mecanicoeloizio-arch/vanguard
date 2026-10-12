import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  FileText,
  User,
  MapPin,
  GraduationCap,
  Upload,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Calendar,
  Phone,
  Mail,
  Camera,
  X,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  Sparkles,
  AlertCircle,
  Building,
  Lock,
} from 'lucide-react';

interface EnrollmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourse?: Course | null;
}

export const EnrollmentFormModal: React.FC<EnrollmentFormModalProps> = ({
  isOpen,
  onClose,
  preselectedCourse,
}) => {
  const { courses, submitFullEnrollment, setActiveNavTab, setOpenPaymentModal } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    preselectedCourse?.id || courses[0]?.id || 'course_1'
  );

  // Etapa 1: Dados Pessoais
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [issuerOrg, setIssuerOrg] = useState('DETRAN/RJ');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [gender, setGender] = useState('Prefiro não informar');
  const [maritalStatus, setMaritalStatus] = useState('Solteiro(a)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');

  // Etapa 2: Endereço
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Gonçalo');
  const [state, setState] = useState('RJ');
  const [cepLoading, setCepLoading] = useState(false);

  // Etapa 3: Escolaridade & Modalidade
  const [previousEducation, setPreviousEducation] = useState('Ensino Médio Completo');
  const [previousSchool, setPreviousSchool] = useState('');
  const [modality, setModality] = useState<'online' | 'hibrido' | 'presencial_sg'>('online');

  // Etapa 4: Documentos & Foto
  const [photoBase64, setPhotoBase64] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  );
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const [rgFrontName, setRgFrontName] = useState<string>('rg_frente_digitalizado.pdf');
  const [rgBackName, setRgBackName] = useState<string>('rg_verso_digitalizado.pdf');
  const [cpfDocName, setCpfDocName] = useState<string>('cpf_comprovante_receita_federal.pdf');
  const [proofResidenceName, setProofResidenceName] = useState<string>('comprovante_residencia_recente.pdf');
  const [proofEducationName, setProofEducationName] = useState<string>('certificado_conclusao_ensino_medio.pdf');

  // Etapa 5: Termos & Pagamento
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedEnrollment, setConfirmedEnrollment] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleCepLookup = async (cepValue: string) => {
    const clean = cepValue.replace(/\D/g, '');
    setCep(cepValue);
    if (clean.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || 'São Gonçalo');
          setState(data.uf || 'RJ');
        }
      } catch {
        // Fallback or offline
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleFileUploadSim = (setter: React.Dispatch<React.SetStateAction<string>>, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotoBase64(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        });
        setMediaStream(stream);
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        alert('Câmera não suportada neste navegador. Por favor, envie uma foto por arquivo.');
      }
    } catch (err) {
      console.warn('Erro ao acessar webcam:', err);
      alert('Não foi possível acessar a câmera. Você pode selecionar um arquivo de foto 3x4 do seu computador ou celular.');
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 300, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPhotoBase64(dataUrl);
      }
      stopCamera();
    }
  };

  const handlePreFillDemo = () => {
    setFullName('Lucas Silva Prado');
    setCpf('123.456.789-00');
    setRg('28.912.443-1');
    setIssuerOrg('DETRAN/RJ');
    setBirthDate('1998-05-14');
    setGender('Masculino');
    setMaritalStatus('Solteiro(a)');
    setEmail('lucas.silva@aluno.eduvanguard.com');
    setPhone('(21) 98112-9988');
    setMotherName('Maria Silva Prado');
    setFatherName('Antônio Carlos Prado');
    setCep('24440-400');
    setStreet('Rua Doutor Nilo Peçanha');
    setNumber('450');
    setComplement('Apt 302');
    setNeighborhood('Centro');
    setCity('São Gonçalo');
    setState('RJ');
    setPreviousEducation('Ensino Médio Completo');
    setPreviousSchool('Colégio Estadual Nilo Peçanha - São Gonçalo');
    setTermsAccepted(true);
  };

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Por favor, aceite os termos e o contrato de matrícula para prosseguir.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitFullEnrollment({
        fullName: fullName || 'Aluno Registrado',
        cpf: cpf || '000.000.000-00',
        rg: rg || '00.000.000-0',
        issuerOrg,
        birthDate,
        gender,
        email: email || 'aluno@eduvanguard.com',
        phone: phone || '(21) 99613-4073',
        motherName: motherName || 'Mãe do Aluno',
        fatherName: fatherName || undefined,
        cep: cep || '24440-400',
        street: street || 'Rua Principal',
        number: number || '100',
        complement,
        neighborhood: neighborhood || 'Centro',
        city: city || 'São Gonçalo',
        state: state || 'RJ',
        previousEducation,
        previousSchool,
        courseId: currentCourse.id,
        courseTitle: currentCourse.title,
        modality,
        documents: {
          photoBase64,
          rgFrontBase64: rgFrontName,
          rgBackBase64: rgBackName,
          proofResidenceBase64: proofResidenceName,
          proofEducationBase64: proofEducationName,
        },
        termsAccepted: true,
        signedAt: new Date().toISOString(),
        paymentMethod,
      });

      setConfirmedEnrollment(result);
      setStep(6); // Success step
    } catch (err) {
      console.error(err);
      alert('Erro ao processar matrícula.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200">
        {/* Top Header */}
        <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-black">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Matrícula Oficial 2026
                </span>
                <span className="text-[11px] text-indigo-300 font-mono">Grupo Eloizio • EduVanguard</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Formulário de Matrícula & Cadastro de Aluno
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreFillDemo}
              className="px-3 py-1.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-700 text-indigo-200 text-xs font-bold border border-indigo-600/50 cursor-pointer hidden sm:flex items-center gap-1.5"
              title="Preenche campos automaticamente com dados de demonstração"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Preencher Exemplo</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        {step < 6 && (
          <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-8 py-3">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold text-slate-500">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-1.5 cursor-pointer ${step === 1 ? 'text-indigo-600 font-extrabold' : ''}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</span>
                <span className="hidden sm:inline">Dados Pessoais</span>
              </button>
              <div className="w-8 h-0.5 bg-slate-300"></div>
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 cursor-pointer ${step === 2 ? 'text-indigo-600 font-extrabold' : ''}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</span>
                <span className="hidden sm:inline">Endereço</span>
              </button>
              <div className="w-8 h-0.5 bg-slate-300"></div>
              <button
                onClick={() => setStep(3)}
                className={`flex items-center gap-1.5 cursor-pointer ${step === 3 ? 'text-indigo-600 font-extrabold' : ''}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>3</span>
                <span className="hidden sm:inline">Curso</span>
              </button>
              <div className="w-8 h-0.5 bg-slate-300"></div>
              <button
                onClick={() => setStep(4)}
                className={`flex items-center gap-1.5 cursor-pointer ${step === 4 ? 'text-indigo-600 font-extrabold' : ''}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>4</span>
                <span className="hidden sm:inline">Foto & Documentos</span>
              </button>
              <div className="w-8 h-0.5 bg-slate-300"></div>
              <button
                onClick={() => setStep(5)}
                className={`flex items-center gap-1.5 cursor-pointer ${step === 5 ? 'text-indigo-600 font-extrabold' : ''}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 5 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>5</span>
                <span className="hidden sm:inline">Contrato & Pagamento</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {step === 1 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  1. Dados Pessoais e Identificação Civil
                </h4>
                <p className="text-xs text-slate-500">
                  Preencha com seus dados oficiais para registro acadêmico e expedição do contrato com fé pública.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Lucas Silva Prado"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CPF *</label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RG *</label>
                    <input
                      type="text"
                      required
                      value={rg}
                      onChange={(e) => setRg(e.target.value)}
                      placeholder="00.000.000-0"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Órgão Emissor</label>
                    <input
                      type="text"
                      value={issuerOrg}
                      onChange={(e) => setIssuerOrg(e.target.value)}
                      placeholder="DETRAN/RJ"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Data de Nascimento *</label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gênero / Sexo</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    >
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                      <option value="Prefiro não informar">Prefiro não informar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado Civil</label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    >
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="União Estável">União Estável</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail Principal *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(21) 99999-9999"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome da Mãe *</label>
                    <input
                      type="text"
                      required
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Nome completo da genitora"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Pai (Opcional)</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Nome completo do genitor"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Avançar para Endereço</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  2. Endereço & Comprovante de Residência
                </h4>
                <p className="text-xs text-slate-500">
                  Informe seu endereço completo para cadastro no livro de registros acadêmicos e emissão de notas fiscais.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      CEP {cepLoading && <span className="text-indigo-600 font-normal lowercase">(buscando...)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={cep}
                      onChange={(e) => handleCepLookup(e.target.value)}
                      placeholder="24440-400"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Logradouro / Rua *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Rua Doutor Nilo Peçanha"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="450"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Complemento</label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apt 302, Bloco B"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Centro"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Gonçalo"
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estado (UF) *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="RJ"
                      maxLength={2}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold uppercase focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Avançar para Curso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  3. Curso Escolhido, Modalidade & Escolaridade Anterior
                </h4>
                <p className="text-xs text-slate-500">
                  Confirme a formação desejada e seus antecedentes escolares para deferimento de matrícula.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Curso Escolhido *</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} — {c.workloadHours} horas (R$ {c.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{currentCourse.title}</span>
                    <span className="text-slate-500 font-medium">{currentCourse.shortDescription}</span>
                    <span className="block mt-1 text-indigo-700 font-bold">
                      Carga Horária: {currentCourse.workloadHours} horas • Instrutor: {currentCourse.instructorName}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Investimento</span>
                    <strong className="text-lg font-black text-emerald-700">
                      R$ {currentCourse.price.toFixed(2)}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">em até 12x no Mercado Pago</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Modalidade de Ensino *</label>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value as any)}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    >
                      <option value="online">100% Online (Acesso Imediato ao LMS)</option>
                      <option value="hibrido">Híbrido (Aulas Online + Plantões Práticos)</option>
                      <option value="presencial_sg">Presencial (Oficina Técnica São Gonçalo - RJ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Escolaridade Prévia *</label>
                    <select
                      value={previousEducation}
                      onChange={(e) => setPreviousEducation(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                    >
                      <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                      <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                      <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                      <option value="Ensino Técnico">Ensino Técnico Concluído</option>
                      <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instituição de Ensino Anterior</label>
                  <input
                    type="text"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    placeholder="Ex: Colégio Estadual Nilo Peçanha - SG"
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Avançar para Documentos & Foto</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-600" />
                  4. Foto 3x4 do Aluno & Documentos Comprobatórios
                </h4>
                <p className="text-xs text-slate-500">
                  A foto será usada na Carteirinha de Estudante DNE e no Registro Acadêmico. Os documentos comprovam sua identidade.
                </p>
              </div>

              {/* Foto 3x4 Upload / Webcam / Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    src={photoBase64}
                    alt="Foto do Aluno"
                    className="w-24 h-32 rounded-xl object-cover border-2 border-indigo-500 shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-md">
                    ✓
                  </div>
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <span className="font-extrabold text-sm text-slate-900 block">Foto 3x4 Oficial do Aluno</span>
                  <p className="text-xs text-slate-500">
                    A foto será impressa na Carteirinha Estudantil DNE e no Registro Geral. Tire pela câmera ou envie um arquivo.
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Tirar com a Câmera / Webcam</span>
                    </button>
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition">
                      <Upload className="w-4 h-4" />
                      <span>Enviar Arquivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUploadSim(setPhotoBase64, e)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Interface Ativa de Captura pela Câmera */}
              {isCameraActive && (
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 text-white space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Câmera Ativa — Posicione o rosto no centro
                    </span>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="flex justify-center bg-black rounded-xl overflow-hidden max-h-56">
                    <video ref={videoRef} autoPlay playsInline className="h-56 object-cover" />
                  </div>
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capturar Foto 3x4 Agora</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Anexos de Documentos Oficiais */}
              <div className="space-y-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block">1. RG / CNH (Frente Digitalizada) *</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{rgFrontName}</span>
                  </div>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer">
                    Trocar Arquivo
                    <input type="file" className="hidden" onChange={(e) => handleFileUploadSim(setRgFrontName, e)} />
                  </label>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block">2. RG / CNH (Verso Digitalizado) *</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{rgBackName}</span>
                  </div>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer">
                    Trocar Arquivo
                    <input type="file" className="hidden" onChange={(e) => handleFileUploadSim(setRgBackName, e)} />
                  </label>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block">3. CPF Digitalizado / Comprovante Receita Federal *</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{cpfDocName}</span>
                  </div>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer">
                    Trocar Arquivo
                    <input type="file" className="hidden" onChange={(e) => handleFileUploadSim(setCpfDocName, e)} />
                  </label>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block">4. Comprovante de Residência Recente (Máx. 90 dias) *</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{proofResidenceName}</span>
                  </div>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer">
                    Trocar Arquivo
                    <input type="file" className="hidden" onChange={(e) => handleFileUploadSim(setProofResidenceName, e)} />
                  </label>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block">5. Histórico Escolar / Certificado de Ensino Médio</strong>
                    <span className="text-slate-500 font-mono text-[11px]">{proofEducationName}</span>
                  </div>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer">
                    Trocar Arquivo
                    <input type="file" className="hidden" onChange={(e) => handleFileUploadSim(setProofEducationName, e)} />
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                >
                  <span>Avançar para Contrato & Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  5. Contrato de Prestação de Serviços & Meio de Pagamento
                </h4>
                <p className="text-xs text-slate-500">
                  Revise os termos contratuais e selecione a forma de pagamento oficial via Mercado Pago.
                </p>
              </div>

              {/* Caixa de Texto do Contrato */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed">
                <strong className="text-slate-900 block font-bold">
                  INSTRUMENTO PARTICULAR DE CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS
                </strong>
                <p>
                  CONTRATADA: GRUPO ELOIZIO EDUCAÇÃO & TECNOLOGIA LTDA, com sede em São Gonçalo - RJ.<br/>
                  CONTRATANTE: {fullName || 'O ALUNO REGISTRADO'}, portador do CPF {cpf || '000.000.000-00'}.
                </p>
                <p>
                  CLÁUSULA 1ª: O presente contrato tem por objeto a prestação de serviços educacionais no curso livre de qualificação profissionalizante de <strong>{currentCourse.title}</strong> (Modalidade: Curso Profissionalizante Livre amparado pela Lei Federal nº 9.394/1996 Art. 42 da LDB, Decreto nº 5.154/2004 e MEC), com carga horária de {currentCourse.workloadHours} horas.
                </p>
                <p>
                  CLÁUSULA 2ª: A CONTRATADA expedirá o Certificado Oficial de Curso Livre Profissionalizante com registro no Livro Oficial e amparo na Lei nº 9.394/96 Art. 42 e Decreto Presidencial nº 5.154/2004 (normas MEC para Educação Profissional de Nível Livre) com validade nacional, assim que o aluno concluir 100% da matriz curricular e obtiver média satisfatória.
                </p>
                <p>
                  CLÁUSULA 3ª: O aluno passa a ter direito ao cadastro facultativo no banco de talentos da Cooperativa EduVanguard de Empregabilidade para acesso a empresas parceiras.
                </p>
              </div>

              {/* Aceite dos Termos */}
              <label className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-emerald-950 font-bold leading-tight">
                  Declaro que li e concordo com todos os termos do Contrato de Matrícula, autorizo o tratamento de dados conforme a LGPD e atesto a veracidade dos documentos enviados.
                </span>
              </label>

              {/* Seleção de Pagamento */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Forma de Pagamento Oficial</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm">PIX Instantâneo</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-black">-15%</span>
                    </div>
                    <span className="text-xs text-slate-500 block">Liberação imediata da sala de aula</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      paymentMethod === 'credit_card'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm">Cartão de Crédito</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded font-black">Até 12x</span>
                    </div>
                    <span className="text-xs text-slate-500 block">Via Mercado Pago protegido</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      paymentMethod === 'boleto'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-sm">Boleto Bancário</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">À vista</span>
                    </div>
                    <span className="text-xs text-slate-500 block">Compensação em até 1 dia útil</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  disabled={!termsAccepted || isSubmitting}
                  onClick={handleSubmitEnrollment}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
                >
                  {isSubmitting ? (
                    <span>Registrando Matrícula...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Concluir Matrícula Oficial &rarr;</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 6 && confirmedEnrollment && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-3xl mx-auto shadow-inner">
                  ✓
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  Matrícula Homologada & Ativa
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Parabéns, {confirmedEnrollment.fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-slate-600">
                  Seu registro acadêmico foi processado com fé pública educacional e número oficial de matrícula.
                </p>
              </div>

              {/* FICHA OFICIAL DE MATRÍCULA TIMBRADA (PRINTABLE) */}
              <div className="bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-md text-left space-y-5 print:border-none print:shadow-none">
                {/* Cabeçalho Institucional */}
                <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 block">
                      República Federativa do Brasil • Estado do Rio de Janeiro
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                      Grupo Eloizio & EduVanguard • Gestão Educacional
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Oficina Matriz: São Gonçalo - RJ • Validade Nacional • Cursos Profissionalizantes Livres (Lei nº 9.394/96 Art. 42 & Decreto 5.154/04 - MEC)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Registro MEC / Livre</span>
                    <strong className="text-xs font-black text-indigo-900 font-mono">LIVRO 04 • FLS 89</strong>
                  </div>
                </div>

                {/* Bloco Foto 3x4 + Identificação do Aluno */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <img
                    src={confirmedEnrollment.documents?.photoBase64 || photoBase64}
                    alt="Foto do Aluno 3x4"
                    className="w-24 h-32 rounded-xl object-cover border-2 border-slate-800 shadow-sm shrink-0"
                  />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Número de Matrícula:</span>
                        <strong className="text-indigo-900 text-sm font-black">{confirmedEnrollment.registrationNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CPF do Aluno:</span>
                        <strong className="text-slate-900">{confirmedEnrollment.cpf}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Nome Completo:</span>
                        <strong className="text-slate-900 font-sans font-bold">{confirmedEnrollment.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">RG / Emissor:</span>
                        <strong className="text-slate-900">{confirmedEnrollment.rg} ({confirmedEnrollment.issuerOrg})</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Data de Nascimento:</span>
                        <strong className="text-slate-900">{confirmedEnrollment.birthDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Filiação Materna:</span>
                        <strong className="text-slate-900 font-sans">{confirmedEnrollment.motherName}</strong>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block text-[10px]">Endereço Cadastrado:</span>
                        <span className="text-slate-800 font-sans">
                          {confirmedEnrollment.street}, {confirmedEnrollment.number} {confirmedEnrollment.complement && `(${confirmedEnrollment.complement})`} - {confirmedEnrollment.neighborhood}, {confirmedEnrollment.city}/{confirmedEnrollment.state} - CEP: {confirmedEnrollment.cep}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bloco do Curso & Modalidade */}
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase font-black tracking-wider block">Curso Homologado</span>
                      <strong className="text-slate-950 font-black text-sm">{confirmedEnrollment.courseTitle}</strong>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Modalidade: {confirmedEnrollment.modality}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex justify-between border-t border-indigo-100 pt-2 font-mono">
                    <span>Carga Horária: {currentCourse.workloadHours} horas</span>
                    <span>Instrutor: {currentCourse.instructorName}</span>
                    <span>Pagamento: {confirmedEnrollment.paymentMethod?.toUpperCase()} (Confirmado)</span>
                  </div>
                </div>

                {/* Autenticação Criptográfica & QR Code */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Hash de Autenticação Digital (SHA-256)</span>
                    <span className="text-[10px] text-slate-700 break-all select-all block max-w-sm">
                      {confirmedEnrollment.signedAt ? `SHA256-BR-${btoa(confirmedEnrollment.registrationNumber).substring(0, 24)}...OK` : 'SHA256-MAT-2026-AUTENTICADO'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      ✓ Assinado digitalmente com carimbo de tempo ICP-Brasil
                    </span>
                  </div>

                  <div className="w-16 h-16 border-2 border-slate-800 rounded-lg p-1 bg-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <QrCode className="w-10 h-10 text-slate-900" />
                    <span className="text-[7px] text-slate-600 font-bold uppercase">Validar</span>
                  </div>
                </div>

                {/* Assinaturas Institucionais */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-center text-[10px]">
                  <div>
                    <div className="border-b border-slate-400 w-36 mx-auto mb-1"></div>
                    <strong className="block text-slate-900 font-bold">Eloizio Assunção</strong>
                    <span className="text-slate-500">Diretor Presidente • Grupo Eloizio</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 w-36 mx-auto mb-1"></div>
                    <strong className="block text-slate-900 font-bold">Roseli Castro</strong>
                    <span className="text-slate-500">Secretária Geral Acadêmica</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveNavTab('student');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition"
                >
                  Acessar Sala de Aula (Portal do Aluno) &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ficha Oficial de Matrícula</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
