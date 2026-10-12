import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, CourseMaterialItem, CourseModule, Lesson } from '../../types';
import {
  Sparkles,
  BookOpen,
  FileText,
  Video,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Download,
  Laptop,
  Wrench,
  ShieldCheck,
  Eye,
  Coffee,
  Send,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Tag,
  CreditCard,
  Layers,
  ChevronRight,
  Printer,
} from 'lucide-react';

interface CamillaCourseStudioProps {
  onCoursePublished?: (course: Course) => void;
}

export const CamillaCourseStudio: React.FC<CamillaCourseStudioProps> = ({ onCoursePublished }) => {
  const { courses, addCourse, sendPushNotification, setActiveNavTab } = useApp();

  // Estado do Formulário de Criação da Camilla
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Tecnologia' | 'Negócios' | 'Saúde' | 'Design' | 'Educação' | 'Engenharia'>('Engenharia');
  const [modality, setModality] = useState<'online' | 'hibrido'>('online');
  const [practicalLocation, setPracticalLocation] = useState('Polo Técnico & Oficinas em São Gonçalo - RJ');
  const [workloadHours, setWorkloadHours] = useState(160);
  const [level, setLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [price, setPrice] = useState(480);
  const [installments, setInstallments] = useState(12);
  const [instructorName, setInstructorName] = useState('Eloizio Assunção (CEO & Diretor Geral)');
  const [instructorTitle] = useState('Especialista Master em Mecânica & Gestão Industrial');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Curso Livre, Mecânica, São Gonçalo, Prática');

  // Materiais Didáticos: Manuais, Livros, Apostilas
  const [materials, setMaterials] = useState<CourseMaterialItem[]>([
    {
      id: 'mat_1',
      title: 'Manual Técnico de Bancada & Diagnóstico Prático de Falhas',
      type: 'manual',
      format: 'PDF',
      pages: 142,
      description: 'Guia ilustrado com diagramas de peças, folgas mecânicas, regulagem de lançadeira e calibração de ponto.',
      downloadUrl: '#',
      priceStandalone: 67.0,
      includedInCourse: true,
    },
    {
      id: 'mat_2',
      title: 'Livro Digital: Fundamentos da Profissão & Empreendedorismo de Serviços',
      type: 'livro',
      format: 'PDF',
      pages: 210,
      description: 'E-book completo sobre precificação de visitas técnicas, captação de confecções e gestão de oficina própria.',
      downloadUrl: '#',
      priceStandalone: 49.0,
      includedInCourse: true,
    },
    {
      id: 'mat_3',
      title: 'Apostila Oficial de Estudos com 100 Questões Práticas e Gabarito',
      type: 'apostila',
      format: 'PDF',
      pages: 88,
      description: 'Apostila pedagógica com roteiro passo a passo, testes de conhecimento e exercícios resolvidos.',
      downloadUrl: '#',
      priceStandalone: 39.0,
      includedInCourse: true,
    },
  ]);

  // Vídeos Explicativos / Grade de Videoaulas
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod_1',
      title: 'Módulo 1: Introdução, Anatomia das Máquinas e Biossegurança',
      description: 'Fundamentos operacionais, componentes essenciais e normas de proteção.',
      lessons: [
        {
          id: 'les_1',
          title: '1. Apresentação do Curso & Metodologia dos Cursos Livres do Grupo Eloizio',
          description: 'Boas-vindas da Gerente Camilla Faria e do Diretor Eloizio Assunção, e visão geral dos materiais didáticos.',
          durationMinutes: 28,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          transcript: 'Olá futuro profissional! Seja muito bem-vindo ao Grupo Eloizio. Neste curso livre profissionalizante, você receberá materiais didáticos completos para download e suporte.',
          isCompleted: false,
        },
        {
          id: 'les_2',
          title: '2. Anatomia Detalhada dos Mecanismos Internos & Barra da Agulha',
          description: 'Vídeo explicativo em alta definição demonstrando o funcionamento de cada engrenagem e ajuste fino.',
          durationMinutes: 45,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          transcript: 'Demonstração de ajuste milimétrico, sincronismo de lançadeira e prevenção de quebra de agulhas.',
          isCompleted: false,
        },
      ],
    },
    {
      id: 'mod_2',
      title: 'Módulo 2: Procedimentos de Bancada, Diagnóstico de Defeitos e Montagem',
      description: 'Aulas práticas guiadas com desmontagem completa e testes reais.',
      lessons: [
        {
          id: 'les_3',
          title: '3. Vídeo Explicativo Prático: Ajuste de Tensão e Laçada Perfeita',
          description: 'Passo a passo com câmera macro para identificar ponto frouxo, salto de ponto e folgas na bobina.',
          durationMinutes: 52,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          transcript: 'Regulagem da caixa de bobina e alinhamento do calcador para tecidos finos e pesados.',
          isCompleted: false,
        },
      ],
    },
  ]);

  // Novo Material Modal / Form
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatType, setNewMatType] = useState<'livro' | 'manual' | 'apostila'>('apostila');
  const [newMatPages, setNewMatPages] = useState(64);
  const [newMatPrice, setNewMatPrice] = useState(45);
  const [newMatDesc, setNewMatDesc] = useState('');

  // Nova Aula Vídeo Form
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState(35);
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // Status de Publicação
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // PRESETS RÁPIDOS DA CAMILLA (Para gerar e colocar no ar com 1 clique)
  const handleLoadCamillaPreset = (presetKey: string) => {
    if (presetKey === 'mecanica_industrial') {
      setTitle('Mecânica e Regulagem de Máquinas de Costura Industriais (Reta, Overloque & Galoneira)');
      setCategory('Engenharia');
      setModality('hibrido');
      setPracticalLocation('Oficina Matriz Grupo Eloizio • São Gonçalo - RJ');
      setWorkloadHours(240);
      setLevel('Iniciante');
      setPrice(520.0);
      setInstructorName('Eloizio Assunção (CEO & Diretor Geral)');
      setThumbnail('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800');
      setShortDescription('Formação completa em mecânica prática de máquinas industriais com apostilas, manuais de peças, livros e videoaulas de bancada.');
      setFullDescription('Curso profissionalizante livre estruturado para formar técnicos de alta renda. O aluno aprende a consertar máquinas industriais retas, overloques, galoneiras e motores eletrônicos direct-drive. Inclui Manual Técnico Ilustrado de 142 páginas, Livro de Gestão de Oficinas, Apostila de 100 testes com gabarito e mais de 20 vídeos explicativos detalhados.');
      setTagsInput('Mecânica, Máquinas de Costura, São Gonçalo, Híbrido, Eloizio Assunção, Alta Renda');
    } else if (presetKey === 'cuidador_idosos_rj') {
      setTitle('Curso Completo de Cuidador de Idosos & Dependentes (Lei RJ nº 8.528/2019 & CBO 5162-10)');
      setCategory('Saúde');
      setModality('hibrido');
      setPracticalLocation('Polo de Saúde & Práticas Humanizadas • São Gonçalo - RJ');
      setWorkloadHours(240);
      setLevel('Iniciante');
      setPrice(450.0);
      setInstructorName('Enfª Esp. Beatriz Albuquerque');
      setThumbnail('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800');
      setShortDescription('Formação regulamentada no RJ com manual de primeiros socorros geriátricos, livro de rotinas e vídeos de mobilidade.');
      setFullDescription('Curso livre profissionalizante em conformidade rigorosa com a Lei Estadual RJ nº 8.528/2019. Abrange primeiros socorros geriátricos, administração segura de medicamentos sob prescrição, nutrição do idoso, transferências e cuidados paliativos. Acompanha Manual Prático de Enfermagem Domiciliar, Apostila de Estudos e videoaulas demonstrativas.');
      setTagsInput('Cuidador de Idosos, Legislação RJ, Lei 8.528/2019, Primeiros Socorros, São Gonçalo');
    } else if (presetKey === 'massoterapia_clinica') {
      setTitle('Massoterapia & Terapias Manuais Integrativas (Lei RJ nº 7.859/2018 & CBO 3221-20)');
      setCategory('Saúde');
      setModality('hibrido');
      setPracticalLocation('Clínica-Escola de Terapias Manuais Polo São Gonçalo - RJ');
      setWorkloadHours(280);
      setLevel('Intermediário');
      setPrice(580.0);
      setInstructorName('Prof. Fisioterapeuta Thiago Ramos');
      setThumbnail('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800');
      setShortDescription('Anatomia palpatória, drenagem linfática, liberação miofascial e biossegurança sanitária com livro e apostilas completas.');
      setFullDescription('Formação completa em práticas integrativas corporais sob a Lei Estadual do Rio de Janeiro nº 7.859/2018. Conteúdo prático com manobras de massagem relaxante, desportiva, pontos-gatilho (trigger points) e ergonomia do terapeuta. Acompanha Atlas Ilustrado de Anatomia Palpatória, Apostila de Protocolos e videoaulas explicativas em 4K.');
      setTagsInput('Massoterapia, Legislação RJ, Drenagem Linfática, Miofascial, Prática Presencial');
    } else if (presetKey === 'contabilidade_mei') {
      setTitle('Contabilidade Digital Prática & Assessoria 100% Online para MEI e Pequenas Empresas');
      setCategory('Negócios');
      setModality('online');
      setWorkloadHours(120);
      setLevel('Iniciante');
      setPrice(290.0);
      setInstructorName('Camilla Faria & Equipe Contábil');
      setThumbnail('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800');
      setShortDescription('Passo a passo sem burocracia para emissão de NFS-e nacional, regularização de CNPJ MEI, DASN e blindagem fiscal.');
      setFullDescription('Curso profissionalizante livre elaborado pela Gerência do Grupo Eloizio para capacitar prestadores de serviço, autônomos e assistentes fiscais. Acompanha E-book com 120 Modelos de Contratos e Recibos, Planilhas Financeiras e tutoriais em vídeo.');
      setTagsInput('Contabilidade, MEI, Online, NFS-e, Camilla Faria, Prático');
    }
  };

  // Adicionar Material Didático
  const handleAddMaterial = () => {
    if (!newMatTitle.trim()) return;
    const newMat: CourseMaterialItem = {
      id: `mat_${Date.now()}`,
      title: newMatTitle.trim(),
      type: newMatType,
      format: 'PDF',
      pages: newMatPages,
      description: newMatDesc || `Material oficial formatado para leitura e download pelos alunos.`,
      downloadUrl: '#',
      priceStandalone: newMatPrice,
      includedInCourse: true,
    };
    setMaterials([...materials, newMat]);
    setNewMatTitle('');
    setNewMatDesc('');
  };

  // Remover Material Didático
  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  // Adicionar Videoaula ao Módulo 1
  const handleAddVideo = () => {
    if (!newVideoTitle.trim()) return;
    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      title: newVideoTitle.trim(),
      description: newVideoDesc || 'Vídeo explicativo detalhado com demonstração prática em bancada.',
      durationMinutes: newVideoDuration,
      videoUrl: newVideoUrl,
      transcript: 'Conteúdo ministrado com foco na execução prática e nas normas profissionais vigentes.',
      isCompleted: false,
    };

    const updatedModules = [...modules];
    if (updatedModules.length === 0) {
      updatedModules.push({
        id: `mod_${Date.now()}`,
        title: 'Módulo 1: Aulas Práticas & Vídeos Explicativos',
        description: 'Conteúdo audiovisual gravado com professores experientes.',
        lessons: [newLesson],
      });
    } else {
      updatedModules[0].lessons.push(newLesson);
    }
    setModules(updatedModules);
    setNewVideoTitle('');
    setNewVideoDesc('');
  };

  // PUBLICAR O CURSO EM PRODUÇÃO (AUTONOMIA TOTAL DA CAMILLA)
  const handlePublishToProduction = () => {
    if (!title.trim()) {
      alert('Camilla, por favor informe o Título Oficial do Curso antes de publicar!');
      return;
    }

    setIsPublishing(true);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newCourseObj: Omit<Course, 'id'> = {
      title: title.trim(),
      category,
      modality,
      practicalLocation: modality === 'hibrido' ? practicalLocation : undefined,
      workloadHours: Number(workloadHours) || 160,
      level,
      price: Number(price) || 350.0,
      installments: Number(installments) || 12,
      instructorId: 'user_camilla_created',
      instructorName,
      instructorTitle,
      thumbnail,
      featured: true,
      shortDescription: shortDescription || `Curso livre profissionalizante com materiais didáticos completos para download e vídeos explicativos.`,
      fullDescription: fullDescription || `Curso profissionalizante livre completo em total conformidade com a Lei Federal nº 9.394/1996 (LDB - Art. 42), Decreto nº 5.154/2004 e diretrizes do MEC. Inclui livros digitais, apostilas com exercícios, manuais práticos e videoaulas em alta resolução.`,
      tags: tagsArray,
      enrolledStudentsCount: 0,
      rating: 5.0,
      syllabus: modules,
      materials,
      isProductionLive: true,
      publishedBy: 'Camilla Faria (Gerente Geral • Grupo Eloizio)',
      publishedAt: new Date().toISOString(),
      mercadoPagoPaymentLink: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=MP-GRUPO-ELOIZIO-${Date.now()}`,
    };

    // Publica no AppContext (salvando em storage e adicionando à vitrine ao vivo)
    addCourse(newCourseObj);

    // Notificação Push Geral
    sendPushNotification({
      title: '✨ Novo Curso Publicado por Camilla Faria!',
      message: `O curso "${title.trim()}" já está ao vivo em produção com livros, manuais, apostilas e videoaulas à venda no Mercado Pago.`,
      targetRole: 'all',
      category: 'academic',
    });

    setIsPublishing(false);
    setPublishSuccessMessage(`Parabéns! O curso "${title.trim()}" foi colocado em PRODUÇÃO com sucesso pela Gerente Camilla Faria! Já está visível na Vitrine, com link de checkout no Mercado Pago e materiais disponíveis para download.`);

    if (onCoursePublished) {
      onCoursePublished({ ...newCourseObj, id: `course_${Date.now()}` });
    }
  };

  // Contagem de vídeos e páginas
  const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalPagesCount = materials.reduce((acc, m) => acc + (m.pages || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* BANNER OFICIAL: AUTONOMIA DA GERENTE CAMILLA FARIA */}
      <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-indigo-400/30 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
                alt="Camilla Faria"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" title="Autonomia Ativa"></span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">
                  Autonomia Executiva Total • Grupo Eloizio
                </span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  ✓ Publicação Instantânea em Produção
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Estúdio de Criação & Produção • Camilla Faria
              </h2>

              <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
                <em>"Depois da minha primeira xícara de café ☕, coloco a mão na massa para organizar tudo, criar os cursos com acervo completo de <strong>manuais, livros, apostilas e vídeos explicativos</strong> e publicar direto para venda no Mercado Pago!"</em>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setActiveNavTab('showcase')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-sky-300" />
              <span>Ver Vitrine ao Vivo</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Pré-visualizar Pacote</span>
            </button>
          </div>
        </div>

        {/* Indicadores de Autonomia */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-indigo-800/40 text-xs">
          <div>
            <span className="text-[10px] uppercase text-indigo-300 block font-semibold">Cursos no Catálogo</span>
            <strong className="text-lg font-black text-white">{courses.length} Formações Ativas</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-indigo-300 block font-semibold">Materiais no Pacote</span>
            <strong className="text-lg font-black text-amber-300">{materials.length} Manuais & Apostilas ({totalPagesCount} págs)</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-indigo-300 block font-semibold">Vídeos Explicativos</span>
            <strong className="text-lg font-black text-blue-300">{totalLessonsCount} Videoaulas Cadastradas</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-indigo-300 block font-semibold">Gateway de Venda</span>
            <strong className="text-lg font-black text-emerald-400">Mercado Pago (PIX & 12x)</strong>
          </div>
        </div>
      </div>

      {/* MENSAGEM DE SUCESSO DE PUBLICAÇÃO */}
      {publishSuccessMessage && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-3xl text-emerald-950 flex items-start gap-4 shadow-lg animate-in slide-in-from-top-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
            ✓
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-black text-emerald-950">Curso Publicado em Produção com Sucesso!</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">{publishSuccessMessage}</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setPublishSuccessMessage(null);
                  setActiveNavTab('showcase');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
              >
                Conferir na Vitrine Principal &rarr;
              </button>
              <button
                onClick={() => setPublishSuccessMessage(null)}
                className="px-4 py-2 border border-emerald-300 text-emerald-900 font-semibold text-xs rounded-xl hover:bg-emerald-100/60"
              >
                Continuar Criando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELEÇÃO DE PRESETS RÁPIDOS DA CAMILLA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Agilidade Executiva da Camilla</span>
            <h3 className="text-base font-black text-slate-900">Modelos Prontos de Alta Demanda (1 Clique para Preencher)</h3>
          </div>
          <span className="text-xs text-slate-500">Selecione para carregar a matriz e colocar à venda de imediato</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleLoadCamillaPreset('mecanica_industrial')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 transition text-left space-y-1.5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🪡</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">Híbrido RJ</span>
            </div>
            <strong className="text-xs font-black text-slate-900 group-hover:text-indigo-600 block line-clamp-2">
              Mecânica Industrial de Máquinas (Reta, Overloque & Galoneira)
            </strong>
            <p className="text-[11px] text-slate-500">Manual 142 págs + Apostila + Vídeos explicativos de bancada.</p>
          </button>

          <button
            type="button"
            onClick={() => handleLoadCamillaPreset('cuidador_idosos_rj')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 transition text-left space-y-1.5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">🩺</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">Lei RJ 8.528</span>
            </div>
            <strong className="text-xs font-black text-slate-900 group-hover:text-indigo-600 block line-clamp-2">
              Cuidador de Idosos & Dependentes (Legislação RJ)
            </strong>
            <p className="text-[11px] text-slate-500">Livro de Cuidados + Manual de Primeiros Socorros + Práticas RJ.</p>
          </button>

          <button
            type="button"
            onClick={() => handleLoadCamillaPreset('massoterapia_clinica')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 transition text-left space-y-1.5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">💆</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">Lei RJ 7.859</span>
            </div>
            <strong className="text-xs font-black text-slate-900 group-hover:text-indigo-600 block line-clamp-2">
              Massoterapia & Práticas Integrativas
            </strong>
            <p className="text-[11px] text-slate-500">Atlas de Anatomia Palpatória + Vídeos de Drenagem e Liberação.</p>
          </button>

          <button
            type="button"
            onClick={() => handleLoadCamillaPreset('contabilidade_mei')}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 transition text-left space-y-1.5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">💼</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">100% Online</span>
            </div>
            <strong className="text-xs font-black text-slate-900 group-hover:text-indigo-600 block line-clamp-2">
              Contabilidade Prática & MEI sem Burocracia
            </strong>
            <p className="text-[11px] text-slate-500">E-book com Modelos de Contrato + Tutoriais de NFS-e.</p>
          </button>
        </div>
      </div>

      {/* FORMULÁRIO PRINCIPAL: DADOS DO CURSO LIVRE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informações Gerais */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              1. Identificação do Curso Livre & Modalidade
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Curso Profissionalizante Livre *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mecânica e Regulagem de Máquinas de Costura Industriais"
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Área / Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  >
                    <option value="Engenharia">Engenharia / Mecânica</option>
                    <option value="Saúde">Saúde & Cuidados</option>
                    <option value="Negócios">Negócios & Gestão</option>
                    <option value="Tecnologia">Tecnologia & Software</option>
                    <option value="Design">Design & Modelagem</option>
                    <option value="Educação">Educação Profissional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Modalidade</label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  >
                    <option value="online">100% Online EAD</option>
                    <option value="hibrido">Híbrido (Online + Prática RJ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Carga Horária (Horas)</label>
                  <input
                    type="number"
                    value={workloadHours}
                    onChange={(e) => setWorkloadHours(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {modality === 'hibrido' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <label className="block text-[11px] font-bold text-amber-950 uppercase mb-1">Polo de Práticas Presenciais no RJ</label>
                  <input
                    type="text"
                    value={practicalLocation}
                    onChange={(e) => setPracticalLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-amber-300 bg-white text-xs font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resumo Rápido para a Vitrine</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Descrição concisa que aparecerá no card do catálogo..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Completa e Ementa do Curso</label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Apresente a metodologia, amparo da Lei nº 9.394/96 Art. 42 e competências desenvolvidas..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instrutor / Docente Responsável</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL da Imagem de Capa (Thumbnail)</label>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Manuais, Livros e Apostilas para Venda & Download */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Acervo Didático Incluso</span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  2. Manuais Técnicos, Livros Digitais & Apostilas Completas
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {materials.length} itens cadastrados
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Estes materiais são disponibilizados <strong>gratuitamente para os alunos matriculados</strong> e também podem ser colocados à <strong>venda avulsa via Mercado Pago</strong> para profissionais que desejam apenas o material de consulta.
            </p>

            {/* Lista dos Materiais Cadastrados */}
            <div className="space-y-3">
              {materials.map((mat, index) => (
                <div key={mat.id || index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                      {mat.type === 'manual' ? '🔧 Man.' : mat.type === 'livro' ? '📖 Liv.' : '📝 Apos.'}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-xs font-bold text-slate-900">{mat.title}</strong>
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-slate-200 text-slate-700">
                          {mat.pages} págs • {mat.format}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{mat.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-600 pt-0.5 font-mono">
                        <span className="text-emerald-700 font-bold">Incluso no Curso</span>
                        <span>• Venda avulsa: <strong>R$ {mat.priceStandalone?.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(mat.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition shrink-0"
                    title="Remover Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar Novo Material */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <strong className="text-xs font-bold text-amber-950 block">+ Adicionar Novo Livro, Manual ou Apostila:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newMatTitle}
                    onChange={(e) => setNewMatTitle(e.target.value)}
                    placeholder="Título do material (Ex: Manual de Esquemas Elétricos Direct-Drive)"
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <select
                    value={newMatType}
                    onChange={(e) => setNewMatType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs font-bold"
                  >
                    <option value="apostila">Apostila de Estudos</option>
                    <option value="manual">Manual Técnico</option>
                    <option value="livro">Livro Digital / E-book</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newMatPages}
                    onChange={(e) => setNewMatPages(Number(e.target.value))}
                    placeholder="Páginas"
                    className="w-20 p-2.5 rounded-xl border border-amber-300 bg-white text-xs text-center font-bold"
                    title="Número de Páginas"
                  />
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="flex-1 px-3 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Grade de Vídeos Explicativos */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Aulas em Vídeo HD</span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  3. Grade Curricular & Vídeos Explicativos
                </h3>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {totalLessonsCount} vídeos cadastrados
              </span>
            </div>

            <div className="space-y-4">
              {modules.map((mod, modIdx) => (
                <div key={mod.id || modIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black text-slate-900 uppercase tracking-tight">{mod.title}</strong>
                    <span className="text-[10px] font-bold text-slate-400">{mod.lessons.length} aulas</span>
                  </div>
                  <div className="space-y-1.5">
                    {mod.lessons.map((les, lesIdx) => (
                      <div key={les.id || lesIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Play className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{les.durationMinutes} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Formulário para adicionar nova aula em vídeo */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <strong className="text-xs font-bold text-blue-950 block">+ Adicionar Novo Vídeo Explicativo:</strong>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="Título da videoaula (Ex: Desmontagem e Sincronismo da Lançadeira)"
                    className="w-full p-2.5 rounded-xl border border-blue-300 bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(Number(e.target.value))}
                    placeholder="Duração (min)"
                    className="w-full p-2.5 rounded-xl border border-blue-300 bg-white text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    className="w-full px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-xs"
                  >
                    + Adicionar Vídeo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA LATERAL: PREÇO, CHECKOUT MERCADO PAGO E BOTÃO DE COLOCAR EM PRODUÇÃO */}
        <div className="space-y-6">
          {/* Card de Precificação & Mercado Pago */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Precificação & Mercado Pago
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">Preço do Curso Completo (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-base font-black text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">Parcelamento</label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white"
                  >
                    <option value={12}>Até 12x no cartão</option>
                    <option value={6}>Até 6x no cartão</option>
                    <option value={3}>Até 3x sem juros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">PIX com Desconto</label>
                  <span className="block p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-black text-emerald-800 text-center">
                    R$ {(price * 0.85).toFixed(2)} (-15%)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Condições de Venda Integradas:</span>
                <p>• Liberação imediata das videoaulas e materiais após aprovação;</p>
                <p>• Carteirinha 1ª via gratuita e Certificado válido nacionalmente;</p>
                <p>• Suporte executivo com Camilla Faria no WhatsApp (21 99613-4073).</p>
              </div>
            </div>
          </div>

          {/* CARD DE AÇÃO DECISIVA: COLOCAR EM PRODUÇÃO */}
          <div className="bg-linear-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl space-y-5 border-2 border-indigo-400/40">
            <div className="space-y-1.5 text-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 inline-block">
                ⚡ Autonomia da Camilla
              </span>
              <h3 className="text-lg font-black text-white">Publicar Agora em Produção</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Ao clicar abaixo, o curso entra ao vivo imediatamente na vitrine pública do Grupo Eloizio, com formulário de matrícula ativo, link de pagamento do Mercado Pago e área de download dos livros e apostilas.
              </p>
            </div>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishToProduction}
              className="w-full py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 cursor-pointer transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{isPublishing ? 'Publicando em Produção...' : '🚀 Colocar em Produção Agora'}</span>
            </button>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              Chancela: Camilla Faria • Gerência Geral • Grupo Eloizio
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE PRÉ-VISUALIZAÇÃO DO PACOTE COMPLETO */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-amber-400">Prévia do Curso em Produção</span>
                <h3 className="font-black text-base">{title || 'Título do Curso'}</h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-700 block">Amparo Legal da Formação</span>
                <strong className="text-sm font-black text-indigo-950 block">{title}</strong>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Curso Profissionalizante Livre amparado pela Lei Federal nº 9.394/1996 (LDB Art. 42), Decreto nº 5.154/2004 e Ministério da Educação (MEC).
                </p>
              </div>

              {/* Materiais Didáticos */}
              <div>
                <strong className="text-xs font-black uppercase text-slate-700 block mb-2">
                  📚 Livros, Manuais e Apostilas Inclusos para Download:
                </strong>
                <div className="space-y-2">
                  {materials.map((mat, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-amber-600" />
                        <div>
                          <strong className="block text-slate-900">{mat.title}</strong>
                          <span className="text-[10px] text-slate-500">{mat.pages} páginas • Formato {mat.format}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Liberado p/ Alunos</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vídeos */}
              <div>
                <strong className="text-xs font-black uppercase text-slate-700 block mb-2">
                  🎥 Vídeos Explicativos da Grade:
                </strong>
                <div className="space-y-2">
                  {modules.flatMap(m => m.lessons).map((les, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{les.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{les.durationMinutes} min</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Mercado Pago */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Valor no Mercado Pago</span>
                  <strong className="text-lg font-black text-emerald-950">
                    R$ {price.toFixed(2)} à vista no PIX (-15% OFF) ou em até 12x
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewModalOpen(false);
                    handlePublishToProduction();
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirmar e Colocar no Ar &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
