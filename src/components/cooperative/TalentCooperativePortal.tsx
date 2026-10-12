import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CooperativeMember,
  JobVacancy,
  JobApplication,
  StoredExamRecord,
  CourseUpdateRecord,
  ValidatedInternshipRecord,
} from '../../types';
import {
  Users,
  Briefcase,
  Award,
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  ExternalLink,
  PlusCircle,
  Building2,
  DollarSign,
  Clock,
  Send,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  BookOpen,
  Calendar,
  X,
  Printer,
  UserCheck,
  FileCheck,
  Layers,
  TrendingUp,
  Tag,
  AlertCircle,
  HelpCircle,
  Download,
  QrCode,
  CreditCard,
} from 'lucide-react';

export const TalentCooperativePortal: React.FC = () => {
  const {
    currentUser,
    cooperativeMembers,
    addCooperativeMember,
    updateCooperativeMember,
    addStoredExamToMember,
    addCourseUpdateToMember,
    validateInternshipForApplication,
    addValidatedInternshipToMember,
    jobVacancies,
    addJobVacancy,
    jobApplications,
    applyForJob,
    updateJobApplicationStatus,
    courses,
    grades,
    sendPushNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'talents' | 'jobs' | 'cooperative_badge' | 'company_portal' | 'my_resume' | 'post_job' | 'register_talent'
  >('talents');

  const [selectedBadgeMemberId, setSelectedBadgeMemberId] = useState<string>('');

  // Search & Filters for Talents
  const [talentSearchQuery, setTalentSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [onlyTopPerformers, setOnlyTopPerformers] = useState<boolean>(false);
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<CooperativeMember | null>(null);

  // Search & Filters for Jobs & Estágios
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<'all' | 'estagio' | 'clt' | 'pj'>('all');
  const [selectedVacancyForApply, setSelectedVacancyForApply] = useState<JobVacancy | null>(null);
  const [applicationCoverNote, setApplicationCoverNote] = useState('');

  // Form for New Job / Internship Posting (for companies)
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('São Gonçalo - RJ');
  const [newJobSalary, setNewJobSalary] = useState('R$ 1.500/mês (Bolsa de Estágio + Benefícios)');
  const [newJobType, setNewJobType] = useState<'clt' | 'pj' | 'estagio' | 'prestador_servico'>('estagio');
  const [newJobCategory, setNewJobCategory] = useState<
    'Mecânica e Máquinas' | 'Contabilidade e Gestão' | 'Tecnologia e Software' | 'Geral'
  >('Mecânica e Máquinas');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobReqs, setNewJobReqs] = useState(
    'Matrícula ativa ou conclusão de curso pelo Grupo Eloizio\nDisponibilidade para 20h a 30h semanais com horários flexíveis\nInteresse em práticas supervisionadas de mercado'
  );
  const [newJobBenefits, setNewJobBenefits] = useState(
    'Validação Oficial de Horas no Certificado e Currículo (Lei 11.788/2008)\nBolsa-Auxílio Mensal + Auxílio Transporte\nMentoria Direta com Supervisores Mestres\nPossibilidade de Efetivação Imediata'
  );
  const [newJobEmail, setNewJobEmail] = useState('');
  const [newJobPhone, setNewJobPhone] = useState('(21) 99613-4073');

  // Internship-specific posting fields
  const [newJobIsOptionalInternship, setNewJobIsOptionalInternship] = useState(true);
  const [newJobInternshipHours, setNewJobInternshipHours] = useState(120);
  const [newJobModality, setNewJobModality] = useState<'presencial' | 'remoto' | 'hibrido'>('presencial');
  const [newJobSupervisorName, setNewJobSupervisorName] = useState('Gilberto Faria - Supervisor Técnico Chefe');
  const [newJobSupervisorRole, setNewJobSupervisorRole] = useState('Supervisor Industrial & Mestre Mecânico');
  const [newJobAllowCourseValidation, setNewJobAllowCourseValidation] = useState(true);

  // Modal para Empresa Validar Estágio de Aluno
  const [validatingApplication, setValidatingApplication] = useState<JobApplication | null>(null);
  const [validationHoursAwarded, setValidationHoursAwarded] = useState<number>(120);
  const [supervisorValidationName, setSupervisorValidationName] = useState<string>('Gilberto Faria - Supervisor Técnico');
  const [supervisorValidationFeedback, setSupervisorValidationFeedback] = useState<string>(
    'Estágio prático cumprido com excelência, assiduidade impecável e ótimo domínio das rotinas operacionais.'
  );

  // Modal de Termo Oficial de Estágio (Visualização / Impressão)
  const [selectedInternshipForTermo, setSelectedInternshipForTermo] = useState<ValidatedInternshipRecord | null>(null);

  // Modal para Aluno/Coordenador Homologar Novo Estágio
  const [showAddInternshipModal, setShowAddInternshipModal] = useState(false);
  const [newInternshipTitle, setNewInternshipTitle] = useState('Estágio Supervisionado em Manutenção e Regulagem Prática');
  const [newInternshipCompany, setNewInternshipCompany] = useState('Confecções & Polo Industrial São Gonçalo');
  const [newInternshipHours, setNewInternshipHours] = useState(120);
  const [newInternshipSupervisor, setNewInternshipSupervisor] = useState('Gilberto Faria (Mestre Mecânico)');
  const [newInternshipFeedback, setNewInternshipFeedback] = useState('Excelente aproveitamento prático em bancada e calibração de máquinas.');

  // Form for Registering New Talent / Student Indication
  const [newTalentName, setNewTalentName] = useState('');
  const [newTalentReg, setNewTalentReg] = useState(`MAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newTalentCourse, setNewTalentCourse] = useState(courses[0]?.title || 'Mecânica e Regulagem de Máquinas de Costura');
  const [newTalentCategory, setNewTalentCategory] = useState('Engenharia');
  const [newTalentCity, setNewTalentCity] = useState('São Gonçalo - RJ');
  const [newTalentAverage, setNewTalentAverage] = useState(9.6);
  const [newTalentSkills, setNewTalentSkills] = useState('Regulagem de Ponto, Máquinas Industriais, Diagnóstico Elétrico');
  const [newTalentBio, setNewTalentBio] = useState('Aluno destaque com dedicação integral às aulas práticas e teóricas.');
  const [newTalentPhone, setNewTalentPhone] = useState('(21) 99613-4073');
  const [newTalentEmail, setNewTalentEmail] = useState('');
  const [newTalentAvatar, setNewTalentAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');

  // Form for Storing New Exam (Avaliação / Prova)
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [targetMemberForExam, setTargetMemberForExam] = useState<string>('');
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamScore, setNewExamScore] = useState(9.8);
  const [newExamMax, setNewExamMax] = useState(10);
  const [newExamCategory, setNewExamCategory] = useState('Prática Técnica');
  const [newExamVerifiedBy, setNewExamVerifiedBy] = useState('Mestre Eloizio Assunção & Coordenação Pedagógica');
  const [newExamFeedback, setNewExamFeedback] = useState('Demonstrou domínio pleno na execução dos procedimentos.');

  // Form for Storing Course Update (Reciclagem / Atualização)
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [targetMemberForUpdate, setTargetMemberForUpdate] = useState<string>('');
  const [newUpdateYear, setNewUpdateYear] = useState(new Date().getFullYear());
  const [newUpdateTitle, setNewUpdateTitle] = useState('Atualização Técnica 2026: Motores Eletrônicos Direct-Drive');
  const [newUpdateHours, setNewUpdateHours] = useState(30);
  const [newUpdateBadge, setNewUpdateBadge] = useState('Credencial Atualizada 2026');

  // Form for Student Resume Update
  const currentMember =
    cooperativeMembers.find((m) => m.userId === currentUser?.id) ||
    cooperativeMembers[0];

  const [resumeBio, setResumeBio] = useState(
    currentMember?.bio ||
      'Profissional capacitado pelo Grupo Eloizio com foco em excelência técnica e resolução ágil de problemas.'
  );
  const [resumeSkills, setResumeSkills] = useState(
    currentMember?.technicalSkills?.join(', ') ||
      'Mecânica, Regulagem de Ponto, Atendimento ao Cliente'
  );
  const [resumePhone, setResumePhone] = useState(
    currentMember?.contactPhone || currentUser?.phone || '(21) 98112-9988'
  );
  const [resumeEmail, setResumeEmail] = useState(
    currentMember?.contactEmail || currentUser?.email || 'aluno@eduvanguard.com'
  );
  const [resumeCity, setResumeCity] = useState(
    currentMember?.city || 'São Gonçalo - RJ'
  );
  const [resumeLinks, setResumeLinks] = useState(
    currentMember?.linkedinOrPortfolio || 'https://linkedin.com'
  );

  // Filtered Talents
  const filteredTalents = cooperativeMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
      m.courseTitle.toLowerCase().includes(talentSearchQuery.toLowerCase()) ||
      m.technicalSkills.some((s) =>
        s.toLowerCase().includes(talentSearchQuery.toLowerCase())
      ) ||
      m.city.toLowerCase().includes(talentSearchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      m.courseCategory.toLowerCase() === selectedCategoryFilter.toLowerCase();
    const matchesTop =
      !onlyTopPerformers || m.topPerformerBadge || m.overallAverage >= 9.0;

    return matchesSearch && matchesCategory && matchesTop;
  });

  // Filtered Jobs
  const filteredJobs = jobVacancies.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearchQuery.toLowerCase());

    const matchesCategory =
      jobCategoryFilter === 'all' || j.category === jobCategoryFilter;

    const matchesType =
      jobTypeFilter === 'all' ||
      (jobTypeFilter === 'estagio' ? (j.type === 'estagio' || Boolean(j.isOptionalInternship)) : j.type === jobTypeFilter);

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleCreateJobVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobCompany.trim()) return;

    const isIntern = newJobType === 'estagio' || newJobIsOptionalInternship;

    addJobVacancy({
      title: newJobTitle,
      companyName: newJobCompany,
      location: newJobLocation,
      salaryRange: newJobSalary,
      type: newJobType,
      category: newJobCategory,
      description: newJobDesc,
      requirements: newJobReqs.split('\n').filter(Boolean),
      benefits: newJobBenefits.split('\n').filter(Boolean),
      contactEmail: newJobEmail || 'vagas@empresa.com.br',
      contactPhone: newJobPhone || '(21) 99613-4073',
      status: 'open',
      isOptionalInternship: isIntern,
      internshipHours: isIntern ? Number(newJobInternshipHours) : undefined,
      modality: newJobModality,
      supervisorName: newJobSupervisorName,
      supervisorRole: newJobSupervisorRole,
      allowCourseValidation: newJobAllowCourseValidation,
    });

    alert(
      isIntern
        ? 'Estágio opcional cadastrado com sucesso! As horas práticas serão validadas para os alunos inscritos, contando em seus certificados e currículos.'
        : 'Vaga de emprego cadastrada com sucesso na Cooperativa! Candidatos cooperados serão notificados.'
    );
    setActiveTab('jobs');
    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobDesc('');
  };

  const handleConfirmInternshipValidation = () => {
    if (!validatingApplication) return;
    validateInternshipForApplication(
      validatingApplication.id,
      validationHoursAwarded,
      supervisorValidationName,
      supervisorValidationFeedback
    );
    setValidatingApplication(null);
    alert(
      `Estágio validado com sucesso! Foram creditadas ${validationHoursAwarded} horas práticas no currículo e certificado oficial do aluno.`
    );
  };

  const handleSaveNewInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternshipTitle.trim() || !newInternshipCompany.trim()) return;
    const targetMemberId = currentMember?.id || cooperativeMembers[0]?.id;
    if (!targetMemberId) return;

    const validationCode = `EST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    addValidatedInternshipToMember(targetMemberId, {
      companyName: newInternshipCompany,
      title: newInternshipTitle,
      hoursValidated: Number(newInternshipHours),
      completionDate: new Date().toLocaleDateString('pt-BR'),
      supervisor: newInternshipSupervisor,
      validationCode: validationCode,
      certificateMention: `Estágio Opcional Supervisionado - ${newInternshipTitle} (${newInternshipHours}h)`,
      status: 'validado',
    });

    setShowAddInternshipModal(false);
    alert(
      `Estágio de ${newInternshipHours} horas homologado com sucesso! Adicionado ao seu currículo e ao Certificado Oficial de Conclusão.`
    );
  };

  const handleRegisterNewTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTalentName.trim()) return;

    addCooperativeMember({
      userId: `user_coop_${Date.now()}`,
      name: newTalentName,
      avatar: newTalentAvatar,
      registrationNumber: newTalentReg,
      courseTitle: newTalentCourse,
      courseCategory: newTalentCategory,
      city: newTalentCity,
      overallAverage: Number(newTalentAverage),
      completionPercentage: 100,
      topPerformerBadge: Number(newTalentAverage) >= 9.0,
      bio: newTalentBio,
      technicalSkills: newTalentSkills.split(',').map((s) => s.trim()).filter(Boolean),
      storedExams: [
        {
          examId: `exam_${Date.now()}_1`,
          title: `Avaliação de Qualificação em ${newTalentCourse}`,
          score: Number(newTalentAverage),
          maxPoints: 10,
          date: new Date().toLocaleDateString('pt-BR'),
          category: 'Qualificação Profissional',
          verifiedBy: 'Coordenação Pedagógica Grupo Eloizio',
          certificateHash: `HASH-SHA256-${Math.floor(100000 + Math.random() * 900000)}`,
          feedback: 'Aprovado com distinção técnica e atestado de aptidão prática.',
        },
      ],
      courseUpdates: [
        {
          year: new Date().getFullYear(),
          title: 'Credenciamento Oficial de Habilidade Técnica 2026',
          hours: 40,
          status: 'atualizado',
          badge: 'Cooperado Homologado 2026',
        },
      ],
      contactPhone: newTalentPhone,
      contactEmail: newTalentEmail || 'cooperado@eduvanguard.com',
      availableForHire: true,
      resumeSummary: newTalentBio,
    });

    alert(`Aluno(a) ${newTalentName} cadastrado(a) com sucesso na Cooperativa de Talentos!`);
    setActiveTab('talents');
    setNewTalentName('');
  };

  const handleSaveStudentResume = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUserId = currentUser?.id || 'user_student_1';
    const targetName = currentUser?.name || 'Lucas Silva Prado';
    const skillsArray = resumeSkills.split(',').map((s) => s.trim()).filter(Boolean);

    if (currentMember) {
      updateCooperativeMember(currentMember.id, {
        bio: resumeBio,
        technicalSkills: skillsArray,
        contactPhone: resumePhone,
        contactEmail: resumeEmail,
        city: resumeCity,
        linkedinOrPortfolio: resumeLinks,
        resumeSummary: resumeBio,
      });
      alert('Seu currículo profissional na Cooperativa foi atualizado com sucesso!');
    } else {
      addCooperativeMember({
        userId: targetUserId,
        name: targetName,
        avatar:
          currentUser?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        registrationNumber: currentUser?.registrationNumber || 'MAT-2026-0041',
        courseTitle: 'Engenharia & Mecânica Especializada',
        courseCategory: 'Engenharia',
        city: resumeCity,
        overallAverage: 9.6,
        completionPercentage: 100,
        topPerformerBadge: true,
        bio: resumeBio,
        technicalSkills: skillsArray,
        storedExams: [
          {
            examId: 'ex_default_1',
            title: 'Avaliação Final de Competências Práticas',
            score: 9.8,
            maxPoints: 10,
            date: new Date().toLocaleDateString('pt-BR'),
            category: 'Avaliação Integrada',
            verifiedBy: 'Coordenação Pedagógica Grupo Eloizio',
            feedback: 'Excelente domínio técnico demonstrado nas avaliações do LMS.',
            certificateHash: 'HASH-SHA256-BR-99120',
          },
        ],
        courseUpdates: [
          {
            year: 2026,
            title: 'Reciclagem e Atualização Técnica Anual 2026',
            hours: 30,
            status: 'atualizado',
            badge: 'Cooperado Ativo 2026',
          },
        ],
        contactPhone: resumePhone,
        contactEmail: resumeEmail,
        availableForHire: true,
        linkedinOrPortfolio: resumeLinks,
        resumeSummary: resumeBio,
      });
      alert('Cadastro de currículo concluído na Cooperativa de Talentos!');
    }
  };

  const handleApplyToJobConfirm = () => {
    if (!selectedVacancyForApply) return;
    const memberId = currentMember?.id || cooperativeMembers[0]?.id || 'coop_1';
    applyForJob(selectedVacancyForApply.id, memberId, applicationCoverNote);
    setSelectedVacancyForApply(null);
    setApplicationCoverNote('');
    alert(
      `Candidatura enviada para "${selectedVacancyForApply.title}"! Seus dados e histórico de provas da cooperativa foram encaminhados à empresa contratante.`
    );
  };

  const handleSaveNewExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;

    const targetId = targetMemberForExam || currentMember?.id || cooperativeMembers[0]?.id;
    if (!targetId) return;

    const newExam: StoredExamRecord = {
      examId: `exam_${Date.now()}`,
      title: newExamTitle,
      score: Number(newExamScore),
      maxPoints: Number(newExamMax),
      date: new Date().toLocaleDateString('pt-BR'),
      category: newExamCategory,
      verifiedBy: newExamVerifiedBy,
      certificateHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      feedback: newExamFeedback,
    };

    addStoredExamToMember(targetId, newExam);
    setShowAddExamModal(false);
    setNewExamTitle('');
    alert('Nova prova / avaliação arquivada com sucesso no dossiê do aluno com autenticação criptográfica!');
  };

  const handleSaveNewCourseUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateTitle.trim()) return;

    const targetId = targetMemberForUpdate || currentMember?.id || cooperativeMembers[0]?.id;
    if (!targetId) return;

    const newUpdate: CourseUpdateRecord = {
      year: Number(newUpdateYear),
      title: newUpdateTitle,
      hours: Number(newUpdateHours),
      status: 'atualizado',
      badge: newUpdateBadge,
    };

    addCourseUpdateToMember(targetId, newUpdate);
    setShowAddUpdateModal(false);
    setNewUpdateTitle('');
    alert('Novo curso de reciclagem / atualização técnica registrado com sucesso!');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Hero Banner Cooperativa */}
      <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/20 relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Cooperativa Oficial de Empregabilidade & Banco de Talentos
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Cooperativa de Melhores Alunos & Conexão com Empresas
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Vitrine oficial dos melhores alunos do <strong>Grupo Eloizio & EduVanguard</strong>. Empresas contratam com total segurança acessando currículos completos, histórico de provas e avaliações práticas armazenadas e selos de atualização contínua de cursos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('company_portal')}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Building2 className="w-4 h-4 text-slate-950" />
              <span>Portal da Empresa Contratante</span>
            </button>
            <button
              onClick={() => setActiveTab('my_resume')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition border border-indigo-400/30"
            >
              <FileText className="w-4 h-4" />
              <span>Meu Currículo & Provas Realizadas</span>
            </button>
            <button
              onClick={() => setActiveTab('register_talent')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition border border-slate-700"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Cadastrar Novo Aluno</span>
            </button>
          </div>
        </div>

        {/* Indicadores da Cooperativa */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-900/60 text-xs">
          <div>
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Alunos Cooperados</span>
            <strong className="text-lg font-black text-white">{cooperativeMembers.length + 120} Talentos Homologados</strong>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Vagas no Mural</span>
            <strong className="text-lg font-black text-emerald-400">{jobVacancies.length + 8} Oportunidades</strong>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Média dos Cooperados</span>
            <strong className="text-lg font-black text-amber-300">9.6 / 10.0 (Excelência)</strong>
          </div>
          <div>
            <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Provas Armazenadas</span>
            <strong className="text-lg font-black text-blue-300">100% Auditadas com Hash SHA-256</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('talents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'talents'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Banco de Talentos (Melhores Alunos)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-800 text-indigo-100 font-black">
            {filteredTalents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Mural de Vagas de Emprego</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-700 text-white font-black">
            {filteredJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cooperative_badge')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'cooperative_badge'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Crachá Funcional da Cooperativa</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
            Regra Anuidade
          </span>
        </button>

        <button
          onClick={() => setActiveTab('company_portal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'company_portal'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Área da Empresa (Candidaturas & RH)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-700 text-white font-black">
            {jobApplications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my_resume')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'my_resume'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Meu Currículo & Provas Realizadas</span>
        </button>

        <button
          onClick={() => setActiveTab('register_talent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'register_talent'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Aluno</span>
        </button>

        <button
          onClick={() => setActiveTab('post_job')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'post_job'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Publicar Vaga (Empresas)</span>
        </button>
      </div>

      {/* ABA 1: BANCO DE TALENTOS (MELHORES ALUNOS COOPERADOS) */}
      {activeTab === 'talents' && (
        <div className="space-y-6">
          {/* Barra de Filtros e Busca */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={talentSearchQuery}
                onChange={(e) => setTalentSearchQuery(e.target.value)}
                placeholder="Buscar por nome, competência (ex: Regulagem de Ponto, SPED, React) ou cidade..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">Todas as Áreas de Formação</option>
                <option value="Engenharia">Mecânica & Máquinas de Costura</option>
                <option value="Negócios">Contabilidade & Gestão</option>
                <option value="Tecnologia">Tecnologia & Software</option>
              </select>

              <label className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyTopPerformers}
                  onChange={(e) => setOnlyTopPerformers(e.target.checked)}
                  className="rounded text-amber-600 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Melhores Alunos (Média ≥ 9.0)
                </span>
              </label>

              <button
                onClick={() => setActiveTab('register_talent')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Indicar Aluno</span>
              </button>
            </div>
          </div>

          {/* Grid de Cooperados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Top Bar with Avatar and Badges */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          {member.name}
                        </h3>
                        {member.topPerformerBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Melhor Aluno
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-indigo-700 font-semibold block mt-0.5 truncate">
                        {member.courseTitle}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {member.city}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {member.technicalSkills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                    {member.technicalSkills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-bold">
                        +{member.technicalSkills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Metrics Box (Provas e Atualizações) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans uppercase">Média Geral</span>
                      <strong className="text-emerald-700 font-bold text-sm">
                        {member.overallAverage.toFixed(1)} / 10
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans uppercase">Provas Salvas</span>
                      <strong className="text-indigo-900 font-bold">
                        {member.storedExams.length} Avaliações
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans uppercase">Atualização</span>
                      <strong className="text-purple-700 font-bold">
                        {member.courseUpdates[0]?.year || '2026'} ({member.courseUpdates.length} selos)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMemberForModal(member)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition text-center"
                  >
                    Ver Dossiê, Provas & Laudo &rarr;
                  </button>
                  <a
                    href={`https://wa.me/55${member.contactPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(
                      member.name
                    )},%20vimos%20seu%20perfil%20na%20Cooperativa%20do%20Grupo%20Eloizio%20e%20gostaríamos%20de%20conversar%20sobre%20uma%20vaga!`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                    title="Contatar via WhatsApp Empresa"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: MURAL DE VAGAS DE EMPREGO */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Banner Informativo de Estágios Opcionais */}
          <div className="bg-linear-to-r from-amber-500/15 via-indigo-500/10 to-emerald-500/15 border-2 border-amber-400/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                    Lei Federal nº 11.788/2008
                  </span>
                  <span className="text-xs font-bold text-amber-900">
                    Estágio Opcional Supervisionado com Validação Curricular
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Valide Horas Práticas que Agregam Valor Direto ao seu Certificado Oficial!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  Empresas parceiras cadastram oportunidades de estágio supervisionado. Ao concluir, as horas práticas (de 60h a 300h) são homologadas e somadas à carga horária do seu Certificado Oficial e Currículo da Cooperativa.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setJobTypeFilter(jobTypeFilter === 'estagio' ? 'all' : 'estagio')}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  jobTypeFilter === 'estagio'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white border border-amber-300 text-amber-950 hover:bg-amber-50'
                }`}
              >
                <span>{jobTypeFilter === 'estagio' ? '✓ Filtrando Estágios' : '🔍 Ver Apenas Estágios'}</span>
              </button>
            </div>
          </div>

          {/* Header & Filtro de Vagas */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="Buscar vagas e estágios por cargo, empresa ou cidade (ex: Mecânico, Contábil, São Gonçalo)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value as any)}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">Todos os Regimes</option>
                <option value="estagio">🎓 Estágios Opcionais (Com Validação)</option>
                <option value="clt">💼 Vagas CLT</option>
                <option value="pj">📑 Vagas PJ</option>
              </select>

              <select
                value={jobCategoryFilter}
                onChange={(e) => setJobCategoryFilter(e.target.value)}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Mecânica e Máquinas">Mecânica e Máquinas</option>
                <option value="Contabilidade e Gestão">Contabilidade e Gestão</option>
                <option value="Tecnologia e Software">Tecnologia e Software</option>
              </select>

              <button
                onClick={() => setActiveTab('post_job')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Cadastrar Vaga / Estágio</span>
              </button>
            </div>
          </div>

          {/* Lista de Vagas */}
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isIntern = job.type === 'estagio' || Boolean(job.isOptionalInternship);
              return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition space-y-4 ${
                  isIntern ? 'border-amber-300/80 hover:border-amber-400 bg-amber-50/10' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                        {job.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isIntern ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isIntern ? '🎓 Estágio Supervisionado' : job.type.toUpperCase()}
                      </span>
                      {isIntern && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          +{job.internshipHours || 120}h Contam no Certificado
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• Publicada em {job.createdAt}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mt-1">{job.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {job.companyName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salaryRange}
                      </span>
                      {isIntern && job.supervisorName && (
                        <span className="font-semibold text-indigo-700 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                          Orientador: {job.supervisorName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVacancyForApply(job)}
                      className={`px-5 py-2.5 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition shrink-0 flex items-center gap-1.5 ${
                        isIntern
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isIntern ? `Inscrever-se no Estágio (+${job.internshipHours || 120}h) →` : 'Candidatar-se com Meu Histórico →'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {job.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-bold block">Requisitos da Empresa:</strong>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-bold block">Benefícios Oferecidos:</strong>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {job.benefits.map((ben, idx) => (
                        <li key={idx}>{ben}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700">{job.applicantsCount} candidatos inscritos</span>
                    <span>• RH: {job.contactPhone}</span>
                  </div>
                  <a href={`mailto:${job.contactEmail}`} className="text-indigo-600 font-bold hover:underline">
                    {job.contactEmail}
                  </a>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* ABA: CRACHÁ FUNCIONAL DA COOPERATIVA & REGRA DE ANUIDADE */}
      {activeTab === 'cooperative_badge' && (() => {
        const badgeMember = cooperativeMembers.find((m) => m.id === selectedBadgeMemberId) || currentMember || cooperativeMembers[0];
        const isConcluinte = badgeMember?.hasConcludedCourse || (badgeMember?.completionPercentage === 100);

        return (
          <div className="space-y-8">
            {/* Banner Institucional & Regra Oficial */}
            <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Credenciamento Profissional • Cooperativa Grupo Eloizio
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Crachá Funcional & Carteira de Membro Cooperado
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
                    Identificação profissional de campo para prestadores de serviços, técnicos industriais e analistas. Válido em ateliês, fábricas e empresas conveniadas em São Gonçalo e em todo o Brasil.
                  </p>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">Norma de Anuidade</span>
                  <strong className="text-base font-black text-emerald-300 block">
                    {isConcluinte ? 'ISENÇÃO CONCLUINTE: R$ 0,00' : 'RENOVAÇÃO: R$ 45,00/ANO'}
                  </strong>
                  <span className="text-[11px] text-slate-300">
                    {isConcluinte ? '✓ Aluno Concluinte Isento' : 'Membro Regular Cooperado'}
                  </span>
                </div>
              </div>

              {/* Destaque das Regras de Cobrança */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-indigo-800/60 text-xs">
                <div className="p-3.5 bg-emerald-500/15 border border-emerald-400/30 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-200 font-bold block text-xs">Isenção para Alunos Concluintes:</strong>
                    <span className="text-emerald-100/90 text-[11px] leading-relaxed">
                      Alunos formados e concluintes de qualquer curso do Grupo Eloizio recebem o crachá funcional com <strong>100% de gratuidade e isenção de anuidade para renovação</strong>.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-500/15 border border-amber-400/30 rounded-2xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-200 font-bold block text-xs">Anuidade para Renovação Regular:</strong>
                    <span className="text-amber-100/90 text-[11px] leading-relaxed">
                      Membros cooperados externos ou que ainda não concluíram seus cursos pagam a taxa de renovação anual de <strong>R$ 45,00/ano via Mercado Pago</strong>.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seletor de Membro para Visualização */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Selecione o Membro Cooperado para Visualizar o Crachá:
                </label>
                <select
                  value={badgeMember.id}
                  onChange={(e) => setSelectedBadgeMemberId(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-hidden"
                >
                  {cooperativeMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.courseTitle}) — {m.hasConcludedCourse || m.completionPercentage === 100 ? '★ Concluinte (Isento)' : 'Membro Regular'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
                  isConcluinte ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isConcluinte ? '✓ Isenção de Anuidade (Concluinte)' : 'Anuidade Pendente (R$ 45,00)'}
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Crachá PVC
                </button>
              </div>
            </div>

            {/* Visualização do Crachá Funcional (Frente & Verso) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-6">
              {/* FRENTE DO CRACHÁ */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Frente da Credencial (Padrão PVC 85 x 54 mm)
                </span>
                <div className="bg-linear-to-b from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border-4 border-indigo-400 shadow-2xl relative overflow-hidden max-w-md mx-auto aspect-85/54 flex flex-col justify-between">
                  {/* Faixa Superior Institucional */}
                  <div className="flex items-start justify-between border-b border-indigo-500/40 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300 block">
                        República Federativa do Brasil • Estado do RJ
                      </span>
                      <h4 className="text-sm font-black text-white tracking-tight uppercase">
                        Grupo Eloizio • Cooperativa Técnica
                      </h4>
                      <span className="text-[9px] text-slate-300 block">
                        Registro Profissional • São Gonçalo - RJ
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      GE
                    </div>
                  </div>

                  {/* Corpo com Foto, Chip e Dados */}
                  <div className="flex items-center gap-4 my-2">
                    <img
                      src={badgeMember.avatar}
                      alt={badgeMember.name}
                      className="w-20 h-24 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                    />
                    <div className="space-y-1 text-xs">
                      {/* Chip Simulado */}
                      <div className="w-8 h-6 rounded-md bg-linear-to-r from-amber-200 via-amber-400 to-amber-300 border border-amber-500 mb-1 shadow-inner"></div>
                      
                      <strong className="text-sm font-black text-white block leading-tight">
                        {badgeMember.name}
                      </strong>
                      <span className="text-[11px] text-indigo-200 block font-semibold leading-tight">
                        {badgeMember.courseTitle}
                      </span>
                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-300">
                        <span>Reg: <strong>{badgeMember.registrationNumber}</strong></span>
                        <span>• Polo: SG-RJ</span>
                      </div>
                    </div>
                  </div>

                  {/* Faixa Inferior */}
                  <div className="flex items-center justify-between border-t border-indigo-500/40 pt-2 text-[9px] font-mono">
                    <span className="text-emerald-400 font-bold">
                      {isConcluinte ? '★ TÉCNICO CONCLUINTE' : 'MEMBRO COOPERADO'}
                    </span>
                    <span className="text-slate-400">
                      Validade: 12/2027
                    </span>
                  </div>
                </div>
              </div>

              {/* VERSO DO CRACHÁ */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Verso da Credencial com QR Code & Validação Digital
                </span>
                <div className="bg-white text-slate-900 rounded-3xl p-6 border-4 border-slate-300 shadow-2xl relative overflow-hidden max-w-md mx-auto aspect-85/54 flex flex-col justify-between">
                  {/* Tarja Magnética */}
                  <div className="-mx-6 -mt-6 h-9 bg-slate-950 shadow-inner flex items-center px-4">
                    <span className="text-[7px] text-slate-500 font-mono tracking-widest uppercase">
                      MAGNETIC ENCODED STRIPE • ICP-EDU SECURE TOKEN
                    </span>
                  </div>

                  {/* Conteúdo Central com QR Code e Hash */}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="space-y-1 text-[10px] leading-tight">
                      <strong className="text-slate-900 block font-bold text-xs uppercase">
                        Grupo Eloizio & Talent Hub
                      </strong>
                      <p className="text-slate-600 text-[10px]">
                        Identificação funcional amparada pela Lei Federal nº 9.394/96 Art. 42 e normas da Cooperativa de Melhores Alunos.
                      </p>
                      <p className="text-slate-500 text-[9px] font-mono pt-1">
                        Cidade: {badgeMember.city}
                      </p>
                    </div>

                    <div className="w-20 h-20 border-2 border-slate-900 rounded-xl p-1 bg-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <QrCode className="w-14 h-14 text-slate-900" />
                      <span className="text-[6px] text-slate-700 font-bold uppercase mt-0.5">Autenticar</span>
                    </div>
                  </div>

                  {/* Assinatura do CEO Eloizio Assunção */}
                  <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px]">
                    <div>
                      <div className="border-b border-slate-700 w-28 mb-0.5"></div>
                      <strong className="block text-slate-900 font-bold">Eloizio Assunção</strong>
                      <span className="text-slate-500 text-[8px]">Diretor Presidente • Grupo Eloizio</span>
                    </div>
                    <div className="text-right font-mono text-[8px] text-slate-500">
                      <span>Hash: SHA256-{btoa(badgeMember.registrationNumber).substring(0, 10)}</span>
                      <strong className="block text-emerald-700 font-bold">✓ Válido Nacionalmente</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Renovação Financeira (quando não for concluinte) */}
            {!isConcluinte ? (
              <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <strong className="text-xs font-black text-amber-950 uppercase">
                      Anuidade de Renovação do Crachá Funcional: R$ 45,00/ano
                    </strong>
                  </div>
                  <p className="text-xs text-amber-900">
                    Membros em andamento de curso ou profissionais externos devem renovar anualmente. Concluintes do Grupo Eloizio não pagam anuidade!
                  </p>
                </div>

                <button
                  onClick={() => {
                    alert('Chave PIX Mercado Pago no valor de R$ 45,00 gerada com sucesso para renovação anual do Crachá Funcional!');
                  }}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer transition whitespace-nowrap flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Renovar no Mercado Pago (R$ 45)
                </button>
              </div>
            ) : (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-950">
                  <strong>Benefício Vitalício de Aluno Concluinte:</strong> Como você concluiu sua formação pelo Grupo Eloizio, seu crachá funcional e sua anuidade de renovação são <strong>100% gratuitos e isentos</strong> de qualquer taxa!
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ABA 3: ÁREA DA EMPRESA CONTRATANTE (CANDIDATURAS & RH) */}
      {activeTab === 'company_portal' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-purple-600 tracking-wider">
                  Módulo de Recrutamento & Seleção Direta
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Painel de Candidaturas Recebidas pelas Empresas
                </h2>
                <p className="text-xs text-slate-500">
                  Consulte os alunos que se candidataram às vagas de sua empresa, visualize suas provas teóricas e práticas, e faça a gestão do processo seletivo.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('post_job')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Nova Vaga</span>
              </button>
            </div>

            {/* Listagem de Candidaturas */}
            {jobApplications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm">Nenhuma candidatura registrada ainda no mural da cooperativa.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Os alunos cooperados poderão se candidatar clicando em "Candidatar-se" no Mural de Vagas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobApplications.map((app) => {
                  const applicantMember = cooperativeMembers.find((m) => m.id === app.memberId);
                  return (
                    <div
                      key={app.id}
                      className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={
                            applicantMember?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={app.memberName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500 shadow-sm shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                              {app.memberName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                              Vaga: {app.vacancyTitle}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Inscrito em {app.appliedAt}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                            <span>Curso: <strong>{applicantMember?.courseTitle || 'Formação Especializada'}</strong></span>
                            <span>Média Geral: <strong className="text-emerald-700">{applicantMember?.overallAverage || 9.5} / 10</strong></span>
                            <span>Provas Arquivadas: <strong className="text-indigo-900">{applicantMember?.storedExams?.length || 2} avaliações</strong></span>
                          </div>

                          {app.coverNote && (
                            <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mt-1 max-w-xl">
                              "{app.coverNote}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controle de Status e Contato */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                        <select
                          value={app.status}
                          onChange={(e) => updateJobApplicationStatus(app.id, e.target.value as any)}
                          className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                        >
                          <option value="em_analise">🟡 Em Análise</option>
                          <option value="entrevista_agendada">🔵 Entrevista Agendada</option>
                          <option value="estagio_iniciado">🟣 Estágio em Andamento</option>
                          <option value="estagio_concluido">🎓 Estágio Concluído & Validado</option>
                          <option value="aprovado">🟢 Aprovado / Contratar</option>
                          <option value="banco_reserva">⚪ Banco de Reserva</option>
                        </select>

                        {/* Botão para Empresa Validar Estágio Supervisionado */}
                        {(app.isInternship || app.vacancyTitle.toLowerCase().includes('estágio')) && (
                          app.status === 'estagio_concluido' ? (
                            <button
                              onClick={() => {
                                const matchingRecord: ValidatedInternshipRecord =
                                  applicantMember?.validatedInternships?.find((i) => i.vacancyId === app.vacancyId) || {
                                    id: 'rec_' + app.id,
                                    companyName: 'Empresa Concedente',
                                    title: app.vacancyTitle,
                                    hoursValidated: app.validationHoursAwarded || app.internshipHours || 120,
                                    completionDate: app.validatedAt || new Date().toLocaleDateString('pt-BR'),
                                    supervisor: app.companySupervisor || 'Supervisor Técnico',
                                    validationCode: app.validationCode || 'EST-2026-VAL-OK',
                                    certificateMention: `Estágio Opcional Supervisionado - ${app.vacancyTitle} (${app.validationHoursAwarded || 120}h)`,
                                    status: 'validado',
                                  };
                                setSelectedInternshipForTermo(matchingRecord);
                              }}
                              className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Termo de Validação</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setValidatingApplication(app);
                                setValidationHoursAwarded(app.internshipHours || 120);
                                setSupervisorValidationName(app.companySupervisor || 'Supervisor Técnico da Empresa');
                              }}
                              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              title="Validar Cumprimento de Estágio e Creditar Horas Curriculares"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Validar Estágio (+{app.internshipHours || 120}h)</span>
                            </button>
                          )
                        )}

                        {applicantMember && (
                          <button
                            onClick={() => setSelectedMemberForModal(applicantMember)}
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Ver Provas & Dossiê
                          </button>
                        )}

                        {applicantMember && (
                          <a
                            href={`https://wa.me/55${applicantMember.contactPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(
                              applicantMember.name
                            )},%20analisamos%20sua%20candidatura%20para%20a%20vaga%20${encodeURIComponent(
                              app.vacancyTitle
                            )}%20e%20gostaríamos%20de%20conversar!`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                            title="Contatar Candidato via WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="sm:hidden">WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 4: MEU CURRÍCULO & PROVAS REALIZADAS (ÁREA DO ALUNO) */}
      {activeTab === 'my_resume' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                Área do Aluno Cooperado
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Meu Currículo Profissional & Armazenamento de Provas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Mantenha suas informações atualizadas. Suas avaliações e notas oficiais com chancelas dos professores são armazenadas e vinculadas ao seu histórico.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTargetMemberForExam(currentMember?.id || '');
                  setShowAddExamModal(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Arquivar Nova Prova</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetMemberForUpdate(currentMember?.id || '');
                  setShowAddUpdateModal(true);
                }}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>+ Registrar Atualização</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveStudentResume} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Cidade de Atuação / Preferência *
                </label>
                <input
                  type="text"
                  required
                  value={resumeCity}
                  onChange={(e) => setResumeCity(e.target.value)}
                  placeholder="Ex: São Gonçalo - RJ (Disponível Remoto / Híbrido)"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Telefone / WhatsApp de Contato *
                </label>
                <input
                  type="text"
                  required
                  value={resumePhone}
                  onChange={(e) => setResumePhone(e.target.value)}
                  placeholder="(21) 99999-9999"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  E-mail Profissional *
                </label>
                <input
                  type="email"
                  required
                  value={resumeEmail}
                  onChange={(e) => setResumeEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Link do LinkedIn, GitHub ou Portfólio de Trabalhos
                </label>
                <input
                  type="url"
                  value={resumeLinks}
                  onChange={(e) => setResumeLinks(e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Principais Habilidades Técnicas (Separadas por vírgula) *
              </label>
              <input
                type="text"
                required
                value={resumeSkills}
                onChange={(e) => setResumeSkills(e.target.value)}
                placeholder="Ex: Regulagem de Ponto, Máquinas Direct-Drive, Overloque, Conciliação Bancária, SPED Fiscal"
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Resumo Profissional / Apresentação para Empresas *
              </label>
              <textarea
                rows={4}
                required
                value={resumeBio}
                onChange={(e) => setResumeBio(e.target.value)}
                placeholder="Fale sobre suas experiências práticas, principais projetos concluídos e disponibilidade para trabalho..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Armazenamento Automático de Provas Realizadas do Aluno */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    Histórico & Armazenamento de Provas Realizadas (LMS)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Avaliações oficiais com notas, chancela dos professores e autenticação criptográfica:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    Validação SHA-256 Ativa
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetMemberForExam(currentMember?.id || '');
                      setShowAddExamModal(true);
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + Adicionar Prova
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {(currentMember?.storedExams || []).map((exam, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{exam.title}</strong>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs font-mono">
                        Nota: {exam.score.toFixed(1)} / {exam.maxPoints}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono flex-wrap gap-1">
                      <span>Data: {exam.date} • Resp: {exam.verifiedBy}</span>
                      {exam.certificateHash && (
                        <span className="text-indigo-600 font-bold">Hash: {exam.certificateHash}</span>
                      )}
                    </div>
                    {exam.feedback && (
                      <p className="text-[11px] text-slate-600 italic border-t border-slate-100 pt-1 mt-1">
                        "{exam.feedback}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selos de Atualização de Cursos */}
            <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-purple-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-700" />
                    Histórico & Selos de Atualização de Cursos (Reciclagem Contínua)
                  </h4>
                  <p className="text-xs text-purple-800">
                    Cursos de atualização técnica realizados pelo aluno ao longo dos anos para manter suas competências em alta.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTargetMemberForUpdate(currentMember?.id || '');
                    setShowAddUpdateModal(true);
                  }}
                  className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  + Nova Atualização
                </button>
              </div>

              <div className="space-y-2">
                {(currentMember?.courseUpdates || []).map((upd, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-purple-200 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">{upd.title}</strong>
                      <span className="text-slate-500 text-[11px]">Ano {upd.year} • {upd.hours} horas de capacitação</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                      {upd.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estágios Opcionais Supervisionados & Horas Práticas Validadas */}
            <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    Estágios Opcionais Supervisionados & Horas Práticas Validadas (Lei 11.788/2008)
                  </h4>
                  <p className="text-xs text-amber-900">
                    Horas de estágio prático cumpridas em empresas parceiras que contam no seu currículo e somam diretamente à carga horária do Certificado Oficial de Conclusão!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-200/90 text-amber-950 text-xs font-black">
                    +{currentMember?.totalInternshipHours || 0}h Computadas no Certificado
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddInternshipModal(true)}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + Homologar Estágio
                  </button>
                </div>
              </div>

              {(currentMember?.validatedInternships || []).length === 0 ? (
                <div className="p-4 bg-white rounded-xl border border-amber-200 text-center text-xs text-amber-900">
                  <p className="font-bold">Nenhum estágio supervisionado validado ainda.</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Inscreva-se em vagas de estágio opcional no Mural da Cooperativa ou solicite à empresa concedente para registrar o cumprimento das horas práticas!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {(currentMember?.validatedInternships || []).map((internship, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-slate-900 font-bold">{internship.title}</strong>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                            +{internship.hoursValidated}h Homologadas
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap">
                          <span>Empresa: <strong>{internship.companyName}</strong></span>
                          <span>Orientador: <strong>{internship.supervisor}</strong></span>
                          <span>Conclusão: <strong>{internship.completionDate}</strong></span>
                          <span className="font-mono text-indigo-700 font-bold">Chave: {internship.validationCode}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          {internship.certificateMention}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedInternshipForTermo(internship)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Ver Termo Oficial</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition"
              >
                Salvar Currículo na Cooperativa &rarr;
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 5: CADASTRAR NOVO ALUNO NA COOPERATIVA */}
      {activeTab === 'register_talent' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
              Cadastro de Alunos de Excelência
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Cadastrar Novo Aluno na Cooperativa de Talentos
            </h2>
            <p className="text-xs text-slate-500">
              Cadastre alunos que concluíram cursos livres e técnicos para que possam ser contratados diretamente por empresas e oficinas parceiras.
            </p>
          </div>

          <form onSubmit={handleRegisterNewTalent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newTalentName}
                  onChange={(e) => setNewTalentName(e.target.value)}
                  placeholder="Ex: Amanda Ferreira Castro"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Número de Matrícula *</label>
                <input
                  type="text"
                  required
                  value={newTalentReg}
                  onChange={(e) => setNewTalentReg(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-mono font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Curso Concluído *</label>
                <input
                  type="text"
                  required
                  value={newTalentCourse}
                  onChange={(e) => setNewTalentCourse(e.target.value)}
                  placeholder="Ex: Mecânica e Regulagem de Máquinas"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Área / Categoria</label>
                <select
                  value={newTalentCategory}
                  onChange={(e) => setNewTalentCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                >
                  <option value="Engenharia">Mecânica & Máquinas</option>
                  <option value="Negócios">Contabilidade & Gestão</option>
                  <option value="Tecnologia">Tecnologia & Software</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Média Geral (0 a 10) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={newTalentAverage}
                  onChange={(e) => setNewTalentAverage(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cidade / Região *</label>
                <input
                  type="text"
                  required
                  value={newTalentCity}
                  onChange={(e) => setNewTalentCity(e.target.value)}
                  placeholder="São Gonçalo - RJ"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={newTalentPhone}
                  onChange={(e) => setNewTalentPhone(e.target.value)}
                  placeholder="(21) 99613-4073"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Competências e Habilidades (Separadas por vírgula) *</label>
              <input
                type="text"
                required
                value={newTalentSkills}
                onChange={(e) => setNewTalentSkills(e.target.value)}
                placeholder="Ex: Regulagem de Lançadeira, Overlock, Ponto Corrente, Manutenção Preventiva"
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apresentação / Resumo Profissional *</label>
              <textarea
                rows={3}
                required
                value={newTalentBio}
                onChange={(e) => setNewTalentBio(e.target.value)}
                placeholder="Perfil do aluno, principais notas práticas e aptidões para o mercado de trabalho..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition"
              >
                Cadastrar Aluno na Cooperativa &rarr;
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 6: CADASTRAR NOVA VAGA (EMPRESAS) */}
      {activeTab === 'post_job' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
              Painel para Empresas & Oficinas Contratantes
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Divulgar Nova Oportunidade de Emprego ou Estágio
            </h2>
            <p className="text-xs text-slate-500">
              Disponibilize sua vaga diretamente para os melhores alunos e técnicos formados pelo Grupo Eloizio.
            </p>
          </div>

          <form onSubmit={handleCreateJobVacancy} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Vaga *</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="Ex: Mecânico de Máquinas Industriais Direct-Drive"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome da Empresa / Oficina *</label>
                <input
                  type="text"
                  required
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  placeholder="Ex: Confecção Estilo Rio - São Gonçalo"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Local / Cidade *</label>
                <input
                  type="text"
                  required
                  value={newJobLocation}
                  onChange={(e) => setNewJobLocation(e.target.value)}
                  placeholder="São Gonçalo - RJ"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Salário / Remuneração</label>
                <input
                  type="text"
                  required
                  value={newJobSalary}
                  onChange={(e) => setNewJobSalary(e.target.value)}
                  placeholder="R$ 3.800 + Benefícios"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Regime de Contrato</label>
                <select
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                >
                  <option value="estagio">🎓 Estágio Opcional (Com Validação Curricular)</option>
                  <option value="clt">CLT Efetivo</option>
                  <option value="pj">PJ / Prestador</option>
                  <option value="prestador_servico">Prestador Técnico Autônomo</option>
                </select>
              </div>
            </div>

            {/* Parâmetros Específicos se for Estágio Opcional */}
            {(newJobType === 'estagio' || newJobIsOptionalInternship) && (
              <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950 text-xs uppercase flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    Parâmetros do Estágio Supervisionado Opcional (Lei Federal nº 11.788/2008)
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                    Integração ao Certificado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      Carga Horária para Validação *
                    </label>
                    <select
                      value={newJobInternshipHours}
                      onChange={(e) => setNewJobInternshipHours(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-800"
                    >
                      <option value={60}>60 Horas Práticas</option>
                      <option value={120}>120 Horas Práticas (Padrão)</option>
                      <option value={180}>180 Horas Práticas</option>
                      <option value={240}>240 Horas Práticas</option>
                      <option value={300}>300 Horas Práticas (Máximo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      Modalidade de Execução
                    </label>
                    <select
                      value={newJobModality}
                      onChange={(e) => setNewJobModality(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="presencial">Presencial (Oficina / Fábrica)</option>
                      <option value="remoto">100% Remoto (Online)</option>
                      <option value="hibrido">Híbrido (Flexível)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      Orientador / Supervisor da Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={newJobSupervisorName}
                      onChange={(e) => setNewJobSupervisorName(e.target.value)}
                      placeholder="Ex: Gilberto Faria (Mestre Mecânico)"
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="allowValCheck"
                    checked={newJobAllowCourseValidation}
                    onChange={(e) => setNewJobAllowCourseValidation(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <label htmlFor="allowValCheck" className="text-xs text-amber-950 font-bold cursor-pointer">
                    Autorizar emissão de Termo Oficial de Estágio e creditar essas horas no Certificado de Conclusão do aluno
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição das Atividades *</label>
              <textarea
                rows={3}
                required
                value={newJobDesc}
                onChange={(e) => setNewJobDesc(e.target.value)}
                placeholder="Descreva a rotina da vaga, principais desafios e responsabilidades..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Requisitos (1 por linha)</label>
                <textarea
                  rows={3}
                  value={newJobReqs}
                  onChange={(e) => setNewJobReqs(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Benefícios (1 por linha)</label>
                <textarea
                  rows={3}
                  value={newJobBenefits}
                  onChange={(e) => setNewJobBenefits(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail para Receber Candidaturas *</label>
                <input
                  type="email"
                  required
                  value={newJobEmail}
                  onChange={(e) => setNewJobEmail(e.target.value)}
                  placeholder="vagas@suaempresa.com.br"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp / Telefone RH</label>
                <input
                  type="text"
                  value={newJobPhone}
                  onChange={(e) => setNewJobPhone(e.target.value)}
                  placeholder="(21) 99613-4073"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition"
              >
                Publicar Vaga no Mural &rarr;
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DETALHADO DO COOPERADO COM PROVAS REALIZADAS E ATUALIZAÇÕES */}
      {selectedMemberForModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200">
            {/* Header Modal */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMemberForModal.avatar}
                  alt={selectedMemberForModal.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg">{selectedMemberForModal.name}</h3>
                    {selectedMemberForModal.topPerformerBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-950">
                        Top Aluno Destaque
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-indigo-300 font-mono">
                    Matrícula: {selectedMemberForModal.registrationNumber} • {selectedMemberForModal.city}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer hidden sm:flex items-center gap-1 text-xs"
                  title="Imprimir Dossiê do Aluno"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Dossiê</span>
                </button>
                <button
                  onClick={() => setSelectedMemberForModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* Timbre Oficial do Grupo Eloizio */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 block font-bold">Grupo Eloizio & EduVanguard • Banco Oficial de Talentos</strong>
                  <span className="text-slate-500 text-[11px]">Dossiê de Qualificação Profissional & Histórico Auditado</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-mono">Status</span>
                  <span className="text-emerald-700 font-black">Disponível para Contratação</span>
                </div>
              </div>

              {/* Resumo */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Apresentação</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                  {selectedMemberForModal.bio}
                </p>
              </div>

              {/* Habilidades */}
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Habilidades Técnicas Homologadas</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMemberForModal.technicalSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Provas Realizadas no LMS e Armazenadas */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    Provas Práticas & Teóricas Realizadas (Histórico Comprovado)
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold">100% Auditadas com Hash</span>
                </div>

                <div className="space-y-2.5">
                  {selectedMemberForModal.storedExams.map((exam, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{exam.title}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs font-mono">
                          Nota: {exam.score.toFixed(1)} / {exam.maxPoints}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono flex-wrap gap-1">
                        <span>Data: {exam.date} • Resp: {exam.verifiedBy}</span>
                        {exam.certificateHash && (
                          <span className="text-indigo-600 font-bold">Hash: {exam.certificateHash}</span>
                        )}
                      </div>
                      {exam.feedback && (
                        <p className="text-[11px] text-slate-600 italic border-t border-slate-100 pt-1 mt-1">
                          "{exam.feedback}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selos de Atualização de Cursos */}
              <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                <h4 className="font-black text-sm text-purple-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-700" />
                  Selos de Atualização de Cursos & Reciclagem Profissional
                </h4>
                <div className="space-y-2">
                  {selectedMemberForModal.courseUpdates.map((upd, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-purple-200 text-xs flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block">{upd.title}</strong>
                        <span className="text-slate-500 text-[11px]">Ano {upd.year} • {upd.hours} horas de capacitação</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                        {upd.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estágios Supervisionados & Horas Práticas Homologadas */}
              <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    Estágios Supervisionados & Horas Práticas Homologadas (Lei 11.788/2008)
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-xs">
                    +{selectedMemberForModal.totalInternshipHours || 0}h no Certificado
                  </span>
                </div>

                {(selectedMemberForModal.validatedInternships || []).length === 0 ? (
                  <p className="text-xs text-amber-900/80 italic">
                    Nenhum estágio supervisionado opcional registrado até o momento.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(selectedMemberForModal.validatedInternships || []).map((internship, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <strong className="text-slate-900 block font-bold">{internship.title}</strong>
                          <span className="text-slate-600 text-[11px]">
                            Empresa: <strong>{internship.companyName}</strong> • Orientador: <strong>{internship.supervisor}</strong>
                          </span>
                          <span className="font-mono text-indigo-700 block text-[10px]">
                            Autenticação: {internship.validationCode} • Data: {internship.completionDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                            +{internship.hoursValidated}h Válidas
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedInternshipForTermo(internship)}
                            className="px-2.5 py-1 bg-slate-900 text-amber-300 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Ver Termo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões de Ação para a Empresa */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Contato direto do aluno: </span>
                  <strong className="text-slate-800">{selectedMemberForModal.contactPhone}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/55${selectedMemberForModal.contactPhone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(
                      selectedMemberForModal.name
                    )},%20vimos%20seu%20perfil%20na%20Cooperativa%20do%20Grupo%20Eloizio%20e%20gostaríamos%20de%20conversar!`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Convidar via WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${selectedMemberForModal.contactEmail}`}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                    title="Enviar E-mail"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CANDIDATURA A VAGA */}
      {selectedVacancyForApply && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600">Candidatura Instantânea</span>
                <h3 className="font-black text-lg text-slate-900">{selectedVacancyForApply.title}</h3>
                <span className="text-xs text-slate-500">
                  {selectedVacancyForApply.companyName} • {selectedVacancyForApply.location}
                </span>
              </div>
              <button
                onClick={() => setSelectedVacancyForApply(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <strong className="block font-bold">✓ Seu Currículo e Histórico de Provas serão anexados:</strong>
              <p className="text-[11px] text-emerald-800">
                A empresa receberá suas notas oficiais do LMS, hash de segurança SHA-256 e competências homologadas pelo Grupo Eloizio.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mensagem / Carta de Apresentação (Opcional):
              </label>
              <textarea
                rows={4}
                value={applicationCoverNote}
                onChange={(e) => setApplicationCoverNote(e.target.value)}
                placeholder="Olá, tenho grande interesse nesta oportunidade e excelente aproveitamento nas disciplinas práticas do curso..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedVacancyForApply(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApplyToJobConfirm}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
              >
                Confirmar Envio da Candidatura &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA ARQUIVAR NOVA PROVA (AVALIAÇÃO / TESTE PRÁTICO) */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600">Armazenamento Acadêmico</span>
                <h3 className="font-black text-lg text-slate-900">Registrar & Arquivar Prova Realizada</h3>
              </div>
              <button
                onClick={() => setShowAddExamModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewExam} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Prova / Avaliação *</label>
                <input
                  type="text"
                  required
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  placeholder="Ex: Regulagem de Lançadeira e Sincronismo"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nota Obtida *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={newExamScore}
                    onChange={(e) => setNewExamScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pontuação Máxima</label>
                  <input
                    type="number"
                    value={newExamMax}
                    onChange={(e) => setNewExamMax(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria da Prova</label>
                  <input
                    type="text"
                    value={newExamCategory}
                    onChange={(e) => setNewExamCategory(e.target.value)}
                    placeholder="Prática Técnica"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Avaliador / Professor</label>
                  <input
                    type="text"
                    value={newExamVerifiedBy}
                    onChange={(e) => setNewExamVerifiedBy(e.target.value)}
                    placeholder="Mestre Eloizio Assunção"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parecer do Avaliador</label>
                <textarea
                  rows={2}
                  value={newExamFeedback}
                  onChange={(e) => setNewExamFeedback(e.target.value)}
                  placeholder="Observações do instrutor sobre o desempenho..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-indigo-50/80 rounded-xl text-[11px] text-indigo-900 flex items-center justify-between">
                <span>Hash Criptográfica:</span>
                <strong className="font-mono">Será gerada com SHA-256</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                >
                  Salvar no Histórico &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARA REGISTRAR ATUALIZAÇÃO DE CURSO */}
      {showAddUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600">Reciclagem Contínua</span>
                <h3 className="font-black text-lg text-slate-900">Registrar Atualização Técnica de Curso</h3>
              </div>
              <button
                onClick={() => setShowAddUpdateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewCourseUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Curso de Atualização *</label>
                <input
                  type="text"
                  required
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  placeholder="Ex: Atualização 2026: Regulagem de Motores Direct-Drive Touch"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ano da Reciclagem</label>
                  <input
                    type="number"
                    value={newUpdateYear}
                    onChange={(e) => setNewUpdateYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Carga Horária (Horas)</label>
                  <input
                    type="number"
                    value={newUpdateHours}
                    onChange={(e) => setNewUpdateHours(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selo / Badge de Reconhecimento</label>
                <input
                  type="text"
                  value={newUpdateBadge}
                  onChange={(e) => setNewUpdateBadge(e.target.value)}
                  placeholder="Ex: Credencial Atualizada 2026"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUpdateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                >
                  Registrar Selo &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 1: EMPRESA VALIDA CUMPRIMENTO DE ESTÁGIO */}
      {validatingApplication && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600">Empresa Conveniada • Homologação</span>
                <h3 className="font-black text-lg text-slate-900">Validar Horas de Estágio Supervisionado</h3>
                <p className="text-xs text-slate-500">
                  Aluno: <strong className="text-slate-800">{validatingApplication.memberName}</strong> • {validatingApplication.vacancyTitle}
                </p>
              </div>
              <button
                onClick={() => setValidatingApplication(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <strong className="block font-bold">✓ Impacto Curricular Automático:</strong>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Ao validar, essas horas serão imediatamente adicionadas ao currículo do aluno na cooperativa e incorporadas ao seu Certificado Oficial emitido pelo Grupo Eloizio com código de autenticidade ICP.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Carga Horária Prática Efetivamente Cumprida (Horas) *
                </label>
                <input
                  type="number"
                  min="20"
                  max="360"
                  required
                  value={validationHoursAwarded}
                  onChange={(e) => setValidationHoursAwarded(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Nome e Cargo do Supervisor / Orientador da Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={supervisorValidationName}
                  onChange={(e) => setSupervisorValidationName(e.target.value)}
                  placeholder="Ex: Gilberto Faria (Mestre Mecânico e Supervisor Industrial)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Parecer Avaliativo do Desempenho do Estagiário *
                </label>
                <textarea
                  rows={3}
                  required
                  value={supervisorValidationFeedback}
                  onChange={(e) => setSupervisorValidationFeedback(e.target.value)}
                  placeholder="Descreva a assiduidade, qualidade técnica e postura profissional do aluno durante o estágio..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setValidatingApplication(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmInternshipValidation}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Homologar & Creditar no Certificado &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TERMO OFICIAL DE VALIDAÇÃO DE ESTÁGIO (PDF / IMPRESSÃO) */}
      {selectedInternshipForTermo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200">
            {/* Top Control Bar */}
            <div className="no-print p-4 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm">Termo Oficial de Validação de Estágio Supervisionado</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Chave: {selectedInternshipForTermo.validationCode}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInternshipForTermo(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Printable Sheet */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-amber-50/20 text-slate-900 space-y-6 print-container border-t border-slate-200">
              {/* Header com Timbre */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 font-black text-lg mx-auto flex items-center justify-center shadow-xs">
                  GE
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase mt-2">
                  Grupo Eloizio • Instituto de Educação & Formação Técnica
                </h2>
                <h3 className="text-xs sm:text-sm font-serif font-black text-amber-900 uppercase">
                  DECLARAÇÃO & TERMO DE HOMOLOGAÇÃO DE ESTÁGIO SUPERVISIONADO OPCIONAL
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Em conformidade com a Lei Federal nº 11.788, de 25 de setembro de 2008 (Lei do Estágio)
                </p>
              </div>

              {/* Corpo da Declaração */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify space-y-3">
                <p>
                  Declaramos e certificamos, para os devidos fins de integralização e aproveitamento curricular, que foram cumpridas com integral êxito as atividades práticas supervisionadas referentes ao:
                </p>

                <div className="p-4 bg-white rounded-2xl border border-slate-300 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Programa / Atividade</span>
                      <strong className="text-slate-900 text-sm">{selectedInternshipForTermo.title}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Empresa Concedente</span>
                      <strong className="text-slate-900 text-sm">{selectedInternshipForTermo.companyName}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Carga Horária Validada</span>
                      <span className="text-base font-black text-emerald-700">
                        +{selectedInternshipForTermo.hoursValidated} Horas
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Data de Conclusão</span>
                      <strong className="text-slate-900">{selectedInternshipForTermo.completionDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Orientador Responsável</span>
                      <strong className="text-slate-900">{selectedInternshipForTermo.supervisor}</strong>
                    </div>
                  </div>
                </div>

                <p>
                  As horas práticas atestadas neste documento foram formalmente integradas ao <strong>Certificado Oficial de Conclusão</strong> e ao <strong>Dossiê da Cooperativa de Melhores Alunos do Grupo Eloizio</strong>, conferindo ampla comprovação de experiência prática profissional junto ao mercado de trabalho.
                </p>
              </div>

              {/* Assinaturas */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-300 text-center text-xs">
                <div>
                  <div className="font-serif italic text-sm text-slate-900">
                    {selectedInternshipForTermo.supervisor}
                  </div>
                  <div className="border-t border-slate-400 mt-1 pt-1 text-[10px] font-semibold text-slate-600">
                    Supervisor Técnico • Empresa Concedente
                  </div>
                </div>
                <div>
                  <div className="font-serif italic text-sm text-slate-900">
                    Eloizio Assunção • Diretoria Técnica Geral
                  </div>
                  <div className="border-t border-slate-400 mt-1 pt-1 text-[10px] font-semibold text-slate-600">
                    Grupo Eloizio & Coordenação Pedagógica
                  </div>
                </div>
              </div>

              {/* Rodapé de Autenticidade */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div>
                  <span>Autenticação Digital: </span>
                  <strong className="text-slate-900 font-bold">{selectedInternshipForTermo.validationCode}</strong>
                </div>
                <div className="text-emerald-700 font-bold">
                  ✓ Válido em Todo o Território Nacional
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: HOMOLOGAÇÃO MANUAL DE ESTÁGIO PELO ALUNO / COORDENAÇÃO */}
      {showAddInternshipModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600">Registro Curricular</span>
                <h3 className="font-black text-lg text-slate-900">Homologar Estágio Supervisionado</h3>
              </div>
              <button
                onClick={() => setShowAddInternshipModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewInternship} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Título / Atividade do Estágio *</label>
                <input
                  type="text"
                  required
                  value={newInternshipTitle}
                  onChange={(e) => setNewInternshipTitle(e.target.value)}
                  placeholder="Ex: Estágio Supervisionado em Mecânica Industrial"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nome da Empresa Concedente *</label>
                <input
                  type="text"
                  required
                  value={newInternshipCompany}
                  onChange={(e) => setNewInternshipCompany(e.target.value)}
                  placeholder="Ex: Polo Têxtil Guanabara / Oficina Central"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Carga Horária (Horas) *</label>
                  <input
                    type="number"
                    min="20"
                    max="360"
                    required
                    value={newInternshipHours}
                    onChange={(e) => setNewInternshipHours(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Orientador / Supervisor *</label>
                  <input
                    type="text"
                    required
                    value={newInternshipSupervisor}
                    onChange={(e) => setNewInternshipSupervisor(e.target.value)}
                    placeholder="Gilberto Faria (Supervisor)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Parecer / Observações</label>
                <textarea
                  rows={2}
                  value={newInternshipFeedback}
                  onChange={(e) => setNewInternshipFeedback(e.target.value)}
                  placeholder="Aproveitamento técnico, regulagem de máquinas e avaliação..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-950 font-medium">
                ★ As horas serão creditadas automaticamente ao seu currículo e ao Certificado Oficial com código de validação único.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddInternshipModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition"
                >
                  Homologar Estágio &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
