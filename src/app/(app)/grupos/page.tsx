import Link from "next/link";
import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { hasAccess } from "@/lib/billing";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { CreateGroupForm, InviteResponse } from "./forms";

export const metadata = { title: "Grupos" };

const ROLE = { OWNER: "Dono", ADMIN: "Admin", MEMBER: "Membro" } as const;

export default async function Page() {
  const user = await requireReadyUser();
  const [groups, invites, canCreate] = await Promise.all([
    db.groupMember.findMany({
      where: { userId: user.id },
      include: { group: { include: { _count: { select: { members: true, shares: true } } } } },
      orderBy: { joinedAt: "desc" },
    }),
    db.groupInvite.findMany({ where: { inviteeId: user.id, status: "PENDING" }, include: { group: true, inviter: { select: { handle: true } } }, orderBy: { createdAt: "desc" } }),
    hasAccess(user),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Grupos de estudo</h1>
        <p className="text-sm text-muted">Estude com amigos: compartilhem materiais, resumos e simulados, conversem no mural e disputem o ranking.</p>
      </div>

      {invites.length > 0 && (
        <Card className="space-y-3 border-primary/40">
          <CardTitle>Convites</CardTitle>
          {invites.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span><strong>@{i.inviter.handle}</strong> convidou você para <strong>{i.group.name}</strong></span>
              <InviteResponse inviteId={i.id} />
            </div>
          ))}
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map(({ group, role }) => (
          <Link key={group.id} href={`/grupos/${group.id}`}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{group.name}</h2>
                <Badge tone={role === "MEMBER" ? "neutral" : "primary"}>{ROLE[role]}</Badge>
              </div>
              {group.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{group.description}</p>}
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted"><Users size={13} /> {group._count.members} membro(s) · {group._count.shares} compartilhado(s)</p>
            </Card>
          </Link>
        ))}
        {!groups.length && <Card className="text-sm text-muted sm:col-span-2">Você ainda não está em nenhum grupo.</Card>}
      </div>

      <Card className="space-y-3">
        <CardTitle>Criar grupo</CardTitle>
        {canCreate ? <CreateGroupForm /> : <p className="text-sm text-muted">Criar grupos faz parte do plano. Você ainda pode entrar em grupos pelos convites. <Link href="/assinatura" className="font-semibold text-primary">Assinar plano</Link></p>}
      </Card>
    </div>
  );
}
