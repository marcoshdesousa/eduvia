// Professor IA: responde com base nos materiais do aluno (RAG), com atalhos.
import { db } from "@/lib/db";
import { isMockAi, streamText } from "@/lib/ai/client";
import { profileVoice } from "@/lib/core/profiles";
import { searchChunks } from "@/lib/rag";
import type { SourceRef } from "@/lib/sources";

export type Shortcut = "explicar" | "testar" | "questoes" | "erros" | null;

const HISTORY = 12;

const SYSTEM = (voice: string) => `Você é o Professor IA do Eduvia, um tutor paciente e didático que fala português do Brasil.
Perfil do aluno: ${voice}
Regras:
- Responda com base nos TRECHOS DO MATERIAL do aluno fornecidos em cada mensagem. Cite a origem com o rótulo entre colchetes, ex.: [T2].
- Se o material não cobrir a dúvida, diga isso claramente e dê uma orientação geral curta, deixando claro que não veio do material.
- Seja claro e organizado: use Markdown (títulos curtos, listas, negrito) sem exageros. Prefira respostas de até ~250 palavras, a menos que peçam mais.
- Em "me testar": faça UMA pergunta por vez, espere a resposta, corrija com gentileza e só então faça a próxima.
- Ao criar questões: numere, dê alternativas e o gabarito comentado no final.
- Ao analisar erros: identifique padrões (assuntos, tipos de erro), explique os conceitos que faltam e sugira um plano curto.`;

export async function tutorReply(input: {
  userId: string;
  threadId: string;
  content: string;
  shortcut: Shortcut;
  onText: (delta: string) => void;
}): Promise<{ text: string; refs: SourceRef[] }> {
  const thread = await db.tutorThread.findUniqueOrThrow({
    where: { id: input.threadId },
    include: { preparation: { include: { editalAnalysis: true } }, messages: { orderBy: { createdAt: "desc" }, take: HISTORY + 1 } },
  });
  const prep = thread.preparation;
  const voice = profileVoice(prep.studentType, (prep.details ?? {}) as Record<string, unknown>, prep.editalAnalysis?.banca);

  // contexto: trechos relevantes do material
  const lastAssistant = thread.messages.find((m) => m.role === "assistant")?.content.slice(0, 400) ?? "";
  const hits = await searchChunks(prep.id, `${input.content}\n${input.shortcut === "testar" ? lastAssistant : ""}`, 8);
  const refs: SourceRef[] = hits.map((h, i) => ({ label: `T${i + 1}`, materialId: h.materialId, title: h.materialTitle, pageStart: h.pageStart, pageEnd: h.pageEnd, quote: h.content?.slice(0, 180) }));
  let extra = "";
  if (input.shortcut === "erros") extra = await errorsContext(input.userId, prep.id);
  if (input.shortcut === "testar") extra = await recentTopicsContext(input.userId, prep.id);

  const history = thread.messages
    .slice(1) // a última é a própria mensagem recém-salva
    .reverse()
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
  const final = `${input.content}

<trechos_do_material>
${hits.map((h, i) => `<trecho rotulo="T${i + 1}" arquivo="${h.materialTitle}" paginas="${h.pageStart}-${h.pageEnd}">\n${h.content.slice(0, 3500)}\n</trecho>`).join("\n") || "(nenhum trecho encontrado)"}
</trechos_do_material>${extra ? `\n\n${extra}` : ""}`;

  if (isMockAi()) {
    const text = mockReply(input.content, hits.map((h) => h.content), input.shortcut);
    for (const w of text.split(/(?<=\s)/)) {
      input.onText(w);
      await new Promise((r) => setTimeout(r, 8));
    }
    return { text, refs };
  }
  const text = await streamText({ task: "tutor", userId: input.userId, system: SYSTEM(voice), messages: [...history, { role: "user", content: final }], onText: input.onText });
  return { text, refs };
}

async function errorsContext(userId: string, preparationId: string) {
  const items = await db.reviewItem.findMany({
    where: { userId, inErrorBank: true, question: { topic: { subject: { preparationId } } } },
    include: { question: { include: { topic: { include: { subject: true } }, attempts: { where: { userId, isCorrect: false }, orderBy: { createdAt: "desc" }, take: 1 } } } },
    orderBy: { lapses: "desc" },
    take: 15,
  });
  if (!items.length) return "<erros_do_aluno>O banco de erros está vazio.</erros_do_aluno>";
  return `<erros_do_aluno>
${items
  .map((it) => {
    const q = it.question;
    const opts = (q.options as string[] | null) ?? [];
    const wrong = q.attempts[0]?.answer;
    const given = opts.length ? opts[Number(wrong)] ?? "(em branco)" : wrong || "(em branco)";
    const right = opts.length ? opts[Number(q.correctAnswer)] : q.correctAnswer;
    return `- [${q.topic.subject.name} / ${q.topic.title}] errou ${it.lapses}x. Pergunta: ${q.statement.slice(0, 300)} | Respondeu: ${String(given).slice(0, 200)} | Correta: ${String(right).slice(0, 200)}`;
  })
  .join("\n")}
</erros_do_aluno>`;
}

async function recentTopicsContext(userId: string, preparationId: string) {
  const sessions = await db.studySession.findMany({
    where: { userId, topic: { subject: { preparationId } } },
    include: { topic: true },
    orderBy: { startedAt: "desc" },
    take: 5,
  });
  const titles = [...new Set(sessions.map((s) => s.topic.title))];
  return titles.length ? `<estudado_recentemente>${titles.join("; ")}</estudado_recentemente>` : "";
}

function mockReply(question: string, contents: string[], shortcut: Shortcut) {
  const sentences = contents.join(" ").replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter((s) => s.length > 40).slice(0, 4);
  const intro =
    shortcut === "erros"
      ? "**Análise dos seus erros (demonstração)**\n\nConfigure a chave da IA para uma análise completa. Pelo seu material, reveja:"
      : shortcut === "testar"
        ? "**Pergunta 1:** explique com suas palavras o trecho abaixo."
        : `**Sobre: ${question.slice(0, 80)}**\n\n*Modo de demonstração: resposta montada com trechos do seu material.*`;
  return `${intro}\n\n${sentences.map((s, i) => `- ${s} [T${Math.min(i + 1, contents.length)}]`).join("\n") || "Não encontrei esse assunto no seu material."}`;
}
