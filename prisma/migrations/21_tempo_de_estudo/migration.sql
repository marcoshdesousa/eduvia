-- Tempo de estudo contado durante a aula (a sequência vale com 5 minutos no dia).
ALTER TABLE "StudySession" ADD COLUMN "roundPulses" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StudySession" ADD COLUMN "lastPulseAt" TIMESTAMP(3);
