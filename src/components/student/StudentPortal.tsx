import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, Exam, QuizQuestion, DocumentRequest } from '../../types';
import { DocumentViewerModal } from '../documents/DocumentTemplates';
import { UnauthorizedView } from '../auth/UnauthorizedView';
import {
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Calendar,
  FileText,
  CreditCard,
  QrCode,
  Download,
  AlertCircle,
  Send,
  Printer,
  Sparkles,
  FileCheck,
  Video,
  ChevronRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Upload,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'student') {
    return <UnauthorizedView requiredRole="student" title="Portal do Aluno" />;
  }

  return <StudentPortalContent currentUser={currentUser} />;
};

const StudentPortalContent: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const {
    courses,
    grades,
    attendance,
    markAttendance,
    exams,
    submissions,
    submitExam,
    documentRequests,
    requestDocument,
    setActiveDocumentForPayment,
    setOpenPaymentModal,
    schedule,
    toggleLessonCompleted,
    completeAllCourseLessons,
    issueOfficialCertificate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lessons' | 'grades' | 'attendance' | 'exams' | 'documents' | 'schedule'>('lessons');

  // Student's active enrolled course
  const studentCourse = courses.find((c) => c.id === (currentUser.courseId || 'course_1')) || courses[0];

  // Lessons Player state
  const allLessons: Lesson[] = studentCourse.syllabus.flatMap((m) => m.lessons);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(allLessons[0] || {
    id: 'les_default',
    title: 'Aula Inaugural',
    description: 'Boas-vindas ao semestre acadêmico.',
    durationMinutes: 30,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    transcript: 'Bem-vindo ao portal educacional.',
    isCompleted: false,
  });
  const [studentNotes, setStudentNotes] = useState<string>('Anotações importantes sobre a arquitetura de microsserviços e mensageria assíncrona.');
  const [videoSpeed, setVideoSpeed] = useState<number>(1);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Doubts forum state
  const [lessonDoubts, setLessonDoubts] = useState<Array<{ id: string; author: string; question: string; answer?: string; time: string }>>([
    {
      id: 'd1',
      author: 'Lucas Silva Prado',
      question: 'Professor, qual o melhor padrão para comunicação síncrona entre microsserviços?',
      answer: 'Olá Lucas! Para comunicação interna de alta performance, recomendamos gRPC com Protocol Buffers. Para APIs públicas, RESTful com JSON ou GraphQL.',
      time: 'Ontem às 16:30',
    },
  ]);
  const [newDoubtText, setNewDoubtText] = useState('');

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoubtText.trim()) return;

    const doubtId = `d_${Date.now()}`;
    const newEntry = {
      id: doubtId,
      author: currentUser.name,
      question: newDoubtText,
      time: 'Agora mesmo',
    };

    setLessonDoubts((prev) => [newEntry, ...prev]);
    setNewDoubtText('');

    // Simulate teacher / tutor reply after 1.2s
    setTimeout(() => {
      setLessonDoubts((prev) =>
        prev.map((d) =>
          d.id === doubtId
            ? {
                ...d,
                answer: 'Excelente pergunta! Essa questão foi revisada na apostila suplementar do Módulo 2. Lembre-se de validar os contratos de API com testes de integração.',
              }
            : d
        )
      );
    }, 1200);
  };

  const handleSpeedChange = (speed: number) => {
    setVideoSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Attendance check-in state
  const [checkedInToday, setCheckedInToday] = useState<boolean>(false);


  // Exam taker state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<{ score: number; total: number } | null>(null);
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentFile, setAssignmentFile] = useState<string | null>(null);

  // Document modal viewer
  const [viewingDocument, setViewingDocument] = useState<DocumentRequest | null>(null);

  // Document fee catalog
  const documentCatalog = [
    { type: 'carteirinha' as const, title: 'Carteirinha Estudantil Digital Oficial (Padrão DNE)', fee: 25.0, icon: QrCode, desc: 'Válida nacionalmente para meia-entrada e transporte com QR Code criptografado.' },
    { type: 'certificado' as const, title: 'Certificado de Conclusão com Chave ICP-Edu', fee: 45.0, icon: Award, desc: 'Certificado oficial com autenticação digital de conformidade MEC.' },
    { type: 'historico' as const, title: 'Histórico Escolar Oficial com Carimbo Digital', fee: 15.0, icon: FileText, desc: 'Relação completa de notas, frequências e ementas para pós-graduação e transferências.' },
    { type: 'declaracao' as const, title: 'Declaração de Matrícula para Estágio', fee: 10.0, icon: FileCheck, desc: 'Declaração com verificação de autenticidade para convênios e empresas.' },
  ];

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setQuizAnswers({});
    setQuizSubmittedResult(null);
    setAssignmentFile(null);
    setAssignmentText('');
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeExam || !activeExam.questions) return;

    let score = 0;
    activeExam.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOptionIndex) {
        score += activeExam.totalPoints / activeExam.questions!.length;
      }
    });

    const finalScore = parseFloat(score.toFixed(1));
    setQuizSubmittedResult({ score: finalScore, total: activeExam.totalPoints });

    submitExam({
      examId: activeExam.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      score: finalScore,
      status: 'graded',
      answers: Object.entries(quizAnswers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      })),
      teacherFeedback: finalScore >= 7.0 ? 'Parabéns! Excelente rendimento no quiz.' : 'Revise as anotações do módulo e refaça a leitura dos materiais.',
    });
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExam) return;

    submitExam({
      examId: activeExam.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: 'submitted',
      attachedFileName: assignmentFile || 'Projeto-Microsservicos-LucasSilva.pdf',
      teacherFeedback: 'Trabalho recebido. Aguardando avaliação e lançamento de nota pelo docente.',
    });

    alert('Trabalho enviado com sucesso para a Profa. Dra. Mariana!');
    setActiveExam(null);
  };

  const handleRequestDocument = (type: any, title: string, fee: number) => {
    const req = requestDocument(type, title, fee);
    setActiveDocumentForPayment(req);
    setOpenPaymentModal(true);
  };

  // Overall attendance calculation
  const totalAttendanceDays = attendance.filter((a) => a.studentId === currentUser.id).length;
  const presentDays = attendance.filter((a) => a.studentId === currentUser.id && a.status === 'present').length;
  const attendancePercentage = totalAttendanceDays > 0 ? Math.round((presentDays / totalAttendanceDays) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Student Welcome & Identity Card */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-400/50 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Aluno Regular
                </span>
                <span className="font-mono text-xs text-indigo-300">
                  {currentUser.registrationNumber}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white mt-1">
                {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                {studentCourse.title}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-around sm:justify-start gap-3 sm:gap-6 bg-white/5 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 w-full md:w-auto">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Frequência</span>
              <span className={`text-base sm:text-xl font-black ${attendancePercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {attendancePercentage}%
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Média Geral</span>
              <span className="text-base sm:text-xl font-black text-indigo-300">
                8.9
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aulas</span>
              <span className="text-base sm:text-xl font-black text-amber-400">
                {allLessons.filter((l) => l.isCompleted).length} / {allLessons.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'lessons', label: 'Minhas Aulas & Vídeos', icon: Video },
          { id: 'grades', label: 'Boletim & Notas', icon: Award },
          { id: 'attendance', label: 'Presença em Tempo Real', icon: CheckCircle },
          { id: 'exams', label: 'Provas, Quizzes & Trabalhos', icon: BookOpen },
          { id: 'documents', label: 'Secretaria & Documentos (Mercado Pago)', icon: FileText },
          { id: 'schedule', label: 'Grade Horária & Mudanças', icon: Calendar },
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

      {/* TAB 1: LESSONS & VIDEO PLAYER */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Official Certificate Unlock Banner */}
          {allLessons.filter((l) => l.isCompleted).length === allLessons.length ? (
            <div className="bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-amber-300 animate-in zoom-in-95">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shadow-md shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Requisitos 100% Cumpridos
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 mt-1">
                    Parabéns! Você concluiu 100% do curso {studentCourse.title}
                  </h3>
                  <p className="text-xs text-slate-900 font-medium">
                    Seu Certificado Oficial com Selo MEC, Registro Acadêmico e Chave ICP-Edu está liberado!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={async () => {
                    const cert = await issueOfficialCertificate(currentUser.id, studentCourse.id);
                    setViewingDocument(cert);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black rounded-xl text-xs sm:text-sm shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  Emitir Meu Certificado Digital Oficial (Frente & Verso)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-900">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Progresso: <strong>{allLessons.filter((l) => l.isCompleted).length} de {allLessons.length} aulas concluídas</strong> ({Math.round((allLessons.filter((l) => l.isCompleted).length / (allLessons.length || 1)) * 100)}%). Conclua todas as aulas para liberar o Certificado Oficial.
                </span>
              </div>
              <button
                type="button"
                onClick={() => completeAllCourseLessons(studentCourse.id)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Simular 100% das Aulas Concluídas
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video & Transcript */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group">
                <video
                  ref={videoRef}
                  key={selectedLesson.id}
                  src={selectedLesson.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
                />
              </div>

              {/* Video Speed Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-indigo-400" /> Velocidade de Reprodução:
                </span>
                <div className="flex items-center gap-1">
                  {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-0.5 rounded-md font-mono text-[11px] transition-all cursor-pointer ${
                        videoSpeed === spd
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedLesson.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleLessonCompleted(studentCourse.id, selectedLesson.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                      selectedLesson.isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {selectedLesson.isCompleted ? 'Aula Concluída' : 'Marcar como Concluída'}
                  </button>
                </div>

                {/* Downloadable Materials */}
                <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-100 space-y-2">
                  <span className="text-xs font-bold text-sky-950 uppercase flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-sky-600" /> Materiais Complementares & Apostila Oficial
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { title: 'Apostila Teórica Completa (.PDF)', size: '4.8 MB' },
                      { title: 'Slides e Diagramas C4 Model (.PDF)', size: '2.1 MB' },
                      { title: 'Exercícios Práticos com Gabarito (.ZIP)', size: '1.2 MB' },
                    ].map((mat, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => alert(`Iniciando download de: "${mat.title}" (${mat.size}). Documento acadêmico com licença de estudo.`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-900 rounded-lg text-xs font-semibold border border-sky-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-sky-600" />
                        {mat.title} ({mat.size})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Study Notes & Transcript */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" /> Transcrição da Aula
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed max-h-32 overflow-y-auto">
                      {selectedLesson.transcript || 'Transcrição em áudio gerada automaticamente com auxílio de IA educacional.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Caderno de Anotações do Aluno
                    </span>
                    <textarea
                      rows={3}
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      placeholder="Faça anotações desta aula para estudar para a prova..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Doubts Forum Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                      💬 Plantão de Dúvidas da Aula (Interação com o Tutor)
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {lessonDoubts.length} dúvidas registradas
                    </span>
                  </div>

                  <form onSubmit={handleSendDoubt} className="flex gap-2">
                    <input
                      type="text"
                      value={newDoubtText}
                      onChange={(e) => setNewDoubtText(e.target.value)}
                      placeholder="Ficou com alguma dúvida sobre esta aula? Pergunte ao professor..."
                      className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Enviar Dúvida
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {lessonDoubts.map((d) => (
                      <div key={d.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{d.author}</span>
                          <span className="text-slate-400">{d.time}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{d.question}</p>
                        {d.answer && (
                          <div className="mt-2 p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-950 text-[11px] space-y-0.5">
                            <span className="font-bold block text-indigo-700">Resposta da Docência:</span>
                            <p>{d.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus Playlist Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
                  <span>Trilha de Aprendizagem</span>
                  <span className="text-xs text-indigo-600 font-bold">
                    {allLessons.filter((l) => l.isCompleted).length}/{allLessons.length} Feito
                  </span>
                </h3>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(allLessons.filter((l) => l.isCompleted).length / (allLessons.length || 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {studentCourse.syllabus.map((mod) => (
                    <div key={mod.id} className="space-y-1.5">
                      <div className="text-[11px] font-extrabold uppercase text-slate-400 px-1">
                        {mod.title}
                      </div>
                      {mod.lessons.map((les) => {
                        const isCurrent = les.id === selectedLesson.id;
                        return (
                          <button
                            key={les.id}
                            onClick={() => setSelectedLesson(les)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                                les.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {les.isCompleted ? '✓' : '▶'}
                              </div>
                              <span className="text-xs truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                              {les.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: BOLETIM & NOTAS */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900">Boletim Escolar Oficial</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Médias calculadas com peso de Provas (P1: 35%, P2: 45%) e Atividades/Trabalhos (20%).
              </p>
            </div>
            <button
              onClick={() => {
                const docReq: DocumentRequest = {
                  id: 'temp_hist',
                  studentId: currentUser.id,
                  studentName: currentUser.name,
                  documentType: 'historico',
                  title: 'Histórico Escolar Oficial',
                  feeAmount: 0,
                  paymentStatus: 'paid',
                  requestedAt: new Date().toISOString(),
                };
                setViewingDocument(docReq);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Exportar Boletim em PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Disciplina</th>
                  <th className="py-3 px-4 text-center">Prova 1 (P1)</th>
                  <th className="py-3 px-4 text-center">Prova 2 (P2)</th>
                  <th className="py-3 px-4 text-center">Trabalhos (T)</th>
                  <th className="py-3 px-4 text-center">Média Final</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((grd) => (
                  <tr key={grd.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{grd.subject}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">{grd.p1.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">{grd.p2.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-medium">{grd.assignment.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-indigo-700 text-base">
                      {grd.average.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        grd.status === 'Aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : grd.status === 'Recuperação'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
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

      {/* TAB 3: ATTENDANCE & CHECK-IN */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Check-in Action Card */}
          <div className="bg-linear-to-br from-indigo-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
              Controle de Frequência Diária
            </span>
            <h3 className="text-xl font-black">
              Marcação de Presença em Tempo Real
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Confirme sua presença na aula do dia para cômputo no diário de classe eletrônico.
            </p>

            <button
              disabled={checkedInToday}
              onClick={() => {
                markAttendance(currentUser.id, 'Arquitetura de Microsserviços & Cloud');
                setCheckedInToday(true);
              }}
              className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                checkedInToday
                  ? 'bg-emerald-500 text-white cursor-not-allowed'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-white/20'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {checkedInToday ? 'Presença Confirmada Hoje!' : 'Registrar Presença na Aula de Hoje'}
            </button>
            {checkedInToday && (
              <p className="text-[11px] text-emerald-200 text-center font-mono">
                Autenticado via GPS/Rede • Código PRES-{Math.floor(Math.random() * 9000 + 1000)}
              </p>
            )}
          </div>

          {/* Attendance History */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">
                Histórico de Presenças Computadas
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {presentDays} presenças em {totalAttendanceDays} dias letivos
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {attendance.map((att) => (
                <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{att.subject}</span>
                    <span className="text-[11px] text-slate-400">Data: {att.date} • Validador: {att.verifiedCode}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    att.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {att.status === 'present' ? 'Presente' : 'Justificada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXAMS, QUIZZES & ASSIGNMENTS */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          {activeExam ? (
            /* Taking Exam / Quiz Screen */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <button
                    onClick={() => setActiveExam(null)}
                    className="text-xs font-bold text-indigo-600 hover:underline mb-1"
                  >
                    ← Voltar para lista de provas
                  </button>
                  <h2 className="text-xl font-black text-slate-900">{activeExam.title}</h2>
                  <p className="text-xs text-slate-500">{activeExam.description}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>Timer: 18:45</span>
                </div>
              </div>

              {activeExam.type === 'quiz' && activeExam.questions && (
                <div className="space-y-6">
                  {quizSubmittedResult ? (
                    /* Quiz Score Screen */
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-emerald-950">
                        Quiz Finalizado com Sucesso!
                      </h3>
                      <div className="text-3xl font-black text-emerald-700">
                        Nota: {quizSubmittedResult.score} / {quizSubmittedResult.total}
                      </div>
                      <p className="text-xs text-emerald-800">
                        Sua pontuação foi registrada automaticamente e lançada no seu boletim!
                      </p>
                      <button
                        onClick={() => setActiveExam(null)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-700"
                      >
                        Concluir e Voltar
                      </button>
                    </div>
                  ) : (
                    /* Quiz Questions */
                    <div className="space-y-6">
                      {activeExam.questions.map((q, idx) => (
                        <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            Questão {idx + 1}: {q.question}
                          </h4>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[q.id] === optIdx;
                              return (
                                <button
                                  type="button"
                                  key={optIdx}
                                  onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                  className={`w-full p-3 rounded-xl text-xs font-medium text-left transition-all border flex items-center gap-3 cursor-pointer ${
                                    isSelected
                                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-500/20'
                                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                                    isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                                  }`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </div>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={handleSubmitQuiz}
                          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Enviar Respostas do Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeExam.type === 'assignment' && (
                /* Assignment submit screen */
                <form onSubmit={handleSubmitAssignment} className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                    <span className="font-bold block mb-1">Instruções do Docente:</span>
                    {activeExam.instructions}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Comentários do Envio & Links (GitHub/Figma)
                    </label>
                    <textarea
                      rows={3}
                      value={assignmentText}
                      onChange={(e) => setAssignmentText(e.target.value)}
                      placeholder="Cole aqui o link do repositório ou observações da entrega..."
                      className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Anexar Arquivo do Trabalho (.PDF, .ZIP)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 cursor-pointer">
                      <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                      <p className="text-xs text-slate-600 font-bold">
                        {assignmentFile ? `Arquivo Selecionado: ${assignmentFile}` : 'Clique para selecionar o PDF do trabalho'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setAssignmentFile('Projeto-C4-Model-LucasPrado.pdf')}
                        className="mt-2 text-xs text-indigo-600 font-bold hover:underline"
                      >
                        [Simular Anexo de Arquivo PDF]
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveExam(null)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Entregar Trabalho para o Professor
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Exams list */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams.map((ex) => {
                const isSubmitted = submissions.some((s) => s.examId === ex.id && s.studentId === currentUser.id);
                return (
                  <div
                    key={ex.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {ex.type === 'quiz' ? 'Quiz Interativo' : 'Trabalho Prático'}
                        </span>
                        <span className="text-xs text-slate-400">Prazo: {ex.dueDate}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base">{ex.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{ex.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Pontuação Máxima: {ex.totalPoints} pts
                      </span>
                      <button
                        onClick={() => handleStartExam(ex)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          isSubmitted
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {isSubmitted ? 'Ver Respostas / Refazer' : 'Iniciar Avaliação'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SECRETARIA VIRTUAL & DOCUMENTOS (MERCADO PAGO) */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-linear-to-r from-sky-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                Secretaria Virtual & Gateway Mercado Pago
              </span>
              <h2 className="text-2xl font-black">Emissão de Documentos Oficiais</h2>
              <p className="text-xs text-sky-100 max-w-xl leading-relaxed">
                Solicite sua carteirinha de estudante padrão DNE, certificado de conclusão ou histórico com validação digital. Taxas processadas de forma segura e instantânea pelo Mercado Pago.
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-sky-200 block">Status Gateway</span>
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Mercado Pago Conectado
              </span>
            </div>
          </div>

          {/* Catalog of Available Documents */}
          <div>
            <h3 className="text-base font-black text-slate-900 mb-4">
              Documentos Disponíveis para Emissão Imediata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documentCatalog.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={doc.type}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{doc.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{doc.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Taxa Administrativa</span>
                        <span className="text-base font-black text-slate-900">
                          {doc.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRequestDocument(doc.type, doc.title, doc.fee)}
                        className="w-full py-2.5 bg-[#009EE3] hover:bg-[#0089c7] text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pagar com Mercado Pago
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issued Documents Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">
              Meus Documentos Solicitados & Emitidos
            </h3>

            {documentRequests.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                Você ainda não solicitou nenhum documento escolar.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {documentRequests.map((req) => (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.paymentStatus === 'paid' ? 'Pago & Liberado' : 'Aguardando Pagamento'}
                        </span>
                        <span className="text-xs text-slate-400">
                          Ref: {req.mercadoPagoPaymentId || 'Pendente'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                      {req.validationHash && (
                        <p className="text-[11px] text-slate-500 font-mono">
                          Hash de Validação ICP: {req.validationHash}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.paymentStatus === 'paid' ? (
                        <button
                          onClick={() => setViewingDocument(req)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Visualizar & Imprimir
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveDocumentForPayment(req);
                            setOpenPaymentModal(true);
                          }}
                          className="px-4 py-2 bg-[#009EE3] hover:bg-[#0089c7] text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Pagar Taxa
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SCHEDULE & TIMETABLE CHANGES */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Grade Horária Semanal & Alertas de Mudança
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Notificações push em tempo real avisam sobre reposições ou mudanças de sala.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg">
                Semestre 2026/2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.hasChanged
                      ? 'border-amber-300 bg-amber-50/50 ring-2 ring-amber-400/20'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-xs uppercase px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800">
                      {item.dayOfWeek}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm mt-2">{item.subject}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.teacherName}</p>
                  <div className="text-xs text-indigo-700 font-semibold mt-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.roomOrLink}
                  </div>

                  {item.hasChanged && item.changeNotice && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{item.changeNotice}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Document Viewer Modal */}
      {viewingDocument && (
        <DocumentViewerModal
          document={viewingDocument}
          student={currentUser}
          course={studentCourse}
          grades={grades}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </div>
  );
};
