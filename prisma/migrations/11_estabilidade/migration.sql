-- Tentativas automáticas de processar um material (cota da IA, instabilidade do Google).
ALTER TABLE "Material" ADD COLUMN "autoRetries" INTEGER NOT NULL DEFAULT 0;
