# Eduvia

Plataforma de estudos com IA para qualquer estudante. O aluno envia os próprios materiais (PDF, DOCX, imagens, texto) e a IA monta o plano de estudo, as sessões com texto e perguntas, as revisões espaçadas e o banco de erros.

- Arquitetura, modelo de dados, telas e fases: [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- Status: **Fase 1 (MVP) concluída.** Próximas: Fase 2 (jogo da cobrinha, simulados, redação, painel de desempenho, Professor IA) e Fase 3 (grupos, pagamento, notificações, conquistas).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · PostgreSQL 16 + pgvector · Prisma 7 · Better Auth (e-mail/senha + Google) · pg-boss (fila no próprio Postgres) · Claude API (geração/correção/OCR) · Voyage AI (embeddings) · armazenamento S3-compatível (Cloudflare R2 em produção, disco local no desenvolvimento).

```
src/
  app/                 telas e rotas de API (Next.js)
    (app)/             área logada: início, preparações, estudar, revisões, ajustes, assinatura
    actions/           server actions
    api/               upload, status de materiais, arquivos, exportação LGPD, auth
  lib/
    core/              regras puras e testadas: planner, revisão espaçada, perfis, @, datas
    ai/                Claude (saída estruturada, cache, custo), embeddings, modo simulado
    materials/         extração de texto/OCR, divisão em trechos, pipeline de processamento
    plan.ts, study.ts  plano de estudo e sessão (conteúdo, respostas, conclusão)
  worker/              processo da fila: materiais, planos, lembretes, replanejamento diário
prisma/                schema, migrações, seed
e2e/                   testes de ponta a ponta (Playwright)
```

## Rodar localmente

Requisitos: Node 22+, e PostgreSQL 16 com pgvector (o `docker-compose.yml` sobe um pronto).

```bash
docker compose up -d            # Postgres (pgvector) + Mailpit (e-mails em http://localhost:8025)
cp .env.example .env            # ajuste se precisar; sem chaves de IA roda em modo de demonstração
npm install
npx prisma migrate deploy       # cria as tabelas (e a extensão vector)
npm run db:seed                 # planos semanal e mensal

npm run dev                     # app em http://localhost:3000
npm run worker                  # em outro terminal: processa PDFs, planos e lembretes
```

- **Sem `ANTHROPIC_API_KEY`** o app funciona em **modo de demonstração**: o texto de estudo e as questões são montados com frases do próprio material (sem custo, bom para testar o fluxo). Com a chave, tudo é gerado pelo Claude.
- **Sem `VOYAGE_API_KEY`** a busca nos materiais usa vetores locais simples. Se ativar a Voyage depois, reenvie os materiais (os vetores antigos não são compatíveis).
- **Sem `SMTP_URL`** os e-mails (lembrete, consentimento do responsável, redefinição de senha) aparecem no terminal. Com o Mailpit: `SMTP_URL="smtp://localhost:1025"`.
- Login com Google: preencha `GOOGLE_CLIENT_ID/SECRET` (redirecionamento: `{APP_URL}/api/auth/callback/google`). Sem eles o botão não aparece.

## Testes

```bash
npm test                        # unidade: planner, revisão espaçada, @, leitor de edital simulado
npm run typecheck

# ponta a ponta (com o app e o worker rodando, de preferência com AI_MODE=mock):
npm run build && npm start      # terminal 1
npm run worker                  # terminal 2
npx playwright install chromium # uma vez
npm run test:e2e                # terminal 3
```

## O que testar na Fase 1

1. **Cadastro e @**: crie uma conta; ao digitar o @ a disponibilidade aparece em tempo real (maiúsculas, acentos e @ repetido são recusados).
2. **Menor de idade**: cadastre com nascimento abaixo de 18 anos. A conta fica bloqueada em "aguardando responsável"; o link chega no e-mail do responsável; ao autorizar, a conta é liberada.
3. **Preparação**: crie uma de cada tipo. Os campos mudam conforme o tipo (série/matéria, prova, curso/disciplina, edital para concurso).
4. **Materiais**: envie vários PDFs de uma vez (arraste e solte), um DOCX e um texto colado. Acompanhe *na fila → processando (etapas) → pronto*. Envie o mesmo PDF duas vezes: o segundo fica pronto quase na hora (reaproveitamento por hash, sem custo de IA). Com a chave da Anthropic, teste um PDF escaneado (OCR).
5. **Concurso**: envie o edital. Disciplinas, assuntos, pesos e banca aparecem em "Assuntos"; os PDFs de conteúdo são ligados aos assuntos do edital.
6. **Plano**: com 15 min/dia, cada sessão tem 15 min. Coloque uma data de prova próxima para ver o aviso de tempo insuficiente. Mude dias/horário em Ajustes e veja o plano ser refeito.
7. **Sessão de estudo**: texto com links para a página do PDF → destaques e "para entender" → recuperação ativa (resposta aberta corrigida) → objetivas com explicação → concluir.
8. **Banco de erros e revisões**: as erradas aparecem em Revisões → Banco de erros; saem depois de 2 acertos seguidos. Ao concluir um assunto, R1–R4 (1, 7, 15, 30 dias, configuráveis) entram no plano.
9. **Início**: o que fazer hoje, sequência de dias, XP/nível, meta semanal, pontos de atenção (assuntos com menos de 50% de acerto).
10. **Configurações**: trocar @, tema claro/escuro, exportar dados (JSON), excluir conta.

## Deploy no Render

O `render.yaml` cria o **web**, o **worker** e o **PostgreSQL** (que suporta pgvector).

1. Crie um bucket no **Cloudflare R2** (ou S3) e uma chave de acesso. Configure o CORS do bucket para aceitar `PUT` e `GET` vindos do domínio do app (o navegador envia os arquivos direto para o bucket).
2. No Render: **New → Blueprint** → selecione o repositório.
3. Preencha as variáveis do grupo `eduvia-shared` (URL do app, chaves de IA, R2, SMTP, Google).
4. As migrações e o seed rodam sozinhos em cada deploy (`preDeployCommand`).

## Notas de desenvolvimento

- Ao criar migrações com `prisma migrate dev`, o Prisma tenta remover o índice vetorial `Chunk_embedding_hnsw_idx` (criado em SQL). Apague essa linha `DROP INDEX` da migração gerada.
- Modelo e esforço da IA por tarefa: `src/lib/ai/client.ts` (variáveis `AI_MODEL_DEFAULT`, `AI_MODEL_SESSION`, `AI_MODEL_GRADE`...). O custo de cada chamada fica na tabela `AiUsage`.
- Cobrança: `BILLING_ENFORCED=true` passa a exigir assinatura depois dos 3 dias de teste. O checkout (Asaas, Pix + cartão) entra na Fase 3.
