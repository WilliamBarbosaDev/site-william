// Knowledge base for William Barbosa's AI Strategic Diagnostic Agent

export interface AiServiceSolution {
  id: string;
  name: string;
  category: "IA & Sistemas" | "Web & Presença" | "Operação & Processos" | "Personalizado";
  shortDescription: string;
  detailedBenefit: string;
  expectedImpact: string;
  isCustomOnly?: boolean;
}

export const AI_SERVICES_CATALOG: AiServiceSolution[] = [
  {
    id: "crm-ia",
    name: "Sistema de CRM Personalizado com IA Integrada",
    category: "IA & Sistemas",
    shortDescription: "Centralização de leads, funil de vendas e histórico de atendimento com insights inteligentes.",
    detailedBenefit: "Elimina a perda de oportunidades comerciais, distribui leads automaticamente e sugere as melhores abordagens de fechamento através de IA.",
    expectedImpact: "Aumento de até 40% na taxa de conversão e zero leads esquecidos no processo."
  },
  {
    id: "agendamento-ia",
    name: "Sistema de Agendamento Inteligente com IA",
    category: "IA & Sistemas",
    shortDescription: "Agendamentos automáticos com confirmação, reagendamento e sincronização com calendários.",
    detailedBenefit: "O cliente escolhe o melhor horário diretamente pelo WhatsApp ou web, a IA valida disponibilidade e envia lembretes para evitar no-show.",
    expectedImpact: "Redução drástica de ausências e economia de horas da equipe em troca de mensagens manuais."
  },
  {
    id: "sdr-ia",
    name: "Agente SDR IA e Follow-up de Atendimento",
    category: "IA & Sistemas",
    shortDescription: "Atendimento imediato 24/7 com qualificação ativa de oportunidades e nutrição de leads.",
    detailedBenefit: "A IA inicia a conversa em menos de 1 minuto, identifica o perfil do comprador, responde dúvidas do negócio e agenda a reunião com o vendedor.",
    expectedImpact: "Resposta instantânea para 100% dos contatos gerando mais reuniões comerciais qualificadas."
  },
  {
    id: "multicanal-ia",
    name: "Sistema de Gestão Multicanal (WhatsApp, Instagram e Messenger)",
    category: "IA & Sistemas",
    shortDescription: "Central única para múltiplos atendentes operando em um só número com automações.",
    detailedBenefit: "Organiza todo o fluxo de mensagens de redes sociais em uma fila estruturada, com relatórios de performance e supervisão em tempo real.",
    expectedImpact: "Centralização do atendimento, histórico seguro dos clientes e controle da operação."
  },
  {
    id: "financeiro-ia",
    name: "Sistema Financeiro Empresarial com IA Integrada",
    category: "IA & Sistemas",
    shortDescription: "Controle de receitas, despesas, fluxo de caixa e relatórios preditivos inteligentes.",
    detailedBenefit: "Visualização clara da saúde financeira da empresa, alertas de vencimentos e projeções geradas por inteligência artificial.",
    expectedImpact: "Previsibilidade orçamentária e decisões de negócios baseadas em dados concretos."
  },
  {
    id: "central-tarefas-ia",
    name: "Central de Tarefas e Gestão de Fluxos com IA",
    category: "Operação & Processos",
    shortDescription: "Gerenciamento automatizado de fluxos de trabalho e distribuição de demandas operacionais.",
    detailedBenefit: "Integra diferentes ferramentas da empresa, automatiza a passagem de bastão entre setores e monitora prazos de execução.",
    expectedImpact: "Eliminação de gargalos internos e ganho substancial de produtividade na equipe."
  },
  {
    id: "site-institucional",
    name: "Site Institucional de Alta Autoridade",
    category: "Web & Presença",
    shortDescription: "Posicionamento digital de excelência focado em credibilidade, segurança e transmissão de valor.",
    detailedBenefit: "Projetado com base em princípios editoriais modernos, velocidade extrema e clareza de mensagem para negócios consolidados.",
    expectedImpact: "Elevação imediata do valor percebido da empresa e segurança total para clientes exigentes."
  },
  {
    id: "landing-page",
    name: "Landing Page Estratégica de Alta Conversão",
    category: "Web & Presença",
    shortDescription: "Estrutura focada exclusivamente em transformar visitantes e anúncios em clientes pagantes.",
    detailedBenefit: "Copywriting persuasivo, arquitetura de informação cirúrgica e design minimalista sem atritos para captação de leads ou vendas.",
    expectedImpact: "Redução do custo por lead (CPL) e maximização do retorno sobre investimento em anúncios."
  },
  {
    id: "sistema-personalizado",
    name: "Desenvolvimento de Sistema Sob Medida & Consultoria Estratégica",
    category: "Personalizado",
    shortDescription: "Arquitetura customizada para regras específicas de negócio, integrações complexas e IA dedicada.",
    detailedBenefit: "Construído do zero para resolver exatamente a dinâmica única da sua organização, integrando seus sistemas legados ou ERPs.",
    expectedImpact: "Diferenciação competitiva absoluta e controle total sobre a tecnologia da sua empresa.",
    isCustomOnly: true
  }
];

export interface DiagnosticQuestion {
  id: number;
  question: string;
  explanation: string;
  field: "segment" | "challenge" | "currentProcess" | "goal" | "contact";
  options: { label: string; value: string; hint?: string }[];
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: "Qual é o segmento de atuação ou modelo de negócio da sua empresa?",
    explanation: "Isso ajuda a entender a dinâmica de compra dos seus clientes e o tipo de contato que funciona melhor.",
    field: "segment",
    options: [
      { label: "Serviços & Consultoria", value: "servicos_consultoria", hint: "Venda consultiva e contratos" },
      { label: "Clínica Médica / Saúde", value: "saude_clinica", hint: "Agendamentos e captação de pacientes" },
      { label: "Escritório Jurídico / Contábil", value: "juridico_contabil", hint: "Autoridade técnica e segurança" },
      { label: "Empresa B2B / Indústria", value: "b2b_industria", hint: "Ciclo de vendas longo e orçamentos" },
      { label: "Comércio / E-commerce", value: "comercio_varejo", hint: "Vendas diretas e atendimento ágil" },
      { label: "Educação / Infoproduto", value: "educacao_cursos", hint: "Lançamentos e alunos" },
      { label: "Outro segmento específico", value: "outro_segmento", hint: "Modelo customizado" }
    ]
  },
  {
    id: 2,
    question: "Qual é o principal desafio ou gargalo que sua empresa enfrenta hoje?",
    explanation: "Identificar a dor central é o primeiro passo para não desperdiçar recursos em ferramentas erradas.",
    field: "challenge",
    options: [
      { label: "Perdemos tempo com tarefas manuais e repetitivas", value: "tarefas_manuais", hint: "Gargalo de tempo da equipe" },
      { label: "Falta de autoridade e presença digital fraca", value: "baixa_autoridade", hint: "Site atual desatualizado ou inexistente" },
      { label: "Atendimento no WhatsApp é lento e perdemos leads", value: "atendimento_lento", hint: "Demora para responder e qualificar" },
      { label: "Precisamos de uma página de alta conversão para anúncios", value: "precisa_conversao", hint: "Campanhas rodando sem o retorno ideal" },
      { label: "Controle financeiro ou operacional desorganizado", value: "operacao_financeiro", hint: "Falta visão clara dos números" },
      { label: "Temos uma necessidade personalizada / projeto sob medida", value: "demanda_customizada", hint: "Fluxo específico ou sistema exclusivo" }
    ]
  },
  {
    id: 3,
    question: "O que a sua empresa utiliza hoje para gerenciar esse cenário?",
    explanation: "Compreender as ferramentas atuais ajuda a planejar a transição sem impacto na operação.",
    field: "currentProcess",
    options: [
      { label: "Processos manuais, cadernos ou planilhas", value: "planilhas_manuais" },
      { label: "WhatsApp comercial comum no aparelho da empresa", value: "whatsapp_padrao" },
      { label: "Site antigo ou páginas prontas que não geram negócios", value: "site_antigo" },
      { label: "Ferramentas prontas que não atendem nossa regra de negócio", value: "software_limitado" },
      { label: "Ainda não estruturamos uma solução definitiva", value: "sem_estrutura" }
    ]
  },
  {
    id: 4,
    question: "Qual é o objetivo principal que você quer alcançar a curto e médio prazo?",
    explanation: "Definir o resultado esperado nos dá a métrica clara de sucesso do projeto.",
    field: "goal",
    options: [
      { label: "Automatizar o atendimento e qualificar clientes 24/7 com IA", value: "automacao_ia" },
      { label: "Construir um site institucional de alta autoridade e credibilidade", value: "site_autoridade" },
      { label: "Colocar no ar uma landing page focada em conversão e vendas", value: "landing_vendas" },
      { label: "Criar um sistema interno de gestão (CRM / Tarefas / Financeiro)", value: "sistema_gestao" },
      { label: "Desenvolver uma solução 100% personalizada e agendar reunião com o William", value: "reuniao_especialista" }
    ]
  }
];

export interface DiagnosticResult {
  clientName: string;
  companyName: string;
  phone: string;
  email?: string;
  recommendedSolution: AiServiceSolution;
  alternativeSolution?: AiServiceSolution;
  isCustomNeed: boolean;
  diagnosticSummary: string;
  actionRecommendation: string;
  whatsappMessage: string;
}

export function generateDiagnostic(answers: {
  segment: string;
  challenge: string;
  currentProcess: string;
  goal: string;
  clientName: string;
  companyName: string;
  phone: string;
  email?: string;
}): DiagnosticResult {
  const isCustomNeed =
    answers.challenge === "demanda_customizada" ||
    answers.goal === "reuniao_especialista" ||
    answers.segment === "outro_segmento";

  let recommendedId = "site-institucional";
  let alternativeId = "crm-ia";

  if (isCustomNeed) {
    recommendedId = "sistema-personalizado";
    alternativeId = "crm-ia";
  } else if (answers.challenge === "atendimento_lento" || answers.goal === "automacao_ia") {
    recommendedId = "sdr-ia";
    alternativeId = "multicanal-ia";
  } else if (answers.challenge === "tarefas_manuais") {
    recommendedId = "central-tarefas-ia";
    alternativeId = "agendamento-ia";
  } else if (answers.challenge === "precisa_conversao" || answers.goal === "landing_vendas") {
    recommendedId = "landing-page";
    alternativeId = "sdr-ia";
  } else if (answers.challenge === "operacao_financeiro" || answers.goal === "sistema_gestao") {
    recommendedId = "crm-ia";
    alternativeId = "financeiro-ia";
  } else {
    recommendedId = "site-institucional";
    alternativeId = "landing-page";
  }

  const recommendedSolution =
    AI_SERVICES_CATALOG.find((s) => s.id === recommendedId) ||
    AI_SERVICES_CATALOG[0];
  const alternativeSolution = AI_SERVICES_CATALOG.find(
    (s) => s.id === alternativeId
  );

  let diagnosticSummary = "";
  let actionRecommendation = "";

  if (isCustomNeed) {
    diagnosticSummary = `A partir das informações analisadas, sua empresa (${answers.companyName || "sua organização"}) possui regras de negócio específicas e fluxos que exigem uma arquitetura personalizada, indo além de plataformas de prateleira genéricas.`;
    actionRecommendation = `O caso requer um alinhamento aprofundado diretamente com o nosso especialista William Barbosa. Vamos agendar uma reunião de diagnóstico técnico para desenhar o escopo da solução sob medida para sua operação.`;
  } else {
    diagnosticSummary = `Identificamos que o principal gargalo atual na sua operação é a fricção no fluxo de trabalho e perda de eficiência. A solução com maior retorno sobre investimento para o seu cenário é a implementação de um ${recommendedSolution.name}.`;
    actionRecommendation = `Essa solução resolve diretamente o desafio apontado, eliminando tarefas manuais e proporcionando ${recommendedSolution.expectedImpact.toLowerCase()}`;
  }

  const segmentLabels: Record<string, string> = {
    servicos_consultoria: "Serviços & Consultoria",
    saude_clinica: "Clínica / Saúde",
    juridico_contabil: "Jurídico / Contábil",
    b2b_industria: "B2B / Indústria",
    comercio_varejo: "Comércio / Varejo",
    educacao_cursos: "Educação / Infoprodutos",
    outro_segmento: "Segmento Específico",
  };

  const challengeLabels: Record<string, string> = {
    tarefas_manuais: "Perda de tempo com tarefas manuais",
    baixa_autoridade: "Falta de autoridade e presença digital",
    atendimento_lento: "Atendimento no WhatsApp lento / perda de leads",
    precisa_conversao: "Necessidade de landing page de alta conversão",
    operacao_financeiro: "Controle financeiro ou operacional desorganizado",
    demanda_customizada: "Necessidade personalizada / projeto sob medida",
  };

  const formattedSegment = segmentLabels[answers.segment] || answers.segment;
  const formattedChallenge = challengeLabels[answers.challenge] || answers.challenge;

  const whatsappMessage = `Olá William! Acabei de realizar o Diagnóstico Estratégico com seu Agente de IA no site:

👤 Nome: ${answers.clientName}
🏢 Empresa: ${answers.companyName || "Não informada"}
📱 WhatsApp: ${answers.phone}
${answers.email ? `✉️ E-mail: ${answers.email}\n` : ""}
📊 Segmento: ${formattedSegment}
⚠️ Desafio Central: ${formattedChallenge}

💡 Solução Recomendada pela IA:
*${recommendedSolution.name}*
${isCustomNeed ? "👉 Demanda sob medida: Gostaria de agendar uma reunião estratégica com você para desenharmos o projeto." : "👉 Gostaria de entender os próximos passos para implementarmos essa solução no meu negócio."}`;

  return {
    clientName: answers.clientName,
    companyName: answers.companyName,
    phone: answers.phone,
    email: answers.email,
    recommendedSolution,
    alternativeSolution,
    isCustomNeed,
    diagnosticSummary,
    actionRecommendation,
    whatsappMessage,
  };
}
