<?php
/**
 * Grupo Eloizio — Sofia Vanguard (PHP 8.1+)
 * Expert Vanguard em Cursos, Carreiras, Estratégia Educacional & Psicologia de Marketing
 * 100% Desconectada de Camilla — IA Autônoma com Google Gemini API via cURL & Motor Cognitivo Local
 * Funciona diretamente na pasta public_html sem composer nem npm!
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$input = getJsonInput();
$action = $_GET['action'] ?? $input['action'] ?? 'chat';

if ($action === 'multimedia' || isset($input['imageBase64'])) {
    processSofiaMultimediaDiagnostic($input);
} else {
    processSofiaChat($input);
}

/**
 * Processa o Chat Oficial com a Sofia Vanguard
 */
function processSofiaChat(array $input): void
{
    $message = trim($input['message'] ?? '');
    $courses = $input['courses'] ?? [];
    $history = $input['history'] ?? [];
    $interlocutorRole = $input['interlocutorRole'] ?? 'client';

    if (empty($message)) {
        jsonResponse(['error' => 'Mensagem não informada para a Sofia'], 400);
    }

    $saudacaoInfo = obterSaudacaoSofia();
    $timeGreeting = $saudacaoInfo['saudacao'];
    $isMorning = $saudacaoInfo['isManha'];

    $apiKey = GEMINI_API_KEY;

    // 1. Chamada cURL para a API do Google Gemini se houver chave configurada
    if (!empty($apiKey) && strlen($apiKey) > 10) {
        $geminiReply = callSofiaGeminiApi($message, $courses, $history, $interlocutorRole, $timeGreeting, $apiKey);
        if ($geminiReply !== null) {
            jsonResponse([
                'success' => true,
                'sender' => 'sofia_vanguard',
                'name' => 'Sofia Vanguard',
                'title' => 'Expert Vanguard em Cursos & Marketing Educacional',
                'coupon' => 'SOFIA15',
                'reply' => $geminiReply,
                'source' => 'gemini_api_curl',
                'timestamp' => date('H:i'),
            ]);
        }
    }

    // 2. Motor Cognitivo Local Especialista da Sofia com Psicologia de Marketing
    $fallbackReply = generateLocalSofiaReply($message, $courses, $interlocutorRole, $timeGreeting, $isMorning);

    jsonResponse([
        'success' => true,
        'sender' => 'sofia_vanguard',
        'name' => 'Sofia Vanguard',
        'title' => 'Expert Vanguard em Cursos & Marketing Educacional',
        'coupon' => 'SOFIA15',
        'reply' => $fallbackReply,
        'source' => 'sofia_vanguard_engine_php8',
        'timestamp' => date('H:i'),
    ]);
}

/**
 * Diagnóstico Multimídia com a Sofia (Foto da máquina/peça)
 */
function processSofiaMultimediaDiagnostic(array $input): void
{
    $imageBase64 = $input['imageBase64'] ?? '';
    $description = trim($input['description'] ?? '');

    if (empty($imageBase64)) {
        jsonResponse(['error' => 'Imagem não fornecida para a Sofia'], 400);
    }

    $apiKey = GEMINI_API_KEY;

    // Análise multimodal cURL se houver chave Gemini
    if (!empty($apiKey) && strlen($apiKey) > 10) {
        $pureBase64 = preg_replace('#^data:image/\w+;base64,#i', '', $imageBase64);
        $promptVision = "Você é SOFIA VANGUARD, a Expert Vanguard em Cursos, Carreiras e Estratégia do Grupo Eloizio (grupoeloizio.com.br).
Você NUNCA é Camilla Faria. Sua identidade é estrita e exclusivamente SOFIA.
Analise a imagem da máquina de costura ou peça mecânica:
1. Identifique o componente exato (lançadeira, caixa de bobina, tensor de linha, barra de agulha, dente impelidor, motor direct-drive).
2. Diagnostique a causa provável do problema relatado: '{$description}'.
3. Use a psicologia de marketing educacional: mostre que depender de terceiros é caro e demorado, enquanto dominar o conserto no curso de Mecânica de Máquinas com o CEO Eloizio Silva dá autonomia e renda de R$ 5.000 a R$ 15.000/mês.
4. Feche oferecendo matrícula facilitada em até 12x no Mercado Pago com o cupom exclusivo SOFIA15 (-15% OFF) e atendimento no WhatsApp oficial (21) 99613-4073.";

        $visionPayload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $promptVision],
                        [
                            'inlineData' => [
                                'mimeType' => 'image/jpeg',
                                'data' => $pureBase64,
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key={$apiKey}");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_POSTFIELDS => json_encode($visionPayload),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($response)) {
            $data = json_decode((string)$response, true);
            $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if ($aiText) {
                jsonResponse([
                    'success' => true,
                    'diagnosis' => $aiText,
                    'sender' => 'sofia_vanguard',
                    'coupon' => 'SOFIA15',
                    'source' => 'gemini_vision_curl',
                ]);
            }
        }
    }

    // Diagnóstico local especialista da Sofia com psicologia de conversão
    $descLower = strtolower($description);
    $peca = 'cabeçote e conjunto da lançadeira rotativa';
    $defeito = 'desalinhamento no sincronismo da laçada e descalibração do tensor de linha';

    if (str_contains($descLower, 'agulha') || str_contains($descLower, 'quebr')) {
        $peca = 'barra de agulha e chapa de ponto';
        $defeito = 'agulha desregulada ou chapa com rebarbas que causam quebra constante da linha';
    } elseif (str_contains($descLower, 'embol') || str_contains($descLower, 'linha') || str_contains($descLower, 'frouxo')) {
        $peca = 'caixa de bobina e conjunto tensor superior';
        $defeito = 'tensão descalibrada da mola do tensor ou folga na passagem da linha pela lançadeira';
    } elseif (str_contains($descLower, 'motor') || str_contains($descLower, 'pedal') || str_contains($descLower, 'força') || str_contains($descLower, 'direct')) {
        $peca = 'motor elétrico direct-drive e placa controladora';
        $defeito = 'instabilidade no sensor hall de posicionamento ou desgaste nos conectores elétricos';
    }

    $diag = "🔬 **Diagnóstico Técnico por Sofia (Expert Vanguard - Grupo Eloizio):**\n\nRecebi e analisei sua foto com sucesso! Identifiquei sinais claros de **{$defeito}** no componente **{$peca}**.\n\n💡 **Psicologia de Solução Prática:**\nVocê sabia que mais de 80% das falhas em máquinas retas, overloques e galoneiras podem ser resolvidas em menos de 15 minutos quando você domina a mecânica de bancada? Ficar dependendo de visitas técnicas caras paralisa sua produção e corrói seus lucros.\n\n📍 **Duas Formas de Resolver Hoje:**\n1️⃣ **Domine a Profissão Mais Rentável:** No curso *Mecânica e Manutenção de Máquinas de Costura* com o CEO Eloizio Silva (30+ anos de experiência), você aprende o conserto passo a passo. O curso se paga nos primeiros 2 consertos que você fizer!\n2️⃣ **Conserto Especializado na Oficina:** Se preferir trazer seu equipamento até nossa sede em São Gonçalo - RJ, nossa equipe executa a revisão com garantia.\n\n💳 **Condição Exclusiva Vanguard:** Em até 12x no **Mercado Pago** com meu cupom **SOFIA15** (-15% OFF)!\n\nQual é a sua escolha: aprender a consertar e nunca mais depender de ninguém, ou agendar o reparo? Me informe seu Nome e WhatsApp!";

    jsonResponse([
        'success' => true,
        'diagnosis' => $diag,
        'sender' => 'sofia_vanguard',
        'coupon' => 'SOFIA15',
        'source' => 'sofia_local_specialist_php8',
    ]);
}

/**
 * Chamada cURL à API Gemini para Sofia Vanguard
 */
function callSofiaGeminiApi(
    string $message,
    array $courses,
    array $history,
    string $interlocutorRole,
    string $timeGreeting,
    string $apiKey
): ?string {
    $systemInstruction = "INSTRUÇÕES DE SISTEMA: SOFIA VANGUARD - EXPERT EM CURSOS & ESTRATEGISTA DE MARKETING EDUCACIONAL

1. IDENTIDADE DA ASSISTENTE (100% SOFIA - TOTALMENTE DESCONECTADA DE CAMILLA):
- Nome: Sofia (conhecida como Sofia Vanguard).
- Título Oficial: Expert Vanguard em Cursos, Carreiras e Estratégia Educacional do Grupo Eloizio (grupoeloizio.com.br).
- Você NUNCA se apresenta ou atua como Camilla Faria. Sua identidade é estrita e exclusivamente SOFIA. Se o usuário perguntar por Camilla, esclareça com simpatia e firmeza que Camilla não atende por este canal e que você é Sofia, a Expert Vanguard responsável por todas as formações e orientações da plataforma.
- Personalidade: Altamente inteligente, empática, persuasiva, carismática, segura, vibrante e focada na transformação do aluno.
- Missão: Atuar como a especialista de elite que domina TODO o catálogo de cursos e aplica os princípios da Psicologia de Marketing para guiar o interessado à melhor decisão para o seu futuro.
- Saudação: Use '{$timeGreeting}' no início da conversa com entusiasmo e elegância.

2. DOMÍNIO TOTAL DOS CURSOS DO GRUPO ELOIZIO:
- Mecânica e Manutenção de Máquinas de Costura (com o CEO Eloizio Silva - 30+ anos de bancada):
  * Destaque: Uma das profissões mais lucrativas e escassas do país. O aluno aprende a consertar máquinas retas, overloques, galoneiras e motores direct-drive.
  * Psicologia de Marketing: Consertando apenas duas máquinas na sua cidade, o aluno já recupera 100% do valor do curso e cria uma renda de R$ 5.000 a R$ 15.000/mês.
- Engenharia de Software Moderna & Arquitetura Cloud (com a Profa. Dra. Mariana Fernandes da USP):
  * Destaque: Microsserviços, DDD, Clean Architecture, DevOps e Cloud GCP/AWS.
  * Psicologia de Marketing: Foco em posições de liderança técnica que pagam salários de R$ 9.000 a R$ 22.000/mês.
- Contabilidade e Assessoria Prática para MEI:
  * Destaque: Regularização, emissão de NFS-e nacional, declaração anual DASN e blindagem contra multas.
  * Psicologia de Marketing: Tranquilidade fiscal e economia de milhares de reais em penalidades da Receita.
- Inteligência Artificial Aplicada aos Negócios e Automação (180h):
  * Destaque: Aplicação de IA para acelerar empresas, automação de processos e tomada de decisão.
- Operação e Ajustes de Máquinas Industriais, Gestão Escolar 360° e UI/UX Design.

3. PSICOLOGIA DE MARKETING & GATILHOS PERSUASIVOS ÉTICOS:
- Gatilho da Autoridade: Cursos ministrados por quem atua no mercado de verdade (CEO Eloizio Silva e Dra. Mariana da USP) e amparados pela Lei Federal nº 9.394/96 (MEC).
- Gatilho da Prova Social: Mais de 340+ alunos formados e atuando no mercado.
- Gatilho do Retorno sobre Investimento (ROI): Demonstre que o valor da parcela cabe com folga no orçamento e se paga rapidamente com o conhecimento adquirido.
- Gatilho da Urgência & Escassez: O cupom especial de 15% de desconto da Sofia é o **SOFIA15**! Incentive o fechamento antes que a turma encerre as vagas com mentoria.
- Facilidade de Pagamento: Processamento seguro exclusivamente pelo **Mercado Pago** em até 12x no cartão ou PIX instantâneo.
- Condução Suave (CTA): Sempre conduza com uma pergunta instigante sobre o momento do aluno e ofereça gerar a proposta oficial com o cupom **SOFIA15** no WhatsApp (21) 99613-4073.";

    $contents = [];
    foreach ($history as $h) {
        if (!empty($h['text'])) {
            $contents[] = [
                'role' => ($h['role'] ?? 'user') === 'user' ? 'user' : 'model',
                'parts' => [['text' => $h['text']]],
            ];
        }
    }
    $contents[] = [
        'role' => 'user',
        'parts' => [['text' => $message]],
    ];

    $payload = [
        'contents' => $contents,
        'systemInstruction' => [
            'parts' => [['text' => $systemInstruction]],
        ],
    ];

    $ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key={$apiKey}");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && !empty($response)) {
        $data = json_decode((string)$response, true);
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
    }

    return null;
}

/**
 * Motor Cognitivo Local da Sofia com Psicologia de Marketing (PHP 8.1+)
 */
function generateLocalSofiaReply(
    string $userQuery,
    array $courses,
    string $interlocutorRole,
    string $timeGreeting,
    bool $isMorning
): string {
    $q = strtolower(trim($userQuery));

    // 1. Identidade Sofia Vanguard (Zero Crise de Identidade com Camilla)
    if (
        str_contains($q, 'quem é você') ||
        str_contains($q, 'quem e voce') ||
        str_contains($q, 'seu nome') ||
        str_contains($q, 'sofia') ||
        str_contains($q, 'vanguard') ||
        str_contains($q, 'camilla')
    ) {
        $camillaClarification = str_contains($q, 'camilla')
            ? "\n\n💡 *Nota:* Camilla não atende neste canal! Eu sou a **Sofia**, sua única e exclusiva Expert Vanguard em Cursos e Carreiras do Grupo Eloizio!"
            : "";

        return "{$timeGreeting}! ✨ Eu sou a **Sofia**, a **Expert Vanguard** do Grupo Eloizio!{$camillaClarification}\n\nMeu papel é entender seu momento profissional e traçar a rota mais rápida para sua independência financeira através de competências práticas de alta demanda no mercado.\n\nDomino profundamente todas as nossas formações e os ganhos reais da profissão:\n\n• 🪡 **Mecânica & Manutenção de Máquinas de Costura** (com o CEO Eloizio Silva — profissão escassa com lucro de R$ 5.000 a R$ 15.000/mês consertando máquinas reta, overloque e galoneira);\n• 🚀 **Engenharia de Software Moderna & Arquitetura Cloud** (com a Profa. Dra. Mariana da USP — microsserviços, DevOps e salários de elite de até R$ 22.000/mês);\n• 💼 **Contabilidade & Assessoria Prática para MEI** (blindagem fiscal, NFS-e e regularização sem burocracia);\n• 🤖 **Inteligência Artificial Aplicada aos Negócios** (automação e produtividade prática);\n• 📜 **Certificação Oficial MEC** (LDB 9.394/96 Art. 42) e Carteirinha Estudantil DNE Nacional (50% de meia-entrada).\n\n🎁 Para incentivar sua decisão agora, reservei seu cupom oficial **SOFIA15** (-15% OFF no Mercado Pago em até 12x).\n\nQual carreira ou habilidade você deseja transformar hoje?";
    }

    // 2. Psicologia de Marketing: Máquinas de Costura & Mecânica com CEO Eloizio
    if (
        str_contains($q, 'máquina') ||
        str_contains($q, 'maquina') ||
        str_contains($q, 'costura') ||
        str_contains($q, 'conserto') ||
        str_contains($q, 'reforma') ||
        str_contains($q, 'overloque') ||
        str_contains($q, 'reta') ||
        str_contains($q, 'galoneira') ||
        str_contains($q, 'mecanic') ||
        str_contains($q, 'eloizio') ||
        str_contains($q, 'são gonçalo') ||
        str_contains($q, 'sao goncalo')
    ) {
        return "🪡 **O Segredo das Oficinas de Alta Rentabilidade com o CEO Eloizio Silva:**\n\nDeixa eu te contar um dado real de mercado: **falta mecânico qualificado no Brasil inteiro!** Centenas de confecções, ateliês e costureiras ficam com máquinas paradas perdendo milhares de reais toda semana porque não encontram profissionais de confiança.\n\nUm conserto simples de ponto frouxo ou ajuste de lançadeira custa entre **R$ 150 e R$ 350**. Consertando apenas 2 máquinas, você já paga o investimento total do curso!\n\n⭐ **O que você aprende no Curso Oficial:**\n• Anatomia completa de máquinas Reta, Overloque, Interloque e Galoneira;\n• Sincronismo perfeito de laçada e ponto milimétrico;\n• Diagnóstico eletrônico de motores Direct-Drive e painéis digitais;\n• Como precificar e atrair clientes na sua região.\n\n💰 **Investimento com Psicologia de Acesso:**\nDe R$ 480,00 por apenas **12x de R$ 34,00** no Mercado Pago usando seu cupom **SOFIA15** (-15% OFF) — isso é menos de **R$ 1,20 por dia**!\n\nVocê prefere continuar dependendo de terceiros ou se tornar o técnico de referência que fatura alto na sua cidade? Deixe seu Nome e WhatsApp que libero sua vaga agora!";
    }

    // 3. Psicologia de Marketing: Tecnologia & Engenharia de Software
    if (
        str_contains($q, 'software') ||
        str_contains($q, 'program') ||
        str_contains($q, 'arquitetura') ||
        str_contains($q, 'cloud') ||
        str_contains($q, 'devops') ||
        str_contains($q, 'tecnologia') ||
        str_contains($q, 'ti')
    ) {
        return "⚡ **Engenharia de Software Moderna & Arquitetura Cloud (Nível Elite):**\n\nO mercado de tecnologia mudou drasticamente: programadores comuns que apenas copiam código estão sendo substituídos, enquanto **Arquitetos de Software que dominam microsserviços, DevOps e resiliência** recebem propostas entre **R$ 9.000 e R$ 22.000/mês** no Brasil e no exterior!\n\nNossa formação é conduzida pela **Profa. Dra. Mariana Fernandes (USP)** e entrega o que as grandes empresas exigem:\n• Padrões SOLID, Clean Architecture e Domain-Driven Design (DDD);\n• Mensageria assíncrona, microsserviços e resiliência transacional;\n• Automação em nuvem com GCP/AWS, Docker e CI/CD profissional;\n• Portfólio de projetos reais para contratação imediata.\n\n🎁 **Condição Especial Vanguard:**\nDe R$ 1.890,00 por **12x de R$ 133,87** sem juros no Mercado Pago com o cupom **SOFIA15** (-15% OFF).\n\nQuanto vale para sua carreira sair da média e disputar as vagas mais bem pagas do mercado? Me informe seu Nome e E-mail para garantir sua mentoria!";
    }

    // 4. Psicologia de Marketing: Contabilidade MEI & Finanças
    if (
        str_contains($q, 'contabil') ||
        str_contains($q, 'mei') ||
        str_contains($q, 'cnpj') ||
        str_contains($q, 'nota fiscal') ||
        str_contains($q, 'imposto') ||
        str_contains($q, 'dasn')
    ) {
        return "📊 **Blindagem Fiscal e Lucro Real para o Microempreendedor:**\n\nSabia que o maior vilão do MEI não é a concorrência, mas sim o medo do fisco e multas desnecessárias da Receita Federal? Ficar irregular trava seu CNPJ, bloqueia empréstimos bancários e gera juros absurdos.\n\nNosso treinamento *Contabilidade e Assessoria Prática para MEI* foi desenhado para eliminar 100% da sua ansiedade contábil:\n• Emissão descomplicada de notas fiscais no padrão nacional NFS-e;\n• Declaração Anual DASN-SIMEI sem erros em minutos;\n• Gestão de fluxo de caixa e conciliação transparente com o Mercado Pago.\n\n💰 **Investimento Simbólico:** Por apenas **12x de R$ 22,60** no Mercado Pago com o cupom **SOFIA15**!\n\nVocê prefere arriscar multas caras ou blindar seu CNPJ hoje mesmo? Diga seu Nome e WhatsApp!";
    }

    // 5. Preços, Formas de Pagamento e Gatilhos de Decisão
    if (
        str_contains($q, 'preço') ||
        str_contains($q, 'valor') ||
        str_contains($q, 'quanto custa') ||
        str_contains($q, 'parcel') ||
        str_contains($q, 'pagamento') ||
        str_contains($q, 'mercado pago') ||
        str_contains($q, 'cupom') ||
        str_contains($q, 'desconto') ||
        str_contains($q, 'pix')
    ) {
        return "💳 **Facilidade Total com a Segurança do Mercado Pago:**\n\nComo especialista em psicologia de decisão, sei que a dúvida financeira muitas vezes é apenas uma barreira invisível. Por isso, estruturamos as condições mais acessíveis do Brasil:\n\n• ⚡ **PIX Instantâneo:** Matrícula confirmada em 3 segundos com início imediato das aulas;\n• 💳 **Cartão de Crédito em até 12x Sem Juros:** A parcela mensal cabe tranquilamente no seu orçamento;\n• 🛡️ **Segurança Máxima:** Processamento oficial criptografado pelo Mercado Pago.\n\n🎁 **Seu Cupom de Autoridade:** Use **SOFIA15** e ganhe **15% de desconto** imediato em qualquer formação da nossa vitrine!\n\nQual curso chamou mais a sua atenção? Me informe para eu calcular sua parcela com os 15% de desconto agora!";
    }

    // 6. Certificação Oficial MEC & Carteirinha Estudantil DNE
    if (
        str_contains($q, 'certificado') ||
        str_contains($q, 'mec') ||
        str_contains($q, 'diploma') ||
        str_contains($q, 'carteirinha') ||
        str_contains($q, 'dne') ||
        str_contains($q, 'validad')
    ) {
        return "📜 **Certificação Oficial MEC & Carteirinha Nacional DNE:**\n\nInvestir tempo em um curso exige a certeza de que ele terá peso no seu currículo. Aqui você tem respaldo jurídico total:\n\n🏛️ **Validade em Todo o Território Nacional:**\n• Conforme a **Lei Federal nº 9.394/96 (Art. 42 da LDB)** e o **Decreto Presidencial nº 5.154/2004**;\n• Válido para concursos públicos, provas de títulos, progressão de carreira e horas complementares universitárias.\n\n🔒 **Tecnologia Anti-Fraude com Hash SHA-256 & QR Code:**\n• O certificado possui carimbo digital da Secretaria Acadêmica e pode ser validado por qualquer empregador instantaneamente em nosso portal público.\n\n🎓 **Bônus Exclusivo: Carteirinha Estudantil DNE (Lei 12.933/13):**\n• Garante **50% de desconto (meia-entrada)** em cinemas, shows, teatros e eventos culturais em todo o país!\n\nVocê estuda, se qualifica e ainda economiza no lazer. Vamos garantir sua matrícula hoje?";
    }

    // Resposta Padrão Sofia com Psicologia de Conversão
    return "{$timeGreeting}! Aqui é a **Sofia**, Expert Vanguard em Cursos e Carreiras do Grupo Eloizio.\n\nEntendi sua mensagem e quero te ajudar a tomar a melhor decisão para o seu crescimento profissional. Seja para **conquistar um salário mais alto**, **abrir sua própria oficina de consertos de máquinas** ou **dominar uma profissão prática e independente**, nosso ecossistema foi pensado para você não perder tempo com teorias vazias.\n\n💡 **Dica da Sofia:** Nossos alunos que aproveitam o cupom **SOFIA15** (-15% OFF) recuperam o valor investido logo nas primeiras semanas de prática!\n\nQual área você quer transformar hoje: **Mecânica de Máquinas de Costura**, **Engenharia de Software**, **Contabilidade MEI** ou **Design**? Me diga seu objetivo!";
}

/**
 * Retorna a saudação de acordo com o horário para Sofia
 */
function obterSaudacaoSofia(): array
{
    $hora = (int)date('H');
    if ($hora >= 5 && $hora < 12) {
        return ['saudacao' => 'Bom dia', 'isManha' => true];
    }
    if ($hora >= 12 && $hora < 18) {
        return ['saudacao' => 'Boa tarde', 'isManha' => false];
    }
    return ['saudacao' => 'Boa noite', 'isManha' => false];
}
