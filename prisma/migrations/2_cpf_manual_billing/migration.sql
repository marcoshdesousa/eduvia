-- AlterEnum
ALTER TYPE "BillingType" ADD VALUE 'MANUAL';


-- AlterTable
ALTER TABLE "user" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");

