-- Planos por faixa (guias de estudo por mês), sem limite de páginas/PDFs, torneios nos grupos.

CREATE TABLE "PreparationCreation" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PreparationCreation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PreparationCreation_userId_createdAt_idx" ON "PreparationCreation"("userId", "createdAt");
-- preparações já criadas este mês contam
INSERT INTO "PreparationCreation" ("id", "userId", "createdAt")
SELECT 'pc_' || "id", "userId", "createdAt" FROM "Preparation" WHERE "createdAt" >= date_trunc('month', now());

CREATE TABLE "Tournament" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Tournament_groupId_endsAt_idx" ON "Tournament"("groupId", "endsAt");
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- planos: Básico (o antigo "eduvia"), Plus, Pro, Avançado e Ilimitado. Páginas e PDFs sem limite em todos.
UPDATE "Plan" SET name = 'Básico', "order" = 1, "priceWeekCents" = 700, "priceMonthCents" = 1500,
  limits = '{"activePreparations":-1,"preparationsPerMonth":6,"materials":-1,"pagesPerDay":-1,"scannedPagesPerDay":-1,"newSessionsPerDay":6,"gamesPerDay":-1,"examsPerMonth":15,"essaysPerDay":3,"tutorMessagesPerDay":40,"groups":true,"groupsOwned":5,"restAfterMinutes":180}'
WHERE slug = 'eduvia';
UPDATE "Plan" SET limits = limits || '{"materials":-1,"pagesPerDay":-1,"scannedPagesPerDay":-1,"preparationsPerMonth":1}'::jsonb WHERE slug = 'gratis';
INSERT INTO "Plan" (slug, name, "order", "priceWeekCents", "priceMonthCents", limits, active) VALUES
  ('plus', 'Plus', 2, 0, 2000, '{"activePreparations":-1,"preparationsPerMonth":8,"materials":-1,"pagesPerDay":-1,"scannedPagesPerDay":-1,"newSessionsPerDay":6,"gamesPerDay":-1,"examsPerMonth":20,"essaysPerDay":4,"tutorMessagesPerDay":60,"groups":true,"groupsOwned":5,"restAfterMinutes":180}', true),
  ('pro', 'Pro', 3, 0, 2500, '{"activePreparations":-1,"preparationsPerMonth":12,"materials":-1,"pagesPerDay":-1,"scannedPagesPerDay":-1,"newSessionsPerDay":8,"gamesPerDay":-1,"examsPerMonth":30,"essaysPerDay":5,"tutorMessagesPerDay":80,"groups":true,"groupsOwned":5,"restAfterMinutes":180}', true),
  ('avancado', 'Avançado', 4, 0, 3000, '{"activePreparations":-1,"preparationsPerMonth":15,"materials":-1,"pagesPerDay":-1,"scannedPagesPerDay":-1,"newSessionsPerDay":10,"gamesPerDay":-1,"examsPerMonth":40,"essaysPerDay":6,"tutorMessagesPerDay":100,"groups":true,"groupsOwned":5,"restAfterMinutes":180}', true),
  ('ilimitado', 'Ilimitado', 5, 0, 8000, '{"activePreparations":-1,"preparationsPerMonth":35,"materials":-1,"pagesPerDay":-1,"scannedPagesPerDay":-1,"newSessionsPerDay":-1,"gamesPerDay":-1,"examsPerMonth":-1,"essaysPerDay":-1,"tutorMessagesPerDay":-1,"groups":true,"groupsOwned":-1,"restAfterMinutes":180}', true)
ON CONFLICT (slug) DO NOTHING;
