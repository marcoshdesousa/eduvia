"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { getOwnedPreparation } from "@/lib/authz";
import { generatePlan } from "@/lib/plan";
import { today } from "@/lib/core/dates";
import { activePreparationLimitError, preparationLimitError } from "@/lib/billing";
import type { FormState } from "./account";

const DETAIL_KEYS = ["grade", "schoolSubject", "exam", "course", "discipline", "orgao", "cargo", "goal"] as const;

const Agenda = z.object({
  dailyMinutes: z.coerce.number().int().min(5, "Mínimo de 5 minutos por dia.").max(720, "Máximo de 12 horas por dia."),
  studyDays: z.array(z.coerce.number().int().min(0).max(6)).min(1, "Escolha pelo menos um dia da semana."),
  studyTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido."),
  examDate: z.string().optional(),
});

function parseAgenda(formData: FormData, tz: string) {
  const r = Agenda.safeParse({
    dailyMinutes: formData.get("dailyMinutes"),
    studyDays: formData.getAll("studyDays"),
    studyTime: formData.get("studyTime"),
    examDate: formData.get("examDate") || undefined,
  });
  if (!r.success) return { error: r.error.issues[0].message } as const;
  let examDate: Date | null = null;
  if (r.data.examDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.data.examDate)) return { error: "Data da prova inválida." } as const;
    examDate = new Date(`${r.data.examDate}T00:00:00Z`);
    if (examDate <= today(tz)) return { error: "A data da prova precisa ser no futuro." } as const;
  }
  return { data: { dailyMinutes: r.data.dailyMinutes, studyDays: [...new Set(r.data.studyDays)].sort(), studyTime: r.data.studyTime, examDate } } as const;
}

export async function createPreparationAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  const limit = await preparationLimitError(user);
  if (limit) return { error: limit };
  const type = z.enum(["FUNDAMENTAL", "MEDIO", "ENEM_VESTIBULAR", "FACULDADE", "CONCURSO", "CURSINHO", "LIVRE"]).safeParse(formData.get("studentType"));
  if (!type.success) return { error: "Escolha o tipo de estudo." };
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 2) return { error: "Dê um nome para a preparação." };
  const agenda = parseAgenda(formData, user.timezone);
  if ("error" in agenda) return { error: agenda.error };

  const details: Record<string, string> = {};
  for (const k of DETAIL_KEYS) {
    const v = String(formData.get(k) ?? "").trim();
    if (v) details[k] = v.slice(0, 200);
  }
  if ((type.data === "FUNDAMENTAL" || type.data === "MEDIO") && (!details.grade || !details.schoolSubject)) return { error: "Informe a série/ano e a matéria." };
  if (type.data === "FACULDADE" && (!details.course || !details.discipline)) return { error: "Informe o curso e a disciplina." };
  if (type.data === "ENEM_VESTIBULAR" && !details.exam) return { error: "Informe qual prova você vai fazer." };

  const initialSubject = details.discipline ?? details.schoolSubject;
  const prep = await db.preparation.create({
    data: {
      userId: user.id,
      title: title.slice(0, 120),
      studentType: type.data,
      details,
      ...agenda.data,
      subjects: initialSubject ? { create: { name: initialSubject, weight: 1 } } : undefined,
    },
  });
  await db.preparationCreation.create({ data: { userId: user.id } });
  redirect(`/preparacoes/${prep.id}?nova=1`);
}

export async function updateAgendaAction(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireReadyUser();
  const prep = await getOwnedPreparation(String(formData.get("preparationId")), user.id);
  if (!prep) return { error: "Preparação não encontrada." };
  const agenda = parseAgenda(formData, user.timezone);
  if ("error" in agenda) return { error: agenda.error };
  const title = String(formData.get("title") ?? "").trim();
  const intervals = String(formData.get("reviewIntervals") ?? "")
    .split(/[,\s]+/)
    .filter(Boolean)
    .map(Number);
  if (!intervals.length || intervals.some((n) => !Number.isInteger(n) || n < 1 || n > 365) || intervals.some((n, i) => i > 0 && n <= intervals[i - 1])) {
    return { error: "Intervalos de revisão: números crescentes de dias, ex.: 1, 7, 15, 30." };
  }
  await db.preparation.update({
    where: { id: prep.id },
    data: { ...agenda.data, title: title.length >= 2 ? title.slice(0, 120) : prep.title, reviewIntervals: intervals },
  });
  await generatePlan(prep.id);
  revalidatePath(`/preparacoes/${prep.id}`);
  return { ok: true, message: "Preparação atualizada e plano refeito." };
}

export async function regeneratePlanAction(preparationId: string) {
  const user = await requireReadyUser();
  const prep = await getOwnedPreparation(preparationId, user.id);
  if (!prep) return;
  await generatePlan(prep.id);
  revalidatePath(`/preparacoes/${prep.id}`);
}

export async function setPreparationStatusAction(preparationId: string, status: "ACTIVE" | "ARCHIVED") {
  const user = await requireReadyUser();
  const prep = await getOwnedPreparation(preparationId, user.id);
  if (!prep) return;
  if (status === "ACTIVE" && (await activePreparationLimitError(user))) return;
  await db.preparation.update({ where: { id: prep.id }, data: { status } });
  if (status === "ACTIVE") await generatePlan(prep.id);
  revalidatePath("/preparacoes");
  revalidatePath(`/preparacoes/${prep.id}`);
}

export async function deletePreparationAction(preparationId: string) {
  const user = await requireReadyUser();
  const prep = await getOwnedPreparation(preparationId, user.id);
  if (!prep) return;
  const { deletePreparationData } = await import("@/lib/cleanup");
  await deletePreparationData(prep.id);
  redirect("/preparacoes");
}

export async function addSubjectAction(preparationId: string, name: string) {
  const user = await requireReadyUser();
  const prep = await getOwnedPreparation(preparationId, user.id);
  const clean = name.trim().slice(0, 120);
  if (!prep || clean.length < 2) return { error: "Nome inválido." };
  const s = await db.subject.upsert({
    where: { preparationId_name: { preparationId: prep.id, name: clean } },
    create: { preparationId: prep.id, name: clean },
    update: {},
  });
  revalidatePath(`/preparacoes/${prep.id}`);
  return { id: s.id, name: s.name };
}
