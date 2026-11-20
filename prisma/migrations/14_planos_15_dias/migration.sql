-- Período de 15 dias e três planos pagos: Básico (R$ 15), Avançado (R$ 30) e Ilimitado (R$ 50).
ALTER TYPE "BillingInterval" ADD VALUE IF NOT EXISTS 'FORTNIGHT';
ALTER TABLE "Plan" ADD COLUMN "priceFortnightCents" INTEGER NOT NULL DEFAULT 0;

UPDATE "Plan" SET "priceWeekCents" = 700, "priceFortnightCents" = 1000, "priceMonthCents" = 1500, "order" = 1 WHERE slug = 'eduvia';
UPDATE "Plan" SET "priceWeekCents" = 1200, "priceFortnightCents" = 1900, "priceMonthCents" = 3000, "order" = 2 WHERE slug = 'avancado';
UPDATE "Plan" SET "priceWeekCents" = 1800, "priceFortnightCents" = 3000, "priceMonthCents" = 5000, "order" = 3 WHERE slug = 'ilimitado';
-- Plus e Pro saem da vitrine (quem já assinou continua com o plano até o fim do período)
UPDATE "Plan" SET active = false, "order" = 8 WHERE slug IN ('plus', 'pro');
-- Grátis: 1 PDF de até 100 páginas
UPDATE "Plan" SET limits = limits || '{"materials": 1, "pagesPerPdf": 100}'::jsonb WHERE slug = 'gratis';
UPDATE "Plan" SET limits = limits || '{"pagesPerPdf": -1}'::jsonb WHERE slug <> 'gratis';
