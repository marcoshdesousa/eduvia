-- Porcentagem do processamento de cada material (0 a 100), para a tela mostrar o andamento.
ALTER TABLE "Material" ADD COLUMN "progress" INTEGER NOT NULL DEFAULT 0;
