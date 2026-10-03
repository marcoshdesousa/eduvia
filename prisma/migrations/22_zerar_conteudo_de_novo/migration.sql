-- Zerar o conteúdo de estudo de novo (pedido do dono do Eduvia, uma única vez, para as contas de teste).
-- Migrações rodam só uma vez: as próximas atualizações do site NÃO apagam nada.
-- Apaga: PDFs, guias de estudo (e a contagem do mês), assuntos, aulas, questões, banco de erros,
-- testes rápidos, simulados, redações, Professor IA, XP, sequência e conquistas.
-- NÃO apaga: cadastros, assinaturas e pagamentos, planos, grupos e membros, mural, suporte e configurações.
TRUNCATE TABLE
  "Attempt", "ReviewItem", "StudySession", "PlannedSession", "StudyPlan",
  "TopicReview", "TopicMastery", "TopicChunk", "Question", "StudyText", "Topic", "Subject",
  "Material", "Chunk", "MaterialPage", "MaterialBlob", "EditalAnalysis",
  "Essay", "ExamAttempt", "Exam", "TutorMessage", "TutorThread", "GameRun",
  "Preparation", "PreparationCreation", "GroupShare", "Tournament",
  "XpEvent", "StudyDay", "UserAchievement", "UsageCounter", "AiCache", "Notification";

UPDATE "user" SET xp = 0, "currentStreak" = 0, "longestStreak" = 0, "lastStudyDate" = NULL, "aiPausedUntil" = NULL;

-- arquivos enviados no disco: o worker apaga uma vez ao iniciar
INSERT INTO "SiteSetting" (key, value, "updatedAt") VALUES ('wipe-files', 'pending', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE SET value = 'pending', "updatedAt" = CURRENT_TIMESTAMP;
