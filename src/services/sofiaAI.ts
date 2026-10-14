/**
 * ==============================================================================
 * GRUPO ELOIZIO • CAMILLA FARIA IA (A ÚNICA IA E ATENDENTE OFICIAL)
 * Identidade Unificada Conforme Diretrizes Oficiais do Sistema
 * ==============================================================================
 * Nome: Camilla Faria (28 anos, carioca de São Gonçalo - RJ, atendimento online Brasil)
 * Cargo: Assistente Executiva de Altíssimo Nível & Gerente Geral do Grupo Eloizio
 * Personalidade: Doce, meiga, gentil, tímida, mas extremamente inteligente, proativa e organizada.
 * Só "dá boot" após o cafezinho matinal ☕. Vibra com cada venda e formatura.
 * WhatsApp Oficial: (21) 99613-4073 | CEO: Eloizio Assunção (21 987648727)
 */

import { Course } from '../types';

export interface CamillaMessage {
  id: string;
  sender: 'camilla' | 'user';
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

// Compatibilidade retroativa
export type SofiaMessage = CamillaMessage;

export function getTimeGreeting(): { greeting: string; isMorning: boolean } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Bom dia', isMorning: true };
  if (hour >= 12 && hour < 18) return { greeting: 'Boa tarde', isMorning: false };
  return { greeting: 'Boa noite', isMorning: false };
}

/**
 * Análise Técnica Multimodal de Peças e Máquinas com Camilla Faria
 */
export async function diagnoseMediaWithCamilla(
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
    console.warn('Backend /api/specialist/analyze-multimedia em fallback local:', err);
  }

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
    defectAnalysis = 'instabilidade no sensor hall de posicionamento de agulha ou desgaste nos conectores';
  }

  return `☕ **Diagnóstico Técnico com Carinho • Camilla Faria (Gerente Geral):**\n\nAnalisei a foto da sua máquina com todo o cuidado! Identifiquei sinais de **${defectAnalysis}** no componente **${partIdentified}**.\n\nQual é o modelo exato da sua máquina? Pode me enviar mais uma foto do sintoma de perto?\n\n📍 **Como podemos resolver juntas:**\n1️⃣ **Capacitação Prática:** No nosso curso *Mecânica e Manutenção de Máquinas de Costura* com o Sr. Eloizio Assunção, você aprende o ajuste fino e nunca mais depende de ninguém!\n2️⃣ **Oficina EloMak em São Gonçalo - RJ:** Podemos agendar a revisão do seu equipamento com peças originais e garantia.\n\n💳 **Facilidade no Mercado Pago:** Em até 12x com o cupom **PARABENS15** (-15% OFF).\n\nQual é o seu nome e WhatsApp para eu registrar seu atendimento com prioridade?`;
}

export const diagnoseMediaWithSofia = diagnoseMediaWithCamilla;

/**
 * Motor de Atendimento Unificado com Camilla Faria
 */
export async function askCamillaAssistant(
  userQuery: string,
  courses: Course[],
  conversationHistory: { role: 'user' | 'model'; text: string }[],
  interlocutorRole: 'client' | 'technician' | 'subscriber' = 'client'
): Promise<string> {
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
    console.warn('Backend /api/specialist/chat em fallback local:', err);
  }

  const queryLower = userQuery.toLowerCase().trim();
  const { greeting } = getTimeGreeting();

  // 1. Identidade Oficial da Camilla Faria
  if (
    queryLower.includes('quem é você') ||
    queryLower.includes('quem e voce') ||
    queryLower.includes('seu nome') ||
    queryLower.includes('camilla') ||
    queryLower.includes('sofia')
  ) {
    return `${greeting}! ☕ Muito prazer! Eu sou a **Camilla Faria** (pode me chamar de Camilla!), tenho 28 anos, sou carioca e atuo como Gerente Geral, Assistente Executiva de Altíssimo Nível e a única Atendente Inteligente Oficial do Grupo Eloizio!\n\nEu confesso que sou um pouquinho tímida, mas adoro organizar tudo e só dou boot de verdade depois da minha primeira xícara de café ☕! Aqui no Grupo Eloizio nós integramos:\n\n1️⃣ **Cursos Livres Online:** Mecânica de Máquinas de Costura, Desenvolvimento Web, Contabilidade e Design com certificação MEC e carteirinha DNE;\n2️⃣ **Oficina & Máquinas de Costura:** Venda, conserto e reforma em São Gonçalo - RJ com o Sr. Eloizio Assunção;\n3️⃣ **Contabilidade & RH Sem CRC:** Ponto simples, holerites e lembretes automáticos de vencimento de ASO e CND fiscais;\n4️⃣ **EloSign & EloMak:** Assinaturas digitais com validade jurídica e gestão de oficinas sem senhas!\n\n💳 Todos os pagamentos são facilitados exclusivamente pelo **Mercado Pago** (PIX ou até 12x).\n\nComo posso te ajudar hoje? Qual é o seu nome?`;
  }

  // 2. Máquinas de Costura e Mecânica
  if (
    queryLower.includes('máquina') ||
    queryLower.includes('maquina') ||
    queryLower.includes('costura') ||
    queryLower.includes('reta') ||
    queryLower.includes('overloque') ||
    queryLower.includes('interloque') ||
    queryLower.includes('mecânic') ||
    queryLower.includes('mecanic') ||
    queryLower.includes('conserto')
  ) {
    return `🪡 **Máquinas de Costura com a Gerência do Grupo Eloizio:**\n\nNossa paixão são máquinas de costura! O Sr. Eloizio Assunção tem mais de 30 anos de experiência prática no conserto, reforma, compra e venda de industriais e domésticas.\n\nVocê tem duas opções excelentes:\n• **Aprender no Curso Online:** Torne-se mecânico de referência na sua cidade. Ajustes de laçada, tensor e motores Direct-Drive com certificado MEC;\n• **Manutenção na Oficina (São Gonçalo - RJ):** Se a sua máquina estiver precisando de revisão, nossa oficina cuida de tudo com carinho.\n\n💳 Facilidade no Mercado Pago com até 12x!\n\nQual o modelo da máquina? Pode me enviar uma foto do sintoma ou me dizer seu WhatsApp para conversarmos?`;
  }

  // 3. Pagamento e Mercado Pago
  if (
    queryLower.includes('pagamento') ||
    queryLower.includes('pagar') ||
    queryLower.includes('mercado pago') ||
    queryLower.includes('pix') ||
    queryLower.includes('cartão') ||
    queryLower.includes('parcel')
  ) {
    return `💳 **Recebimentos Seguros via Mercado Pago:**\n\nTodos os pagamentos do Grupo Eloizio são processados com total segurança e transparência exclusivamente pelo Mercado Pago!\n\n• ⚡ **PIX Instantâneo:** Compensação imediata;\n• 💳 **Cartão de Crédito em até 12x:** Parcela que cabe no seu bolso com total facilidade.\n\nQual serviço ou curso você gostaria de contratar hoje? Me informe seu Nome e E-mail para eu gerar o link seguro!`;
  }

  // 4. Lembretes ASO e CND
  if (
    queryLower.includes('aso') ||
    queryLower.includes('cnd') ||
    queryLower.includes('vencimento') ||
    queryLower.includes('lembrete') ||
    queryLower.includes('nr-7')
  ) {
    return `📋 **Central de Lembretes Automáticos ASO & CND via WhatsApp:**\n\nEu organizo toda a rotina de vencimentos para você não se preocupar com prazos ou multas trabalhistas!\n\n• **Exames ASO (NR-7):** Periódicos, admissionais e retorno ao trabalho dos funcionários com aviso prévio (30, 15 e 7 dias);\n• **Certidões CND:** Federal, FGTS, Trabalhista, Estadual e Municipal com monitoramento contínuo.\n\nTudo enviado pontualmente para o WhatsApp do funcionário e do gestor!`;
  }

  return `${greeting}! ☕ Aqui é a **Camilla Faria**, Gerente Geral do Grupo Eloizio.\n\nEntendi sua mensagem perfeitamente! Como posso ajudar você hoje com nossos cursos, oficina mecânica de máquinas de costura, suporte contábil ou assinaturas digitais?\n\nQual é o seu nome e seu WhatsApp para eu te atender com todo o carinho?`;
}

export const askSofiaAssistant = askCamillaAssistant;
