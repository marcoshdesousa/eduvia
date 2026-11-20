"use server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/components/action-form";
import { audit } from "@/lib/audit";
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { createResetLink } from "@/lib/password-reset";
import { requireAdmin } from "@/lib/session";
import { saveSetting } from "@/lib/settings";
import { grantManual } from "@/lib/subscription";

const s = (d: FormData, k: string) => String(d.get(k) ?? "").trim();

/** Suspender (sai da vitrine e do Contrate rápido) ou reativar um prestador. Suspender exige motivo. */
export async function setProviderStatus(proId: string, status: "ACTIVE" | "SUSPENDED", _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const reason = s(d, "reason").slice(0, 500) || null;
  if (status === "SUSPENDED" && !reason) return { error: "Informe o motivo (a pessoa vai ver)." };
  const pro = await db.providerProfile.findUnique({ where: { id: proId } });
  if (!pro) return { error: "Prestador não encontrado." };
  await db.providerProfile.update({ where: { id: proId }, data: { status, statusReason: reason, ...(status === "SUSPENDED" ? { quickOn: false } : {}) } });
  await audit(admin.id, `provider.${status.toLowerCase()}`, "ProviderProfile", proId, { reason });
  await notify(pro.userId, status === "SUSPENDED" ? { title: "Perfil de prestador suspenso", body: reason ?? "", href: "/suporte" } : { title: "Perfil reativado ✅", body: "Você voltou a aparecer para os clientes.", href: "/painel" });
  revalidatePath("/admin/prestadores");
  return { ok: status === "SUSPENDED" ? "Prestador suspenso." : "Prestador reativado." };
}

/** Libera dias de plano sem Pix (cortesia ou acerto). Fica registrado como pagamento MANUAL de R$ 0. */
export async function grantPlan(userId: string, _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const plan = s(d, "plan") === "BASIC" ? "BASIC" : "FULL";
  const days = Number(s(d, "days") || 30);
  if (!Number.isInteger(days) || days < 1 || days > 365) return { error: "Dias: de 1 a 365." };
  if (!(await db.providerProfile.findUnique({ where: { userId }, select: { id: true } }))) return { error: "Esta conta não é prestador." };
  await grantManual(userId, plan, days);
  await audit(admin.id, "subscription.grant_manual", "User", userId, { plan, days });
  revalidatePath("/admin/prestadores");
  revalidatePath("/admin/pagamentos");
  return { ok: `${days} dias do plano ${plan === "FULL" ? "Completo" : "Básico"} liberados.` };
}

/** Tira a penalidade do Contrate rápido (prestador que não chegou). */
export async function liftQuickBan(proId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const pro = await db.providerProfile.update({ where: { id: proId }, data: { quickBannedUntil: null } });
  await audit(admin.id, "provider.quick_unban", "ProviderProfile", proId);
  await notify(pro.userId, { title: "Você voltou ao Contrate rápido", body: "O suporte retirou a penalidade. Ligue o Disponível quando quiser.", href: "/painel" });
  revalidatePath("/admin/penalidades");
  revalidatePath("/admin/prestadores");
  return { ok: "Penalidade retirada." };
}

/** Libera o cliente que estava 30 dias sem contratar. */
export async function liftClientBlock(cpfHash: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  await db.cpfLedger.update({ where: { cpfHash }, data: { clientBlockedUntil: null, clientBlockReason: null } });
  const u = await db.user.findUnique({ where: { cpfHash }, select: { id: true } });
  await audit(admin.id, "client.unblock_quick", "CpfLedger", cpfHash.slice(0, 12));
  if (u) await notify(u.id, { title: "Conta liberada ✅", body: "O suporte liberou você para contratar de novo.", href: "/inicio" });
  revalidatePath("/admin/penalidades");
  return { ok: "Cliente liberado." };
}

/** Apaga uma foto do portfólio (denúncia de foto imprópria ou com telefone). */
export async function removePost(postId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const post = await db.post.findUnique({ where: { id: postId }, include: { pro: { select: { userId: true } } } });
  if (!post) return { error: "Foto já apagada." };
  await db.post.delete({ where: { id: postId } });
  const { deleteObject } = await import("@/lib/storage");
  await deleteObject(post.imageKey).catch(() => {});
  await audit(admin.id, "post.remove", "Post", postId);
  await notify(post.pro.userId, { title: "Uma foto do portfólio foi removida", body: "Ela não segue as regras do Diária Paga (sem telefone, sem conteúdo impróprio).", href: "/painel/portfolio" });
  revalidatePath("/admin/denuncias");
  return { ok: "Foto apagada." };
}

/** Bloquear impede a pessoa de entrar (e tira o profissional da vitrine). */
export async function setBlocked(userId: string, block: boolean, _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) return { error: "Você não pode bloquear a própria conta." };
  const reason = s(d, "reason").slice(0, 300) || null;
  if (block && !reason) return { error: "Informe o motivo." };
  await db.user.update({ where: { id: userId }, data: block ? { blockedAt: new Date(), blockReason: reason } : { blockedAt: null, blockReason: null } });
  if (block) await db.session.deleteMany({ where: { userId } });
  await audit(admin.id, block ? "user.block" : "user.unblock", "User", userId, { reason });
  revalidatePath("/admin/usuarios");
  return { ok: block ? "Conta bloqueada." : "Conta desbloqueada." };
}

export async function makeResetLink(userId: string): Promise<{ link?: string; error?: string }> {
  const admin = await requireAdmin();
  const link = await createResetLink(userId, admin.id);
  await audit(admin.id, "user.reset_link", "User", userId);
  return { link };
}

/** Ver dado sensível (CPF completo / celular): fica registrado na auditoria. */
export async function revealSensitive(userId: string, what: "cpf" | "phone"): Promise<string> {
  const admin = await requireAdmin();
  const { openCpf } = await import("@/lib/cpf");
  const { openSecret } = await import("@/lib/secret-box");
  const u = await db.user.findUnique({ where: { id: userId }, include: { provider: true } });
  if (!u) return "—";
  await audit(admin.id, `reveal.${what}`, "User", userId);
  if (what === "cpf") return openCpf(u.cpfSealed) ?? "—";
  return u.provider ? (openSecret(u.provider.phoneSealed) ?? "—") : "—";
}

export async function resolveReport(reportId: string, status: "RESOLVED" | "DISMISSED", _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const resolution = s(d, "resolution").slice(0, 500) || null;
  const r = await db.report.update({ where: { id: reportId }, data: { status, resolution, resolvedAt: new Date() } });
  if (d.get("removePost") === "on" && r.postId) await removePost(r.postId);
  if (d.get("hideReview") === "on" && r.reviewId) {
    const rev = await db.review.update({ where: { id: r.reviewId }, data: { hiddenAt: new Date() } });
    // a nota do prestador deixa de contar a avaliação escondida
    const pro = await db.providerProfile.findUnique({ where: { userId: rev.targetId } });
    const b = await db.booking.findUnique({ where: { id: rev.bookingId }, select: { proId: true } });
    if (pro && b?.proId === pro.id) await db.providerProfile.update({ where: { id: pro.id }, data: { ratingSum: { decrement: rev.stars }, ratingCount: { decrement: 1 } } });
    await audit(admin.id, "review.hide", "Review", rev.id);
  }
  await audit(admin.id, `report.${status.toLowerCase()}`, "Report", reportId, { resolution });
  await notify(r.reporterId, { title: "Sua denúncia foi analisada", body: resolution ?? "Obrigado por ajudar a manter o Diária Paga seguro.", href: "/notificacoes" });
  revalidatePath("/admin/denuncias");
  return { ok: "Denúncia atualizada." };
}

export async function adminReply(ticketId: string, _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const text = s(d, "text").slice(0, 3000);
  const close = d.get("close") === "on";
  if (!text && !close) return { error: "Escreva a resposta." };
  const t = await db.supportTicket.update({
    where: { id: ticketId },
    data: { status: close ? "CLOSED" : "ANSWERED", ...(text ? { messages: { create: { authorId: admin.id, fromAdmin: true, text } } } : {}) },
  });
  if (text) await notify(t.userId, { title: "Resposta do suporte", body: text.slice(0, 120), href: `/suporte/${t.id}` });
  revalidatePath(`/admin/suporte/${ticketId}`);
  return { ok: close ? "Chamado encerrado." : "Resposta enviada." };
}

/** Valores fixos do Contrate rápido por profissão (vazio = volta ao padrão). */
export async function saveQuickPrices(_: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const { CATEGORIES, parseBRL, quickHourPrice } = await import("@/lib/domain");
  const out: Record<string, number> = {};
  const hours: Record<string, number> = {};
  for (const c of CATEGORIES) {
    const raw = s(d, `price_${c.slug}`);
    if (!raw) continue;
    const v = parseBRL(raw);
    if (v == null || v < 500 || v > 500_000) return { error: `Valor inválido para ${c.label}: use de R$ 5,00 a R$ 5.000,00.` };
    if (v !== c.quick) out[c.slug] = v;
  }
  for (const c of CATEGORIES) {
    const raw = s(d, `hour_${c.slug}`);
    if (!raw || c.unit === "HORA") continue;
    const v = parseBRL(raw);
    if (v == null || v < 500 || v > 100_000) return { error: `Valor da hora inválido para ${c.label}: use de R$ 5,00 a R$ 1.000,00.` };
    if (v !== quickHourPrice(c.slug, out)) hours[c.slug] = v;
  }
  await saveSetting("quickPrices", out);
  await saveSetting("quickHourPrices", hours);
  await audit(admin.id, "settings.quick_prices", "PlatformSetting", null, { ...out, horas: hours });
  revalidatePath("/admin/config");
  revalidatePath("/rapido");
  return { ok: "Valores do Contrate rápido salvos. Chamados novos já usam os valores novos." };
}

export async function saveSettings(_: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const n = (k: string) => Number(s(d, k));
  const checks: [string, number, number, number][] = [
    ["requestExpiryHours", n("requestExpiryHours"), 1, 168],
    ["quickRingSeconds", n("quickRingSeconds"), 15, 180],
    ["quickWaveSize", n("quickWaveSize"), 1, 20],
    ["quickMaxKm", n("quickMaxKm"), 2, 150],
    ["quickSearchMinutes", n("quickSearchMinutes"), 2, 60],
  ];
  for (const [k, v, min, max] of checks) if (!Number.isInteger(v) || v < min || v > max) return { error: `${k}: de ${min} a ${max}.` };
  await saveSetting("requestExpiryHours", checks[0][1]);
  await saveSetting("quickRingSeconds", checks[1][1]);
  await saveSetting("quickWaveSize", checks[2][1]);
  await saveSetting("quickMaxKm", checks[3][1]);
  await saveSetting("quickSearchMinutes", checks[4][1]);
  await saveSetting("supportWhatsapp", s(d, "supportWhatsapp").slice(0, 30));
  await audit(admin.id, "settings.save", "PlatformSetting", null, Object.fromEntries(checks.map(([k, v]) => [k, v])));
  revalidatePath("/admin/config");
  return { ok: "Configurações salvas." };
}

/** Abrir uma conversa como admin exige justificativa (fica registrada). */
export async function openConversation(bookingId: string, _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const reason = s(d, "reason").slice(0, 300);
  if (reason.length < 5) return { error: "Informe a justificativa (denúncia, chamado de suporte…)." };
  await audit(admin.id, "chat.open", "Booking", bookingId, { reason });
  const { redirect } = await import("next/navigation");
  redirect(`/admin/conversa/${bookingId}`);
  return null;
}
