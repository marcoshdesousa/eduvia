-- Remove de vez a Cerebras do Eduvia (passou a exigir cartão): apaga as colunas das chaves e limpa a lista de IAs desligadas.
ALTER TABLE "user" DROP COLUMN IF EXISTS "cerebrasKey";
ALTER TABLE "user" DROP COLUMN IF EXISTS "cerebrasKeyHint";
UPDATE "SiteSetting" SET value = '[]', "updatedAt" = CURRENT_TIMESTAMP WHERE key = 'ai-disabled';
