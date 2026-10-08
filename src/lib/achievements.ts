// Conquistas (medalhas): catálogo + verificação após cada evento de estudo.
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";

export type Stats = {
  sessions: number;
  longestStreak: number;
  attempts: number;
  resolvedErrors: number;
  bestGame: number;
  bestGameCorrect: number;
  exams: number;
  bestExam: number;
  essays: number;
  bestEnem: number;
  goodTopics: number;
  groups: number;
  xp: number;
};

export type Achievement = { slug: string; name: string; description: string; emoji: string; test: (s: Stats) => boolean };

export const ACHIEVEMENTS: Achievement[] = [
  { slug: "primeira-sessao", name: "Primeiro passo", description: "Conclua sua primeira sessão de estudo.", emoji: "🌱", test: (s) => s.sessions >= 1 },
  { slug: "sessoes-10", name: "Pegando o ritmo", description: "Conclua 10 sessões de estudo.", emoji: "📚", test: (s) => s.sessions >= 10 },
  { slug: "sessoes-50", name: "Maratonista", description: "Conclua 50 sessões de estudo.", emoji: "🏃", test: (s) => s.sessions >= 50 },
  { slug: "sequencia-3", name: "Três em sequência", description: "Estude 3 dias seguidos.", emoji: "📆", test: (s) => s.longestStreak >= 3 },
  { slug: "sequencia-7", name: "Semana perfeita", description: "Estude 7 dias seguidos.", emoji: "⚡", test: (s) => s.longestStreak >= 7 },
  { slug: "sequencia-30", name: "Imparável", description: "Estude 30 dias seguidos.", emoji: "🏆", test: (s) => s.longestStreak >= 30 },
  { slug: "questoes-100", name: "Cem questões", description: "Responda 100 questões.", emoji: "✍️", test: (s) => s.attempts >= 100 },
  { slug: "questoes-500", name: "Quinhentas!", description: "Responda 500 questões.", emoji: "🧠", test: (s) => s.attempts >= 500 },
  { slug: "banco-de-erros", name: "Aprendendo com os erros", description: "Tire 10 questões do banco de erros.", emoji: "🩹", test: (s) => s.resolvedErrors >= 10 },
  { slug: "rapido-10", name: "Mão rápida", description: "Acerte 10 perguntas num teste rápido.", emoji: "⚡", test: (s) => s.bestGameCorrect >= 10 },
  { slug: "rapido-20", name: "Gabaritou!", description: "Acerte as 20 perguntas de um teste rápido.", emoji: "🎈", test: (s) => s.bestGame >= 20 },
  { slug: "primeiro-simulado", name: "Hora da prova", description: "Entregue seu primeiro simulado.", emoji: "📝", test: (s) => s.exams >= 1 },
  { slug: "simulado-9", name: "Nota nove", description: "Tire 9 ou mais num simulado.", emoji: "🎯", test: (s) => s.bestExam >= 9 },
  { slug: "primeira-redacao", name: "Escritor", description: "Envie sua primeira redação para correção.", emoji: "🖋️", test: (s) => s.essays >= 1 },
  { slug: "enem-800", name: "Redação nota 800", description: "Tire 800 ou mais numa redação no padrão ENEM.", emoji: "🌟", test: (s) => s.bestEnem >= 800 },
  { slug: "dominio-5", name: "Dominando", description: "Chegue a \"Bom\" em 5 assuntos.", emoji: "💪", test: (s) => s.goodTopics >= 5 },
  { slug: "em-grupo", name: "Juntos vamos mais longe", description: "Entre ou crie um grupo de estudo.", emoji: "🤝", test: (s) => s.groups >= 1 },
  { slug: "xp-1000", name: "Mil de XP", description: "Acumule 1.000 pontos de experiência.", emoji: "💎", test: (s) => s.xp >= 1000 },
];

export async function computeStats(userId: string): Promise<Stats> {
  const [user, sessions, attempts, resolvedErrors, game, gameCorrect, exams, essays, enem, goodTopics, groups] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { longestStreak: true, xp: true } }),
    db.studySession.count({ where: { userId, completedAt: { not: null } } }),
    db.attempt.count({ where: { userId } }),
    db.reviewItem.count({ where: { userId, resolvedAt: { not: null } } }),
    db.gameRun.aggregate({ where: { userId, gameSlug: "teste-rapido", wrong: 0, correct: { gte: 20 } }, _max: { correct: true } }),
    db.gameRun.aggregate({ where: { userId, gameSlug: "teste-rapido" }, _max: { correct: true } }),
    db.examAttempt.aggregate({ where: { userId, finishedAt: { not: null } }, _count: true, _max: { score: true } }),
    db.essay.count({ where: { userId, status: "EVALUATED" } }),
    db.essay.aggregate({ where: { userId, status: "EVALUATED", rubric: "ENEM" }, _max: { score: true } }),
    db.topicMastery.count({ where: { userId, status: "BOM" } }),
    db.groupMember.count({ where: { userId } }),
  ]);
  return {
    sessions,
    longestStreak: user.longestStreak,
    attempts,
    resolvedErrors,
    bestGame: game._max.correct ?? 0,
    bestGameCorrect: gameCorrect._max.correct ?? 0,
    exams: exams._count,
    bestExam: exams._max.score ?? 0,
    essays,
    bestEnem: enem._max.score ?? 0,
    goodTopics,
    groups,
    xp: user.xp,
  };
}

/** Desbloqueia as conquistas novas e avisa o aluno. Seguro para chamar várias vezes. */
export async function checkAchievements(userId: string): Promise<Achievement[]> {
  const [stats, owned] = await Promise.all([computeStats(userId), db.userAchievement.findMany({ where: { userId }, select: { slug: true } })]);
  const have = new Set(owned.map((o) => o.slug));
  const fresh = ACHIEVEMENTS.filter((a) => !have.has(a.slug) && a.test(stats));
  if (!fresh.length) return [];
  await db.userAchievement.createMany({ data: fresh.map((a) => ({ userId, slug: a.slug })), skipDuplicates: true });
  for (const a of fresh) {
    await notify(userId, { type: "ACHIEVEMENT", title: `Conquista desbloqueada: ${a.emoji} ${a.name}`, body: a.description, href: "/perfil", dedupeKey: `conquista:${a.slug}` });
  }
  return fresh;
}

/** Versão que nunca derruba o fluxo principal (conquista é bônus). */
export function checkAchievementsSafe(userId: string) {
  return checkAchievements(userId).catch((e) => {
    console.error("[conquistas]", e);
    return [] as Achievement[];
  });
}
