import { db } from "@/lib/db";

export type MaterialRow = {
  id: string;
  title: string;
  kind: string;
  role: string;
  status: string;
  progressStep: string | null;
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
  return rows.map((m) => ({
    id: m.id,
    title: m.title,
    kind: m.kind,
    role: m.role,
    status: m.status,
    progressStep: m.progressStep,
    errorMessage: m.errorMessage,
    pageCount: m.blob?.pageCount ?? null,
    sizeBytes: m.blob?.sizeBytes ?? null,
    subjectName: m.subject?.name ?? null,
  }));
}
