// Personagens para a foto de perfil (arquivos em /public/avatars).
// Plano Grátis: 1 feminino + 1 masculino de cada categoria (os marcados com free). Assinante: todos.

export const AVATAR_CATEGORIES = [
  { id: "animais", label: "Bichinhos" },
  { id: "herois", label: "Heróis" },
  { id: "mvp", label: "MVP" },
  { id: "halloween", label: "Halloween" },
] as const;

export type AvatarCategory = (typeof AVATAR_CATEGORIES)[number]["id"];
export type AvatarDef = { id: string; label: string; category: AvatarCategory; gender: "F" | "M"; free?: boolean };

export const AVATARS: AvatarDef[] = [
  // bichinhos
  { id: "gata", label: "Gatinha", category: "animais", gender: "F", free: true },
  { id: "coelha", label: "Coelhinha", category: "animais", gender: "F" },
  { id: "raposa", label: "Raposinha", category: "animais", gender: "F" },
  { id: "panda", label: "Pandinha", category: "animais", gender: "F" },
  { id: "ursa", label: "Ursinha", category: "animais", gender: "F" },
  { id: "cachorro", label: "Cachorrinho", category: "animais", gender: "M", free: true },
  { id: "leao", label: "Leãozinho", category: "animais", gender: "M" },
  { id: "urso", label: "Ursinho", category: "animais", gender: "M" },
  { id: "sapo", label: "Sapinho", category: "animais", gender: "M" },
  { id: "pinguim", label: "Pinguinzinho", category: "animais", gender: "M" },
  // heróis
  { id: "heroina-raio", label: "Heroína Raio", category: "herois", gender: "F", free: true },
  { id: "heroina-estrela", label: "Heroína Estrela", category: "herois", gender: "F" },
  { id: "heroina-coracao", label: "Heroína Coração", category: "herois", gender: "F" },
  { id: "heroina-lua", label: "Heroína Lua", category: "herois", gender: "F" },
  { id: "heroina-chama", label: "Heroína Chama", category: "herois", gender: "F" },
  { id: "heroi-escudo", label: "Herói Escudo", category: "herois", gender: "M", free: true },
  { id: "heroi-raio", label: "Herói Raio", category: "herois", gender: "M" },
  { id: "heroi-chama", label: "Herói Chama", category: "herois", gender: "M" },
  { id: "heroi-estrela", label: "Herói Estrela", category: "herois", gender: "M" },
  { id: "heroi-onda", label: "Herói Onda", category: "herois", gender: "M" },
  // MVP: craques e gamers
  { id: "mvp-gamer-f", label: "Gamer", category: "mvp", gender: "F", free: true },
  { id: "mvp-futebol-f", label: "Craque do futebol", category: "mvp", gender: "F" },
  { id: "mvp-basquete-f", label: "Craque do basquete", category: "mvp", gender: "F" },
  { id: "mvp-skate-f", label: "Skatista", category: "mvp", gender: "F" },
  { id: "mvp-volei-f", label: "Craque do vôlei", category: "mvp", gender: "F" },
  { id: "mvp-gamer", label: "Gamer", category: "mvp", gender: "M", free: true },
  { id: "mvp-futebol", label: "Craque do futebol", category: "mvp", gender: "M" },
  { id: "mvp-basquete", label: "Craque do basquete", category: "mvp", gender: "M" },
  { id: "mvp-skate", label: "Skatista", category: "mvp", gender: "M" },
  { id: "mvp-campeao", label: "Campeão", category: "mvp", gender: "M" },
  // Halloween
  { id: "bruxinha", label: "Bruxinha", category: "halloween", gender: "F", free: true },
  { id: "vampira", label: "Vampira", category: "halloween", gender: "F" },
  { id: "fantasminha", label: "Fantasminha", category: "halloween", gender: "F" },
  { id: "mumia", label: "Mumiazinha", category: "halloween", gender: "F" },
  { id: "abobora-f", label: "Abóbora", category: "halloween", gender: "F" },
  { id: "vampiro", label: "Vampiro", category: "halloween", gender: "M", free: true },
  { id: "frankenstein", label: "Frankenstein", category: "halloween", gender: "M" },
  { id: "lobisomem", label: "Lobisomem", category: "halloween", gender: "M" },
  { id: "caveira", label: "Caveirinha", category: "halloween", gender: "M" },
  { id: "abobora", label: "Abóbora", category: "halloween", gender: "M" },
];

export const isAvatarId = (v: unknown): v is string => AVATARS.some((a) => a.id === v);

/** O aluno pode usar este personagem? (assinante: todos; Grátis: só os marcados como free) */
export const canUseAvatar = (id: string, subscriber: boolean) => subscriber || !!AVATARS.find((a) => a.id === id)?.free;
