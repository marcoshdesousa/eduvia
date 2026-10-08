"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { featureLimitError, getAccess, lessonPlanLock } from "@/lib/billing";
import { AREAS, ENEM_EXAMS, ENEM_PREP_ID, findLesson, isEnemExamKind, LESSON_MINUTES } from "@/lib/enem/catalog";
import { retakeSession, SESSION_MINUTES } from "@/lib/study";
import { ensureEnemCatalog, lessonQuestionIds, pickExamQuestions } from "@/lib/enem/bank";
import { enemSession, lessonUnlocked, nextEnemLesson } from "@/lib/enem/progress";

/** Abre a aula do ENEM (cria a sessão na primeira vez, com o quiz da aula). */
export async function startEnemLessonAction(topicId: string, minutes?: number): Promise<{ error: string } | void> {
  const user = await requireReadyUser();
  const found = findLesson(topicId);
  if (!found) return { error: "Aula não encontrada." };
  await ensureEnemCatalog();
  const lock = lessonPlanLock(await getAccess(user), found.index, found.materia.lessons.length);
  if (lock) return { error: `Esta aula faz parte do plano ${lock.needs}. Assine para liberar.` };
  if (!(await lessonUnlocked(user.id, topicId))) return { error: "Esta aula ainda está bloqueada: tire pelo menos 75% na aula anterior." };
  const chosenMinutes = minutes && (SESSION_MINUTES as readonly number[]).includes(minutes) ? minutes : LESSON_MINUTES;
  const open = await enemSession(user.id, topicId);
  if (!open) {
    const text = await db.studyText.findFirst({ where: { topicId }, orderBy: { createdAt: "desc" }, select: { id: true } });
    const questionIds = await lessonQuestionIds(user.id, topicId);
    await db.studySession.create({ data: { userId: user.id, topicId, kind: "STUDY", studyTextId: text?.id ?? null, questionIds, chosenMinutes } });
  } else {
    // aula aberta há muito tempo: recomeça com o tempo escolhido agora (e outras questões)
    await db.studySession.update({ where: { id: open.id }, data: { chosenMinutes } });
    await retakeSession(open.id, user.id);
  }
  redirect(`/enem/aula/${topicId}`);
}

/** "Estudar geral": vai para a próxima aula liberada da matéria mais atrasada. */
export async function studyGeneralAction() {
  const user = await requireReadyUser();
  const next = await nextEnemLesson(user.id, undefined, (await getAccess(user)).limits.lessonsPct);
  redirect(next ? `/enem/aula/${next.topicId}` : "/enem");
}

/** Monta um simulado ENEM (1º dia, 2º dia ou uma área) com questões reais e o tempo da prova. */
export async function createEnemExamAction(kind: string): Promise<{ error: string; upgrade?: boolean } | void> {
  const user = await requireReadyUser();
  if (!isEnemExamKind(kind)) return { error: "Prova inválida." };
  const limit = await featureLimitError(user, "exam");
  if (limit) return { error: limit, upgrade: true };
  await ensureEnemCatalog();
  const def = ENEM_EXAMS[kind];
  const questionIds = await pickExamQuestions(user.id, kind);
  const areas = [...new Set(def.parts.map((p) => p.area))];
  const exam = await db.exam.create({
    data: {
      ownerId: user.id,
      preparationId: ENEM_PREP_ID,
      title: def.title,
      style: "MULTIPLE_CHOICE",
      durationMin: def.minutes,
      subjectIds: AREAS.filter((a) => areas.includes(a.key)).map((a) => a.subjectId),
      questionIds,
    },
  });
  redirect(`/simulados/${exam.id}`);
}
