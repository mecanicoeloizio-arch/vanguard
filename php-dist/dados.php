<?php
/**
 * Grupo Eloizio - Repositório Central de Dados Acadêmicos, Cursos, Alunos & Propostas (PHP 8.1+)
 * Fornece dados portáteis sem dependência de banco de dados externo (com fallback JSON automático)
 * 100% pronto para transporte e execução direta na pasta public_html (cPanel / Apache / Nginx)
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

/**
 * Catálogo completo de Cursos Oficiais na Vitrine
 */
function getCursosData(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cursos.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'course_1',
            'title' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'shortDescription' => 'Do design de sistemas escaláveis à computação distribuída e integração com Inteligência Artificial.',
            'fullDescription' => 'Este curso livre de qualificação profissionalizante de alta performance desenvolve competências sólidas em microsserviços, DevOps, segurança de software, banco de dados distribuídos e automação em nuvem com GCP e AWS. Aulas teóricas e práticas com projetos reais amparadas pela Lei Federal nº 9.394/96 Art. 42.',
            'category' => 'Tecnologia',
            'price' => 1890.00,
            'workloadHours' => 360,
            'level' => 'Avançado',
            'instructorName' => 'Profa. Dra. Mariana Fernandes',
            'instructorTitle' => 'Doutora em Ciência da Computação pela USP',
            'thumbnail' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 342,
            'rating' => 4.9,
            'modality' => 'online',
            'tags' => ['Arquitetura', 'Cloud', 'TypeScript', 'DevOps', 'Clean Architecture'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Fundamentos de Arquitetura de Software',
                    'lessons' => [
                        ['title' => '1. Introdução à Arquitetura Orientada a Eventos', 'duration' => '45 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Princípios SOLID e Design Patterns Práticos', 'duration' => '52 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'],
                        ['title' => '3. Modelagem de Domínio com DDD e CQRS', 'duration' => '60 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
                    ]
                ],
                [
                    'title' => 'Módulo 2: Resiliência, Criptografia e Alta Disponibilidade',
                    'lessons' => [
                        ['title' => '4. Criptografia em Trânsito e em Repouso', 'duration' => '48 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
                        ['title' => '5. Observabilidade: Métricas, Tracing e Logs Distribuídos', 'duration' => '55 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'],
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_2',
            'title' => 'Mecânica e Manutenção de Máquinas de Costura (Domésticas e Industriais)',
            'shortDescription' => 'Treinamento completo para aprender a consertar, regular ponto, lubrificar e fazer manutenção de máquinas reta, overloque e galoneira.',
            'fullDescription' => 'Curso 100% online desenvolvido especialmente para novos técnicos, costureiras e oficinas mecânicas em São Gonçalo e todo o Brasil. Você aprenderá anatomia das máquinas, ajuste de sincronismo de lançadeira, troca de peças, diagnóstico de falhas em motores direct-drive e convencionais, regulagem de tensão de linha e manutenção preventiva completa.',
            'category' => 'Engenharia',
            'price' => 480.00,
            'workloadHours' => 80,
            'level' => 'Iniciante',
            'instructorName' => 'Eloizio Assunção (CEO)',
            'instructorTitle' => 'Fundador, CEO & Especialista Mecânico com 30+ anos de experiência',
            'thumbnail' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 285,
            'rating' => 5.0,
            'modality' => 'hibrido',
            'practicalLocation' => 'Oficina Técnica Polo São Gonçalo - RJ',
            'tags' => ['Mecânica', 'Máquinas de Costura', 'Overloque', 'Galoneira', 'São Gonçalo'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Anatomia das Máquinas e Ferramentas Essenciais',
                    'lessons' => [
                        ['title' => '1. Identificação de Peças e Componentes Internos', 'duration' => '35 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Ferramentas Indispensáveis do Mecânico de Máquinas', 'duration' => '40 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'],
                    ]
                ],
                [
                    'title' => 'Módulo 2: Sincronismo de Lançadeira e Regulagem de Ponto Perfeito',
                    'lessons' => [
                        ['title' => '3. Ajuste Fino de Lançadeira e Ponto de Laçada', 'duration' => '50 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
                        ['title' => '4. Resolução de Quebra de Agulha e Falha de Ponto', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
                    ]
                ],
                [
                    'title' => 'Módulo 3: Motores Direct-Drive e Eletrônica Básica',
                    'lessons' => [
                        ['title' => '5. Diagnóstico de Placas e Paradas de Agulha Automáticas', 'duration' => '55 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'],
                        ['title' => '6. Manutenção Preventiva e Lubrificação Profissional', 'duration' => '40 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_3',
            'title' => 'Contabilidade e Assessoria Prática para MEI e Microempresas',
            'shortDescription' => 'Passo a passo prático para organizar a rotina contábil, emissão de notas fiscais, fluxo de caixa e obrigações fiscais 100% online.',
            'fullDescription' => 'Capacitação ágil com foco na gestão contábil moderna e desburocratizada. Indicado para microempreendedores, assistentes administrativos e gestores. Aborda abertura e regularização de MEI, desenquadramento, declaração anual DASN-SIMEI, emissão de notas municipais e estaduais, conciliação bancária e integração com meios de pagamento como Mercado Pago.',
            'category' => 'Negócios',
            'price' => 320.00,
            'workloadHours' => 60,
            'level' => 'Iniciante',
            'instructorName' => 'Sofia Vanguard',
            'instructorTitle' => 'Expert Vanguard em Cursos & Gestão Estratégica',
            'thumbnail' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 198,
            'rating' => 4.95,
            'modality' => 'online',
            'tags' => ['Contabilidade', 'MEI', 'Notas Fiscais', 'Gestão Financeira', 'Impostos'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Fundamentos da Rotina Contábil e Legislação MEI',
                    'lessons' => [
                        ['title' => '1. Direitos, Deveres e Limites de Faturamento do MEI', 'duration' => '30 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Guia DAS: Emissão e Regularização de Pendências', 'duration' => '35 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'],
                    ]
                ],
                [
                    'title' => 'Módulo 2: Emissão de Notas Fiscais e Conciliação Bancária',
                    'lessons' => [
                        ['title' => '3. Passo a Passo no Emissor Nacional de NFS-e', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
                        ['title' => '4. Conciliação com Mercado Pago e Fluxo de Caixa', 'duration' => '50 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_4',
            'title' => 'Operação e Ajustes de Máquinas Industriais de Alta Produção',
            'shortDescription' => 'Domine o funcionamento de máquinas automáticas, eletrônicas e programáveis para confecções e polos de moda.',
            'fullDescription' => 'Especialização técnica voltada para operadores e mecânicos de chão de fábrica. Técnicas avançadas de corte de linha automático, sensores ópticos, regulagem de calcador pneumático e otimização de velocidade para produção contínua.',
            'category' => 'Engenharia',
            'price' => 590.00,
            'workloadHours' => 100,
            'level' => 'Intermediário',
            'instructorName' => 'Eloizio Assunção (CEO)',
            'instructorTitle' => 'Fundador, CEO & Especialista Mecânico',
            'thumbnail' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 142,
            'rating' => 4.9,
            'modality' => 'hibrido',
            'practicalLocation' => 'Polo Industrial Têxtil São Gonçalo - RJ',
            'tags' => ['Indústria', 'Automação', 'Costura Industrial', 'Pneumática'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Sistemas Eletrônicos e Sensores',
                    'lessons' => [
                        ['title' => '1. Painéis Digitais e Calibração de Sensores de Parada', 'duration' => '40 min', 'completed' => true, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Corte de Linha Automático e Solenoide', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'],
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_5',
            'title' => 'Gestão Financeira 360°, Liderança & Finanças Educacionais',
            'shortDescription' => 'Estratégias de expansão pedagógica, compliance regulatório e gestão financeira sustentável.',
            'fullDescription' => 'Curso intensivo para gestores, diretores, coordenadores e líderes de instituições de ensino. Abrange precificação de mensalidades, retenção de matrículas, automação acadêmica e relatórios gerenciais.',
            'category' => 'Negócios',
            'price' => 1450.00,
            'workloadHours' => 240,
            'level' => 'Intermediário',
            'instructorName' => 'Prof. Me. Carlos Mendes',
            'instructorTitle' => 'Especialista em Gestão Estratégica e Finanças',
            'thumbnail' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 215,
            'rating' => 4.85,
            'modality' => 'online',
            'tags' => ['Gestão', 'Finanças', 'Liderança', 'Educação'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Orçamento e Fluxo de Caixa',
                    'lessons' => [
                        ['title' => '1. Estruturação do Fluxo de Caixa Educacional', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_6',
            'title' => 'UI/UX Design de Produtos Digitais & Design Systems',
            'shortDescription' => 'Criação de interfaces acessíveis, prototipagem avançada em Figma e componentes em escala.',
            'fullDescription' => 'Domine pesquisas qualitativas de usuários, testes de usabilidade, heurísticas de Nielsen e a construção de Design Systems robustos para aplicações Web e Mobile.',
            'category' => 'Design',
            'price' => 1290.00,
            'workloadHours' => 180,
            'level' => 'Iniciante',
            'instructorName' => 'Profa. Dra. Mariana Fernandes',
            'instructorTitle' => 'Designer & Pesquisadora em IHC',
            'thumbnail' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 189,
            'rating' => 4.95,
            'modality' => 'online',
            'tags' => ['Figma', 'UI/UX', 'Design System', 'Prototipagem'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Fundamentos de UX',
                    'lessons' => [
                        ['title' => '1. Heurísticas de Usabilidade e Acessibilidade WCAG', 'duration' => '50 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_7',
            'title' => 'Mecânica e Regulagem de Máquinas de Costura Domésticas (100% Online EAD)',
            'shortDescription' => 'Curso prático 100% a distância para aprender consertos, regulagem de ponto e lubrificação de Singer, Elgin e Janome.',
            'fullDescription' => 'Formação 100% online voltada para costureiras, ateliês e futuros técnicos em qualquer lugar do Brasil. Aprenda anatomia mecânica, regulagem de laçada, remoção de folgas, troca de correias e manutenção preventiva sem sair da sua casa.',
            'category' => 'Engenharia',
            'price' => 380.00,
            'workloadHours' => 60,
            'level' => 'Iniciante',
            'instructorName' => 'Eloizio Assunção (CEO)',
            'instructorTitle' => 'Fundador & Especialista Mecânico com 30+ anos de experiência',
            'thumbnail' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 176,
            'rating' => 4.95,
            'modality' => 'online',
            'tags' => ['Máquinas Domésticas', 'Singer', 'Elgin', 'Janome', 'EAD 100% Online'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Anatomia das Máquinas Domésticas',
                    'lessons' => [
                        ['title' => '1. Componentes e Desmontagem Segura', 'duration' => '35 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Tensão da Linha e Troca de Lançadeira', 'duration' => '40 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_8',
            'title' => 'Eletrônica e Manutenção de Motores Direct-Drive e Painéis Digitais',
            'shortDescription' => 'Formação híbrida com teoria online e plantão presencial com bancada e osciloscópio no Polo Técnico em São Gonçalo - RJ.',
            'fullDescription' => 'Especialização de alto nível para técnicos que desejam reparar placas eletrônicas, inversores de frequência e motores direct-drive para confecções modernas. Módulos teóricos online e imersão prática na oficina técnica de São Gonçalo.',
            'category' => 'Engenharia',
            'price' => 650.00,
            'workloadHours' => 120,
            'level' => 'Avançado',
            'instructorName' => 'Eloizio Assunção (CEO)',
            'instructorTitle' => 'Fundador & Especialista Mecânico e Eletrônico',
            'thumbnail' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 98,
            'rating' => 5.0,
            'modality' => 'hibrido',
            'practicalLocation' => 'Laboratório Eletrônico Polo São Gonçalo - RJ',
            'tags' => ['Eletrônica', 'Direct-Drive', 'Inversores', 'São Gonçalo', 'Híbrido'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Circuitos de Potência e Inversores',
                    'lessons' => [
                        ['title' => '1. Diagnóstico de Códigos de Erro (E1 a E9)', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_9',
            'title' => 'Curso Completo de Cuidador de Idosos e Dependentes (Legislação RJ - Lei nº 8.528/2019 & CBO 5162-10)',
            'shortDescription' => 'Formação profissional integral regulamentada no Rio de Janeiro com estágio supervisionado conveniado e práticas em São Gonçalo - RJ.',
            'fullDescription' => 'Formação oficial completa em conformidade rigorosa com a Lei Estadual RJ nº 8.528/2019 e CBO 5162-10. O programa capacita para o cuidado integral humanizado de idosos e pessoas com dependência física ou cognitiva. Abrange primeiros socorros geriátricos, administração segura de rotinas e medicamentos sob prescrição médica, nutrição da terceira idade, transferências posturais, direitos fundamentais do Estatuto do Idoso (Lei Federal nº 10.741/2003) e estágio supervisionado opcional conveniado.',
            'category' => 'Saúde & Cuidado',
            'price' => 450.00,
            'workloadHours' => 240,
            'level' => 'Iniciante',
            'instructorName' => 'Enfª Esp. Beatriz Albuquerque',
            'instructorTitle' => 'Especialista em Gerontologia & Cuidados Integrados',
            'thumbnail' => 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 312,
            'rating' => 4.98,
            'modality' => 'hibrido',
            'practicalLocation' => 'Polo de Saúde & Enfermagem São Gonçalo - RJ',
            'tags' => ['Cuidador de Idosos', 'Legislação RJ', 'Lei 8.528/2019', 'CBO 5162-10', 'Primeiros Socorros', 'São Gonçalo', 'Híbrido'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Marco Legal do RJ e Princípios do Cuidado',
                    'lessons' => [
                        ['title' => '1. Legislação Fluminense para Cuidadores de Idosos (Lei 8.528/19)', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Primeiros Socorros Geriátricos e Sinais Vitais', 'duration' => '50 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_10',
            'title' => 'Cuidador de Idosos e Dependentes (100% Online EAD - Legislação RJ & CBO 5162-10)',
            'shortDescription' => 'Formação 100% a distância com flexibilidade total, videoaulas práticas de simulação e certificado com validade estadual RJ e nacional.',
            'fullDescription' => 'Capacitação 100% online voltada para quem precisa de flexibilidade para estudar de qualquer cidade do Rio de Janeiro ou do Brasil. Aborda assistência biopsicossocial, sinais de alerta de emergência, noções de higiene e biossegurança, estimulação cognitiva e prevenção de quedas domésticas com suporte tutorial diário da equipe de saúde.',
            'category' => 'Saúde & Cuidado',
            'price' => 340.00,
            'workloadHours' => 180,
            'level' => 'Iniciante',
            'instructorName' => 'Enfª Esp. Beatriz Albuquerque',
            'instructorTitle' => 'Especialista em Gerontologia & Cuidados Integrados',
            'thumbnail' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 224,
            'rating' => 4.94,
            'modality' => 'online',
            'tags' => ['Cuidador de Idosos', '100% Online', 'Legislação RJ', 'Lei 8.528/2019', 'EAD Nacional'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Fundamentos do Cuidado a Distância',
                    'lessons' => [
                        ['title' => '1. Rotinas Diárias e Prevenção de Acidentes', 'duration' => '40 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_11',
            'title' => 'Curso Completo de Massoterapia & Terapias Manuais (Legislação RJ - Lei nº 7.859/2018 & Lei nº 3.968/1961 - CBO 3221-20)',
            'shortDescription' => 'Formação clínica híbrida com anatomia palpatória, manobras terapêuticas e laboratório presencial no Polo São Gonçalo - RJ.',
            'fullDescription' => 'Formação presencial-híbrida estruturada de acordo com a Lei Estadual RJ nº 7.859/2018 (Práticas Integrativas no RJ), a Lei Federal nº 3.968/1961 (Regulamentação dos Massagistas) e a CBO 3221-20. O curso capacita para atuação em clínicas, spas, clubes e atendimento domiciliar. Conteúdo aprofundado em anatomofisiologia, drenagem linfática manual, massagem relaxante e terapêutica, pontos-gatilho (trigger points), shiatsu, ergonomia do terapeuta e normas rigorosas de biossegurança da ANVISA e SES-RJ.',
            'category' => 'Saúde & Terapias',
            'price' => 580.00,
            'workloadHours' => 280,
            'level' => 'Intermediário',
            'instructorName' => 'Prof. Fisioterapeuta Thiago Ramos',
            'instructorTitle' => 'Mestre em Terapias Manuais & Práticas Integrativas',
            'thumbnail' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 268,
            'rating' => 4.97,
            'modality' => 'hibrido',
            'practicalLocation' => 'Clínica-Escola de Terapias Manuais Polo São Gonçalo - RJ',
            'tags' => ['Massoterapia', 'Legislação RJ', 'Lei 7.859/2018', 'Lei 3.968/1961', 'Anatomia Palpatória', 'São Gonçalo', 'Híbrido'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Fundamentos Legais e Biossegurança Clínica',
                    'lessons' => [
                        ['title' => '1. Regulamentação da Massoterapia no Estado do RJ', 'duration' => '50 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'],
                        ['title' => '2. Anatomia Palpatória e Cadeias Miofasciais', 'duration' => '55 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4']
                    ]
                ]
            ]
        ],
        [
            'id' => 'course_12',
            'title' => 'Atualizações e Especializações em Massoterapia (Miofascial, Drenagem & Terapias Manuais RJ)',
            'shortDescription' => 'Módulos modulares 100% online de aperfeiçoamento contínuo para terapeutas manuais, esteticistas e profissionais de saúde.',
            'fullDescription' => 'Programa contínuo de atualização técnica para profissionais que buscam diferenciação clínica. Abrange Liberação Miofascial Instrumental e Manual, Drenagem Linfática Pós-Operatória em Cirurgias Plásticas, Quick Massage Corporativa para eventos e empresas, e Protocolos de Biossegurança em Cabine de Atendimento conforme diretrizes da Vigilância Sanitária do RJ.',
            'category' => 'Saúde & Terapias',
            'price' => 320.00,
            'workloadHours' => 120,
            'level' => 'Avançado',
            'instructorName' => 'Prof. Fisioterapeuta Thiago Ramos',
            'instructorTitle' => 'Mestre em Terapias Manuais & Práticas Integrativas',
            'thumbnail' => 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 185,
            'rating' => 4.96,
            'modality' => 'online',
            'tags' => ['Atualização Massoterapia', 'Liberação Miofascial', 'Drenagem Linfática', 'Legislação RJ', '100% Online'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Técnicas Avançadas e Protocolos Clínicos',
                    'lessons' => [
                        ['title' => '1. Liberação Miofascial e Pontos Gatilho', 'duration' => '45 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
                    ]
                ]
            ]
        ]
    ];
}

function salvarCursosData(array $cursos): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cursos.json';
    file_put_contents($cacheFile, json_encode($cursos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

/**
 * Lista Completa de Alunos Matriculados
 */
function getAlunosData(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_alunos.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'user_student_1',
            'name' => 'Lucas Silva Prado',
            'email' => 'aluno@grupoeloizio.com.br',
            'registrationNumber' => 'MAT-2026-9812',
            'cpf' => '348.***.***-89',
            'phone' => '(21) 99999-8888',
            'status' => 'Matriculado Regular',
            'course' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'courseId' => 'course_1',
            'progressPercent' => 42,
            'certificateCode' => 'CERT-2026-BR-8912',
            'certificateHash' => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'enrolledAt' => '15/02/2026',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            'grades' => [
                ['subject' => 'Arquitetura de Microsserviços & Cloud', 'n1' => 9.5, 'n2' => 8.8, 'trabalho' => 10.0, 'media' => 9.4, 'faltas' => 2, 'frequencia' => '95%', 'status' => 'Aprovado'],
                ['subject' => 'Segurança da Informação e Criptografia', 'n1' => 8.5, 'n2' => 9.0, 'trabalho' => 8.5, 'media' => 8.7, 'faltas' => 1, 'frequencia' => '98%', 'status' => 'Aprovado'],
                ['subject' => 'DevOps & Integração Contínua (CI/CD)', 'n1' => 7.0, 'n2' => 8.0, 'trabalho' => 9.0, 'media' => 7.9, 'faltas' => 3, 'frequencia' => '92%', 'status' => 'Aprovado'],
                ['subject' => 'Bancos de Dados Distribuídos e NoSQL', 'n1' => 8.0, 'n2' => 0.0, 'trabalho' => 8.5, 'media' => 5.5, 'faltas' => 0, 'frequencia' => '100%', 'status' => 'Em Andamento'],
            ],
            'financial' => [
                ['description' => 'Mensalidade 09/2026', 'amount' => 189.00, 'dueDate' => '10/09/2026', 'status' => 'paid', 'method' => 'PIX Mercado Pago'],
                ['description' => 'Mensalidade 10/2026', 'amount' => 189.00, 'dueDate' => '10/10/2026', 'status' => 'paid', 'method' => 'Cartão de Crédito'],
                ['description' => 'Mensalidade 11/2026', 'amount' => 189.00, 'dueDate' => '10/11/2026', 'status' => 'pending', 'method' => 'A Pagar via PIX'],
            ]
        ],
        [
            'id' => 'user_student_2',
            'name' => 'Beatriz Helena Costa',
            'email' => 'beatriz.costa@email.com',
            'registrationNumber' => 'MAT-2026-9813',
            'cpf' => '215.***.***-45',
            'phone' => '(21) 98765-4321',
            'status' => 'Matriculado Regular',
            'course' => 'Mecânica e Manutenção de Máquinas de Costura (Domésticas e Industriais)',
            'courseId' => 'course_2',
            'progressPercent' => 85,
            'certificateCode' => 'CERT-2026-BR-8913',
            'certificateHash' => 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
            'enrolledAt' => '02/03/2026',
            'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
            'grades' => [
                ['subject' => 'Anatomia e Diagnóstico de Máquinas Reta e Overloque', 'n1' => 10.0, 'n2' => 9.5, 'trabalho' => 10.0, 'media' => 9.8, 'faltas' => 0, 'frequencia' => '100%', 'status' => 'Aprovado'],
                ['subject' => 'Sincronismo de Lançadeira e Regulagem de Ponto', 'n1' => 9.0, 'n2' => 9.5, 'trabalho' => 9.5, 'media' => 9.3, 'faltas' => 1, 'frequencia' => '97%', 'status' => 'Aprovado'],
                ['subject' => 'Manutenção em Motores Direct-Drive e Sensores', 'n1' => 8.5, 'n2' => 9.0, 'trabalho' => 9.0, 'media' => 8.8, 'faltas' => 1, 'frequencia' => '97%', 'status' => 'Aprovado'],
            ],
            'financial' => [
                ['description' => 'Matrícula + Curso Completo', 'amount' => 480.00, 'dueDate' => '02/03/2026', 'status' => 'paid', 'method' => 'PIX Mercado Pago'],
            ]
        ],
        [
            'id' => 'user_student_3',
            'name' => 'Carlos Henrique Santos',
            'email' => 'carlos.santos@email.com',
            'registrationNumber' => 'MAT-2026-9814',
            'cpf' => '445.***.***-12',
            'phone' => '(21) 97654-3210',
            'status' => 'Matriculado Regular',
            'course' => 'Contabilidade e Assessoria Prática para MEI e Microempresas',
            'courseId' => 'course_3',
            'progressPercent' => 100,
            'certificateCode' => 'CERT-2026-BR-8914',
            'certificateHash' => 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1',
            'enrolledAt' => '10/01/2026',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
            'grades' => [
                ['subject' => 'Legislação Tributária e Abertura MEI', 'n1' => 9.5, 'n2' => 9.0, 'trabalho' => 9.5, 'media' => 9.3, 'faltas' => 0, 'frequencia' => '100%', 'status' => 'Aprovado'],
                ['subject' => 'Emissão de Notas NFS-e e DASN-SIMEI', 'n1' => 10.0, 'n2' => 9.5, 'trabalho' => 10.0, 'media' => 9.8, 'faltas' => 0, 'frequencia' => '100%', 'status' => 'Aprovado'],
            ],
            'financial' => [
                ['description' => 'Valor Único com Cupom SOFIA15', 'amount' => 272.00, 'dueDate' => '10/01/2026', 'status' => 'paid', 'method' => 'PIX Mercado Pago'],
            ]
        ],
        [
            'id' => 'user_student_4',
            'name' => 'Gabriel Souza Martins',
            'email' => 'gabriel.martins@oficina.com.br',
            'registrationNumber' => 'MAT-2026-9815',
            'cpf' => '512.***.***-78',
            'phone' => '(21) 99123-9988',
            'status' => 'Matriculado Regular',
            'course' => 'Operação e Ajustes de Máquinas Industriais de Alta Produção',
            'courseId' => 'course_4',
            'progressPercent' => 60,
            'certificateCode' => 'CERT-2026-BR-8915',
            'certificateHash' => 'c3d4e5f6a1b27890123456789abcdef0123456789abcdef0123456789abcdef2',
            'enrolledAt' => '14/02/2026',
            'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
            'grades' => [
                ['subject' => 'Regulagens Mecânicas e Pneumática', 'n1' => 8.5, 'n2' => 8.5, 'trabalho' => 9.0, 'media' => 8.7, 'faltas' => 2, 'frequencia' => '94%', 'status' => 'Aprovado'],
            ],
            'financial' => [
                ['description' => 'Parcela 1/3 Curso Industrial', 'amount' => 196.66, 'dueDate' => '14/02/2026', 'status' => 'paid', 'method' => 'Cartão de Crédito'],
                ['description' => 'Parcela 2/3 Curso Industrial', 'amount' => 196.66, 'dueDate' => '14/03/2026', 'status' => 'paid', 'method' => 'Cartão de Crédito'],
                ['description' => 'Parcela 3/3 Curso Industrial', 'amount' => 196.66, 'dueDate' => '14/04/2026', 'status' => 'pending', 'method' => 'Boleto Bancário'],
            ]
        ],
        [
            'id' => 'user_student_5',
            'name' => 'Mariana Lima Ribeiro',
            'email' => 'mariana.lima@design.com.br',
            'registrationNumber' => 'MAT-2026-9816',
            'cpf' => '623.***.***-90',
            'phone' => '(21) 98321-4455',
            'status' => 'Matriculado Regular',
            'course' => 'UI/UX Design de Produtos Digitais & Design Systems',
            'courseId' => 'course_6',
            'progressPercent' => 30,
            'certificateCode' => 'CERT-2026-BR-8916',
            'certificateHash' => 'd4e5f6a1b2c37890123456789abcdef0123456789abcdef0123456789abcdef3',
            'enrolledAt' => '20/03/2026',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            'grades' => [
                ['subject' => 'Design System e Prototipagem Figma', 'n1' => 9.8, 'n2' => 0.0, 'trabalho' => 9.5, 'media' => 6.4, 'faltas' => 0, 'frequencia' => '100%', 'status' => 'Em Andamento'],
            ],
            'financial' => [
                ['description' => 'Mensalidade 1/6 Design UI/UX', 'amount' => 215.00, 'dueDate' => '20/03/2026', 'status' => 'paid', 'method' => 'PIX Mercado Pago'],
                ['description' => 'Mensalidade 2/6 Design UI/UX', 'amount' => 215.00, 'dueDate' => '20/04/2026', 'status' => 'pending', 'method' => 'PIX Mercado Pago'],
            ]
        ]
    ];
}

function salvarAlunosData(array $alunos): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_alunos.json';
    file_put_contents($cacheFile, json_encode($alunos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function getAlunoPadrao(): array
{
    $alunos = getAlunosData();
    return $alunos[0];
}

/**
 * Gestão de Propostas Comerciais de Alunos & Cursos (CRM Leads)
 */
function getPropostasData(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_propostas.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'prop_1',
            'proposalCode' => 'PROP-SOFIA-8821',
            'studentName' => 'Carolina Mendes Ribeiro',
            'email' => 'carolina.ribeiro@email.com',
            'phone' => '(11) 98112-3344',
            'courseTitle' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'courseId' => 'course_1',
            'originalPrice' => 1890.00,
            'discountPercent' => 15,
            'finalPrice' => 1606.50,
            'installments' => 12,
            'installmentValue' => 133.88,
            'coupon' => 'SOFIA15',
            'status' => 'proposta_enviada',
            'notes' => 'Interessada na formação para transição de carreira em tecnologia. Proposta com 15% enviada no WhatsApp.',
            'createdAt' => '29/09/2026 08:10',
            'source' => 'Expert Sofia Vanguard'
        ],
        [
            'id' => 'prop_2',
            'proposalCode' => 'PROP-MEI-4420',
            'studentName' => 'Thiago Faria Albuquerque',
            'email' => 'thiago.albuquerque@empresa.com.br',
            'phone' => '(19) 99778-5522',
            'courseTitle' => 'Contabilidade e Assessoria Prática para MEI e Microempresas',
            'courseId' => 'course_3',
            'originalPrice' => 320.00,
            'discountPercent' => 15,
            'finalPrice' => 272.00,
            'installments' => 6,
            'installmentValue' => 45.33,
            'coupon' => 'SOFIA15',
            'status' => 'em_atendimento',
            'notes' => 'Diretor de escola buscando regularização de MEIs prestadores de serviços.',
            'createdAt' => '28/09/2026 17:35',
            'source' => 'WhatsApp Oficial'
        ],
        [
            'id' => 'prop_3',
            'proposalCode' => 'PROP-MEC-3319',
            'studentName' => 'Renato Barbosa de Oliveira',
            'email' => 'renato.costura@gmail.com',
            'phone' => '(21) 98844-1122',
            'courseTitle' => 'Mecânica e Manutenção de Máquinas de Costura (Domésticas e Industriais)',
            'courseId' => 'course_2',
            'originalPrice' => 480.00,
            'discountPercent' => 15,
            'finalPrice' => 408.00,
            'installments' => 10,
            'installmentValue' => 40.80,
            'coupon' => 'SOFIA15',
            'status' => 'proposta_enviada',
            'notes' => 'Mecânico iniciante de São Gonçalo - RJ querendo abrir oficina própria de máquinas de costura.',
            'createdAt' => '30/09/2026 11:20',
            'source' => 'Balcão São Gonçalo'
        ],
        [
            'id' => 'prop_4',
            'proposalCode' => 'PROP-IND-7712',
            'studentName' => 'Juliana Vasconcelos de Souza',
            'email' => 'juliana.confeccao@hotmail.com',
            'phone' => '(21) 97123-4567',
            'courseTitle' => 'Operação e Ajustes de Máquinas Industriais de Alta Produção',
            'courseId' => 'course_4',
            'originalPrice' => 590.00,
            'discountPercent' => 15,
            'finalPrice' => 501.50,
            'installments' => 10,
            'installmentValue' => 50.15,
            'coupon' => 'SOFIA15',
            'status' => 'matriculado',
            'notes' => 'Convertida! Pagamento recebido via PIX Mercado Pago pelo Eloizio.',
            'createdAt' => '25/09/2026 14:00',
            'source' => 'Site Grupo Eloizio'
        ],
        [
            'id' => 'prop_5',
            'proposalCode' => 'PROP-ADM-9931',
            'studentName' => 'Roberto Antunes de Castro',
            'email' => 'roberto.gestao@colegio.com.br',
            'phone' => '(22) 99234-8899',
            'courseTitle' => 'Gestão Financeira 360°, Liderança & Finanças Educacionais',
            'courseId' => 'course_5',
            'originalPrice' => 1450.00,
            'discountPercent' => 15,
            'finalPrice' => 1232.50,
            'installments' => 12,
            'installmentValue' => 102.70,
            'coupon' => 'SOFIA15',
            'status' => 'proposta_enviada',
            'notes' => 'Aguardando aprovação orçamentária da mantenedora da instituição.',
            'createdAt' => '02/10/2026 09:40',
            'source' => 'Diretoria Executiva'
        ]
    ];
}

function salvarPropostasData(array $propostas): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_propostas.json';
    file_put_contents($cacheFile, json_encode($propostas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

/**
 * Propostas de Novos Cursos (Submetidas por Professores, Alunos e Comunidade)
 */
function getPropostasNovosCursos(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_propostas_novos_cursos.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'pnc_1',
            'title' => 'Eletrônica e Injeção Eletrônica Automotiva com Osciloscópio',
            'author' => 'Eloizio Assunção & Equipe Mecânica',
            'targetAudience' => 'Mecânicos automotivos, técnicos em injeção e entusiastas',
            'workloadHours' => 120,
            'estimatedPrice' => 690.00,
            'status' => 'Aprovado para Produção',
            'createdAt' => '20/09/2026',
            'description' => 'Treinamento completo de diagnóstico com osciloscópio, análise de sensores de rotação, fase, bicos injetores e chicotes.'
        ],
        [
            'id' => 'pnc_2',
            'title' => 'Regulagem e Placas Eletrônicas em Motores Direct-Drive',
            'author' => 'Eloizio Assunção (CEO)',
            'targetAudience' => 'Mecânicos de confecções industriais e polos de moda',
            'workloadHours' => 90,
            'estimatedPrice' => 520.00,
            'status' => 'Em Gravação de Aulas',
            'createdAt' => '25/09/2026',
            'description' => 'Aprofundamento em conserto de placas integradas, sensores hall e paradas de agulha programáveis.'
        ],
        [
            'id' => 'pnc_3',
            'title' => 'Inteligência Artificial Aplicada aos Negócios & Automação Comercial',
            'author' => 'Profa. Dra. Mariana Fernandes & Sofia Vanguard',
            'targetAudience' => 'Empreendedores, gestores e profissionais de atendimento',
            'workloadHours' => 160,
            'estimatedPrice' => 980.00,
            'status' => 'Em Análise Pedagógica',
            'createdAt' => '01/10/2026',
            'description' => 'Uso prático de chatbots inteligentes, automação de respostas no WhatsApp e integração com meios de pagamento.'
        ]
    ];
}

function salvarPropostasNovosCursos(array $propostas): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_propostas_novos_cursos.json';
    file_put_contents($cacheFile, json_encode($propostas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

/**
 * Certificados e Documentos Acadêmicos Oficiais Emitidos para Validação Pública Instantânea
 * Cobrindo TODOS os setores com autenticação digital criptográfica (SHA-256 / QR Code / ICP-Brasil)
 */
function getCertificadosData(): array
{
    $alunos = getAlunosData();
    $certificados = [
        'DNE-2026-VAL-OK' => [
            'code' => 'DNE-2026-VAL-OK',
            'hash' => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'documentType' => 'Certificado Oficial de Conclusão MEC',
            'issuingSector' => 'Direção Geral & Coordenação Pedagógica',
            'studentName' => 'Lucas Silva Prado',
            'cpf' => '123.456.789-00',
            'registrationNumber' => 'MAT-2026-9812',
            'courseTitle' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'workloadHours' => 360,
            'issueDate' => '15/01/2026',
            'mecCompliant' => true,
            'book' => 'Livro 04',
            'sheet' => 'Folha 89',
            'registryNumber' => 'REG-MEC-2026-00412',
            'status' => 'Autêntico & Válido em Todo o Território Nacional',
            'signedBy' => 'Eloizio Assunção (Diretor Presidente) & Profa. Dra. Mariana Fernandes (Coordenadora)'
        ],
        'DNE-CARTEIRINHA-2026' => [
            'code' => 'DNE-CARTEIRINHA-2026',
            'hash' => 'dne77a98b41cd2290f12456789abcdef0123456789abcdef0123456789abcdef',
            'documentType' => 'Carteirinha Estudantil Digital Oficial (DNE)',
            'issuingSector' => 'Secretaria Acadêmica Central',
            'studentName' => 'Lucas Silva Prado',
            'cpf' => '123.456.789-00',
            'registrationNumber' => 'MAT-2026-9812',
            'courseTitle' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'workloadHours' => 360,
            'issueDate' => 'Ano Letivo 2026 (Validade 31/03/2027)',
            'mecCompliant' => true,
            'book' => 'DNE Nacional',
            'sheet' => 'Série 2026',
            'registryNumber' => 'DNE-BR-2026-998812',
            'status' => 'Autêntico & Válido em Todo o Território Nacional (Lei nº 12.933/13)',
            'signedBy' => 'Roseli Castro (Secretária Geral de Registros Acadêmicos)'
        ],
        'DEC-MAT-2026-OK' => [
            'code' => 'DEC-MAT-2026-OK',
            'hash' => 'dec1010101010101010101010101010101010101010101010101010101010101',
            'documentType' => 'Declaração de Matrícula Regular',
            'issuingSector' => 'Secretaria Acadêmica & Registros',
            'studentName' => 'Lucas Silva Prado',
            'cpf' => '123.456.789-00',
            'registrationNumber' => 'MAT-2026-9812',
            'courseTitle' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'workloadHours' => 360,
            'issueDate' => '10/02/2026',
            'mecCompliant' => true,
            'book' => 'Livro Matrículas',
            'sheet' => 'Folha 18',
            'registryNumber' => 'DEC-MAT-2026-00192',
            'status' => 'Autêntico & Regularmente Matriculado',
            'signedBy' => 'Roseli Castro (Secretária Geral de Registros)'
        ],
        'DEC-CONCL-2026-OK' => [
            'code' => 'DEC-CONCL-2026-OK',
            'hash' => 'dec2020202020202020202020202020202020202020202020202020202020202',
            'documentType' => 'Declaração de Conclusão de Curso',
            'issuingSector' => 'Secretaria Acadêmica & Coordenação Pedagógica',
            'studentName' => 'Camila Vasconcelos',
            'cpf' => '987.654.321-99',
            'registrationNumber' => 'MAT-2025-4421',
            'courseTitle' => 'Gestão Estratégica de Negócios & Liderança Digital',
            'workloadHours' => 280,
            'issueDate' => '28/11/2025',
            'mecCompliant' => true,
            'book' => 'Livro 03',
            'sheet' => 'Folha 42',
            'registryNumber' => 'DEC-CONCL-2025-00891',
            'status' => 'Autêntico & Conclusão Homologada com Aproveitamento 100%',
            'signedBy' => 'Roseli Castro (Secretária) & Sofia Vanguard (Coordenadora de Negócios)'
        ],
        'HIST-OFICIAL-2026-OK' => [
            'code' => 'HIST-OFICIAL-2026-OK',
            'hash' => 'hist303030303030303030303030303030303030303030303030303030303030',
            'documentType' => 'Histórico Escolar Oficial com Notas & Ementas',
            'issuingSector' => 'Secretaria Acadêmica Central',
            'studentName' => 'Lucas Silva Prado',
            'cpf' => '123.456.789-00',
            'registrationNumber' => 'MAT-2026-9812',
            'courseTitle' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'workloadHours' => 360,
            'issueDate' => '05/02/2026',
            'mecCompliant' => true,
            'book' => 'Livro Históricos',
            'sheet' => 'Folha 95',
            'registryNumber' => 'HIST-2026-00412',
            'status' => 'Autêntico & Notas Oficiais Homologadas pelo Colegiado',
            'signedBy' => 'Roseli Castro (Secretária Geral) & Profa. Dra. Mariana Fernandes (Docente)'
        ],
        'ELOIZIO-2026-CERT-OK' => [
            'code' => 'ELOIZIO-2026-CERT-OK',
            'hash' => 'eloizio99887766554433221100aabbccddeeff00112233445566778899aabb',
            'documentType' => 'Certificado Técnico Especialista em Mecânica de Máquinas',
            'issuingSector' => 'Gabinete do CEO & Direção Geral Técnica',
            'studentName' => 'Carlos Eduardo Santos',
            'cpf' => '111.222.333-44',
            'registrationNumber' => 'MAT-2026-7731',
            'courseTitle' => 'Mecânica e Manutenção de Máquinas de Costura (Domésticas e Industriais)',
            'workloadHours' => 120,
            'issueDate' => '29/09/2026',
            'mecCompliant' => true,
            'book' => 'Livro 05',
            'sheet' => 'Folha 12',
            'registryNumber' => 'REG-MEC-2026-00994',
            'status' => 'Autêntico & Registrado no Livro Oficial de Diplomas',
            'signedBy' => 'Eloizio Assunção (Mestre Mecânico & CEO) & Roseli Castro (Secretária)'
        ]
    ];

    foreach ($alunos as $a) {
        if (!empty($a['certificateCode']) && !isset($certificados[$a['certificateCode']])) {
            $certificados[$a['certificateCode']] = [
                'code' => $a['certificateCode'],
                'hash' => $a['certificateHash'],
                'documentType' => 'Certificado Oficial de Conclusão MEC',
                'issuingSector' => 'Direção Geral & Coordenação Pedagógica',
                'studentName' => $a['name'],
                'cpf' => $a['cpf'],
                'registrationNumber' => $a['registrationNumber'],
                'courseTitle' => $a['course'],
                'workloadHours' => 360,
                'issueDate' => '10/03/2026',
                'mecCompliant' => true,
                'book' => 'Livro 04',
                'sheet' => 'Folha 90',
                'registryNumber' => 'REG-MEC-2026-' . substr(md5($a['certificateCode']), 0, 5),
                'status' => 'Autêntico & Válido em Todo o Território Nacional',
                'signedBy' => 'Eloizio Assunção (Diretor Presidente) & Profa. Dra. Mariana Fernandes'
            ];
        }
    }
    return $certificados;
}

/**
 * Eventos do Calendário Acadêmico 2026
 */
function getEventosCalendario(): array
{
    return [
        ['date' => '2026-10-10', 'title' => 'Plantão de Dúvidas ao Vivo com o CEO Eloizio', 'category' => 'live', 'time' => '19:30', 'desc' => 'Tira-dúvidas ao vivo sobre regulagem de ponto e defeitos crônicos em máquinas industriais.'],
        ['date' => '2026-10-15', 'title' => 'Dia dos Professores • Homenagem Acadêmica', 'category' => 'feriado', 'time' => '08:00', 'desc' => 'Recesso comemorativo no atendimento pedagógico presencial.'],
        ['date' => '2026-10-20', 'title' => 'Seminário de Arquitetura Cloud & Microsserviços', 'category' => 'seminar', 'time' => '20:00', 'desc' => 'Aula magna com a Profa. Dra. Mariana Fernandes sobre resiliência em GCP e AWS.'],
        ['date' => '2026-10-28', 'title' => 'Prazo Final: Envio de Avaliações Módulo 1', 'category' => 'exam', 'time' => '23:59', 'desc' => 'Último dia para submissão dos trabalhos no Portal do Aluno.'],
        ['date' => '2026-11-05', 'title' => 'Workshop Prático: Gestão MEI e Emissão de Notas', 'category' => 'live', 'time' => '19:00', 'desc' => 'Treinamento prático no portal nacional com Sofia Vanguard.'],
    ];
}

/**
 * Acervo da Biblioteca Digital e Apostilas Técnicas
 */
function getBibliotecaData(): array
{
    return [
        [
            'id' => 'bib_1',
            'title' => 'Manual Completo do Mecânico de Máquinas de Costura',
            'author' => 'Eloizio Assunção (CEO)',
            'category' => 'Mecânica Industrial',
            'pages' => 142,
            'fileSize' => '14.8 MB',
            'downloadUrl' => '#',
            'description' => 'Guia ilustrado com esquemas de sincronismo de lançadeira, regulagem de calcador e tabela de lubrificantes para máquinas reta, overloque e galoneira.'
        ],
        [
            'id' => 'bib_2',
            'title' => 'Apostila Oficial de Engenharia de Software Moderna & Microsserviços',
            'author' => 'Profa. Dra. Mariana Fernandes',
            'category' => 'Tecnologia',
            'pages' => 260,
            'fileSize' => '22.4 MB',
            'downloadUrl' => '#',
            'description' => 'Padrões de projeto SOLID, Clean Architecture, mensageria com RabbitMQ/Kafka e arquitetura cloud distribuída.'
        ],
        [
            'id' => 'bib_3',
            'title' => 'Guia Descomplicado do MEI: Do Cadastro à Nota Fiscal',
            'author' => 'Sofia Vanguard',
            'category' => 'Contabilidade & Negócios',
            'pages' => 88,
            'fileSize' => '8.2 MB',
            'downloadUrl' => '#',
            'description' => 'Passo a passo com telas do portal nacional da NFS-e, emissão de guias DAS e declaração anual DASN-SIMEI sem multas.'
        ],
        [
            'id' => 'bib_4',
            'title' => 'Regimento Geral e Normas Acadêmicas do Grupo Eloizio',
            'author' => 'Diretoria Geral & Coordenação Pedagógica',
            'category' => 'Institucional',
            'pages' => 45,
            'fileSize' => '3.5 MB',
            'downloadUrl' => '#',
            'description' => 'Critérios de aprovação (média mínima 7.0 e frequência 75%), emissão de certificados válidos pelo MEC e código de conduta.'
        ]
    ];
}

/**
 * Mensagens do Chat Interno
 */
function getMensagensChat(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_chat.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        ['id' => 'c1', 'channel' => 'geral', 'author' => 'Eloizio Assunção (CEO)', 'role' => 'admin', 'text' => 'Sejam muito bem-vindos ao Grupo Eloizio! Estamos à disposição para apoiar sua capacitação profissional!', 'time' => 'Ontem 10:00'],
        ['id' => 'c2', 'channel' => 'geral', 'author' => 'Sofia Vanguard', 'role' => 'admin', 'text' => 'Bom dia alunos! Lembrando que o cupom SOFIA15 segue ativo para quem deseja iniciar um novo curso com 15% de desconto.', 'time' => 'Ontem 10:15'],
        ['id' => 'c3', 'channel' => 'suporte', 'author' => 'Lucas Silva Prado', 'role' => 'student', 'text' => 'Olá Sofia, meu certificado foi emitido certinho com o QR Code! Obrigado pela agilidade!', 'time' => 'Hoje 09:20'],
        ['id' => 'c4', 'channel' => 'suporte', 'author' => 'Sofia Vanguard', 'role' => 'admin', 'text' => 'Parabéns pela conquista Lucas! Seu certificado já consta como autenticado no validador oficial.', 'time' => 'Hoje 09:22'],
    ];
}

function salvarMensagemChat(array $novaMensagem): void
{
    $msgs = getMensagensChat();
    $msgs[] = $novaMensagem;
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_chat.json';
    file_put_contents($cacheFile, json_encode($msgs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

/**
 * =========================================================================
 * COOPERATIVA DE MELHORES ALUNOS, EMPREGABILIDADE E BANCO DE TALENTOS
 * =========================================================================
 */

function getCooperativaMembrosData(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cooperativa_membros.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'coop_1',
            'userId' => 'usr_1',
            'name' => 'Lucas Silva Prado',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
            'registrationNumber' => 'MAT-2026-9812',
            'courseTitle' => 'Engenharia de Software Moderna & Arquitetura Cloud',
            'courseCategory' => 'Tecnologia',
            'city' => 'São Gonçalo - RJ (Disponível Remoto / Híbrido)',
            'overallAverage' => 9.4,
            'completionPercentage' => 100,
            'topPerformerBadge' => true,
            'bio' => 'Desenvolvedor Fullstack com sólida bagagem em TypeScript, React, PHP, Node.js e microsserviços. Formado com distinção acadêmica no EduVanguard.',
            'technicalSkills' => ['PHP 8.2', 'TypeScript', 'React.js', 'PostgreSQL', 'Docker', 'Clean Architecture', 'APIs REST'],
            'storedExams' => [
                [
                    'examId' => 'ex_1',
                    'title' => 'Avaliação Teórica de Microsserviços e APIs Resilientes',
                    'score' => 10.0,
                    'maxPoints' => 10,
                    'date' => '15/01/2026',
                    'category' => 'Arquitetura de Software',
                    'verifiedBy' => 'Profa. Dra. Mariana Fernandes',
                    'certificateHash' => 'DNE-2026-VAL-OK',
                    'feedback' => 'Desempenho exemplar na modelagem de microsserviços e resiliência.'
                ],
                [
                    'examId' => 'ex_2',
                    'title' => 'Prova Prática: Pipeline CI/CD e Conteinerização',
                    'score' => 9.6,
                    'maxPoints' => 10,
                    'date' => '28/01/2026',
                    'category' => 'DevOps & Nuvem',
                    'verifiedBy' => 'Profa. Dra. Mariana Fernandes',
                    'certificateHash' => 'DNE-2026-VAL-OK',
                    'feedback' => 'Excelente organização de contêineres e scripts automatizados.'
                ]
            ],
            'courseUpdates' => [
                [
                    'year' => 2026,
                    'title' => 'Atualização Tecnológica: IA Generativa & Agentes Autônomos em Produção',
                    'hours' => 40,
                    'status' => 'atualizado',
                    'badge' => 'Certificação 2026 Ativa'
                ],
                [
                    'year' => 2026,
                    'title' => 'Reciclagem de Segurança em Nuvem & Conformidade LGPD',
                    'hours' => 20,
                    'status' => 'atualizado',
                    'badge' => 'Especialista Homologado'
                ]
            ],
            'contactPhone' => '(21) 98112-9988',
            'contactEmail' => 'lucas.prado.dev@gmail.com',
            'availableForHire' => true,
            'linkedinOrPortfolio' => 'https://github.com/lucas-prado-eng',
            'resumeSummary' => 'Engenheiro de Software com foco em sistemas de alta disponibilidade e integrações seguras.',
            'hasConcludedCourse' => true,
            'badgeIssued' => true,
            'badgeStatus' => 'isento_concluinte',
            'badgeAnnualRenewalFee' => 0.0,
            'isBadgeRenewalExempt' => true
        ],
        [
            'id' => 'coop_2',
            'userId' => 'usr_2',
            'name' => 'Carlos Eduardo Santos',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
            'registrationNumber' => 'MAT-2026-7731',
            'courseTitle' => 'Mecânica e Regulagem de Máquinas de Costura (Domésticas e Industriais)',
            'courseCategory' => 'Engenharia',
            'city' => 'São Gonçalo - RJ (Atende Niterói, Itaboraí e Região)',
            'overallAverage' => 9.8,
            'completionPercentage' => 100,
            'topPerformerBadge' => true,
            'bio' => 'Mestre técnico especialista em manutenção preventiva e corretiva de máquinas reta, overloque, galoneira e motores direct-drive. Formado pelo Grupo Eloizio com laudo técnico para confecções.',
            'technicalSkills' => ['Sincronismo de Lançadeira', 'Regulagem de Ponto', 'Máquinas Direct-Drive', 'Overloque Industrial', 'Galoneira', 'Mecânica Fina', 'Diagnóstico Eletrônico'],
            'hasConcludedCourse' => true,
            'badgeIssued' => true,
            'badgeStatus' => 'isento_concluinte',
            'badgeAnnualRenewalFee' => 0.0,
            'isBadgeRenewalExempt' => true,
            'storedExams' => [
                [
                    'examId' => 'ex_mec_1',
                    'title' => 'Prova Prática: Ajuste Fino de Lançadeira e Ponto de Laçada',
                    'score' => 10.0,
                    'maxPoints' => 10,
                    'date' => '20/09/2026',
                    'category' => 'Mecânica Aplicada',
                    'verifiedBy' => 'Eloizio Assunção (Mestre CEO)',
                    'certificateHash' => 'ELOIZIO-2026-CERT-OK',
                    'feedback' => 'Calibração milimétrica sem folga e sem quebra de agulhas.'
                ],
                [
                    'examId' => 'ex_mec_2',
                    'title' => 'Diagnóstico e Troca de Sensores em Motores Direct-Drive',
                    'score' => 9.8,
                    'maxPoints' => 10,
                    'date' => '25/09/2026',
                    'category' => 'Eletrônica e Automação',
                    'verifiedBy' => 'Eloizio Assunção (Mestre CEO)',
                    'certificateHash' => 'ELOIZIO-2026-CERT-OK',
                    'feedback' => 'Capacidade comprovada de recuperar placas e paradas programadas de agulha.'
                ]
            ],
            'courseUpdates' => [
                [
                    'year' => 2026,
                    'title' => 'Atualização Mecânica 2026: Motores Eletrônicos com Painel Touch',
                    'hours' => 30,
                    'status' => 'atualizado',
                    'badge' => 'Credencial Técnica Oficial'
                ]
            ],
            'contactPhone' => '(21) 98764-8727',
            'contactEmail' => 'eloizio.mecanica.oficial@gmail.com',
            'availableForHire' => true,
            'linkedinOrPortfolio' => 'https://grupoeloizio.com.br/mecanica',
            'resumeSummary' => 'Profissional gabaritado para gerenciar manutenção em fábricas de vestuário ou consultoria técnica independente.'
        ],
        [
            'id' => 'coop_3',
            'userId' => 'usr_3',
            'name' => 'Camila Vasconcelos',
            'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
            'registrationNumber' => 'MAT-2025-4421',
            'courseTitle' => 'Contabilidade Digital & Assessoria Prática',
            'courseCategory' => 'Negócios',
            'city' => 'Niterói - RJ (Remoto / Presencial)',
            'overallAverage' => 9.6,
            'completionPercentage' => 100,
            'topPerformerBadge' => true,
            'bio' => 'Especialista em escrituração fiscal, SPED, conciliação financeira e abertura de empresas MEI e Simples Nacional.',
            'technicalSkills' => ['SPED Fiscal', 'Simples Nacional', 'MEI Sem Erro', 'Conciliação Bancária', 'Gestão Financeira'],
            'storedExams' => [
                [
                    'examId' => 'ex_cont_1',
                    'title' => 'Elaboração e Fechamento de Balancete Mensal do Simples',
                    'score' => 9.8,
                    'maxPoints' => 10,
                    'date' => '05/02/2026',
                    'category' => 'Contabilidade Prática',
                    'verifiedBy' => 'Coordenação Pedagógica Grupo Eloizio',
                    'certificateHash' => 'CONT-2026-VAL-OK',
                    'feedback' => 'Fechamento sem divergências e conciliação perfeita de extratos.'
                ]
            ],
            'courseUpdates' => [
                [
                    'year' => 2026,
                    'title' => 'Atualização Tributária 2026: Reforma e Regras do Simples',
                    'hours' => 25,
                    'status' => 'atualizado',
                    'badge' => 'Cooperado Atualizado 2026'
                ]
            ],
            'contactPhone' => '(21) 99613-4073',
            'contactEmail' => 'camila.contabil@gmail.com',
            'availableForHire' => true,
            'linkedinOrPortfolio' => 'https://linkedin.com',
            'resumeSummary' => 'Analista contábil para escritórios e suporte direto a microempresários.'
        ]
    ];
}

function salvarCooperativaMembrosData(array $membros): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cooperativa_membros.json';
    file_put_contents($cacheFile, json_encode($membros, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function getVagasCooperativaData(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cooperativa_vagas.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'vaga_1',
            'title' => 'Mecânico de Máquinas de Costura Industrial (Reta & Overlock)',
            'companyName' => 'Confecções Guanabara & Cia',
            'location' => 'São Gonçalo - RJ (Alcântara)',
            'salaryRange' => 'R$ 3.800 - R$ 4.500',
            'type' => 'clt',
            'category' => 'Mecânica e Máquinas',
            'description' => 'Buscamos mecânico capacitado para atuar na manutenção preventiva e corretiva de maquinário industrial de vestuário na fábrica de Alcântara.',
            'requirements' => [
                'Certificado de conclusão em Mecânica de Máquinas pelo Grupo Eloizio ou similar',
                'Experiência em ajuste fino de lançadeira e motores direct-drive',
                'Disponibilidade para início imediato'
            ],
            'benefits' => [
                'Vale Refeição R$ 35/dia',
                'Vale Transporte',
                'Plano de Saúde e Odontológico',
                'Cesta Básica'
            ],
            'contactEmail' => 'rh@confeccoesguanabara.com.br',
            'contactPhone' => '(21) 99613-4073',
            'createdAt' => '05/02/2026',
            'status' => 'open',
            'applicantsCount' => 3
        ],
        [
            'id' => 'vaga_2',
            'title' => 'Assistente de Escrita Fiscal & Contabilidade Digital',
            'companyName' => 'Assessoria Contábil Rio Leste',
            'location' => 'Niterói / São Gonçalo - RJ (Híbrido)',
            'salaryRange' => 'R$ 2.600 - R$ 3.200',
            'type' => 'clt',
            'category' => 'Contabilidade e Gestão',
            'description' => 'Vaga para atuação com conciliações contábeis, apuração de impostos do Simples Nacional e declarações acessórias.',
            'requirements' => [
                'Formação no curso de Contabilidade Digital do Grupo Eloizio',
                'Conhecimento de emissão de NFS-e e SPED',
                'Boa comunicação com clientes'
            ],
            'benefits' => [
                'Vale Alimentação R$ 750/mês',
                'Vale Transporte',
                'Seguro de Vida'
            ],
            'contactEmail' => 'selecao@riolestecontabil.com.br',
            'contactPhone' => '(21) 99613-4073',
            'createdAt' => '10/02/2026',
            'status' => 'open',
            'applicantsCount' => 2
        ],
        [
            'id' => 'vaga_estagio_1',
            'title' => 'Estágio Opcional Supervisionado: Mecânica & Regulagem de Máquinas',
            'companyName' => 'Polo Têxtil Guanabara & Confecções Rio',
            'location' => 'São Gonçalo - RJ (Presencial / Oficina)',
            'salaryRange' => 'Bolsa R$ 1.500/mês + Auxílio Transporte + Seguro (180h)',
            'type' => 'estagio',
            'category' => 'Mecânica e Máquinas',
            'isOptionalInternship' => true,
            'internshipHours' => 180,
            'modality' => 'presencial',
            'supervisorName' => 'Gilberto Faria - Supervisor Técnico Chefe',
            'allowCourseValidation' => true,
            'description' => 'Vaga de estágio opcional supervisionado para validação curricular (Lei nº 11.788/2008). O estudante atuará na bancada técnica com manutenção de máquinas reta, overloque e eletrônicas direct-drive. As horas homologadas somam diretamente ao Certificado Oficial do Grupo Eloizio!',
            'requirements' => [
                'Matrícula ativa ou conclusão em curso de Mecânica pelo Grupo Eloizio',
                'Interesse em regulagem prática de lançadeiras e motores eletrônicos',
                'Comprometimento de 20h a 30h semanais com horários flexíveis'
            ],
            'benefits' => [
                'Bolsa-auxílio pontual via Mercado Pago',
                'Termo Oficial de Homologação (+180h no Certificado Oficial)',
                'Possibilidade real de contratação CLT ao término do estágio'
            ],
            'contactEmail' => 'estagios@polotextilrio.com.br',
            'contactPhone' => '(21) 99613-4073',
            'createdAt' => '12/02/2026',
            'status' => 'open',
            'applicantsCount' => 4
        ],
        [
            'id' => 'vaga_estagio_2',
            'title' => 'Estágio Opcional em Desenvolvimento Web & APIs Cloud',
            'companyName' => 'Vanguard Cloud & Software Hub',
            'location' => 'Rio de Janeiro / Remoto 100% Online',
            'salaryRange' => 'Bolsa R$ 1.800/mês + Auxílio Home Office (160h)',
            'type' => 'estagio',
            'category' => 'Tecnologia',
            'isOptionalInternship' => true,
            'internshipHours' => 160,
            'modality' => 'remoto',
            'supervisorName' => 'Dr. Fernando Vasconcelos - Tech Lead',
            'allowCourseValidation' => true,
            'description' => 'Estágio supervisionado com desenvolvimento de microsserviços, automação de testes e APIs em nuvem. As 160h práticas são homologadas e somadas ao seu Certificado de Engenharia de Software!',
            'requirements' => [
                'Estar cursando Engenharia de Software ou Desenvolvimento Web',
                'Conhecimento de TypeScript, PHP, Node.js ou React',
                'Boa comunicação para trabalho colaborativo assíncrono'
            ],
            'benefits' => [
                'Bolsa-auxílio R$ 1.800/mês',
                'Termo digital com chave SHA-256 de validação',
                'Horário flexível e mentoria individual'
            ],
            'contactEmail' => 'talentos@vanguardtech.dev',
            'contactPhone' => '(21) 99613-4073',
            'createdAt' => '15/02/2026',
            'status' => 'open',
            'applicantsCount' => 6
        ]
    ];
}

function salvarVagasCooperativaData(array $vagas): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cooperativa_vagas.json';
    file_put_contents($cacheFile, json_encode($vagas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function getCandidaturasCooperativaData(): array
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cooperativa_candidaturas.json';
    if (file_exists($cacheFile)) {
        $raw = file_get_contents($cacheFile);
        $decoded = json_decode((string)$raw, true);
        if (is_array($decoded) && count($decoded) > 0) {
            return $decoded;
        }
    }

    return [
        [
            'id' => 'cand_1',
            'vacancyId' => 'vaga_1',
            'vacancyTitle' => 'Mecânico de Máquinas de Costura Industrial (Reta & Overlock)',
            'memberId' => 'coop_2',
            'memberName' => 'Carlos Eduardo Santos',
            'appliedAt' => '12/02/2026',
            'status' => 'entrevista_agendada',
            'coverNote' => 'Possuo domínio completo em motores eletrônicos direct-drive e sincronismo de lançadeira comprovado nas avaliações do curso.'
        ],
        [
            'id' => 'cand_2',
            'vacancyId' => 'vaga_2',
            'vacancyTitle' => 'Assistente de Escrita Fiscal & Contabilidade Digital',
            'memberId' => 'coop_3',
            'memberName' => 'Camila Vasconcelos',
            'appliedAt' => '14/02/2026',
            'status' => 'em_analise',
            'coverNote' => 'Tenho disponibilidade imediata para trabalho híbrido com foco em Simples Nacional e MEI.'
        ]
    ];
}

function salvarCandidaturasCooperativaData(array $candidaturas): void
{
    $cacheFile = sys_get_temp_dir() . '/grupo_eloizio_cooperativa_candidaturas.json';
    file_put_contents($cacheFile, json_encode($candidaturas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

