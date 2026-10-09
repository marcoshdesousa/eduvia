-- Planos em níveis (grátis, essencial, completo, intensivo), cada um com preço semanal e mensal e limites próprios.

ALTER TABLE "Plan" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "priceWeekCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "priceMonthCents" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Subscription" ADD COLUMN "interval" "BillingInterval" NOT NULL DEFAULT 'MONTH';
UPDATE "Subscription" s SET "interval" = p."interval" FROM "Plan" p WHERE p.slug = s."planSlug";

INSERT INTO "Plan" (slug, name, "order", "priceWeekCents", "priceMonthCents", "priceCents", "interval", limits, active) VALUES
  ('gratis', 'Grátis', 0, 0, 0, 0, 'MONTH',
   '{"activePreparations":1,"materials":0,"pagesPerMonth":0,"newSessionsPerDay":0,"gamesPerDay":1,"examsPerMonth":0,"essays":false,"tutorMessagesPerMonth":0,"groups":false,"groupsOwned":0}', true),
  ('essencial', 'Essencial', 1, 990, 2990, 0, 'MONTH',
   '{"activePreparations":5,"materials":5,"pagesPerMonth":500,"newSessionsPerDay":1,"gamesPerDay":5,"examsPerMonth":4,"essays":true,"tutorMessagesPerMonth":100,"groups":true,"groupsOwned":5}', true),
  ('completo', 'Completo', 2, 1490, 4990, 0, 'MONTH',
   '{"activePreparations":10,"materials":10,"pagesPerMonth":700,"newSessionsPerDay":2,"gamesPerDay":10,"examsPerMonth":8,"essays":true,"tutorMessagesPerMonth":200,"groups":true,"groupsOwned":5}', true),
  ('intensivo', 'Intensivo', 3, 2990, 9990, 0, 'MONTH',
   '{"activePreparations":25,"materials":25,"pagesPerMonth":900,"newSessionsPerDay":4,"gamesPerDay":15,"examsPerMonth":16,"essays":true,"tutorMessagesPerMonth":300,"groups":true,"groupsOwned":5}', true)
ON CONFLICT (slug) DO NOTHING;

-- assinaturas dos planos antigos (semanal/mensal) passam para o Essencial
UPDATE "Subscription" SET "planSlug" = 'essencial' WHERE "planSlug" IN ('semanal', 'mensal');
DELETE FROM "Plan" WHERE slug IN ('semanal', 'mensal');

ALTER TABLE "Plan" DROP COLUMN "priceCents", DROP COLUMN "interval";
