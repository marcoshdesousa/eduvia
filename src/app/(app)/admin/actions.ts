"use server";
import { revalidatePath } from "next/cache";
import type { ProStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/components/action-form";
import { audit } from "@/lib/audit";
import { db } from "@/lib/db";
import { PRO_STATUS_LABEL } from "@/lib/domain";
import { notify } from "@/lib/notifications";
import { createResetLink } from "@/lib/password-reset";
import { requireAdmin } from "@/lib/session";
import { saveSetting } from "@/lib/settings";
import { grantManual } from "@/lib/subscription";

const s = (d: FormData, k: string) => String(d.get(k) ?? "").trim();

/** Aprovar, reprovar (pedindo correção) ou suspender um profissional. Reprovar/suspender exige motivo. */
export async function setProStatus(proId: string, status: ProStatus, _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const reason = s(d, "reason").slice(0, 500) || null;
  if ((status === "REJECTED" || status === "SUSPENDED") && !reason) return { error: "Informe o motivo (a pessoa vai ver)." };
  const pro = await db.professionalProfile.findUnique({ where: { id: proId } });
  if (!pro) return { error: "Profissional não encontrado." };
  await db.professionalProfile.update({
    where: { id: proId },
    data: { status, statusReason: reason, approvals: { create: { status, reason, adminId: admin.id } } },
  });
  await audit(admin.id, `pro.${status.toLowerCase()}`, "ProfessionalProfile", proId, { reason });
  const msg =
    status === "APPROVED"
      ? { title: "Perfil aprovado! 🎉", body: "Assine para aparecer na vitrine e receber pedidos.", href: "/painel/assinatura" }
      : status === "REJECTED"
        ? { title: "Seu cadastro precisa de correção", body: reason ?? "", href: "/painel" }
        : status === "SUSPENDED"
          ? { title: "Conta de profissional suspensa", body: reason ?? "", href: "/painel" }
          : { title: `Status: ${PRO_STATUS_LABEL[status]}`, href: "/painel" };
  await notify(pro.userId, msg);
  revalidatePath("/admin/profissionais");
  return { ok: `Marcado como: ${PRO_STATUS_LABEL[status]}.` };
}

export async function grantSubscription(proId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  await grantManual(proId);
  await audit(admin.id, "subscription.grant_manual", "ProfessionalProfile", proId, { days: 30 });
  revalidatePath("/admin/profissionais");
  revalidatePath("/admin/assinaturas");
  return { ok: "30 dias liberados." };
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

/** Ver dado sensível (CPF completo / WhatsApp): fica registrado na auditoria. */
export async function revealSensitive(userId: string, what: "cpf" | "whatsapp"): Promise<string> {
  const admin = await requireAdmin();
  const { openCpf } = await import("@/lib/cpf");
  const { openSecret } = await import("@/lib/secret-box");
  const u = await db.user.findUnique({ where: { id: userId }, include: { pro: true } });
  if (!u) return "—";
  await audit(admin.id, `reveal.${what}`, "User", userId);
  if (what === "cpf") return openCpf(u.cpfSealed) ?? "—";
  return u.pro ? (openSecret(u.pro.whatsappSealed) ?? "—") : "—";
}

export async function resolveReport(reportId: string, status: "RESOLVED" | "DISMISSED", _: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const resolution = s(d, "resolution").slice(0, 500) || null;
  const r = await db.report.update({ where: { id: reportId }, data: { status, resolution, resolvedAt: new Date() } });
  if (d.get("hideReview") === "on" && r.reviewId) {
    const rev = await db.review.update({ where: { id: r.reviewId }, data: { hiddenAt: new Date() } });
    // a nota do profissional deixa de contar a avaliação escondida
    const pro = await db.professionalProfile.findUnique({ where: { userId: rev.targetId } });
    if (pro && rev.authorId !== pro.userId) await db.professionalProfile.update({ where: { id: pro.id }, data: { ratingSum: { decrement: rev.stars }, ratingCount: { decrement: 1 } } });
    await audit(admin.id, "review.hide", "Review", rev.id);
  }
  await audit(admin.id, `report.${status.toLowerCase()}`, "Report", reportId, { resolution });
  await notify(r.reporterId, { title: "Sua denúncia foi analisada", body: resolution ?? "Obrigado por ajudar a manter a HoraLimp segura.", href: "/notificacoes" });
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

export async function saveSettings(_: ActionResult, d: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const hours = Number(s(d, "requestExpiryHours"));
  const max = Number(s(d, "maxCities"));
  if (!Number.isInteger(hours) || hours < 1 || hours > 168) return { error: "Prazo de resposta: de 1 a 168 horas." };
  if (!Number.isInteger(max) || max < 1 || max > 30) return { error: "Municípios: de 1 a 30." };
  await saveSetting("requestExpiryHours", hours);
  await saveSetting("multipleCities", d.get("multipleCities") === "on");
  await saveSetting("maxCities", max);
  await saveSetting("supportWhatsapp", s(d, "supportWhatsapp").slice(0, 30));
  await audit(admin.id, "settings.save", "PlatformSetting", null, { hours, max });
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
