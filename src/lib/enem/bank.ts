// Banco do Estudar ENEM: grava a preparação fixa (aulas + questões reais do ENEM) no banco de dados e escolhe as
// questões de cada aula e de cada simulado. Só acrescenta/atualiza o que é da plataforma: nada do aluno é apagado.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { AREAS, areaOf, ENEM_EXAMS, ENEM_PREP_ID, ENEM_TITLE, findLesson, LESSON_QUESTIONS, lessonQuizIds, lessonTopicId, materiaSubjectId, MATERIAS, quizChoiceId, quizOpenId, SYSTEM_USER_ID, type AreaKey, type EnemExamKind, type Materia } from "./catalog";

export type BankQuestion = {
  id: string;
  year: number;
  number: number;
  area: AreaKey;
  lang: "ingles" | "espanhol" | null;
  /** matéria provável (por palavras-chave): só ajuda a escolher as questões de cada aula */
  subject: string;
  statement: string;
  options: string[];
  answer: number;
};

/** Versão do catálogo: muda sozinha quando as aulas ou as questões mudam (o servidor atualiza o banco na próxima vez). */
async function catalogVersion() {
  const raw = await readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), "data/enem/questions.json"));
  return `enem-${createHash("sha1").update(SEED_VERSION).update(JSON.stringify(MATERIAS)).update(raw).digest("hex").slice(0, 12)}`;
}
const PROMPT_VERSION = "enem-v1";
const SEED_VERSION = "2";

let bankCache: Promise<BankQuestion[]> | null = null;
export function loadBank() {
  bankCache ??= readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), "data/enem/questions.json"), "utf8").then((s) => JSON.parse(s) as BankQuestion[]);
  return bankCache;
}

const AREA_LABEL: Record<AreaKey, string> = { linguagens: "Linguagens", humanas: "Ciências Humanas", natureza: "Ciências da Natureza", matematica: "Matemática" };
const LANG_LABEL = { ingles: " (Inglês)", espanhol: " (Espanhol)" };

/** Texto de "comentário" de uma questão real (o ENEM não publica resolução): de onde veio e qual é o gabarito. */
export function bankExplanation(q: Pick<BankQuestion, "year" | "number" | "area" | "lang" | "answer">) {
  return `Questão ${q.number} do ENEM ${q.year} — ${AREA_LABEL[q.area]}${q.lang ? LANG_LABEL[q.lang] : ""}. Gabarito oficial (INEP): letra ${"ABCDE"[q.answer]}.`;
}

let ensuring: Promise<void> | null = null;

/** Garante a preparação fixa no banco (rápido quando já está na versão atual). */
export function ensureEnemCatalog() {
  ensuring ??= seed().catch((e) => {
    ensuring = null;
    throw e;
  });
  return ensuring;
}

async function seed() {
  const version = await catalogVersion();
  const done = await db.siteSetting.findUnique({ where: { key: "enem-catalog" } }).catch(() => null);
  if (done?.value === version) return;
  const t0 = Date.now();

  await db.user.upsert({
    where: { id: SYSTEM_USER_ID },
    create: { id: SYSTEM_USER_ID, name: "Eduvia", email: "sistema@eduvia.invalid", remindersEnabled: false },
    update: {},
  });
  await db.preparation.upsert({
    where: { id: ENEM_PREP_ID },
    create: {
      id: ENEM_PREP_ID,
      userId: SYSTEM_USER_ID,
      title: ENEM_TITLE,
      studentType: "ENEM_VESTIBULAR",
      dailyMinutes: 60,
      studyDays: [0, 1, 2, 3, 4, 5, 6],
      studyTime: "19:00",
      lessonsStatus: "DONE",
    },
    update: { title: ENEM_TITLE, status: "ACTIVE" },
  });

  // matérias e aulas
  for (const [mi, m] of MATERIAS.entries()) {
    const subjectId = materiaSubjectId(m.slug);
    await db.subject.upsert({
      where: { id: subjectId },
      create: { id: subjectId, preparationId: ENEM_PREP_ID, name: m.name, order: mi },
      update: { name: m.name, order: mi },
    });
    for (const [li, l] of m.lessons.entries()) {
      const topicId = lessonTopicId(m.slug, li);
      await db.topic.upsert({
        where: { id: topicId },
        create: { id: topicId, subjectId, title: l.title, order: li, source: "MANUAL", estimatedMinutes: 25 },
        update: { subjectId, title: l.title, order: li },
      });
      const key = { topicId, part: 1, partCount: 1, studentType: "ENEM_VESTIBULAR" as const, promptVersion: PROMPT_VERSION };
      const data = { content: l.content, highlights: l.highlights, keyPoints: l.keyPoints, sourceRefs: [] };
      const text = await db.studyText.upsert({ where: { topicId_part_partCount_studentType_promptVersion: key }, create: { ...key, ...data }, update: data, select: { id: true } });
      // quiz próprio da aula: 5 de marcar + 1 a 3 de escrever (atualiza o texto sem mexer nas respostas dos alunos)
      for (const [qi, q] of (l.quiz?.choices ?? []).entries()) {
        const id = quizChoiceId(topicId, qi);
        const row = { topicId, studyTextId: text.id, type: "MULTIPLE_CHOICE" as const, statement: q.q, options: q.options, correctAnswer: String(q.answer), explanation: q.explanation, difficulty: 2 };
        await db.question.upsert({ where: { id }, create: { id, ...row }, update: row });
      }
      for (const [qi, q] of (l.quiz?.open ?? []).entries()) {
        const id = quizOpenId(topicId, qi);
        const row = { topicId, studyTextId: text.id, type: "OPEN_RECALL" as const, statement: q.q, correctAnswer: q.expected, explanation: q.expected, difficulty: 2 };
        await db.question.upsert({ where: { id }, create: { id, ...row }, update: row });
      }
    }
  }

  // bancos das áreas (as questões reais ficam aqui; no simulado, a nota sai por área, como no ENEM)
  for (const [ai, a] of AREAS.entries()) {
    await db.subject.upsert({
      where: { id: a.subjectId },
      create: { id: a.subjectId, preparationId: ENEM_PREP_ID, name: a.name, order: 100 + ai },
      update: { name: a.name, order: 100 + ai },
    });
    await db.topic.upsert({
      where: { id: a.topicId },
      create: { id: a.topicId, subjectId: a.subjectId, title: "Questões do ENEM", order: 0, source: "MANUAL" },
      update: { subjectId: a.subjectId, title: "Questões do ENEM" },
    });
  }

  const bank = await loadBank();
  const existing = new Set((await db.question.findMany({ where: { topic: { subject: { preparationId: ENEM_PREP_ID } } }, select: { id: true } })).map((q) => q.id));
  const rows = bank.map((q) => ({
    id: q.id,
    topicId: areaOf(q.area).topicId,
    type: "MULTIPLE_CHOICE" as const,
    statement: q.statement,
    options: q.options,
    correctAnswer: String(q.answer),
    explanation: bankExplanation(q),
    difficulty: 3,
  }));
  const fresh = rows.filter((r) => !existing.has(r.id));
  for (let i = 0; i < fresh.length; i += 300) await db.question.createMany({ data: fresh.slice(i, i + 300), skipDuplicates: true });
  // as que já existiam: atualiza o texto (correções do banco), sem mexer nas respostas dos alunos
  const old = rows.filter((r) => existing.has(r.id));
  for (let i = 0; i < old.length; i += 100) {
    await db.$transaction(old.slice(i, i + 100).map(({ id, ...r }) => db.question.update({ where: { id }, data: { statement: r.statement, options: r.options, correctAnswer: r.correctAnswer, explanation: r.explanation, topicId: r.topicId } })));
  }

  await db.siteSetting.upsert({ where: { key: "enem-catalog" }, create: { key: "enem-catalog", value: version }, update: { value: version } });
  console.log(`[enem] preparação fixa pronta: ${MATERIAS.length} matérias, ${MATERIAS.reduce((s, m) => s + m.lessons.length, 0)} aulas, ${bank.length} questões (${fresh.length} novas) em ${Date.now() - t0} ms`);
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Questões do ENEM que o aluno já viu e quando foi a última vez (para não repetir; e, se repetir, as mais antigas). */
async function seenIds(userId: string) {
  const rows = await db.attempt.groupBy({ by: ["questionId"], where: { userId, questionId: { startsWith: "enem-" } }, _max: { createdAt: true } });
  const seen = new Map(rows.map((r) => [r.questionId, r._max.createdAt?.getTime() ?? 0]));
  // as que estão numa aula aberta ou num simulado em andamento também contam como vistas
  const [sessions, exams] = await Promise.all([
    db.studySession.findMany({ where: { userId, completedAt: null, topicId: { startsWith: "enem-" } }, select: { questionIds: true } }),
    db.examAttempt.findMany({ where: { userId, finishedAt: null, exam: { preparationId: "enem" } }, select: { exam: { select: { questionIds: true } } } }),
  ]);
  const now = Date.now();
  for (const id of [...sessions.flatMap((x) => x.questionIds), ...exams.flatMap((x) => x.exam.questionIds)]) seen.set(id, now);
  return seen;
}

/**
 * Sorteia `count` questões: primeiro as que o aluno nunca viu (das preferidas, depois das outras);
 * só quando acabarem todas, repete — começando pelas que ele viu há mais tempo. Assim quase nunca repete.
 */
function draw(pool: BankQuestion[], count: number, seen: Map<string, number>, prefer?: (q: BankQuestion) => boolean, exclude = new Set<string>()) {
  const avail = pool.filter((q) => !exclude.has(q.id));
  const fresh = (want: boolean) => shuffle(avail.filter((q) => !seen.has(q.id) && (!prefer || prefer(q) === want)));
  const oldest = avail.filter((q) => seen.has(q.id)).sort((a, b) => seen.get(a.id)! - seen.get(b.id)!);
  const tiers = [fresh(true), prefer ? fresh(false) : [], oldest];
  const out: BankQuestion[] = [];
  for (const t of tiers) {
    for (const q of t) {
      if (out.length >= count) break;
      out.push(q);
    }
  }
  return shuffle(out);
}

/**
 * Perguntas da aula: o quiz próprio dela (5 de marcar + 1 a 3 de escrever, sobre o que foi estudado).
 * Aula ainda sem quiz próprio: 5 questões reais do ENEM da matéria.
 */
export async function lessonQuestionIds(userId: string, topicId: string) {
  const found = findLesson(topicId);
  if (!found) return [];
  const quiz = lessonQuizIds(topicId, found.lesson);
  if (quiz) {
    // as de marcar em ordem sorteada (as de escrever ficam por último)
    const n = found.lesson.quiz!.choices.length;
    return [...shuffle(quiz.slice(0, n)), ...quiz.slice(n)];
  }
  return pickLessonQuestions(userId, found.materia);
}

/** Questões do ENEM para a aula de uma matéria: da área dela, de preferência da própria matéria. */
export async function pickLessonQuestions(userId: string, materia: Materia, count = LESSON_QUESTIONS) {
  const bank = await loadBank();
  const pool = bank.filter((q) => q.area === materia.area && (materia.lang ? q.lang === materia.lang : !q.lang));
  const picked = draw(pool, count, await seenIds(userId), (q) => q.subject === materia.name);
  return picked.map((q) => q.id);
}

/** Questões de um simulado ENEM, na ordem da prova (língua estrangeira, Linguagens, Humanas / Natureza, Matemática). */
export async function pickExamQuestions(userId: string, kind: EnemExamKind) {
  const bank = await loadBank();
  const seen = await seenIds(userId);
  const used = new Set<string>();
  const ids: string[] = [];
  for (const part of ENEM_EXAMS[kind].parts) {
    const pool = bank.filter((q) => q.area === part.area && (part.lang === undefined || (part.lang === null ? !q.lang : q.lang === part.lang)));
    // dentro de cada parte, mistura as matérias como na prova (sem agrupar por assunto)
    for (const q of draw(pool, part.count, seen, undefined, used)) {
      used.add(q.id);
      ids.push(q.id);
    }
  }
  return ids;
}

/** Questões do ENEM para o teste rápido (de uma área ou de todas), as que o aluno ainda não viu primeiro. */
export async function pickQuickQuestions(userId: string, area: AreaKey | "todas", count: number) {
  const bank = await loadBank();
  const pool = area === "todas" ? bank : bank.filter((q) => q.area === area);
  return draw(pool, count, await seenIds(userId)).map((q) => q.id);
}
