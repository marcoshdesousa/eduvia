// Um erro esquecido numa promessa não pode derrubar o site inteiro: registra e segue. (Só no Node.)
const g = globalThis as unknown as { eduviaGuards?: boolean };
if (!g.eduviaGuards) {
  g.eduviaGuards = true;
  process.on("unhandledRejection", (reason) => console.error("[processo] promessa rejeitada sem tratamento:", reason));
  process.on("uncaughtException", (err) => console.error("[processo] exceção não tratada:", err));
}
export {};
