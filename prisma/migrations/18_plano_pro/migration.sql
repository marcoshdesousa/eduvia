-- O plano de entrada passa a se chamar Pro (Pro, Avançado e Ilimitado). Garante que os antigos Plus/Pro não existem mais.
UPDATE "Subscription" SET "planSlug" = 'avancado' WHERE "planSlug" IN ('plus', 'pro');
DELETE FROM "Plan" WHERE slug IN ('plus', 'pro');
UPDATE "Plan" SET name = 'Pro', active = true WHERE slug = 'eduvia';
UPDATE "Plan" SET active = true WHERE slug IN ('avancado', 'ilimitado');
