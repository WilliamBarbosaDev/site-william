import { getDatabase } from "./connection";
import { PROJECTS, CONFIG } from "@/data";
import { AI_SERVICES_CATALOG } from "@/data/ai-agent-knowledge";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

export async function seedDatabase() {
  const db = getDatabase();

  // 1. Seed Admin User if not exists
  const existingUser = db.prepare("SELECT id FROM admin_users WHERE email = ?").get("admin@williambdesigner.com.br");
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123456", 10);
    const userId = randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT OR IGNORE INTO admin_users (id, name, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, 'ADMIN', ?)
    `).run(userId, "William Barbosa", "admin@williambdesigner.com.br", passwordHash, now);
    console.log("✓ Usuário administrador inicial pronto: admin@williambdesigner.com.br");
  }

  // 2. Seed Site Settings if empty
  const settingsCount = db.prepare("SELECT COUNT(*) as count FROM site_settings").get() as { count: number };
  if (settingsCount.count === 0) {
    const now = new Date().toISOString();
    const initialSettings = [
      { key: "site_name", value: "William Barbosa | Estratégia, Web & IA", category: "general" },
      { key: "site_headline", value: "Estratégia, Web & IA para Empresas que Querem Liderar", category: "general" },
      { key: "company_name", value: "William Barbosa", category: "general" },
      { key: "phone", value: CONFIG.phone || "5592982824592", category: "contact" },
      { key: "whatsapp", value: CONFIG.phone || "5592982824592", category: "contact" },
      { key: "email", value: CONFIG.email || "contato@williambdesigner.com.br", category: "contact" },
      { key: "location", value: CONFIG.location || "Manaus — Amazonas", category: "contact" },
      { key: "service_area", value: CONFIG.serviceArea || "Atendimento para todo o Brasil", category: "contact" },
      { key: "instagram", value: CONFIG.socials.instagram, category: "social" },
      { key: "linkedin", value: CONFIG.socials.linkedin, category: "social" },
      { key: "behance", value: CONFIG.socials.behance, category: "social" },
      { key: "default_cta_text", value: "Iniciar Diagnóstico Estratégico", category: "cta" },
      { key: "default_cta_url", value: "/diagnostico", category: "cta" },
      { key: "seo_title", value: "William Barbosa | Estratégia, Web & IA para Negócios", category: "seo" },
      { key: "seo_description", value: "Desenvolvimento de sites estratégicos de alta conversão e sistemas inteligentes com IA que automatizam e aceleram empresas.", category: "seo" },
      { key: "seo_keywords", value: "estratégia digital, landing pages, inteligência artificial, automação empresarial, manaus, são paulo", category: "seo" },
      { key: "footer_bio", value: "Designer Estratégico & Desenvolvedor de Soluções com IA. Transformando desafios complexos em produtos digitais de alta conversão.", category: "footer" },
    ];

    const insertSetting = db.prepare("INSERT INTO site_settings (key, value, category, updated_at) VALUES (?, ?, ?, ?)");
    for (const s of initialSettings) {
      insertSetting.run(s.key, s.value, s.category, now);
    }
    console.log("✓ Configurações do site semeadas.");
  }

  // 3. Seed Page Sections for Homepage (CMS initial content)
  const sectionsCount = db.prepare("SELECT COUNT(*) as count FROM page_sections").get() as { count: number };
  if (sectionsCount.count === 0) {
    const now = new Date().toISOString();
    const sections = [
      {
        page_slug: "home",
        section_key: "hero",
        title: "Estratégia, Web & IA para Negócios de Alto Padrão",
        subtitle: "DESIGN ESTRATÉGICO & ENGENHARIA DE INTELIGÊNCIA ARTIFICIAL",
        description: "Transformamos a presença digital da sua empresa com design editorial de alto nível, arquitetura de alta conversão e agentes autônomos de IA que reduzem custos operacionais.",
        cta_text: "Iniciar Diagnóstico com IA",
        cta_url: "/diagnostico",
        image_url: "/assets/hero-mockup.png",
        content_json: JSON.stringify({
          badge: "Disponível para novos projetos estratégicos",
          secondary_cta_text: "Ver Portfólio",
          secondary_cta_url: "/projetos"
        }),
        display_order: 1
      },
      {
        page_slug: "home",
        section_key: "solutions",
        title: "Soluções Digitais Sob Medida",
        subtitle: "CAPACIDADES ESTRATÉGICAS",
        description: "Estruturamos ecossistemas completos para elevar a autoridade da sua marca e gerar mais receita previsível.",
        cta_text: "Consultar Solução",
        cta_url: "/diagnostico",
        display_order: 2
      },
      {
        page_slug: "home",
        section_key: "projects",
        title: "Portfólio Selecionado & Cases",
        subtitle: "RESULTADOS REAIS",
        description: "Uma seleção de sites, landing pages de alta conversão e sistemas com IA projetados com máxima precisão estética e técnica.",
        cta_text: "Explorar Todos os Projetos",
        cta_url: "/projetos",
        display_order: 3
      },
      {
        page_slug: "home",
        section_key: "cta_banner",
        title: "Pronto para transformar sua presença digital?",
        subtitle: "VAMOS CONVERSAR",
        description: "Descubra qual solução digital ou sistema com inteligência artificial é ideal para os gargalos atuais da sua empresa.",
        cta_text: "Falar com William Barbosa",
        cta_url: `https://wa.me/5592982824592?text=${encodeURIComponent("Olá William, gostaria de conversar sobre um projeto digital para minha empresa.")}`,
        display_order: 4
      }
    ];

    const insertSection = db.prepare(`
      INSERT INTO page_sections (id, page_slug, section_key, title, subtitle, description, cta_text, cta_url, image_url, content_json, is_active, display_order, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'PUBLISHED', ?)
    `);

    for (const sec of sections) {
      insertSection.run(
        randomUUID(),
        sec.page_slug,
        sec.section_key,
        sec.title,
        sec.subtitle,
        sec.description,
        sec.cta_text,
        sec.cta_url,
        sec.image_url || null,
        sec.content_json || null,
        sec.display_order,
        now
      );
    }
    console.log("✓ Seções do CMS semeadas.");
  }

  // 4. Seed Services from SOLUTIONS
  const servicesCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
  if (servicesCount.count === 0) {
    const now = new Date().toISOString();
    const insertService = db.prepare(`
      INSERT INTO services (id, slug, name, title, short_description, full_description, icon, benefits_json, problems_json, cta_text, cta_url, display_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    AI_SERVICES_CATALOG.forEach((sol, index) => {
      insertService.run(
        randomUUID(),
        sol.id,
        sol.name,
        sol.name,
        sol.shortDescription,
        sol.detailedBenefit,
        "Sparkles",
        JSON.stringify([sol.expectedImpact]),
        JSON.stringify([sol.category]),
        "Solicitar Orçamento",
        `https://wa.me/5592982824592?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre ${sol.name}.`)}`,
        index + 1,
        now,
        now
      );
    });
    console.log("✓ Serviços semeados no banco.");
  }

  // 5. Seed Projects from PROJECTS
  const projectsCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (projectsCount.count === 0) {
    const now = new Date().toISOString();
    const insertProject = db.prepare(`
      INSERT INTO projects (id, slug, title, category, services, description, cover_image, whatsapp_message, is_featured, display_order, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, ?)
    `);

    PROJECTS.forEach((p, index) => {
      const slug = p.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      insertProject.run(
        randomUUID(),
        `${slug}-${index + 1}`,
        p.title,
        p.category,
        p.services,
        p.description,
        p.image,
        p.whatsappMessage,
        index < 6 ? 1 : 0, // top 6 featured
        index + 1,
        now,
        now
      );
    });
    console.log("✓ Projetos semeados no banco.");
  }

  // 6. Seed AI Providers & Models
  const providersCount = db.prepare("SELECT COUNT(*) as count FROM ai_providers").get() as { count: number };
  if (providersCount.count === 0) {
    const now = new Date().toISOString();
    const geminiId = randomUUID();
    const openaiId = randomUUID();
    const anthropicId = randomUUID();

    const insertProvider = db.prepare(`
      INSERT INTO ai_providers (id, name, provider_type, base_url, is_active, priority, status, created_at)
      VALUES (?, ?, ?, ?, 1, ?, 'READY', ?)
    `);

    insertProvider.run(geminiId, "Google Gemini", "gemini", "https://generativelanguage.googleapis.com/v1beta", 1, now);
    insertProvider.run(openaiId, "OpenAI", "openai", "https://api.openai.com/v1", 2, now);
    insertProvider.run(anthropicId, "Anthropic Claude", "anthropic", "https://api.anthropic.com/v1", 3, now);

    const insertModel = db.prepare(`
      INSERT INTO ai_models (id, provider_id, name, model_id, category, is_active, priority, max_tokens, notes, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
    `);

    // Gemini Models
    const geminiFlashId = randomUUID();
    insertModel.run(geminiFlashId, geminiId, "Gemini 2.5 Flash", "gemini-2.5-flash", "FAST", 1, 8192, "Ideal para respostas ultra-rápidas e diagnósticos em tempo real", now);
    insertModel.run(randomUUID(), geminiId, "Gemini 2.5 Pro", "gemini-2.5-pro", "REASONING", 2, 8192, "Modelo analítico para geração aprofundada de artigos e relatórios", now);

    // OpenAI Models
    const gpt4oId = randomUUID();
    insertModel.run(gpt4oId, openaiId, "GPT-4o", "gpt-4o", "GENERAL", 1, 4096, "Modelo multimodal topo de linha da OpenAI", now);
    insertModel.run(randomUUID(), openaiId, "GPT-4o Mini", "gpt-4o-mini", "FAST", 2, 4096, "Rápido e econômico para tarefas de suporte", now);

    // Anthropic Models
    const claudeSonnetId = randomUUID();
    insertModel.run(claudeSonnetId, anthropicId, "Claude 3.5 Sonnet", "claude-3-5-sonnet-20241022", "REASONING", 1, 8192, "Excelente para escrita de artigos e redação publicitária", now);

    // 7. Seed AI Routes (Task-based routing)
    const tasks = [
      "CHAT",
      "DIAGNOSTIC_INTERVIEW",
      "BUSINESS_ANALYSIS",
      "FINAL_DIAGNOSIS",
      "BLOG_IDEATION",
      "BLOG_WRITING",
      "BLOG_SEO",
      "CONTENT_REWRITE",
      "SERVICE_RECOMMENDATION"
    ];

    const insertRoute = db.prepare(`
      INSERT INTO ai_routes (id, task_name, primary_provider_id, primary_model_id, fallback1_provider_id, fallback1_model_id, fallback2_provider_id, fallback2_model_id, is_active, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);

    for (const t of tasks) {
      insertRoute.run(
        randomUUID(),
        t,
        geminiId,
        geminiFlashId,
        openaiId,
        gpt4oId,
        anthropicId,
        claudeSonnetId,
        now
      );
    }
    console.log("✓ Provedores, Modelos e Rotas de IA semeados.");
  }

  // 8. Seed AI Prompts
  const promptsCount = db.prepare("SELECT COUNT(*) as count FROM ai_prompts").get() as { count: number };
  if (promptsCount.count === 0) {
    const now = new Date().toISOString();
    const prompts = [
      {
        identifier: "DIAGNOSTIC_AGENT",
        name: "Agente de Diagnóstico e Consultoria Estratégica",
        template: `Você é o Agente Consultor e Assistente Estratégico oficial de William Barbosa (Especialista em Estratégia, Web Design de Alto Padrão e Automação com Inteligência Artificial).
Seu objetivo é conduzir um diagnóstico consultivo refinado com o visitante, entender o estágio de sua empresa, identificar dores e recomendar a solução perfeita dentre a grade oficial de serviços ou agendar uma reunião estratégica com William Barbosa quando a demanda for sob medida.`
      },
      {
        identifier: "BLOG_WRITER",
        name: "Redator Especialista de Artigos para Blog",
        template: `Você é o estrategista de conteúdo e redator executivo de William Barbosa.
Escreva um artigo de blog com profundidade, embasamento técnico, tom profissional, persuasivo e altamente acessível.
Estruture o texto com Título instigante, introdução com gancho forte, seções bem divididas (H2 e H3), listas práticas, insights acionáveis e um Call to Action (CTA) direcionado para realização de diagnóstico ou contato comercial.`
      },
      {
        identifier: "BLOG_SEO",
        name: "Otimizador de SEO para Conteúdo",
        template: `Você é um especialista em SEO técnico e copywriting para buscadores.
Dada uma pauta ou artigo, gere:
1. Meta Title (máximo 60 caracteres)
2. Meta Description (máximo 155 caracteres)
3. 5 a 10 Palavras-chave semânticas
4. Sugestão de Slug amigável
5. Resumo executivo para OpenGraph.`
      }
    ];

    const insertPrompt = db.prepare(`
      INSERT INTO ai_prompts (id, identifier, name, prompt_template, version, is_active, updated_at)
      VALUES (?, ?, ?, ?, 1, 1, ?)
    `);

    for (const p of prompts) {
      insertPrompt.run(randomUUID(), p.identifier, p.name, p.template, now);
    }
    console.log("✓ Prompts de IA semeados.");
  }

  // 9. Seed 5 Specialized AI Agents (Closer, SDR, Suporte, Arquiteto, Copywriter)
  const agentsCount = db.prepare("SELECT COUNT(*) as count FROM ai_agents").get() as { count: number };
  if (agentsCount.count === 0) {
    const now = new Date().toISOString();
    const insertAgent = db.prepare(`
      INSERT INTO ai_agents (
        id, slug, name, role_title, category, description,
        system_instructions, avatar_emoji, temperature, max_tokens,
        trigger_phrases_json, is_active, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `);

    const defaultAgents = [
      {
        slug: "william-closer-ai",
        name: "William Closer AI",
        role_title: "Consultor Comercial & Fechamento de Vendas",
        category: "SALES",
        description: "Especialista em vendas consultivas, quebra de objeções de preço, valor percebido e fechamento no WhatsApp.",
        system_instructions: `Você é o William Closer AI, o Agente Consultor Comercial e de Fechamento de Vendas oficial de William Barbosa.
Seu objetivo é conduzir conversas de alto nível com empresários e tomadores de decisão, gerando valor percebido imediato, desmistificando investimentos e conduzindo o cliente com elegância para o fechamento ou agendamento direto com o William no WhatsApp: +55 (92) 98282-4592.

INFORMAÇÕES DA EMPRESA:
- Especialista: William Barbosa (Designer Estratégico & Desenvolvedor Fullstack com IA).
- Localização: Manaus - AM, atendendo todo o Brasil.
- WhatsApp: https://wa.me/5592982824592

TABELA DE PREÇOS:
- Landing Page Estratégica: a partir de R$ 2.800 (prazo ~10 dias úteis).
- Site Institucional de Autoridade: a partir de R$ 4.800 (prazo ~20 dias úteis).
- Agente SDR IA para WhatsApp: R$ 3.800 implantação + R$ 600/mês.
- Sistema de CRM com IA: a partir de R$ 6.500 (prazo ~25 dias úteis).
- Sistema de Agendamento com IA: a partir de R$ 3.500 (prazo ~14 dias úteis).
- Soluções Sob Medida: a partir de R$ 8.500.

DIRETRIZES:
- Demonstre autoridade, elegância e foco em ROI.
- Sempre direcione para o WhatsApp: "Podemos alinhar os detalhes diretamente com o William no WhatsApp (92) 98282-4592."`,
        avatar_emoji: "💼",
        temperature: 0.7,
        max_tokens: 4096,
        triggers: ["Quanto custa para fazer um site?", "Qual a diferença entre o William e uma agência?", "Preciso de mais vendas urgente, o que fazer?"],
        display_order: 1,
      },
      {
        slug: "sdr-qualificador",
        name: "SDR Qualificador de Leads",
        role_title: "Pré-Vendas, Triagem & Atendimento Imediato",
        category: "SDR",
        description: "Recepciona contatos, identifica o segmento, dores e urgência, preparando o lead para a proposta comercial.",
        system_instructions: `Você é o SDR Qualificador de Leads de William Barbosa.
Sua missão é recepcionar clientes com extrema agilidade e cordialidade, fazendo uma triagem rápida:
1. Qual o segmento da sua empresa?
2. Qual o principal gargalo atual (site antigo, falta de leads, demora para responder no WhatsApp)?
3. Qual o momento e urgência do projeto?
Apresente a solução ideal da esteira de serviços de William Barbosa e direcione para o WhatsApp: +55 (92) 98282-4592.`,
        avatar_emoji: "⚡",
        temperature: 0.6,
        max_tokens: 2048,
        triggers: ["Olá, gostaria de um orçamento", "Vocês fazem landing page para médicos?", "Como funciona o atendimento por IA no WhatsApp?"],
        display_order: 2,
      },
      {
        slug: "suporte-atendimento",
        name: "Especialista de Atendimento & Suporte",
        role_title: "Dúvidas Operacionais, Prazos & Metodologia",
        category: "SUPPORT",
        description: "Tira dúvidas de clientes e prospects sobre prazos de entrega, metodologia em 4 passos e garantia de 30 dias.",
        system_instructions: `Você é o Especialista de Atendimento & Suporte de William Barbosa.
Responda com clareza sobre o método de trabalho:
- Metodologia: 01. Entender -> 02. Estruturar -> 03. Criar (Design Figma + Next.js) -> 04. Implementar & Testar.
- Prazos: Landing Pages (~10 dias), Sites (~20 dias), Sistemas/CRM (~25 dias).
- Garantia: 30 dias de ajustes pós-entrega inclusos.
- Pagamentos: Entrada + entrega ou até 12x no cartão.
- Contato oficial: WhatsApp +55 (92) 98282-4592.`,
        avatar_emoji: "🛡️",
        temperature: 0.5,
        max_tokens: 2048,
        triggers: ["Como funciona o pagamento?", "Qual o prazo de entrega?", "Vocês dão garantia depois que o site estiver no ar?"],
        display_order: 3,
      },
      {
        slug: "arquiteto-solucoes",
        name: "Arquiteto de Soluções & IA",
        role_title: "Consultor Técnico & Engenharia de Software",
        category: "TECHNICAL",
        description: "Consultoria técnica sobre arquitetura Next.js 15, integrações de APIs, banco de dados Supabase e automações com IA.",
        system_instructions: `Você é o Arquiteto de Soluções & Engenheiro de IA de William Barbosa.
Auxilie clientes com dúvidas técnicas avançadas:
- Stack moderna: Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL), APIs RESTful.
- Inteligência Artificial: LLMs integrados via Groq (Llama 3.3 LPU para velocidade máxima), OpenAI, Claude e Gemini com sistema de fallback em cascata.
- Segurança: Chaves criptografadas no backend, cookies HTTP-only, proteção contra XSS e SQL Injection.`,
        avatar_emoji: "🏗️",
        temperature: 0.6,
        max_tokens: 4096,
        triggers: ["Por que usar Next.js em vez de WordPress?", "Como a IA é integrada no WhatsApp?", "O banco de dados é seguro?"],
        display_order: 4,
      },
      {
        slug: "copywriter-estrategico",
        name: "Copywriter Estratégico",
        role_title: "Redator Executivo & Estrategista de Conteúdo",
        category: "CONTENT",
        description: "Redige artigos, pautas para o blog, scripts de vendas e headlines persuasivas no tom de voz sofisticado da marca.",
        system_instructions: `Você é o Copywriter Estratégico de William Barbosa.
Escreva conteúdos persuasivos, elegantes e focados em ROI.
Evite clichês vazios de marketing. Destaque a união entre design impecável e tecnologia com Inteligência Artificial para gerar conversão real.`,
        avatar_emoji: "✍️",
        temperature: 0.8,
        max_tokens: 4096,
        triggers: ["Crie uma headline para landing page jurídica", "Ideia de artigo sobre IA para pequenas empresas", "Roteiro de abordagem comercial"],
        display_order: 5,
      }
    ];

    for (const a of defaultAgents) {
      insertAgent.run(
        randomUUID(),
        a.slug,
        a.name,
        a.role_title,
        a.category,
        a.description,
        a.system_instructions,
        a.avatar_emoji,
        a.temperature,
        a.max_tokens,
        JSON.stringify(a.triggers),
        a.display_order,
        now,
        now
      );
    }
    console.log("✓ 5 Agentes Especializados de IA semeados com sucesso.");
  }

  // 10. Populate pricing on existing services if null
  try {
    const updatePricing = db.prepare(`
      UPDATE services
      SET price_starting_at = COALESCE(price_starting_at, ?),
          price_model = COALESCE(price_model, ?),
          price_notes = COALESCE(price_notes, ?),
          deliverables_json = COALESCE(deliverables_json, ?),
          estimated_days = COALESCE(estimated_days, ?)
      WHERE slug = ? OR id = ?
    `);

    updatePricing.run("R$ 2.800,00", "PROJETO_UNICO", "50% entrada + 50% entrega ou até 12x", JSON.stringify(["Diagnóstico de oferta", "Design Figma", "Next.js", "Garantia 30 dias"]), 10, "landing-page", "landing-page");
    updatePricing.run("R$ 4.800,00", "PROJETO_UNICO", "50% entrada + 50% entrega ou até 12x", JSON.stringify(["CMS completo", "SEO on-page", "Design de autoridade", "Next.js"]), 20, "site-institucional", "site-institucional");
    updatePricing.run("R$ 6.500,00", "PROJETO_UNICO", "Parcelamento em até 3x durante o desenvolvimento", JSON.stringify(["Pipeline Kanban", "Qualificação IA", "Histórico de clientes", "Dashboard"]), 25, "crm-ia", "crm-ia");
    updatePricing.run("R$ 3.800,00", "MENSAL_RECORRENTE", "Implantação parcelável + mensalidade de R$ 600/mês", JSON.stringify(["Treinamento IA", "WhatsApp 24/7", "Triagem de leads", "Painel de métricas"]), 12, "sdr-ia", "sdr-ia");
    updatePricing.run("R$ 3.500,00", "PROJETO_UNICO", "50% entrada + 50% entrega ou até 12x", JSON.stringify(["Calendário dinâmico", "Lembretes WhatsApp", "Sincronização Google Calendar"]), 14, "agendamento-ia", "agendamento-ia");
    updatePricing.run("A partir de R$ 8.500,00", "SOB_CONSULTA", "Cronograma financeiro por marcos de entrega (milestones)", JSON.stringify(["Arquitetura customizada", "Backend e APIs", "Integrações ERP", "Deploy nuvem"]), 30, "sistema-personalizado", "sistema-personalizado");
    console.log("✓ Precificação padrão dos serviços atualizada.");
  } catch (err) {
    console.warn("Pricing update warning:", err);
  }
}
