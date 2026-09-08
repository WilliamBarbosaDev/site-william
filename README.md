# William Barbosa — Sites de Alta Conversão, Portfólio, Blog & Hub de Inteligência Artificial
**Domínio Oficial**: [https://www.williambdesigner.com.br](https://www.williambdesigner.com.br)

Plataforma completa de presença digital, autoridade e conversão para **William Barbosa**, integrando Home institucional editorial de alta performance, Blog Estratégico com geração de conteúdo por IA, Portfólio de 34 cases reais, Agente Consultor Interativo (`/diagnostico`) e um **Painel Administrativo Completo (`/admin`)** com CMS, CRM de Leads, banco de dados Supabase e Roteador Multi-Chaves de IA.

---

> [!NOTE]
> ### ✅ PRODUÇÃO NO AR & SUPABASE CONECTADO
> * O site está em produção no domínio oficial: **[https://www.williambdesigner.com.br](https://www.williambdesigner.com.br)**
> * Banco de dados de produção no **Supabase (PostgreSQL)** e banco local **SQLite** sincronizados.
> * Painel Administrativo em **`/admin`** com login restrito.

---

## ⚡ Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install --legacy-peer-deps

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse no navegador:
* **Site Público**: [http://localhost:3000](http://localhost:3000)
* **Blog**: [http://localhost:3000/blog](http://localhost:3000/blog)
* **Diagnóstico com IA**: [http://localhost:3000/diagnostico](http://localhost:3000/diagnostico)
* **Painel Administrativo**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 🔑 Credenciais do Administrador
* **E-mail**: `admin@williambdesigner.com.br`
* **Senha**: `admin123456`

---

## 📚 Documentações do Projeto

Consulte os guias especializados inclusos no repositório:
1. **[Guia Oficial de Deploy e Atualizações](./GUIA_DEPLOY_E_ATUALIZACOES.md)**: Passo a passo para fazer alterações, compilar e atualizar o site no cPanel da Napoleon Host e GitHub.
2. **[Documentação Geral da Plataforma e Supabase](./DOCUMENTACAO_SISTEMA_E_SUPABASE.md)**: Arquitetura detalhada, mapa de rotas, configuração multi-provedor de IA e schema do banco de dados.
3. **[Skill Antigravity](./.agents/skills/cpanel-deploy-workflow/SKILL.md)**: Instruções automatizadas para assistentes de IA realizarem o fluxo de build e deploy.
