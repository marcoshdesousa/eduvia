-- Apagar TODAS as contas, inclusive a de administrador, e todos os estudos e arquivos.
-- Pedido e confirmado pelo dono do Eduvia ("Pode apagar todas, inclusive do administrador. E todos os arquivos").
-- Uma única vez: migrações não rodam de novo, então as próximas atualizações NÃO apagam nada.
-- A primeira conta criada depois disto vira a administradora. Ficam os planos (Plan) e as configurações (SiteSetting).
TRUNCATE TABLE "user", "session", "account", "verification", "GuardianConsent",
  "Preparation", "Subject", "Topic", "MaterialBlob", "Material", "MaterialPage", "Chunk", "TopicChunk", "EditalAnalysis",
  "StudyPlan", "PlannedSession", "StudySession", "StudyText", "Question", "Attempt", "ReviewItem", "TopicReview", "TopicMastery",
  "XpEvent", "StudyDay", "Subscription", "Payment", "PaymentEvent", "UsageCounter", "AiUsage", "AiCache",
  "GameRun", "Exam", "ExamAttempt", "Essay", "TutorThread", "TutorMessage",
  "Group", "GroupMember", "GroupInvite", "GroupShare", "GroupMessage", "UserAchievement", "Notification", "PushSubscription",
  "SupportTicket", "SupportMessage", "PreparationCreation", "Tournament"
CASCADE;

-- arquivos no disco (PDFs, áudios, páginas): o worker apaga uma vez ao iniciar
INSERT INTO "SiteSetting" (key, value, "updatedAt") VALUES ('wipe-files', 'pending', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE SET value = 'pending', "updatedAt" = CURRENT_TIMESTAMP;
