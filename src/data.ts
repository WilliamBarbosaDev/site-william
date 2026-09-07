// Static Data for William Barbosa's Site — Estratégia, Web & IA

export const CONFIG = {
  phone: "5592982824592", // WhatsApp oficial William Barbosa.
  email: "contato@williambdesigner.com.br",
  location: "Manaus — Amazonas",
  serviceArea: "Atendimento para todo o Brasil",
  socials: {
    instagram: "https://instagram.com/williamb.designer",
    linkedin: "https://linkedin.com/in/williambarbosa",
    behance: "https://behance.net/williambarbosa",
  }
};

export const getWhatsAppLink = (messageOrType?: keyof typeof WHATSAPP_MESSAGES | string) => {
  const base = "https://api.whatsapp.com/send";
  const message = (messageOrType && (WHATSAPP_MESSAGES as Record<string, string>)[messageOrType]) 
    || messageOrType 
    || WHATSAPP_MESSAGES.general;
  const text = encodeURIComponent(message);
  return `${base}?phone=${CONFIG.phone}&text=${text}`;
};

export const WHATSAPP_MESSAGES = {
  general: "Olá! Gostaria de conversar sobre um desafio na minha empresa e entender qual a melhor solução digital.",
  website: "Olá! Preciso estruturar um site estratégico para melhorar o posicionamento e a autoridade da minha empresa.",
  landing_page: "Olá! Preciso de uma landing page eficiente para apresentar uma oferta com clareza e gerar mais conversões.",
  identity: "Olá! Gostaria de alinhar a experiência (UX/UI) e a interface digital da minha marca.",
  automation: "Olá! Tenho processos na minha empresa que poderiam ser organizados ou otimizados com automações e IA.",
  agency: "Olá! Represento uma agência e gostaria de conversar sobre uma parceria estratégica para ampliar entregas.",
};

export interface Project {
  title: string;
  category: string;
  services: string;
  image: string;
  description: string;
  whatsappMessage: string;
}

export const PROJECTS: Project[] = [
  {
    title: "VerJuris Advocacia",
    category: "Site Institucional",
    services: "Estratégia • UX/UI • Web Design",
    image: "/assets/fotos_projetos/site_verjuris.png",
    description: "Presença digital jurídica de alta autoridade, pensada para transmitir clareza, segurança e ética.",
    whatsappMessage: "Olá William! Gostaria de um site institucional estratégico como o da VerJuris."
  },
  {
    title: "CASI Imobiliária",
    category: "Site Corporativo",
    services: "Estratégia • UX/UI • Imobiliário",
    image: "/assets/fotos_projetos/site_casiimobiliaria.png",
    description: "Plataforma para o setor imobiliário focada em negócios de alto padrão, moradia e investimento em Manaus.",
    whatsappMessage: "Olá William! Gostaria de soluções digitais para o setor imobiliário como o da CASI."
  },
  {
    title: "VerGroup Contabilidade",
    category: "Site Institucional",
    services: "Estratégia • UX/UI • Contabilidade Digital",
    image: "/assets/fotos_projetos/site_contabilidade_vergroup.png",
    description: "Contabilidade sem burocracia para serviços, PJ e empresas, com estrutura focada na redução fiscal e conversão.",
    whatsappMessage: "Olá William! Gostaria de um site como o do VerGroup / VerContábil."
  },
  {
    title: "AMcash Bank",
    category: "Plataforma Financeira",
    services: "Branding • UX/UI • Fintech",
    image: "/assets/fotos_projetos/site_amcash.png",
    description: "Solução para antecipação de recebíveis e fomento mercantil com posicionamento financeiro moderno.",
    whatsappMessage: "Olá William! Gostaria de desenvolver uma solução digital para minha financeira."
  },
  {
    title: "VerAds IA",
    category: "Hub Tecnológico & IA",
    services: "Estratégia • UX/UI • IA & Performance",
    image: "/assets/fotos_projetos/site_verads.png",
    description: "Hub de crescimento focado em marketing de performance e soluções digitais impulsionadas por Inteligência Artificial.",
    whatsappMessage: "Olá William! Gostaria de uma presença digital com foco em IA e escala."
  },
  {
    title: "Web Saudi Certificadora",
    category: "E-commerce & Serviços",
    services: "UX/UI • E-commerce • Landing Page",
    image: "/assets/fotos_projetos/site_certificadora.png",
    description: "Plataforma para aquisição ágil e segura de certificados digitais e-CPF e e-CNPJ para pessoas e empresas.",
    whatsappMessage: "Olá William! Gostaria de uma plataforma ágil de venda de serviços e certificados."
  },
  {
    title: "AG Projetos & Orçamentos",
    category: "Landing Page / Arquitetura",
    services: "Estratégia • Landing Page • UX/UI",
    image: "/assets/fotos_projetos/site_arquiteta.png",
    description: "Apresentação técnica e comercial para orçamentos e projetos arquitetônicos residenciais e corporativos.",
    whatsappMessage: "Olá William! Gostaria de uma landing page para orçamentos de arquitetura e engenharia."
  },
  {
    title: "Master's Instalações & Engenharia",
    category: "Site Corporativo",
    services: "Estratégia • UX/UI • Engenharia Industrial",
    image: "/assets/fotos_projetos/site_materengenharia.png",
    description: "Mais de 20 anos no mercado com serviços especializados de instalações elétricas e hidráulicas industriais.",
    whatsappMessage: "Olá William! Gostaria de um site corporativo para minha empresa de engenharia/instalações."
  },
  {
    title: "Nova Igreja Batista Cidade de Deus",
    category: "Portal Institucional",
    services: "UX/UI • Web Design • Comunidade",
    image: "/assets/fotos_projetos/site_igreja.png",
    description: "Portal institucional e comunitário com organização de ministérios, eventos, transmissões e programações.",
    whatsappMessage: "Olá William! Gostaria de desenvolver um portal para minha instituição."
  },
  {
    title: "VerAcademy — Hub Educacional",
    category: "Portal & Plataforma",
    services: "UX/UI • E-learning • IA & Gestão",
    image: "/assets/fotos_projetos/site_portalcadaemico.png",
    description: "Hub educacional para negócios que capacita empresas, líderes e equipes em Inteligência Artificial e gestão.",
    whatsappMessage: "Olá William! Gostaria de um hub educacional e plataforma de cursos."
  },
  {
    title: "Anderson Lincoln Vital — Direito Médico",
    category: "Landing Page / Jurídico",
    services: "Copywriting • Landing Page • High-Ticket",
    image: "/assets/fotos_projetos/lp_advogado.png",
    description: "Workshop e adequação em privacidade e proteção de dados (LGPD) para clínicas e consultórios médicos.",
    whatsappMessage: "Olá William! Gostaria de uma landing page para workshop/advocacia."
  },
  {
    title: "Desafio dos Anúncios Online",
    category: "Página de Vendas & Captura",
    services: "Copywriting • Landing Page • Performance",
    image: "/assets/fotos_projetos/lp_evento_anuncios.png",
    description: "Página de alta conversão para captura de leads e lançamento de treinamento em gestão de tráfego pago.",
    whatsappMessage: "Olá William! Quero estruturar uma página de captura para meu lançamento."
  },
  {
    title: "IPEMED / Afya Educação Médica",
    category: "Landing Page / Saúde",
    services: "Estratégia • UX/UI • Educação Médica",
    image: "/assets/fotos_projetos/lp_medial.png",
    description: "Página de captação para pós-graduação médica e workshops exclusivos para profissionais da saúde.",
    whatsappMessage: "Olá William! Gostaria de uma página de captação para o setor de saúde."
  },
  {
    title: "Treinamento Garçom Vendedor",
    category: "Página de Vendas",
    services: "Copy • UX/UI • Conversão",
    image: "/assets/fotos_projetos/garcom_vendedor_lp.png",
    description: "Método prático de treinamento para aumentar o faturamento de restaurantes e bares em até 30%.",
    whatsappMessage: "Olá William! Quero uma página de vendas para meu treinamento."
  },
  {
    title: "Paloma Maia Beauty",
    category: "Landing Page / Estética",
    services: "Branding • UX/UI • Catálogo VIP",
    image: "/assets/fotos_projetos/lp_esteticista.png",
    description: "Apresentação de catálogo oficial de serviços de estética avançada e agendamento VIP.",
    whatsappMessage: "Olá William! Gostaria de uma página exclusiva para serviços de estética e beleza."
  },
  {
    title: "Face Doctor — Estética Premium",
    category: "Landing Page / Estética",
    services: "Copy • UX/UI • Agendamentos",
    image: "/assets/fotos_projetos/lp_estetica.png",
    description: "Clínica de estética facial e corporal com foco em rejuvenescimento e captação de procedimentos.",
    whatsappMessage: "Olá William! Gostaria de uma landing page para captação de agendamentos em clínica."
  },
  {
    title: "Masterclass Full Stack",
    category: "Página de Vendas & Captura",
    services: "Copywriting • Landing Page • Tech",
    image: "/assets/fotos_projetos/lp_cursos.png",
    description: "Página de captura e inscrição para masterclass ao vivo de programação e carreira em tecnologia.",
    whatsappMessage: "Olá William! Quero uma página de captura para evento de tecnologia."
  },
  {
    title: "Açaí do Jota",
    category: "Site & Delivery",
    services: "UX/UI • Cardápio Digital • Conversão",
    image: "/assets/fotos_projetos/site_acai.png",
    description: "Site comercial e cardápio interativo de combos promocionais e delivery para franquia de açaí.",
    whatsappMessage: "Olá William! Gostaria de um site comercial/delivery para meu negócio de alimentação."
  },
  {
    title: "Cafena Cafeteria",
    category: "Site Institucional",
    services: "Branding • UX/UI • Gastronomia",
    image: "/assets/fotos_projetos/site_cafeteria.png",
    description: "Experiência digital sofisticada para cafeteria de grãos especiais com cardápio e avaliações.",
    whatsappMessage: "Olá William! Gostaria de um site institucional para minha cafeteria/restaurante."
  },
  {
    title: "Restaurante Sabor Brasileiro",
    category: "Site Institucional",
    services: "UX/UI • Web Design • Delivery",
    image: "/assets/fotos_projetos/site_restaurante.png",
    description: "Presença digital para restaurante tradicional com cardápio de pratos, sobremesas e pedidos rápidos.",
    whatsappMessage: "Olá William! Gostaria de um site para meu restaurante."
  },
  {
    title: "Marmitas Fit da Lili",
    category: "E-commerce",
    services: "UX/UI • E-commerce • Pedidos",
    image: "/assets/fotos_projetos/site_ecommerce_marmitas.png",
    description: "E-commerce de marmitas saudáveis fit e low carb com catálogo de combos e pedidos automatizados.",
    whatsappMessage: "Olá William! Gostaria de um e-commerce de marmitas e alimentação saudável."
  },
  {
    title: "Notecell Celular",
    category: "E-commerce",
    services: "UX/UI • E-commerce • Varejo Tech",
    image: "/assets/fotos_projetos/ecommerce_cellular.png",
    description: "Loja virtual completa para venda de smartphones, acessórios e assistência técnica com entrega rápida.",
    whatsappMessage: "Olá William! Gostaria de uma loja virtual para venda de eletrônicos/celulares."
  },
  {
    title: "Farmave Manipulação",
    category: "E-commerce",
    services: "UX/UI • E-commerce • Orçamentos",
    image: "/assets/fotos_projetos/ecommerce_farmacia.png",
    description: "E-commerce e captação de receitas para farmácia de manipulação com linha de skincare e fitoterápicos.",
    whatsappMessage: "Olá William! Gostaria de uma plataforma digital para minha farmácia/e-commerce."
  },
  {
    title: "Comercial CDA Atacado",
    category: "E-commerce",
    services: "UX/UI • E-commerce B2B • Catálogo",
    image: "/assets/fotos_projetos/ecommerce_comercialcda.png",
    description: "Distribuição e venda atacadista de produtos exclusivos com catálogo de pedidos e orçamentos.",
    whatsappMessage: "Olá William! Gostaria de uma plataforma B2B/atacadista para minha distribuidora."
  },
  {
    title: "Guto's Tour Viagens",
    category: "Site Corporativo",
    services: "UX/UI • Web Design • Câmbio",
    image: "/assets/fotos_projetos/site_tour.png",
    description: "Agência de viagens completa com pacotes internacionais para Europa, cruzeiros de luxo e câmbio de moedas.",
    whatsappMessage: "Olá William! Gostaria de um site corporativo para minha agência de turismo."
  },
  {
    title: "William Barbosa Studio",
    category: "Site Institucional",
    services: "Estratégia • Design • Tecnologia",
    image: "/assets/fotos_projetos/site_agenciamkt.png",
    description: "Agência de soluções inteligentes: da estratégia ao desenvolvimento de inovação sob medida para negócios.",
    whatsappMessage: "Olá William! Gostaria de conversar sobre um projeto com seu estúdio."
  },
  {
    title: "Lançamento Marketing Digital",
    category: "Landing Page / Vendas",
    services: "Copywriting • UX/UI • Tráfego",
    image: "/assets/fotos_projetos/lp_mktdigital.png",
    description: "Estrutura de alta conversão para mentorias e produtos digitais de marketing e escala de vendas.",
    whatsappMessage: "Olá William! Quero estruturar uma landing page de vendas para meu produto digital."
  }
];

export interface Solution {
  title: string;
  description: string;
  indicator: string;
  cta_message: keyof typeof WHATSAPP_MESSAGES;
}

export const SOLUTIONS: Solution[] = [
  {
    title: "Sites estratégicos",
    description: "Presenças digitais estruturadas para comunicar valor, melhorar a experiência e representar melhor o nível real da empresa.",
    indicator: "POSICIONAMENTO",
    cta_message: "website",
  },
  {
    title: "Landing pages e páginas de vendas",
    description: "Experiências estruturadas para apresentar uma oferta com clareza e conduzir o visitante até a ação esperada.",
    indicator: "CONVERSÃO",
    cta_message: "landing_page",
  },
  {
    title: "UX/UI & Design de Interfaces",
    description: "Objetivos de negócio e necessidades dos usuários transformados em jornadas claras, interfaces intuitivas e experiências visualmente consistentes.",
    indicator: "EXPERIÊNCIA",
    cta_message: "identity",
  },
  {
    title: "Sistemas internos",
    description: "Ferramentas construídas em torno dos processos reais da empresa para organizar operações, centralizar informações e reduzir etapas desnecessárias.",
    indicator: "OPERAÇÃO",
    cta_message: "general",
  },
  {
    title: "Automações & IA",
    description: "Tecnologia aplicada para reduzir trabalho manual, conectar processos e utilizar inteligência artificial onde ela realmente fizer sentido.",
    indicator: "EFICIÊNCIA",
    cta_message: "automation",
  },
  {
    title: "Parceria para agências",
    description: "Suporte especializado para ampliar capacidade de entrega em projetos digitais sem aumentar imediatamente a estrutura interna da agência.",
    indicator: "B2B / WHITE-LABEL",
    cta_message: "agency",
  }
];

export interface ProcessStep {
  number: string;
  label: string;
  title: string;
  description: string;
  deliverables: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    label: "01 — ENTENDER",
    title: "Diagnóstico e contexto",
    description: "Negócio, público, objetivos, necessidades e restrições precisam estar claros antes de qualquer decisão técnica.",
    deliverables: [
      "contexto",
      "objetivos",
      "problema",
      "necessidades",
      "alinhamento"
    ]
  },
  {
    number: "02",
    label: "02 — ESTRUTURAR",
    title: "Estratégia e experiência",
    description: "O problema é transformado em direção. Arquitetura, conteúdo, UX, jornadas, fluxos e prioridades começam a organizar a solução.",
    deliverables: [
      "estratégia",
      "arquitetura",
      "jornada",
      "UX",
      "fluxos",
      "conteúdo"
    ]
  },
  {
    number: "03",
    label: "03 — CRIAR",
    title: "UI, Design e Tecnologia",
    description: "A estratégia ganha forma através da interface, da identidade e da tecnologia necessária para tornar a experiência funcional.",
    deliverables: [
      "UI",
      "design",
      "protótipos",
      "desenvolvimento",
      "integrações",
      "revisões"
    ]
  },
  {
    number: "04",
    label: "04 — IMPLEMENTAR",
    title: "Testar, publicar e acompanhar",
    description: "A solução é validada, implementada e acompanhada para verificar se está cumprindo aquilo que deveria resolver.",
    deliverables: [
      "testes",
      "ajustes",
      "publicação",
      "otimização",
      "acompanhamento"
    ]
  }
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como saber qual solução minha empresa realmente precisa?",
    answer: "Essa é justamente uma das primeiras questões a serem respondidas. A conversa começa pelo problema, pelos objetivos e pelo contexto. Só depois é possível definir se a solução passa por site, landing page, sistema, automação, IA ou outra abordagem."
  },
  {
    question: "O trabalho é somente com sites?",
    answer: "Não. Sites são uma das possibilidades. Os projetos também podem envolver landing pages, páginas de vendas, UX/UI, sistemas internos, automações e soluções com inteligência artificial. A combinação depende do problema."
  },
  {
    question: "UX/UI e design fazem parte dos projetos?",
    answer: "Sim, quando fazem parte da solução. UX organiza a jornada e a usabilidade. UI e design transformam essa estrutura em uma interface clara e coerente. O desenvolvimento torna essa experiência funcional."
  },
  {
    question: "São desenvolvidos sistemas e soluções com IA?",
    answer: "Sim. Mas nem todo processo precisa de IA. Primeiro é necessário entender a necessidade. Dependendo do cenário, a solução pode ser um sistema, uma automação, uma integração, IA ou até mesmo a simplificação de um processo existente."
  },
  {
    question: "Como funciona um projeto?",
    answer: "Os projetos normalmente passam por diagnóstico, estratégia, arquitetura, experiência, interface, desenvolvimento, testes e implementação. O processo exato depende do tipo e da complexidade da solução."
  },
  {
    question: "Existe acompanhamento depois da entrega?",
    answer: "Sim. O formato depende do projeto. Manutenção, evolução, otimização e novas necessidades podem continuar sendo acompanhadas depois da implementação inicial."
  }
];

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Marcelo Costa",
    role: "Sócio-fundador / VerJuris",
    image: "/assets/projects/frame1.png",
    rating: 5,
    text: "O processo trouxe clareza absoluta sobre o tom de voz e a autoridade que o escritório precisava transmitir. A solução final superou nossas expectativas em sofisticação e resultado."
  },
  {
    name: "Eduardo Silva",
    role: "Diretor Comercial / AMcash",
    image: "/assets/projects/frame4.png",
    rating: 5,
    text: "Visão estratégica de negócios surpreendente. Não recebemos apenas uma landing page, mas uma verdadeira solução digital que facilitou a captação de clientes B2B."
  },
  {
    name: "Camila Guimarães",
    role: "Head de Marketing / VerGroup",
    image: "/assets/projects/frame3.png",
    rating: 5,
    text: "Agilidade, acerto técnico e rigor em UX/UI. A nova estrutura facilitou nossa comunicação e melhorou significativamente os resultados da empresa."
  }
];

export interface AiSystemItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon: "database" | "calendar" | "user-check" | "trending-up" | "bot" | "message-square" | "layers" | "workflow";
  isHighlighted?: boolean;
  whatsappMessage: string;
}

export const AI_SYSTEMS: AiSystemItem[] = [
  {
    id: "crm",
    title: "Sistema de CRM com IA",
    description: "Gestão comercial personalizada com qualificação de leads por IA, histórico unificado e automação de follow-up.",
    badge: "MAIS PROCURADO",
    icon: "database",
    isHighlighted: true,
    whatsappMessage: "Olá! Gostaria de entender mais sobre o Sistema de CRM personalizado com IA integrada."
  },
  {
    id: "scheduling",
    title: "Agendamento Online",
    description: "Sistema completo para gestão de horários e reservas online integrado ao seu calendário, reduzindo faltas.",
    icon: "calendar",
    whatsappMessage: "Olá! Gostaria de saber mais sobre o Sistema de Agendamento com IA."
  },
  {
    id: "reservations",
    title: "Reservas com SDR IA",
    description: "Triagem e qualificação inteligente de clientes 24h por dia, direcionando oportunidades prontas para atendimento.",
    icon: "user-check",
    whatsappMessage: "Olá! Gostaria de entender como funciona o Sistema de Reservas com SDR IA."
  },
  {
    id: "finance",
    title: "Sistema Financeiro IA",
    description: "Controle de fluxo de caixa pessoal e empresarial com análise preditiva e acompanhamento de KPIs financeiros reais.",
    icon: "trending-up",
    whatsappMessage: "Olá! Gostaria de saber mais sobre o Sistema Financeiro com IA integrada."
  },
  {
    id: "sdr_followup",
    title: "Agente SDR & Follow-Up",
    description: "Atendimento e reengajamento proativo de leads com cadência automática e personalizada via WhatsApp.",
    icon: "bot",
    whatsappMessage: "Olá! Gostaria de aplicar um Agente SDR e Follow-Up na minha empresa."
  },
  {
    id: "multichannel",
    title: "Gestão Multicanal",
    description: "Centralização de conversas de WhatsApp, Instagram e Messenger em um único painel integrado com IA.",
    icon: "message-square",
    whatsappMessage: "Olá! Gostaria de saber mais sobre a Gestão de Conversas Multicanal."
  },
  {
    id: "tasks_hub",
    title: "Central de Tarefas com IA",
    description: "Gerenciamento e automação de fluxos operacionais internos, conectando ferramentas de IA à rotina da equipe.",
    icon: "layers",
    whatsappMessage: "Olá! Gostaria de entender como funciona a Central de Tarefas com IA."
  },
  {
    id: "process_automation",
    title: "Automação de Processos",
    description: "Conexão entre planilhas, sistemas internos, ERPs e APIs para eliminar trabalho manual e acelerar operações.",
    icon: "workflow",
    whatsappMessage: "Olá! Tenho processos na minha empresa que gostaria de automatizar com IA."
  }
];

