# Eduvia — Arquitetura, modelo de dados, telas e plano por fases

> Documento vivo. Nome: **Eduvia**.
>
> **Decisões confirmadas:** teste grátis de 3 dias com tudo liberado; depois, plano único com tudo liberado por **R$ 7/semana** ou **R$ 15/mês**; hospedagem no **Render**; pagamento via **Asaas** (Pix + cartão) na Fase 3.
>
> **Ajustes na implementação da Fase 1** (em relação à proposta abaixo): projeto em um único pacote (`src/` + `src/worker`) em vez de monorepo; **Better Auth** no lugar do Auth.js; Next.js 16 e Prisma 7; armazenamento em Cloudflare R2 (o Render não tem armazenamento de objetos); modo de IA simulada para desenvolvimento sem chaves.

---

## 1. Visão geral

Plataforma de estudo com IA para qualquer tipo de estudante. O conteúdo vem **sempre** do material do aluno (PDFs, DOCX, imagens, texto colado). A IA transforma isso em plano de estudo, sessões diárias, perguntas, revisões, jogos, simulados e correção de escrita.

Princípios:
1. **Toda IA roda no servidor.** O front nunca vê chave de API.
2. **Processa uma vez, reutiliza sempre.** Cada arquivo é identificado por hash (SHA-256); texto, chunks, embeddings, resumos e questões geradas ficam em cache no banco.
3. **Resposta ancorada no material (RAG).** Todo texto e questão gerado guarda as referências (arquivo + página) dos trechos usados.
4. **Autorização em uma camada só** (`lib/authz`): todo acesso a preparação/material/questão passa por `assertCanAccess(user, recurso)` — dono ou membro de grupo com o recurso compartilhado.
5. **Mobile-first, pt-BR, tema escuro por padrão.**

---

## 2. Stack proposta

| Camada | Escolha | Por quê |
|---|---|---|
| Front + API | **Next.js 15 (App Router) + React + TypeScript** | Server Actions/Route Handlers mantêm IA no servidor; SSR; um só deploy |
| UI | **Tailwind CSS + shadcn/ui (Radix)** + `lucide-react` + Recharts | Componentes acessíveis, tema claro/escuro via `next-themes` |
| Banco | **PostgreSQL 16 + pgvector** | Relacional + busca vetorial no mesmo lugar |
| ORM | **Prisma** (+ SQL cru para busca vetorial) | Migrações tipadas |
| Auth | **Auth.js (NextAuth v5)** — e-mail/senha (bcrypt/argon2) + Google | Independente de fornecedor, adapter Prisma |
| Arquivos | **Armazenamento S3-compatível** (S3, Cloudflare R2 ou Supabase Storage; **MinIO** no dev) | Upload direto do navegador com URL pré-assinada |
| Fila | **pg-boss** (fila sobre o próprio Postgres) + processo **worker** separado | Sem Redis no começo; retries, agendamento (lembretes, revisões) |
| Extração de PDF | `unpdf`/pdf.js para camada de texto; **OCR** das páginas sem texto enviando a página ao Claude (entrada nativa de PDF/imagem) | Sem Tesseract para manter; qualidade alta em escaneados |
| DOCX | `mammoth` | Texto + estrutura de títulos |
| IA (geração/correção) | **Claude API** via `@anthropic-ai/sdk` — padrão `claude-opus-5-5`, modelo configurável por tarefa em `lib/ai/models.ts` | Um ponto único para trocar modelo/esforço por tarefa |
| Embeddings | **Voyage AI** (`voyage-3.5` ou similar multilíngue, 1024 dim) | A Anthropic não oferece endpoint de embeddings; Voyage é o parceiro recomendado |
| E-mail | Resend (ou SMTP) + React Email | Lembretes, convites, consentimento de responsável |
| Push | Web Push (VAPID) + Service Worker (PWA na fase 3) | Lembretes no horário escolhido |
| Pagamento | **Asaas** (recomendado) atrás de uma interface `PaymentProvider` | Assinatura recorrente com Pix + cartão, boleto, bom para PF/PJ no Brasil |
| Validação | Zod (compartilhado front/back) | |
| Testes | Vitest (unidade), Playwright (e2e) | |
| Deploy | Vercel (web) + Railway/Fly/Render (worker) + Postgres gerenciado (Neon/Supabase/RDS) | Worker precisa de processo longo |

### Estrutura do repositório (monorepo simples com pnpm workspaces)

```
eduvia/
├─ apps/
│  ├─ web/                 # Next.js (UI + API + server actions)
│  └─ worker/              # Node: consome a fila (PDF, embeddings, geração, lembretes)
├─ packages/
│  ├─ db/                  # schema Prisma, migrações, client, SQL vetorial
│  ├─ ai/                  # cliente Claude/Voyage, prompts versionados, schemas Zod de saída, cache
│  ├─ core/                # regras de negócio puras: planner, revisão espaçada, pontuação, limites de plano
│  └─ ui/                  # (opcional) componentes compartilhados
├─ docker-compose.yml      # postgres+pgvector, minio, mailpit
└─ docs/
```

### Fluxo de processamento de material

```
Navegador ──(URL pré-assinada)──▶ Storage
    │ POST /api/materials (metadados + hash)
    ▼
[DB] Material status=UPLOADED ──▶ fila "material.process"
    ▼ worker
1. Se já existe MaterialBlob com o mesmo hash processado → reaproveita (custo zero)
2. Extrai texto por página (camada de texto; páginas vazias → OCR via Claude)
3. Detecta índice/títulos → cria Topics (IA com saída estruturada)
4. Chunking (~800 tokens, sobreposição 100) guardando página inicial/final
5. Embeddings em lote (Voyage) → pgvector
6. Resumo por tópico (Batch API da Anthropic quando não for urgente: 50% mais barato)
7. status=READY  (ou ERROR com mensagem legível)
```
O front consulta o status (polling leve a cada 3s ou SSE) e mostra: enviando → processando (etapa x/7) → pronto / erro.

### Camada de IA (`packages/ai`)

- Cada tarefa é uma função tipada: `generateStudyText`, `generateQuestions`, `gradeOpenAnswer`, `gradeEssay`, `parseEdital`, `buildPlanOutline`, `tutorChat`.
- Saídas estruturadas com `output_config.format` (JSON Schema a partir de Zod) — nada de parsear texto livre.
- **Prompt caching:** system prompt fixo por tarefa + perfil do estudante (tipo/nível) + trechos recuperados vêm antes do ponto de cache; a pergunta variável vem depois.
- **Cache de aplicação:** `AiArtifact(kind, inputHash)` — mesma entrada = resposta do banco, sem nova chamada.
- **Medição de uso:** toda chamada grava `AiUsage` (tokens de entrada/saída/cache, custo estimado, userId, tarefa) → alimenta limites por plano e painel de custo.
- **Perfil pedagógico por tipo de estudante** (`core/studentProfiles.ts`): linguagem, dificuldade, formatos de questão (ENEM 5 alternativas, banca CESPE certo/errado, etc.), critérios de correção de redação.
- Tratamento de `stop_reason` (`refusal`, `max_tokens`) e erros tipados do SDK com retry na fila.

---

## 3. Modelo de dados (PostgreSQL)

Convenções: `id` cuid, `createdAt/updatedAt` em todas; `deletedAt` onde houver exclusão lógica.

### 3.1 Contas e LGPD
| Tabela | Campos principais | Relações |
|---|---|---|
| **User** | name, email (único), passwordHash?, handle (único, `^[a-z0-9._]{3,30}$`), avatarUrl, birthDate, isMinor, guardianConsentStatus (`NOT_REQUIRED`/`PENDING`/`GRANTED`/`REVOKED`), profileVisibility (`PUBLIC`/`PRIVATE`), theme, timezone (padrão `America/Sao_Paulo`), xp, level, currentStreak, longestStreak, lastStudyDate, termsAcceptedAt, termsVersion | 1–N com quase tudo |
| Account / Session / VerificationToken | padrão Auth.js | User |
| **GuardianConsent** | userId, guardianName, guardianEmail, token, grantedAt, revokedAt, ip | User |
| **HandleReservation** (opcional) | handle reservado/palavras proibidas | — |
| **DataExportRequest** | userId, status, fileUrl, expiresAt | User |

### 3.2 Preparações e materiais
| Tabela | Campos principais | Relações |
|---|---|---|
| **Preparation** | userId, title, studentType (`FUNDAMENTAL`,`MEDIO`,`ENEM_VESTIBULAR`,`FACULDADE`,`CONCURSO`,`CURSINHO`,`LIVRE`), details (JSON: série/ano, prova, curso, disciplina, banca, cargo…), examDate?, dailyMinutes, studyDays (int[] 0–6), studyTime ("19:00"), status (`ACTIVE`/`ARCHIVED`), reviewIntervals (int[] padrão [1,7,15,30]) | User; 1–N Subject, Material, StudyPlan |
| **Subject** (disciplina) | preparationId, name, weight (do edital), order, color | 1–N Topic, Material |
| **Topic** (assunto) | subjectId, parentId? (subtópicos), title, order, editalWeight?, estimatedMinutes, difficulty (1–5), sourceKind (`EDITAL`/`MATERIAL`/`MANUAL`) | Subject; N–N Chunk via TopicChunk |
| **MaterialBlob** | sha256 (único), storageKey, mimeType, sizeBytes, pageCount, extractedAt | compartilhado por Materials com mesmo hash (processa uma vez) |
| **Material** | preparationId, subjectId?, uploaderId, blobId, title, kind (`PDF`,`DOCX`,`IMAGE`,`TEXT`,`EDITAL`,`EMENTA`), status (`UPLOADING`,`QUEUED`,`PROCESSING`,`READY`,`ERROR`), progressStep, errorMessage | Preparation, Subject, MaterialBlob |
| **MaterialPage** | blobId, pageNumber, text, ocr (bool) | MaterialBlob |
| **Chunk** | blobId, index, content, pageStart, pageEnd, tokenCount, embedding `vector(1024)` (índice HNSW) | MaterialBlob; N–N Topic |
| **TopicSummary** | topicId, content, sourceRefs (JSON [{materialId,page}]) | Topic |
| **EditalAnalysis** | preparationId, banca, cargo, questionStyle (`MULTIPLA_ESCOLHA`/`CERTO_ERRADO`), raw JSON | Preparation |

### 3.3 Plano e sessões
| Tabela | Campos principais | Relações |
|---|---|---|
| **StudyPlan** | preparationId, version, generatedAt, feasibility (`OK`/`APERTADO`/`INSUFICIENTE`), coverageUntilExam %, notes | Preparation; 1–N PlannedSession |
| **PlannedSession** | planId, date, startTime, durationMin, kind (`STUDY`/`REVIEW`/`PRACTICE`), topicId, reviewNumber? (R1–R4), status (`PENDING`,`DONE`,`MISSED`,`SKIPPED`) | StudyPlan, Topic; 1–1 StudySession |
| **StudySession** | plannedSessionId?, userId, topicId, startedAt, completedAt, minutesSpent, studyTextId | 1–N SessionAnswer |
| **StudyText** | topicId, studentType, content (markdown), highlights (JSON), keyPoints (JSON), sourceRefs, promptVersion | Topic (cacheado por tópico+perfil) |

### 3.4 Questões, respostas e aprendizagem
| Tabela | Campos principais | Relações |
|---|---|---|
| **Question** | topicId, type (`MULTIPLE_CHOICE`,`TRUE_FALSE`,`OPEN_RECALL`,`CERTO_ERRADO`), statement, options (JSON), correctAnswer, explanation, difficulty, style (ENEM/banca), sourceRefs, origin (`AI`/`USER`) | Topic |
| **Attempt** | userId, questionId, context (`SESSION`,`REVIEW`,`ERROR_BANK`,`GAME`,`EXAM`), contextId, answer, isCorrect, score (0–1 p/ aberta), feedback, timeMs | User, Question |
| **ReviewItem** (repetição por questão) | userId, questionId, box/ease, intervalDays, dueAt, lapses, lastResult, inErrorBank (bool), resolvedAt | 1 por usuário+questão |
| **TopicReview** (revisão espaçada do assunto) | userId, topicId, reviewNumber, dueAt, doneAt | gera PlannedSession `REVIEW` |
| **TopicMastery** | userId, topicId, attempts, correct, accuracy, status (`CRITICO` <50%,`EM_DESENVOLVIMENTO` 50–75%,`BOM` >75%), updatedAt | agregado para painel e planner |

Regras: erro → `ReviewItem.inErrorBank = true`, `dueAt = amanhã`; acerto → intervalo cresce (1→3→7→15→30→60 dias). Acertos voltam com frequência menor que erros.

### 3.5 Professor IA
| **TutorThread** | userId, preparationId, title | 1–N TutorMessage |
|---|---|---|
| **TutorMessage** | threadId, role, content, sourceRefs, tokens | |

### 3.6 Jogos (Fase 2)
| **Game** | slug (`snake`), name, configSchema (JSON), enabled | registro de jogos plugáveis |
|---|---|---|
| **GameRun** | userId, gameSlug, preparationId, topicIds, config (JSON), score, correct, wrong, avgTimeMs, endedReason, startedAt, endedAt | 1–N Attempt (context=GAME) |

### 3.7 Simulados (Fase 2)
| **Exam** | ownerId, preparationId?, groupId?, title, questionStyle, durationMin, questionCount, topicIds | N–N Question via ExamQuestion(order) |
|---|---|---|
| **ExamAttempt** | examId, userId, startedAt, finishedAt, score, perSubject (JSON), timeSpentSec | 1–N Attempt |

### 3.8 Redação (Fase 2)
| **EssayPrompt** | preparationId?, theme, genre, instructions, origin (AI/USER) | |
|---|---|---|
| **Essay** | userId, promptId, text, wordCount, rubric (`ENEM`,`DISCURSIVA`,`GERAL`), status | 1–1 EssayEvaluation |
| **EssayEvaluation** | essayId, overallScore, competencies (JSON: ENEM C1–C5 0–200), annotations (JSON [{start,end,category,message,suggestion}]), tips | |

### 3.9 Gamificação (Fase 3, XP/streak já na Fase 1)
| **XpEvent** | userId, amount, reason, refId | |
|---|---|---|
| **Achievement** | slug, name, description, icon, criteria (JSON) | |
| **UserAchievement** | userId, achievementId, unlockedAt | |
| **StudyDay** | userId, date, minutes (para streak e meta semanal) | |

### 3.10 Grupos (Fase 3)
| **Group** | name, description, ownerId, avatarUrl | |
|---|---|---|
| **GroupMember** | groupId, userId, role (`OWNER`,`ADMIN`,`MEMBER`), joinedAt | único (groupId,userId) |
| **GroupInvite** | groupId, inviterId, inviteeId, status (`PENDING`,`ACCEPTED`,`DECLINED`,`EXPIRED`) | |
| **GroupShare** | groupId, sharedById, resourceType (`MATERIAL`,`SUMMARY`,`QUESTION_SET`,`EXAM`), resourceId | autorização de leitura para membros |
| **GroupMessage** | groupId, authorId, content, deletedAt | |

### 3.11 Assinatura e limites (Fase 3; tabela de limites já na Fase 1)
| **Plan** | slug (`free`,`mensal`,`anual`…), name, priceCents, interval, limits (JSON: `activePreparations`, `essayCorrectionsPerMonth`, `tutorMessagesPerMonth`, `groupsOwned`, `gameRunsPerDay`, `examsPerMonth`), active | **PDFs sem limite de quantidade** — só tamanho por arquivo |
|---|---|---|
| **Subscription** | userId, planId, provider, providerCustomerId, providerSubscriptionId, status (`TRIALING`,`ACTIVE`,`PAST_DUE`,`CANCELED`), currentPeriodEnd, cancelAtPeriodEnd, paymentMethod (`PIX`,`CARD`) | |
| **PaymentEvent** | provider, eventId (único — idempotência), payload, processedAt | |
| **UsageCounter** | userId, metric, periodStart, count | checagem de limite |
| **AiUsage** | userId, task, model, inputTokens, outputTokens, cacheReadTokens, costCents | custo de IA |

### 3.12 Notificações (Fase 3; lembrete por e-mail pode entrar antes)
| **NotificationPreference** | userId, emailEnabled, pushEnabled, reminderTime override | |
|---|---|---|
| **PushSubscription** | userId, endpoint, keys | |
| **Notification** | userId, type, payload, readAt, sentAt | convites, lembretes, conquistas |

---

## 4. Algoritmo do plano de estudo (resumo)

1. **Inventário:** tópicos (do edital/ementa + material), cada um com `estimatedMinutes` (tamanho do conteúdo × fator do perfil) e prioridade = `peso_edital × (1 + dificuldade) × (1 − domínio_atual)`.
2. **Capacidade:** dias de estudo entre hoje e a prova × `dailyMinutes`. Reserva ~20–30% da capacidade para revisões e prática.
3. **Viabilidade:** se `soma(estimatedMinutes) > capacidade útil` → `INSUFICIENTE` com aviso claro ("faltam ~X horas; sugerimos aumentar para Y min/dia ou focar nos tópicos de maior peso"), e o plano passa a cobrir só os de maior prioridade.
4. **Fatiamento:** tópicos maiores que a sessão diária são quebrados em partes que cabem exatamente no tempo (ex.: 15 min = ~8 min leitura + ~7 min perguntas).
5. **Distribuição:** ordem por prioridade, intercalando disciplinas; revisões R1–R4 inseridas nas datas devidas; itens do banco de erros vencidos ocupam o bloco de prática.
6. **Replanejamento automático** (job diário às 03h e ao concluir sessão): sessões `MISSED` são redistribuídas; tópicos com domínio `CRITICO` ganham sessão extra; tópicos `BOM` têm revisões espaçadas mais longas.

O algoritmo é **determinístico, em TypeScript, em `packages/core`** (testável, sem custo de IA). A IA só é usada para extrair tópicos/pesos do edital e estimar dificuldade.

---

## 5. Lista de telas

**Públicas:** Landing · Login · Cadastro (nome, e-mail, senha, data de nascimento, @ com validação em tempo real) · Consentimento do responsável (link do e-mail) · Termos de uso · Política de privacidade · Recuperar senha.

**Onboarding:** Escolher @ (para quem entrou com Google) · Criar primeira preparação.

**App (menu lateral no desktop / barra inferior no celular: Início, Estudar, Praticar, Desempenho, Mais):**
1. **Início** — o que fazer hoje, progresso do plano, streak, meta semanal, pontos de atenção.
2. **Preparações** — lista; **Nova preparação** (assistente em passos: tipo → campos do tipo → edital/ementa → tempo/dias/horário/data da prova → materiais).
3. **Detalhe da preparação** — disciplinas, tópicos, materiais (upload múltiplo com status), plano.
4. **Materiais** — lista com status, visualizador de PDF abrindo na página citada.
5. **Plano / Calendário** — visão semana/mês com sessões e revisões.
6. **Estudar (sessão)** — texto de estudo com citações → destaques → recuperação ativa → objetivas → concluir.
7. **Revisões do dia** e **Banco de erros** (filtros por disciplina/assunto, refazer).
8. **Professor IA** — chat com atalhos Explicar / Me testar / Criar questões / Analisar meus erros.
9. **Jogos** — catálogo → Jogo da cobrinha (configuração → jogo → resultado). *(F2)*
10. **Simulados** — criar, fazer (cronômetro), resultado com gabarito comentado, histórico. *(F2)*
11. **Redação** — escolher/gerar tema, editor, correção com marcações lado a lado, histórico. *(F2)*
12. **Desempenho** — por disciplina/assunto, etiquetas vermelho/amarelo/verde, gráficos de evolução. *(F2)*
13. **Grupos** — lista, convites recebidos, página do grupo (mural, compartilhados, simulados, ranking), gerenciar membros. *(F3)*
14. **Perfil** — @, nível, conquistas, estatísticas, privacidade. *(F3 completo)*
15. **Assinatura** — planos, checkout (Pix/cartão), gerenciar/cancelar. *(F3)*
16. **Configurações** — conta, notificações, tema, exportar dados, excluir conta.

---

## 6. Plano por fases

### Fase 0 — Fundação (curta, parte da entrega da Fase 1)
Monorepo, docker-compose (Postgres+pgvector, MinIO, Mailpit), Prisma, Auth.js, layout responsivo com tema escuro, CI (lint, typecheck, testes), seed de dados.

### Fase 1 — MVP
- Cadastro/login (e-mail+senha, Google), @ único com checagem em tempo real, data de nascimento e fluxo de consentimento do responsável para menores, aceite de termos.
- Criar preparação (todos os tipos, campos condicionais; edital obrigatório para concurso).
- Upload ilimitado (limite de tamanho por arquivo, ex. 100 MB), fila, extração + OCR, tópicos, chunks, embeddings, status em tempo real. Reaproveitamento por hash.
- Análise de edital (disciplinas, assuntos, pesos, banca).
- Gerador de plano (tempo diário, dias, horário, data da prova, aviso de viabilidade) + replanejamento.
- Sessão de estudo: texto com citações (link para a página do PDF), destaques, recuperação ativa com correção por IA, objetivas, concluir.
- Banco de erros + repetição de acertos + revisões R1–R4 (intervalos configuráveis) entrando no plano do dia.
- Início com "hoje", XP básico e streak.
- Lembrete por e-mail no horário escolhido (simples; push fica na Fase 3).
- Tabela `Plan` + `UsageCounter` já existentes (tudo liberado no plano grátis por enquanto), `AiUsage` registrando custo.

**Como testar ao fim da Fase 1:** criar conta menor de idade e ver bloqueio até consentimento; @ duplicado rejeitado; criar preparação de concurso com edital real e conferir disciplinas/pesos; subir PDF com texto e PDF escaneado; plano de 15 min/dia com prova em 30 dias mostrando aviso quando não couber; fazer uma sessão, errar questões e vê-las no banco de erros; avançar a data (utilitário de dev) e ver R1 no dia seguinte.

### Fase 2
Jogo da cobrinha (sistema de jogos plugável: interface `GameDefinition` com `configSchema`, componente, regras de pontuação), simulados (estilo da banca, cronômetro, gabarito, histórico), correção de redação (ENEM C1–C5, discursiva, geral; marcações no texto), painel de desempenho completo, Professor IA.

### Fase 3
Grupos (convites por @, papéis, compartilhamento, simulado em grupo com ranking, mural), planos pagos (Asaas: Pix + cartão, recorrência, webhooks idempotentes, cancelamento, tela de gestão, aplicação dos limites), notificações push/PWA, conquistas e níveis completos, perfil público/privado, exportação e exclusão de conta.

---

## 7. Segurança e LGPD

- Autorização centralizada + testes de acesso cruzado (usuário A nunca lê material de B; membro de grupo só lê o que foi compartilhado).
- Storage privado; downloads só por URL assinada de curta duração gerada após checagem de acesso.
- Rate limit nas rotas de IA e de checagem de @.
- Menores: data de nascimento obrigatória; `<18` → conta em modo restrito (sem grupos/perfil público) até o responsável confirmar pelo link enviado ao e-mail dele (LGPD art. 14). Registro de data/IP do consentimento; revogação possível.
- Termos: aluno é responsável pelos materiais que envia/compartilha (direitos autorais), canal de denúncia/remoção.
- Exportar dados (JSON + arquivos) e excluir conta (apaga dados e arquivos; blobs órfãos removidos por job).
- Webhooks de pagamento com verificação de assinatura/token e idempotência.
- Segredos só em variáveis de ambiente do servidor.
