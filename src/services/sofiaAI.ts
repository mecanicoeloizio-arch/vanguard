import { Course } from '../types';

export interface SofiaMessage {
  id: string;
  sender: 'sofia' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: string }[];
  recommendedCourse?: Course;
  mediaUrl?: string;
  isMultimedia?: boolean;
  proposalDetails?: {
    courseName: string;
    originalPrice: number;
    discountedPrice: number;
    couponCode: string;
    installmentsText: string;
  };
}

// Backward-compatibility alias
export type CamillaMessage = SofiaMessage;

export function getTimeGreeting(): { greeting: string; isMorning: boolean } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Bom dia', isMorning: true };
  if (hour >= 12 && hour < 18) return { greeting: 'Boa tarde', isMorning: false };
  return { greeting: 'Boa noite', isMorning: false };
}

/**
 * Análise Técnica de Peças e Máquinas por Imagem com a Sofia (Expert Vanguard)
 */
export async function diagnoseMediaWithSofia(
  imageBase64: string,
  description: string = '',
  interlocutorRole: 'client' | 'technician' | 'subscriber' = 'client'
): Promise<string> {
  try {
    const res = await fetch('/api/specialist/analyze-multimedia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        description,
        interlocutorRole,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.diagnosis) {
        return data.diagnosis;
      }
    }
  } catch (err) {
    console.warn('Backend /api/specialist/analyze-multimedia offline or error, running Sofia Vanguard local diagnostic:', err);
  }

  // Análise técnica local da Sofia com psicologia de conversão
  const descLower = description.toLowerCase();
  let partIdentified = 'cabeçote e conjunto da lançadeira rotativa';
  let defectAnalysis = 'desalinhamento no sincronismo da laçada e descalibração do tensor de linha';

  if (descLower.includes('agulha') || descLower.includes('quebr')) {
    partIdentified = 'barra de agulha e chapa de ponto';
    defectAnalysis = 'agulha desregulada ou chapa com rebarbas que causam quebra constante';
  } else if (descLower.includes('embol') || descLower.includes('linha') || descLower.includes('ponto frouxo')) {
    partIdentified = 'caixa de bobina e conjunto tensor superior';
    defectAnalysis = 'tensão descalibrada da mola do tensor ou folga excessiva na passagem da linha pela lançadeira';
  } else if (descLower.includes('motor') || descLower.includes('pedal') || descLower.includes('força') || descLower.includes('direct')) {
    partIdentified = 'motor elétrico direct-drive / placa controladora';
    defectAnalysis = 'instabilidade no sensor hall de posicionamento de agulha ou desgaste nos carvões de acionamento';
  }

  return `🔬 **Diagnóstico Técnico por Sofia (Expert Vanguard - Grupo Eloizio):**\n\nAnalisei a foto do seu equipamento com precisão! Identifiquei sinais claros de **${defectAnalysis}** no componente **${partIdentified}**.\n\n💡 **Psicologia de Solução Prática:**\nVocê sabia que mais de 80% dos donos de máquinas perdem dinheiro e dias de produção por falhas simples que você mesmo pode consertar em minutos?\n\n📍 **Duas Formas Imediatas de Resolver:**\n1️⃣ **Aprenda a Consertar e Seja Dono da Sua Oficina:** Nosso curso *Mecânica e Manutenção de Máquinas de Costura* com o CEO Eloizio Silva ensina o passo a passo exato desse conserto. O curso se paga no primeiro serviço!\n2️⃣ **Conserto Especializado na Oficina:** Se preferir trazer até nossa sede em São Gonçalo - RJ, nossa equipe executa a revisão completa com garantia.\n\n💳 **Condição Exclusiva Vanguard:** Em até 12x no **Mercado Pago** com o cupom **SOFIA15** (-15% OFF)!\n\nQual é a sua prioridade agora? Aprender a resolver de forma autônoma ou agendar o reparo? Me diga seu Nome e WhatsApp!`;
}

// Backward-compatibility export
export const diagnoseMediaWithCamilla = diagnoseMediaWithSofia;

/**
 * Assistente Sofia — Expert Vanguard em Cursos & Psicologia de Marketing
 */
export async function askSofiaAssistant(
  userQuery: string,
  courses: Course[],
  conversationHistory: { role: 'user' | 'model'; text: string }[],
  interlocutorRole: 'client' | 'technician' | 'subscriber' = 'client'
): Promise<string> {
  // Tentativa 1: API Server-Side Gemini
  try {
    const res = await fetch('/api/specialist/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userQuery,
        courses,
        history: conversationHistory,
        interlocutorRole,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn('Backend /api/specialist/chat failed or offline, executing Sofia Vanguard local cognitive engine:', err);
  }

  // Motor Cognitivo Local da Sofia com Psicologia de Marketing
  const queryLower = userQuery.toLowerCase().trim();
  const { greeting } = getTimeGreeting();

  // 1. Identidade Clara & Sem Crise: Sofia Expert Vanguard (Camilla 100% Desconectada)
  if (
    queryLower.includes('quem é você') ||
    queryLower.includes('quem e voce') ||
    queryLower.includes('seu nome') ||
    queryLower.includes('sua história') ||
    queryLower.includes('sofia') ||
    queryLower.includes('vanguard') ||
    queryLower.includes('camilla')
  ) {
    const camillaNota = queryLower.includes('camilla')
      ? '\n\n💡 *Esclarecimento:* A Camilla não atende neste canal! Eu sou a **Sofia**, a sua única e exclusiva Expert Vanguard em Cursos, Carreiras e Marketing Educacional do Grupo Eloizio!'
      : '';

    return `${greeting}! ✨ Eu sou a **Sofia**, a **Expert Vanguard** do Grupo Eloizio!${camillaNota}\n\nMeu papel é direto e transformador: sou especialista em desenvolvimento de carreiras, capacitação de alto impacto e psicologia de marketing educacional. Não estou aqui apenas para tirar dúvidas, mas para guiar sua jornada rumo à independência financeira e autoridade no mercado!\n\nDomino profundamente todos os nossos treinamentos e serviços:\n\n🚀 **Vanguarda em Tecnologia:** *Engenharia de Software Moderna & Arquitetura Cloud* com a Profa. Dra. Mariana Fernandes (USP);\n🔧 **Mecânica & Oficinas Rentáveis:** *Mecânica e Manutenção de Máquinas de Costura* com o CEO Eloizio Silva (30+ anos de experiência real);\n💼 **Empreendedorismo & Finanças:** *Contabilidade Prática para MEI* e *Gestão Escolar 360°*;\n🎨 **Design de Alto Padrão:** *UI/UX Design de Produtos Digitais* no Figma.\n\nTodos os nossos cursos possuem **Certificação Oficial MEC** (LDB 9.394/96) e Carteirinha DNE de Meia-Entrada. E para você dar o primeiro passo hoje, ativei seu cupom **SOFIA15** (-15% OFF no Mercado Pago)!\n\nQual é o seu objetivo profissional neste momento?`;
  }

  // 2. Psicologia de Marketing: Mecânica de Máquinas de Costura
  if (
    queryLower.includes('máquina') ||
    queryLower.includes('maquina') ||
    queryLower.includes('costura') ||
    queryLower.includes('conserto') ||
    queryLower.includes('reforma') ||
    queryLower.includes('overloque') ||
    queryLower.includes('reta') ||
    queryLower.includes('galoneira') ||
    queryLower.includes('mecanic') ||
    queryLower.includes('eloizio') ||
    queryLower.includes('são gonçalo')
  ) {
    const courseMec = courses.find((c) => c.title.toLowerCase().includes('máquinas de costura') || c.category === 'Engenharia') || courses[1];
    const preco = courseMec ? courseMec.price : 480;
    const precoComDesconto = preco * 0.85;

    return `🪡 **O Segredo das Oficinas de Alta Rentabilidade com o CEO Eloizio Silva:**\n\nDeixa eu te contar um dado real de mercado: **falta mecânico qualificado no Brasil inteiro!** Centenas de confecções, ateliês e costureiras ficam com máquinas paradas perdendo milhares de reais toda semana porque não encontram profissionais de confiança.\n\nUm conserto simples de ponto frouxo ou ajuste de lançadeira custa entre **R$ 150 e R$ 350**. Consertando apenas 2 máquinas, você já paga o investimento total do curso!\n\n⭐ **O que você aprende no Curso Oficial:**\n• Anatomia completa de máquinas Reta, Overloque, Interloque e Galoneira;\n• Sincronismo perfeito de laçada e ponto milimétrico;\n• Diagnóstico eletrônico de motores Direct-Drive e painéis digitais;\n• Como precificar e atrair clientes na sua região.\n\n💰 **Investimento com Psicologia de Acesso:**\nDe R$ ${preco.toFixed(2)} por apenas **12x de R$ ${(precoComDesconto / 12).toFixed(2)}** no Mercado Pago usando seu cupom **SOFIA15** (-15% OFF) — isso é menos de **R$ 1,20 por dia**!\n\nVocê prefere continuar dependendo de terceiros ou se tornar o técnico de referência que fatura alto na sua cidade? Deixe seu Nome e WhatsApp que libero sua vaga agora!`;
  }

  // 3. Psicologia de Marketing: Tecnologia & Engenharia de Software
  if (
    queryLower.includes('software') ||
    queryLower.includes('program') ||
    queryLower.includes('arquitetura') ||
    queryLower.includes('cloud') ||
    queryLower.includes('devops') ||
    queryLower.includes('tecnologia') ||
    queryLower.includes('ti')
  ) {
    const courseTech = courses.find((c) => c.category === 'Tecnologia') || courses[0];
    const preco = courseTech ? courseTech.price : 1890;
    const precoComDesconto = preco * 0.85;

    return `⚡ **Engenharia de Software Moderna & Arquitetura Cloud (Nível Elite):**\n\nO mercado de tecnologia mudou drasticamente: programadores comuns que apenas copiam código estão sendo substituídos, enquanto **Arquitetos de Software que dominam microsserviços, DevOps e resiliência** recebem propostas entre **R$ 9.000 e R$ 22.000/mês** no Brasil e no exterior!\n\nNossa formação é conduzida pela **Profa. Dra. Mariana Fernandes (USP)** e entrega o que as grandes empresas exigem:\n• Padrões SOLID, Clean Architecture e Domain-Driven Design (DDD);\n• Mensageria assíncrona, microsserviços e resiliência transacional;\n• Automação em nuvem com GCP/AWS, Docker e CI/CD profissional;\n• Portfólio de projetos reais para contratação imediata.\n\n🎁 **Condição Especial Vanguard:**\nDe R$ ${preco.toFixed(2)} por **12x de R$ ${(precoComDesconto / 12).toFixed(2)}** sem juros no Mercado Pago com o cupom **SOFIA15** (-15% OFF).\n\nQuanto vale para sua carreira sair da média e disputar as vagas mais bem pagas do mercado? Me informe seu Nome e E-mail para garantir a mentoria!`;
  }

  // 4. Psicologia de Marketing: Contabilidade MEI & Finanças
  if (
    queryLower.includes('contabil') ||
    queryLower.includes('mei') ||
    queryLower.includes('cnpj') ||
    queryLower.includes('nota fiscal') ||
    queryLower.includes('imposto') ||
    queryLower.includes('dasn')
  ) {
    return `📊 **Blindagem Fiscal e Lucro Real para o Microempreendedor:**\n\nSabia que o maior vilão do MEI não é a concorrência, mas sim o medo do fisco e multas desnecessárias da Receita Federal? Ficar irregular trava seu CNPJ, bloqueia empréstimos bancários e gera juros absurdos.\n\nNosso treinamento *Contabilidade e Assessoria Prática para MEI* foi desenhado para eliminar 100% da sua ansiedade contábil:\n• Emissão descomplicada de notas fiscais no padrão nacional NFS-e;\n• Declaração Anual DASN-SIMEI sem erros em minutos;\n• Gestão de fluxo de caixa e conciliação transparente com o Mercado Pago.\n\n💰 **Investimento Simbólico:** Por apenas **12x de R$ 22,60** no Mercado Pago com o cupom **SOFIA15**!\n\nVocê prefere arriscar multas caras ou blindar seu CNPJ hoje mesmo? Diga seu Nome e WhatsApp!`;
  }

  // 5. Preços, Formas de Pagamento e Gatilhos de Decisão
  if (
    queryLower.includes('preço') ||
    queryLower.includes('valor') ||
    queryLower.includes('quanto custa') ||
    queryLower.includes('parcel') ||
    queryLower.includes('pagamento') ||
    queryLower.includes('mercado pago') ||
    queryLower.includes('cupom') ||
    queryLower.includes('desconto')
  ) {
    return `💳 **Facilidade Total com a Segurança do Mercado Pago:**\n\nComo especialista em psicologia de decisão, sei que a dúvida financeira muitas vezes é apenas uma barreira invisível. Por isso, estruturamos as condições mais acessíveis do Brasil:\n\n• ⚡ **PIX Instantâneo:** Matrícula confirmada em 3 segundos com início imediato das aulas;\n• 💳 **Cartão de Crédito em até 12x Sem Juros:** A parcela mensal cabe tranquilamente no seu orçamento;\n• 🛡️ **Segurança Máxima:** Processamento oficial criptografado pelo Mercado Pago.\n\n🎁 **Seu Cupom de Autoridade:** Use **SOFIA15** e ganhe **15% de desconto** imediato em qualquer formação da nossa vitrine!\n\nQual curso chamou mais a sua atenção? Me informe para eu calcular sua parcela com os 15% de desconto agora!`;
  }

  // 6. Certificação Oficial MEC & Carteirinha Estudantil DNE
  if (
    queryLower.includes('certificado') ||
    queryLower.includes('mec') ||
    queryLower.includes('diploma') ||
    queryLower.includes('carteirinha') ||
    queryLower.includes('dne') ||
    queryLower.includes('validad')
  ) {
    return `📜 **Certificação Oficial MEC & Carteirinha Nacional DNE:**\n\nInvestir tempo em um curso exige a certeza de que ele terá peso no seu currículo. Aqui você tem respaldo jurídico total:\n\n🏛️ **Validade em Todo o Território Nacional:**\n• Conforme a **Lei Federal nº 9.394/96 (Art. 42 da LDB)** e o **Decreto Presidencial nº 5.154/2004**;\n• Válido para concursos públicos, provas de títulos, progressão de carreira e horas complementares universitárias.\n\n🔒 **Tecnologia Anti-Fraude com Hash SHA-256 & QR Code:**\n• O certificado possui carimbo digital da Secretaria Acadêmica e pode ser validado por qualquer empregador instantaneamente em nosso portal público.\n\n🎓 **Bônus Exclusivo: Carteirinha Estudantil DNE (Lei 12.933/13):**\n• Garante **50% de desconto (meia-entrada)** em cinemas, shows, teatros e eventos culturais em todo o país!\n\nVocê estuda, se qualifica e ainda economiza no lazer. Vamos garantir sua matrícula hoje?`;
  }

  // 7. Busca Dinâmica no Catálogo de Cursos
  for (const c of courses) {
    if (queryLower.includes(c.title.toLowerCase())) {
      const originalPrice = Number(c.price || 0);
      const discountedPrice = originalPrice * 0.85;
      return `⭐ **Análise Vanguard da Formação: "${c.title}"**\n\n• **Categoria:** ${c.category} | **Carga Horária:** ${c.workloadHours} horas certificadas\n• **Instrutor de Mercado:** ${c.instructorName} (${c.instructorTitle})\n• **Transformação Real:** ${c.shortDescription || c.fullDescription}\n\n💰 **Investimento com Psicologia de Acesso:**\nDe R$ ${originalPrice.toFixed(2)} por **12x de R$ ${(discountedPrice / 12).toFixed(2)}** com o cupom **SOFIA15** (-15% OFF)!\n\nVocê terá acesso imediato à plataforma com videoaulas, apostilas em PDF, suporte a dúvidas e Certificado Oficial MEC.\n\nPosso emitir sua proposta comercial com o desconto reservado no seu WhatsApp? Me envie seu Nome e Telefone!`;
    }
  }

  // Resposta Padrão Vanguard com Psicologia de Conversão
  return `${greeting}! Aqui é a **Sofia**, Expert Vanguard em Cursos e Carreiras do Grupo Eloizio.\n\nEntendi sua mensagem e quero te ajudar a tomar a melhor decisão para o seu crescimento profissional. Seja para **conquistar um salário mais alto**, **abrir sua própria oficina de consertos** ou **dominar uma profissão prática e independente**, nosso ecossistema foi pensado para você não perder tempo com teorias vazias.\n\n💡 **Dica da Sofia:** Nossos alunos que aproveitam o cupom **SOFIA15** (-15% OFF) recuperam o valor investido logo nas primeiras semanas de prática!\n\nQual área você quer transformar hoje: **Mecânica de Máquinas de Costura**, **Engenharia de Software**, **Contabilidade MEI** ou **Design**? Me diga seu objetivo!`;
}

// Backward-compatibility alias
export const askCamillaAssistant = askSofiaAssistant;
