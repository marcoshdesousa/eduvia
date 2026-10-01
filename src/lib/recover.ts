// Depois de uma atualização do site, quem estava com a página aberta fica com arquivos antigos
// ("ChunkLoadError", "Failed to find Server Action"). Nesses casos basta recarregar a página.
const KEY = "eduvia:auto-reload";

export function isStaleDeployError(error: unknown) {
  const msg = `${(error as Error)?.name ?? ""} ${(error as Error)?.message ?? ""}`;
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Failed to find Server Action|deployment|Importing a module script failed/i.test(msg);
}

/** Recarrega a página uma vez por minuto no máximo (evita laço). Devolve true se recarregou. */
export function autoReload(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {}
  window.location.reload();
  return true;
}
