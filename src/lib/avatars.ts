// Personagens para a foto de perfil (arquivos em /public/avatars, gerados por scripts/gen-avatars.mjs).
// São personagens próprios do Eduvia, no estilo de heróis, games, monstros e princesas.
// Plano Grátis: 1 feminino + 1 masculino de cada categoria (os marcados com free). Assinante: todos.
import list from "./avatar-list.json";

export const AVATAR_CATEGORIES = [
  { id: "herois", label: "Heróis" },
  { id: "lendarios", label: "Super-heróis" },
  { id: "halloween", label: "Halloween" },
  { id: "mvp", label: "MVP (games)" },
  { id: "princesas", label: "Princesas" },
] as const;

export type AvatarCategory = (typeof AVATAR_CATEGORIES)[number]["id"];
export type AvatarDef = { id: string; label: string; category: AvatarCategory; gender: "F" | "M"; free?: boolean };

export const AVATARS = list as AvatarDef[];

export const isAvatarId = (v: unknown): v is string => AVATARS.some((a) => a.id === v);

/** O aluno pode usar este personagem? (assinante: todos; Grátis: só os marcados como free) */
export const canUseAvatar = (id: string, subscriber: boolean) => subscriber || !!AVATARS.find((a) => a.id === id)?.free;
