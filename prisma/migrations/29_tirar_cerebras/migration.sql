-- A Cerebras passou a exigir cartão para liberar a chave: sai do Eduvia (regra: só IAs grátis, sem cartão).
-- Ficam 3 IAs obrigatórias: Gemini, Groq e OpenRouter. Dá para religar em Admin → IA → "IAs do sistema".
INSERT INTO "SiteSetting" (key, value, "updatedAt") VALUES ('ai-disabled', '["cerebras"]', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE SET value = '["cerebras"]', "updatedAt" = CURRENT_TIMESTAMP;
