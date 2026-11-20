-- Contrate rápido: o prestador precisa aceitar as regras (caixinha) para receber chamados.
ALTER TABLE "ProviderProfile" ADD COLUMN "quickTermsAt" TIMESTAMP(3);
