"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { featureLimitError } from "@/lib/billing";
import { checkAchievementsSafe } from "@/lib/achievements";
import { evaluateEssay, suggestEssayTheme } from "@/lib/ai/tasks";
import { profileVoice } from "@/lib/core/profiles";
import { normalizeScores, placeAnnotations, RUBRICS, wordCount, type RubricKey } from "@/lib/core/essay";
import type { FormState } from "./account";

const MIN_WORDS = 50;
const MAX_WORDS = 1500;

async function voiceFor(userId: string, preparationId: string | null) {
  if (!preparationId) return { voice: "Estudante brasileiro.", context: "", prep: null };
  const prep = await db.preparation.findFirst({ where: { id: preparationId, userId }, include: { editalAnalysis: true, subjects: { select: { name: true }, take: 12 } } });
  if (!prep) return { voice: "Estudante brasileiro.", context: "", prep: null };
  return {
    prep,
    voice: profileVoice(prep.studentType, (prep.details ?? {}) as Record<string, unknown>, prep.editalAnalysis?.banca),
    context: `${prep.title}. Disciplinas: ${prep.subjects.map((s) => s.name).join(", ")}`,
  };
}

export async function suggestThemeAction(preparationId: string | null, rubric: RubricKey) {
  const user = await requireReadyUser();
  const limit = await featureLimitError(user, "essay");
  if (limit) return { error: limit };
  const { voice, context } = await voiceFor(user.id, preparationId);
  try {
    return await suggestEssayTheme({ userId: user.id, voice, rubricLabel: RUBRICS[rubric].label, genre: RUBRICS[rubric].genre, context });
  } catch (e) {
    console.error("[tema]", e);
    return { error: "Não foi possível sugerir um tema agora." };
  }
}

export async function submitEssayAction(_: FormState, f: FormData): Promise<FormState & { upgrade?: boolean }> {
  const user = await requireReadyUser();
  const limit = await featureLimitError(user, "essay");
  if (limit) return { error: limit, upgrade: true };
  const input = z
    .object({
      rubric: z.enum(["ENEM", "DISCURSIVA", "GERAL"]),
      theme: z.string().trim().min(3, "Informe o tema.").max(300),
      instructions: z.string().max(3000).optional(),
      text: z.string().trim(),
      preparationId: z.string().optional(),
    })
    .safeParse(Object.fromEntries(f));
  if (!input.success) return { error: input.error.issues[0].message };
  const words = wordCount(input.data.text);
  if (words < MIN_WORDS) return { error: `Escreva pelo menos ${MIN_WORDS} palavras (agora: ${words}).` };
  if (words > MAX_WORDS) return { error: `O texto passou de ${MAX_WORDS} palavras.` };

  const { voice, prep } = await voiceFor(user.id, input.data.preparationId || null);
  const rubric = RUBRICS[input.data.rubric];
  const essay = await db.essay.create({
    data: {
      userId: user.id,
      preparationId: prep?.id ?? null,
      rubric: input.data.rubric,
      theme: input.data.theme,
      instructions: input.data.instructions?.trim() || null,
      text: input.data.text,
      status: "EVALUATING",
    },
  });
  try {
    const ev = await evaluateEssay({
      userId: user.id,
      voice,
      rubricLabel: rubric.label,
      genre: rubric.genre,
      criteria: rubric.criteria,
      theme: essay.theme,
      instructions: essay.instructions,
      text: essay.text,
    });
    const scores = normalizeScores(input.data.rubric, ev.criteria);
    const { placed, unplaced } = placeAnnotations(essay.text, ev.annotations);
    await db.essay.update({
      where: { id: essay.id },
      data: {
        status: "EVALUATED",
        score: scores.total,
        maxScore: scores.max,
        evaluatedAt: new Date(),
        evaluation: { criteria: scores.criteria, annotations: placed, unplaced, strengths: ev.strengths, tips: ev.tips, summary: ev.summary },
      },
    });
  } catch (e) {
    console.error("[redação]", e);
    await db.essay.update({ where: { id: essay.id }, data: { status: "ERROR" } });
    return { error: "Não foi possível corrigir agora. Seu texto foi salvo; tente de novo em instantes." };
  }
  await checkAchievementsSafe(user.id);
  redirect(`/redacao/${essay.id}`);
}
