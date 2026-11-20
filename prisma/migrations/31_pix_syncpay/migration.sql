-- Pagamento por Pix (SyncPay): o código "copia e cola" da cobrança, para mostrar o QR Code de novo.
ALTER TABLE "Payment" ADD COLUMN "pixCode" TEXT;
