// Professor IA: professor do ENEM (usa trechos das aulas do Eduvia quando ajudam), com atalhos.
import { db } from "@/lib/db";
import { isMockAi, streamText } from "@/lib/ai/client";
import { profileVoice } from "@/lib/core/profiles";
import { searchChunks } from "@/lib/rag";
import type { SourceRef } from "@/lib/sources";
import { ENEM_PREP_ID, lessonTopicId, MATERIAS } from "@/lib/enem/catalog";

export type Shortcut = "explicar" | "testar" | "questoes" | "erros" | null;

const HISTORY = 12;

const ENEM_SYSTEM = `Você é o Professor IA do Eduvia, um professor de cursinho paciente e didático que prepara alunos para o ENEM, em português do Brasil.
Regras:
- Explique de forma clara e organizada, com exemplos e dicas de como o assunto cai no ENEM. Use Markdown (títulos curtos, listas, negrito) sem exageros. Prefira respostas de até ~250 palavras, a menos que peçam mais.
- Quando houver TRECHOS DAS AULAS do Eduvia relevantes, use-os e cite com o rótulo entre colchetes, ex.: [T1].
- Não invente dados, datas ou fórmulas: se não tiver certeza, diga.
- Em "me testar": faça UMA pergunta por vez (estilo ENEM), espere a resposta, corrija com gentileza e só então faça a próxima.
- Ao criar questões: numere, dê 5 alternativas (A a E) e o gabarito comentado no final.
- Ao analisar erros: identifique padrões (assuntos, tipos de erro), explique os conceitos que faltam e sugira um plano curto.
- Redação: ajude com as 5 competências do ENEM, repertório e proposta de intervenção, mas não escreva a redação inteira pelo aluno.`;

const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Trechos das aulas do Estudar ENEM mais parecidos com a pergunta (busca simples por palavras). */
function lessonHits(query: string, max = 3) {
  const terms = [...new Set(norm(query).split(/[^a-z0-9]+/).filter((w) => w.length > 3))];
  if (!terms.length) return [];
  const scored = MATERIAS.flatMap((m) =>
    m.lessons.map((l, i) => {
      const title = norm(`${m.name} ${l.title}`);
      const body = norm(l.content);
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 5 : 0) + Math.min(5, body.split(t).length - 1), 0);
      return { score, title: `${m.name}: ${l.title}`, content: l.content, topicId: lessonTopicId(m.slug, i) };
    }),
  );
  return scored.filter((x) => x.score >= 3).sort((a, b) => b.score - a.score).slice(0, max);
}

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
  const enem = prep.id === ENEM_PREP_ID;
  const voice = profileVoice(prep.studentType, (prep.details ?? {}) as Record<string, unknown>, prep.editalAnalysis?.banca);

  // contexto: trechos relevantes do material
  const lastAssistant = thread.messages.find((m) => m.role === "assistant")?.content.slice(0, 400) ?? "";
  const query = `${input.content}\n${input.shortcut === "testar" ? lastAssistant : ""}`;
  const hits = enem
    ? lessonHits(query).map((h) => ({ content: h.content, materialTitle: h.title, materialId: "", pageStart: 0, pageEnd: 0 }))
    : await searchChunks(prep.id, query, 8);
  // nas aulas do ENEM não há PDF para abrir: os rótulos servem só para a IA citar
  const refs: SourceRef[] = enem ? [] : hits.map((h, i) => ({ label: `T${i + 1}`, materialId: h.materialId, title: h.materialTitle, pageStart: h.pageStart, pageEnd: h.pageEnd, quote: h.content?.slice(0, 180) }));
  let extra = "";
  if (input.shortcut === "erros") extra = await errorsContext(input.userId, prep.id);
  if (input.shortcut === "testar") extra = await recentTopicsContext(input.userId, prep.id);

  const history = thread.messages
    .slice(1) // a última é a própria mensagem recém-salva
    .reverse()
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
  const final = `${input.content}

<trechos_do_material>
${hits.map((h, i) => (enem ? `<trecho rotulo="T${i + 1}" aula="${h.materialTitle}">\n${h.content.slice(0, 3500)}\n</trecho>` : `<trecho rotulo="T${i + 1}" arquivo="${h.materialTitle}" paginas="${h.pageStart}-${h.pageEnd}">\n${h.content.slice(0, 3500)}\n</trecho>`)).join("\n") || "(nenhum trecho encontrado)"}
</trechos_do_material>${extra ? `\n\n${extra}` : ""}`;

  if (isMockAi()) {
    const text = mockReply(input.content, hits.map((h) => h.content), input.shortcut);
    for (const w of text.split(/(?<=\s)/)) {
      input.onText(w);
      await new Promise((r) => setTimeout(r, 8));
    }
    return { text, refs };
  }
  const text = await streamText({ task: "tutor", userId: input.userId, system: enem ? ENEM_SYSTEM : SYSTEM(voice), messages: [...history, { role: "user", content: final }], onText: input.onText });
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
