# 📘 DOCUMENTAÇÃO GERAL DA PLATAFORMA & ARQUITETURA
**William Barbosa — Sites de Alta Conversão, Portfólio, Blog & Hub de Inteligência Artificial**

---

> [!WARNING]
> ### 🚨 ATENÇÃO: CONFIGURAÇÃO PENDENTE NO SUPABASE
> Atualmente, a plataforma está rodando e funcionando 100% em ambiente de desenvolvimento com o banco de dados **SQLite local** (`data/site.db`).
> 
> **Para colocar o site em produção definitiva (Vercel, AWS ou servidor em nuvem sem disco permanente), você AINDA PRECISA realizar a configuração no Supabase.**
> 
> O script SQL completo e pronto para colar no Supabase já foi gerado na raiz do projeto: [`supabase_schema.sql`](file:///c:/Users/adrie/Downloads/site-william-master/site-william-master/supabase_schema.sql).
> 
> **Siga o passo a passo da [Seção 4 deste documento](#4-guia-passo-a-passo-para-configurar-o-supabase) para concluir a configuração.**

---

## 1. 🏗️ Arquitetura da Solução

A plataforma foi construída sob a premissa de **Zero Regressão Visual e Máximo Desempenho**, integrando um CMS completo e um motor multi-provedor de Inteligência Artificial sobre a stack original do projeto:

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+ (App Router)** | Renderização híbrida (SSR, SSG e APIs Route Handlers). |
| **Linguagem** | **TypeScript** | Tipagem estrita de ponta a ponta sem erros (`tsc --noEmit` validado). |
| **Estilização** | **Tailwind CSS + Vanilla CSS** | Design editorial de alta conversão Awesomic (Dark Mode profundo `#09090b`). |
| **Animações** | **Framer Motion + Lucide Icons** | Microinterações suaves, badges pulsantes e transições responsivas. |
| **Autenticação** | **JWT assinado (`jose`)** | Sessões seguras via Cookies `httpOnly` (`admin_session`), com proteção real de API no servidor. |
| **Banco Atual** | **SQLite (`better-sqlite3`)** | Banco relacional local rápido com 18 tabelas, auto-seeding e modo `DELETE`. |
| **Banco Produção** | **Supabase (PostgreSQL)** | Estrutura relacional 100% espelhada em [`supabase_schema.sql`](file:///c:/Users/adrie/Downloads/site-william-master/site-william-master/supabase_schema.sql). |
| **Contato Oficial** | **WhatsApp Direto** | Número oficial padronizado: `5592982824592`. |

---

## 2. 🗺️ Mapa de Rotas do Projeto

### 🌐 Rotas Públicas (Frontend)
- **`/`**: Home page institucional completa com Hero dinâmico conectado ao CMS, Seção de Serviços, Portfólio de 34 projetos reais, Prova Social, FAQ e CTA de Alta Conversão.
- **`/blog`**: Portal público de artigos estratégicos, filtros por categoria, busca e cards responsivos.
- **`/blog/[slug]`**: Leitor de artigo individual com suporte a Markdown, SEO meta tags dinâmicas e OpenGraph.
- **`/projetos`**: Catálogo completo com 34 projetos e capas reais em `assets/fotos_projetos/`.
- **`/diagnostico`**: Agente Consultor de IA interativo que entrevista o lead e gera um Dossiê Estratégico com score de maturidade digital.

### 🛡️ Rotas Administrativas (`/admin`)
- **`/admin/login`**: Tela de autenticação editorial escura com proteção contra força bruta.
  - **E-mail padrão**: `admin@williambdesigner.com.br`
  - **Senha padrão**: `admin123456`
- **`/admin`**: Dashboard executivo com métricas em tempo real (Leads, Artigos, Requisições de IA e Dossiês).
- **`/admin/site`**: CMS de Conteúdo para alterar Hero, Soluções, Textos e CTAs sem tocar no código.
- **`/admin/blog`**: Gerenciador do Blog com listagem, status (`DRAFT`, `PUBLISHED`, `SCHEDULED`, `ARCHIVED`).
- **`/admin/blog/new`**: Criador de artigos com modo manual e **"Gerar Artigo com IA"** (gera rascunho com 1 clique via Groq/OpenAI/Gemini).
- **`/admin/blog/ideas`**: Banco de pautas e tópicos estratégicos de conteúdo.
- **`/admin/blog/automation`**: Agendador de geração de conteúdo autônomo semanal/mensal.
- **`/admin/ai/agents`**: **Hub de Agentes de IA Treinados & Criação de Agentes** com chat playground interativo para teste em tempo real.
- **`/admin/ai/providers`**: **Hub Multi-Chaves** para adicionar chaves de API da Groq, OpenRouter, OpenAI, Gemini, Anthropic ou qualquer endpoint customizado.
- **`/admin/ai/router`**: Roteador inteligente com seleção de modelo primário e até 2 modelos de fallback por tarefa.
- **`/admin/ai/prompts`**: Editor de prompts do sistema com controle de versões históricas.
- **`/admin/ai/logs`**: Registro detalhado de telemetria, tempo de resposta (ms), tokens e custos.
- **`/admin/leads`**: CRM comercial com pipeline de leads (`NOVO`, `CONTATADO`, `QUALIFICADO`, `PROPOSTA`, `CLIENTE`) e botão de disparo para WhatsApp.
- **`/admin/diagnostics`**: Visualizador de dossiês gerados pela IA no `/diagnostico`.
- **`/admin/projects`**: Gerenciador de portfólio e cases de sucesso.
- **`/admin/services`**: **Catálogo de Serviços & Precificação**: Definição de valores de referência (ex: R$ 2.800), modelos de contratação, entregáveis e prazos médios de entrega.
- **`/admin/media`**: Biblioteca de imagens com upload para `public/uploads`.
- **`/admin/seo`**: Controle global de OpenGraph, Title, Meta Description e Indexação.
- **`/admin/settings/site`**: Configurações gerais e contato oficial.

---

## 2.1 👥 Os 5 Agentes de IA Pré-Treinados com a Sua Empresa

Todos os agentes vêm de fábrica **100% calibrados e treinados** com as informações de William Barbosa, seu posicionamento de alta autoridade, o portfólio de 34 cases, os serviços com seus respectivos valores e o contato do WhatsApp:

1. 💼 **William Closer AI (Comercial & Fechamento)**:
   - **Objetivo**: Conduzir conversas de vendas de alto ticket, quebrar objeções de investimento demonstrando o ROI de um site estratégico e fechar negócios no WhatsApp (`+55 92 98282-4592`).
2. ⚡ **SDR Qualificador de Leads (Pré-Vendas & Triagem)**:
   - **Objetivo**: Recepcionar contatos em menos de 5 segundos, qualificar o segmento, o gargalo atual e a urgência, entregando o lead pronto para proposta.
3. 🛡️ **Especialista de Atendimento & Suporte**:
   - **Objetivo**: Esclarecer dúvidas sobre metodologia de entrega (os 4 passos), prazos médios (10 a 25 dias), garantia de 30 dias e condições de pagamento (50/50 ou até 12x).
4. 🏗️ **Arquiteto de Soluções & IA (Engenharia Técnica)**:
   - **Objetivo**: Atuar como consultor técnico avançado, explicando a superioridade da stack Next.js 15 sobre plataformas lentas (WordPress/Elementor), além de modelagem de dados e integrações com IA.
5. ✍️ **Copywriter Estratégico (Conteúdo & Blog)**:
   - **Objetivo**: Escrever artigos para o blog e roteiros de vendas no tom de voz sofisticado, conciso e persuasivo da marca.

### 🛠️ Ambiente para Criação de Novos Agentes & Teste Interativo
- Acesse [`/admin/ai/agents`](http://localhost:3000/admin/ai/agents) e clique em **"Criar Novo Agente de IA"**.
- Você pode definir: Nome, Cargo, Categoria, Provedor/Modelo preferido, Temperatura e Perguntas de Gatilho.
- O botão **"Injetar Conhecimento & Preços da Empresa"** insere automaticamente o briefing completo da empresa nas instruções do novo agente!
- **Playground de Chat em Tempo Real**: Clique em **"Testar Agente"** em qualquer card para conversar ao vivo com a IA antes de colocá-la em operação.

---

## 3. 🤖 Sistema Multi-Chave & Roteador de Inteligência Artificial

O sistema conta com um motor de inteligência artificial unificado em `src/lib/ai/router.ts`, permitindo plugar qualquer inteligência artificial do mercado:

### A. Provedores Suportados Nativamente
1. **Groq Cloud** (`https://api.groq.com/openai/v1`):
   - Modelos: `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`.
   - Velocidade: Inferência de até 500 tokens/segundo em chips LPU.
2. **OpenRouter** (`https://openrouter.ai/api/v1`):
   - Acesso universal com uma única chave a: `deepseek/deepseek-chat` (V3), `deepseek/deepseek-r1`, `anthropic/claude-3.5-sonnet`, `meta-llama/llama-3.3-70b-instruct`, etc.
3. **OpenAI** (`https://api.openai.com/v1`):
   - Modelos: `gpt-4o`, `gpt-4o-mini`, `o1-preview`.
4. **Google Gemini** (`https://generativelanguage.googleapis.com/v1beta`):
   - Modelos: `gemini-2.5-flash`, `gemini-2.5-pro`.
5. **Anthropic Claude** (`https://api.anthropic.com/v1`):
   - Modelos: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`.
6. **Provedor Customizado (OpenAI Compatível)**:
   - Permite conectar APIs diretas da DeepSeek (`https://api.deepseek.com/v1`), Together AI, Mistral, Perplexity ou instâncias locais do Ollama.

### B. Funcionalidades Exclusivas no Painel
- **Botão "Testar Ping"**: Executa uma chamada real ao endpoint da IA e mede o tempo de resposta em milissegundos.
- **Cascata de Fallback (Failover)**: Se o modelo primário cair por limite de cota (Rate Limit 429) ou indisponibilidade (500), a requisição é transferida em tempo real para o Fallback 1 e em seguida para o Fallback 2.
- **Blindagem Anti-Custo**: As chaves ficam salvas de forma segura no banco de dados e são mascaradas na interface (`gsk_abc••••123`).

---

## 4. 🗄️ GUIA PASSO A PASSO PARA CONFIGURAR O SUPABASE

> [!IMPORTANT]
> **Siga este checklist quando for preparar o ambiente para produção final.**

### Passo 1: Criar sua Conta e Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **"New Project"**.
3. Defina:
   - **Name**: `site-william-barbosa` (ou o nome de sua preferência)
   - **Database Password**: Escolha uma senha forte e guarde-a.
   - **Region**: Selecione `South America (São Paulo)` para ter a menor latência no Brasil.
4. Aguarde cerca de 1 a 2 minutos até o Supabase terminar de provisionar o banco de dados.

---

### Passo 2: Executar o Script SQL no Supabase
1. No painel do seu projeto no Supabase, olhe para o menu lateral esquerdo e clique no ícone **SQL Editor** (ou acesse `https://supabase.com/dashboard/project/<seu-projeto>/sql`).
2. Clique no botão **"New Query"**.
3. Abra o arquivo [`supabase_schema.sql`](file:///c:/Users/adrie/Downloads/site-william-master/site-william-master/supabase_schema.sql) localizado na raiz do seu projeto.
4. Copie todo o conteúdo e cole dentro do editor do Supabase.
5. Clique no botão verde **"Run"** (no canto inferior direito).
6. Você verá a mensagem: `Success. No rows returned`. Todas as 18 tabelas, chaves primárias, relações e usuário administrador inicial foram criados com sucesso!

---

### Passo 3: Obter as Chaves de Conexão do Supabase
1. No menu lateral do Supabase, clique na engrenagem de configurações **Project Settings** (no canto inferior esquerdo).
2. Vá em **API**:
   - Copie o **Project URL** (ex: `https://xyzcompany.supabase.co`).
   - Copie a chave **anon / public key** (ex: `eyJhbGci...`).
   - Copie a chave **service_role key** (chave secreta com privilégio de admin para o backend).
3. Vá em **Database**:
   - Na seção **Connection String**, selecione a aba **URI** e copie a URL de conexão direta PostgreSQL (usada para pools e conexões diretas):
     ```
     postgresql://postgres.[SEU-PROJECT-REF]:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
     ```

---

### Passo 4: Configurar as Variáveis de Ambiente no Projeto
No seu projeto local (ou nas variáveis de ambiente da Vercel / Railway / Render), crie ou edite o arquivo `.env.local`:

```env
# =======================================================
# CONFIGURAÇÕES DO SUPABASE (PRODUÇÃO)
# =======================================================
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
DATABASE_URL="postgresql://postgres:sua-senha@db.sua-url.supabase.co:5432/postgres"

# =======================================================
# AUTENTICAÇÃO E SEGURANÇA
# =======================================================
JWT_SECRET="william_barbosa_super_secret_jwt_key_2026"

# =======================================================
# CHAVES DE IA (OPCIONAL NO .ENV - PODE USAR VIA ADMIN)
# =======================================================
GROQ_API_KEY=""
OPENROUTER_API_KEY=""
OPENAI_API_KEY=""
GEMINI_API_KEY=""
ANTHROPIC_API_KEY=""
```

---

## 5. 🚀 Guia Operacional do Dia a Dia

### Como Iniciar o Projeto Localmente
```bash
# Entrar na pasta do projeto
cd c:\Users\adrie\Downloads\site-william-master\site-william-master

# Instalar dependências (caso seja clonado em outra máquina)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```
O site estará acessível em: `http://localhost:3000`

### Como Fazer o Primeiro Acesso ao Painel
1. Acesse: `http://localhost:3000/admin/login`
2. Digite as credenciais:
   - **E-mail**: `admin@williambdesigner.com.br`
   - **Senha**: `admin123456`
3. Clique em **"Entrar no Painel"**.

### Como Adicionar uma Nova Chave de IA
1. No menu do painel, clique em **"Provedores de IA"** (`/admin/ai/providers`).
2. Clique no preset desejado (ex: **GROQ**, **OPENROUTER** ou **OPENAI**).
3. Cole sua chave de API no campo **Chave de API**.
4. Clique em **"Salvar Chave & Provedor"**.
5. No card do provedor recém-adicionado, clique em **"Testar Ping"** para confirmar que a conexão está operando normalmente!
6. Vá em **"Roteamento de IA"** (`/admin/ai/router`) e escolha qual tarefa deve usar esse provedor como modelo principal ou fallback.

### Como Gerar Artigos de Blog com Inteligência Artificial
1. Acesse **Blog** -> **Novo Artigo** (`/admin/blog/new`).
2. Na aba **"Gerar com IA"**, digite o tema desejado (ex: *"Como uma landing page com IA pode triplicar conversões no setor imobiliário"*).
3. Clique em **"Gerar Artigo Completo com IA"**.
4. O motor chamará o provedor ativo configurado no Roteador, gerando título, introdução, seções com subtítulos, conclusão e CTA para o WhatsApp.
5. O artigo é salvo como **RASCUNHO (DRAFT)** para sua revisão antes de ser publicado.

---

## 6. 📞 Contato & Suporte Técnico
- **Proprietário da Plataforma**: William Barbosa
- **WhatsApp Oficial**: `+55 (92) 98282-4592` (`https://wa.me/5592982824592`)
- **E-mail**: `contato@williambdesigner.com.br`
- **Ambiente**: Next.js 15+ App Router, Node.js v20+, SQLite / Supabase PostgreSQL.
