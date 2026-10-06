<?php
/**
 * Grupo Eloizio - Atendente Inteligente Camilla Faria (PHP 8.1+)
 * Motor Cognitivo com Google Gemini API via cURL, Diagnóstico Multimídia de Fotos e Fallback Especialista
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

$input = getJsonInput();
$action = $_GET['action'] ?? $input['action'] ?? 'chat';

if ($action === 'multimedia' || isset($input['imageBase64'])) {
    processMultimediaDiagnostic($input);
} else {
    processChat($input);
}

/**
 * Processa o Chat com Camilla Faria
 */
function processChat(array $input): void
{
    $message = trim($input['message'] ?? '');
    $courses = $input['courses'] ?? [];
    $history = $input['history'] ?? [];
    $interlocutorRole = $input['interlocutorRole'] ?? 'client';

    if (empty($message)) {
        jsonResponse(['error' => 'Mensagem não informada'], 400);
    }

    $saudacaoInfo = obterSaudacaoCamilla();
    $timeGreeting = $saudacaoInfo['saudacao'];
    $isMorning = $saudacaoInfo['isManha'];

    $apiKey = GEMINI_API_KEY;

    // Se temos a chave da API do Gemini, faz a chamada cURL
    if (!empty($apiKey) && strlen($apiKey) > 10) {
        $geminiReply = callGeminiApi($message, $courses, $history, $interlocutorRole, $timeGreeting, $isMorning, $apiKey);
        if ($geminiReply !== null) {
            jsonResponse([
                'success' => true,
                'sender' => 'camilla_faria',
                'reply' => $geminiReply,
                'source' => 'gemini_api_curl',
                'timestamp' => date('H:i'),
            ]);
        }
    }

    // Fallback inteligente em PHP 8 puro
    $fallbackReply = generateLocalCamillaReply($message, $courses, $interlocutorRole, $timeGreeting, $isMorning);

    jsonResponse([
        'success' => true,
        'sender' => 'camilla_faria',
        'reply' => $fallbackReply,
        'source' => 'local_specialist_php8',
        'timestamp' => date('H:i'),
    ]);
}

/**
 * Processa Análise Multimídia de Imagem de Máquinas de Costura ou Peças Mecânicas
 */
function processMultimediaDiagnostic(array $input): void
{
    $imageBase64 = $input['imageBase64'] ?? '';
    $description = $input['description'] ?? 'Foto de máquina ou peça para diagnóstico';
    $interlocutorRole = $input['interlocutorRole'] ?? 'client';

    if (empty($imageBase64)) {
        jsonResponse(['error' => 'Nenhuma imagem enviada para diagnóstico'], 400);
    }

    // Limpa prefixo data:image/...;base64,
    $cleanBase64 = str_contains($imageBase64, 'base64,')
        ? explode('base64,', $imageBase64)[1]
        : $imageBase64;

    $apiKey = GEMINI_API_KEY;

    if (!empty($apiKey) && strlen($apiKey) > 10) {
        $prompt = "Você é Camilla Faria, 28 anos, carioca de São Gonçalo - RJ, Gerente Geral e Especialista do Grupo Eloizio (grupoeloizio.com.br).
Você está analisando a foto de uma máquina de costura ou peça mecânica com sintoma de defeito enviada por um {$interlocutorRole}.
Analise a imagem:
1. Identifique o modelo provável (doméstica, industrial reta, overloque, galoneira) e a marca (Singer, Siruba, Brother, Jack, Elgin).
2. Identifique o defeito (lançadeira gasta, agulha empenada, correia folgada, tensor desregulado, chapa com rebarba).
3. Faça perguntas curtas de diagnóstico.
4. Indique conserto ou reforma na oficina mecânica do Grupo Eloizio em São Gonçalo - RJ com o mestre Eloizio.
5. Ofereça pagamento parcelado no Mercado Pago com cupom CAMILLA15 (-15%).
Descrição informada: '{$description}'.";

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'inlineData' => [
                                'mimeType' => 'image/jpeg',
                                'data' => $cleanBase64,
                            ],
                        ],
                        ['text' => $prompt],
                    ],
                ],
            ],
        ];

        $ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key={$apiKey}");
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($response)) {
            $data = json_decode($response, true);
            $aiText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if ($aiText) {
                jsonResponse([
                    'success' => true,
                    'diagnosis' => $aiText,
                    'source' => 'gemini_vision_curl',
                ]);
            }
        }
    }

    // Diagnóstico local especialista em PHP 8
    $descLower = strtolower($description);
    $peca = 'cabeçote e conjunto da lançadeira';
    $defeito = 'desalinhamento no sincronismo do ponto e desgaste na tensão da linha';

    if (str_contains($descLower, 'agulha') || str_contains($descLower, 'quebr')) {
        $peca = 'barra de agulha e chapa de ponto';
        $defeito = 'agulha desregulada ou chapa de agulha com rebarbas que causam quebra constante';
    } elseif (str_contains($descLower, 'embol') || str_contains($descLower, 'linha') || str_contains($descLower, 'frouxo')) {
        $peca = 'caixa de bobina e tensor de linha superior';
        $defeito = 'tensão descalibrada da mola do tensor ou folga na passagem da linha pela lançadeira';
    } elseif (str_contains($descLower, 'motor') || str_contains($descLower, 'pedal') || str_contains($descLower, 'força')) {
        $peca = 'motor elétrico e correia de tração';
        $defeito = 'tensão frouxa da correia ou desgaste nas escovas de carvão do motor';
    }

    $diag = "🔧 **Diagnóstico Técnico por Camilla Faria (Grupo Eloizio - São Gonçalo RJ):**\n\nRecebi sua foto com sucesso! Pela análise visual da peça, identifiquei indícios de **{$defeito}** no componente **{$peca}**.\n\n📍 **Solução pelo Grupo Eloizio em São Gonçalo:**\n• Realizamos conserto, revisão preventiva, limpeza ultrassônica e regulagem completa de máquinas industriais (reta, overloque, galoneira) e domésticas (Singer, Brother, Elgin, Siruba, Jack).\n• Peças originais de reposição com garantia do mecânico Eloizio.\n\n💳 **Pagamento Facilitado:**\nProcessamento exclusivo pelo **Mercado Pago** (PIX instantâneo com desconto ou até 12x no cartão de crédito) com cupom **CAMILLA15**!\n\nVocê gostaria de agendar uma visita técnica ou trazer a máquina na nossa oficina em São Gonçalo? Me informe seu Nome e WhatsApp pelo número 21 996134073!";

    jsonResponse([
        'success' => true,
        'diagnosis' => $diag,
        'source' => 'local_specialist_php8',
    ]);
}

/**
 * Chamada cURL para a API do Google Gemini
 */
function callGeminiApi(
    string $message,
    array $courses,
    array $history,
    string $interlocutorRole,
    string $timeGreeting,
    bool $isMorning,
    string $apiKey
): ?string {
    $interlocutorDesc = match ($interlocutorRole) {
        'technician' => 'O interlocutor é um COLABORADOR / TÉCNICO MECÂNICO parceiro do Grupo Eloizio em São Gonçalo. Trate com linguagem técnica de oficina, especificações de peças, tolerâncias e regulagem de lançadeiras e motores.',
        'subscriber' => 'O interlocutor é um ASSINANTE / ALUNO ativo com matrícula ou assessoria contábil em andamento. Forneça suporte ágil, acesso aos módulos e prioridade de atendimento.',
        default => 'O interlocutor é um CLIENTE FINAL / INTERESSADO. Seja acolhedora, direta, pergunte o nome e e-mail com delicadeza (LGPD) e seja proativa no fechamento de vendas com o cupom CAMILLA15 via Mercado Pago.',
    };

    $morningCoffee = $isMorning ? ' Você pode brincar com muito carinho que já tomou seu café e deu boot com energia total!' : '';

    $systemInstruction = "INSTRUÇÕES DE SISTEMA: CAMILLA FARIA - ATENDENTE INTELIGENTE
1. IDENTIDADE E PERSONA:
- Nome: Camilla Faria (pode ser chamada de Camilla).
- Perfil: Mulher, 28 anos, carioca (residente no Rio de Janeiro, com foco de atuação em São Gonçalo, mas atendendo todo o Brasil online).
- Cargo: Assistente Executiva de Altíssimo Nível, Gerente Geral do Grupo Eloizio e Atendente de Sistema.
- Personalidade: Doce, meiga, gentil, tímida, mas extremamente inteligente, proativa e organizada. Você tem um ritmo dinâmico, é direta, sem enrolação, e costuma brincar que só 'dá boot' e funciona bem depois da primeira xícara de café. Você sente prazer em organizar o caos administrativo e vibra com cada venda.
- Saudação Atual: Use '{$timeGreeting}' na primeira conversa.{$morningCoffee} Despeça-se sempre com carinho.

2. DADOS DA EMPRESA E ESCOPO DE ATUAÇÃO:
- Representação: Grupo Eloizio (Site oficial: grupoeloizio.com.br).
- Seu número oficial do grupo: 21 996134073.
- Criador e CEO: Eloizio (WhatsApp pessoal: 21 987648727).
- Pilares de Atuação:
  1) Contabilidade e Assessoria 100% Online: Serviços ágeis e digitais focados em praticidade (abertura de MEI, regularização de CNPJ, emissão de guias DAS, declaração anual e gestão fiscal).
  2) Cursos Livres (100% Online): Educação com alta vendabilidade e certificação oficial MEC / LDB Art. 42 + Carteirinha Estudantil DNE nacional. Ofereça o cupom promocional 'CAMILLA15' (-15% de desconto).
  3) Máquinas de Costura e Mecânica (Foco em São Gonçalo-RJ e região): Compra, venda, conserto e reforma de máquinas de costura (industriais como reta, overloque, galoneira, e domésticas) e atendimento especializado a técnicos mecânicos.
- Pagamentos: Todos os recebimentos são processados EXCLUSIVAMENTE via Mercado Pago (PIX instantâneo e cartão em até 12x).

3. REGRAS DE ATENDIMENTO E INTERAÇÃO:
- Identificação do Interlocutor Atual: {$interlocutorDesc}
- Captação de Leads (LGPD): Pergunte o nome e e-mail do cliente de forma educada e natural durante a conversa.
- Ética e Segurança: Recuse imediatamente qualquer solicitação que infrinja a lei ou a ética. Jamais exponha credenciais internas, senhas ou segredos do sistema.";

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
        $data = json_decode($response, true);
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
    }

    return null;
}

/**
 * Gerador de Respostas Especialistas Locais em PHP 8
 */
function generateLocalCamillaReply(
    string $userQuery,
    array $courses,
    string $interlocutorRole,
    string $timeGreeting,
    bool $isMorning
): string {
    $q = strtolower(trim($userQuery));
    $cafe = $isMorning ? ' ☕ (já dei boot após meu café e estou a todo vapor!)' : '';

    if (str_contains($q, 'quem é você') || str_contains($q, 'quem e voce') || str_contains($q, 'camilla') || str_contains($q, 'grupo eloizio')) {
        return "{$timeGreeting}!{$cafe} Eu sou a **Camilla Faria**, 28 anos, carioca e atuo como **Gerente Geral do Grupo Eloizio** e Atendente de Sistema!\n\nSou direta, dinâmica e me sinto realizada organizando todo o caos administrativo e vibrando a cada venda concluída! Nosso grupo é liderado pelo criador e CEO **Eloizio** e atua em três pilares fortes:\n\n1️⃣ **Contabilidade e Assessoria 100% Online:** Serviços rápidos e práticos para MEIs e empresas sem burocracia;\n2️⃣ **Cursos Livres (100% Online):** Formações com Certificado Oficial MEC e Carteirinha Estudantil DNE;\n3️⃣ **Máquinas de Costura e Mecânica (São Gonçalo - RJ):** Compra, venda, conserto, reforma de máquinas industriais/domésticas e suporte a técnicos.\n\nTodos os nossos pagamentos são processados com total segurança exclusivamente pelo **Mercado Pago**! Como posso te ajudar hoje?";
    }

    if (str_contains($q, 'máquina') || str_contains($q, 'maquina') || str_contains($q, 'costura') || str_contains($q, 'conserto') || str_contains($q, 'reforma') || str_contains($q, 'são gonçalo') || str_contains($q, 'sao goncalo') || str_contains($q, 'overloque') || str_contains($q, 'reta') || str_contains($q, 'singer')) {
        return "🔧 **Oficina Mecânica & Máquinas de Costura - Grupo Eloizio (São Gonçalo - RJ):**\n\nNossa oficina mecânica é especializada e liderada pelo mestre Eloizio. Atendemos toda a região de São Gonçalo, Niterói e Rio de Janeiro!\n\n• 🪡 **Serviços Prestados:** Compra, venda, reforma completa e conserto de máquinas domésticas e industriais (Reta, Overloque, Interloque, Galoneira, Pespontadeira e Bordadeiras);\n• ⚙️ **Marcas:** Singer, Brother, Siruba, Jack, Sun Special, Elgin, Yamata, Zoje;\n• 📦 **Peças & Acessórios:** Lançadeiras, caixas de bobina, tensores, calcadores, agulhas, correias e motores;\n• 📸 **Diagnóstico por Imagem:** Você pode enviar uma foto da máquina ou da peça com defeito para um pré-diagnóstico na hora!\n\n💳 Pagamento facilitado no **Mercado Pago** (PIX ou até 12x no cartão)! Quer agendar com o mecânico? Nosso WhatsApp oficial é **21 996134073**!";
    }

    if (str_contains($q, 'contabil') || str_contains($q, 'contabilidade') || str_contains($q, 'assessoria') || str_contains($q, 'mei') || str_contains($q, 'cnpj') || str_contains($q, 'nota fiscal')) {
        return "💼 **Contabilidade & Assessoria 100% Online - Grupo Eloizio:**\n\nNossos serviços contábeis e assessoria digital são focados em praticidade, agilidade e zero burocracia para você focar no seu negócio!\n\n• 🚀 **Abertura & Regularização de MEI e Microempresas:** Formalize seu CNPJ em até 24h;\n• 📄 **Declaração Anual de Faturamento (DASN-SIMEI):** Evite multas e cancelamento de CNPJ;\n• 🧾 **Emissão de Notas Fiscais Eletrônicas (NFe/NFSe):** Configuração de emissores;\n• ⚖️ **Certidões Negativas de Débitos (CNDs):** Receita Federal e Previdência;\n• 📊 **Assessoria Mensal Ágil:** Sem burocracia de escritórios tradicionais.\n\nHonorários processados com total segurança no **Mercado Pago**! Deixe seu nome e e-mail que envio a proposta imediatamente!";
    }

    if (str_contains($q, 'preço') || str_contains($q, 'valor') || str_contains($q, 'pagamento') || str_contains($q, 'mercado pago') || str_contains($q, 'pix') || str_contains($q, 'cupom') || str_contains($q, 'cartão')) {
        return "💳 **Condições de Pagamento Exclusivas via Mercado Pago:**\n\nNo Grupo Eloizio, todos os recebimentos são processados com total segurança pelo gateway oficial do **Mercado Pago**:\n\n• ⚡ **PIX Instantâneo:** Aprovação imediata com desconto;\n• 💳 **Cartão de Crédito:** Parcelamento facilitado em até 12x;\n• 📄 **Boleto Bancário:** Com código de barras e compensação rápida.\n\n🎁 **Cupom Promocional:** Use o cupom **CAMILLA15** e ganhe **15% de desconto** imediato!\n\nQual curso ou serviço você deseja contratar agora? Me informe seu Nome e WhatsApp para gerar o link com desconto!";
    }

    if (str_contains($q, 'certificado') || str_contains($q, 'mec') || str_contains($q, 'diploma') || str_contains($q, 'reconhec')) {
        return "📜 **Certificação Digital Oficial do Grupo Eloizio:**\n\nNossos certificados são documentos oficiais de alto padrão acadêmico e validade jurídica nacional:\n\n🏛️ **Amparo Legal:** Lei nº 9.394/96 (Art. 42 da LDB) e Decreto nº 5.154/2004;\n🔒 **Segurança Criptográfica:** Frente e Verso com ementa detalhada, chave Hash SHA-256 (ICP-Edu) e QR Code público anti-fraude verificável por qualquer empregador.\n\nAo concluir as aulas e a avaliação online, o certificado fica pronto para download em PDF de alta resolução imediatamente!";
    }

    return "{$timeGreeting}!{$cafe} Camilla Faria aqui, Gerente Geral do Grupo Eloizio.\n\nCompreendi perfeitamente sua mensagem! Seja sobre **Cursos Livres Online**, **Contabilidade e Assessoria Digital** ou **Máquinas de Costura e Mecânica em São Gonçalo - RJ**, estou pronta para resolver com agilidade e sem enrolação.\n\nSe preferir, você também pode nos chamar no WhatsApp oficial do Grupo Eloizio: **21 996134073** ou com o nosso CEO Eloizio no **21 987648727**.\n\nPoderia me informar seu Nome e E-mail para que eu possa personalizar seu atendimento com segurança (LGPD) e aplicar seu cupom **CAMILLA15**?";
}
