import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { featureLimitError } from "@/lib/billing";
import type { SourceRef } from "@/lib/sources";
import { cn } from "@/lib/utils";
import { TutorChat } from "./tutor-chat";

export const metadata = { title: "Professor IA" };

export default async function Page({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const user = await requireReadyUser();
  const { t } = await searchParams;
  const [threads, preps, limit] = await Promise.all([
    db.tutorThread.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 30, include: { preparation: { select: { title: true } } } }),
    db.preparation.findMany({ where: { userId: user.id, status: "ACTIVE" }, orderBy: { createdAt: "desc" }, select: { id: true, title: true } }),
    featureLimitError(user, "tutor"),
  ]);
  const thread = t ? await db.tutorThread.findFirst({ where: { id: t, userId: user.id }, include: { messages: { orderBy: { createdAt: "asc" } } } }) : null;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="hidden space-y-1 lg:block">
        <Link href="/professor" className="mb-2 block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">Nova conversa</Link>
        {threads.map((th) => (
          <Link key={th.id} href={`/professor?t=${th.id}`} className={cn("block rounded-lg px-3 py-2 text-sm", th.id === thread?.id ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2")}>
            <div className="truncate">{th.title}</div>
            <div className="truncate text-xs opacity-70">{th.preparation.title}</div>
          </Link>
        ))}
      </aside>
      <TutorChat
        key={thread?.id ?? "novo"}
        threadId={thread?.id ?? null}
        preparations={preps}
        initialMessages={(thread?.messages ?? []).map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, refs: m.sourceRefs as SourceRef[] }))}
        blocked={limit}
        recentThreads={threads.slice(0, 5).map((th) => ({ id: th.id, title: th.title }))}
      />
    </div>
  );
}
