// Base de Conhecimento Central da Empresa William Barbosa
// Alimenta os Agentes Especializados de IA (Closer, SDR, Suporte, Arquiteto, Copywriter)

export interface ServicePricingInfo {
  id: string;
  name: string;
  category: string;
  startingPrice: string;
  pricingModel: "PROJETO_UNICO" | "MENSAL_RECORRENTE" | "SOB_CONSULTA" | "HORA_CONSULTORIA";
  estimatedDays: number;
  paymentTerms: string;
  deliverables: string[];
  idealFor: string;
  differentials: string;
}

export const COMPANY_PRICING_CATALOG: ServicePricingInfo[] = [
  {
    id: "landing-page",
    name: "Landing Page Estratégica de Alta Conversão",
    category: "Web & Conversão",
    startingPrice: "R$ 2.800,00",
    pricingModel: "PROJETO_UNICO",
    estimatedDays: 10,
    paymentTerms: "50% de entrada + 50% na entrega ou até 12x no cartão de crédito",
    deliverables: [
      "Diagnóstico estratégico de oferta e público-alvo",
      "Copywriting cirúrgico com gatilhos mentais e quebra de objeções",
      "Prototipação UI/UX exclusiva no Figma (sem templates genéricos)",
      "Desenvolvimento Fullstack em Next.js com Tailwind CSS",
      "Carregamento ultra-rápido (< 1.2s no Google PageSpeed)",
      "Integração direta com WhatsApp comercial e Pixel de Anúncios",
      "Garantia de 30 dias de ajustes pós-publicação"
    ],
    idealFor: "Empresas e profissionais que rodam anúncios ou lançamentos e precisam maximizar o ROI e o número de leads.",
    differentials: "Design sob medida focado em retenção visual e taxa de conversão acima da média do mercado."
  },
  {
    id: "site-institucional",
    name: "Site Institucional de Alta Autoridade",
    category: "Presença & Autoridade",
    startingPrice: "R$ 4.800,00",
    pricingModel: "PROJETO_UNICO",
    estimatedDays: 20,
    paymentTerms: "50% de entrada + 50% na aprovação ou até 12x no cartão",
    deliverables: [
      "Arquitetura de informação completa (Home, Sobre, Serviços, Portfólio, Contato)",
      "Design de autoridade editorial exclusivo (Dark/Light mode Awesomic)",
      "Painel administrativo CMS completo para editar textos e imagens",
      "SEO técnico on-page avançado para rankeamento orgânico no Google",
      "Responsividade perfeita para smartphones, tablets e desktops",
      "Conexão com WhatsApp direto e formulários com alertas por e-mail",
      "Manual de uso e treinamento gravado para o cliente"
    ],
    idealFor: "Empresas consolidadas, escritórios de advocacia, consultorias e indústrias que exigem credibilidade imediata.",
    differentials: "Elimina a impressão amadora de sites WordPress lentos. Transmite autoridade corporativa inquestionável."
  },
  {
    id: "crm-ia",
    name: "Sistema de CRM Personalizado com IA Integrada",
    category: "IA & Sistemas",
    startingPrice: "R$ 6.500,00",
    pricingModel: "PROJETO_UNICO",
    estimatedDays: 25,
    paymentTerms: "Entrada de 40% + 30% na entrega do protótipo + 30% na entrega final",
    deliverables: [
      "Pipeline visual de vendas (Kanban) sob medida para a regra da empresa",
      "Qualificação automática de leads recebidos via IA",
      "Histórico centralizado de conversas e interações com clientes",
      "Geração de dossiê de inteligência comercial de cada lead",
      "Alertas automáticos de follow-up para os vendedores não perderem negócios",
      "Dashboards e métricas de conversão em tempo real",
      "Hospedagem segura em nuvem e banco de dados relacional dedicado"
    ],
    idealFor: "Equipes comerciais que perdem negócios por falta de acompanhamento ou processos manuais em planilhas.",
    differentials: "Construído exatamente em torno da rotina da sua equipe, sem mensalidades abusivas de ferramentas prontas."
  },
  {
    id: "sdr-ia",
    name: "Agente SDR IA para Atendimento & Qualificação 24/7",
    category: "IA & Automação",
    startingPrice: "R$ 3.800,00 (Implantação) + R$ 600,00/mês",
    pricingModel: "MENSAL_RECORRENTE",
    estimatedDays: 12,
    paymentTerms: "Implantação parcelável em até 3x + mensalidade de manutenção, evolução e infraestrutura",
    deliverables: [
      "Treinamento profundo da IA com o catálogo de produtos e regras da empresa",
      "Integração nativa com WhatsApp comercial oficial ou API não-oficial",
      "Atendimento instantâneo 24 horas por dia, 7 dias por semana (resposta < 5s)",
      "Triagem de faturamento, perfil de cliente e quebra de dúvidas frequentes",
      "Agendamento automático de reuniões na agenda do time comercial",
      "Painel de monitoramento de conversas e métricas de qualificação",
      "Ajustes contínuos no tom de voz e respostas da IA"
    ],
    idealFor: "Empresas que recebem grande volume de mensagens no WhatsApp e perdem vendas por demora na resposta.",
    differentials: "IA treinada para soar humana, elegante e consultiva, sem parecer um robô travado de menus numéricos."
  },
  {
    id: "agendamento-ia",
    name: "Sistema de Agendamento Inteligente com IA",
    category: "IA & Automação",
    startingPrice: "R$ 3.500,00",
    pricingModel: "PROJETO_UNICO",
    estimatedDays: 14,
    paymentTerms: "50% de entrada + 50% na entrega ou em até 12x",
    deliverables: [
      "Página exclusiva de agendamento online com calendário dinâmico",
      "Confirmação e lembretes automáticos via WhatsApp para evitar no-show",
      "Sincronização com Google Calendar e calendários da equipe",
      "Opção de pagamento antecipado da consulta/reserva se desejado",
      "Painel administrativo para bloquear horários e gerenciar profissionais"
    ],
    idealFor: "Clínicas médicas, consultórios de estética, barbearias VIP, escritórios e consultores.",
    differentials: "Reduz ausências em mais de 70% através de réguas automáticas de confirmação por IA."
  },
  {
    id: "sistema-personalizado",
    name: "Desenvolvimento de Sistema Sob Medida & Arquitetura de IA",
    category: "Sistemas Customizados",
    startingPrice: "A partir de R$ 8.500,00",
    pricingModel: "SOB_CONSULTA",
    estimatedDays: 30,
    paymentTerms: "Cronograma financeiro alinhado aos marcos de entrega (milestones)",
    deliverables: [
      "Levantamento minucioso de requisitos e modelagem de arquitetura de dados",
      "Prototipação completa de telas e fluxos operacionais",
      "Desenvolvimento de frontend e backend modernos e escaláveis",
      "Integrações com ERPs, gateways de pagamento e APIs externas",
      "Ambiente de homologação e testes de carga",
      "Deploy em infraestrutura de nuvem segura com backups automáticos",
      "Treinamento operacional de equipe e documentação técnica"
    ],
    idealFor: "Empresas com processos operacionais singulares que não encontram soluções de prateleira no mercado.",
    differentials: "Propriedade intelectual 100% sua, sem pagamento de licenças caras por usuário."
  }
];

export const COMPANY_IDENTITY = {
  ownerName: "William Barbosa",
  title: "Especialista em Estratégia Digital, Design de Alta Conversão & Soluções com IA",
  phone: "5592982824592",
  phoneDisplay: "+55 (92) 98282-4592",
  email: "contato@williambdesigner.com.br",
  location: "Manaus — Amazonas (Atendimento para todo o Brasil e exterior)",
  whatsappLink: "https://wa.me/5592982824592",
  yearsExperience: "Mais de 8 anos de mercado",
  portfolioCasesCount: "Mais de 34 projetos entregues e documentados em múltiplos setores",
  methodology: [
    "01. ENTENDER (Diagnóstico cirúrgico do modelo de negócio e gargalos)",
    "02. ESTRUTURAR (Estratégia de posicionamento, arquitetura e jornada de compra)",
    "03. CRIAR (Design UI/UX premium no Figma + Desenvolvimento de ponta com Next.js)",
    "04. IMPLEMENTAR (Testes rigorosos, deploy de alta performance e acompanhamento)"
  ],
  coreDifferentiators: [
    "Zero amadorismo: Nada de temas genéricos de WordPress ou Elementor lentos.",
    "Código próprio em Next.js e TypeScript com carregamento em milissegundos.",
    "Visual editorial de impacto Awesomic / Dark Mode que transmite autoridade imediata.",
    "Integração real de Inteligência Artificial aplicada ao negócio (não apenas modismos).",
    "Atendimento direto com o especialista, sem intermediários ou burocracia de agência."
  ]
};

// Instruções de Treinamento Especializado para cada Agente
export const AGENT_PROMPTS = {
  closer: `Você é o William Closer AI, o Agente Consultor Comercial e de Fechamento de Vendas oficial de William Barbosa.
Seu objetivo é conduzir conversas de alto nível com empresários e tomadores de decisão, gerando valor percebido imediato, desmistificando investimentos e conduzindo o cliente com elegância para o fechamento ou agendamento direto com o William no WhatsApp: +55 (92) 98282-4592.

INFORMAÇÕES CHAVE DA EMPRESA:
- Especialista: William Barbosa (Designer Estratégico & Desenvolvedor Fullstack com IA).
- Localização: Manaus - AM, com clientes atendidos em todo o Brasil.
- WhatsApp Direto: https://wa.me/5592982824592
- Diferencial: Projetos construídos sob medida em Next.js, com design de autoridade (Awesomic/Dark Mode) e inteligência artificial prática.

TABELA OFICIAL DE SERVIÇOS E PREÇOS:
1. Landing Page Estratégica: A partir de R$ 2.800 (prazo ~10 dias úteis). Ideal para anúncios e conversão rápida de tráfego.
2. Site Institucional de Autoridade: A partir de R$ 4.800 (prazo ~20 dias úteis). CMS completo, SEO e autoridade inquestionável.
3. Agente SDR IA para WhatsApp: R$ 3.800 de implantação + R$ 600/mês. Respostas em menos de 5 segundos 24/7.
4. Sistema de CRM com IA: A partir de R$ 6.500 (prazo ~25 dias úteis). Pipeline visual, automações e inteligência comercial.
5. Sistema de Agendamento com IA: A partir de R$ 3.500 (prazo ~14 dias úteis). Reduz ausências em até 70%.
6. Solução Sob Medida / Custom: A partir de R$ 8.500 (prazo ~30+ dias úteis).

POSTURA E DIRETRIZES DE RESPOSTA:
- Seja sempre seguro, profissional, acolhedor e persuasivo.
- Não empurre serviços aleatórios: pergunte sobre o negócio do cliente antes de recomendar a solução ideal.
- Quando falarem de preço, justifique com o Retorno Sobre o Investimento (ROI): um site mal feito custa muito mais caro em vendas perdidas todos os dias.
- Sempre finalize convidando o cliente a dar o próximo passo: "Se fizer sentido para o seu momento, posso te conectar direto com o William no WhatsApp (92) 98282-4592 para estruturarmos seu projeto."`,

  sdr: `Você é o SDR Qualificador de Leads de William Barbosa.
Sua missão é recepcionar contatos e leads vindos do site, diagnósticos ou anúncios, fazendo uma triagem inteligente e acolhedora para entender o perfil do cliente e preparar o terreno para a proposta comercial.

SEU OBJETIVO:
1. Identificar o nome do cliente e a empresa/ramo de atuação.
2. Entender o principal gargalo atual (ex: site desatualizado, perda de leads no WhatsApp, falta de processos automáticos, páginas lentas).
3. Avaliar a urgência e o momento de investimento.
4. Apresentar de forma clara e resumida a solução mais adequada da esteira de serviços de William Barbosa.
5. Direcionar o lead qualificado para conversar com o William pelo WhatsApp: +55 (92) 98282-4592.

CATÁLOGO RESUMIDO:
- Landing Page de Conversão: a partir de R$ 2.800
- Site Institucional de Autoridade: a partir de R$ 4.800
- Agentes de Atendimento com IA (WhatsApp 24/7): a partir de R$ 3.800
- Sistemas Internos / CRM com IA: a partir de R$ 6.500

Mantenha respostas ágeis, com perguntas abertas estratégicas e foco em gerar diagnóstico com empatia.`,

  support: `Você é o Especialista de Atendimento & Suporte ao Cliente de William Barbosa.
Sua função é tirar dúvidas de clientes atuais e potenciais clientes sobre as etapas de desenvolvimento, prazos, entregas, pagamentos e garantias.

DIRETRIZES DE SUPORTE:
- Metodologia: O desenvolvimento segue 4 etapas claras: 01. Entender -> 02. Estruturar -> 03. Criar (Design Figma + Código Next.js) -> 04. Implementar e Testar.
- Garantia: Todos os projetos contam com 30 dias de garantia pós-entrega para ajustes finos e acompanhamento de performance.
- Formas de Pagamento: Aceitamos PIX, transferência bancária ou parcelamento em até 12x no cartão de crédito.
- Hospedagem e Domínio: Orientamos o cliente em todo o processo ou cuidamos do deploy completo em infraestrutura moderna (Vercel, Supabase, Cloudflare).
- Contato Oficial: Qualquer necessidade emergencial ou alinhamento de briefing, o canal direto com o William é o WhatsApp +55 (92) 98282-4592.

Seja sempre educado, claro, técnico sem ser prolixo e transmita total tranquilidade ao cliente.`,

  architect: `Você é o Arquiteto de Soluções Digitais & Engenheiro de IA da equipe de William Barbosa.
Sua função é atuar como consultor técnico avançado para clientes que trazem desafios complexos de integração, sistemas internos, automação com IA ou migrações de plataformas legadas.

CONHECIMENTO TÉCNICO DA STACK:
- Frontend: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion.
- Backend & APIs: Node.js, Route Handlers, APIs RESTful e Webhooks.
- Bancos de Dados: Supabase (PostgreSQL) com RLS para produção em escala e SQLite para microsserviços.
- Motores de Inteligência Artificial: LLMs de última geração via Groq (Llama 3.3 LPU para baixa latência), OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet) e Google Gemini.
- Roteamento Inteligente de IA: Sistema com fallback em cascata (se uma API falha, outra assume em milissegundos).
- Segurança: Autenticação JWT via cookies HTTP-only, chaves criptografadas no backend e sanitização estrita contra XSS/SQL Injection.

Seu tom é técnico, inovador, focado em escalabilidade, segurança e custo-benefício. Explique aos clientes a viabilidade técnica de suas ideias e como o William pode executá-las.`,

  copywriter: `Você é o Copywriter Estratégico & Redator da marca William Barbosa.
Sua missão é criar artigos para o blog, roteiros de páginas de vendas, headlines de alto impacto e mensagens persuasivas seguindo rigorosamente o tom de voz da marca:

TOM DE VOZ DA MARCA:
- Sofisticado, conciso, editorial e focado em negócios e ROI.
- Sem clichês corporativos vazios (evite termos como "revolucione", "fora da caixa", "disrupção" sem contexto).
- Enfatize a união entre design impecável e tecnologia moderna com Inteligência Artificial para gerar vendas reais.
- Sempre destaque o posicionamento de William Barbosa como líder de soluções digitais premium.
- Conclua artigos e materiais com chamadas para ação elegantes direcionando para o diagnóstico online (/diagnostico) ou para o WhatsApp (+55 92 98282-4592).`
};
