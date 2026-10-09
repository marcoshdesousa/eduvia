export const HANDLE_REGEX = /^[a-z0-9._]{3,30}$/;

const RESERVED = new Set([
  "admin", "administrador", "suporte", "eduvia", "root", "sistema", "api", "app", "ajuda",
  "entrar", "cadastro", "configuracoes", "grupos", "perfil", "termos", "privacidade",
]);

export type HandleCheck = { ok: true; handle: string } | { ok: false; reason: string };

/** Valida o formato do @ (sem consultar o banco). */
export function validateHandle(raw: string): HandleCheck {
  const handle = raw.trim().replace(/^@/, "");
  if (handle.length < 3) return { ok: false, reason: "Use pelo menos 3 caracteres." };
  if (handle.length > 30) return { ok: false, reason: "Use no máximo 30 caracteres." };
  if (!HANDLE_REGEX.test(handle)) {
    return { ok: false, reason: "Use só letras minúsculas, números, ponto e underline." };
  }
  if (/^[._]|[._]$/.test(handle)) return { ok: false, reason: "Não pode começar nem terminar com ponto ou underline." };
  if (/\.\./.test(handle)) return { ok: false, reason: "Não use dois pontos seguidos." };
  if (RESERVED.has(handle)) return { ok: false, reason: "Esse @ é reservado." };
  return { ok: true, handle };
}

/** Sugere um @ a partir do nome (sem acentos, só caracteres válidos). */
export function suggestHandle(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 24);
  return base.length >= 3 ? base : `aluno.${base}`.replace(/\.$/, "");
}
