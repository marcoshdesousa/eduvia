import { db } from "@/lib/db";

export type MaterialRow = {
  id: string;
  title: string;
  kind: string;
  role: string;
  status: string;
  progressStep: string | null;
  progress: number;
  /** Já entrou nas aulas (botão "Gerar aulas"). */
  organized: boolean;
  /** Arquivos (de todos os alunos) na frente deste na fila de processamento. */
  ahead: number;
  errorMessage: string | null;
  pageCount: number | null;
  sizeBytes: number | null;
  subjectName: string | null;
};

export type LessonsState = { status: string; step: string | null; progress: number; startedAt: string | null; pending: number };

/** Situação do botão "Gerar aulas" (pending = arquivos prontos que ainda não entraram nas aulas). */
export function lessonsState(p: { lessonsStatus: string; lessonsStep: string | null; lessonsProgress: number; lessonsStartedAt: Date | null }, pending = 0): LessonsState {
  return { status: p.lessonsStatus, step: p.lessonsStep, progress: p.lessonsProgress, startedAt: p.lessonsStartedAt?.toISOString() ?? null, pending };
}

export async function listMaterials(preparationId: string): Promise<MaterialRow[]> {
  const rows = await db.material.findMany({
    where: { preparationId },
    include: { blob: { select: { pageCount: true, sizeBytes: true } }, subject: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  // posição na fila: quantos arquivos esperando/processando foram enviados antes deste
  const waiting = rows.some((m) => m.status === "QUEUED")
    ? await db.material.findMany({ where: { status: { in: ["QUEUED", "PROCESSING"] } }, select: { id: true, createdAt: true, status: true } })
    : [];
  return rows.map((m) => ({
    id: m.id,
    title: m.title,
    kind: m.kind,
    role: m.role,
    status: m.status,
    progressStep: m.progressStep,
    progress: m.progress,
    organized: !!m.organizedAt,
    ahead: m.status === "QUEUED" ? waiting.filter((w) => w.id !== m.id && (w.status === "PROCESSING" || w.createdAt < m.createdAt)).length : 0,
    errorMessage: m.errorMessage,
    pageCount: m.blob?.pageCount ?? null,
    sizeBytes: m.blob?.sizeBytes ?? null,
    subjectName: m.subject?.name ?? null,
  }));
}
