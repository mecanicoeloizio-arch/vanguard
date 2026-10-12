import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Sparkles,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Filter,
  Users,
  Video,
  FileCheck,
  FileText,
  Briefcase,
  Award,
  Laptop,
  Wrench,
  UserCheck,
  RefreshCw,
  FileSignature,
  QrCode,
  Phone,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import { CourseTextImportModal } from '../admin/CourseTextImportModal';

export const CourseShowcase: React.FC = () => {
  const {
    courses,
    setSelectedCourseForDetails,
    setOpenPaymentModal,
    setActiveNavTab,
    setShowEnrollmentModal,
    setSelectedCourseForEnrollment,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedModality, setSelectedModality] = useState<'all' | 'online' | 'hibrido'>('all');
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);
  const [showTextImportModal, setShowTextImportModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = ['Todos', 'Tecnologia', 'Engenharia', 'Negócios', 'Design', 'Saúde', 'Educação'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todos' || course.category === selectedCategory;

    const matchesModality =
      selectedModality === 'all' || (course.modality || 'online') === selectedModality;

    return matchesSearch && matchesCategory && matchesModality;
  });

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForEnrollment(course);
    setSelectedCourseForDetails(course);
    setShowEnrollmentModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden bg-linear-to-b from-indigo-950 via-slate-900 to-indigo-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cursos Profissionalizantes Livres • Somente Cursos Livres Conforme Legislação & MEC
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Eleve sua profissão com <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">cursos profissionalizantes livres de ponta</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Trabalhamos exclusivamente com <strong>cursos profissionalizantes livres</strong> (somente cursos livres de capacitação e qualificação profissional) em estrita conformidade com a <strong>Lei Federal nº 9.394/1996 (LDB - Art. 42)</strong>, <strong>Decreto Presidencial nº 5.154/2004</strong> e diretrizes do <strong>MEC</strong>. Plataforma com aulas 100% online e híbridas com oficinas práticas presenciais em São Gonçalo - RJ, carteirinha estudantil oficial DNE e certificação com validade em todo o Brasil.
          </p>

          {/* Action CTAs in Hero */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#catalogo-cursos"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Cursos (100% Online & Híbridos)</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSelectedCourseForEnrollment(courses[0]);
                setShowEnrollmentModal(true);
              }}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              <span>Matrícula Oficial Online (Com Documentos & Foto)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveNavTab('cooperative')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-slate-950" />
              <span>Cooperativa de Talentos & Vagas</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-indigo-800/40 text-left">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-2xl font-black text-amber-400 block">+15.000</span>
              <span className="text-xs text-slate-300">Alunos formados</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-2xl font-black text-blue-400 block">100% Online & Híbridos</span>
              <span className="text-xs text-slate-300">Teoria digital + prática RJ</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-2xl font-black text-emerald-400 block">MEC & DNE</span>
              <span className="text-xs text-slate-300">Certificados oficiais</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-2xl font-black text-indigo-300 block">Mercado Pago</span>
              <span className="text-xs text-slate-300">PIX & até 12x sem juros</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens Exclusivas de ser Aluno Vanguard & Atualizações Profissionais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-indigo-700 tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Por Que Ser Aluno Vanguard? • Diferenciais Oficiais
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Vantagens de Ser Aluno Vanguard & Atualizações Profissionais Continuadas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Formação profissionalizante livre 100% amparada pela <strong>Lei nº 9.394/96 Art. 42</strong> e <strong>MEC</strong>, unindo material didático completo (manuais, livros, apostilas e vídeos), credenciamento profissional, cooperativa com vagas e reciclagem tecnológica constante.
            </p>
          </div>

          {/* Destaque das Atualizações Profissionais Continuadas */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800/60">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                  Diferencial Vanguard
                </span>
                <span className="text-indigo-300 text-xs font-bold">Programa de Reciclagem & Atualização</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Atualizações Profissionais Periódicas: Nunca fique obsoleto no mercado!
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                A tecnologia não para! Alunos Vanguard recebem módulos de <strong>atualização profissional contínua</strong> sobre eletrônica de motores direct-drive touch 2026, painéis digitais de alta precisão, novos tecidos elásticos, e rotinas fiscais do MEI e Simples Nacional sem burocracia.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-2">
              <a
                href="#catalogo-cursos"
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-lg text-center"
              >
                Garantir Minha Vaga com 15% OFF &rarr;
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Card 1: 100% Online & Híbridos */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">1. Cursos 100% Online & Híbridos</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Estude de qualquer lugar do Brasil no seu ritmo, com opção de oficinas e bancadas práticas presenciais no Polo Técnico de São Gonçalo - RJ.
              </p>
            </div>

            {/* Card 2: Manuais Técnicos de Bancada */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">2. Manuais Técnicos Ilustrados Inclusos</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Diagramas explodidos de peças, folgas milimétricas de lançadeiras e gabaritos de bancada para consultar no dia a dia da oficina.
              </p>
            </div>

            {/* Card 3: Livros Digitais & Apostilas */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">3. E-books & Apostilas com Gabarito</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Material didático oficial em PDF para download, contendo exercícios práticos, questões comentadas e guias de gestão e precificação.
              </p>
            </div>

            {/* Card 4: Vídeos Práticos em HD */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">4. Vídeos Práticos em Alta Resolução</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Aulas práticas gravadas em bancada real com o CEO Eloizio Assunção, demonstrando consertos, regulagens e rotinas sem enrolação.
              </p>
            </div>

            {/* Card 5: Certificação Oficial MEC */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">5. Certificado Oficial com Hash SHA-256</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Emissão conforme a Lei nº 9.394/96 Art. 42 com QR Code de validação pública nacional e fé pública para concursos e contratações.
              </p>
            </div>

            {/* Card 6: Carteira DNE Oficial */}
            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-xs">
                <FileCheck className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">6. Carteira do Estudante DNE Oficial</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Carteirinha digital válida em todo o Brasil (Lei nº 12.933/2013) com QR Code validador para benefício de 50% de meia-entrada nacional.
              </p>
            </div>

            {/* Card 7: Cooperativa & Vagas */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">7. Cooperativa de Talentos & Vagas</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Mural exclusivo de vagas e encaminhamento direto para confecções e oficinas parceiras que contratam alunos concluintes.
              </p>
            </div>

            {/* Card 8: Atualizações Profissionais Gratuitas */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">8. Reciclagem Anual & Atualização</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Acesso aos novos módulos de atualização tecnológica e credencial técnica anual ativa sem precisar pagar por um curso novo.
              </p>
            </div>

            {/* Card 9: Checkout Mercado Pago */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-[#009EE3] text-white flex items-center justify-center font-bold shadow-xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">9. Pagamento em até 12x no Mercado Pago</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Recebimentos 100% seguros com certificação PCI-DSS: PIX com liberação instantânea e cartão de crédito em até 12x.
              </p>
            </div>

            {/* Card 10: Suporte Gerencial Camilla Faria */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2 hover:shadow-md transition">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">10. Suporte Camilla Faria & Diretoria</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Atendimento humanizado direto no WhatsApp oficial (21 99613-4073) e assessoria técnica do CEO Eloizio Assunção (21 98764-8727).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div id="catalogo-cursos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Search & Filter Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise por cursos, tecnologias, temas ou habilidades..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Linha de Filtros: Categorias e Modalidade */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Modalidades */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {[
                { id: 'all', label: 'Todos os Formatos' },
                { id: 'online', label: '💻 100% Online' },
                { id: 'hibrido', label: '🛠️ Híbridos (Prática Presencial RJ)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModality(m.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedModality === m.id
                      ? 'bg-white text-indigo-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 w-full lg:w-auto justify-between lg:justify-end">
              <span>
                Exibindo <strong className="text-slate-800">{filteredCourses.length}</strong> cursos disponíveis
              </span>
              {currentUser?.role === 'admin' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowTextImportModal(true)}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preencher Cursos via Texto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNavTab('admin')}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    + Painel de Gestão
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Camilla Faria Virtual Assistant & General Manager Callout */}
        <div className="mb-10 bg-linear-to-r from-slate-950 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-indigo-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-400 to-indigo-300 p-0.5 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
                  alt="Camilla Faria - Gerente Geral & Atendente Inteligente"
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" title="Online Agora"></span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                  Gerente Geral & Atendente Inteligente
                </span>
                <span className="text-xs text-indigo-300 font-medium">Camilla Faria • Grupo Eloizio</span>
                <span className="text-[10px] text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-md border border-purple-500/30">
                  ☕ Autonomia Total em Produção
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Dúvidas sobre Nossos Cursos Livres, Manuais ou Matrículas?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Olá! Aqui é a <strong>Camilla Faria</strong>. Eu cuido de toda a gestão de cursos livres profissionalizantes, manuais técnicos, livros digitais e apostilas do Grupo Eloizio. Todos os pagamentos são processados com segurança máxima via <strong>Mercado Pago</strong> (PIX ou até 12x)!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://wa.me/5521996134073?text=Ol%C3%A1%20Camilla!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20cursos%20livres%20e%20materiais%20do%20Grupo%20Eloizio."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>📲 Falar com a Camilla no WhatsApp (21 99613-4073)</span>
            </a>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase bg-white/90 backdrop-blur-xs text-indigo-800 shadow-xs">
                    {course.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase shadow-xs ${
                    course.modality === 'hibrido'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-emerald-600 text-white font-bold'
                  }`}>
                    {course.modality === 'hibrido' ? '🛠️ Híbrido' : '💻 100% Online'}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                    {course.level}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  {course.rating.toFixed(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>
                </div>

                {/* Formato de Ensino e Polo */}
                {course.modality === 'hibrido' ? (
                  <div className="flex items-center gap-1.5 p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-semibold">
                    <Wrench className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Teoria Online + Prática no {course.practicalLocation || 'Polo Técnico São Gonçalo - RJ'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-semibold">
                    <Laptop className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Curso 100% Online • Acesso 24/7 de Qualquer Lugar do Brasil</span>
                  </div>
                )}

                {/* Course Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>{course.workloadHours}h de carga horária</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{course.enrolledStudentsCount} matriculados</span>
                  </div>
                </div>

                {/* Estágio Opcional Destaque Curricular */}
                <div className="flex items-center gap-2 p-2 bg-amber-50/80 rounded-xl border border-amber-200/70 text-[11px] text-amber-950">
                  <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold leading-tight">
                    <strong className="font-extrabold text-amber-900">Estágio Opcional:</strong> +120h a +180h computadas no Certificado & Cooperativa
                  </span>
                </div>

                {/* Materiais Didáticos Inclusos & Autonomia Camilla */}
                {course.materials && course.materials.length > 0 ? (
                  <div className="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between text-[11px] text-indigo-950 font-medium">
                    <span className="flex items-center gap-1.5 font-bold">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      {course.materials.length} Materiais Inclusos
                    </span>
                    <span className="text-[10px] text-indigo-600 bg-white px-2 py-0.5 rounded-md font-extrabold shadow-2xs border border-indigo-200/50">
                      Manuais • Livros • Vídeos
                    </span>
                  </div>
                ) : (
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-[11px] text-slate-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      Apostilas & Vídeos Inclusos
                    </span>
                    <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded-md font-bold">
                      Download PDF
                    </span>
                  </div>
                )}

                {course.publishedBy && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-50 rounded-lg border border-purple-200/60 text-[10px] text-purple-900 font-bold">
                    <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                    <span className="truncate">Publicado por {course.publishedBy}</span>
                  </div>
                )}

                {/* Instructor */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {course.instructorName}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {course.instructorTitle}
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {course.modality === 'hibrido' ? 'Investimento (Teoria + Prática)' : 'Investimento 100% Online'}
                      </span>
                      <div className="text-xl font-black text-slate-900">
                        {course.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 block">
                        ou {course.installments || 12}x de {((course.price) / (course.installments || 12)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[10px] text-slate-400">no Mercado Pago</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedCourseModal(course)}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center cursor-pointer"
                    >
                      Ementa & Detalhes
                    </button>
                    <button
                      onClick={() => handleEnrollClick(course)}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Matricule-se
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO COMPARATIVA: 100% ONLINE VS HÍBRIDO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <div className="bg-linear-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 border border-indigo-900/60">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
              Guia de Formatos de Ensino
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              100% Online vs Híbrido: Escolha a Sua Modalidade Ideal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              O Grupo Eloizio combina a flexibilidade do EAD nacional com a robustez prática das oficinas presenciais em São Gonçalo - RJ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Card: 100% Online */}
            <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 hover:border-emerald-400/50 transition">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center text-2xl font-black">
                  <Laptop className="w-6 h-6" />
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black uppercase tracking-wider text-[10px] border border-emerald-400/30">
                  Acesso Nacional 24/7
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Cursos 100% Online (EAD)</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Ideal para quem precisa de flexibilidade total de horários e quer estudar de qualquer estado do Brasil, com suporte pedagógico contínuo.
                </p>
              </div>

              <ul className="space-y-2.5 text-slate-300 pt-2 border-t border-white/10">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Acesso 24 Horas por Dia:</strong> Estude pelo celular, tablet ou computador no seu próprio ritmo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Videoaulas em Alta Resolução:</strong> Aulas detalhadas passo a passo com materiais e apostilas para download.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Avaliações Automáticas:</strong> Provas e questionários de fixação com resultado e boletim imediato.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Certificado & DNE Nacional:</strong> Certificação oficial válida em todo o Brasil (MEC/LDB) e Carteirinha de Meia-Entrada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Estágio Opcional Remoto:</strong> Possibilidade de homologação de horas em projetos digitais e consultorias.</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModality('online');
                    document.getElementById('catalogo-cursos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition block text-center cursor-pointer"
                >
                  Ver Cursos 100% Online &rarr;
                </button>
              </div>
            </div>

            {/* Card: Híbrido */}
            <div className="bg-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 hover:border-amber-400/50 transition">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-2xl font-black">
                  <Wrench className="w-6 h-6" />
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black uppercase tracking-wider text-[10px] border border-amber-400/30">
                  Teoria EAD + Prática em São Gonçalo - RJ
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Formações Híbridas (Presencial + Online)</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Perfeito para mecânicos, costureiras e operadores que exigem treinamento em bancada com máquinas reais e orientação do mestre Eloizio Assunção.
                </p>
              </div>

              <ul className="space-y-2.5 text-slate-300 pt-2 border-t border-white/10">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Toda a Base Teórica Online:</strong> Assista aos conceitos e esquemas técnicos antes de ir para a bancada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Oficinas no Polo São Gonçalo - RJ:</strong> Aulas práticas na oficina equipada (Reta, Overloque, Galoneira e Direct-Drive).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Orientação Direta do CEO Eloizio:</strong> Especialista mecânico com 30+ anos de bancada e experiência industrial.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Bancada Prática com Ferramental Fornecido:</strong> Desmonte, monte, sincronize lançadeiras e resolva quebra de agulhas e falhas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Estágio Opcional Homologado:</strong> Encaminhamento direto para indústrias e confecções da região com termo oficial (+120h a +180h).</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedModality('hibrido');
                    document.getElementById('catalogo-cursos')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition block text-center cursor-pointer"
                >
                  Ver Cursos Híbridos &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO ESTÁGIO SUPERVISIONADO OPCIONAL (LEI Nº 11.788/2008) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-20">
        <div className="bg-linear-to-r from-amber-50 via-white to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wide">
                  ⚖️ Amparo Legal: Lei Federal nº 11.788/2008
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 font-bold text-xs">
                  Art. 42 da LDB nº 9.394/1996
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                Estágio Supervisionado Opcional com Horas Somadas ao Certificado Oficial
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                O estágio não é obrigatório para concluir o curso livre, mas os alunos do Grupo Eloizio que optam por realizá-lo recebem <strong>Termo de Compromisso Oficial (TCE)</strong>, acompanhamento de supervisor e somam de <strong>+120h a +180h práticas</strong> diretamente no verso do Certificado Oficial de Conclusão!
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => setActiveNavTab('cooperative')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-slate-950" />
                <span>Mural de Vagas & Cooperativa</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveNavTab('student')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Ver Termo de Estágio (PDF)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-200 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
              <strong className="text-slate-900 font-bold text-sm block">1. Validação Curricular</strong>
              <p className="text-slate-600 leading-relaxed">Horas de prática somadas à carga horária do certificado, valorizando seu currículo perante confecções e empresas.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
              <strong className="text-slate-900 font-bold text-sm block">2. Convênio com Oficinas RJ</strong>
              <p className="text-slate-600 leading-relaxed">Parcerias em São Gonçalo, Niterói, Itaboraí e Rio de Janeiro para alunos dos cursos mecânicos e industriais.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
              <strong className="text-slate-900 font-bold text-sm block">3. Termo Oficial Digital</strong>
              <p className="text-slate-600 leading-relaxed">Documento timbrado com código verificador e hash digital para assinatura da empresa concedente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO ATENDIMENTO EXECUTIVO COM CAMILLA FARIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
                alt="Camilla Faria"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-indigo-100 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Online Agora"></span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-900">
                  Gerente Geral & Atendente Executiva
                </span>
                <span className="text-xs text-slate-500 font-semibold">Grupo Eloizio</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Olá! Sou a Camilla Faria. Como posso ajudar você hoje?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Estou à disposição para tirar qualquer dúvida sobre matrículas online, envio de documentos para a DNE, aulas práticas na oficina de São Gonçalo - RJ e condições facilitadas no Mercado Pago!
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-700 pt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  WhatsApp: <strong>(21) 99613-4073</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">
                  Diretoria Geral (Eloizio): <strong>(21) 98764-8727</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="https://wa.me/5521996134073?text=Ol%C3%A1%20Camilla!%20Estou%20no%20portal%20do%20Grupo%20Eloizio%20e%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20cursos."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chamar Camilla no WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSelectedCourseForEnrollment(courses[0]);
                setShowEnrollmentModal(true);
              }}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition text-center cursor-pointer"
            >
              Iniciar Matrícula Online
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO DEPOIMENTOS REAIS DE ALUNOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-20">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-black uppercase text-indigo-700 tracking-wider">Histórias de Sucesso</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">O que Nossos Alunos Dizem</h2>
            <p className="text-xs text-slate-600">Alunos de São Gonçalo, Niterói, Rio de Janeiro e de todo o Brasil que transformaram suas carreiras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {/* Depoimento 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                    RV
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs font-bold">Renato Vieira</strong>
                    <span className="text-[10px] text-slate-400">São Gonçalo - RJ • Formação Híbrida</span>
                  </div>
                </div>
                <span className="text-amber-400 text-xs font-black">★★★★★</span>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "As aulas práticas com o mestre Eloizio na oficina em Alcântara abriram meus olhos. Aprendi a regular lançadeira e consertar direct-drive na prática. Hoje presto serviço para 4 confecções!"
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">Mecânica de Máquinas de Costura</span>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                    JM
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs font-bold">Juliana Magalhães</strong>
                    <span className="text-[10px] text-slate-400">Niterói - RJ • Curso 100% Online</span>
                  </div>
                </div>
                <span className="text-amber-400 text-xs font-black">★★★★★</span>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "O curso de MEI e Contabilidade é muito direto ao ponto! A emissão da DNE foi instantânea e usei para pagar meia no teatro no mesmo fim de semana. O suporte da Camilla foi impecável."
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">Contabilidade Prática MEI</span>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                    MP
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs font-bold">Marcos Paulo Ribeiro</strong>
                    <span className="text-[10px] text-slate-400">Campinas - SP • Curso 100% Online</span>
                  </div>
                </div>
                <span className="text-amber-400 text-xs font-black">★★★★★</span>
              </div>
              <p className="text-slate-600 leading-relaxed italic">
                "Fiz o curso de Arquitetura Cloud morando em São Paulo. O certificado tem chave SHA-256 e foi aceito de imediato na minha empresa como comprovação de horas complementares."
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 text-[10px] font-bold">Engenharia de Software & Cloud</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PERGUNTAS FREQUENTES (FAQ) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-black uppercase text-indigo-700 tracking-wider">Tire Suas Dúvidas</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Perguntas Frequentes</h2>
            <p className="text-xs text-slate-500">Clique nas perguntas para expandir as respostas detalhadas.</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                q: '1. A Carteirinha de Estudante (1ª via) e o Certificado Oficial são gratuitos?',
                a: 'Sim! A 1ª via da Carteirinha Estudantil Digital Oficial (Padrão DNE Nacional) é emitida 100% gratuitamente para todos os alunos matriculados ativos. O Certificado Oficial de Conclusão (1ª via) também é liberado gratuitamente para os alunos que estiverem com suas mensalidades em dia e quites!',
              },
              {
                q: '2. Como funciona a emissão de documentos escolares e 2ª via?',
                a: 'Os documentos escolares (como Histórico Escolar Oficial com notas, Declaração de Matrícula avulsa para estágio e Ementa Curricular) são liberados na Secretaria Virtual após a confirmação de pagamento dos valores definidos pela secretaria via Mercado Pago. A 2ª via de qualquer documento (carteirinha, certificado, histórico ou declaração) também é paga conforme tabela de taxas da secretaria acadêmica.',
              },
              {
                q: '3. O que é o Crachá Funcional da Cooperativa e como funciona a anuidade de renovação?',
                a: 'O Crachá Funcional da Cooperativa é o documento de identificação técnica dos profissionais cadastrados no banco de talentos. A taxa de anuidade para renovação (R$ 45,00/ano) é cobrada anualmente, mas NÃO É COBRADA se você for aluno concluinte de cursos do Grupo Eloizio — formandos e concluintes ganham isenção total e vitalícia de anuidade no crachá funcional!',
              },
              {
                q: '4. Como são os novos cursos de Cuidador de Idosos e Massoterapia de acordo com a Legislação do RJ?',
                a: 'O Curso Completo de Cuidador de Idosos e Dependentes segue rigorosamente a Lei Estadual RJ nº 8.528/2019, o Estatuto do Idoso (Lei Federal nº 10.741/2003) e CBO 5162-10, com teoria online e práticas/estágio conveniado no Polo São Gonçalo - RJ. O Curso Completo e Atualizações de Massoterapia e Terapias Manuais está em conformidade com a Lei Estadual RJ nº 7.859/2018 (Práticas Integrativas no RJ), Lei Federal nº 3.968/1961 e CBO 3221-20, com módulos de liberação miofascial, drenagem linfática e biossegurança.',
              },
              {
                q: '5. Como funcionam as aulas práticas dos cursos híbridos em São Gonçalo - RJ?',
                a: 'Nos cursos híbridos (como Mecânica de Máquinas de Costura, Eletrônica de Motores e Práticas em Saúde/Massoterapia), a teoria é estudada 100% online com videoaulas e apostilas. As oficinas práticas presenciais ocorrem no Polo Técnico de São Gonçalo - RJ com bancadas individuais, equipamentos profissionais reais e orientação direta de especialistas, com a liderança do CEO Eloizio Assunção.',
              },
              {
                q: '6. O estágio é obrigatório ou opcional? Como somam as horas no certificado?',
                a: 'O estágio é 100% opcional (em conformidade com a Lei Federal nº 11.788/2008). Quem opta por fazer estágio supervisionado recebe Termo de Compromisso Oficial emitido pela plataforma e, ao concluir as atividades na empresa parceira, homologa de +120h a +180h que são somadas diretamente à carga horária do Certificado Oficial!',
              },
              {
                q: '7. Quais são as formas de pagamento exclusivas no Mercado Pago?',
                a: 'Todos os pagamentos (matrículas, taxas escolares e compras de cursos) são processados exclusivamente via Mercado Pago: PIX instantâneo com liberação em segundos por QR Code, Cartão de Crédito em até 12x ou Boleto Bancário.',
              },
              {
                q: '8. Os cursos são reconhecidos? Qual a base legal junto ao MEC e à Legislação Brasileira?',
                a: 'Trabalhamos exclusivamente com Cursos Profissionalizantes Livres (somente cursos livres de formação continuada, qualificação e aperfeiçoamento profissional). Essa modalidade é expressamente amparada e regulamentada em todo o território nacional pela Lei Federal nº 9.394/1996 (LDB - Art. 42), Decreto Presidencial nº 5.154/2004 e diretrizes do Ministério da Educação (MEC) para a Educação Profissional de Nível Livre. Nossos certificados possuem fé pública e validade em todo o Brasil para fins curriculares, comprovação profissional, progressão funcional e concursos públicos.',
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm">{faq.q}</span>
                    <span className="text-indigo-600 font-black text-base shrink-0 ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-slate-600 border-t border-slate-100 leading-relaxed animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
              <img
                src={selectedCourseModal.thumbnail}
                alt={selectedCourseModal.title}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-indigo-500 text-white w-fit mb-2">
                  {selectedCourseModal.category} • {selectedCourseModal.level}
                </span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight">
                  {selectedCourseModal.title}
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Sobre o Curso
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedCourseModal.fullDescription}
                </p>
              </div>

              {/* Syllabus */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Estrutura Pedagógica & Módulos
                </h4>
                {selectedCourseModal.syllabus && selectedCourseModal.syllabus.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCourseModal.syllabus.map((mod, i) => (
                      <div key={mod.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">
                            {mod.title}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {mod.lessons.length} aulas
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{mod.description}</p>
                        <div className="mt-2.5 pl-2 border-l-2 border-indigo-300 space-y-1">
                          {mod.lessons.map((les) => (
                            <div key={les.id} className="text-xs text-slate-700 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-indigo-500" />
                                {les.title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {les.durationMinutes} min
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Módulos em atualização pela coordenação pedagógica.</p>
                )}
              </div>

              {/* Materiais Didáticos: Manuais, Livros, Apostilas e Vídeos Explicativos */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
                      Manuais Técnicos, Livros Digitais & Apostilas de Estudo
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] border border-emerald-300">
                    ✓ Inclusos no Curso Completo ou Venda Avulsa
                  </span>
                </div>

                {selectedCourseModal.materials && selectedCourseModal.materials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {selectedCourseModal.materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                              mat.type === 'manual'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : mat.type === 'livro'
                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}>
                              {mat.type === 'manual' ? '🛠️ Manual Técnico' : mat.type === 'livro' ? '📖 Livro Digital' : '📝 Apostila Oficial'}
                            </span>
                            {mat.pages && (
                              <span className="text-[10px] font-mono text-slate-500 font-bold">
                                {mat.pages} pág. • {mat.format || 'PDF'}
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-xs text-slate-900 leading-snug">
                            {mat.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-tight">
                            {mat.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-700 font-bold">
                            {mat.priceStandalone ? `Avulso: R$ ${mat.priceStandalone.toFixed(2)}` : 'Incluso'}
                          </span>
                          <a
                            href={selectedCourseModal.mercadoPagoPaymentLink || 'https://www.mercadopago.com.br'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-200 flex items-center gap-1 transition"
                          >
                            <CreditCard className="w-3 h-3 text-indigo-600" />
                            Comprar Avulso (MP)
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Kit Pedagógico Oficial Completo Grupo Eloizio Incluso:
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      <li><strong>Manual Técnico Oficial:</strong> Esquemas de montagem, códigos de erro e procedimentos passo a passo.</li>
                      <li><strong>Livro Digital (E-book):</strong> Fundamentos e visão de mercado para atuação profissional independente.</li>
                      <li><strong>Apostila com 100 Questões Práticas:</strong> Roteiros de treino, testes objetivos e gabarito comentado.</li>
                      <li><strong>Vídeos Explicativos em Alta Definição:</strong> Aulas práticas demonstrando bancada, ferramentas e diagnóstico.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* What is included */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium">Certificado Oficial MEC com QR Code</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium">Carteirinha Estudantil DNE Nacional</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium">Chat direto com professores e tutores</span>
                </div>
              </div>

              {/* Estágio Supervisionado Opcional Conveniado */}
              <div className="p-4 sm:p-5 bg-linear-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-300 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    <strong className="text-xs font-black text-amber-950 uppercase tracking-wide">
                      Estágio Supervisionado Opcional Conveniado (Lei nº 11.788/2008)
                    </strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black text-[10px]">
                    +120h a +180h no Certificado & Cooperativa
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Os alunos matriculados neste curso têm acesso ao portal de <strong>Estágios Opcionais da Cooperativa de Talentos do Grupo Eloizio</strong>. Empresas parceiras publicam vagas com bolsa-auxílio e mentoria. As horas práticas cumpridas são homologadas por termo oficial com hash digital e somadas à carga horária total do Certificado Oficial de Conclusão!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseModal(null);
                    setActiveNavTab('cooperative');
                  }}
                  className="text-xs font-black text-amber-950 hover:text-indigo-900 underline flex items-center gap-1 cursor-pointer pt-1"
                >
                  <span>Explorar Mural de Vagas & Estágios na Cooperativa de Talentos &rarr;</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center justify-between sm:block">
                <span className="text-xs text-slate-500 font-medium block">Investimento:</span>
                <span className="text-xl font-black text-slate-900">
                  {selectedCourseModal.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCourseModal(null)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    const c = selectedCourseModal;
                    setSelectedCourseModal(null);
                    handleEnrollClick(c);
                  }}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer text-center"
                >
                  Matricular Agora via Mercado Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Text Bulk Import Modal */}
      <CourseTextImportModal
        isOpen={showTextImportModal}
        onClose={() => setShowTextImportModal(false)}
      />
    </div>
  );
};
