import { db } from "@/lib/db";

export type MaterialRow = {
  id: string;
  title: string;
  kind: string;
  role: string;
  status: string;
  progressStep: string | null;
  progress: number;
  /** Arquivos (de todos os alunos) na frente deste na fila de processamento. */
  ahead: number;
  errorMessage: string | null;
  pageCount: number | null;
  sizeBytes: number | null;
  subjectName: string | null;
};

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
    ahead: m.status === "QUEUED" ? waiting.filter((w) => w.id !== m.id && (w.status === "PROCESSING" || w.createdAt < m.createdAt)).length : 0,
    errorMessage: m.errorMessage,
    pageCount: m.blob?.pageCount ?? null,
    sizeBytes: m.blob?.sizeBytes ?? null,
    subjectName: m.subject?.name ?? null,
  }));
}
