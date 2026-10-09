-- Troca de plano com desconto pelos dias não usados: guarda o crédito dado e quantos dias o pagamento libera.
-- Só adiciona colunas (nenhum dado é apagado).
ALTER TABLE "Payment" ADD COLUMN "creditCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Payment" ADD COLUMN "periodDays" INTEGER NOT NULL DEFAULT 30;
