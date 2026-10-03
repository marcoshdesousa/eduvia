-- Botão "Gerar aulas": os arquivos só são lidos no envio; as aulas (assuntos + plano) são geradas quando o aluno pede.
ALTER TABLE "Preparation" ADD COLUMN "lessonsStatus" TEXT NOT NULL DEFAULT 'IDLE';
ALTER TABLE "Preparation" ADD COLUMN "lessonsStartedAt" TIMESTAMP(3);
ALTER TABLE "Preparation" ADD COLUMN "lessonsStep" TEXT;
ALTER TABLE "Preparation" ADD COLUMN "lessonsProgress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Material" ADD COLUMN "organizedAt" TIMESTAMP(3);

-- o que já existia continua valendo: materiais prontos já estão organizados e os guias com assuntos já têm aulas
UPDATE "Material" SET "organizedAt" = "updatedAt" WHERE status = 'READY';
UPDATE "Preparation" p SET "lessonsStatus" = 'DONE'
 WHERE EXISTS (SELECT 1 FROM "Subject" s JOIN "Topic" t ON t."subjectId" = s.id WHERE s."preparationId" = p.id);
