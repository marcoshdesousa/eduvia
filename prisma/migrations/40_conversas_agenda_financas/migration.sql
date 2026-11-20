-- Conversas (estilo WhatsApp), agendamento pela conversa, agenda pessoal, gestão financeira e formas de pagamento.
-- CreateEnum
CREATE TYPE "FinanceKind" AS ENUM ('IN', 'OUT');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PROPOSED';

-- AlterEnum
ALTER TYPE "MessageKind" ADD VALUE 'SCHEDULE';

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_bookingId_fkey";

-- DropIndex
DROP INDEX "Message_bookingId_createdAt_idx";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "conversationId" TEXT,
ALTER COLUMN "bookingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "directBooking" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "payMethods" TEXT[] DEFAULT ARRAY['PIX', 'DINHEIRO']::TEXT[];

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "proId" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendaEntry" (
    "id" TEXT NOT NULL,
    "proId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgendaEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceEntry" (
    "id" TEXT NOT NULL,
    "proId" TEXT NOT NULL,
    "kind" "FinanceKind" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_proId_lastMessageAt_idx" ON "Conversation"("proId", "lastMessageAt");

-- CreateIndex
CREATE INDEX "Conversation_clientId_lastMessageAt_idx" ON "Conversation"("clientId", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_clientId_proId_key" ON "Conversation"("clientId", "proId");

-- CreateIndex
CREATE INDEX "AgendaEntry_proId_startsAt_idx" ON "AgendaEntry"("proId", "startsAt");

-- CreateIndex
CREATE INDEX "FinanceEntry_proId_date_idx" ON "FinanceEntry"("proId", "date");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");


-- Mensagens que já existiam (uma conversa por cliente + prestador)
INSERT INTO "Conversation" ("id", "clientId", "proId", "lastMessageAt", "createdAt")
SELECT 'cv' || md5(b."clientId" || b."proId"), b."clientId", b."proId", max(m."createdAt"), min(m."createdAt")
FROM "Message" m JOIN "Booking" b ON b."id" = m."bookingId"
WHERE b."proId" IS NOT NULL
GROUP BY b."clientId", b."proId";

UPDATE "Message" m SET "conversationId" = 'cv' || md5(b."clientId" || b."proId")
FROM "Booking" b WHERE b."id" = m."bookingId" AND b."proId" IS NOT NULL;

DELETE FROM "Message" WHERE "conversationId" IS NULL;
-- mensagens antigas de texto/arquivo não citam pedido (só os cartões de agendamento citam)
UPDATE "Message" SET "bookingId" = NULL;
ALTER TABLE "Message" ALTER COLUMN "conversationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_proId_fkey" FOREIGN KEY ("proId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaEntry" ADD CONSTRAINT "AgendaEntry_proId_fkey" FOREIGN KEY ("proId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceEntry" ADD CONSTRAINT "FinanceEntry_proId_fkey" FOREIGN KEY ("proId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

