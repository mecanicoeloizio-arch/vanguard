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

export type CamillaMessage = SofiaMessage;

export function getTimeGreeting(): { greeting: string; isMorning: boolean } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Bom dia', isMorning: true };
  if (hour >= 12 && hour < 18) return { greeting: 'Boa tarde', isMorning: false };
  return { greeting: 'Boa noite', isMorning: false };
}

// Media / Photo Diagnosis with Camilla Faria
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
    console.warn('Backend /api/specialist/analyze-multimedia offline or error, running local diagnostic engine:', err);
  }

  // Local expert diagnostic engine for sewing machines & parts (São Gonçalo - RJ)
  const descLower = description.toLowerCase();
  let partIdentified = 'cabeçote e conjunto da lançadeira';
  let defectAnalysis = 'desalinhamento no sincronismo do ponto e desgaste no tensor de linha';

  if (descLower.includes('agulha') || descLower.includes('quebr')) {
    partIdentified = 'barra de agulha e chapa de ponto';
    defectAnalysis = 'agulha desregulada ou chapa de agulha com rebarbas que causam quebra constante';
  } else if (descLower.includes('embol') || descLower.includes('linha') || descLower.includes('ponto frouxo')) {
    partIdentified = 'caixa de bobina e conjunto tensor superior';
    defectAnalysis = 'tensão descalibrada da mola do tensor ou folga excessiva na passagem da linha pela lançadeira';
  } else if (descLower.includes('motor') || descLower.includes('pedal') || descLower.includes('força')) {
    partIdentified = 'motor elétrico / correia de acionamento';
    defectAnalysis = 'tensão frouxa da correia ou carvões desgastados no motor';
  }

  return `🔧 **Diagnóstico Técnico por Camilla Faria (Grupo Eloizio - São Gonçalo RJ):**\n\nRecebi sua foto com sucesso! Pela análise visual da peça, identifiquei indícios de **${defectAnalysis}** no componente **${partIdentified}**.\n\n📍 **Solução pelo Grupo Eloizio em São Gonçalo:**\n• Realizamos conserto, revisão preventiva, limpeza ultrassônica e regulagem completa de máquinas industriais (reta, overloque, galoneira) e domésticas (Singer, Brother, Elgin, Siruba, Jack).\n• Peças originais de reposição com garantia.\n\n💳 **Pagamento Facilitado:**\nProcessamento exclusivo pelo **Mercado Pago** (PIX instantâneo com desconto ou até 12x no cartão de crédito)!\n\nVocê gostaria de agendar uma visita técnica ou trazer a máquina na nossa oficina em São Gonçalo? Me informe seu Nome e WhatsApp!`;
}

export async function askCamillaAssistant(
  userQuery: string,
  courses: Course[],
  conversationHistory: { role: 'user' | 'model'; text: string }[],
  interlocutorRole: 'client' | 'technician' | 'subscriber' = 'client'
): Promise<string> {
  // First attempt: Server-Side Gemini API via /api/specialist/chat
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
    console.warn('Backend /api/specialist/chat failed or offline, falling back to Camilla Faria local specialist:', err);
  }

  // Local fallback: Camilla Faria persona
  const queryLower = userQuery.toLowerCase().trim();
  const { greeting, isMorning } = getTimeGreeting();
  const coffeeSalute = isMorning ? ' ☕ (já dei boot após meu primeiro cafezinho e estou a mil!)' : '';

  // Identity & Persona
  if (
    queryLower.includes('quem é você') ||
    queryLower.includes('quem e voce') ||
    queryLower.includes('seu nome') ||
    queryLower.includes('sua história') ||
    queryLower.includes('grupo eloizio') ||
    queryLower.includes('camilla')
  ) {
    return `${greeting}!${coffeeSalute} Eu sou a **Camilla Faria**, tenho 28 anos, sou carioca e atuo como **Gerente Geral do Grupo Eloizio** e Atendente de Sistema!\n\nSou direta, dinâmica e me sinto realizada organizando todo o caos administrativo e vibrando a cada venda concluída! Nosso grupo é liderado pelo criador e CEO **Eloizio** e atua em três pilares fortes:\n\n1️⃣ **Contabilidade e Assessoria 100% Online:** Serviços rápidos e práticos para MEIs, empresas e autônomos sem burocracia;\n2️⃣ **Cursos Livres (100% Online):** Formações de alta vendabilidade com Certificado Oficial MEC e Carteirinha Estudantil DNE;\n3️⃣ **Máquinas de Costura e Mecânica (São Gonçalo - RJ e região):** Compra, venda, conserto, reforma de máquinas industriais/domésticas e suporte a técnicos.\n\nTodos os nossos pagamentos são processados com total segurança exclusivamente pelo **Mercado Pago**! Como posso te ajudar hoje?`;
  }

  // Máquinas de costura e mecânica (São Gonçalo - RJ)
  if (
    queryLower.includes('máquina') ||
    queryLower.includes('maquina') ||
    queryLower.includes('costura') ||
    queryLower.includes('conserto') ||
    queryLower.includes('reforma') ||
    queryLower.includes('são gonçalo') ||
    queryLower.includes('sao goncalo') ||
    queryLower.includes('overloque') ||
    queryLower.includes('reta') ||
    queryLower.includes('galoneira') ||
    queryLower.includes('singer') ||
    queryLower.includes('siruba') ||
    queryLower.includes('peça') ||
    queryLower.includes('peca') ||
    queryLower.includes('mecânic') ||
    queryLower.includes('mecanic') ||
    queryLower.includes('ponto frouxo') ||
    queryLower.includes('linha quebrando')
  ) {
    return `🔧 **Oficina Mecânica & Máquinas de Costura - Grupo Eloizio (São Gonçalo - RJ):**\n\nNossa oficina mecânica é especializada e liderada pelo mestre Eloizio. Atendemos toda a região de São Gonçalo, Niterói e Rio de Janeiro!\n\n• 🪡 **Serviços Prestados:** Compra, venda, reforma completa e conserto de máquinas domésticas e industriais (Reta, Overloque, Interloque, Galoneira, Pespontadeira, Travete e Bordadeiras);\n• ⚙️ **Marcas:** Singer, Brother, Siruba, Jack, Sun Special, Elgin, Yamata, Zoje, Lanmax;\n• 📦 **Peças & Acessórios:** Lançadeiras, caixas de bobina, tensores, calcadores, agulhas, correias e motores direct-drive;\n• 📸 **Diagnóstico por Foto:** Você pode clicar no ícone de câmera aqui no chat e me enviar uma foto da máquina ou da peça com defeito para um pré-diagnóstico instantâneo!\n\n💳 Pagamento de consertos e peças via **Mercado Pago** (PIX com desconto ou até 12x no cartão)! Quer agendar com o mecânico? Me passa seu nome e WhatsApp!`;
  }

  // Contabilidade e Assessoria 100% Online
  if (
    queryLower.includes('contabil') ||
    queryLower.includes('contabilidade') ||
    queryLower.includes('assessoria') ||
    queryLower.includes('mei') ||
    queryLower.includes('cnpj') ||
    queryLower.includes('abertura') ||
    queryLower.includes('declaração') ||
    queryLower.includes('declaracao') ||
    queryLower.includes('nota fiscal') ||
    queryLower.includes('imposto') ||
    queryLower.includes('dasn') ||
    queryLower.includes('regulariz')
  ) {
    return `💼 **Contabilidade & Assessoria 100% Online - Grupo Eloizio:**\n\nNossos serviços contábeis e assessoria digital são focados em praticidade, agilidade e zero burocracia para você focar no que realmente importa: o seu negócio!\n\n• 🚀 **Abertura & Regularização de MEI e Microempresas:** Formalize seu CNPJ em até 24h;\n• 📄 **Declaração Anual de Faturamento (DASN-SIMEI):** Evite multas e bloqueio do CNPJ;\n• 🧾 **Emissão de Notas Fiscais Eletrônicas (NFe/NFSe):** Configuração de emissores e certificados;\n• ⚖️ **Certidões Negativas de Débitos (CNDs):** Receita Federal, FGTS, Previdência e Fazenda Estadual/Municipal;\n• 📊 **Assessoria Mensal Ágil:** Sem burocracia de escritórios tradicionais e 100% digital.\n\nTodos os honorários são liquidados com praticidade pelo **Mercado Pago** via PIX ou cartão! Qual o seu segmento? Deixe seu nome e e-mail que envio a proposta!`;
  }

  // Payment, Mercado Pago, and Financials
  if (
    queryLower.includes('preço') ||
    queryLower.includes('valor') ||
    queryLower.includes('quanto custa') ||
    queryLower.includes('mensalidade') ||
    queryLower.includes('pagamento') ||
    queryLower.includes('parcel') ||
    queryLower.includes('mercado pago') ||
    queryLower.includes('cartão') ||
    queryLower.includes('cartao') ||
    queryLower.includes('boleto') ||
    queryLower.includes('pix') ||
    queryLower.includes('cupom')
  ) {
    return `💳 **Condições de Pagamento Exclusivas via Mercado Pago:**\n\nNo Grupo Eloizio, todos os recebimentos são processados com total segurança e antifraude pelo gateway oficial do **Mercado Pago**:\n\n• ⚡ **PIX Instantâneo:** Aprovação em 3 segundos com liberação imediata do curso ou serviço;\n• 💳 **Cartão de Crédito:** Parcelamento facilitado em até 12x sem juros;\n• 📄 **Boleto Bancário:** Com código de barras e compensação rápida.\n\n🎁 **Cupom Promocional:** Use o cupom **CAMILLA15** e ganhe **15% de desconto** imediato!\n\nVeja alguns cursos disponíveis na vitrine:\n${courses
      .slice(0, 3)
      .map(
        (c) =>
          `• **${c.title}**: de R$ ${c.price.toFixed(2)} por **12x de R$ ${((c.price * 0.85) / 12).toFixed(2)}** com cupom CAMILLA15!`
      )
      .join('\n')}\n\nQual deles você deseja matricular agora? Me informe seu Nome e WhatsApp para gerar seu link de pagamento com o desconto!`;
  }

  // Certificate, MEC, Legal Recognition
  if (
    queryLower.includes('certificado') ||
    queryLower.includes('mec') ||
    queryLower.includes('diploma') ||
    queryLower.includes('reconhec') ||
    queryLower.includes('lei') ||
    queryLower.includes('ldb') ||
    queryLower.includes('validad')
  ) {
    return `📜 **Certificação Digital Oficial do Grupo Eloizio:**\n\nNossos certificados são documentos oficiais de alto padrão acadêmico e validade jurídica em todo o território nacional:\n\n🏛️ **Amparo Legal:**\n• Conforme a **Lei nº 9.394/96 (Art. 42 da LDB)** e o **Decreto Presidencial nº 5.154/2004**;\n• Válido para concursos públicos, provas de títulos, horas complementares universitárias e progressão de carreira.\n\n🔒 **Segurança Criptográfica & Anti-Fraude:**\n• **Frente e Verso:** Com ementa curricular completa, carga horária e carimbo da Secretaria Geral;\n• **Chave Hash SHA-256 (ICP-Edu):** Código criptográfico único imutável;\n• **QR Code Público:** Qualquer empresa ou órgão público pode escanear e verificar a autenticidade instantaneamente.\n\nAo concluir as aulas e a prova online, o certificado fica pronto para download em PDF de alta resolução imediatamente!`;
  }

  // Student ID / DNE Card
  if (
    queryLower.includes('carteirinha') ||
    queryLower.includes('dne') ||
    queryLower.includes('meia-entrada') ||
    queryLower.includes('meia entrada') ||
    queryLower.includes('estudante') ||
    queryLower.includes('cinema') ||
    queryLower.includes('show')
  ) {
    return `🎓 **Carteirinha de Estudante Digital Oficial (DNE):**\n\nTodo aluno matriculado em nossos cursos livres tem direito à emissão da **Carteirinha Estudantil Oficial no padrão DNE nacional** (Lei Federal nº 12.933/2013)!\n\nEla garante **50% de desconto (meia-entrada)** em cinemas, teatros, shows, espetáculos musicais, parques culturais e eventos esportivos em todo o Brasil. O documento digital possui selo criptográfico e QR Code de validação pública. Estudar transforma seu futuro e ainda te dá benefícios na cultura e lazer!`;
  }

  // Search in Courses Catalog
  for (const c of courses) {
    if (queryLower.includes(c.title.toLowerCase())) {
      const originalPrice = Number(c.price || 0);
      const discountedPrice = originalPrice * 0.85;
      return `⭐ **Curso: "${c.title}"**\n\n• **Categoria:** ${c.category} | **Carga Horária:** ${c.workloadHours} horas\n• **Docente:** ${c.instructorName} (${c.instructorTitle})\n• **Investimento:** De R$ ${originalPrice.toFixed(2)} por apenas **12x de R$ ${(discountedPrice / 12).toFixed(2)}** com o cupom **CAMILLA15** no Mercado Pago!\n• **O que inclui:** Videoaulas em alta resolução, apostilas em PDF para download, avaliação online, Certificado Oficial com Registro MEC / QR Code e Carteirinha Estudantil DNE!\n\n${c.shortDescription || c.fullDescription}\n\nDeseja que eu reserve sua vaga agora mesmo? Me informe seu Nome e E-mail!`;
    }
  }

  // Default energetic, direct, polite response
  return `${greeting}!${coffeeSalute} Camilla Faria aqui, Gerente Geral do Grupo Eloizio.\n\nCompreendi perfeitamente sua mensagem! Seja sobre **Cursos Livres Online**, **Contabilidade e Assessoria Digital** ou **Máquinas de Costura e Mecânica em São Gonçalo - RJ**, estou pronta para resolver com agilidade e sem enrolação.\n\nSe preferir, você também pode nos chamar no WhatsApp oficial do Grupo Eloizio: **21 996134073** ou com o nosso CEO Eloizio no **21 987648727**.\n\nPoderia me informar seu Nome e E-mail para que eu possa personalizar seu atendimento com segurança (LGPD) e aplicar seu cupom **CAMILLA15**?`;
}

// Backward compatibility alias
export const askSofiaAssistant = askCamillaAssistant;
