# Eduvia

Plataforma de estudos com IA para qualquer estudante. O aluno envia os próprios materiais (PDF, DOCX, imagens, texto) e a IA monta o plano de estudo, as sessões com texto e perguntas, as revisões espaçadas e o banco de erros.

- Arquitetura, modelo de dados, telas e fases: [docs/ARQUITETURA.md](docs/ARQUITETURA.md)
- Status: **Fases 1, 2 e 3 concluídas**: contas por CPF, assinatura manual pelo WhatsApp, plano de estudo, sessões, revisões, teste rápido, simulados, redação, desempenho, Professor IA, grupos de estudo, conquistas, perfil e notificações (app + push/PWA).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · PostgreSQL 16 + pgvector · Prisma 7 · Better Auth (CPF/@ + senha) · pg-boss (fila no próprio Postgres) · Google Gemini com a chave de cada aluno (geração/correção/OCR) · embeddings locais (ou Voyage AI) · armazenamento S3-compatível (Cloudflare R2 em produção, disco local no desenvolvimento).

```
src/
  app/                 telas e rotas de API (Next.js)
    (app)/             área logada: início, preparações, estudar, praticar (revisões, teste rápido, simulados),
                       redação, professor, desempenho, ajustes, assinatura, admin
    actions/           server actions
    api/               upload, status de materiais, arquivos, exportação LGPD, auth
  lib/
    core/              regras puras e testadas: planner, revisão espaçada, perfis, @, CPF, telefone, datas
    ai/                Gemini (chave do aluno, saída estruturada, cota), embeddings, modo simulado
    materials/         extração de texto/OCR, divisão em trechos, pipeline de processamento
    billing.ts         plano Grátis/Eduvia, limites por dia, link do WhatsApp
    rest.ts            aviso "Descanse" (tempo de estudo, sessões seguidas) e sugestões
    plan.ts, study.ts  plano de estudo e sessão (conteúdo, respostas, conclusão)
    question-bank.ts   questões por assunto para testes rápidos e simulados (reaproveita; só gera o que falta)
    exams.ts, tutor.ts simulados (montagem por peso, correção) e Professor IA (RAG + streaming)
    groups.ts          grupos: papéis, convites, mural, compartilhamento, acesso e rankings
    achievements.ts    conquistas (catálogo + verificação após cada evento)
    notifications.ts   central de notificações + push (web-push); jobs/reminders.ts: lembretes
  lib/quick-test.ts    teste rápido (opções e regras); components/pixel-stage.tsx: bonequinho em pixel art
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

- **IA com a chave do aluno:** o cadastro pede a chave da API do **Google Gemini** do próprio aluno (grátis em aistudio.google.com/apikey). A plataforma não paga IA. A chave é testada na hora, guardada criptografada (AES-256-GCM com `AI_KEY_SECRET` ou `BETTER_AUTH_SECRET`) e pode ser trocada em **Minha IA**. Contas sem chave são levadas para `/conectar-ia`.
  - Modelos tentados em ordem (`GEMINI_MODELS`, padrão `gemini-2.5-flash,gemini-2.5-flash-lite`): a cota grátis do Google é por modelo, então quando um esgota o próximo assume.
  - Se o Google recusar por cota (erro 429), a IA do aluno fica "em pausa" até a hora indicada (1 minuto, ou a meia-noite do Pacífico ≈ 4h/5h de Brasília para a cota diária) e o app mostra a tela **Descanse**.
- **Planos** (padrões em `src/lib/plans.ts` e na migração `10_planos_torneios`; os valores reais ficam no banco e são editados em **/admin → Planos**, onde -1 = ilimitado). **PDFs e páginas não têm limite em nenhum plano** (só contam arquivos que deram certo). O que muda é a quantidade de **guias de estudo (preparações) criados por mês**: apagar ou editar um guia não devolve a vaga.

  | | Grátis | Pro | Avançado | Ilimitado |
  |---|---|---|---|---|
  | Preço 7 / 15 / 30 dias | — | R$ 7 / 10 / 15 | R$ 12 / 19 / 30 | R$ 18 / 30 / 50 |
  | PDFs | 1 PDF de até 100 páginas | sem limite | sem limite | sem limite |
  | Guias de estudo por mês | 1 | 6 | 15 | 35 |
  | Simulados por mês | 0 | 15 | 40 | à vontade |
  | Redações corrigidas por dia | 1 | 3 | 6 | à vontade |
  | Professor IA (mensagens por dia) | 5 | 40 | 100 | à vontade |
  | Testes rápidos | 3/dia | à vontade | à vontade | à vontade |
  | Grupos e torneios (até 30 pessoas) | não | sim | sim | sim |

  Preços dos três períodos e limites são editáveis em **/admin → Planos** (preço 0 esconde aquele período; dá para tirar um plano da vitrine). Os antigos Plus e Pro saíram da vitrine; quem já tinha continua até o fim do período.

- **Login único:** entrar em um aparelho desconecta os outros (`databaseHooks` em `src/lib/auth.ts`).
- Sem assinatura, a conta fica no plano **Grátis** (aviso no topo com o botão "Assinar").
- **Descanse:** antes de uma sessão nova, se o aluno já estudou 3 h no dia (`restAfterMinutes`) ou fez 3 sessões seguidas sem pausa, aparece o convite para descansar (com "Continuar mesmo assim"). Limites do dia e pausas da IA também levam a `/descanse`. Sugestões que não gastam IA: ler o próprio PDF na página do assunto, livros recomendados da matéria (gerados junto com o índice do material, sem chamada extra) e revisões.
- **Duração da sessão:** o aluno escolhe 5, 10, 15, 20, 30 ou 45 minutos ao começar; o texto e o nº de questões seguem o tempo.
- **Assinar:** em `/assinatura`, o aluno escolhe o plano (7, 15 ou 30 dias); o botão abre o WhatsApp (`WHATSAPP_NUMBER`) com a mensagem pronta (plano, período, preço, nome e @). Não há cobrança automática.
- **Liberar o plano (admin):**
  1. A **primeira conta criada** num banco vazio vira admin sozinha. Para outras: `npm run admin -- @usuario` (no Render: aba *Shell* do serviço web).
  2. Abra `/admin` → **Alunos**, busque o aluno por @, nome, CPF ou telefone, escolha o plano e o período (7 dias só para planos com preço semanal) e clique em **Liberar**. Se o aluno ainda tem dias pagos, o novo período é somado ao final. **Encerrar** corta o acesso na hora.
  3. **Planos:** edite nome, preços e limites. **Uso de IA:** usos do dia por tarefa e por aluno (a IA não custa nada para a plataforma). A lista de alunos mostra quem está com a IA conectada.

## Marca, site e atendimento

- **Logo:** raposa geométrica laranja sobre fundo grafite; paleta do site em laranja (`--primary` em `src/app/globals.css`). Símbolo em `src/components/brand.tsx` (`LogoMark`), favicon em `src/app/icon.svg`, ícones do app em `public/`.
- **Página inicial** (`src/app/page.tsx`): apresentação, como funciona, recursos, preço (lido do plano no banco), perguntas frequentes (inclui "por que pedimos o CPF") e rodapé.
- **Redes sociais:** em **/admin → Site**, cadastre Instagram, WhatsApp, TikTok e X. Só as preenchidas aparecem no rodapé.
- **Suporte por chamados:** o aluno abre um chamado em **Mais → Suporte** (`/suporte`) escolhendo o tipo (dúvida, problema técnico, pagamento, sugestão, outro). A equipe vê os chamados em **/admin → Suporte** (abertos primeiro, com nº de não lidas), responde e clica em **Finalizar chamado**: depois disso o aluno não consegue mais mandar mensagens nele (para outro assunto, abre outro chamado).
- **Ouvir a aula:** na sessão de estudo, um robozinho lê o texto em voz alta com a voz em português do próprio aparelho (sem custo; escolhe a voz mais natural disponível, com velocidade ajustável).
- **Instalar o app:** `/instalar` (e um aviso na tela inicial do celular) ensina a instalar pelo navegador (Android/Chrome com botão direto; iPhone pelo Safari → Compartilhar → Adicionar à Tela de Início) e ativar as notificações.
- **Grupos:** cada grupo tem um **código** de 6 caracteres (aparece no topo do grupo, com botão de copiar). Em `/grupos` dá para **entrar com o código** ou **criar** um grupo; convites pelo @ aparecem em "Você foi convidado", com aviso vermelho no menu.
- **Foto de perfil:** 50 personagens próprios (estilo retrato) em 5 abas: Heróis, Super-heróis, Halloween, MVP (games) e Princesas. Gerados por `node scripts/gen-avatars.mjs` (SVGs em `public/avatars/`, lista em `src/lib/avatar-list.json`). No plano Grátis só 1 feminino e 1 masculino de cada categoria ficam liberados (`free: true`); assinantes usam todos. O aluno muda o nome; o @ não pode ser trocado.
- **Cadastro em 2 passos:** dados da conta → chave do Gemini, com botão "Voltar" que mantém o que foi digitado.

## Fase 2 — praticar

- **Teste rápido** (`/teste-rapido`, substitui os jogos): o aluno dá um nome (sugestão "Teste N"), escolhe 10, 15 ou 20 perguntas e 10, 15, 20 ou 30 segundos por pergunta. Um bonequinho em pixel art preto e branco (personagem próprio) pula enquanto o aluno pensa; acertou, ele pula de alegria, sobe de fase e soltam balões; errou (ou acabou o tempo), ele cai. Cada teste fica salvo e **não pode ser refeito** (para praticar de novo, cria-se outro, sem limite no plano pago). As perguntas priorizam o que o aluno errou e questões novas; as que ele já acertou entram no máximo 10%. Erros vão para o banco de erros; acertar uma questão do banco a tira de lá.
- **Simulados** (`/simulados`): escolha disciplinas, 30, 50 ou 100 questões e o tempo (30 min, 1 h ou 3 h); até 8 simulados por mês no plano pago. As questões são divididas pelo peso de cada disciplina (edital) e seguem o estilo da banca (múltipla escolha ou certo/errado). Cronômetro com entrega automática, respostas salvas a cada 5 s, nota 0–10, % por disciplina com etiqueta (crítico/em desenvolvimento/bom), tempo gasto, gabarito comentado com link para a página do material e gráfico de evolução.
- **Redação** (`/redacao`): o tema é **sorteado** (lista própria em `src/lib/core/essay-themes.ts`, sem gastar IA; dá para sortear outro antes de escrever) e a correção segue o **ENEM** (C1–C5, 0–1000). O **teste de português** sorteia uma proposta curta e avalia a qualidade da escrita (0–10). As duas telas recomendam não usar IA para escrever nem pesquisar, e colar textos grandes fica desativado. O texto aparece com os trechos marcados (ortografia, pontuação, concordância, coesão...) e a sugestão ao lado; mais pontos fortes, dicas e histórico.
- **Professor IA** (`/professor`): chat que responde com base nos materiais (citando a página), com resposta em tempo real e atalhos: Explicar, Me testar, Criar questões e Analisar meus erros. Conversas ficam salvas.
- **Desempenho** (`/desempenho`): acerto geral, tempo de estudo, simulados e pontos críticos; acerto por semana, minutos por dia, e acerto por disciplina e assunto com recomendação.
- **Banco de erros** (`/revisoes?filtro=erros`): mostra a questão errada com a resposta certa, a explicação e o link da página do PDF; o botão "Aprender o certo com o meu material" gera uma aula curta com base no material (guardada para não gastar IA de novo).
- **Uso da IA:** questões geradas ficam no banco e são reaproveitadas (testes rápidos e simulados só chamam a IA quando faltam questões). Limites por dia na tabela de planos acima.

## Fase 3 — comunidade e engajamento

- **Grupos** (`/grupos`):
  - Qualquer pessoa com plano cria um grupo e convida pelo @, com confirmação em tempo real de que o @ existe. O convidado recebe uma notificação e aceita ou recusa. No plano Grátis não há grupos.
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
  - Avisos de convite, entrada no grupo, simulado compartilhado, conquista e plano vencendo.
  - No iPhone, o push funciona com o Eduvia **adicionado à tela de início** (iOS 16.4+).

## Aulas com nota mínima

- Cada aula (sessão de estudo) termina com a nota das perguntas dela. **Só com 75% ou mais** a aula conta como feita e a próxima é liberada (`PASS_SCORE` em `src/lib/study.ts`). Abaixo disso, o aluno relê o texto e refaz; a melhor nota fica guardada e dá para refazer só para melhorar.
- Na mesma preparação, as aulas seguintes (inclusive as de amanhã) ficam com cadeado até a anterior ser aprovada. Revisões não bloqueiam.
- Aula perdida continua no dia dela (aparece como "Atrasada" no Início) e precisa ser feita, com 75% ou mais, antes das de hoje. O plano não remarca nem pula o assunto.
- Os testes rápidos e simulados não mudam a nota da aula.
- **Fontes:** tocar numa referência abre o PDF dentro do app (pdf.js), na página certa e com o trecho grifado. DOCX/texto mostram o texto da página.
- **Redação no plano:** ao criar o guia de estudo, a opção "Incluir redação no plano" coloca uma redação por semana em "O que fazer hoje".
- **Chamadas do dia:** além do lembrete no horário de estudo, o app avisa 3x por dia para fazer teste rápido e 1x para redação, simulado, banco de erros e instalar o app (horários variam um pouco por aluno). Para o push chegar no celular, `VAPID_PRIVATE_KEY` precisa estar no Render e o aluno precisa tocar em "Ativar" no aviso do topo.

## Estabilidade e novidades

- **Worker em processo separado (sem custo extra):** com `RUN_WORKER_IN_WEB=true`, o site inicia o worker (PDFs, planos, lembretes) num processo próprio (`src/worker/supervisor.ts`), no mesmo servidor e com o mesmo disco. Se ele cair (ex.: PDF enorme), religa sozinho e o site continua no ar. `WORKER_MAX_MB` limita a memória dele (padrão 1024). `WORKER_MODE=inline` volta ao modo antigo.

- **Fila que não dá erro à toa:** se a cota do Gemini acabar ou o Google oscilar, o material volta sozinho para a fila ("Na fila: … continuamos sozinhos") em vez de virar erro. Materiais parados (ex.: o servidor reiniciou) são retomados a cada 5 minutos. O processo registra erros soltos em vez de cair, e as telas têm páginas de erro amigáveis com "Tentar de novo".
- **Início estilo Duolingo:** foguinho da sequência (aceso quando já estudou hoje), últimos 7 dias e botão para estudar.
- **Sessão de estudo:** cronômetro do tempo escolhido (some quando acaba, sem tirar o aluno da tela), aviso de conteúdo pronto e mensagem de conforto ao concluir.
- **Cadastro em 2 passos com 3 IAs obrigatórias:** 1) dados (a conta já fica salva); 2) `/conectar-ia`: Gemini, Groq e OpenRouter, uma por tela (ao conectar, aparece a próxima), cada uma salva na hora, com o aviso "não coloque cartão, dados bancários nem faça Pix". Sem as 4 (as ligadas), o app leva para essa tela. Em **Admin → IA → IAs do sistema** dá para desligar uma IA (sai do cadastro e do uso); se uma IA passar a pedir pagamento (402/"payment required"), o site para de usá-la na hora e os admins recebem um aviso. OpenRouter: só modelos ":free".
- **Arquivos e "Gerar aulas":** o envio só lê o arquivo (texto, OCR quando precisa, índice de busca), sem montar aulas: fica pronto rápido. Com todos prontos, o botão "Gerar aulas" (em cima da lista) libera; ao tocar, um cronômetro mostra o andamento enquanto as IAs separam os assuntos de TODOS os arquivos (na ordem, sem pular nada; sem IA disponível, divide por títulos/páginas) e montam o plano (`src/lib/materials/lessons.ts`, fila `lessons.generate`). As questões usam a aula já criada como base.
- **Pix automático (SyncPay):** com `SYNCPAY_CLIENT_ID` e `SYNCPAY_CLIENT_SECRET` no ambiente (opcional `SYNCPAY_API_BASE`), a tela Assinatura mostra "Pagar com Pix": cria a cobrança (`/api/partner/v1/cash-in`), mostra o QR Code e o copia e cola e libera o plano por 30 dias quando o Pix cai (mesmo plano ativo: soma ao final). Mesmo jeito da Acolia. O aviso (`/api/webhooks/syncpay`, pode ser cadastrado no painel da SyncPay) nunca libera sozinho: só faz o site conferir na hora o status na API (`/api/partner/v2/transactions/{id}`); a tela consulta a cada 4 s e o worker confere os pendentes a cada 5 min. Código em `src/lib/syncpay.ts` e `src/lib/pix-billing.ts`. Renovação: a partir de 2 dias antes de vencer, aviso no topo de todas as telas, janela "Seu plano vence" (com o Pix ali mesmo) toda vez que o aluno abre o site e notificação uma vez por dia (a partir das 9h); os 30 dias novos somam ao final. Venceu: a conta continua, o login leva direto para Assinatura, e o aviso diário continua por 7 dias. Sem as chaves, a assinatura continua pelo WhatsApp. No painel da SyncPay, autorize os IPs de saída do Render (Render → Connect → Outbound).
- **Planos:** só mensais (Pro R$ 9,90, Avançado R$ 19,90, Ilimitado R$ 44,90), todos com arquivos e páginas sem limite. Teste grátis de 3 dias (1 redação, 1 simulado e 1 teste rápido no teste inteiro); depois, a conta continua salva e, ao entrar, vai direto para /assinatura (`src/proxy.ts` passa o caminho para o layout). O CPF é único por conta; o telefone pode repetir.
- **IAs juntas:** Gemini (lê arquivos e fotos, faz as aulas), Groq e OpenRouter (`src/lib/ai/extra.ts`, formato OpenAI). Perguntas, correções e Professor IA vão primeiro para a Groq; aulas, índice e edital vão primeiro para o Gemini. Se uma IA está no limite, ocupada ou recusa, a próxima responde.
- **Voz do robô:** Piper (código aberto, grátis e sem limite), instalado no deploy em `vendor/piper` (`scripts/setup-piper.ts`, no `npm run build`; se falhar, baixa depois para `PIPER_DIR`). Fica ligado num processo só (`stdbuf -oL`, `nice`), com a voz carregada: cada frase sai em menos de 1 s. Voz `pt_BR-faber-medium` (reserva `pt-br-edresson-low`). Em Admin → IA há o botão "Testar voz do robô", que mostra o erro real se falhar. Cada frase é falada separadamente, então o começo de cada frase no áudio é exato; dentro da frase as palavras são encaixadas pelas pausas e sílabas da voz. O áudio de cada trecho fica guardado em `tts/` e é preparado em segundo plano quando o aluno abre a aula. Se a voz falhar, usa a voz do aparelho.
- **Professor IA:** mensagens de "pensando" enquanto responde; a resposta é salva mesmo se o aluno sair da tela.
- **Redação:** tempo de 10 min, 30 min, 1 h ou 3 h (envio automático ao acabar); temas ENEM com textos motivadores; copiar trechos deles tira pontos (−40 na C3 por trecho, −80 na C2 se passar de 30% do texto); PDF para imprimir com marca d'água, avaliador IA, data/hora, quadro de nota, tema, texto e erros.
- **Simulado:** PDF com as respostas marcadas pelo aluno (sem certo/errado).
- **Torneios nos grupos:** dono/admin cria um torneio (1 a 30 dias); a classificação é o XP ganho no período, do 1º ao último.

## Rodar localmente

Requisitos: Node 22+, e PostgreSQL 16 com pgvector (o `docker-compose.yml` sobe um pronto).

```bash
docker compose up -d            # Postgres (pgvector)
cp .env.example .env            # AI_MODE=mock para testar sem chave do Gemini
npm install
npx prisma migrate deploy       # cria as tabelas (e a extensão vector)
npm run db:seed                 # planos Grátis e Eduvia

npm run dev                     # app em http://localhost:3000
npm run worker                  # em outro terminal: processa PDFs e planos (ou RUN_WORKER_IN_WEB=true)
npm run admin -- @seu.usuario   # depois de criar sua conta, para acessar /admin
```

- Com `AI_MODE=mock` o app funciona em **modo de demonstração**: aceita qualquer chave no cadastro e monta o texto e as questões com frases do próprio material. Sem isso, cada aluno usa a IA de verdade com a chave do Gemini dele.
- **Sem `VOYAGE_API_KEY`** a busca nos materiais usa vetores locais simples. Se ativar a Voyage depois, reenvie os materiais.
- `WHATSAPP_NUMBER`: número que recebe os pedidos de assinatura (padrão: +55 62 99209-7369).
- `BILLING_ENFORCED="false"` libera o plano pago para todos (só para desenvolvimento).

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

1. **Cadastro:** nome, CPF, telefone, @, senha e a chave do Gemini (crie em aistudio.google.com/apikey). CPF inválido ou já usado é recusado; o @ mostra a disponibilidade em tempo real; chave errada é recusada.
2. **Login e senha:** entre com o CPF e depois com o @. Em "Esqueci a senha", o telefone errado é recusado; com CPF + telefone certos, a senha nova funciona.
3. **Plano Grátis:** o aviso aparece no topo de todas as telas, com o botão "Assinar". Em **Minha IA** aparece a chave conectada (só o final) e os usos do dia.
4. **Assinatura:** em `/assinatura`, o botão abre o WhatsApp com a mensagem pronta.
5. **Limites do Grátis:** confira que não dá para criar uma 2ª preparação, que a 2ª sessão nova do dia é bloqueada e que o aviso leva à tela **Descanse**.
6. **Admin:** libere o plano em `/admin` e veja o aluno ganhar os limites do plano Eduvia, com o histórico em `/assinatura`.
7. **Preparação e materiais:** crie uma de cada tipo. Envie vários PDFs de uma vez, um DOCX e um texto colado e acompanhe *na fila → processando → pronto*. Para concurso, envie o edital e veja disciplinas, pesos e banca em "Assuntos".
8. **Plano:** com 15 min/dia, cada sessão tem 15 min. Com uma prova próxima aparece o aviso de tempo insuficiente. Mudar dias ou horário em Ajustes refaz o plano.
9. **Sessão de estudo:** escolha o tempo (5 a 45 min) → texto com links para a página do PDF → destaques → recuperação ativa → objetivas → concluir. Depois de 3 sessões seguidas sem pausa, aparece o convite para descansar.
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

O `render.yaml` cria **um serviço web** chamado `eduvia` (endereço gratuito `https://eduvia.onrender.com`, se o nome estiver livre) e o **PostgreSQL** (que suporta pgvector). O serviço web:
- roda o app **e** o processamento em segundo plano (`RUN_WORKER_IN_WEB=true`): PDFs, planos e lembretes;
- guarda os arquivos enviados num **disco persistente** de 5 GB (`/var/data`), sem precisar de S3/R2.

Passo a passo:
1. Suba o código para o GitHub (já está) e crie uma conta em https://render.com.
2. No Render: **New → Blueprint** → conecte o GitHub e escolha o repositório `eduvia`. Ele lê o `render.yaml` e mostra o que vai criar (serviço `eduvia-web`, disco e banco `eduvia-db`). Confirme.
3. Preencha as variáveis que ficaram em branco (eduvia → Environment). O endereço do app é detectado sozinho (`RENDER_EXTERNAL_URL`), então **não precisa** de `APP_URL`, a não ser com domínio próprio.
   - IA: nada a configurar. Cada aluno informa a própria chave do Gemini no cadastro.
   - `VAPID_PRIVATE_KEY`: para as notificações no celular (a pública já está no `render.yaml`). Para trocar o par, gere com `npx web-push generate-vapid-keys`.
4. Clique em **Manual Deploy → Deploy latest commit**. As migrações e o seed rodam sozinhos.
5. Abra o app, crie sua conta e, em eduvia → **Shell**, rode `npm run admin -- @seu.usuario` para acessar `/admin`.

Custo aproximado: serviço *Starter* + disco de 5 GB + Postgres *Basic*. Confira os valores atuais em https://render.com/pricing.

**Domínio próprio (ex.: eduvia.com.br):** compre o domínio (registro.br), adicione em eduvia → Settings → Custom Domains, copie os registros DNS que o Render mostrar e defina `APP_URL=https://eduvia.com.br`.

**Quando crescer:** crie um *Background Worker* com `npm run worker` e ponha `RUN_WORKER_IN_WEB=false` no web. Isso permite mais de uma instância do app, mas o disco persistente não é compartilhado entre serviços, então os arquivos precisam ir para um armazenamento S3 (Cloudflare R2, AWS S3): `STORAGE_DRIVER=s3` e `S3_*` (ver `.env.example`).

## IA (Google Gemini)

- Cada aluno cria a chave grátis em https://aistudio.google.com/apikey e cola no cadastro (ou em **Minha IA**). A plataforma não tem custo de IA.
- Para mais fôlego, o aluno pode ativar o faturamento no projeto dele no Google (paga só o que usar, direto ao Google; nesse modo o Google não usa os dados para treinar). Assinar o app Gemini (Google AI Pro) não aumenta a cota da API.
- Os limites grátis do Google mudam de tempos em tempos. Se os alunos começarem a ver muito a tela "Descanse", baixe os limites em **/admin → Planos** ou mude a ordem dos modelos com `GEMINI_MODELS`.

## Notas de desenvolvimento

- Ao criar migrações com `prisma migrate dev`, o Prisma tenta remover o índice vetorial `Chunk_embedding_hnsw_idx` (criado em SQL). Apague essa linha `DROP INDEX` da migração gerada.
- Modelos da IA: `src/lib/ai/client.ts` (`GEMINI_MODELS`, `GEMINI_MODEL_<TAREFA>`). Cada chamada fica registrada na tabela `AiUsage` (tokens; custo zero para a plataforma).
- Formulários com server action usam `ActionForm` (`src/components/action-form.tsx`), que não apaga os campos quando a ação devolve erro.
- As tabelas `GuardianConsent` e as colunas `birthDate`/`guardianConsentStatus` ficaram sem uso depois da mudança para cadastro sem e-mail; podem ser removidas numa migração futura.
