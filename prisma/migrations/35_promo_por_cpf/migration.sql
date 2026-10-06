-- Promoção dos primeiros meses guardada pelo CPF (em forma de código, não o CPF em si): fica mesmo se a conta
-- for apagada e criada de novo. Só adiciona (nada é apagado).
ALTER TABLE "Payment" ADD COLUMN "promo" BOOLEAN NOT NULL DEFAULT false;
CREATE TABLE "PromoUse" (
  "cpfHash" TEXT NOT NULL,
  "planSlug" TEXT NOT NULL,
  "uses" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PromoUse_pkey" PRIMARY KEY ("cpfHash", "planSlug")
);
