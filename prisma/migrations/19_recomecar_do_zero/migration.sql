-- Recomeçar do zero (pedido do dono do Eduvia, uma única vez, para as contas de teste testarem as novidades).
-- Migrações rodam só uma vez: as próximas atualizações do site NÃO apagam nada.
--
-- Apaga todo o conteúdo de estudo: PDFs, guias de estudo e a contagem de guias do mês, assuntos, aulas,
-- questões, banco de erros, testes rápidos, simulados, redações, Professor IA, XP, sequência e conquistas.
-- NÃO apaga: cadastros (user, login, chave do Gemini, foto), assinaturas e pagamentos, planos, grupos e
-- membros, mural, chamados de suporte, aparelhos com notificação e configurações do site.
-- TRUNCATE sem CASCADE: se alguma tabela que deve ficar dependesse destas, o comando falharia (não apaga nada a mais).
TRUNCATE TABLE
  "Attempt", "ReviewItem", "StudySession", "PlannedSession", "StudyPlan",
  "TopicReview", "TopicMastery", "TopicChunk", "Question", "StudyText", "Topic", "Subject",
  "Material", "Chunk", "MaterialPage", "MaterialBlob", "EditalAnalysis",
  "Essay", "ExamAttempt", "Exam", "TutorMessage", "TutorThread", "GameRun",
  "Preparation", "PreparationCreation", "GroupShare", "Tournament",
  "XpEvent", "StudyDay", "UserAchievement", "UsageCounter", "AiCache", "Notification";

UPDATE "user" SET xp = 0, "currentStreak" = 0, "longestStreak" = 0, "lastStudyDate" = NULL, "aiPausedUntil" = NULL;

-- os arquivos enviados (no disco) são apagados uma vez pelo worker ao iniciar (ver src/worker/start.ts)
INSERT INTO "SiteSetting" (key, value, "updatedAt") VALUES ('wipe-files', 'pending', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE SET value = 'pending', "updatedAt" = CURRENT_TIMESTAMP;
