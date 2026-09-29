# Eduvia

Plataforma de estudos com IA para qualquer estudante. O aluno envia os próprios materiais (PDF, DOCX, imagens, texto) e a IA monta o plano de estudo, as sessões com texto e perguntas, as revisões espaçadas e o banco de erros.

- Arquitetura, modelo de dados, telas e fases: [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- Status: **Fases 1, 2 e 3 concluídas**: contas por CPF, assinatura manual pelo WhatsApp, plano de estudo, sessões, revisões, jogo da cobrinha, simulados, redação, desempenho, Professor IA, grupos de estudo, conquistas, perfil e notificações (app + push/PWA).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · PostgreSQL 16 + pgvector · Prisma 7 · Better Auth (CPF/@ + senha) · pg-boss (fila no próprio Postgres) · Claude API (geração/correção/OCR) · Voyage AI (embeddings) · armazenamento S3-compatível (Cloudflare R2 em produção, disco local no desenvolvimento).

```
src/
  app/                 telas e rotas de API (Next.js)
    (app)/             área logada: início, preparações, estudar, praticar (revisões, jogos, simulados),
                       redação, professor, desempenho, ajustes, assinatura, admin
    actions/           server actions
    api/               upload, status de materiais, arquivos, exportação LGPD, auth
  lib/
    core/              regras puras e testadas: planner, revisão espaçada, perfis, @, CPF, telefone, datas
    ai/                Claude (saída estruturada, cache, custo), embeddings, modo simulado
    materials/         extração de texto/OCR, divisão em trechos, pipeline de processamento
    billing.ts         teste grátis, modo limitado, planos, link do WhatsApp
    plan.ts, study.ts  plano de estudo e sessão (conteúdo, respostas, conclusão)
    question-bank.ts   questões por assunto para jogos e simulados (reaproveita; só gera o que falta)
    exams.ts, tutor.ts simulados (montagem por peso, correção) e Professor IA (RAG + streaming)
    groups.ts          grupos: papéis, convites, mural, compartilhamento, acesso e rankings
    achievements.ts    conquistas (catálogo + verificação após cada evento)
    notifications.ts   central de notificações + push (web-push); jobs/reminders.ts: lembretes
  games/               jogos plugáveis: catálogo (catalog.ts) + componente de cada jogo
public/sw.js           service worker (push e app instalável); src/app/manifest.ts: manifesto PWA
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

## Fase 2 — praticar

- **Jogo da cobrinha** (`/jogos`): a cobra persegue o ratinho e se aproxima enquanto o aluno pensa. Acerto afasta a cobra (e ela acelera um pouco); erro custa uma vida. Acaba ao atingir o limite de erros (1, 3 ou 5) ou quando a cobra alcança. Pontos: 100 por acerto + bônus de rapidez. Resultado com acertos, erros, tempo médio e recorde; os erros vão para o banco de erros. Atalhos de teclado 1–5 / A–E.
  - **Novo jogo:** adicione a definição em `src/games/catalog.ts` (nome, configurações, nº de questões) e o componente em `src/games/components.tsx`. O componente recebe as perguntas e as funções `onAnswer`/`onFinish`; a correção e a pontuação ficam no servidor.
- **Simulados** (`/simulados`): escolha disciplinas, 10/20/30/50 questões e o tempo. As questões são divididas pelo peso de cada disciplina (edital) e seguem o estilo da banca (múltipla escolha ou certo/errado). Cronômetro com entrega automática, respostas salvas a cada 5 s, nota 0–10, % por disciplina com etiqueta (crítico/em desenvolvimento/bom), tempo gasto, gabarito comentado com link para a página do material e gráfico de evolução.
- **Redação** (`/redacao`): tema escrito pelo aluno ou sugerido pela IA; correção **ENEM** (C1–C5, 0–1000), **discursiva de concurso** (conteúdo, estrutura, linguagem; 0–100) ou **qualidade do português** (0–10). O texto aparece com os trechos marcados (ortografia, pontuação, concordância, coesão...) e a sugestão ao lado; mais pontos fortes, dicas e histórico.
- **Professor IA** (`/professor`): chat que responde com base nos materiais (citando a página), com resposta em tempo real e atalhos: Explicar, Me testar, Criar questões e Analisar meus erros. Conversas ficam salvas.
- **Desempenho** (`/desempenho`): acerto geral, tempo de estudo, simulados e pontos críticos; acerto por semana, minutos por dia, e acerto por disciplina e assunto com recomendação.
- **Custo de IA:** questões geradas ficam no banco e são reaproveitadas; limites diários para quem assina (`FULL_PER_DAY` em `src/lib/billing.ts`: 10 simulados, 5 redações, 100 mensagens ao Professor). No **modo limitado**: 1 jogo por dia; simulados, redação e Professor IA ficam só para assinantes.

## Fase 3 — comunidade e engajamento

- **Grupos** (`/grupos`):
  - Qualquer pessoa com plano cria um grupo e convida pelo @, com confirmação em tempo real de que o @ existe. O convidado recebe uma notificação e aceita ou recusa. No modo limitado dá para entrar em grupos por convite, mas não criar.
  - Papéis: **dono** (muda papéis, passa a posse, exclui o grupo), **administrador** (convida, remove membros, modera o mural) e **membro**.
  - Limites: até 50 pessoas por grupo e 20 grupos por dono.
  - **Mural:** mensagens com atualização automática; apagar as próprias (admins apagam qualquer uma).
  - **Compartilhar** o que é seu:
    - **Material:** os outros abrem o PDF e podem **adicionar à própria preparação**. O arquivo não é reprocessado e os assuntos são copiados, então não há custo de IA.
    - **Resumo:** o texto de estudo de um assunto.
    - **Lista de questões:** os outros praticam, e os erros entram no banco de erros deles.
    - **Simulado:** todos fazem a mesma prova, com **ranking do grupo** por nota e tempo.
  - **Ranking:** XP da semana de cada membro e lista de simulados do grupo.
- **Conquistas** (18 medalhas: sessões, sequência, questões, banco de erros, jogo, simulado, redação, domínio de assuntos, grupos, XP) e **níveis com título** (Iniciante → Lenda). Cada conquista nova gera uma notificação. Para criar outra, adicione em `ACHIEVEMENTS` (`src/lib/achievements.ts`).
- **Perfil** (`/u/@usuario`, atalho `/perfil`): nível, XP, sequência, estatísticas e conquistas. Com o perfil **privado**, os outros veem só nome, @ e nível.
- **Notificações:**
  - Sino com contador e central (`/notificacoes`).
  - Em Ajustes: **ativar notificações neste aparelho** (push via PWA) e ligar/desligar o **lembrete no horário de estudo**, que chega uma vez por dia se houver sessão pendente.
  - Avisos de convite, entrada no grupo, simulado compartilhado, conquista, teste grátis acabando e plano vencendo.
  - No iPhone, o push funciona com o Eduvia **adicionado à tela de início** (iOS 16.4+).

## Rodar localmente

Requisitos: Node 22+, e PostgreSQL 16 com pgvector (o `docker-compose.yml` sobe um pronto).

```bash
docker compose up -d            # Postgres (pgvector)
cp .env.example .env            # sem chaves de IA roda em modo de demonstração
npm install
npx prisma migrate deploy       # cria as tabelas (e a extensão vector)
npm run db:seed                 # planos semanal e mensal

npm run dev                     # app em http://localhost:3000
npm run worker                  # em outro terminal: processa PDFs e planos (ou RUN_WORKER_IN_WEB=true)
npm run admin -- @seu.usuario   # depois de criar sua conta, para acessar /admin
```

- **Sem `ANTHROPIC_API_KEY`** o app funciona em **modo de demonstração**: o texto de estudo e as questões são montados com frases do próprio material (sem custo, bom para testar o fluxo). Com a chave, tudo é gerado pelo Claude.
- **Sem `VOYAGE_API_KEY`** a busca nos materiais usa vetores locais simples. Se ativar a Voyage depois, reenvie os materiais.
- `WHATSAPP_NUMBER`: número que recebe os pedidos de assinatura (padrão: +55 62 99206-7369).
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
12. **Jogo da cobrinha:** Praticar → Jogos → Jogar. Demore para responder e veja a cobra chegar; acerte e ela se afasta. Confira o resultado e o banco de erros.
13. **Simulado:** monte um de 10 questões, responda, deixe uma em branco e entregue. Veja nota, disciplinas e gabarito. Faça outro para ver o gráfico de evolução.
14. **Redação:** peça um tema, escreva com alguns erros de propósito ("a gente vamos", "haviam", espaço antes da vírgula) e veja as marcações.
15. **Professor IA:** pergunte algo do seu material; teste "Me testar" e "Analisar meus erros" (depois de errar algumas questões).
16. **Desempenho:** confira os gráficos e o detalhamento por assunto (toque na disciplina).
17. **Grupos** (use duas contas, em navegadores diferentes):
    - Crie um grupo, convide o outro @ e aceite pelo sino.
    - Troque mensagens no mural.
    - Compartilhe um material, uma lista de questões e um simulado.
    - Com a outra conta: adicione o material à sua preparação, pratique as questões e faça o simulado para ver o ranking.
18. **Conquistas e perfil:** entre num grupo ou conclua uma sessão e veja a medalha em `/perfil`. Deixe o perfil privado e abra-o com a outra conta.
19. **Notificações:** em Ajustes, ative neste aparelho (precisa de `VAPID_*` configuradas; você recebe uma notificação de teste). Para testar o lembrete, ponha o horário de estudo da preparação 1–2 minutos à frente e deixe o worker rodando.

## Deploy no Render

O `render.yaml` cria **um serviço web** e o **PostgreSQL** (que suporta pgvector). O serviço web:
- roda o app **e** o processamento em segundo plano (`RUN_WORKER_IN_WEB=true`): PDFs, planos e lembretes;
- guarda os arquivos enviados num **disco persistente** de 5 GB (`/var/data`), sem precisar de S3/R2.

Passo a passo:
1. Suba o código para o GitHub (já está) e crie uma conta em https://render.com.
2. No Render: **New → Blueprint** → conecte o GitHub e escolha o repositório `eduvia`. Ele lê o `render.yaml` e mostra o que vai criar (serviço `eduvia-web`, disco e banco `eduvia-db`). Confirme.
3. Preencha as variáveis que ficaram em branco (eduvia-web → Environment):
   - `APP_URL` e `BETTER_AUTH_URL`: o endereço do app, ex.: `https://eduvia-web.onrender.com` (aparece no topo da página do serviço).
   - `ANTHROPIC_API_KEY`: opcional no início. Sem ela o app roda em **modo de demonstração**.
   - `VOYAGE_API_KEY`: opcional (melhora a busca nos materiais).
   - `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`: para as notificações no celular. Gere no seu computador com `npx web-push generate-vapid-keys`.
4. Clique em **Manual Deploy → Deploy latest commit**. As migrações e o seed rodam sozinhos.
5. Abra o app, crie sua conta e, em eduvia-web → **Shell**, rode `npm run admin -- @seu.usuario` para acessar `/admin`.

Custo aproximado: serviço *Starter* + disco de 5 GB + Postgres *Basic*. Confira os valores atuais em https://render.com/pricing.

**Quando crescer:** crie um *Background Worker* com `npm run worker` e ponha `RUN_WORKER_IN_WEB=false` no web. Isso permite mais de uma instância do app, mas o disco persistente não é compartilhado entre serviços, então os arquivos precisam ir para um armazenamento S3 (Cloudflare R2, AWS S3): `STORAGE_DRIVER=s3` e `S3_*` (ver `.env.example`).

## Chave da Anthropic (IA de verdade)

1. Crie uma conta em https://console.anthropic.com e adicione créditos (Settings → Billing).
2. Em **API Keys → Create Key**, copie a chave (começa com `sk-ant-`).
3. Cole em `ANTHROPIC_API_KEY` no Render (ou no `.env` local) e faça um novo deploy. O aviso "Modo de demonstração" some.
4. Custo: cada chamada fica registrada na tabela `AiUsage`, com o valor estimado. O padrão é o modelo `claude-opus-5-5`; para economizar, dá para usar um modelo mais barato em tarefas de volume (ex.: `AI_MODEL_GRADE`, `AI_MODEL_QUESTIONS`). Veja `src/lib/ai/client.ts`.

## Notas de desenvolvimento

- Ao criar migrações com `prisma migrate dev`, o Prisma tenta remover o índice vetorial `Chunk_embedding_hnsw_idx` (criado em SQL). Apague essa linha `DROP INDEX` da migração gerada.
- Modelo e esforço da IA por tarefa: `src/lib/ai/client.ts` (variáveis `AI_MODEL_DEFAULT`, `AI_MODEL_SESSION`, `AI_MODEL_GRADE`...). O custo de cada chamada fica na tabela `AiUsage`.
- Formulários com server action usam `ActionForm` (`src/components/action-form.tsx`), que não apaga os campos quando a ação devolve erro.
- As tabelas `GuardianConsent` e as colunas `birthDate`/`guardianConsentStatus` ficaram sem uso depois da mudança para cadastro sem e-mail; podem ser removidas numa migração futura.
