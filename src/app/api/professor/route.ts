import { z } from "zod";
import { aiErrorMessage } from "@/lib/ai/client";
import { apiUser, jsonError } from "@/lib/api";
import { db } from "@/lib/db";
import { featureLimitError } from "@/lib/billing";
import { tutorReply } from "@/lib/tutor";

const Body = z.object({
  threadId: z.string().nullish(),
  preparationId: z.string().nullish(),
  content: z.string().trim().min(1).max(4000),
  shortcut: z.enum(["explicar", "testar", "questoes", "erros"]).nullish(),
});

/** Envia uma mensagem ao Professor IA e devolve a resposta em streaming (texto puro). */
export async function POST(req: Request) {
  const { user, error } = await apiUser();
  if (error) return error;
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return jsonError("Mensagem inválida");
  const limit = await featureLimitError(user, "tutor");
  if (limit) return jsonError(limit, 402);
  const b = parsed.data;

  let thread = b.threadId ? await db.tutorThread.findFirst({ where: { id: b.threadId, userId: user.id } }) : null;
  if (!thread) {
    const prep = b.preparationId ? await db.preparation.findFirst({ where: { id: b.preparationId, userId: user.id } }) : null;
    if (!prep) return jsonError("Escolha uma preparação", 400);
    thread = await db.tutorThread.create({ data: { userId: user.id, preparationId: prep.id, title: b.content.replace(/\s+/g, " ").slice(0, 70) } });
  }
  await db.tutorMessage.create({ data: { threadId: thread.id, role: "user", content: b.content } });
  const threadId = thread.id;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { text, refs } = await tutorReply({
          userId: user.id,
          threadId,
          content: b.content,
          shortcut: b.shortcut ?? null,
          onText: (d) => controller.enqueue(encoder.encode(d)),
        });
        const used = refs.filter((r) => text.includes(`[${r.label}]`));
        const saved = await db.tutorMessage.create({ data: { threadId, role: "assistant", content: text, sourceRefs: used } });
        await db.tutorThread.update({ where: { id: threadId }, data: { updatedAt: new Date() } });
        // metadados no fim do fluxo (separador improvável no texto)
        controller.enqueue(encoder.encode(`\u0000${JSON.stringify({ messageId: saved.id, refs: used })}`));
      } catch (e) {
        console.error("[professor]", e);
        controller.enqueue(encoder.encode(`\u0000${JSON.stringify({ error: aiErrorMessage(e, "Não consegui responder agora. Tente de novo.") })}`));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "x-thread-id": threadId, "cache-control": "no-store" } });
}
