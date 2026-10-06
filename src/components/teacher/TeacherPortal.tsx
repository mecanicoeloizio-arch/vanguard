import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule, Lesson, Exam, QuizQuestion, GradeItem } from '../../types';
import { UnauthorizedView } from '../auth/UnauthorizedView';
import {
  PlusCircle,
  Video,
  BookOpen,
  Award,
  Users,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  BarChart3,
  CheckCircle,
  Save,
  Trash2,
  Calendar,
  AlertTriangle,
  Upload,
} from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'teacher') {
    return <UnauthorizedView requiredRole="teacher" title="Portal do Professor" />;
  }

  return <TeacherPortalContent currentUser={currentUser} />;
};

const TeacherPortalContent: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const {
    courses,
    updateCourse,
    grades,
    updateGrade,
    exams,
    addExam,
    submissions,
    gradeSubmission,
    sendPushNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lessons' | 'grades' | 'exams' | 'analytics'>('lessons');

  // Teacher courses
  const teacherCourse = courses.find((c) => c.instructorId === currentUser.id) || courses[0];

  // New Lesson form state
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [newLessonDuration, setNewLessonDuration] = useState(45);
  const [newLessonTranscript, setNewLessonTranscript] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState(teacherCourse.syllabus[0]?.id || 'mod_1');

  // New Exam / Quiz builder state
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examType, setExamType] = useState<'quiz' | 'assignment'>('quiz');
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [examDueDate, setExamDueDate] = useState('2026-10-31');
  const [examPoints, setExamPoints] = useState(10);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_new_1',
      question: 'Qual é o objetivo principal de um Circuit Breaker em microsserviços?',
      options: [
        'Interromper chamadas a um serviço instável para evitar falhas em cascata.',
        'Aumentar o consumo de memória RAM do servidor.',
        'Remover o firewall da rede corporativa.',
        'Compilar código TypeScript para WebAssembly.',
      ],
      correctOptionIndex: 0,
      explanation: 'O Circuit Breaker protege o sistema contra indisponibilidade de serviços terceiros.',
    },
  ]);

  // Export Analytics to CSV/Excel
  const handleExportCSV = () => {
    const headers = ['Aluno', 'Disciplina', 'P1', 'P2', 'Trabalhos', 'Media_Final', 'Situacao'];
    const rows = grades.map((g) => [
      'Lucas Silva Prado',
      `"${g.subject}"`,
      g.p1.toFixed(1),
      g.p2.toFixed(1),
      g.assignment.toFixed(1),
      g.average.toFixed(1),
      g.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_desempenho_turma_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      title: newLessonTitle,
      description: newLessonDesc,
      durationMinutes: Number(newLessonDuration),
      videoUrl: newLessonVideo,
      transcript: newLessonTranscript,
      isCompleted: false,
    };

    const updatedSyllabus = teacherCourse.syllabus.map((mod) =>
      mod.id === selectedModuleId
        ? { ...mod, lessons: [...mod.lessons, newLesson] }
        : mod
    );

    updateCourse(teacherCourse.id, { syllabus: updatedSyllabus });

    sendPushNotification({
      title: 'Nova Aula Publicada!',
      message: `A professora publicou a aula "${newLessonTitle}" no curso ${teacherCourse.title}.`,
      targetRole: 'student',
      category: 'academic',
    });

    setShowAddLessonModal(false);
    setNewLessonTitle('');
    setNewLessonDesc('');
    setNewLessonTranscript('');
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    addExam({
      courseId: teacherCourse.id,
      title: examTitle,
      description: examDesc,
      type: examType,
      dueDate: examDueDate,
      durationMinutes: examType === 'quiz' ? 25 : 0,
      totalPoints: Number(examPoints),
      questions: examType === 'quiz' ? quizQuestions : undefined,
      instructions: examType === 'assignment' ? examDesc : undefined,
    });

    setShowAddExamModal(false);
    setExamTitle('');
    setExamDesc('');
  };

  // Performance calculations
  const classAverage = parseFloat((grades.reduce((acc, g) => acc + g.average, 0) / (grades.length || 1)).toFixed(1));
  const approvalRate = Math.round((grades.filter((g) => g.status === 'Aprovado').length / (grades.length || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Teacher Profile Header */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-400/50 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Corpo Docente Titular
              </span>
              <span className="font-mono text-xs text-slate-300">
                {currentUser.registrationNumber}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white mt-1">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              {currentUser.department} • {teacherCourse.title}
            </p>
          </div>
        </div>

        {/* Quick Teacher Metrics */}
        <div className="flex flex-wrap items-center justify-around sm:justify-start gap-3 sm:gap-6 bg-white/5 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 w-full md:w-auto">
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Alunos Ativos</span>
            <span className="text-base sm:text-xl font-black text-indigo-300">
              {teacherCourse.enrolledStudentsCount}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Média Turma</span>
            <span className="text-base sm:text-xl font-black text-emerald-400">
              {classAverage}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aprovação</span>
            <span className="text-base sm:text-xl font-black text-amber-400">
              {approvalRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'lessons', label: 'Gestão de Aulas & Conteúdo', icon: Video },
          { id: 'grades', label: 'Diário de Notas & Frequência', icon: FileSpreadsheet },
          { id: 'exams', label: 'Criar Provas & Quizzes', icon: BookOpen },
          { id: 'analytics', label: 'Relatórios de Desempenho em Tempo Real', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LESSONS & CONTENT MANAGEMENT */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Módulos e Aulas do Curso: {teacherCourse.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Publique novas aulas gravadas, vídeos no YouTube/Vimeo/MP4, textos explicativos e arquivos PDF.
              </p>
            </div>
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Publicar Nova Aula
            </button>
          </div>

          {/* Modules and Lessons list */}
          <div className="space-y-4">
            {teacherCourse.syllabus.map((mod) => (
              <div key={mod.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{mod.title}</h4>
                    <p className="text-xs text-slate-500">{mod.description}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {mod.lessons.length} aulas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mod.lessons.map((les) => (
                    <div
                      key={les.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <Video className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {les.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                          Duração: {les.durationMinutes} min • Status: Ativa
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                        Disponível
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GRADEBOOK & ATTENDANCE SPREADSHEET */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900">Diário Eletrônico de Notas</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Altere diretamente as notas de Provas (P1, P2) e Trabalhos. O cálculo de média e situação é instantâneo.
              </p>
            </div>
            <button
              onClick={() => alert('Alterações no diário de notas gravadas e sincronizadas com sucesso!')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Disciplina</th>
                  <th className="py-3 px-4 text-center">P1 (35%)</th>
                  <th className="py-3 px-4 text-center">P2 (45%)</th>
                  <th className="py-3 px-4 text-center">Trabalho (20%)</th>
                  <th className="py-3 px-4 text-center">Média Final</th>
                  <th className="py-3 px-4 text-center">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((grd) => (
                  <tr key={grd.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">Lucas Silva Prado</td>
                    <td className="py-3 px-4 text-slate-600">{grd.subject}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={grd.p1}
                        onChange={(e) => updateGrade(grd.id, { p1: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={grd.p2}
                        onChange={(e) => updateGrade(grd.id, { p2: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={grd.assignment}
                        onChange={(e) => updateGrade(grd.id, { assignment: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-black text-indigo-700 text-base">
                      {grd.average.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        grd.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {grd.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CREATE EXAMS & QUIZZES */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Gestão de Avaliações, Trabalhos e Quizzes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Crie avaliações objetivas com correção automática ou atribua tarefas práticas.
              </p>
            </div>
            <button
              onClick={() => setShowAddExamModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Criar Nova Avaliação / Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((ex) => (
              <div key={ex.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-700">
                    {ex.type}
                  </span>
                  <span className="text-xs text-slate-400">Prazo: {ex.dueDate}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{ex.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ex.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Valor: {ex.totalPoints} pontos</span>
                  <span className="text-indigo-600 font-bold">
                    {submissions.filter((s) => s.examId === ex.id).length} entregas recebidas
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Submissions received from students */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-base">
              Entregas Recebidas dos Alunos para Correção
            </h4>
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{sub.studentName}</span>
                  <span className="text-xs text-slate-500">
                    Entregue em: {new Date(sub.submittedAt).toLocaleString('pt-BR')} • {sub.attachedFileName || 'Quiz Online'}
                  </span>
                  {sub.teacherFeedback && (
                    <p className="text-xs text-indigo-700 mt-1 italic">
                      Feedback: "{sub.teacherFeedback}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-base text-slate-900">
                    Nota: {sub.score ?? '--'}/10
                  </span>
                  <button
                    onClick={() => {
                      const newScore = prompt('Digite a nota atribuída (0 a 10):', sub.score ? String(sub.score) : '9.0');
                      const feedback = prompt('Digite o feedback para o aluno:', 'Excelente desenvolvimento técnico!');
                      if (newScore) gradeSubmission(sub.id, parseFloat(newScore), feedback || '');
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                  >
                    Atribuir / Editar Nota
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME PERFORMANCE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Relatório Pedagógico & Desempenho dos Alunos
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Métricas atualizadas em tempo real com exportação direta para relatórios institucionais.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exportar para Excel / CSV
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Relatório em PDF
              </button>
            </div>
          </div>

          {/* Analytics Bars and Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Aproveitamento Médio por Disciplina
              </h4>
              <div className="space-y-3">
                {grades.map((g) => (
                  <div key={g.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate pr-2">{g.subject}</span>
                      <span className="font-mono font-bold text-indigo-700">{g.average.toFixed(1)} / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${g.average * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Distribuição de Desempenho Acadêmico
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-2xl font-black text-emerald-700">75%</span>
                  <span className="text-xs text-emerald-900 font-semibold block mt-1">Aprovados Direto</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-2xl font-black text-amber-700">25%</span>
                  <span className="text-xs text-amber-900 font-semibold block mt-1">Em Recuperação</span>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-2xl font-black text-blue-700">92%</span>
                  <span className="text-xs text-blue-900 font-semibold block mt-1">Engajamento em Vídeos</span>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <span className="text-2xl font-black text-purple-700">95%</span>
                  <span className="text-xs text-purple-900 font-semibold block mt-1">Presença Média</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal to Add Lesson */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateLesson} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="font-black text-lg text-slate-900">Publicar Nova Aula no Curso</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Aula</label>
              <input
                type="text"
                required
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="Ex: 4. Implementando Padrão CQRS e Event Sourcing"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição & Ementa</label>
              <textarea
                rows={2}
                value={newLessonDesc}
                onChange={(e) => setNewLessonDesc(e.target.value)}
                placeholder="Resumo dos tópicos abordados nesta aula..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duração (Minutos)</label>
                <input
                  type="number"
                  value={newLessonDuration}
                  onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Módulo Alvo</label>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-bold"
                >
                  {teacherCourse.syllabus.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL do Vídeo (MP4, YouTube, Vimeo)</label>
              <input
                type="url"
                required
                value={newLessonVideo}
                onChange={(e) => setNewLessonVideo(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Texto Explicativo & Transcrição</label>
              <textarea
                rows={3}
                value={newLessonTranscript}
                onChange={(e) => setNewLessonTranscript(e.target.value)}
                placeholder="Insira as explicações detalhadas ou transcrição da aula..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Publicar Aula
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal to Add Exam */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateExam} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg text-slate-900">Criar Nova Prova ou Trabalho</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Avaliação</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExamType('quiz')}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    examType === 'quiz' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  Quiz Objetivo (Correção Automática)
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('assignment')}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    examType === 'assignment' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200'
                  }`}
                >
                  Trabalho Prático (Com Envio de Arquivo)
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Avaliação</label>
              <input
                type="text"
                required
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="Ex: Prova Parcial P2 - Arquitetura Cloud & Resiliência"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição / Instruções</label>
              <textarea
                rows={3}
                value={examDesc}
                onChange={(e) => setNewLessonDesc(e.target.value)}
                placeholder="Instruções para os alunos realizarem a prova..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prazo de Entrega</label>
                <input
                  type="date"
                  value={examDueDate}
                  onChange={(e) => setExamDueDate(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pontuação Total</label>
                <input
                  type="number"
                  value={examPoints}
                  onChange={(e) => setExamPoints(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddExamModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Salvar Avaliação
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
