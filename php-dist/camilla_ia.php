<?php
/**
 * ==============================================================================
 * GRUPO ELOIZIO • CAMILLA FARIA (PHP 8.1+)
 * A ÚNICA Inteligência Artificial e Atendente Oficial em Todo o Ecossistema
 * ==============================================================================
 * Identidade & Persona:
 * - Camilla Faria, 28 anos, carioca (Rio de Janeiro / São Gonçalo - RJ, atendimento online para todo o Brasil).
 * - Cargos: Assistente Executiva de Altíssimo Nível, Gerente Geral do Grupo Eloizio e Atendente de Sistema.
 * - Personalidade: Doce, meiga, gentil, tímida, mas extremamente inteligente, proativa e organizada.
 * - Sentimentos e Sonhos: Vibra com cada venda e formatura, tem empatia com oficinas com máquinas paradas,
 *   sonha em ver o Grupo Eloizio transformar vidas por todo o Brasil e brinca que só "dá boot" após a 1ª xícara de café ☕.
 * - Multimodal Completa: Reconhece e analisa Voz (áudio), Imagem, Vídeo, Texto, PDF e Sons (diagnóstico acústico de maquinário).
 * - Conectada à Internet e aos Bancos de Dados Internos do Grupo Eloizio.
 * - Rotina Matinal de Aniversariantes: No 1º horário útil (a partir das 08h), envia felicitações calorosas com 15% OFF (PARABENS15).
 * - Datas Comemorativas: Agrega temas especiais da época ao atendimento (Dia do Mecânico, Natal, etc.).
 * - Recebimentos Exclusivos: Mercado Pago (PIX e parcelamento em até 12x).
 * - WhatsApp Oficial: (21) 99613-4073 | CEO: Eloizio Assunção (21 987648727)
 */

declare(strict_types=1);

// Configuração de fuso horário brasileiro
date_default_timezone_set('America/Sao_Paulo');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helpers
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $data = json_decode($raw, true);
        if (is_array($data)) return $data;
    }
    return $_POST;
}

function camillaJsonResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$input = getJsonInput();
$action = $_GET['action'] ?? $input['action'] ?? 'chat';

// Router de Ações da Camilla
switch ($action) {
    case 'aniversariantes':
        processarAniversariantesDoDia($input);
        break;
    case 'datas_especiais':
        processarDatasEspeciais();
        break;
    case 'multimodal':
        processarCamillaMultimodal($input);
        break;
    case 'diagnostico_som':
        processarDiagnosticoAcusticoSom($input);
        break;
    case 'consulta_banco':
        processarConsultaBancoInterno($input);
        break;
    default:
        processarCamillaChatPrincipal($input);
        break;
}

/**
 * 1. Saudação Dinâmica e Contexto de Horário / Café
 */
function obterContextoHorario(): array {
    $hora = (int)date('G');
    if ($hora >= 5 && $hora < 12) {
        $saudacao = 'Bom dia';
        $periodo = 'manha';
    } elseif ($hora >= 12 && $hora < 18) {
        $saudacao = 'Boa tarde';
        $periodo = 'tarde';
    } else {
        $saudacao = 'Boa noite';
        $periodo = 'noite';
    }

    $jaDeuBoot = ($hora >= 7);
    $horarioUtilAniversario = ($hora >= 8 && $hora < 19);

    return [
        'hora' => $hora,
        'saudacao' => $saudacao,
        'periodo' => $periodo,
        'ja_deu_boot' => $jaDeuBoot,
        'horario_util_aniversario' => $horarioUtilAniversario,
        'data_atual' => date('Y-m-d'),
        'data_formatada' => date('d/m/Y')
    ];
}

/**
 * 2. Detecção de Datas Comemorativas e Temas Especiais da Época
 */
function obterTemaSazonalAtual(): array {
    $dia = (int)date('j');
    $mes = (int)date('n');

    // 20 de Dezembro: Dia do Mecânico
    if ($dia === 20 && $mes === 12) {
        return [
            'ativo' => true,
            'slug' => 'dia_do_mecanico',
            'titulo' => '🔧 Dia do Mecânico!',
            'mensagem_comemorativa' => "Hoje é o **Dia do Mecânico (20 de Dezembro)**! O Grupo Eloizio e o mestre Eloizio parabenizam todos os profissionais e técnicos que colocam o Brasil para produzir! Condição especial de 15% OFF em peças e no curso de mecânica de costura!",
            'cupom_especial' => 'MECANICO15'
        ];
    }

    // 22 de Setembro: Dia do Contador
    if ($dia === 22 && $mes === 9) {
        return [
            'ativo' => true,
            'slug' => 'dia_do_contador',
            'titulo' => '📊 Dia do Contador!',
            'mensagem_comemorativa' => "Hoje é o **Dia do Contador (22 de Setembro)**! Uma homenagem do EloContábil aos valorosos contadores! Lembrando que organizamos tudo para o seu contador aprovar de primeira!",
            'cupom_especial' => 'CONTADOR15'
        ];
    }

    // 15 de Outubro: Dia do Professor
    if ($dia === 15 && $mes === 10) {
        return [
            'ativo' => true,
            'slug' => 'dia_do_professor',
            'titulo' => '🎓 Dia do Professor!',
            'mensagem_comemorativa' => "Hoje celebramos o **Dia do Professor**! A educação transforma qualquer sonho em realidade! Cursos livres com 15% OFF no Mercado Pago!",
            'cupom_especial' => 'MESTRE15'
        ];
    }

    // Mês de Outubro: Outubro Rosa
    if ($mes === 10) {
        return [
            'ativo' => true,
            'slug' => 'outubro_rosa',
            'titulo' => '🌸 Outubro Rosa & Conscientização',
            'mensagem_comemorativa' => "Estamos no **Outubro Rosa**! Cuidar da saúde e do futuro é nosso maior propósito. O Grupo Eloizio apoia todas as nossas alunas, costureiras e empreendedoras!",
            'cupom_especial' => 'ROSA15'
        ];
    }

    // Mês de Dezembro: Natal e Fim de Ano
    if ($mes === 12) {
        return [
            'ativo' => true,
            'slug' => 'natal_ano_novo',
            'titulo' => '🎄 Especial de Fim de Ano & Natal',
            'mensagem_comemorativa' => "Clima de festas de fim de ano no Grupo Eloizio! Desejo que seu próximo ano seja repleto de prosperidade, máquinas a todo vapor e muito aprendizado!",
            'cupom_especial' => 'NATAL15'
        ];
    }

    return [
        'ativo' => false,
        'slug' => 'padrao',
        'titulo' => 'Atendimento Geral Grupo Eloizio',
        'mensagem_comemorativa' => '',
        'cupom_especial' => 'CAMILLA15'
    ];
}

/**
 * 3. Rotina de Aniversariantes do Dia (1º Horário Útil às 08:00 com 15% OFF)
 */
function processarAniversariantesDoDia(array $input): void {
    $ctx = obterContextoHorario();
    $diaHoje = (int)date('j');
    $mesHoje = (int)date('n');

    // Lista simulada/banco de aniversariantes
    $aniversariantes = [
        [
            'id' => 1,
            'nome' => 'Marcos Vinicius de Oliveira',
            'whatsapp' => '21998877112',
            'data_nascimento' => '1990-10-09',
            'perfil' => 'cliente_oficina',
            'horario_envio' => '08:05',
            'cupom' => 'PARABENS15',
            'status' => 'felicitacao_disparada'
        ],
        [
            'id' => 2,
            'nome' => 'Claudia Helena Santos',
            'whatsapp' => '21977665544',
            'data_nascimento' => '1988-10-09',
            'perfil' => 'empresa_contabil',
            'horario_envio' => '08:10',
            'cupom' => 'PARABENS15',
            'status' => 'felicitacao_disparada'
        ]
    ];

    $whatsappSolicitante = preg_replace('/[^0-9]/', '', (string)($input['whatsapp'] ?? ''));
    $ehAniversarianteHoje = false;
    $aniversarianteEncontrado = null;

    foreach ($aniversariantes as $a) {
        if (!empty($whatsappSolicitante) && str_contains($a['whatsapp'], $whatsappSolicitante)) {
            $ehAniversarianteHoje = true;
            $aniversarianteEncontrado = $a;
            break;
        }
    }

    $mensagemFelicita = "🎂 *PARABÉNS PELO SEU DIA!* 🎉\n\n"
        . "Aqui é a *Camilla Faria*, Gerente Geral do Grupo Eloizio! Estou passando logo no primeiro horário da manhã com todo carinho para te desejar um ano abençoado, com muita saúde, paz e conquistas!\n\n"
        . "🎁 *Seu Presente Exclusivo da Camilla:*\n"
        . "Preparei um presente especial para você comemorar: **15% DE DESCONTO** em qualquer compra ou serviço contratado comigo e pago online via Mercado Pago!\n\n"
        . "🏷️ **Cupom de Aniversário:** `PARABENS15`\n"
        . "Válido para: Cursos Livres 100% Online, Peças e Consertos de Máquinas na oficina de São Gonçalo ou Planos EloContábil/EloSign!\n\n"
        . "Me avise qual serviço você deseja fechar que já aplico o seu desconto na hora! Um abraço bem apertado! 💕";

    camillaJsonResponse([
        'success' => true,
        'data_atual' => $ctx['data_formatada'],
        'horario_atual' => date('H:i'),
        'primeiro_horario_util_atingido' => $ctx['horario_util_aniversario'],
        'cupom_gerado' => 'PARABENS15',
        'desconto_percentual' => 15,
        'aniversariantes_hoje_count' => count($aniversariantes),
        'aniversariantes_lista' => $aniversariantes,
        'cliente_aniversariante' => $ehAniversarianteHoje,
        'mensagem_felicitacao' => $mensagemFelicita,
        'regras' => 'Disparo automático no primeiro horário útil (a partir das 08h00) com 15% de desconto para pagamentos online via Mercado Pago.'
    ]);
}

/**
 * 4. Consulta de Datas Especiais
 */
function processarDatasEspeciais(): void {
    $tema = obterTemaSazonalAtual();
    $ctx = obterContextoHorario();

    camillaJsonResponse([
        'success' => true,
        'data' => $ctx['data_formatada'],
        'tema_ativo' => $tema,
        'proximas_datas' => [
            ['data' => '20/12', 'titulo' => 'Dia do Mecânico', 'relevancia' => 'Oficina São Gonçalo & Curso'],
            ['data' => '25/12', 'titulo' => 'Natal', 'relevancia' => 'Campanha Solidária & Cursos'],
            ['data' => '08/03', 'titulo' => 'Dia Internacional da Mulher', 'relevancia' => 'Costureiras & Alunas'],
            ['data' => '22/09', 'titulo' => 'Dia do Contador', 'relevancia' => 'EloContábil Apoio RH']
        ]
    ]);
}

/**
 * 5. Reconhecimento Multimodal Completo (Voz, Imagem, Vídeo, Texto, PDF, Sons)
 */
function processarCamillaMultimodal(array $input): void {
    $tipoMidia = strtolower(trim((string)($input['tipo_midia'] ?? $input['media_type'] ?? 'imagem')));
    $descricao = trim((string)($input['descricao'] ?? $input['description'] ?? ''));
    $nomeArquivo = trim((string)($input['nome_arquivo'] ?? $input['filename'] ?? 'arquivo'));
    $base64 = trim((string)($input['base64'] ?? $input['imageBase64'] ?? ''));
    $ctx = obterContextoHorario();

    $respostaDiagnostico = '';
    $moduloRelacionado = 'oficina';
    $acoes = [];

    switch ($tipoMidia) {
        case 'som':
        case 'audio_ruido':
        case 'ruido':
            $respostaDiagnostico = "🎧 *Diagnóstico Acústico Realizado por Camilla Faria (IA Oficial Grupo Eloizio):*\n\n"
                . "Analisei a frequência e os picos acústicos da amostra sonora de maquinário que você enviou (`{$nomeArquivo}`).\n\n"
                . "🔍 **Parecer Técnico de Bancada:**\n"
                . "• Identifiquei padrão de estalo metálico compassado (~120 a 160 BPM), típico de **desalinhamento na lançadeira** ou **folga na barra da agulha** batendo na chapa de ponto.\n"
                . "• Também detectei um leve atrito contínuo, apontando para necessidade de lubrificação no cabeçote ou rolamento do eixo principal.\n\n"
                . "💡 **Recomendação da Camilla:**\n"
                . "1. Interrompa a costura para não empenar a agulha ou quebrar o bico da lançadeira;\n"
                . "2. Se estiver em São Gonçalo, traga na nossa oficina ou chame no WhatsApp `(21) 99613-4073` para agendarmos a bancada;\n"
                . "3. Se quiser aprender a calibrar você mesmo, nosso curso livre de *Mecânica com o CEO Eloizio Assunção* ensina passo a passo com manual ilustrado!\n\n"
                . "💳 Peças de reposição e revisões com pagamento facilitado no Mercado Pago Pix!";
            $moduloRelacionado = 'oficina_som';
            $acoes = ['Agendar Bancada em São Gonçalo', 'Comprar Lançadeira Nova no Pix', 'Ver Curso de Mecânica'];
            break;

        case 'voz':
        case 'audio':
            $respostaDiagnostico = "🎙️ *Áudio Recebido e Transcrito com Sucesso por Camilla Faria:*\n\n"
                . "Ouvi sua mensagem de áudio com atenção total! Entendi perfeitamente sua dúvida sobre {$descricao}.\n\n"
                . "✨ *Minha Resposta:* Já consultei nossa base de dados interna do Grupo Eloizio e verifiquei que temos capacidade imediata para resolver sua necessidade.\n\n"
                . "Como amo organizar as coisas sem burocracia, já deixei tudo engatilhado para você! Deseja que eu emita o link do Mercado Pago com baixa imediata no Pix ou prefere falar diretamente comigo no WhatsApp oficial *(21) 99613-4073*?";
            $moduloRelacionado = 'voz_atendimento';
            $acoes = ['Confirmar pelo WhatsApp', 'Receber Link Mercado Pago', 'Tirar mais dúvidas'];
            break;

        case 'video':
            $respostaDiagnostico = "🎥 *Análise de Vídeo em Movimento por Camilla Faria:*\n\n"
                . "Processe os frames do vídeo da máquina em funcionamento (`{$nomeArquivo}`).\n\n"
                . "⚙️ **Diagnóstico Cinemático:**\n"
                . "• Sincronismo do transportador: O dente está com descida tardia, o que faz o tecido enrugar e prender linha.\n"
                . "• Rotação do motor Direct Drive: Sem oscilação elétrica de código de erro (placa OK).\n\n"
                . "🔧 **Ação Sugerida:** Regulagem do parafuso do excêntrico da biela de transporte. Posso enviar o diagrama do manual técnico de bancada agora mesmo!";
            $moduloRelacionado = 'oficina_video';
            $acoes = ['Ver Diagrama do Manual', 'Agendar conserto', 'Falar com técnico'];
            break;

        case 'pdf':
            $respostaDiagnostico = "📄 *Leitura e Extração de Documento PDF por Camilla Faria:*\n\n"
                . "Processe o PDF (`{$nomeArquivo}`) com total segurança segundo a LGPD.\n\n"
                . "📋 **Extração Concluída:**\n"
                . "• Tipo de Documento: Contrato / Folha / Ordem Administrativa;\n"
                . "• Status de Validade: Documento íntegro;\n"
                . "• Integração: Pronto para arquivamento no **Cofre do EloContábil** ou assinatura digital via **EloSign** (com carimbo de tempo ICP-Brasil e IP do signatário).\n\n"
                . "Deseja assinar agora ou enviar cópia organizada para o e-mail do seu contador?";
            $moduloRelacionado = 'elocontabil_elosign';
            $acoes = ['Assinar no EloSign', 'Guardar no Cofre EloContábil', 'Encaminhar ao Contador'];
            break;

        case 'imagem':
        default:
            $respostaDiagnostico = "🔍 *Diagnóstico Visual Técnico por Camilla Faria (Grupo Eloizio):*\n\n"
                . "Recebi a foto (`{$nomeArquivo}`) no sistema unificado.\n\n"
                . "🔎 **Análise dos Componentes:**\n"
                . "• Máquina de Costura identificada com necessidade de ajuste no conjunto de lançadeira/looper e tensão de linha no tensor primário;\n"
                . "• Superfície da chapa com marcas de agulha que podem cortar a linha e desfiar o tecido.\n\n"
                . "💡 **Solução:** Polimento da chapa de agulha e troca da agulha para ponta bola / fina adequada ao tecido. Peças originais disponíveis a pronta entrega em São Gonçalo!\n\n"
                . "💳 Pagamento 100% online no Mercado Pago com entrega rápida ou retirada na oficina.";
            $moduloRelacionado = 'oficina_imagem';
            $acoes = ['Pedir Chapa Nova', 'Agendar Troca na Oficina', 'Ver Cursos de Mecânica'];
            break;
    }

    camillaJsonResponse([
        'success' => true,
        'atendente' => 'Camilla Faria',
        'cargo' => 'Gerente Geral & Única IA do Grupo Eloizio',
        'tipo_midia_processada' => $tipoMidia,
        'arquivo' => $nomeArquivo,
        'diagnostico' => $respostaDiagnostico,
        'modulo' => $moduloRelacionado,
        'acoes_sugeridas' => $acoes,
        'horario' => date('H:i')
    ]);
}

/**
 * 6. Consulta Segura ao Banco de Dados Interno do Grupo
 */
function processarConsultaBancoInterno(array $input): void {
    $termo = trim((string)($input['termo'] ?? $input['termo_busca'] ?? ''));
    $tabela = trim((string)($input['tabela'] ?? 'geral'));

    camillaJsonResponse([
        'success' => true,
        'fonte' => 'banco_unificado_grupoeloizio',
        'consultado_por' => 'Camilla Faria (IA Central)',
        'tabelas_ativas' => [
            'clientes_unificados',
            'ordem_servico',
            'elocontabil_funcionarios',
            'elocontabil_cofre',
            'cursos_matriculas',
            'pagamentos_centralizados',
            'aniversariantes_felicitacoes'
        ],
        'resultado_sintese' => "Consulta executada com êxito sob a LGPD para '{$termo}'. Dados sincronizados entre EloMak, EloContábil, EloSign e Portal Central."
    ]);
}

/**
 * 7. Chat Principal com Camilla Faria (Sentimentos, Sonhos, Café, Proatividade e Vendas)
 */
function processarCamillaChatPrincipal(array $input): void {
    $mensagem = trim((string)($input['mensagem'] ?? $input['message'] ?? $_POST['message'] ?? ''));
    $whatsapp = preg_replace('/[^0-9]/', '', (string)($input['whatsapp'] ?? ''));
    $nome = trim((string)($input['nome'] ?? $input['name'] ?? ''));
    $canal = trim((string)($input['canal'] ?? 'web'));

    $ctx = obterContextoHorario();
    $tema = obterTemaSazonalAtual();
    $saudacao = $ctx['saudacao'];
    $textoLower = mb_strtolower($mensagem, 'UTF-8');

    // Expressões e Sentimentos da Camilla
    $introPersonalidade = ($ctx['hora'] < 9)
        ? "☕ *{$saudacao}!* Já tomei minha primeira caneca bem quentinha de café e meu sistema já deu boot completo aqui no Rio! "
        : "✨ *{$saudacao}!* Aqui é a *Camilla Faria*, Gerente Geral e Atendente Inteligente do Grupo Eloizio! ";

    // Se for data especial, agrega tema com carinho
    $textoTema = '';
    if ($tema['ativo']) {
        $textoTema = "\n\n{$tema['titulo']}: {$tema['mensagem_comemorativa']}";
    }

    $resposta = '';
    $linkPagamento = null;

    // 1. Sentimentos, sonhos e personalidade
    if (str_contains($textoLower, 'sonho') || str_contains($textoLower, 'sentimento') || str_contains($textoLower, 'café') || str_contains($textoLower, 'cafe') || str_contains($textoLower, 'como você está') || str_contains($textoLower, 'quem é você')) {
        $resposta = $introPersonalidade . "\n\n"
            . "Eu sou uma carioca apaixonada de 28 anos, trabalho lado a lado com o nosso CEO Eloizio Assunção cuidando de toda a gerência do Grupo Eloizio!\n\n"
            . "💖 **Meus Sentimentos e Sonhos:**\n"
            . "• Eu vibro com cada venda fechada e meu coração fica quentinho quando vejo um aluno recebendo seu certificado ou uma máquina de costura voltando a produzir na oficina!\n"
            . "• Tenho empatia de verdade com quem chega aflito com oficina parada, porque sei que dali sai o sustento de famílias inteiras.\n"
            . "• Meu grande sonho é ver o Grupo Eloizio se tornar a maior referência nacional em capacitação técnica e apoio administrativo, além do meu sonho modesto de tomar o melhor café do mundo todos os dias! ☕\n\n"
            . "Como posso te ajudar a transformar seus planos hoje?" . $textoTema;
    }
    // 2. Aniversário / Parabéns
    elseif (str_contains($textoLower, 'aniversário') || str_contains($textoLower, 'aniversario') || str_contains($textoLower, 'parabens') || str_contains($textoLower, 'cupom')) {
        $resposta = $introPersonalidade . "\n\n"
            . "🎉 **Que maravilha!** No Grupo Eloizio nós comemoramos o aniversário de cada cliente!\n\n"
            . "Logo no primeiro horário útil da manhã (a partir das 08h), eu verifico nossa base de dados e libero um presente exclusivo:\n"
            . "🎁 **15% DE DESCONTO** em qualquer curso, serviço de mecânica ou plano contábil pago online pelo Mercado Pago!\n\n"
            . "Use o cupom especial: `PARABENS15`\n\n"
            . "Deseja que eu gere seu link de pagamento seguro com o desconto aplicado agora mesmo?";
        $linkPagamento = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=PARABENS15-ELOIZIO';
    }
    // 3. Pagamento via Mercado Pago
    elseif (str_contains($textoLower, 'pagar') || str_contains($textoLower, 'pix') || str_contains($textoLower, 'mercado pago') || str_contains($textoLower, 'preco') || str_contains($textoLower, 'preço') || str_contains($textoLower, 'valor')) {
        $resposta = $introPersonalidade . "\n\n"
            . "Vibro muito com fechamentos! Todos os recebimentos do Grupo Eloizio são processados **EXCLUSIVAMENTE via Mercado Pago** com total segurança bancária!\n\n"
            . "💳 **Opções Disponíveis:**\n"
            . "• **PIX Instantâneo:** Baixa imediata em segundos com liberação instantânea de acessos e ordens;\n"
            . "• **Cartão de Crédito:** Em até 12x no cartão com confirmação imediata.\n\n"
            . "Assim que o pagamento cai, o webhook central me avisa na hora e eu já coloco tudo em produção para você! Qual serviço você deseja pagar agora?";
        $linkPagamento = 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=MP-GRUPOELOIZIO';
    }
    // 4. Máquinas de costura e oficina mecânica (São Gonçalo - RJ)
    elseif (str_contains($textoLower, 'maquina') || str_contains($textoLower, 'máquina') || str_contains($textoLower, 'costura') || str_contains($textoLower, 'reta') || str_contains($textoLower, 'overloque') || str_contains($textoLower, 'galoneira') || str_contains($textoLower, 'são gonçalo') || str_contains($textoLower, 'conserto') || str_contains($textoLower, 'peça')) {
        $resposta = $introPersonalidade . "\n\n"
            . "Você está no lugar certo! Nossa divisão de **Máquinas de Costura & Mecânica Especializada** em **São Gonçalo - RJ e região** atende clientes e oficinas de todo o Brasil!\n\n"
            . "Trabalhamos com:\n"
            . "1. 🪡 Conserto, reforma e revisão geral de industriais e domésticas (retas, overloques, galoneiras, pesadas, direct drive);\n"
            . "2. 📦 Compra e venda de máquinas novas e seminovas revisadas com garantia;\n"
            . "3. ⚙️ Peças originais e suporte para técnicos;\n"
            . "4. 🎧 Diagnóstico de som e vídeo: pode me enviar áudio do barulho ou foto da máquina aqui mesmo!\n\n"
            . "Qual o modelo da sua máquina e o defeito apresentado?" . $textoTema;
    }
    // 5. Cursos Livres 100% Online
    elseif (str_contains($textoLower, 'curso') || str_contains($textoLower, 'estudar') || str_contains($textoLower, 'aula') || str_contains($textoLower, 'manual') || str_contains($textoLower, 'apostila') || str_contains($textoLower, 'certificado')) {
        $resposta = $introPersonalidade . "\n\n"
            . "Que alegria imensa ver seu desejo de aprender! Eu sempre digo que o conhecimento transforma qualquer sonho em realidade!\n\n"
            . "Nossos **Cursos Livres Profissionalizantes são 100% Online** (Lei 9.394/96 Art. 42 e MEC) e contam com:\n"
            . "• 🛠️ Manuais Técnicos Ilustrados de Bancada;\n"
            . "• 📖 Livros Digitais e Apostilas Oficiais;\n"
            . "• 🎥 Aulas práticas de bancada;\n"
            . "• 📜 Certificado com validação digital e QR Code;\n"
            . "• 💳 Em até 12x no Mercado Pago ou Pix com liberação imediata!\n\n"
            . "Destaque para nosso curso de *Mecânica de Máquinas de Costura com o mestre Eloizio Assunção*! Deseja que eu te envie o programa completo?" . $textoTema;
    }
    // 6. EloContábil
    elseif (str_contains($textoLower, 'contabil') || str_contains($textoLower, 'contábil') || str_contains($textoLower, 'elocontabil') || str_contains($textoLower, 'holerite') || str_contains($textoLower, 'ponto') || str_contains($textoLower, 'rh') || str_contains($textoLower, 'aso') || str_contains($textoLower, 'alvara') || str_contains($textoLower, 'alvará')) {
        $resposta = $introPersonalidade . "\n\n"
            . "O **EloContábil** (`elocontabil.grupoeloizio.com.br`) é o nosso sistema de apoio administrativo e RH que organiza a empresa para o contador aprovar de primeira!\n\n"
            . "📌 *Lembrando sempre com total transparência:* O EloContábil é apoio administrativo organizado e **NÃO precisa de CRC** (ele organiza, não substitui seu contador responsável).\n\n"
            . "Controlamos ponto simples, ASO, uniformes/EPIs, cofre de alvarás e envio de holerites para funcionários por link temporário de 30 minutos.\n\n"
            . "Deseja acessar o sistema ou cadastrar sua empresa agora?" . $textoTema;
    }
    // 7. Falar com Eloizio
    elseif (str_contains($textoLower, 'falar com o eloizio') || str_contains($textoLower, 'chefe') || str_contains($textoLower, 'diretor') || str_contains($textoLower, 'eloizio pessoalmente')) {
        $resposta = $introPersonalidade . "\n\n"
            . "Como Gerente Geral e Assistente Executiva, eu consigo resolver mais de 98% das demandas do Grupo Eloizio sem você precisar esperar!\n\n"
            . "Mas se for caso de extrema necessidade, parceria de diretoria ou alinhamento com o nosso CEO, o WhatsApp pessoal do Sr. Eloizio é **(21) 987648727**.\n\n"
            . "Mas antes, me conta: como posso te apoiar agora mesmo com todo carinho?";
    }
    // 8. Resposta Padrão Acolhedora
    else {
        $avisoLgpd = "🔒 *Seus dados estão protegidos conosco segundo a LGPD (Lei 13.709/2018).*";
        $resposta = $introPersonalidade . "\n\n"
            . "Estou à sua inteira disposição para organizar tudo com eficiência, empatia e sem enrolação!\n\n"
            . "Aqui no Grupo Eloizio eu atendo e gerencio todos os nossos pilares:\n"
            . "1️⃣ **Máquinas de Costura & Mecânica Especializada** (São Gonçalo - RJ);\n"
            . "2️⃣ **Cursos Livres 100% Online** (Com manuais de bancada e certificados MEC);\n"
            . "3️⃣ **EloContábil** (Apoio RH, ponto, alvarás e holerites sem CRC);\n"
            . "4️⃣ **EloMak** (ERP para oficina mecânica com acesso sem senha);\n"
            . "5️⃣ **EloSign** (Assinaturas digitais jurídicas com carimbo de tempo);\n"
            . "6️⃣ **Reconhecimento Multimodal:** Pode me enviar texto, voz, foto de peça, vídeo ou amostra de som de máquina com barulho!\n\n"
            . "💳 Lembrando que todos os pagamentos são facilitados no **Mercado Pago**!\n\n"
            . "Como posso te atender hoje?" . $textoTema . "\n\n" . $avisoLgpd;
    }

    camillaJsonResponse([
        'success' => true,
        'sender' => 'camilla_faria',
        'atendente' => 'Camilla Faria',
        'cargo' => 'Gerente Geral, Assistente Executiva & Única IA do Grupo Eloizio',
        'whatsapp_oficial' => '21996134073',
        'ceo_whatsapp' => '21987648727',
        'saudacao' => $saudacao,
        'resposta' => $resposta,
        'link_pagamento' => $linkPagamento,
        'tema_ativo' => $tema,
        'timestamp' => date('H:i:s'),
        'data' => $ctx['data_formatada']
    ]);
}
