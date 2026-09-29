import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { notFound } from "next/navigation";
import { ClipboardCheck, FileText, ListChecks, NotebookText } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { getMembership, weeklyXpRanking } from "@/lib/groups";
import { groupAccessError } from "@/lib/billing";
import { formatDay } from "@/lib/core/dates";
import { levelFromXp } from "@/lib/gamification";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InviteForm } from "../forms";
import { GroupWall } from "./wall";
import { DangerZone, MemberActions, ShareForm, SharedItemActions } from "./group-client";

const TABS = [
  { key: "mural", label: "Mural" },
  { key: "compartilhados", label: "Compartilhados" },
  { key: "ranking", label: "Ranking" },
  { key: "membros", label: "Membros" },
] as const;
const ROLE = { OWNER: "Dono", ADMIN: "Admin", MEMBER: "Membro" } as const;
const TYPE = {
  MATERIAL: { label: "Material", icon: FileText },
  SUMMARY: { label: "Resumo", icon: NotebookText },
  QUESTION_SET: { label: "Questões", icon: ListChecks },
  EXAM: { label: "Simulado", icon: ClipboardCheck },
} as const;

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aba?: string }> }) {
  const user = await requireReadyUser();
  const { id } = await params;
  const me = await getMembership(id, user.id);
  if (!me) notFound();
  const blocked = await groupAccessError(user);
  if (blocked) {
    return (
      <Card className="mx-auto max-w-lg space-y-3 text-center">
        <p className="font-medium">{blocked}</p>
        <Link href="/assinatura" className="font-semibold text-primary">Ver planos</Link>
      </Card>
    );
  }
  const group = await db.group.findUniqueOrThrow({ where: { id } });
  const aba = (await searchParams).aba;
  const tab = TABS.find((t) => t.key === aba)?.key ?? "mural";
  const canManage = me.role !== "MEMBER";

  const header = (
    <div>
      <Link href="/grupos" className="text-sm text-muted hover:text-foreground">← Grupos</Link>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <Badge tone="primary">{ROLE[me.role]}</Badge>
      </div>
      {group.description && <p className="text-sm text-muted">{group.description}</p>}
      <nav className="mt-4 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <Link key={t.key} href={`/grupos/${id}?aba=${t.key}`} className={cn("whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium", tab === t.key ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}>
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  if (tab === "mural") {
    return (
      <div className="space-y-4">
        {header}
        <GroupWall groupId={id} meId={user.id} canModerate={canManage} />
      </div>
    );
  }

  if (tab === "compartilhados") {
    const [shares, mine, preps] = await Promise.all([
      db.groupShare.findMany({ where: { groupId: id }, include: { sharedBy: { select: { id: true, handle: true } } }, orderBy: { createdAt: "desc" } }),
      shareableResources(user.id),
      db.preparation.findMany({ where: { userId: user.id, status: "ACTIVE" }, select: { id: true, title: true } }),
    ]);
    return (
      <div className="space-y-4">
        {header}
        <Card className="space-y-3">
          <CardTitle>Compartilhar com o grupo</CardTitle>
          <ShareForm groupId={id} resources={mine} />
        </Card>
        {!shares.length && <Card className="text-sm text-muted">Nada compartilhado ainda. Compartilhe um material, um resumo, uma lista de questões ou um simulado.</Card>}
        <ul className="space-y-3">
          {shares.map((s) => {
            const T = TYPE[s.type];
            return (
              <li key={s.id}>
                <Card className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <T.icon size={20} className="shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{s.title}</div>
                    <div className="text-xs text-muted">{T.label} · por @{s.sharedBy.handle} · {formatDay(s.createdAt)}</div>
                  </div>
                  <SharedItemActions
                    groupId={id}
                    share={{ id: s.id, type: s.type, resourceId: s.resourceId }}
                    canRemove={s.sharedBy.id === user.id || canManage}
                    isMine={s.sharedBy.id === user.id}
                    preparations={preps}
                  />
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (tab === "ranking") {
    const [xp, exams] = await Promise.all([
      weeklyXpRanking(id),
      db.groupShare.findMany({ where: { groupId: id, type: "EXAM" }, orderBy: { createdAt: "desc" } }),
    ]);
    return (
      <div className="space-y-4">
        {header}
        <Card>
          <CardTitle>XP da semana</CardTitle>
          <p className="text-xs text-muted">Pontos de experiência dos últimos 7 dias (sessões, questões, testes rápidos e simulados)</p>
          <ol className="mt-3 divide-y divide-border text-sm">
            {xp.map((r, i) => (
              <li key={r.user.id} className={cn("flex items-center gap-3 py-2", r.user.id === user.id && "font-semibold")}>
                <span className="w-6 text-center">{i === 0 && r.weekXp ? "🥇" : i === 1 && r.weekXp ? "🥈" : i === 2 && r.weekXp ? "🥉" : i + 1}</span>
                <Link href={`/u/${r.user.handle}`} className="flex-1 truncate hover:text-primary">{r.user.name} <span className="text-muted">@{r.user.handle}</span></Link>
                <span className="text-xs text-muted">nível {levelFromXp(r.user.xp).level}</span>
                <span className="w-16 text-right font-bold">{r.weekXp} XP</span>
              </li>
            ))}
          </ol>
        </Card>
        {exams.length > 0 && (
          <Card>
            <CardTitle>Simulados do grupo</CardTitle>
            <p className="text-xs text-muted">Todos fazem a mesma prova; o ranking aparece no resultado.</p>
            <ul className="mt-3 divide-y divide-border text-sm">
              {exams.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="truncate">{e.title}</span>
                  <Link href={`/simulados/${e.resourceId}`} className="shrink-0 font-medium text-primary">Fazer / ver ranking</Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  // membros
  const [members, invites] = await Promise.all([
    db.groupMember.findMany({ where: { groupId: id }, include: { user: { select: { id: true, name: true, handle: true, xp: true, avatar: true } } }, orderBy: [{ role: "asc" }, { joinedAt: "asc" }] }),
    db.groupInvite.findMany({ where: { groupId: id, status: "PENDING" }, include: { invitee: { select: { handle: true } } } }),
  ]);
  return (
    <div className="space-y-4">
      {header}
      {canManage && (
        <Card className="space-y-3">
          <CardTitle>Convidar pelo @</CardTitle>
          <InviteForm groupId={id} />
          {invites.length > 0 && (
            <div className="text-sm text-muted">
              Convites pendentes: {invites.map((i) => `@${i.invitee.handle}`).join(", ")}
            </div>
          )}
        </Card>
      )}
      <Card>
        <CardTitle>Membros ({members.length})</CardTitle>
        <ul className="mt-3 divide-y divide-border">
          {members.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center gap-3 py-2 text-sm">
              <Avatar id={m.user.avatar} name={m.user.name} size={32} />
              <Link href={`/u/${m.user.handle}`} className="min-w-0 flex-1 truncate hover:text-primary">{m.user.name} <span className="text-muted">@{m.user.handle}</span></Link>
              <Badge tone={m.role === "MEMBER" ? "neutral" : "primary"}>{ROLE[m.role]}</Badge>
              {m.userId !== user.id && (
                <MemberActions groupId={id} target={{ id: m.userId, role: m.role, handle: m.user.handle! }} myRole={me.role} />
              )}
            </li>
          ))}
        </ul>
      </Card>
      <DangerZone groupId={id} isOwner={me.role === "OWNER"} groupName={group.name} />
    </div>
  );
}

/** O que o aluno pode compartilhar: materiais prontos, resumos, listas de questões e simulados. */
async function shareableResources(userId: string) {
  const [materials, texts, topics, exams] = await Promise.all([
    db.material.findMany({ where: { preparation: { userId }, status: "READY", role: "CONTENT" }, select: { id: true, title: true, preparation: { select: { title: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.studyText.findMany({ where: { topic: { subject: { preparation: { userId } } } }, select: { id: true, part: true, partCount: true, topic: { select: { title: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.topic.findMany({ where: { subject: { preparation: { userId } }, questions: { some: {} } }, select: { id: true, title: true, _count: { select: { questions: true } } }, take: 100 }),
    db.exam.findMany({ where: { ownerId: userId }, select: { id: true, title: true, questionIds: true }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return {
    MATERIAL: materials.map((m) => ({ id: m.id, label: `${m.title} (${m.preparation.title})` })),
    SUMMARY: texts.map((t) => ({ id: t.id, label: `${t.topic.title}${t.partCount > 1 ? ` — parte ${t.part}/${t.partCount}` : ""}` })),
    QUESTION_SET: topics.map((t) => ({ id: t.id, label: `${t.title} (${t._count.questions} questões)` })),
    EXAM: exams.map((e) => ({ id: e.id, label: `${e.title} (${e.questionIds.length} questões)` })),
  };
}
