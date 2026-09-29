# Eduvia

Plataforma de estudos com IA para qualquer estudante. O aluno envia os próprios materiais (PDF, DOCX, imagens, texto) e a IA monta o plano de estudo, as sessões com texto e perguntas, as revisões espaçadas e o banco de erros.

- Arquitetura, modelo de dados, telas e fases: [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- Status: **Fase 1 (MVP) concluída**, com contas por CPF e assinatura manual pelo WhatsApp. Próximas: Fase 2 (jogo da cobrinha, simulados, redação, painel de desempenho, Professor IA) e Fase 3 (grupos, notificações, conquistas).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · PostgreSQL 16 + pgvector · Prisma 7 · Better Auth (CPF/@ + senha) · pg-boss (fila no próprio Postgres) · Claude API (geração/correção/OCR) · Voyage AI (embeddings) · armazenamento S3-compatível (Cloudflare R2 em produção, disco local no desenvolvimento).

```
src/
  app/                 telas e rotas de API (Next.js)
    (app)/             área logada: início, preparações, estudar, revisões, ajustes, assinatura, admin
    actions/           server actions
    api/               upload, status de materiais, arquivos, exportação LGPD, auth
  lib/
    core/              regras puras e testadas: planner, revisão espaçada, perfis, @, CPF, telefone, datas
    ai/                Claude (saída estruturada, cache, custo), embeddings, modo simulado
    materials/         extração de texto/OCR, divisão em trechos, pipeline de processamento
    billing.ts         teste grátis, modo limitado, planos, link do WhatsApp
    plan.ts, study.ts  plano de estudo e sessão (conteúdo, respostas, conclusão)
  worker/              processo da fila: materiais, planos, replanejamento diário
prisma/                schema, migrações, seed
scripts/               make-admin (dá acesso à tela /admin)
e2e/                   testes de ponta a ponta (Playwright)
```

## Contas

- **Cadastro:** nome, CPF, telefone (WhatsApp), @ e senha. Não coletamos e-mail.
- **Login:** CPF **ou** @ + senha (10 tentativas a cada 15 min).
- **Esqueci a senha:** CPF + telefone cadastrado + nova senha. O telefone é exigido porque CPF sozinho é fácil de descobrir e permitiria tomar a conta de outra pessoa.
- O CPF é único (uma conta por pessoa). Internamente o Better Auth guarda um e-mail técnico derivado do CPF, que nunca é exibido nem usado.

## Assinatura (manual, pelo WhatsApp)

- **Teste grátis de 3 dias** com tudo liberado e um aviso fixo no topo ("Modo teste: faltam X dias · Assinar plano").
- Depois do teste, sem plano, a conta entra no **modo limitado**: 1 preparação ativa, 1 sessão de estudo por dia e sem envio de novos materiais (limites em `src/lib/billing.ts`, constante `LIMITED`). O aviso no topo muda para "Teste encerrado — modo limitado".
- **Assinar:** em `/assinatura`, o botão "Assinar pelo WhatsApp" abre o WhatsApp (`WHATSAPP_NUMBER`) com a mensagem pronta (plano, nome e @). Planos: Semanal R$ 7 e Mensal R$ 15. Não há cobrança automática.
- **Liberar o plano (admin):**
  1. Torne sua conta admin: `npm run admin -- @seu.usuario` (no Render: aba *Shell* do serviço web).
  2. Abra `/admin` (aparece no menu lateral), busque o aluno por @, nome, CPF ou telefone e clique em **+ Semanal** ou **+ Mensal**. Se o aluno ainda tem dias pagos, o novo período é somado ao final. **Encerrar** corta o acesso na hora.
  3. A tela também mostra contas, pessoas em teste, assinantes e o valor recebido no mês.

## Rodar localmente

Requisitos: Node 22+, e PostgreSQL 16 com pgvector (o `docker-compose.yml` sobe um pronto).

```bash
docker compose up -d            # Postgres (pgvector)
cp .env.example .env            # sem chaves de IA roda em modo de demonstração
npm install
npx prisma migrate deploy       # cria as tabelas (e a extensão vector)
npm run db:seed                 # planos semanal e mensal

npm run dev                     # app em http://localhost:3000
npm run worker                  # em outro terminal: processa PDFs e planos
npm run admin -- @seu.usuario   # depois de criar sua conta, para acessar /admin
```

- **Sem `ANTHROPIC_API_KEY`** o app funciona em **modo de demonstração**: o texto de estudo e as questões são montados com frases do próprio material (sem custo, bom para testar o fluxo). Com a chave, tudo é gerado pelo Claude.
- **Sem `VOYAGE_API_KEY`** a busca nos materiais usa vetores locais simples. Se ativar a Voyage depois, reenvie os materiais.
- `WHATSAPP_NUMBER` vem com um número de teste (`5511999999999`). Troque pelo real (DDI + DDD + número, só dígitos).
- `BILLING_ENFORCED="false"` desliga o modo limitado (só para desenvolvimento).

## Testes

```bash
npm test                        # unidade: planner, revisão espaçada, @, CPF, telefone, assinatura
npm run typecheck

# ponta a ponta (com o app e o worker rodando, de preferência com AI_MODE=mock):
npm run build && npm start      # terminal 1
npm run worker                  # terminal 2
npx playwright install chromium # uma vez
npm run test:e2e                # terminal 3
```

## O que testar

1. **Cadastro:** nome, CPF, telefone, @ e senha. CPF inválido ou já usado é recusado; o @ mostra a disponibilidade em tempo real.
2. **Login e senha:** entre com o CPF e depois com o @. Em "Esqueci a senha", o telefone errado é recusado; com CPF + telefone certos, a senha nova funciona.
3. **Modo teste:** o aviso aparece no topo de todas as telas, com o botão "Assinar plano".
4. **Assinatura:** em `/assinatura`, o botão abre o WhatsApp com a mensagem pronta.
5. **Modo limitado:** para simular o fim do teste, rode `UPDATE "user" SET "trialEndsAt" = now() WHERE handle = 'seu.usuario';`. Confira que não dá para enviar materiais, que não dá para criar uma 2ª preparação e que a 2ª sessão do dia é bloqueada.
6. **Admin:** libere o plano em `/admin` e veja o aluno voltar a ter tudo liberado, com o histórico em `/assinatura`.
7. **Preparação e materiais:** crie uma de cada tipo. Envie vários PDFs de uma vez, um DOCX e um texto colado e acompanhe *na fila → processando → pronto*. Para concurso, envie o edital e veja disciplinas, pesos e banca em "Assuntos".
8. **Plano:** com 15 min/dia, cada sessão tem 15 min. Com uma prova próxima aparece o aviso de tempo insuficiente. Mudar dias ou horário em Ajustes refaz o plano.
9. **Sessão de estudo:** texto com links para a página do PDF → destaques → recuperação ativa → objetivas → concluir.
10. **Banco de erros e revisões:** as questões erradas aparecem em Revisões e saem depois de 2 acertos seguidos. As revisões R1–R4 entram no plano.
11. **Configurações:** trocar @ e telefone, tema claro/escuro, exportar dados, excluir conta.

## Deploy no Render

O `render.yaml` cria o **web**, o **worker** e o **PostgreSQL** (que suporta pgvector).

1. Crie um bucket no **Cloudflare R2** (ou S3) e uma chave de acesso. Configure o CORS do bucket para aceitar `PUT` e `GET` vindos do domínio do app (o navegador envia os arquivos direto para o bucket).
2. No Render: **New → Blueprint** → selecione o repositório.
3. Preencha as variáveis do grupo `eduvia-shared`: URL do app, chaves de IA, R2 e `WHATSAPP_NUMBER`.
4. As migrações e o seed rodam sozinhos em cada deploy (`preDeployCommand`). Depois de criar sua conta, rode `npm run admin -- @seu.usuario` no Shell do serviço web.

## Notas de desenvolvimento

- Ao criar migrações com `prisma migrate dev`, o Prisma tenta remover o índice vetorial `Chunk_embedding_hnsw_idx` (criado em SQL). Apague essa linha `DROP INDEX` da migração gerada.
- Modelo e esforço da IA por tarefa: `src/lib/ai/client.ts` (variáveis `AI_MODEL_DEFAULT`, `AI_MODEL_SESSION`, `AI_MODEL_GRADE`...). O custo de cada chamada fica na tabela `AiUsage`.
- Formulários com server action usam `ActionForm` (`src/components/action-form.tsx`), que não apaga os campos quando a ação devolve erro.
- As tabelas `GuardianConsent` e as colunas `birthDate`/`guardianConsentStatus` ficaram sem uso depois da mudança para cadastro sem e-mail; podem ser removidas numa migração futura.
