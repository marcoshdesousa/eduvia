import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { canAccessMaterial, getMembership } from "@/lib/groups";
import { QuestionCard, type SourceRef } from "@/components/question-card";
import { Card, CardTitle } from "@/components/ui/card";

/** Resumo ou lista de questões compartilhados num grupo. */
export default async function Page({ params }: { params: Promise<{ id: string; shareId: string }> }) {
  const user = await requireReadyUser();
  const { id, shareId } = await params;
  if (!(await getMembership(id, user.id))) notFound();
  const share = await db.groupShare.findFirst({ where: { id: shareId, groupId: id }, include: { sharedBy: { select: { handle: true } }, group: true } });
  if (!share) notFound();

  // links para as páginas do PDF só quando o aluno tem acesso ao material
  const visibleRefs = async (refs: SourceRef[]) => {
    const ok = new Map<string, boolean>();
    for (const r of refs) if (!ok.has(r.materialId)) ok.set(r.materialId, await canAccessMaterial(user.id, r.materialId));
    return refs.filter((r) => ok.get(r.materialId));
  };

  const header = (
    <div>
      <Link href={`/grupos/${id}?aba=compartilhados`} className="text-sm text-muted hover:text-foreground">← {share.group.name}</Link>
      <h1 className="mt-2 text-2xl font-bold">{share.title}</h1>
      <p className="text-sm text-muted">Compartilhado por @{share.sharedBy.handle}</p>
    </div>
  );

  if (share.type === "SUMMARY") {
    const text = await db.studyText.findUnique({ where: { id: share.resourceId } });
    if (!text) notFound();
    const highlights = text.highlights as string[];
    const keyPoints = text.keyPoints as { term: string; explanation: string }[];
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {header}
        <Card>
          <article className="prose-study">
            <ReactMarkdown>{text.content.replace(/\s*\[T\d+\]/g, "")}</ReactMarkdown>
          </article>
        </Card>
        {highlights.length > 0 && (
          <Card className="border-primary/40">
            <CardTitle>Destaques</CardTitle>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
          </Card>
        )}
        {keyPoints.length > 0 && (
          <Card>
            <CardTitle>Para entender</CardTitle>
            <dl className="mt-2 space-y-2 text-sm">{keyPoints.map((k, i) => <div key={i}><dt className="font-semibold">{k.term}</dt><dd className="text-muted">{k.explanation}</dd></div>)}</dl>
          </Card>
        )}
      </div>
    );
  }

  if (share.type === "QUESTION_SET") {
    const questions = await db.question.findMany({ where: { topicId: share.resourceId }, orderBy: { createdAt: "asc" }, take: 40 });
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {header}
        <p className="text-sm text-muted">Responda para praticar. Os erros entram no seu banco de erros.</p>
        {await Promise.all(
          questions.map(async (q, i) => (
            <QuestionCard
              key={q.id}
              index={i}
              sessionId={null}
              q={{ id: q.id, type: q.type, statement: q.statement, options: (q.options as string[] | null) ?? null, sourceRefs: await visibleRefs(q.sourceRefs as SourceRef[]), answered: null }}
            />
          )),
        )}
      </div>
    );
  }
  notFound();
}
