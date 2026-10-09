// "Descanse": quando o aluno estuda demais (ou bate um limite do dia), sugerimos uma pausa
// com coisas que não gastam a IA dele: reler a aula, um livro da matéria, fazer revisões.
import { db } from "@/lib/db";
import { getAccess, localDayStart } from "@/lib/billing";
import { isUnlimited } from "@/lib/plans";
import { today } from "@/lib/core/dates";
import { ENEM_PREP_ID, findLesson } from "@/lib/enem/catalog";

type RestUser = { id: string; timezone: string };

export type RestReason = "time" | "streak";

/** Sessões seguidas sem pausa que já pedem um descanso. */
const STREAK = 3;
/** Intervalo que conta como pausa entre sessões. */
const BREAK_MS = 10 * 60_000;

/** Deve sugerir descanso antes de uma sessão nova? */
export async function restAdvice(user: RestUser, now = new Date()): Promise<{ reason: RestReason; minutesToday: number } | null> {
  const [access, day, recent] = await Promise.all([
    getAccess(user),
    db.studyDay.findUnique({ where: { userId_date: { userId: user.id, date: today(user.timezone, now) } } }),
    db.studySession.findMany({
      where: { userId: user.id, startedAt: { gte: localDayStart(user.timezone, now) }, completedAt: { not: null } },
      orderBy: { startedAt: "desc" },
      take: STREAK,
      select: { startedAt: true, completedAt: true },
    }),
  ]);
  const minutesToday = day?.minutes ?? 0;
  const limit = access.limits.restAfterMinutes;
  if (!isUnlimited(limit) && limit > 0 && minutesToday >= limit) return { reason: "time", minutesToday };
  if (recent.length === STREAK && now.getTime() - recent[0].completedAt!.getTime() < BREAK_MS) {
    const noBreaks = recent.slice(0, -1).every((s, i) => s.startedAt.getTime() - recent[i + 1].completedAt!.getTime() < BREAK_MS);
    if (noBreaks) return { reason: "streak", minutesToday };
  }
  return null;
}

export type RestSuggestions = {
  subject: string | null;
  topic: string | null;
  pdf: { title: string; href: string; page: number } | null;
  /** aula do Estudar ENEM para reler */
  lesson: { title: string; href: string } | null;
  books: { title: string; author: string }[];
  /** Quando os limites do dia do Eduvia voltam (meia-noite no fuso do aluno). */
  resetAt: Date;
};

/** Sugestões para o descanso, a partir do assunto em estudo (ou do último estudado). */
export async function restSuggestions(user: RestUser, topicId?: string | null): Promise<RestSuggestions> {
  const id =
    topicId ??
    (await db.studySession.findFirst({ where: { userId: user.id }, orderBy: { startedAt: "desc" }, select: { topicId: true } }))?.topicId ??
    // ainda sem sessões: o assunto mais recente das preparações ativas
    (await db.topic.findFirst({ where: { subject: { preparation: { userId: user.id, status: "ACTIVE" } } }, orderBy: [{ createdAt: "desc" }, { order: "asc" }], select: { id: true } }))?.id ??
    null;
  const topic = id
    ? await db.topic.findFirst({
        where: { id, subject: { preparation: { OR: [{ userId: user.id }, { id: ENEM_PREP_ID }] } } },
        include: { subject: { select: { name: true, books: true, preparationId: true } } },
      })
    : null;
  const resetAt = localDayStart(user.timezone, new Date(Date.now() + 24 * 3600_000));
  if (!topic) return { subject: null, topic: null, pdf: null, lesson: null, books: [], resetAt };
  const enem = findLesson(topic.id);
  if (enem) {
    return { subject: enem.materia.name, topic: enem.lesson.title, pdf: null, lesson: { title: enem.lesson.title, href: `/enem/aula/${topic.id}` }, books: [], resetAt };
  }

  let pdf: RestSuggestions["pdf"] = null;
  if (topic.materialId) {
    const m = await db.material.findUnique({ where: { id: topic.materialId }, select: { id: true, title: true } });
    if (m) pdf = { title: m.title, href: `/fonte/${m.id}?p=${topic.pageStart ?? 1}`, page: topic.pageStart ?? 1 };
  }
  if (!pdf) {
    const link = await db.topicChunk.findFirst({ where: { topicId: topic.id }, orderBy: { score: "desc" }, include: { chunk: { select: { blobId: true, pageStart: true } } } });
    const m = link
      ? await db.material.findFirst({ where: { blobId: link.chunk.blobId, preparationId: topic.subject.preparationId }, select: { id: true, title: true } })
      : null;
    if (m && link) pdf = { title: m.title, href: `/fonte/${m.id}?p=${link.chunk.pageStart}`, page: link.chunk.pageStart };
  }
  const books = Array.isArray(topic.subject.books) ? (topic.subject.books as { title: string; author: string }[]) : [];
  return { subject: topic.subject.name, topic: topic.title, pdf, lesson: null, books, resetAt };
}
