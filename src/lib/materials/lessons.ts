// Botão "Gerar aulas": depois que todos os arquivos foram lidos, as IAs montam os assuntos de TODOS os
// materiais (na ordem em que foram enviados, sem pular nada) e o plano de estudos com o tempo de cada aula.
import { db } from "@/lib/db";
import { enqueue } from "@/lib/queue";
import { generatePlan } from "@/lib/plan";
import { AiQuotaError, AiUnavailableError } from "@/lib/ai/client";
import { applySyllabus, organizeContent } from "./process";

const MAX_RETRIES = 10;

export async function generateLessons(preparationId: string, tries = 0) {
  const set = (lessonsStep: string, lessonsProgress: number) =>
    db.preparation.update({ where: { id: preparationId }, data: { lessonsStatus: "RUNNING", lessonsStep, lessonsProgress } });
  try {
    const materials = await db.material.findMany({ where: { preparationId, status: "READY" }, orderBy: { createdAt: "asc" } });
    // edital/ementa primeiro (ele define as disciplinas); depois o conteúdo, na ordem de envio
    const todo = [...materials.filter((m) => m.role !== "CONTENT"), ...materials.filter((m) => m.role === "CONTENT")].filter((m) => !m.organizedAt);
    for (const [i, m] of todo.entries()) {
      await set(`Lendo "${m.title}" e separando os assuntos (${i + 1} de ${todo.length})`, Math.round(5 + (80 * i) / Math.max(1, todo.length)));
      if (m.role === "CONTENT") await organizeContent(m.id);
      else await applySyllabus(m.id);
      await db.material.update({ where: { id: m.id }, data: { organizedAt: new Date() } });
    }
    await set("Montando o plano de aulas com o tempo de cada uma", 88);
    await generatePlan(preparationId);
    await db.preparation.update({ where: { id: preparationId }, data: { lessonsStatus: "DONE", lessonsStep: null, lessonsProgress: 100 } });
  } catch (err) {
    console.error(`[aulas ${preparationId}]`, err);
    // IAs ocupadas ou no limite: continua sozinho daqui a pouco, sem mostrar erro
    if ((err instanceof AiQuotaError || err instanceof AiUnavailableError) && tries < MAX_RETRIES) {
      const wait = err instanceof AiQuotaError ? Math.max(60, Math.ceil((err.retryAt.getTime() - Date.now()) / 1000) + 15) : Math.min(600, 20 * 2 ** tries);
      await db.preparation.update({
        where: { id: preparationId },
        data: { lessonsStatus: "RUNNING", lessonsStep: "As IAs estão ocupadas agora. Continuamos sozinhos em instantes; pode sair da tela." },
      });
      await enqueue("lessons.generate", { preparationId, tries: tries + 1 }, { startAfter: wait, singletonKey: `lessons:${preparationId}:${tries + 1}` });
      return;
    }
    await db.preparation.update({
      where: { id: preparationId },
      data: { lessonsStatus: "ERROR", lessonsStep: "Não conseguimos gerar as aulas agora. Toque em \"Gerar aulas\" para tentar de novo." },
    });
  }
}
