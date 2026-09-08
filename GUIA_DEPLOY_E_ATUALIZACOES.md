# 📘 GUIA OFICIAL DE ARQUITETURA, DEPLOY & PADRÃO DE ATUALIZAÇÕES
**William Barbosa — Sites de Alta Conversão, Portfólio, Blog & Hub de Inteligência Artificial**
**Domínio Oficial**: [https://www.williambdesigner.com.br](https://www.williambdesigner.com.br)

---

## 1. 🌟 O que é este Projeto?

Este projeto é a plataforma digital proprietária de **William Barbosa**, desenvolvida como um ecossistema completo de alta conversão, autoridade e inteligência artificial:

### 🛠️ Stack Tecnológica
* **Framework**: **Next.js 15+ (App Router)** com React 19 e TypeScript.
* **Estilização**: Tailwind CSS + CSS Puro (Design Editorial de Alta Conversão, Dark Mode e Microinterações).
* **Animações**: Framer Motion + Lucide React Icons.
* **Autenticação**: Sessões seguras com JWT assinado (`jose`) e Cookies `httpOnly` para o painel restrito.
* **Banco de Dados Produção**: **Supabase (PostgreSQL na nuvem)** conectado para sincronização em tempo real.
* **Banco de Dados Local**: **SQLite (`better-sqlite3`)** com inicialização e auto-seeding na pasta `data/site.db`.
* **Hub de Inteligência Artificial**: Roteador multi-provedor (Gemini, OpenAI, Anthropic, Groq, OpenRouter) para geração de artigos com 1 clique e agente consultor interativo.

---

## 2. 🗺️ Mapa de Estrutura e Rotas

### 🌐 Rotas Públicas (Frontend)
* **`/`**: Home Page completa com Hero dinâmico do CMS, portfólio de cases reais, prova social, carrosséis infinitos e FAQ.
* **`/blog`**: Portal público de artigos estratégicos, filtros por categoria e busca em tempo real.
* **`/blog/[slug]`**: Leitor de artigos individuais com suporte a Markdown dinâmico e meta tags OpenGraph de SEO.
* **`/projetos`**: Catálogo completo com portfólio expandido de projetos e capas em alta resolução.
* **`/diagnostico`**: Agente Consultor de IA interativo que gera Dossiê Estratégico com score de maturidade digital.

### 🛡️ Painel Administrativo (`/admin`)
* **`/admin/login`**: Tela de autenticação editorial restrita.
  * **E-mail padrão**: `admin@williambdesigner.com.br`
  * **Senha padrão**: `admin123456`
* **`/admin`**: Dashboard executivo com métricas em tempo real (Leads, Artigos, Requisições de IA e Dossiês).
* **`/admin/site`**: CMS dinâmico para alterar textos, Hero, chamadas e links da Home sem mexer no código.
* **`/admin/blog`**: Gerenciador de Artigos com status (`DRAFT`, `PUBLISHED`, `SCHEDULED`).
* **`/admin/blog/new`**: Criador de posts manual e **"Gerar com IA"** (gera artigo completo via IA com 1 clique).
* **`/admin/leads`**: CRM comercial com pipeline de clientes e disparo direto para WhatsApp.
* **`/admin/ai/agents` & `/admin/ai/providers`**: Gestor de modelos de IA, agentes treinados e chaves de API.

---

## 3. 🏗️ Como Funciona a Hospedagem no cPanel (Napoleon Host)

A hospedagem está estruturada no cPanel da **Napoleon Host** utilizando o **Setup Node.js App (Phusion Passenger)**:

```
/home/will9196/
│
├── site-william/                   <-- PASTA PRINCIPAL DA APLICAÇÃO NODE.JS
│   ├── .next/                      <-- Build compilado de produção
│   ├── data/site.db                <-- Banco de dados local (protegido contra exclusão)
│   ├── public/assets/              <-- Fotos, logos e ícones
│   ├── server.js                   <-- Arquivo de inicialização do servidor de produção
│   ├── package.json
│   └── next.config.ts
│
└── public_html/                    <-- PORTA DE ENTRADA WEB (APACHE)
    ├── .htaccess                   <-- Regra de ponte do CloudLinux para o Node.js
    ├── _next/static/               <-- Arquivos de estilo (CSS) e Javascript
    ├── assets/                     <-- Fotos dos projetos e logos públicas
    └── favicon.png
```

---

## 4. 🔄 PADRÃO OFICIAL PARA FAZER ALTERAÇÕES E ATUALIZAR O SITE

Sempre que você ou um assistente de IA fizer qualquer alteração no código (adicionar seções, mudar textos, criar novas rotas), siga este fluxo padronizado:

###  Passo 1: Desenvolver e Testar Localmente
No terminal do seu computador (no VS Code / Antigravity):
```bash
# Rodar o site em modo desenvolvimento
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) e valide as alterações.

---

### Passo 2: Gerar o Build de Produção
Antes de subir para o ar, gere o build compilado no seu computador:
```bash
npm run build
```
*(Ele compila todas as páginas estáticas e rotas dinâmicas sem erro).*

---

### Passo 3: Criar o Pacote Leve de Atualização
Gere o arquivo `next-clean.zip` (que tem menos de 2 MB):
```bash
# No prompt de comando (cmd / powershell):
cmd.exe /c "del next-clean.zip & tar.exe -a -c -f next-clean.zip .next/server .next/static .next/BUILD_ID .next/*.json"
```

---

### Passo 4: Salvar as Alterações no GitHub
Salve o código no repositório oficial do GitHub:
```bash
git add .
git commit -m "feat: descreva as melhorias que você fez"
git push origin main
```
*(Isso garante que o seu GitHub esteja sempre 100% atualizado e com backup de tudo).*

---

### Passo 5: Atualizar no cPanel (1 minuto)
1. Abra o **Gerenciador de Arquivos** do cPanel e entre na pasta **`site-william`**.
2. Clique em **Upload** e envie o arquivo `next-clean.zip` recém-gerado.
3. Clique com o botão direito nele e selecione **Extract** (Extrair) para atualizar os arquivos compilados.
4. *(Opcional - apenas se você tiver adicionado novas fotos)*: Copie a pasta `site-william/public/assets` para `/public_html/assets`.
5. Vá na tela do **Setup Node.js App** no cPanel e clique no botão **"RESTART"** (Reiniciar).

Pronto! O seu site `www.williambdesigner.com.br` estará imediatamente atualizado no ar com as novas funcionalidades!

---

## 5. 🔑 Variáveis de Ambiente Oficiais (Configuradas no cPanel)

Estas variáveis devem estar cadastradas no **Setup Node.js App** na seção **Environment variables**:

| Nome | Descrição |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://djythhunlppvuxkedgry.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço administrativa do Supabase |
| `ADMIN_JWT_SECRET` | `william-barbosa-admin-super-secret-key-2026-secure` |

---

## 6. 💡 Resumo de Manutenção e Dicas Rápidas
* **O banco de dados do painel (`data/site.db`) nunca é apagado** nas atualizações.
* **O Supabase é sincronizado na nuvem**, garantindo redundância e performance.
* **O `server.js` roda em modo de produção forçado** (`dev: false`), garantindo início instantâneo e baixo consumo de memória.
