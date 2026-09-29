// Personagens para a foto de perfil (arquivos em /public/avatars).
export const AVATARS = [
  { id: "gata", label: "Gatinha", group: "Meninas" },
  { id: "coelha", label: "Coelhinha", group: "Meninas" },
  { id: "raposa", label: "Raposinha", group: "Meninas" },
  { id: "panda", label: "Pandinha", group: "Meninas" },
  { id: "ursa", label: "Ursinha", group: "Meninas" },
  { id: "cachorro", label: "Cachorrinho", group: "Meninos" },
  { id: "leao", label: "Leãozinho", group: "Meninos" },
  { id: "urso", label: "Ursinho", group: "Meninos" },
  { id: "sapo", label: "Sapinho", group: "Meninos" },
  { id: "pinguim", label: "Pinguinzinho", group: "Meninos" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export const isAvatarId = (v: unknown): v is AvatarId => AVATARS.some((a) => a.id === v);
