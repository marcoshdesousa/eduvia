-- IAs extras do aluno (Groq e Cerebras), opcionais: chaves criptografadas e o final de cada uma.
ALTER TABLE "user" ADD COLUMN "groqKey" TEXT;
ALTER TABLE "user" ADD COLUMN "groqKeyHint" TEXT;
ALTER TABLE "user" ADD COLUMN "cerebrasKey" TEXT;
ALTER TABLE "user" ADD COLUMN "cerebrasKeyHint" TEXT;
