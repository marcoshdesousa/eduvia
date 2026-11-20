#!/usr/bin/env bash
# Roda uma vez, quando o Codespace é criado: instala, cria as tabelas, compila o site e cria as contas de teste.
set -euo pipefail
cd "$(dirname "$0")/.."
export STORAGE_LOCAL_DIR="$PWD/.uploads"
echo "▶ Instalando…"
npm ci
echo "▶ Esperando o banco…"
for i in $(seq 1 30); do node -e "require('pg').Client && new (require('pg').Client)({connectionString:process.env.DATABASE_URL}).connect().then(()=>process.exit(0)).catch(()=>process.exit(1))" && break; sleep 2; done
echo "▶ Criando as tabelas…"
# banco novo: cria direto pelo schema (as migrações antigas só funcionam em sequência num banco que já existia)
npx prisma db push
echo "▶ Compilando o site…"
npm run build
echo "▶ Criando as contas de teste em Parauapebas/PA…"
npm run demo:seed
echo "✅ Pronto. A lista de contas está em docs/CONTAS-DE-TESTE.md"
