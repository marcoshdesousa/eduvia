-- Compras no supermercado: telefone do cliente para o Pix das compras (criptografado)
ALTER TABLE "Booking" ADD COLUMN "contactSealed" TEXT;

-- Motorista particular saiu do Diária Paga: apaga os perfis dessa profissão (e as fotos deles, em cascata)
DELETE FROM "ProviderService" WHERE "category" = 'motorista';
