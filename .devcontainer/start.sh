#!/usr/bin/env bash
# Roda toda vez que o Codespace liga: sobe o site na porta 3000 e deixa o link aberto para qualquer pessoa testar.
set -uo pipefail
cd "$(dirname "$0")/.."
export STORAGE_LOCAL_DIR="$PWD/.uploads"
if [ -n "${CODESPACE_NAME:-}" ]; then
  export APP_URL="https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
fi
pkill -f "next start" 2>/dev/null || true
setsid nohup npm start > /tmp/diariapaga.log 2>&1 < /dev/null &
for i in $(seq 1 60); do curl -fs -o /dev/null http://localhost:3000/termos && break; sleep 2; done
if [ -n "${CODESPACE_NAME:-}" ]; then
  gh codespace ports visibility 3000:public -c "$CODESPACE_NAME" >/dev/null 2>&1 || echo "⚠ Não consegui deixar o link público sozinho: na aba PORTAS, clique com o botão direito na 3000 → Visibilidade da porta → Público."
fi
echo ""
echo "✅ Diária Paga (teste) no ar: ${APP_URL:-http://localhost:3000}"
echo "   Contas de teste: docs/CONTAS-DE-TESTE.md (senha de todas: teste1234)"
