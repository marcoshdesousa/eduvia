// Ao iniciar o servidor: proteções do processo e as rotinas periódicas (ver instrumentation-node.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./instrumentation-node");
}
