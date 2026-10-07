import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, CourseModule } from '../../types';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  BookOpen,
  DollarSign,
  Clock,
  User,
  X,
  Plus,
  Layers,
  HelpCircle,
  Check,
} from 'lucide-react';

interface CourseTextImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATE_EXAMPLE_1 = `Título: Mecânica e Manutenção de Máquinas de Costura (Domésticas e Industriais)
Categoria: Negócios
Nível: Iniciante
Preço: 480
Carga Horária: 80
Instrutor: Eloizio Silva
Resumo: Treinamento completo e prático para aprender a consertar, regular ponto, lubrificar e fazer manutenção de máquinas reta, overloque e galoneira.
Descrição: Curso 100% online desenvolvido especialmente para novos técnicos, costureiras e oficinas mecânicas em São Gonçalo e todo o Brasil. Você aprenderá anatomia das máquinas, ajuste de sincronismo de lançadeira, troca de peças, diagnóstico de falhas em motores direct-drive e convencionais, regulagem de tensão de linha e manutenção preventiva completa.
Módulos:
- Módulo 1: Anatomia das Máquinas e Ferramentas Essenciais (4 aulas)
- Módulo 2: Desmontagem, Limpeza Técnica e Lubrificação (6 aulas)
- Módulo 3: Sincronismo de Lançadeira e Regulagem de Ponto Perfeito (8 aulas)
- Módulo 4: Manutenção de Overloques e Galoneiras (6 aulas)
- Módulo 5: Diagnóstico Elétrico de Motores e Montagem Final (6 aulas)`;

const TEMPLATE_EXAMPLE_2 = `Título: Contabilidade e Assessoria Prática para MEI e Microempresas
Categoria: Negócios
Nível: Iniciante
Preço: 320
Carga Horária: 60
Instrutor: Sofia Vanguard
Resumo: Passo a passo prático para organizar a rotina contábil, emissão de notas fiscais, controle de fluxo de caixa e obrigações fiscais 100% online.
Descrição: Capacitação ágil com foco na gestão contábil moderna e desburocratizada. Indicado para microempreendedores, assistentes administrativos e gestores. Aborda abertura e regularização de MEI, desenquadramento, declaração anual DASN-SIMEI, emissão de notas municipais e estaduais, conciliação bancária e integração com meios de pagamento como Mercado Pago.
Módulos:
- Módulo 1: Fundamentos da Rotina Contábil e Legislação MEI (5 aulas)
- Módulo 2: Emissão de Notas Fiscais e Tributação no Simples (6 aulas)
- Módulo 3: Controle Financeiro, Fluxo de Caixa e Meios de Pagamento (6 aulas)
- Módulo 4: Declarações Fiscais, Certidões Negativas e Regularização (5 aulas)`;

const TEMPLATE_EXAMPLE_3 = `Título: Operação e Ajustes de Máquinas Industriais de Alta Produção
Categoria: Tecnologia
Nível: Intermediário
Preço: 590
Carga Horária: 100
Instrutor: Eloizio Silva
Resumo: Domine o funcionamento de máquinas automáticas, eletrônicas e programáveis para confecções e polos de moda.
Descrição: Especialização técnica voltada para operadores e mecânicos de chão de fábrica. Técnicas avançadas de corte de linha automático, sensores ópticos, regulagem de calcador pneumático e otimização de velocidade para produção contínua.
Módulos:
- Módulo 1: Componentes Eletrônicos e Painéis Programáveis (6 aulas)
- Módulo 2: Calibração de Sensores e Facas de Corte Automático (8 aulas)
- Módulo 3: Resolução de Falhas Críticas em Linha de Produção (8 aulas)`;

export const CourseTextImportModal: React.FC<CourseTextImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCourse } = useApp();

  const [rawText, setRawText] = useState(TEMPLATE_EXAMPLE_1);
  const [parsedCourses, setParsedCourses] = useState<Omit<Course, 'id'>[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  // Smart text parser for single or multi-course text
  const parseTextToCourses = (text: string): Omit<Course, 'id'>[] => {
    const trimmed = text.trim();
    if (!trimmed) return [];

    // Try JSON array first
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        return list.map((item, idx) => ({
          title: item.title || item.titulo || `Curso Importado ${idx + 1}`,
          shortDescription: item.shortDescription || item.resumo || 'Curso completo 100% online.',
          fullDescription: item.fullDescription || item.descricao || item.ementa || 'Conteúdo programático oficial do Grupo Eloizio.',
          category: (item.category || item.categoria || 'Negócios') as any,
          price: Number(item.price || item.preco || item.valor || 350),
          installments: 12,
          workloadHours: Number(item.workloadHours || item.cargaHoraria || item.horas || 60),
          level: (item.level || item.nivel || 'Iniciante') as any,
          instructorId: item.instructorId || 'user_ceo_eloizio',
          instructorName: item.instructorName || item.instrutor || 'Eloizio Silva',
          instructorTitle: item.instructorTitle || 'Especialista Técnico do Grupo Eloizio',
          thumbnail: item.thumbnail || getDefaultThumbnail(item.title || ''),
          featured: true,
          enrolledStudentsCount: 0,
          rating: 4.9,
          tags: item.tags || ['Online', 'Certificado', 'Grupo Eloizio'],
          syllabus: item.syllabus || generateDefaultSyllabus(item.title || ''),
        }));
      } catch {
        // Fall back to line parser
      }
    }

    // Split multiple courses if separated by separator
    const rawBlocks = trimmed.split(/\n\s*[-=]{3,}\s*\n/);
    const result: Omit<Course, 'id'>[] = [];

    for (const block of rawBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

      let title = '';
      let category: any = 'Negócios';
      let level: any = 'Iniciante';
      let price = 350;
      let workloadHours = 60;
      let instructorName = 'Eloizio Silva';
      let shortDescription = '';
      let fullDescription = '';
      let thumbnailUrl = '';
      const modulesList: string[] = [];
      let inModulesSection = false;

      for (const line of lines) {
        const lower = line.toLowerCase();

        if (lower.startsWith('título:') || lower.startsWith('titulo:') || lower.startsWith('curso:') || lower.startsWith('nome:')) {
          title = line.replace(/^[^:]+:\s*/, '').trim();
          inModulesSection = false;
        } else if (lower.startsWith('categoria:') || lower.startsWith('área:') || lower.startsWith('area:')) {
          const catRaw = line.replace(/^[^:]+:\s*/, '').trim();
          category = normalizeCategory(catRaw);
          inModulesSection = false;
        } else if (lower.startsWith('nível:') || lower.startsWith('nivel:')) {
          const levRaw = line.replace(/^[^:]+:\s*/, '').trim();
          level = normalizeLevel(levRaw);
          inModulesSection = false;
        } else if (lower.startsWith('preço:') || lower.startsWith('preco:') || lower.startsWith('valor:') || lower.startsWith('investimento:')) {
          const pStr = line.replace(/[^0-9,.]/g, '').replace(',', '.');
          const pNum = parseFloat(pStr);
          if (!isNaN(pNum)) price = pNum;
          inModulesSection = false;
        } else if (lower.startsWith('carga horária:') || lower.startsWith('carga horaria:') || lower.startsWith('horas:') || lower.startsWith('duração:') || lower.startsWith('duracao:')) {
          const hStr = line.replace(/[^0-9]/g, '');
          const hNum = parseInt(hStr, 10);
          if (!isNaN(hNum)) workloadHours = hNum;
          inModulesSection = false;
        } else if (lower.startsWith('instrutor:') || lower.startsWith('professor:') || lower.startsWith('docente:')) {
          instructorName = line.replace(/^[^:]+:\s*/, '').trim();
          inModulesSection = false;
        } else if (lower.startsWith('resumo:') || lower.startsWith('breve:')) {
          shortDescription = line.replace(/^[^:]+:\s*/, '').trim();
          inModulesSection = false;
        } else if (lower.startsWith('descrição:') || lower.startsWith('descricao:') || lower.startsWith('ementa:')) {
          fullDescription = line.replace(/^[^:]+:\s*/, '').trim();
          inModulesSection = false;
        } else if (lower.startsWith('imagem:') || lower.startsWith('capa:') || lower.startsWith('thumbnail:') || lower.startsWith('foto:')) {
          thumbnailUrl = line.replace(/^[^:]+:\s*/, '').trim();
          inModulesSection = false;
        } else if (lower.startsWith('módulos:') || lower.startsWith('modulos:') || lower.startsWith('aulas:')) {
          inModulesSection = true;
        } else if (inModulesSection) {
          if (line.startsWith('-') || line.startsWith('*') || /^\d+[.)]/.test(line)) {
            modulesList.push(line.replace(/^[-*0-9.)\s]+/, '').trim());
          } else {
            modulesList.push(line);
          }
        } else if (!title) {
          title = line;
        } else if (!shortDescription) {
          shortDescription = line;
        } else if (!fullDescription) {
          fullDescription = line;
        }
      }

      if (!title) continue;

      if (!shortDescription) {
        shortDescription = `${title} — Curso 100% online com certificado oficial emitido pelo Grupo Eloizio.`;
      }
      if (!fullDescription) {
        fullDescription = `${title}. Programa completo estruturado para capacitação profissional prática, com suporte pedagógico e tutoria.`;
      }

      const syllabus = buildSyllabus(title, modulesList);

      result.push({
        title,
        shortDescription,
        fullDescription,
        category,
        price,
        installments: 12,
        workloadHours,
        level,
        instructorId: instructorName.toLowerCase().includes('sofia') || instructorName.toLowerCase().includes('camilla') ? 'user_admin_sofia' : 'user_ceo_eloizio',
        instructorName,
        instructorTitle: (instructorName.toLowerCase().includes('sofia') || instructorName.toLowerCase().includes('camilla'))
          ? 'Expert Vanguard em Cursos & Gestão Estratégica'
          : 'Fundador, CEO & Especialista Mecânico',
        thumbnail: thumbnailUrl || getDefaultThumbnail(title),
        featured: true,
        syllabus,
        tags: [category, 'Online', 'Grupo Eloizio', 'Certificado'],
        enrolledStudentsCount: 0,
        rating: 5.0,
      });
    }

    return result;
  };

  const normalizeCategory = (cat: string): any => {
    const c = cat.toLowerCase();
    if (c.includes('tec') || c.includes('software') || c.includes('comput')) return 'Tecnologia';
    if (c.includes('mecan') || c.includes('máquina') || c.includes('costur') || c.includes('engen')) return 'Engenharia';
    if (c.includes('saúde') || c.includes('saude')) return 'Saúde';
    if (c.includes('design') || c.includes('art')) return 'Design';
    if (c.includes('educ') || c.includes('pedag')) return 'Educação';
    return 'Negócios';
  };

  const normalizeLevel = (lev: string): any => {
    const l = lev.toLowerCase();
    if (l.includes('avan') || l.includes('expert')) return 'Avançado';
    if (l.includes('inter')) return 'Intermediário';
    return 'Iniciante';
  };

  const getDefaultThumbnail = (title: string): string => {
    const t = title.toLowerCase();
    if (t.includes('costur') || t.includes('mecanic') || t.includes('máquina') || t.includes('overloque')) {
      return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800';
    }
    if (t.includes('contabil') || t.includes('finance') || t.includes('fiscal') || t.includes('mei')) {
      return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800';
    }
    if (t.includes('software') || t.includes('cloud') || t.includes('program') || t.includes('ti')) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800';
    }
    return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800';
  };

  const buildSyllabus = (courseTitle: string, modulesRaw: string[]): CourseModule[] => {
    if (modulesRaw.length === 0) {
      return generateDefaultSyllabus(courseTitle);
    }

    return modulesRaw.map((modText, idx) => {
      const matchLessons = modText.match(/\((\d+)\s*aulas?\)/i);
      const lessonCount = matchLessons ? parseInt(matchLessons[1], 10) : 4;
      const cleanTitle = modText.replace(/\(\d+\s*aulas?\)/i, '').trim();

      return {
        id: `mod_${Date.now()}_${idx}`,
        title: cleanTitle.startsWith('Módulo') ? cleanTitle : `Módulo ${idx + 1}: ${cleanTitle}`,
        description: `Conteúdo prático e exercícios do módulo de capacitação.`,
        lessons: Array.from({ length: lessonCount }, (_, lIdx) => ({
          id: `les_${Date.now()}_${idx}_${lIdx}`,
          title: `Aula ${lIdx + 1}: Fundamentos e Aplicação Prática`,
          description: `Estudo detalhado com demonstração passo a passo e materiais de apoio.`,
          durationMinutes: 20 + lIdx * 5,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          transcript: `Transcrição da aula do curso ${courseTitle}.`,
          isCompleted: false,
        })),
      };
    });
  };

  const generateDefaultSyllabus = (courseTitle: string): CourseModule[] => {
    return [
      {
        id: `mod_${Date.now()}_1`,
        title: 'Módulo 1: Fundamentos e Introdução Geral',
        description: 'Conceitos essenciais, normas de segurança e visão panorâmica da profissão.',
        lessons: [
          {
            id: `les_def_1`,
            title: 'Aula 1: Apresentação e Objetivos do Treinamento',
            description: 'Visão geral da metodologia e mercado de atuação.',
            durationMinutes: 25,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            transcript: `Apresentação do curso ${courseTitle}.`,
            isCompleted: false,
          },
          {
            id: `les_def_2`,
            title: 'Aula 2: Ferramental e Boas Práticas',
            description: 'Instrumentos necessários e técnicas de diagnóstico.',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            transcript: 'Aula prática com instrumentação.',
            isCompleted: false,
          },
        ],
      },
      {
        id: `mod_${Date.now()}_2`,
        title: 'Módulo 2: Prática Aplicada e Estudos de Caso',
        description: 'Resolução de problemas reais e procedimentos operacionais padronizados.',
        lessons: [
          {
            id: `les_def_3`,
            title: 'Aula 3: Execução Passo a Passo e Manutenção',
            description: 'Demonstração real das rotinas de manutenção e atendimento.',
            durationMinutes: 40,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            transcript: 'Execução e prática.',
            isCompleted: false,
          },
        ],
      },
      {
        id: `mod_${Date.now()}_3`,
        title: 'Módulo 3: Avaliação Final e Emissão de Certificado',
        description: 'Revisão geral, prova teórica e emissão do certificado oficial.',
        lessons: [
          {
            id: `les_def_4`,
            title: 'Aula 4: Orientações Finais e Boas Práticas Comerciais',
            description: 'Como precificar seus serviços e atender clientes.',
            durationMinutes: 25,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            transcript: 'Conclusão e encerramento.',
            isCompleted: false,
          },
        ],
      },
    ];
  };

  const handleProcessText = () => {
    setParseError(null);
    setSuccessCount(null);
    try {
      const parsed = parseTextToCourses(rawText);
      if (parsed.length === 0) {
        setParseError('Nenhum curso foi identificado no texto. Verifique se o formato contém ao menos "Título: ...".');
        return;
      }
      setParsedCourses(parsed);
    } catch (err: any) {
      setParseError(`Erro ao interpretar texto: ${err?.message || 'Formato inválido'}`);
    }
  };

  const handleSaveAll = () => {
    if (parsedCourses.length === 0) return;

    for (const c of parsedCourses) {
      addCourse(c);
    }

    setSuccessCount(parsedCourses.length);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const copyTemplateToClipboard = () => {
    const template = `Título: [Nome do Curso]
Categoria: Negócios
Nível: Iniciante
Preço: 450
Carga Horária: 80
Instrutor: Eloizio Silva
Resumo: [Breve descrição em 1 ou 2 frases]
Descrição: [Descrição detalhada dos objetivos do curso]
Módulos:
- Módulo 1: Introdução e Ferramentas (4 aulas)
- Módulo 2: Procedimentos Práticos Passo a Passo (6 aulas)
- Módulo 3: Resolução de Problemas e Casos Reais (6 aulas)
- Módulo 4: Avaliação Final e Certificação (4 aulas)`;

    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92dvh] sm:max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 my-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-indigo-900 text-white p-3.5 sm:p-5 flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shadow-inner shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 leading-tight">
                  Assistente de Cadastro Rápido
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden xs:inline-block"></span>
              </div>
              <h3 className="text-sm sm:text-lg font-black leading-tight text-white truncate">
                Preenchimento e Importação de Cursos via Texto
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition shrink-0 ml-2"
            title="Fechar Modal"
            aria-label="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          {/* Instructions banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-indigo-900 text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Como funciona o preenchimento via texto?</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                {showInstructions ? 'Ocultar guia' : 'Ver guia completo & dicas'}
              </button>
            </div>
            <p className="leading-relaxed text-indigo-900/80">
              Você pode colar qualquer texto com <strong>Título</strong>, <strong>Preço</strong>, <strong>Carga Horária</strong>, <strong>Descrição</strong> e <strong>Módulos</strong>. O sistema identifica automaticamente as informações e cria os cursos na Vitrine para venda imediata via Mercado Pago.
            </p>

            {showInstructions && (
              <div className="pt-3 border-t border-indigo-200/60 space-y-2 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] bg-white p-3 rounded-xl border border-indigo-200">
                  <div>
                    <strong className="block text-slate-900 mb-1">Campos Reconhecidos:</strong>
                    <ul className="space-y-0.5 text-slate-600 list-disc list-inside">
                      <li>Título: [Nome do Curso]</li>
                      <li>Categoria: [Negócios / Tecnologia...]</li>
                      <li>Preço: [450]</li>
                      <li>Carga Horária: [80]</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="block text-slate-900 mb-1">Estrutura de Aulas:</strong>
                    <ul className="space-y-0.5 text-slate-600 list-disc list-inside">
                      <li>Instrutor: [Eloizio Silva / Sofia Vanguard]</li>
                      <li>Resumo: [Frase de impacto para o card]</li>
                      <li>Módulos: - Módulo 1 (4 aulas)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={copyTemplateToClipboard}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-700 transition"
                  >
                    {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplate ? 'Modelo Copiado!' : 'Copiar Modelo em Branco'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Modelos Prontos do Grupo Eloizio (Clique para Carregar):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setRawText(TEMPLATE_EXAMPLE_1);
                  setParsedCourses([]);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🔧 Exemplo 1: Máquinas de Costura & Mecânica</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRawText(TEMPLATE_EXAMPLE_2);
                  setParsedCourses([]);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📊 Exemplo 2: Contabilidade & MEI Online</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRawText(TEMPLATE_EXAMPLE_3);
                  setParsedCourses([]);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>⚡ Exemplo 3: Máquinas Industriais Avançadas</span>
              </button>
            </div>
          </div>

          {/* Raw Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cole ou Digite o Texto do(s) Curso(s) Aqui:
              </label>
              <button
                type="button"
                onClick={() => setRawText('')}
                className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Limpar Texto
              </button>
            </div>
            <textarea
              rows={9}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui o texto descritivo do curso..."
              className="w-full p-3.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleProcessText}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Interpretar Texto & Gerar Pré-Visualização</span>
            </button>

            {parsedCourses.length > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                ✓ {parsedCourses.length} {parsedCourses.length === 1 ? 'curso identificado pronto para publicação' : 'cursos identificados prontos'}
              </span>
            )}
          </div>

          {/* Error Message */}
          {parseError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Success feedback */}
          {successCount !== null && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Sucesso! <strong>{successCount}</strong> {successCount === 1 ? 'curso publicado' : 'cursos publicados'} na Vitrine e já disponíveis para matrículas no Mercado Pago!
              </span>
            </div>
          )}

          {/* Live Preview Cards */}
          {parsedCourses.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Pré-Visualização do(s) Curso(s) Interpretado(s):</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedCourses.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 hover:border-indigo-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                          {c.category} • {c.level}
                        </span>
                        <h5 className="font-black text-sm text-slate-900 mt-1">{c.title}</h5>
                      </div>
                      <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                        {c.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{c.shortDescription}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" /> {c.workloadHours} horas
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {c.instructorName}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" /> {c.syllabus.length} módulos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Cursos inseridos ficam salvos no sistema e aparecem imediatamente para todos os visitantes.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={parsedCourses.length === 0}
              onClick={handleSaveAll}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
            >
              Publicar {parsedCourses.length > 0 ? `(${parsedCourses.length}) Curso(s) na Vitrine` : 'na Vitrine'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
