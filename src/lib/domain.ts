// Regras do negócio da HoraLimp que não dependem do banco (testadas em domain.test.ts).
import type { BookingStatus, ProStatus } from "@/generated/prisma/enums";

/** Assinatura mensal do profissional: R$ 15,00 de mensalidade + R$ 0,85 de valor adicional = R$ 15,85. */
export const SUBSCRIPTION_FEE_CENTS = 1500;
export const SUBSCRIPTION_EXTRA_CENTS = 85;
export const SUBSCRIPTION_CENTS = SUBSCRIPTION_FEE_CENTS + SUBSCRIPTION_EXTRA_CENTS;
export const SUBSCRIPTION_DAYS = 30;

export const MIN_HOURS = 1;
export const MAX_HOURS = 12;
export const MIN_AGE = 18;

export const SERVICES = [
  { slug: "geral", label: "Limpeza geral" },
  { slug: "cozinha", label: "Cozinha" },
  { slug: "banheiro", label: "Banheiro" },
  { slug: "quartos", label: "Quartos" },
  { slug: "sala", label: "Sala e áreas comuns" },
  { slug: "pisos", label: "Pisos" },
  { slug: "janelas", label: "Janelas" },
  { slug: "organizacao", label: "Organização residencial" },
  { slug: "loucas", label: "Louças" },
  { slug: "roupas", label: "Lavagem de roupas" },
  { slug: "passadoria", label: "Passadoria" },
  { slug: "pesada", label: "Limpeza pesada" },
  { slug: "outros", label: "Outros serviços" },
] as const;
export type ServiceSlug = (typeof SERVICES)[number]["slug"];
const SERVICE_LABEL = new Map<string, string>(SERVICES.map((s) => [s.slug, s.label]));
export const serviceLabel = (slug: string) => SERVICE_LABEL.get(slug) ?? slug;
export const isService = (slug: string) => SERVICE_LABEL.has(slug);

export const HOME_SIZES = ["Até 50 m²", "50 a 100 m²", "100 a 200 m²", "Mais de 200 m²"] as const;

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "25,50" ou "25.50" ou "25" → centavos (null se inválido). */
export function parseBRL(raw: string): number | null {
  const t = raw.replace(/[R$\s]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  return Math.round(Number(t) * 100);
}

/** Valor estimado = preço por hora × horas. Pago direto ao profissional (não passa pela HoraLimp). */
export function estimateCents(hourlyCents: number, hours: number) {
  if (!Number.isInteger(hours) || hours < MIN_HOURS || hours > MAX_HOURS) throw new Error(`Escolha de ${MIN_HOURS} a ${MAX_HOURS} horas.`);
  if (!Number.isInteger(hourlyCents) || hourlyCents <= 0) throw new Error("Preço por hora inválido.");
  return hourlyCents * hours;
}

/** Idade completa em anos na data `on` (data de nascimento em UTC, sem horário). */
export function ageOn(birth: Date, on = new Date()) {
  let age = on.getUTCFullYear() - birth.getUTCFullYear();
  const m = on.getUTCMonth() - birth.getUTCMonth();
  if (m < 0 || (m === 0 && on.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

/** "AAAA-MM-DD" → data (meio-dia UTC não, 00:00 UTC) ou null. */
export function parseDateOnly(raw: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]) ? d : null;
}

// ───────────── Verificação do profissional ─────────────

export const PRO_STATUS_LABEL: Record<ProStatus, string> = {
  INCOMPLETE: "Cadastro incompleto",
  PENDING: "Aguardando verificação",
  APPROVED: "Aprovado",
  REJECTED: "Reprovado",
  SUSPENDED: "Suspenso",
};

/** Aparece na vitrine e recebe pedidos: aprovado, assinatura em dia, sem pausa e com preço definido. */
export function proVisible(p: { status: ProStatus; paused: boolean; hourlyCents: number | null; subscriptionEnd: Date | null | undefined; blocked?: boolean }, now = new Date()) {
  return p.status === "APPROVED" && !p.paused && !p.blocked && !!p.hourlyCents && !!p.subscriptionEnd && p.subscriptionEnd > now;
}

// ───────────── Solicitação e contratação ─────────────

export const BOOKING_LABEL: Record<BookingStatus, string> = {
  DRAFT: "Rascunho",
  READY: "Aguardando envio",
  WAITING_PRO: "Aguardando resposta do profissional",
  ACCEPTED: "Aceita — contratação confirmada",
  REFUSED: "Recusada",
  EXPIRED: "Expirada sem resposta",
  ON_THE_WAY: "Profissional a caminho",
  ARRIVED: "Profissional chegou",
  STARTED: "Serviço iniciado",
  COMPLETED: "Serviço concluído",
  CANCELED_CLIENT: "Cancelada pelo cliente",
  CANCELED_PRO: "Cancelada pelo profissional",
  IN_REVIEW: "Em análise pelo suporte",
};

export type Tone = "neutral" | "primary" | "success" | "warning" | "danger";
export const BOOKING_TONE: Record<BookingStatus, Tone> = {
  DRAFT: "neutral",
  READY: "neutral",
  WAITING_PRO: "warning",
  ACCEPTED: "success",
  REFUSED: "danger",
  EXPIRED: "neutral",
  ON_THE_WAY: "primary",
  ARRIVED: "primary",
  STARTED: "primary",
  COMPLETED: "success",
  CANCELED_CLIENT: "danger",
  CANCELED_PRO: "danger",
  IN_REVIEW: "warning",
};

/** Contratação confirmada e em andamento (aceita e ainda não terminou). */
export const ACTIVE_STATUSES: BookingStatus[] = ["ACCEPTED", "ON_THE_WAY", "ARRIVED", "STARTED"];
export const CLOSED_STATUSES: BookingStatus[] = ["REFUSED", "EXPIRED", "COMPLETED", "CANCELED_CLIENT", "CANCELED_PRO"];

export type Actor = "CLIENT" | "PRO" | "ADMIN" | "SYSTEM";

/** Quem pode mudar de qual status para qual. `reason` = precisa informar o motivo. */
const TRANSITIONS: { from: BookingStatus[]; to: BookingStatus; by: Actor[]; reason?: boolean }[] = [
  { from: ["WAITING_PRO"], to: "ACCEPTED", by: ["PRO"] },
  { from: ["WAITING_PRO"], to: "REFUSED", by: ["PRO"] },
  { from: ["WAITING_PRO"], to: "EXPIRED", by: ["SYSTEM"] },
  { from: ["WAITING_PRO"], to: "CANCELED_CLIENT", by: ["CLIENT"] },
  { from: ["ACCEPTED"], to: "ON_THE_WAY", by: ["PRO"] },
  { from: ["ACCEPTED", "ON_THE_WAY"], to: "ARRIVED", by: ["PRO"] },
  { from: ["ACCEPTED", "ON_THE_WAY", "ARRIVED"], to: "STARTED", by: ["PRO"] },
  { from: ["STARTED"], to: "COMPLETED", by: ["PRO", "ADMIN"] },
  { from: ["ACCEPTED", "ON_THE_WAY", "ARRIVED"], to: "CANCELED_CLIENT", by: ["CLIENT"], reason: true },
  { from: ["ACCEPTED", "ON_THE_WAY", "ARRIVED"], to: "CANCELED_PRO", by: ["PRO"], reason: true },
  { from: ["WAITING_PRO", "ACCEPTED", "ON_THE_WAY", "ARRIVED", "STARTED", "COMPLETED"], to: "IN_REVIEW", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "ACCEPTED", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "COMPLETED", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "CANCELED_CLIENT", by: ["ADMIN"], reason: true },
  { from: ["IN_REVIEW"], to: "CANCELED_PRO", by: ["ADMIN"], reason: true },
];

export function transitionRule(from: BookingStatus, to: BookingStatus, by: Actor) {
  return TRANSITIONS.find((t) => t.to === to && t.from.includes(from) && t.by.includes(by)) ?? null;
}

/** Próximos passos possíveis para quem está vendo (na ordem em que aparecem na tela). */
export function nextSteps(from: BookingStatus, by: Actor) {
  return TRANSITIONS.filter((t) => t.from.includes(from) && t.by.includes(by)).map((t) => ({ to: t.to, reason: !!t.reason }));
}

/** O chat abre depois do aceite. Depois de concluída ou cancelada, ainda dá para escrever por alguns dias. */
export const CHAT_AFTER_DAYS = 7;
export function chatOpen(b: { status: BookingStatus; acceptedAt: Date | null; completedAt: Date | null; canceledAt: Date | null }, now = new Date()) {
  if (!b.acceptedAt) return { read: false, write: false };
  if (ACTIVE_STATUSES.includes(b.status) || b.status === "IN_REVIEW") return { read: true, write: b.status !== "IN_REVIEW" };
  const end = b.completedAt ?? b.canceledAt;
  return { read: true, write: !!end && now.getTime() - end.getTime() < CHAT_AFTER_DAYS * 86_400_000 };
}

/** Endereço completo: o cliente sempre (até ser apagado); o profissional só depois do aceite e enquanto a contratação estiver ativa ou recém-concluída. */
export const ADDRESS_AFTER_DAYS = 2;
export function proSeesAddress(b: { status: BookingStatus; acceptedAt: Date | null; completedAt: Date | null; canceledAt: Date | null }, now = new Date()) {
  if (!b.acceptedAt) return false;
  if (ACTIVE_STATUSES.includes(b.status) || b.status === "IN_REVIEW") return true;
  if (b.status === "COMPLETED" && b.completedAt) return now.getTime() - b.completedAt.getTime() < ADDRESS_AFTER_DAYS * 86_400_000;
  return false;
}

/** Avaliação: só quem participou de um serviço concluído, uma vez, de 1 a 5 estrelas. */
export function canReview(b: { status: BookingStatus }, alreadyReviewed: boolean) {
  return b.status === "COMPLETED" && !alreadyReviewed;
}

/** Nota que aparece no perfil (com pelo menos 1 avaliação); perfis novos ficam como "Novo". */
export function ratingOf(p: { ratingSum: number; ratingCount: number }) {
  return p.ratingCount ? Math.round((p.ratingSum / p.ratingCount) * 10) / 10 : null;
}

/** Disponibilidade: o horário pedido cabe numa das faixas daquele dia da semana? (minutos desde 0h, hora local) */
export function fitsAvailability(rules: { weekday: number; startMin: number; endMin: number }[], weekday: number, startMin: number, hours: number) {
  if (!rules.length) return true; // sem agenda definida: o profissional decide no aceite
  return rules.some((r) => r.weekday === weekday && startMin >= r.startMin && startMin + hours * 60 <= r.endMin);
}

export const minutesToHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export function hhmmToMinutes(s: string) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const v = Number(m[1]) * 60 + Number(m[2]);
  return Number(m[1]) < 24 && Number(m[2]) < 60 ? v : null;
}

/** Nome que aparece para quem ainda não contratou: primeiro nome + inicial do sobrenome. */
export function shortName(name: string) {
  const p = name.trim().split(/\s+/);
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0].toUpperCase()}.` : p[0];
}

export const REPORT_REASONS = ["Comportamento inadequado", "Assédio ou ameaça", "Perfil falso ou dados errados", "Pediu pagamento fora do combinado", "Não compareceu", "Spam ou propaganda", "Outro motivo"] as const;

export const TICKET_LABEL = { OPEN: ["Aberto", "warning"], ANSWERED: ["Respondido", "success"], CLOSED: ["Encerrado", "neutral"] } as const;
