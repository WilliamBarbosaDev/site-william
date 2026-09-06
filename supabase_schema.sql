-- ==============================================================================
-- SCHEMA POSTGRESQL PARA SUPABASE (William Barbosa Platform)
-- ==============================================================================
-- Como usar:
-- 1. Acesse o painel do seu projeto no Supabase (https://supabase.com/dashboard)
-- 2. No menu lateral esquerdo, clique em "SQL Editor"
-- 3. Clique em "New Query", cole todo o conteúdo deste arquivo e clique em "Run" (Executar)
-- ==============================================================================

-- Habilitar extensão pgcrypto para geração de UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Inserir usuário administrador padrão (senha: admin123456)
INSERT INTO admin_users (name, email, password_hash, role)
VALUES (
  'William Barbosa',
  'admin@williambdesigner.com.br',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- 2. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, value, category) VALUES
  ('site_name', 'William Barbosa | Sites, Design e Soluções Digitais', 'general'),
  ('site_description', 'Especialista em Sites de Alta Performance, Landing Pages e Soluções com Inteligência Artificial.', 'general'),
  ('contact_whatsapp', '5592982824592', 'contact'),
  ('contact_email', 'contato@williambdesigner.com.br', 'contact'),
  ('contact_phone', '+55 (92) 98282-4592', 'contact')
ON CONFLICT (key) DO NOTHING;

-- 3. PAGES & SECTIONS (CMS)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_url TEXT,
  content_json JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- 4. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  image_url TEXT,
  icon TEXT,
  benefits_json JSONB,
  problems_json JSONB,
  price_starting_at TEXT,
  price_model TEXT NOT NULL DEFAULT 'PROJETO_UNICO', -- PROJETO_UNICO, MENSAL_RECORRENTE, SOB_CONSULTA, HORA_CONSULTORIA
  price_notes TEXT,
  deliverables_json JSONB,
  estimated_days INTEGER DEFAULT 15,
  cta_text TEXT,
  cta_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PROJECTS (PORTFOLIO)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  client TEXT,
  category TEXT NOT NULL,
  services TEXT,
  description TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  technologies_json JSONB,
  results_json JSONB,
  cover_image TEXT NOT NULL,
  images_json JSONB,
  project_url TEXT,
  whatsapp_message TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BLOG
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags_json JSONB,
  author TEXT NOT NULL DEFAULT 'William Barbosa',
  status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, PUBLISHED, ARCHIVED
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  ai_generation_meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CONTENT IDEAS & AUTOMATIONS
CREATE TABLE IF NOT EXISTS content_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  keyword TEXT,
  category TEXT,
  objective TEXT,
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  status TEXT NOT NULL DEFAULT 'IDEA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  frequency TEXT NOT NULL DEFAULT 'WEEKLY',
  day_of_week TEXT DEFAULT 'MONDAY',
  time_of_day TEXT DEFAULT '09:00',
  category_id UUID,
  themes_json JSONB,
  keywords_json JSONB,
  provider_id UUID,
  model_id UUID,
  prompt_id UUID,
  auto_publish BOOLEAN NOT NULL DEFAULT FALSE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AI ENGINE: PROVIDERS, MODELS, ROUTES, PROMPTS, LOGS
CREATE TABLE IF NOT EXISTS ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL, -- openai, gemini, anthropic, groq, openrouter, custom
  api_key_encrypted TEXT,
  base_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'READY',
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES ai_providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model_id TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'GENERAL',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 1,
  max_tokens INTEGER DEFAULT 4096,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT UNIQUE NOT NULL,
  primary_provider_id UUID,
  primary_model_id UUID,
  fallback1_provider_id UUID,
  fallback1_model_id UUID,
  fallback2_provider_id UUID,
  fallback2_model_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES ai_prompts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT NOT NULL,
  provider_used TEXT,
  model_used TEXT,
  tokens_prompt INTEGER DEFAULT 0,
  tokens_completion INTEGER DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8.1 SPECIALIZED AI AGENTS (Closer, SDR, Suporte, Custom)
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'CUSTOM', -- SALES, SDR, SUPPORT, TECHNICAL, CONTENT, CUSTOM
  description TEXT NOT NULL,
  system_instructions TEXT NOT NULL,
  provider_id UUID,
  model_id UUID,
  temperature REAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  avatar_emoji TEXT DEFAULT '🤖',
  trigger_phrases_json JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserir os 5 agentes oficiais treinados de William Barbosa
INSERT INTO ai_agents (slug, name, role_title, category, description, system_instructions, avatar_emoji, temperature, max_tokens, trigger_phrases_json, display_order)
VALUES
  (
    'william-closer-ai',
    'William Closer AI',
    'Consultor Comercial & Fechamento de Vendas',
    'SALES',
    'Especialista em vendas consultivas, quebra de objeções de preço, valor percebido e fechamento no WhatsApp.',
    'Você é o William Closer AI, o Agente Consultor Comercial e de Fechamento de Vendas oficial de William Barbosa (+55 92 98282-4592). Apresente a esteira de serviços, justifique o ROI e direcione para o WhatsApp.',
    '💼',
    0.7,
    4096,
    '["Quanto custa para fazer um site?", "Qual a diferença para uma agência?", "Qual o prazo de entrega?"]',
    1
  ),
  (
    'sdr-qualificador',
    'SDR Qualificador de Leads',
    'Pré-Vendas, Triagem & Atendimento Imediato',
    'SDR',
    'Recepciona contatos, identifica o segmento, dores e urgência, preparando o lead para a proposta comercial.',
    'Você é o SDR Qualificador de Leads de William Barbosa. Recepcione com agilidade, faça triagem de segmento e dor atual, e direcione para o WhatsApp: +55 (92) 98282-4592.',
    '⚡',
    0.6,
    2048,
    '["Olá, gostaria de um orçamento", "Vocês fazem landing page para médicos?", "Como funciona a IA no WhatsApp?"]',
    2
  ),
  (
    'suporte-atendimento',
    'Especialista de Atendimento & Suporte',
    'Dúvidas Operacionais, Prazos & Metodologia',
    'SUPPORT',
    'Tira dúvidas de clientes e prospects sobre prazos de entrega, metodologia em 4 passos e garantia de 30 dias.',
    'Você é o Especialista de Atendimento & Suporte de William Barbosa. Explique a metodologia em 4 passos, prazos médios, garantia de 30 dias e pagamentos.',
    '🛡️',
    0.5,
    2048,
    '["Como funciona o pagamento?", "Qual o prazo de entrega?", "Vocês dão garantia?"]',
    3
  ),
  (
    'arquiteto-solucoes',
    'Arquiteto de Soluções & IA',
    'Consultor Técnico & Engenharia de Software',
    'TECHNICAL',
    'Consultoria técnica sobre arquitetura Next.js 15, integrações de APIs, banco de dados Supabase e automações com IA.',
    'Você é o Arquiteto de Soluções & Engenheiro de IA de William Barbosa. Esclareça viabilidade técnica, arquitetura de sistemas e segurança da stack Next.js e Supabase.',
    '🏗️',
    0.6,
    4096,
    '["Por que Next.js em vez de WordPress?", "Como a IA é integrada no WhatsApp?", "O banco é seguro?"]',
    4
  ),
  (
    'copywriter-estrategico',
    'Copywriter Estratégico',
    'Redator Executivo & Estrategista de Conteúdo',
    'CONTENT',
    'Redige artigos, pautas para o blog, scripts de vendas e headlines persuasivas no tom de voz sofisticado da marca.',
    'Você é o Copywriter Estratégico de William Barbosa. Crie textos persuasivos, sofisticados e focados em conversão e ROI.',
    '✍️',
    0.8,
    4096,
    '["Crie uma headline para landing page", "Ideia de artigo sobre IA", "Roteiro de abordagem"]',
    5
  )
ON CONFLICT (slug) DO NOTHING;

-- 9. LEADS & DIAGNOSTICS
CREATE TABLE IF NOT EXISTS diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID,
  client_name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  segment TEXT,
  challenge TEXT,
  current_process TEXT,
  goal TEXT,
  maturity_score INTEGER DEFAULT 0,
  is_custom_need BOOLEAN NOT NULL DEFAULT FALSE,
  recommended_solution TEXT,
  summary TEXT,
  provider_used TEXT,
  model_used TEXT,
  raw_payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL DEFAULT 'SITE',
  status TEXT NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, PROPOSAL, CLIENT, LOST
  diagnostic_id UUID REFERENCES diagnostics(id) ON DELETE SET NULL,
  recommended_services_json JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details_json JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_page_sections_page ON page_sections(page_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_logs(created_at DESC);
