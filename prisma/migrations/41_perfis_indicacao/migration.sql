-- Vários perfis por trabalhador (um por profissão), indicação com desconto, mensagens rápidas, editar/apagar mensagens.

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "editedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "serviceId" TEXT;

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "referralsFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "birthDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProviderService" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "photoKey" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "refCode" TEXT,
ADD COLUMN     "referredById" TEXT;

-- CreateTable
CREATE TABLE "QuickReply" (
    "id" TEXT NOT NULL,
    "proId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuickReply_proId_createdAt_idx" ON "QuickReply"("proId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_refCode_key" ON "user"("refCode");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickReply" ADD CONSTRAINT "QuickReply_proId_fkey" FOREIGN KEY ("proId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Dados existentes: a foto, a bio e o Instagram da conta viram os de cada perfil (profissão); as fotos do portfólio
-- vão para o primeiro perfil; cada conta ganha o seu código de convite.
UPDATE "ProviderService" s SET "photoKey" = p."photoKey", "bio" = p."bio", "instagram" = p."instagram"
FROM "ProviderProfile" p WHERE p."id" = s."proId";
UPDATE "Post" po SET "serviceId" = (SELECT s."id" FROM "ProviderService" s WHERE s."proId" = po."proId" ORDER BY s."createdAt" LIMIT 1);
UPDATE "user" SET "refCode" = upper(substr(md5("id" || 'convite'), 1, 8)) WHERE "refCode" IS NULL;
