import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { CATEGORY_LABEL, RUBRICS, type AnnotationCategory } from "@/lib/core/essay";
import { essayPdf } from "@/lib/printable-pdf";

/** Redação corrigida em PDF para imprimir (com marca d'água, nota, tema, texto e erros). */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const essay = await db.essay.findFirst({ where: { id: (await params).id, userId: user.id } });
  if (!essay) return jsonError("Redação não encontrada", 404);
  const ev = (essay.evaluation ?? null) as {
    criteria?: { name: string; score: number; max: number }[];
    annotations?: { category: AnnotationCategory; quote: string; message: string; suggestion: string }[];
    unplaced?: { category: AnnotationCategory; quote: string; message: string; suggestion: string }[];
  } | null;
  const errors = [...(ev?.annotations ?? []), ...(ev?.unplaced ?? [])].map((a) => ({ ...a, category: CATEGORY_LABEL[a.category] ?? a.category }));
  const bytes = await essayPdf({
    student: { name: user.name, handle: user.handle },
    theme: essay.theme,
    rubricLabel: RUBRICS[essay.rubric].label,
    text: essay.text,
    score: essay.score,
    maxScore: essay.maxScore,
    criteria: ev?.criteria ?? [],
    errors,
    createdAt: essay.createdAt,
    evaluatedAt: essay.evaluatedAt,
    timeLimitMin: essay.timeLimitMin,
    tz: user.timezone,
  });
  return new Response(Buffer.from(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="redacao-eduvia.pdf"`, "Cache-Control": "private, no-store" },
  });
}
