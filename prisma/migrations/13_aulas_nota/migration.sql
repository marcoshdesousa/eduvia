-- Aulas com nota: a próxima aula só libera com 75% ou mais. O aluno pode refazer a aula.
ALTER TABLE "StudySession" ADD COLUMN "lastScore" DOUBLE PRECISION;
ALTER TABLE "StudySession" ADD COLUMN "bestScore" DOUBLE PRECISION;
ALTER TABLE "StudySession" ADD COLUMN "tries" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StudySession" ADD COLUMN "passedAt" TIMESTAMP(3);
ALTER TABLE "StudySession" ADD COLUMN "roundStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- sessões já concluídas antes desta mudança contam como aprovadas
UPDATE "StudySession" SET "passedAt" = "completedAt", "roundStartedAt" = "startedAt" WHERE "completedAt" IS NOT NULL;
UPDATE "StudySession" SET "roundStartedAt" = "startedAt" WHERE "completedAt" IS NULL;
