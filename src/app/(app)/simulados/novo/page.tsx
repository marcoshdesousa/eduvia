import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { NewExamForm } from "./new-exam-form";

export const metadata = { title: "Novo simulado" };

export default async function Page() {
  const user = await requireReadyUser();
  const preps = await db.preparation.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: { subjects: { where: { topics: { some: {} } }, orderBy: [{ weight: "desc" }, { name: "asc" }], select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link href="/simulados" className="text-sm text-muted hover:text-foreground">← Simulados</Link>
      <h1 className="text-2xl font-bold">Novo simulado</h1>
      {preps.some((p) => p.subjects.length) ? (
        <NewExamForm preparations={preps.filter((p) => p.subjects.length).map((p) => ({ id: p.id, title: p.title, subjects: p.subjects }))} />
      ) : (
        <p className="text-sm text-muted">Envie os materiais de uma preparação para poder montar simulados.</p>
      )}
    </div>
  );
}
