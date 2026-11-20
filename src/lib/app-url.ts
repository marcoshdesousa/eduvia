/**
 * Endereço público do app.
 * - Domínio próprio: defina APP_URL (ex.: https://eduvia.com.br).
 * - No Render sem domínio próprio: usa RENDER_EXTERNAL_URL, que o Render preenche sozinho
 *   (e corrige um APP_URL *.onrender.com que não bate com o endereço real do serviço).
 */
export function appUrl(): string {
  const configured = (process.env.BETTER_AUTH_URL || process.env.APP_URL || "").replace(/\/$/, "");
  const render = process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, "");
  if (render && (!configured || (configured.includes(".onrender.com") && configured !== render))) return render;
  return configured || "http://localhost:3000";
}

/** Origens aceitas pelo login (domínio próprio + endereço do Render). */
export function trustedOrigins(): string[] {
  return [...new Set([appUrl(), process.env.RENDER_EXTERNAL_URL, process.env.APP_URL].filter(Boolean).map((u) => u!.replace(/\/$/, "")))];
}
