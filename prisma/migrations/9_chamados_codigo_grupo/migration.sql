-- Chamados de suporte, código para entrar em grupos e 700 páginas por dia no plano pago.

CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'CLOSED');

CREATE TABLE "SupportTicket" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "closedAt" TIMESTAMP(3),
  CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SupportTicket_userId_createdAt_idx" ON "SupportTicket"("userId", "createdAt");
CREATE INDEX "SupportTicket_status_updatedAt_idx" ON "SupportTicket"("status", "updatedAt");
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- conversas antigas viram um chamado aberto por aluno
INSERT INTO "SupportTicket" ("id", "userId", "kind", "status", "createdAt", "updatedAt")
SELECT 'tk_' || "userId", "userId", 'Dúvida', 'OPEN', MIN("createdAt"), MAX("createdAt") FROM "SupportMessage" GROUP BY "userId";

ALTER TABLE "SupportMessage" ADD COLUMN "ticketId" TEXT;
UPDATE "SupportMessage" SET "ticketId" = 'tk_' || "userId";
ALTER TABLE "SupportMessage" ALTER COLUMN "ticketId" SET NOT NULL;
CREATE INDEX "SupportMessage_ticketId_createdAt_idx" ON "SupportMessage"("ticketId", "createdAt");
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- código de 6 caracteres para cada grupo
ALTER TABLE "Group" ADD COLUMN "code" TEXT;
UPDATE "Group" SET "code" = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || "id") FROM 1 FOR 6));
ALTER TABLE "Group" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");

-- plano pago: 700 páginas por dia (150 escaneadas)
UPDATE "Plan" SET limits = limits || '{"pagesPerDay":700,"scannedPagesPerDay":150}'::jsonb WHERE slug = 'eduvia';
