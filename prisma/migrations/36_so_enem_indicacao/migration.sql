-- Eduvia focado no ENEM: planos novos (Grátis, Básico, Completo e Indicação) e indicação por código. Só adiciona/atualiza.

-- indicação: código de 6 números por conta e quem indicou
ALTER TABLE "user" ADD COLUMN "referralCode" TEXT;
ALTER TABLE "user" ADD COLUMN "referredById" TEXT;
CREATE UNIQUE INDEX "user_referralCode_key" ON "user"("referralCode");
ALTER TABLE "Payment" ADD COLUMN "referral" BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE "ReferralUse" (
  "cpfHash" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "referredUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReferralUse_pkey" PRIMARY KEY ("cpfHash")
);
CREATE INDEX "ReferralUse_referrerId_createdAt_idx" ON "ReferralUse"("referrerId", "createdAt");

-- planos: Grátis (10% das aulas), Básico R$ 9,90 (50%), Completo R$ 19,90 (tudo) e Indicação (tudo, preço por indicação)
UPDATE "Plan" SET name = 'Grátis', "order" = 0, "priceMonthCents" = 0,
  limits = '{"lessonsPct":10,"gamesPerDay":-1,"gamesPerMonth":1,"examsPerDay":-1,"examsPerMonth":1,"essaysPerDay":-1,"essaysPerMonth":1,"tutorMessagesPerDay":-1,"tutorMessagesPerMonth":5,"groups":false,"groupsOwned":0,"restAfterMinutes":180}'
WHERE slug = 'gratis';
INSERT INTO "Plan" (slug, name, "order", "priceWeekCents", "priceFortnightCents", "priceMonthCents", limits, active) VALUES
  ('basico', 'Básico', 1, 0, 0, 990, '{"lessonsPct":50,"gamesPerDay":3,"gamesPerMonth":-1,"examsPerDay":1,"examsPerMonth":-1,"essaysPerDay":2,"essaysPerMonth":-1,"tutorMessagesPerDay":10,"tutorMessagesPerMonth":-1,"groups":false,"groupsOwned":0,"restAfterMinutes":180}', true),
  ('completo', 'Completo', 2, 0, 0, 1990, '{"lessonsPct":100,"gamesPerDay":-1,"gamesPerMonth":-1,"examsPerDay":3,"examsPerMonth":-1,"essaysPerDay":5,"essaysPerMonth":-1,"tutorMessagesPerDay":30,"tutorMessagesPerMonth":-1,"groups":true,"groupsOwned":3,"restAfterMinutes":180}', true),
  ('indicacao', 'Indicação', 3, 0, 0, 990, '{"lessonsPct":100,"gamesPerDay":-1,"gamesPerMonth":-1,"examsPerDay":3,"examsPerMonth":-1,"essaysPerDay":5,"essaysPerMonth":-1,"tutorMessagesPerDay":30,"tutorMessagesPerMonth":-1,"groups":true,"groupsOwned":3,"restAfterMinutes":180}', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, "order" = EXCLUDED."order", "priceMonthCents" = EXCLUDED."priceMonthCents", limits = EXCLUDED.limits, active = true;
-- planos antigos saem da tela (continuam no banco só pelo histórico)
UPDATE "Plan" SET active = false, "order" = 9 WHERE slug IN ('eduvia', 'avancado', 'ilimitado');
