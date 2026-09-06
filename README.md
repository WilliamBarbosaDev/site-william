# William Barbosa — Sites de Alta Conversão, Portfólio, Blog & Hub de Inteligência Artificial

Plataforma completa de presença digital e conversão para **William Barbosa**, integrando Home institucional de alta performance, Blog Estratégico, Portfólio de 34 projetos reais, Agente Consultor com IA (`/diagnostico`) e um **Painel Administrativo Completo (`/admin`)** com CMS, CRM de Leads e Roteador Multi-Chaves de IA.

---

> [!WARNING]
> ### 🚨 CONFIGURAÇÃO PENDENTE NO SUPABASE
> O sistema está operando localmente com o banco de dados **SQLite (`data/site.db`)**.
> Para publicar na **Vercel** ou em ambiente de nuvem de produção sem perder dados, você **AINDA PRECISA** executar o script SQL no **Supabase**.
> 
> 📄 **Script SQL pronto**: [`supabase_schema.sql`](./supabase_schema.sql)  
> 📖 **Guia Passo a Passo**: [`DOCUMENTACAO_SISTEMA_E_SUPABASE.md`](./DOCUMENTACAO_SISTEMA_E_SUPABASE.md)

---

## ⚡ Como Iniciar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse no navegador:
- **Site Público**: [http://localhost:3000](http://localhost:3000)
- **Blog**: [http://localhost:3000/blog](http://localhost:3000/blog)
- **Diagnóstico IA**: [http://localhost:3000/diagnostico](http://localhost:3000/diagnostico)
- **Painel Administrativo**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 🔑 Credenciais do Administrador
- **E-mail**: `admin@williambdesigner.com.br`
- **Senha**: `admin123456`

---

## 📚 Documentação Completa

Consulte o arquivo [`DOCUMENTACAO_SISTEMA_E_SUPABASE.md`](./DOCUMENTACAO_SISTEMA_E_SUPABASE.md) para ver:
1. Arquitetura completa da solução.
2. Todas as rotas administrativas e públicas.
3. Como adicionar chaves de API (Groq, OpenRouter, OpenAI, Gemini, Anthropic ou customizadas).
4. Como utilizar o roteador inteligente com fallback automático.
5. Passo a passo detalhado para configurar o projeto no **Supabase**.
