-- Só três planos pagos: quem estava no Plus ou no Pro passa para o Avançado (melhor), e esses planos somem.
UPDATE "Subscription" SET "planSlug" = 'avancado' WHERE "planSlug" IN ('plus', 'pro');
DELETE FROM "Plan" WHERE slug IN ('plus', 'pro');
