-- Valor por hora em cada perfil, redes sociais (WhatsApp, TikTok, YouTube) e posição do trabalhador a caminho.
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "proLat" DOUBLE PRECISION,
ADD COLUMN     "proLng" DOUBLE PRECISION,
ADD COLUMN     "proPosAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProviderService" ADD COLUMN     "hourCents" INTEGER,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "whatsapp" TEXT,
ADD COLUMN     "youtube" TEXT;

