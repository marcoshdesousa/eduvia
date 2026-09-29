import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { defaultRubric } from "@/lib/core/essay";
import { EssayForm } from "./essay-form";

export const metadata = { title: "Nova redação" };

export default async function Page() {
  const user = await requireReadyUser();
  const preps = await db.preparation.findMany({ where: { userId: user.id, status: "ACTIVE" }, orderBy: { createdAt: "desc" }, select: { id: true, title: true, studentType: true } });
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/redacao" className="text-sm text-muted hover:text-foreground">← Redação</Link>
      <h1 className="text-2xl font-bold">Nova redação</h1>
      <EssayForm preparations={preps.map((p) => ({ id: p.id, title: p.title, rubric: defaultRubric(p.studentType) }))} />
    </div>
  );
}
