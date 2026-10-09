-- 4ª IA do aluno: OpenRouter (só modelos grátis). Chave criptografada e o final dela.
ALTER TABLE "user" ADD COLUMN "openrouterKey" TEXT;
ALTER TABLE "user" ADD COLUMN "openrouterKeyHint" TEXT;
