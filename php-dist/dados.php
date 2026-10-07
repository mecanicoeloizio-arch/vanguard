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
            'fullDescription' => 'Este curso completo de nível superior desenvolve competências sólidas em microsserviços, DevOps, segurança de software, banco de dados distribuídos e automação em nuvem com GCP e AWS. Aulas teóricas e práticas com projetos reais.',
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
            'instructorName' => 'Eloizio Silva (CEO)',
            'instructorTitle' => 'Fundador, CEO & Especialista Mecânico com 30+ anos de experiência',
            'thumbnail' => 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
            'featured' => true,
            'enrolledStudentsCount' => 285,
            'rating' => 5.0,
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
            'instructorName' => 'Eloizio Silva (CEO)',
            'instructorTitle' => 'Fundador, CEO & Especialista Mecânico',
            'thumbnail' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
            'featured' => false,
            'enrolledStudentsCount' => 142,
            'rating' => 4.9,
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
            'tags' => ['Figma', 'UI/UX', 'Design System', 'Prototipagem'],
            'syllabus' => [
                [
                    'title' => 'Módulo 1: Fundamentos de UX',
                    'lessons' => [
                        ['title' => '1. Heurísticas de Usabilidade e Acessibilidade WCAG', 'duration' => '50 min', 'completed' => false, 'videoUrl' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4']
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
            'author' => 'Eloizio Silva & Equipe Mecânica',
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
            'author' => 'Eloizio Silva (CEO)',
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
 * Certificados Oficiais Emitidos para Validação Pública Instantânea
 */
function getCertificadosData(): array
{
    $alunos = getAlunosData();
    $certificados = [];
    foreach ($alunos as $a) {
        if (!empty($a['certificateCode'])) {
            $certificados[$a['certificateCode']] = [
                'code' => $a['certificateCode'],
                'hash' => $a['certificateHash'],
                'studentName' => $a['name'],
                'cpf' => $a['cpf'],
                'registrationNumber' => $a['registrationNumber'],
                'courseTitle' => $a['course'],
                'workloadHours' => 360,
                'issueDate' => '10/03/2026',
                'mecCompliant' => true,
                'status' => 'Autêntico & Válido em Todo o Território Nacional',
                'signedBy' => 'Eloizio Silva (Diretor Presidente) & Profa. Dra. Mariana Fernandes'
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
            'author' => 'Eloizio Silva (CEO)',
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
        ['id' => 'c1', 'channel' => 'geral', 'author' => 'Eloizio Silva (CEO)', 'role' => 'admin', 'text' => 'Sejam muito bem-vindos ao Grupo Eloizio! Estamos à disposição para apoiar sua capacitação profissional!', 'time' => 'Ontem 10:00'],
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
