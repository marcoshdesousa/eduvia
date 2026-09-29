// Redes sociais do rodapé (constantes sem acesso ao banco: podem ser usadas em componentes do navegador).
export const SOCIALS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/seu.perfil" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "62 99209-7369 ou https://wa.me/..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@seu.perfil" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/seu_perfil" },
] as const;

export type SocialKey = (typeof SOCIALS)[number]["key"];

