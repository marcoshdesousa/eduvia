import { NextResponse } from "next/server";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { getMembership } from "@/lib/groups";

/** Mensagens do mural (as mais recentes, ou só as novas depois de `after`). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await apiUser();
  if (error) return error;
  const { id } = await params;
  if (!(await getMembership(id, user.id))) return jsonError("Sem acesso", 403);
  const after = new URL(req.url).searchParams.get("after");
  const messages = await db.groupMessage.findMany({
    where: { groupId: id, ...(after ? { createdAt: { gt: new Date(after) } } : {}) },
    include: { author: { select: { id: true, name: true, handle: true } } },
    orderBy: { createdAt: after ? "asc" : "desc" },
    take: 100,
  });
  const list = after ? messages : messages.reverse();
  return NextResponse.json({
    messages: list.map((m) => ({ id: m.id, content: m.deletedAt ? null : m.content, createdAt: m.createdAt.toISOString(), author: m.author })),
  });
}
