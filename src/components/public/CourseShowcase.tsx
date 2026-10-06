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
} from 'lucide-react';

export const CourseShowcase: React.FC = () => {
  const {
    courses,
    setSelectedCourseForDetails,
    setOpenPaymentModal,
    setActiveNavTab,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);

  const categories = ['Todos', 'Tecnologia', 'Negócios', 'Design', 'Saúde', 'Educação'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todos' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEnrollClick = (course: Course) => {
    setSelectedCourseForDetails(course);
    setOpenPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Showcase Banner */}
      <section className="relative overflow-hidden bg-linear-to-b from-indigo-950 via-slate-900 to-indigo-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cursos 100% Online • Reconhecidos & Certificados
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Eleve sua carreira com <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">educação superior de ponta</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Plataforma acadêmica completa com aulas interativas, emissão imediata de carteirinha estudantil oficial, boletim em tempo real e pagamentos facilitados via Mercado Pago.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-indigo-800/40 text-left">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-2xl font-black text-amber-400 block">+15.000</span>
              <span className="text-xs text-slate-300">Alunos formados</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <span className="text-2xl font-black text-blue-400 block">100% Online</span>
              <span className="text-xs text-slate-300">Acesso 24/7 web & mobile</span>
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

      {/* Main Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
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

          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
            <span>
              Exibindo <strong className="text-slate-800">{filteredCourses.length}</strong> cursos disponíveis para matrícula imediata
            </span>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveNavTab('admin')}
                className="text-indigo-600 font-bold hover:underline"
              >
                + Gerenciar / Inserir Cursos na Administração
              </button>
            )}
          </div>
        </div>

        {/* Sofia Virtual Assistant Lead & Sales Callout */}
        <div className="mb-10 bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-400 to-indigo-300 p-0.5 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                  alt="Sofia Especialista Virtual"
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-slate-950">
                  Gerente Geral & Atendente 24/7
                </span>
                <span className="text-xs text-indigo-300 font-medium">Camilla Faria • Grupo Eloizio</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Dúvidas sobre os Cursos, Máquinas ou Assessoria Contábil?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Converse com a Camilla Faria, simule seu parcelamento em até 12x no Mercado Pago ou receba proposta exclusiva no seu WhatsApp com o cupom <strong>CAMILLA15</strong> (-15% OFF).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://wa.me/5521996134073?text=Ol%C3%A1%20Camilla%20Faria!%20Estou%20no%20portal%20do%20Grupo%20Eloizio%20e%20gostaria%20de%20atendimento%20com%20o%20cupom%20CAMILLA15."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>📲 Falar no WhatsApp Oficial</span>
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
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase bg-white/90 backdrop-blur-xs text-indigo-800 shadow-xs">
                    {course.category}
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
                        Investimento 100% Online
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
    </div>
  );
};
