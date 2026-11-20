"use server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/components/action-form";
import type { Plan } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { MAX_PLACES, PHONE_BLOCKED_MSG, WEEKDAYS, containsPhone, hhmmToMinutes, normalizeInstagram, placesLimit, providerVisible } from "@/lib/domain";
import { InputError, readBio, readPlace, readService } from "@/lib/provider-input";
import { requireProvider } from "@/lib/session";
import { PaymentError, addPack, removePack, setNextPlan, startSubscriptionPix, startUpgradePix, subscriptionActive } from "@/lib/subscription";
import { deleteObject } from "@/lib/storage";

async function guard<T>(fn: () => Promise<T>): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof InputError || e instanceof PaymentError) return { error: e.message };
    throw e;
  }
}

const done = (ok: string, ...paths: string[]): ActionResult => {
  for (const p of ["/painel", ...paths]) revalidatePath(p);
  return { ok };
};

async function proState(proId: string) {
  const p = await db.providerProfile.findUniqueOrThrow({
    where: { id: proId },
    include: { subscription: true, user: { select: { blockedAt: true } }, _count: { select: { services: true, places: { where: { active: true } } } } },
  });
  return { ...p, visible: providerVisible({ ...p, subscriptionEnd: p.subscription?.currentPeriodEnd ?? null, blocked: !!p.user.blockedAt, services: p._count.services, places: p._count.places }) };
}

/** Botão "Disponível": recebe ou não os chamados do Contrate rápido. */
export async function setQuickAction(on: boolean): Promise<ActionResult> {
  const user = await requireProvider();
  const p = await proState(user.provider.id);
  if (on) {
    if (p.subscription?.plan !== "FULL" || !subscriptionActive(p.subscription)) return { error: "O Contrate rápido é só para o plano Completo em dia." };
    if (!p.quickTermsAt) return { error: "Aceite as regras do Contrate rápido primeiro." };
    if (p.quickBannedUntil && p.quickBannedUntil > new Date()) return { error: `Você está fora do Contrate rápido até ${p.quickBannedUntil.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} porque aceitou um chamado e não chegou a tempo.` };
    if (!p.visible) return { error: p.paused ? "Tire a pausa do perfil primeiro." : !subscriptionActive(p.subscription) ? "Seu plano não está em dia. Pague para receber chamados." : "Complete o perfil (foto, serviço e endereço) primeiro." };
  }
  await db.providerProfile.update({ where: { id: p.id }, data: { quickOn: on } });
  return done(on ? "Você está disponível. Deixe o app aberto ou as notificações ligadas para ouvir os chamados." : "Você não vai receber chamados agora.");
}

/** A "caixinha": o prestador aceita participar do Contrate rápido (preço fixo, 2 horas para chegar, penalidades). */
export async function acceptQuickTermsAction(_: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  if (f.get("agree") !== "on") return { error: "Marque a caixinha para participar." };
  const sub = await db.subscription.findUnique({ where: { proId: user.provider.id } });
  if (sub?.plan !== "FULL" || !subscriptionActive(sub)) return { error: "O Contrate rápido é só para o plano Completo em dia." };
  await db.providerProfile.update({ where: { id: user.provider.id }, data: { quickTermsAt: new Date() } });
  return done("Pronto! Agora ligue o Disponível para começar a receber chamados.");
}

/** Sair do Contrate rápido (desmarca a caixinha). */
export async function leaveQuickAction(): Promise<ActionResult> {
  const user = await requireProvider();
  await db.providerProfile.update({ where: { id: user.provider.id }, data: { quickTermsAt: null, quickOn: false } });
  return done("Você saiu do Contrate rápido. Pode voltar quando quiser.");
}

export async function setPausedAction(paused: boolean): Promise<ActionResult> {
  const user = await requireProvider();
  await db.providerProfile.update({ where: { id: user.provider.id }, data: { paused, ...(paused ? { quickOn: false } : {}) } });
  return done(paused ? "Perfil pausado: você não aparece nas buscas." : "Perfil de volta na vitrine.");
}

export async function saveProfileAction(_: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  return guard(async () => {
    const bio = readBio(f);
    const raw = String(f.get("instagram") ?? "").trim();
    const instagram = raw ? normalizeInstagram(raw) : null;
    if (raw && !instagram) throw new InputError("Instagram inválido. Use só o nome, ex.: @maria.diarista");
    if (instagram && containsPhone(instagram)) throw new InputError(PHONE_BLOCKED_MSG);
    await db.providerProfile.update({ where: { id: user.provider.id }, data: { bio, instagram } });
    return done("Perfil salvo.", "/painel/perfil", `/prestador/${user.provider.id}`);
  });
}

export async function addServiceAction(_: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  return guard(async () => {
    const s = readService(f);
    const count = await db.providerService.count({ where: { proId: user.provider.id } });
    if (count >= 12) throw new InputError("Você pode ter até 12 serviços.");
    try {
      await db.providerService.create({ data: { ...s, proId: user.provider.id } });
    } catch (e) {
      if ((e as { code?: string }).code === "P2002") throw new InputError("Você já oferece este serviço. Edite o valor na lista.");
      throw e;
    }
    return done("Serviço incluído.", "/painel/servicos");
  });
}

export async function updateServiceAction(_: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  return guard(async () => {
    const id = String(f.get("id") ?? "");
    const s = readService(f);
    const r = await db.providerService.updateMany({ where: { id, proId: user.provider.id }, data: { priceCents: s.priceCents, unit: s.unit, description: s.description } });
    if (!r.count) throw new InputError("Serviço não encontrado.");
    return done("Serviço atualizado.", "/painel/servicos");
  });
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  const user = await requireProvider();
  const count = await db.providerService.count({ where: { proId: user.provider.id } });
  if (count <= 1) return { error: "Você precisa ter pelo menos um serviço." };
  await db.providerService.deleteMany({ where: { id, proId: user.provider.id } });
  return done("Serviço removido.", "/painel/servicos");
}

export async function addPlaceAction(_: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  return guard(async () => {
    const place = readPlace(f);
    const sub = await db.subscription.findUnique({ where: { proId: user.provider.id } });
    const limit = sub ? placesLimit(sub.plan, sub.packs) : 1;
    const active = await db.providerPlace.count({ where: { proId: user.provider.id, active: true } });
    const total = await db.providerPlace.count({ where: { proId: user.provider.id } });
    if (total >= MAX_PLACES) throw new InputError(`O máximo é ${MAX_PLACES} endereços. Apague um antes.`);
    if (active >= limit) throw new InputError(sub?.plan === "FULL" ? "Você já usou todos os endereços do plano. Compre um pacote de +2 endereços." : "O plano Básico tem 1 endereço. Mude para o Completo para ter 3 (e comprar mais).");
    await db.providerPlace.create({ data: { ...place, proId: user.provider.id } });
    return done("Endereço incluído.", "/painel/enderecos");
  });
}

export async function deletePlaceAction(id: string): Promise<ActionResult> {
  const user = await requireProvider();
  const active = await db.providerPlace.count({ where: { proId: user.provider.id, active: true } });
  const place = await db.providerPlace.findFirst({ where: { id, proId: user.provider.id } });
  if (!place) return { error: "Endereço não encontrado." };
  if (place.active && active <= 1) return { error: "Você precisa ter pelo menos um endereço. Inclua outro antes de apagar este." };
  await db.providerPlace.delete({ where: { id } });
  const { enforcePlaces } = await import("@/lib/subscription");
  await enforcePlaces(user.provider.id);
  return done("Endereço apagado.", "/painel/enderecos");
}

export async function addPackAction(): Promise<ActionResult> {
  const user = await requireProvider();
  return guard(async () => {
    await addPack(user.provider.id);
    return done("Pronto! +2 endereços liberados. O valor entra na próxima mensalidade.", "/painel/enderecos", "/painel/plano");
  });
}

export async function removePackAction(): Promise<ActionResult> {
  const user = await requireProvider();
  return guard(async () => {
    await removePack(user.provider.id);
    return done("Pacote retirado da próxima mensalidade. Os endereços valem até o vencimento.", "/painel/enderecos", "/painel/plano");
  });
}

export async function setNextPlanAction(plan: Plan): Promise<ActionResult> {
  const user = await requireProvider();
  if (plan !== "BASIC" && plan !== "FULL") return { error: "Plano inválido." };
  const sub = await db.subscription.findUnique({ where: { proId: user.provider.id } });
  if (!sub) return { error: "Escolha o plano na hora de pagar." };
  await setNextPlan(user.provider.id, plan);
  return done(plan === "BASIC" ? "A próxima mensalidade será do plano Básico (1 endereço)." : "A próxima mensalidade será do plano Completo.", "/painel/plano");
}

export async function subscriptionPixAction(plan: Plan): Promise<{ paymentId?: string; error?: string }> {
  const user = await requireProvider();
  if (plan !== "BASIC" && plan !== "FULL") return { error: "Plano inválido." };
  const r = await guard(async () => ({ paymentId: (await startSubscriptionPix(user.id, plan)).id }));
  return r;
}

export async function upgradePixAction(): Promise<{ paymentId?: string; error?: string }> {
  const user = await requireProvider();
  return guard(async () => ({ paymentId: (await startUpgradePix(user.id)).id }));
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  const user = await requireProvider();
  const post = await db.post.findFirst({ where: { id, proId: user.provider.id } });
  if (!post) return { error: "Foto não encontrada." };
  await db.post.delete({ where: { id } });
  await deleteObject(post.imageKey).catch(() => {});
  return done("Foto apagada.", "/painel/portfolio", `/prestador/${user.provider.id}`);
}

/** Horários de atendimento: para cada dia, ligado + início e fim (um período por dia). */
export async function saveAgendaAction(_: ActionResult, f: FormData): Promise<ActionResult> {
  const user = await requireProvider();
  const rules: { weekday: number; startMin: number; endMin: number }[] = [];
  for (let d = 0; d < WEEKDAYS.length; d++) {
    if (f.get(`on${d}`) !== "on") continue;
    const s = hhmmToMinutes(String(f.get(`start${d}`) ?? ""));
    const e = hhmmToMinutes(String(f.get(`end${d}`) ?? ""));
    if (s == null || e == null || e <= s) return { error: `Confira o horário de ${WEEKDAYS[d]}: o fim precisa ser depois do início.` };
    rules.push({ weekday: d, startMin: s, endMin: e });
  }
  if (!rules.length) return { error: "Escolha pelo menos um dia. Para parar de aparecer, use Pausar perfil." };
  await db.$transaction([db.availabilityRule.deleteMany({ where: { proId: user.provider.id } }), db.availabilityRule.createMany({ data: rules.map((r) => ({ ...r, proId: user.provider.id })) })]);
  return done("Horários salvos.", "/painel/agenda");
}
