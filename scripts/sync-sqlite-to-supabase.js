const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');

// 1. Ler credenciais do .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && !k.startsWith('#')) {
    env[k.trim()] = v.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL ou Key não encontrados no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const dbPath = path.join(__dirname, '..', 'data', 'site.db');
const sqlite = new Database(dbPath);

function parseJsonSafe(val) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

async function sync() {
  console.log('🚀 Iniciando sincronização SQLite -> Supabase...');

  // 1. Sincronizar Serviços
  try {
    const services = sqlite.prepare('SELECT * FROM services').all();
    console.log(`📦 Encontrados ${services.length} serviços no SQLite.`);
    for (const s of services) {
      const payload = {
        id: s.id,
        slug: s.slug,
        name: s.name,
        title: s.title,
        short_description: s.short_description,
        full_description: s.full_description,
        image_url: s.image_url,
        icon: s.icon,
        benefits_json: parseJsonSafe(s.benefits_json),
        problems_json: parseJsonSafe(s.problems_json),
        price_starting_at: s.price_starting_at,
        price_model: s.price_model || 'PROJETO_UNICO',
        price_notes: s.price_notes,
        deliverables_json: parseJsonSafe(s.deliverables_json),
        estimated_days: s.estimated_days,
        cta_text: s.cta_text,
        cta_url: s.cta_url,
        seo_title: s.seo_title,
        seo_description: s.seo_description,
        display_order: s.display_order || 0,
        is_active: Boolean(s.is_active),
        created_at: s.created_at,
        updated_at: s.updated_at,
      };
      const { error } = await supabase.from('services').upsert(payload, { onConflict: 'id' });
      if (error) console.error(`Erro ao sincronizar serviço ${s.name}:`, error.message);
    }
    console.log('✅ Serviços sincronizados com sucesso!');
  } catch (err) {
    console.error('Erro em services:', err.message);
  }

  // 2. Sincronizar Projetos
  try {
    const projects = sqlite.prepare('SELECT * FROM projects').all();
    console.log(`📦 Encontrados ${projects.length} projetos no SQLite.`);
    for (const p of projects) {
      const payload = {
        id: p.id,
        slug: p.slug,
        title: p.title,
        client: p.client,
        category: p.category,
        services: p.services,
        description: p.description,
        problem: p.problem,
        solution: p.solution,
        technologies_json: parseJsonSafe(p.technologies_json),
        results_json: parseJsonSafe(p.results_json),
        cover_image: p.cover_image,
        images_json: parseJsonSafe(p.images_json),
        project_url: p.project_url,
        whatsapp_message: p.whatsapp_message,
        is_featured: Boolean(p.is_featured),
        display_order: p.display_order || 0,
        status: p.status || 'PUBLISHED',
        seo_title: p.seo_title,
        seo_description: p.seo_description,
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
      const { error } = await supabase.from('projects').upsert(payload, { onConflict: 'id' });
      if (error) console.error(`Erro ao sincronizar projeto ${p.title}:`, error.message);
    }
    console.log('✅ Projetos sincronizados com sucesso!');
  } catch (err) {
    console.error('Erro em projects:', err.message);
  }

  // 3. Sincronizar Seções do CMS
  try {
    const sections = sqlite.prepare('SELECT * FROM page_sections').all();
    console.log(`📦 Encontradas ${sections.length} seções de CMS no SQLite.`);
    for (const sec of sections) {
      const payload = {
        id: sec.id,
        page_slug: sec.page_slug,
        section_key: sec.section_key,
        title: sec.title,
        subtitle: sec.subtitle,
        description: sec.description,
        cta_text: sec.cta_text,
        cta_url: sec.cta_url,
        image_url: sec.image_url,
        content_json: parseJsonSafe(sec.content_json),
        is_active: Boolean(sec.is_active),
        display_order: sec.display_order || 0,
        status: sec.status || 'PUBLISHED',
        updated_at: sec.updated_at,
      };
      const { error } = await supabase.from('page_sections').upsert(payload, { onConflict: 'page_slug,section_key' });
      if (error) console.error(`Erro ao sincronizar seção ${sec.section_key}:`, error.message);
    }
    console.log('✅ Seções do CMS sincronizadas com sucesso!');
  } catch (err) {
    console.error('Erro em page_sections:', err.message);
  }

  // 4. Sincronizar Prompts de IA
  try {
    const prompts = sqlite.prepare('SELECT * FROM ai_prompts').all();
    console.log(`📦 Encontrados ${prompts.length} prompts de IA no SQLite.`);
    for (const pr of prompts) {
      const payload = {
        id: pr.id,
        identifier: pr.identifier,
        name: pr.name,
        prompt_template: pr.prompt_template,
        version: pr.version || 1,
        is_active: Boolean(pr.is_active),
        updated_at: pr.updated_at,
      };
      const { error } = await supabase.from('ai_prompts').upsert(payload, { onConflict: 'identifier' });
      if (error) console.error(`Erro ao sincronizar prompt ${pr.identifier}:`, error.message);
    }
    console.log('✅ Prompts de IA sincronizados com sucesso!');
  } catch (err) {
    console.error('Erro em ai_prompts:', err.message);
  }

  // 5. Sincronizar Blog Posts
  try {
    const posts = sqlite.prepare('SELECT * FROM blog_posts').all();
    console.log(`📦 Encontrados ${posts.length} posts do blog no SQLite.`);
    for (const post of posts) {
      const payload = {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.cover_image,
        category: post.category,
        tags_json: parseJsonSafe(post.tags_json),
        author_name: post.author_name,
        status: post.status,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
        reading_time_minutes: post.reading_time_minutes || 5,
      };
      const { error } = await supabase.from('blog_posts').upsert(payload, { onConflict: 'slug' });
      if (error) console.error(`Erro ao sincronizar post ${post.title}:`, error.message);
    }
    console.log('✅ Blog Posts sincronizados com sucesso!');
  } catch (err) {
    console.error('Erro em blog_posts:', err.message);
  }

  console.log('\n🎉 SINCRONIZAÇÃO COMPLETA COM O SUPABASE CONCLUÍDA!');
}

sync();
