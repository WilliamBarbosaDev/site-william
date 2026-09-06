import { getDatabase } from "./connection";

export function initSchema() {
  const db = getDatabase();

  const ddl = `
    -- 1. Admin Users
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN',
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );

    -- 2. Site Settings
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      updated_at TEXT NOT NULL
    );

    -- 3. Pages & Sections (CMS)
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS page_sections (
      id TEXT PRIMARY KEY,
      page_slug TEXT NOT NULL,
      section_key TEXT NOT NULL,
      title TEXT,
      subtitle TEXT,
      description TEXT,
      cta_text TEXT,
      cta_url TEXT,
      image_url TEXT,
      content_json TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'PUBLISHED',
      updated_at TEXT NOT NULL,
      UNIQUE(page_slug, section_key)
    );

    -- 4. Services
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT,
      image_url TEXT,
      icon TEXT,
      benefits_json TEXT,
      problems_json TEXT,
      price_starting_at TEXT,
      price_model TEXT NOT NULL DEFAULT 'PROJETO_UNICO', -- PROJETO_UNICO, MENSAL_RECORRENTE, SOB_CONSULTA, HORA_CONSULTORIA
      price_notes TEXT,
      deliverables_json TEXT,
      estimated_days INTEGER DEFAULT 15,
      cta_text TEXT,
      cta_url TEXT,
      seo_title TEXT,
      seo_description TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 5. Projects (Portfolio & Cases)
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      client TEXT,
      category TEXT NOT NULL,
      services TEXT,
      description TEXT NOT NULL,
      problem TEXT,
      solution TEXT,
      technologies_json TEXT,
      results_json TEXT,
      cover_image TEXT NOT NULL,
      images_json TEXT,
      project_url TEXT,
      whatsapp_message TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'PUBLISHED',
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 6. Blog
    CREATE TABLE IF NOT EXISTS blog_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS blog_tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      featured_image TEXT,
      category_id TEXT,
      tags_json TEXT,
      author TEXT NOT NULL DEFAULT 'William Barbosa',
      status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, PUBLISHED, ARCHIVED
      scheduled_at TEXT,
      published_at TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      og_image TEXT,
      canonical_url TEXT,
      is_ai_generated INTEGER NOT NULL DEFAULT 0,
      ai_generation_meta TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 7. Content Ideas & Automations
    CREATE TABLE IF NOT EXISTS content_ideas (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      keyword TEXT,
      category TEXT,
      objective TEXT,
      priority TEXT NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
      status TEXT NOT NULL DEFAULT 'IDEA', -- IDEA, PLANNED, GENERATED, PUBLISHED
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content_automations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 0,
      frequency TEXT NOT NULL DEFAULT 'WEEKLY', -- DAILY, WEEKLY, BIWEEKLY, MONTHLY
      day_of_week TEXT DEFAULT 'MONDAY',
      time_of_day TEXT DEFAULT '09:00',
      category_id TEXT,
      themes_json TEXT,
      keywords_json TEXT,
      provider_id TEXT,
      model_id TEXT,
      prompt_id TEXT,
      auto_publish INTEGER NOT NULL DEFAULT 0,
      last_run_at TEXT,
      next_run_at TEXT,
      created_at TEXT NOT NULL
    );

    -- 8. AI Engine: Providers, Models, Routes, Prompts, Logs
    CREATE TABLE IF NOT EXISTS ai_providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      provider_type TEXT NOT NULL, -- openai, gemini, anthropic, custom
      api_key_encrypted TEXT,
      base_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      priority INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'READY',
      last_used_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_models (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL,
      name TEXT NOT NULL,
      model_id TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'GENERAL', -- FAST, REASONING, VISION, GENERAL
      is_active INTEGER NOT NULL DEFAULT 1,
      priority INTEGER NOT NULL DEFAULT 1,
      max_tokens INTEGER DEFAULT 4096,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_routes (
      id TEXT PRIMARY KEY,
      task_name TEXT UNIQUE NOT NULL,
      primary_provider_id TEXT,
      primary_model_id TEXT,
      fallback1_provider_id TEXT,
      fallback1_model_id TEXT,
      fallback2_provider_id TEXT,
      fallback2_model_id TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_prompts (
      id TEXT PRIMARY KEY,
      identifier TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      prompt_template TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_prompt_versions (
      id TEXT PRIMARY KEY,
      prompt_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      prompt_template TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_logs (
      id TEXT PRIMARY KEY,
      task_name TEXT NOT NULL,
      provider_used TEXT,
      model_used TEXT,
      tokens_prompt INTEGER DEFAULT 0,
      tokens_completion INTEGER DEFAULT 0,
      duration_ms INTEGER DEFAULT 0,
      status TEXT NOT NULL, -- SUCCESS, FALLBACK, ERROR
      error_message TEXT,
      created_at TEXT NOT NULL
    );

    -- 8.1 AI Specialized Agents (Closer, SDR, Suporte, Custom)
    CREATE TABLE IF NOT EXISTS ai_agents (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'CUSTOM', -- SALES, SDR, SUPPORT, TECHNICAL, CONTENT, CUSTOM
      description TEXT NOT NULL,
      system_instructions TEXT NOT NULL,
      provider_id TEXT,
      model_id TEXT,
      temperature REAL DEFAULT 0.7,
      max_tokens INTEGER DEFAULT 4096,
      avatar_emoji TEXT DEFAULT '🤖',
      trigger_phrases_json TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- 9. Leads & Diagnostics
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      phone TEXT NOT NULL,
      email TEXT,
      source TEXT NOT NULL DEFAULT 'SITE',
      status TEXT NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, PROPOSAL, CLIENT, LOST
      diagnostic_id TEXT,
      recommended_services_json TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS diagnostics (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      client_name TEXT NOT NULL,
      company_name TEXT,
      phone TEXT NOT NULL,
      email TEXT,
      segment TEXT,
      challenge TEXT,
      current_process TEXT,
      goal TEXT,
      maturity_score INTEGER DEFAULT 0,
      is_custom_need INTEGER NOT NULL DEFAULT 0,
      recommended_solution TEXT,
      summary TEXT,
      provider_used TEXT,
      model_used TEXT,
      raw_payload_json TEXT,
      created_at TEXT NOT NULL
    );

    -- 10. Media Library
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- 11. Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details_json TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_page_sections_page ON page_sections(page_slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_ai_agents_slug ON ai_agents(slug);
    CREATE INDEX IF NOT EXISTS idx_ai_agents_active ON ai_agents(is_active);
  `;

  db.exec(ddl);

  // Dynamic migrations for existing databases
  try {
    const serviceCols = db.prepare("PRAGMA table_info(services)").all() as Array<{ name: string }>;
    const colNames = serviceCols.map((c) => c.name);

    if (!colNames.includes("price_starting_at")) {
      db.exec("ALTER TABLE services ADD COLUMN price_starting_at TEXT");
    }
    if (!colNames.includes("price_model")) {
      db.exec("ALTER TABLE services ADD COLUMN price_model TEXT NOT NULL DEFAULT 'PROJETO_UNICO'");
    }
    if (!colNames.includes("price_notes")) {
      db.exec("ALTER TABLE services ADD COLUMN price_notes TEXT");
    }
    if (!colNames.includes("deliverables_json")) {
      db.exec("ALTER TABLE services ADD COLUMN deliverables_json TEXT");
    }
    if (!colNames.includes("estimated_days")) {
      db.exec("ALTER TABLE services ADD COLUMN estimated_days INTEGER DEFAULT 15");
    }
  } catch (err) {
    console.warn("Migration warning for services table:", err);
  }
}
