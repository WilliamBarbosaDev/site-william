---
name: cpanel-deploy-workflow
description: Guia e padrao de desenvolvimento, build e deploy da plataforma William Barbosa para GitHub e cPanel da Napoleon Host. Use sempre que for fazer alteracoes, gerar builds ou publicar novidades no site williambdesigner.com.br.
---

# Skill: Workflow de Atualização & Deploy no cPanel (Napoleon Host)

Esta skill documenta o procedimento operacional padrão para implementar alterações, gerar builds de produção e publicar atualizações no site **`www.williambdesigner.com.br`**.

---

## 1. 🏗️ Arquitetura do Projeto

* **Stack**: Next.js 15+ (App Router) + React 19 + TypeScript + Tailwind CSS v4.
* **Backend & Dados**: Supabase (PostgreSQL na nuvem) + SQLite local em `data/site.db`.
* **Servidor em Produção**: CloudLinux cPanel (Napoleon Host) gerenciado por Phusion Passenger através de `server.js`.
* **Domínio Oficial**: `https://www.williambdesigner.com.br`

---

## 2. ⚠️ Restrições Críticas do cPanel da Napoleon Host (Conhecimento Mandatório)

1. **Limite de Processos (CloudLinux EAGAIN)**: O servidor da Napoleon Host bloqueia comandos que abrem múltiplos subprocessos (`spawn / fork`). Por isso, **NUNCA** tente rodar `npm run build` ou `next build` diretamente no terminal do cPanel, pois o CloudLinux derruba o processo com `EAGAIN`. O build DEVE ser feito localmente ou via GitHub Actions.
2. **Single Thread / Webpack Build**: O `next.config.ts` está configurado com `cpus: 1`, `workerThreads: false` e `images: { unoptimized: true }` para garantir compatibilidade total.
3. **Persistência de Dados**: O arquivo `data/site.db` armazena o banco local de leads, artigos e configurações do CMS. **NUNCA sobrescreva a pasta `data/`** durante os deploys.

---

## 3. 🚀 Fluxo Padronizado de Atualização (Passo a Passo)

Sempre que concluir alterações no código do projeto:

### Passo 1: Validar e Compilar
```bash
# Executar a compilação de produção
npm run build
```

### Passo 2: Empacotar o Build Leve
```bash
# Gerar o arquivo compactado next-clean.zip (~1.7 MB)
cmd.exe /c "del next-clean.zip & tar.exe -a -c -f next-clean.zip .next/server .next/static .next/BUILD_ID .next/*.json"
```

### Passo 3: Salvar e Enviar para o GitHub
```bash
git add .
git commit -m "feat: [resumo das alterações implementadas]"
git push origin main
```

### Passo 4: Atualizar no cPanel (Napoleon Host)
1. No **Gerenciador de Arquivos** do cPanel, acesse a pasta `/home/will9196/site-william`.
2. Faça o upload do arquivo `next-clean.zip`.
3. Clique com o botão direito em `next-clean.zip` e selecione **Extract** (Extrair) para substituir a pasta `.next`.
4. *(Se adicionou novas fotos em `public/assets/`)*: Copie a pasta `site-william/public/assets` para `/public_html/assets`.
5. No cPanel > **Setup Node.js App**, clique no botão **"RESTART"**.

---

## 4. 🔑 Verificação Pós-Deploy

Após o deploy, verifique sempre:
1. **Frontend Público**: [https://www.williambdesigner.com.br](https://www.williambdesigner.com.br)
2. **Painel de Controle Admin**: [https://www.williambdesigner.com.br/admin](https://www.williambdesigner.com.br/admin)
3. **Autenticação**: Login com `admin@williambdesigner.com.br` / `admin123456`.
