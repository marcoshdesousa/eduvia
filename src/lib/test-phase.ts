/**
 * FASE DE TESTE (antes de lançar). Enquanto estiver `true`:
 * - o servidor cria sozinho as contas de teste de Parauapebas/PA quando liga (se ainda não existirem);
 * - a tela "Baixe o app" mostra o botão "Testar no navegador" (ver também next.config.ts).
 * Para lançar: troque para `false` (aqui e no next.config.ts). O servidor apaga as contas de teste quando ligar.
 */
export const FASE_DE_TESTE = true;
