-- Teste rápido (substitui os jogos), aula do banco de erros e simulados por mês.

ALTER TABLE "GameRun" ADD COLUMN "name" TEXT;
ALTER TABLE "Question" ADD COLUMN "lesson" TEXT;

-- simulados: limite por mês (8 no plano pago); testes rápidos à vontade no plano pago
UPDATE "Plan" SET limits = (limits - 'examsPerDay') || '{"examsPerMonth":8,"gamesPerDay":-1}'::jsonb WHERE slug = 'eduvia';
UPDATE "Plan" SET limits = (limits - 'examsPerDay') || '{"examsPerMonth":0,"gamesPerDay":3}'::jsonb WHERE slug = 'gratis';
