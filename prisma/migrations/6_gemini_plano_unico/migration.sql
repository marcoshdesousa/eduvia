-- IA com a chave Gemini do próprio aluno + plano único (Eduvia) e plano Grátis limitado, com limites por dia.

ALTER TABLE "user" ADD COLUMN "geminiKey" TEXT,
  ADD COLUMN "geminiKeyHint" TEXT,
  ADD COLUMN "geminiConnectedAt" TIMESTAMP(3),
  ADD COLUMN "aiPausedUntil" TIMESTAMP(3);

ALTER TABLE "Subject" ADD COLUMN "books" JSONB;

INSERT INTO "Plan" (slug, name, "order", "priceWeekCents", "priceMonthCents", limits, active) VALUES
  ('eduvia', 'Eduvia', 1, 700, 1500,
   '{"activePreparations":-1,"materials":-1,"pagesPerDay":300,"scannedPagesPerDay":60,"newSessionsPerDay":6,"gamesPerDay":10,"examsPerDay":2,"essaysPerDay":3,"tutorMessagesPerDay":40,"groups":true,"groupsOwned":5,"restAfterMinutes":180}', true)
ON CONFLICT (slug) DO NOTHING;

UPDATE "Plan" SET limits = '{"activePreparations":1,"materials":1,"pagesPerDay":30,"scannedPagesPerDay":5,"newSessionsPerDay":1,"gamesPerDay":2,"examsPerDay":0,"essaysPerDay":1,"tutorMessagesPerDay":5,"groups":false,"groupsOwned":0,"restAfterMinutes":180}'
WHERE slug = 'gratis';

-- assinaturas dos planos em níveis passam para o plano único
UPDATE "Subscription" SET "planSlug" = 'eduvia' WHERE "planSlug" IN ('essencial', 'completo', 'intensivo');
DELETE FROM "Plan" WHERE slug IN ('essencial', 'completo', 'intensivo');
