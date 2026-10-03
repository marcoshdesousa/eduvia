// Ao iniciar o servidor: proteções do processo e o worker (ver instrumentation-node.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./instrumentation-node");
}
