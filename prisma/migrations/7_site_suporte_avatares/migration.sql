-- Redes sociais (configuráveis), canal de suporte e foto de perfil (avatar).
-- Também apaga todas as contas de teste criadas antes do lançamento (pedido do dono do site):
-- a primeira conta criada depois disso vira administradora automaticamente.

ALTER TABLE "user" ADD COLUMN "avatar" TEXT;

CREATE TABLE "SiteSetting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "SupportMessage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "fromStaff" BOOLEAN NOT NULL DEFAULT false,
  "body" TEXT NOT NULL,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SupportMessage_userId_createdAt_idx" ON "SupportMessage"("userId", "createdAt");
CREATE INDEX "SupportMessage_fromStaff_readAt_idx" ON "SupportMessage"("fromStaff", "readAt");
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- apaga as contas (e, em cascata, preparações, sessões, grupos, assinaturas etc.)
DELETE FROM "user";
DELETE FROM "AiUsage";
DELETE FROM "verification";
