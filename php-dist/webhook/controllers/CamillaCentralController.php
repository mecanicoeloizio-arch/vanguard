<?php
/**
 * Hub Centralizado • Camilla Faria - Atendente Inteligente & Gerente Geral
 * Grupo Eloizio 2026
 * 
 * Atuação Unificada nos 3 Pilares e Sistemas:
 * 1. Cursos Livres 100% Online (Transformação, apostilas, manuais de bancada)
 * 2. Máquinas de Costura & Mecânica (São Gonçalo-RJ, conserto, compra/venda, peças)
 * 3. Contabilidade & Assessoria 100% Online (EloContábil - Apoio sem CRC)
 * + EloMak (ERP de Oficina sem senha) e EloSign (Assinaturas Digitais)
 * + Recebimentos Exclusivos via Mercado Pago
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/mercadopago.php';
require_once dirname(__DIR__) . '/config/whatsapp.php';

class CamillaCentralController {
    /**
     * Saudação inteligente conforme o horário do dia
     */
    public static function getSaudacao(): string {
        $hora = (int)date('G');
        if ($hora >= 5 && $hora < 12) {
            return "Bom dia";
        } elseif ($hora >= 12 && $hora < 18) {
            return "Boa tarde";
        } else {
            return "Boa noite";
        }
    }

    /**
     * Processa mensagem recebida de cliente em qualquer canal
     */
    public static function processarMensagem(
        string $whatsapp,
        string $mensagem,
        string $canal = 'whatsapp',
        ?string $midiaUrl = null,
        string $perfilInterlocutor = 'cliente'
    ): array {
        $db = CentralDatabase::getConnection();
        $saudacao = self::getSaudacao();
        $textoLimpo = mb_strtolower(trim($mensagem), 'UTF-8');
        $whatsappLimpo = preg_replace('/[^0-9]/', '', $whatsapp);

        // 1. Verificar se cliente já existe no cadastro unificado
        $stmtCliente = $db->prepare("SELECT * FROM clientes_unificados WHERE whatsapp = ? LIMIT 1");
        $stmtCliente->execute([$whatsappLimpo]);
        $cliente = $stmtCliente->fetch();

        $nomeCliente = $cliente ? $cliente['nome'] : '';
        $emailCliente = $cliente ? $cliente['email'] : '';

        // 2. Classificação de Intenção e Resposta da Camilla
        $projetoDirecionado = 'central';
        $resposta = '';
        $chamouEloizio = 0;
        $acoesSugeridas = [];
        $linkPagamento = null;

        // SE DETECTAR PLACA DE VEÍCULO (Padrão Mercosul ou Antigo)
        if (preg_match('/[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/i', $mensagem, $matches)) {
            $placa = strtoupper($matches[0]);
            $projetoDirecionado = 'elomak';
            $resposta = "{$saudacao}! ☕ Aqui é a Camilla da oficina do Grupo Eloizio!\n\nIdentifiquei a placa **{$placa}** no nosso sistema EloMak. Qual é o sintoma ou defeito apresentado pelo veículo/maquinário? Pode me mandar uma foto ou áudio detalhando para eu abrir sua Ordem de Serviço com prioridade!";
            $acoesSugeridas = ['Descrever defeito', 'Acessar painel EloMak', 'Falar com técnico'];
        }
        // SE FOR PEDIDO DE PAGAMENTO / PIX / MERCADO PAGO
        elseif (str_contains($textoLimpo, 'pagar') || str_contains($textoLimpo, 'pix') || str_contains($textoLimpo, 'boleto') || str_contains($textoLimpo, 'cartao') || str_contains($textoLimpo, 'cartão') || str_contains($textoLimpo, 'comprar')) {
            $projetoDirecionado = 'mercadopago';
            $cobranca = MercadoPagoAdapter::criarCobrancaPix('central', 'atendimento_' . time(), 97.00, 'Serviço / Curso / Adesão Grupo Eloizio', [
                'nome' => $nomeCliente ?: 'Cliente Eloizio',
                'whatsapp' => $whatsappLimpo,
                'email' => $emailCliente ?: 'cliente@grupoeloizio.com.br'
            ]);

            $linkPagamento = $cobranca['link_pagamento'];
            $resposta = "{$saudacao}! ☕ Vibro muito com cada fechamento! Aqui no Grupo Eloizio todos os nossos pagamentos são processados com total segurança e rapidez exclusivamente pelo **Mercado Pago** (PIX com baixa imediata ou até 12x no cartão)!\n\n📱 **Chave Copia e Cola PIX:**\n`{$cobranca['pix_copia_cola']}`\n\n💳 **Link de Pagamento Seguro:**\n{$cobranca['link_pagamento']}\n\nAssim que você pagar, o sistema me avisa na hora e eu já libero seu acesso ou confirmo sua ordem de serviço!";
        }
        // SE FOR MÁQUINAS DE COSTURA / MECÂNICA (SÃO GONÇALO - RJ)
        elseif (
            str_contains($textoLimpo, 'maquina') || str_contains($textoLimpo, 'máquina') || 
            str_contains($textoLimpo, 'costura') || str_contains($textoLimpo, 'overloque') || 
            str_contains($textoLimpo, 'reta') || str_contains($textoLimpo, 'galoneira') || 
            str_contains($textoLimpo, 'conserto') || str_contains($textoLimpo, 'peça') || 
            str_contains($textoLimpo, 'mecanica') || str_contains($textoLimpo, 'mecânica')
        ) {
            $projetoDirecionado = 'oficina';
            $resposta = "{$saudacao}! ☕ Aqui é a Camilla Faria, Gerente Geral do Grupo Eloizio! Atuamos fortemente com nossa oficina especializada aqui em **São Gonçalo - RJ e região**, atendendo clientes e técnicos de todo o Brasil!\n\nTrabalhamos com:\n• 🪡 **Conserto e Reforma:** Máquinas Industriais, Domésticas, Novas e Antigas (Reta, Overloque, Galoneira, etc.);\n• 📦 **Compra e Venda:** Equipamentos revisados com garantia e procedência;\n• ⚙️ **Peças Originais e Suporte:** Atendimento técnico especializado;\n• 🛠️ **Sistema EloMak:** Ordem de serviço digital sem complicação.\n\nQual é o modelo da sua máquina? Me envia uma foto do sintoma ou detalhe do defeito para eu já adiantar o diagnóstico para nossa bancada!";
            $acoesSugeridas = ['Enviar foto da máquina', 'Pedir orçamento', 'Agendar visita em São Gonçalo', 'Ver cursos de mecânica'];
        }
        // SE FOR CURSOS LIVRES 100% ONLINE
        elseif (
            str_contains($textoLimpo, 'curso') || str_contains($textoLimpo, 'estudar') || 
            str_contains($textoLimpo, 'aula') || str_contains($textoLimpo, 'aprender') || 
            str_contains($textoLimpo, 'certificado') || str_contains($textoLimpo, 'apostila') || 
            str_contains($textoLimpo, 'matricula') || str_contains($textoLimpo, 'matrícula')
        ) {
            $projetoDirecionado = 'cursos';
            $resposta = "{$saudacao}! ☕ Que alegria ver seu interesse em estudar! Eu sempre digo que o conhecimento é a chave que transforma qualquer sonho em realidade!\n\nNossos **Cursos Livres Profissionalizantes são 100% Online**, amparados pela Lei de Diretrizes e Bases (LDB 9.394/96 Art. 42 e MEC). Todas as nossas formações acompanham:\n• 🛠️ **Manuais Técnicos de Bancada** completos;\n• 📖 **Livros Digitais e Apostilas Oficiais**;\n• 🎥 **Aulas práticas em vídeo**;\n• 📜 **Certificado com Validação Digital** imediata;\n• 💳 Pagamento facilitado em até 12x no Mercado Pago!\n\nDestaco especialmente nosso curso de **Mecânica e Manutenção de Máquinas de Costura com o mestre Eloizio Assunção** e nossos cursos de Tecnologia e Contabilidade!\n\nQual área você quer dominar para alavancar sua renda?";
            $acoesSugeridas = ['Curso Máquinas de Costura', 'Curso Contabilidade MEI', 'Curso Engenharia de Software', 'Falar no WhatsApp'];
        }
        // SE FOR CONTABILIDADE / ELOCONTÁBIL / RH / PONTO / HOLERITE
        elseif (
            str_contains($textoLimpo, 'contabil') || str_contains($textoLimpo, 'contábil') || 
            str_contains($textoLimpo, 'elocontabil') || str_contains($textoLimpo, 'holerite') || 
            str_contains($textoLimpo, 'ponto') || str_contains($textoLimpo, 'rh') || 
            str_contains($textoLimpo, 'funcionario') || str_contains($textoLimpo, 'cnpj') || 
            str_contains($textoLimpo, 'alvara') || str_contains($textoLimpo, 'alvará') || 
            str_contains($textoLimpo, 'epi') || str_contains($textoLimpo, 'aso')
        ) {
            $projetoDirecionado = 'elocontabil';
            $resposta = "{$saudacao}! ☕ Sou a Camilla, Gerente Geral do Grupo Eloizio! Conheça o **EloContábil** (`elocontabil.grupoeloizio.com.br`) — nossa plataforma de apoio administrativo e RH que organiza tudo para sua empresa sem burocracia!\n\n📌 *Lembrando que o EloContábil é apoio administrativo inteligente e organização documental, não substituindo seu contador responsável (sem exigência de CRC direto).*\n\nCom o EloContábil você tem:\n1. ⏱️ **RH de Apoio:** Ponto simples, controle de ASO, EPIs, termos e organização de holerites;\n2. 🗄️ **Cofre Administrativo:** Alerta de vencimento de alvarás, contratos e lembretes de envio ao contador;\n3. 📲 **Atendimento Camilla:** Envio de holerite por WhatsApp e link temporário de upload!\n\nDeseja acessar seu cofre administrativo ou cadastrar sua empresa agora?";
            $acoesSugeridas = ['Acessar EloContábil', 'Controlar Ponto & EPI', 'Falar com Camilla no Zap'];
        }
        // SE FOR ASSINATURA ELETRÔNICA / ELOSIGN / CONTRATO
        elseif (
            str_contains($textoLimpo, 'assin') || str_contains($textoLimpo, 'contrato') || 
            str_contains($textoLimpo, 'documento') || str_contains($textoLimpo, 'elosign') || 
            str_contains($textoLimpo, 'rubrica') || str_contains($textoLimpo, 'validade jurídica')
        ) {
            $projetoDirecionado = 'elosign';
            $resposta = "{$saudacao}! ☕ Aqui é a Camilla! Para formalizar termos, contratos e ordens de serviço, nós usamos e disponibilizamos o **EloSign** (`elosign.grupoeloizio.com.br`)!\n\nEle conta com validade jurídica plena (Lei 14.063/2020 e MP 2.200-2), registro pericial com IP, carimbo de tempo, folha de auditoria e QR Code de verificação pública imediata.\n\nDeseja assinar um documento pendente ou contratar um pacote de assinaturas pelo Mercado Pago?";
            $acoesSugeridas = ['Acessar EloSign', 'Validar Documento', 'Planos a partir de R$ 39'];
        }
        // SE O CLIENTE PEDIR PARA FALAR COM O ELOIZIO / DIRETOR PESSOALMENTE
        elseif (str_contains($textoLimpo, 'falar com o eloizio') || str_contains($textoLimpo, 'falar com o chefe') || str_contains($textoLimpo, 'eloizio pessoalmente')) {
            $chamouEloizio = 1;
            $resposta = "{$saudacao}! Como Gerente Geral e Assistente Executiva do Grupo Eloizio, eu consigo resolver mais de 98% de todas as demandas administrativas, técnicas, comerciais e financeiras de ponta a ponta sem você precisar esperar!\n\nPorém, se a sua questão for um caso de extrema necessidade, parceria societária direta ou alinhamento executivo direto com o nosso CEO, você pode contatar o WhatsApp pessoal do Sr. Eloizio no número **(21) 987648727**.\n\nMas antes, me conta: qual é a situação? Prometo que vou me dedicar para resolver para você agora mesmo com todo carinho!";
        }
        // RESPOSTA PADRÃO ACOLHEDORA DE BOAS-VINDAS & CAPTAÇÃO LGPD
        else {
            $projetoDirecionado = 'central';
            $perguntaLgpd = (!$nomeCliente || !$emailCliente) 
                ? "\n\n🔒 *Para garantir um atendimento seguro e personalizado conforme a LGPD, como você gostaria que eu te chamasse e qual é o seu melhor e-mail?*" 
                : "";

            $resposta = "{$saudacao}! ☕ Muito prazer! Eu sou a **Camilla Faria**, Gerente Geral e Atendente Inteligente do **Grupo Eloizio** (grupoeloizio.com.br)!\n\nSou carioca, tenho 28 anos, atuo focada aqui em São Gonçalo - RJ e atendo todo o Brasil online. Costumo brincar que só 'dou boot' de verdade depois do meu primeiro cafezinho, mas amo organizar o caos e vibro com cada solução que entregamos!\n\nComo posso te ajudar hoje?\n1️⃣ **Máquinas de Costura & Mecânica:** Compra, venda, conserto, reforma e peças (São Gonçalo - RJ);\n2️⃣ **Cursos Livres 100% Online:** Manuais de bancada, apostilas e certificação MEC;\n3️⃣ **EloContábil:** Apoio administrativo, RH, ponto e cofre sem CRC;\n4️⃣ **EloMak:** Sistema ERP para oficina mecânica com acesso WhatsApp sem senha;\n5️⃣ **EloSign:** Assinatura digital com validade jurídica.\n\n💳 Lembrando que todos os pagamentos são facilitados via **Mercado Pago**!{$perguntaLgpd}";
            $acoesSugeridas = ['1- Mecânica & Máquinas', '2- Cursos Online', '3- EloContábil', '4- EloMak Oficina'];
        }

        // 3. Registrar interação no banco centralizado
        $stmtInt = $db->prepare("
            INSERT INTO interacoes_camilla 
            (whatsapp, canal, projeto_direcionado, mensagem_cliente, resposta_camilla, chamou_eloizio)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmtInt->execute([
            $whatsappLimpo ?: WHATSAPP_CAMILLA_OFICIAL,
            $canal,
            $projetoDirecionado,
            $mensagem,
            $resposta,
            $chamouEloizio
        ]);

        return [
            'success' => true,
            'atendente' => 'Camilla Faria',
            'cargo' => 'Gerente Geral & Assistente Executiva do Grupo Eloizio',
            'telefone' => WHATSAPP_CAMILLA_OFICIAL,
            'saudacao' => $saudacao,
            'projeto_direcionado' => $projetoDirecionado,
            'resposta' => $resposta,
            'acoes_sugeridas' => $acoesSugeridas,
            'link_pagamento' => $linkPagamento,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}
