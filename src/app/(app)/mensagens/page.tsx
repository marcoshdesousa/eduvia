import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Empty, PageTitle, ProPhoto } from "@/components/bits";
import { db } from "@/lib/db";
import { shortName } from "@/lib/domain";
import { accountPhotoUrl } from "@/lib/providers";
import { getMode, requireUser, workerPaid } from "@/lib/session";

export const metadata: Metadata = { title: "Mensagens" };

const when = (d: Date) => {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" }) === d.toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
  return today ? d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }) : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
};
const preview = (m: { kind: string; text: string | null } | undefined) =>
  !m ? "Nenhuma mensagem ainda" : m.kind === "AUDIO" ? "🎤 Áudio" : m.kind === "IMAGE" ? `📷 ${m.text ?? "Foto"}` : m.kind === "VIDEO" ? "🎬 Vídeo" : m.kind === "SCHEDULE" ? "📅 Agendamento" : (m.text ?? "");

export default async function MessagesPage() {
  const user = await requireUser("/mensagens");
  if (user.role === "ADMIN") redirect("/admin");
  const asPro = (await getMode(user)) === "trabalho" && !!user.provider;
  if (asPro && !(await workerPaid(user.provider!.id))) redirect("/painel/plano?bloqueado=1");
  const convs = await db.conversation.findMany({
    where: asPro ? { proId: user.provider!.id } : { clientId: user.id },
    orderBy: { lastMessageAt: "desc" },
    take: 100,
    include: {
      client: { select: { name: true } },
      pro: { include: { user: { select: { name: true } }, services: { select: { id: true, photoKey: true, category: true }, orderBy: { createdAt: "asc" } } } },
      messages: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 1, select: { kind: true, text: true, senderId: true } },
      _count: { select: { messages: { where: { readAt: null, deletedAt: null, NOT: { senderId: user.id } } } } },
    },
  });
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <PageTitle title="Mensagens" subtitle={asPro ? "Conversas com os seus clientes." : "Conversas com os prestadores."} />
      {convs.length ? (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {convs.map((c) => {
            const name = asPro ? c.client.name : shortName(c.pro.user.name);
            const unread = c._count.messages;
            return (
              <li key={c.id}>
                <Link href={`/mensagens/${c.id}`} className="flex items-center gap-3 px-3 py-3 hover:bg-surface-2">
                  {asPro ? <ProPhoto url={null} name={c.client.name} size={48} /> : <ProPhoto url={accountPhotoUrl(c.pro)} name={c.pro.user.name} size={48} />}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{name}</span>
                      <span className={unread ? "text-xs font-semibold text-primary" : "text-xs text-muted"}>{when(c.lastMessageAt)}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-muted">{c.messages[0]?.senderId === user.id ? "Você: " : ""}{preview(c.messages[0])}</span>
                      {unread > 0 && <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-[11px] font-bold leading-5 text-primary-foreground">{unread}</span>}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <Empty icon={<MessageCircle />} title="Nenhuma conversa ainda">
          {asPro ? "Quando um cliente mandar mensagem, ela aparece aqui." : <>Abra o perfil de um prestador e toque em <strong>Mandar mensagem</strong>.</>}
        </Empty>
      )}
    </div>
  );
}
