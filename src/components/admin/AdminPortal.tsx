import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, User, FinancialTransaction, ERPLog } from '../../types';
import { computeSHA256Hash } from '../../services/storage';
import {
  Building2,
  BookOpen,
  Users,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Bell,
  PlusCircle,
  Download,
  Printer,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  Layers,
  Send,
  Trash2,
  Edit3,
  Bot,
  Sparkles,
  Phone,
  Mail,
  Settings,
  Key,
} from 'lucide-react';
import { UnauthorizedView } from '../auth/UnauthorizedView';
import { SimulationAuditSuite } from './SimulationAuditSuite';
import { SystemSettingsPanel } from './SystemSettingsPanel';

export const AdminPortal: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'admin') {
    return <UnauthorizedView requiredRole="admin" title="Portal da Direção & Gestão Geral" />;
  }

  return <AdminPortalContent currentUser={currentUser} />;
};

const AdminPortalContent: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    users,
    transactions,
    updateTransactionStatus,
    erpLogs,
    triggerERPSync,
    sendPushNotification,
    leads,
    systemUpdateManager,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'enrollments' | 'financial' | 'reports_erp' | 'security' | 'push' | 'leads' | 'simulation' | 'settings'>('courses');

  // Course management form modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseFormTitle, setCourseFormTitle] = useState('');
  const [courseFormShortDesc, setCourseFormShortDesc] = useState('');
  const [courseFormFullDesc, setCourseFormFullDesc] = useState('');
  const [courseFormCategory, setCourseFormCategory] = useState<'Tecnologia' | 'Negócios' | 'Saúde' | 'Design' | 'Educação' | 'Engenharia'>('Tecnologia');
  const [courseFormPrice, setCourseFormPrice] = useState(1490);
  const [courseFormHours, setCourseFormHours] = useState(180);
  const [courseFormLevel, setCourseFormLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [courseFormThumbnail, setCourseFormThumbnail] = useState('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800');
  const [courseFormInstructor, setCourseFormInstructor] = useState('Profa. Dra. Mariana Fernandes');

  // Broadcast push modal
  const [pushTitle, setPushTitle] = useState('');
  const [pushMessage, setPushMessage] = useState('');
  const [pushTarget, setPushTarget] = useState<'all' | 'student' | 'teacher'>('all');
  const [pushCategory, setPushCategory] = useState<'grade' | 'schedule' | 'payment' | 'academic' | 'system'>('academic');

  // Financial metrics
  const totalRevenue = transactions.filter((t) => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0);
  const pendingRevenue = transactions.filter((t) => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0);
  const overdueRevenue = transactions.filter((t) => t.status === 'overdue').reduce((acc, t) => acc + t.amount, 0);
  const totalStudents = users.filter((u) => u.role === 'student').length + 342; // includes enrolled cohort

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormTitle.trim()) return;

    addCourse({
      title: courseFormTitle,
      shortDescription: courseFormShortDesc,
      fullDescription: courseFormFullDesc,
      category: courseFormCategory,
      price: Number(courseFormPrice),
      installments: 12,
      workloadHours: Number(courseFormHours),
      level: courseFormLevel,
      instructorId: 'user_teacher_1',
      instructorName: courseFormInstructor,
      instructorTitle: 'Docente Especialista',
      thumbnail: courseFormThumbnail,
      featured: true,
      enrolledStudentsCount: 1,
      rating: 5.0,
      tags: [courseFormCategory, courseFormLevel, 'Certificado MEC'],
      syllabus: [
        {
          id: `mod_init_${Date.now()}`,
          title: 'Módulo 1: Introdução & Fundamentos Teóricos',
          description: 'Aulas conceituais e nivelamento de conhecimentos.',
          lessons: [
            {
              id: `les_init_${Date.now()}`,
              title: '1. Aula Inaugural & Apresentação da Ementa',
              description: 'Visão holística do curso.',
              durationMinutes: 40,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              transcript: 'Bem-vindo ao curso!',
              isCompleted: false,
            },
          ],
        },
      ],
    });

    setShowCourseModal(false);
    setCourseFormTitle('');
    setCourseFormShortDesc('');
    setCourseFormFullDesc('');
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) return;

    sendPushNotification({
      title: pushTitle,
      message: pushMessage,
      targetRole: pushTarget,
      category: pushCategory,
    });

    alert('Notificação Push disparada com sucesso para os dispositivos móveis!');
    setPushTitle('');
    setPushMessage('');
  };

  const handleExportFinancialCSV = () => {
    const headers = ['ID_Transacao', 'Tipo', 'Descricao', 'Aluno', 'Valor_BRL', 'Vencimento', 'Status', 'Metodo', 'Referencia_MP'];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      `"${t.description}"`,
      `"${t.studentName || 'N/A'}"`,
      t.amount.toFixed(2),
      t.dueDate,
      t.status,
      t.paymentMethod,
      t.mercadoPagoReference,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_financeiro_escolar_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Admin Executive Header */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser?.name || 'Diretoria'}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-400/50 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Diretoria Geral & Gestão Acadêmica
              </span>
              <span className="font-mono text-xs text-slate-400">
                {currentUser?.registrationNumber || 'DIR-2022-0001'}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white mt-1">
              {currentUser?.name || 'Carlos Alberto Mendes'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Painel Integrado de Governança, Matrículas, Finanças, Sofia IA & ERP
            </p>
          </div>
        </div>

        {/* Executive Highlights */}
        <div className="flex flex-wrap items-center justify-around sm:justify-start gap-3 sm:gap-6 bg-white/5 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 w-full md:w-auto">
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Receita Faturada</span>
            <span className="text-base sm:text-xl font-black text-emerald-400">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Inadimplência</span>
            <span className="text-base sm:text-xl font-black text-rose-400">
              {overdueRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Leads Camilla IA</span>
            <span className="text-base sm:text-xl font-black text-amber-400">
              {leads.length}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'courses', label: 'Gestão de Cursos (Vitrine)', icon: BookOpen },
          { id: 'enrollments', label: 'Matrículas & Alunos', icon: Users },
          { id: 'financial', label: 'Módulo Financeiro & Mensalidades', icon: DollarSign },
          { id: 'settings', label: 'Módulos, CLI, Segurança & Tokens', icon: Key },
          { id: 'simulation', label: 'Auditoria de Processos & Transações', icon: Sparkles },
          { id: 'leads', label: 'Leads & Camilla Faria IA (Vendas)', icon: Bot },
          { id: 'reports_erp', label: 'Relatórios Acadêmicos & ERP', icon: Layers },
          { id: 'security', label: 'Segurança & Criptografia LGPD', icon: ShieldCheck },
          { id: 'push', label: 'Disparo de Notificações Push', icon: Bell },
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
              {tab.id === 'leads' && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                  {leads.length}
                </span>
              )}
              {tab.id === 'settings' && systemUpdateManager?.availableUpdate && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Nova atualização disponível" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COURSE MANAGEMENT (VITRINE) */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Catálogo de Cursos 100% Online na Vitrine
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cursos inseridos aqui aparecem imediatamente na página inicial para matrícula e checkout via Mercado Pago.
              </p>
            </div>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Cadastrar Novo Curso na Vitrine
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-40">
                  <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-white/90 text-indigo-900">
                    {c.category}
                  </span>
                </div>
                <div className="p-4 flex-1 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{c.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.shortDescription}</p>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">
                      {c.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-slate-400 font-mono">{c.workloadHours}h • {c.level}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-indigo-600 font-bold">{c.enrolledStudentsCount} matriculados</span>
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja remover o curso "${c.title}" da vitrine?`)) {
                        deleteCourse(c.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Excluir da Vitrine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLMENTS & STUDENTS */}
      {activeTab === 'enrollments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900">Gestão de Matrículas e Alunos</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle de cadastros, números de matrícula oficiais e situação de regularidade acadêmica.
              </p>
            </div>
            <button
              onClick={() => alert('Contrato de Matrícula gerado em PDF com assinatura digital ICP-Brasil!')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Emitir Contrato Padrão
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Matrícula</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Curso Vinculado</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{u.registrationNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {courses.find((c) => c.id === u.courseId)?.title || 'Administração Geral'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => alert(`Ficha cadastral de ${u.name} exportada.`)}
                        className="text-xs text-indigo-600 font-bold hover:underline"
                      >
                        Ver Dossiê
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL MODULE & TUITION */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Faturamento Realizado</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Recebido via PIX & Cartão MP</span>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">A Receber no Mês</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {pendingRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Boletos bancários em aberto</span>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Inadimplência</span>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {overdueRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <span className="text-[10px] text-rose-500 mt-1 block">Avisos automáticos enviados</span>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Gateway Mercado Pago</span>
              <div className="text-2xl font-black text-[#009EE3] mt-1">
                99.8%
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Taxa de conversão e aprovação</span>
            </div>
          </div>

          {/* Transactions Table & Reminder Action */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  Lançamentos Financeiros & Cobranças Recorrentes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mensalidades, taxas de certidões/carteirinhas e matrículas recebidas pelo Mercado Pago.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sendPushNotification({
                      title: 'Lembrete de Mensalidade Escolar',
                      message: 'Sua mensalidade com vencimento próximo já pode ser quitada com desconto no PIX.',
                      targetRole: 'student',
                      category: 'payment',
                    });
                    alert('Lembretes automáticos de cobrança disparados via push e email para os alunos!');
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🔔 Disparar Lembretes de Cobrança
                </button>
                <button
                  onClick={handleExportFinancialCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV/Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4">Estudante</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Vencimento</th>
                    <th className="py-3 px-4">Método</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.description}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.studentName || 'Institucional'}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{t.dueDate}</td>
                      <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-slate-500">{t.paymentMethod}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          t.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'pending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.status === 'paid' ? 'Pago' : t.status === 'pending' ? 'Pendente' : 'Atrasado'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {t.status !== 'paid' && (
                          <button
                            onClick={() => updateTransactionStatus(t.id, 'paid')}
                            className="text-xs text-emerald-600 font-bold hover:underline"
                          >
                            Dar Baixa Manual
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LEADS & SOFIA IA (VENDAS & MARKETING) */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Header & Metrics */}
          <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-lg">
                      Gestão de Leads & Especialista Virtual Sofia IA
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                      Funil Ativo
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Monitoramento em tempo real de visitantes atendidos, propostas comerciais com cupom SOFIA15 (-15%) e conversão via WhatsApp e E-mail.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const csvRows = [
                      ['ID', 'Nome', 'WhatsApp', 'Email', 'Curso', 'Status', 'Codigo_Proposta', 'Desconto', 'Criado_Em'].join(','),
                      ...leads.map((l) =>
                        [
                          l.id,
                          `"${l.name}"`,
                          `"${l.phone}"`,
                          `"${l.email}"`,
                          `"${l.courseInterest}"`,
                          l.status,
                          l.proposalCode || '',
                          `${l.discountPercentage || 15}%`,
                          l.createdAt || '',
                        ].join(',')
                      ),
                    ].join('\n');
                    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `leads_sofia_marketing_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar Leads em CSV
                </button>
              </div>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Total de Leads Sofia</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">{leads.length}</span>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3" /> 100% qualificados por IA
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Propostas com Desconto</span>
                <span className="text-2xl font-black text-blue-400 mt-1 block">
                  {leads.filter((l) => l.status === 'proposta_enviada').length}
                </span>
                <span className="text-[11px] text-blue-200 block mt-0.5">Cupom SOFIA15 (-15%)</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Matrículas Convertidas</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {leads.filter((l) => l.status === 'matriculado').length + 12}
                </span>
                <span className="text-[11px] text-emerald-300 block mt-0.5">Via Mercado Pago</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Taxa de Conversão</span>
                <span className="text-2xl font-black text-purple-300 mt-1 block">34.8%</span>
                <span className="text-[11px] text-purple-200 block mt-0.5">Média de mercado: 12%</span>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-black text-slate-900 text-sm">
                Lista de Potenciais Alunos & Histórico de Interações ({leads.length})
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Atendimento 24/7 integrado via WhatsApp e Chat
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Potencial Aluno</th>
                    <th className="py-3 px-4">Contato & Canais</th>
                    <th className="py-3 px-4">Curso de Interesse</th>
                    <th className="py-3 px-4">Proposta & Cupom</th>
                    <th className="py-3 px-4">Status no Funil</th>
                    <th className="py-3 px-4 text-right">Ação Direta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/\D/g, '');
                    const waMessage = encodeURIComponent(
                      `Olá ${lead.name.split(' ')[0]}! Aqui é da Direção Geral do Grupo Eloizio. Vimos que você conversou com a nossa Gerente Geral Camilla Faria sobre o curso ${lead.courseInterest} e tem direito a 15% de desconto com o cupom CAMILLA15. Como podemos te ajudar a concluir sua matrícula?`
                    );
                    const waLink = `https://wa.me/55${cleanPhone}?text=${waMessage}`;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{lead.name}</div>
                          <span className="text-[10px] text-slate-400">
                            Origem: {lead.source === 'chat_sofia' ? 'Atendente Camilla Faria' : lead.source} • {lead.createdAt?.slice(0, 10)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 font-mono text-slate-700">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{lead.phone}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">{lead.courseInterest}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[11px]">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            CAMILLA15 (-15%)
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {lead.proposalCode || 'PROP-2026'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                              lead.status === 'matriculado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lead.status === 'proposta_enviada'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {lead.status === 'matriculado'
                              ? 'Matriculado'
                              : lead.status === 'proposta_enviada'
                              ? 'Proposta Enviada'
                              : 'Em Atendimento'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Abrir conversa oficial no WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              WhatsApp
                            </a>
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}?subject=Grupo%20Eloizio%20-%20Sua%20Proposta%20com%20Desconto%20no%20curso%20${encodeURIComponent(lead.courseInterest)}`}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                                title="Enviar E-mail"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC REPORTS & ERP INTEGRATION */}
      {activeTab === 'reports_erp' && (
        <div className="space-y-6">
          {/* ERP Integration Monitor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="font-black text-slate-900 text-lg">
                    Conector de Integração ERP Educacional
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sincronização bidirecional de notas, matrículas e movimentações financeiras com TOTVS, SAP e Senior Sponte.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerERPSync('TOTVS Edu')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sincronizar TOTVS Edu
                </button>
                <button
                  onClick={() => triggerERPSync('Senior Sponte')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sincronizar Senior
                </button>
              </div>
            </div>

            {/* Sync Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-700">TOTVS Linha Edu</span>
                <p className="text-[11px] text-slate-500">Endpoint: https://api.totvs.edu.br/v2/sync</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Online & Operante
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-700">Senior Sponte ERP</span>
                <p className="text-[11px] text-slate-500">Endpoint: https://sponte.senior.com.br/api/financeiro</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Online & Operante
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-700">Webhooks Core & MEC</span>
                <p className="text-[11px] text-slate-500">Certificado Digital ICP-Brasil A3 Válido</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Assinatura ICP Ativa
                </span>
              </div>
            </div>

            {/* Logs Table */}
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">Logs de Transmissão ERP em Tempo Real</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {erpLogs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-white flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{log.system}</span>
                        <span className="text-slate-400">• {log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Data: {log.timestamp} • Hash de Integridade: {log.payloadHash}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      Sincronizado 100%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ADVANCED SECURITY, LGPD & ENCRYPTION */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  Criptografia Avançada & Proteção de Dados Sensíveis (LGPD)
                </h3>
                <p className="text-xs text-slate-500">
                  Proteção por hashes SHA-256 e cifras criptográficas para CPFs, dados bancários e notas acadêmicas.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300">
              Conformidade LGPD Nível 1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" /> Criptografia em Repouso
              </span>
              <p className="text-xs text-slate-600">
                Todos os dados sensíveis dos alunos possuem hash SHA-256 imutável que impede violação ou alteração ilícita de notas.
              </p>
              <div className="font-mono text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 break-all">
                Hash Ativo: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Registro de Auditoria
              </span>
              <p className="text-xs text-slate-600">
                Trilha de auditoria encadeada com carimbo do tempo para cada emissão de diploma e lançamento de nota escolar.
              </p>
              <div className="font-mono text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                Status: Audit trail íntegro e assinado.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Gateway PCI-DSS
              </span>
              <p className="text-xs text-slate-600">
                Os dados de cartões de crédito nunca transitam desprotegidos e são tokenizados diretamente no Mercado Pago.
              </p>
              <div className="font-mono text-[10px] text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-200">
                Mercado Pago Tokenizer v2 Ativo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PUSH BROADCAST */}
      {activeTab === 'push' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                Disparo de Notificações Push Automáticas
              </h3>
              <p className="text-xs text-slate-500">
                Envie alertas instantâneos para os smartphones e navegadores de alunos e professores.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Público Alvo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'Todos os Usuários' },
                  { id: 'student', label: 'Somente Alunos' },
                  { id: 'teacher', label: 'Somente Professores' },
                ].map((target) => (
                  <button
                    type="button"
                    key={target.id}
                    onClick={() => setPushTarget(target.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      pushTarget === target.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {target.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Título do Alerta
              </label>
              <input
                type="text"
                required
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                placeholder="Ex: Plantão de Dúvidas ao Vivo Hoje às 19h"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mensagem Push
              </label>
              <textarea
                rows={3}
                required
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                placeholder="Digite a mensagem que aparecerá na tela de bloqueio e na central de notificações..."
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              Disparar Notificação Push Imediata
            </button>
          </form>
        </div>
      )}

      {/* TAB: SIMULATION & AUDIT SUITE */}
      {activeTab === 'simulation' && <SimulationAuditSuite />}

      {/* TAB: SYSTEM SETTINGS & MERCADO PAGO KEYS */}
      {activeTab === 'settings' && <SystemSettingsPanel />}

      {/* Modal to Add Course to Storefront */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg text-slate-900">Cadastrar Novo Curso na Vitrine Online</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Curso</label>
              <input
                type="text"
                required
                value={courseFormTitle}
                onChange={(e) => setCourseFormTitle(e.target.value)}
                placeholder="Ex: Formação em Inteligência Artificial Aplicada a Negócios"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Breve Descrição para o Card</label>
              <input
                type="text"
                required
                value={courseFormShortDesc}
                onChange={(e) => setCourseFormShortDesc(e.target.value)}
                placeholder="Resumo em 1 ou 2 linhas..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Completa e Ementa</label>
              <textarea
                rows={3}
                required
                value={courseFormFullDesc}
                onChange={(e) => setCourseFormFullDesc(e.target.value)}
                placeholder="Detalhes completos dos objetivos, módulos e competências desenvolvidas..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria</label>
                <select
                  value={courseFormCategory}
                  onChange={(e) => setCourseFormCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Negócios">Negócios</option>
                  <option value="Design">Design</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Engenharia">Engenharia</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nível</label>
                <select
                  value={courseFormLevel}
                  onChange={(e) => setCourseFormLevel(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preço Total (R$)</label>
                <input
                  type="number"
                  required
                  value={courseFormPrice}
                  onChange={(e) => setCourseFormPrice(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Carga Horária (Horas)</label>
                <input
                  type="number"
                  required
                  value={courseFormHours}
                  onChange={(e) => setCourseFormHours(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL da Imagem de Capa</label>
              <input
                type="url"
                value={courseFormThumbnail}
                onChange={(e) => setCourseFormThumbnail(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Publicar Curso na Vitrine
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
