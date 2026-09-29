import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api";
import { db } from "@/lib/db";

/** LGPD: exportação dos dados do usuário em JSON. */
export async function GET() {
  const { user, error } = await apiUser({ requireAccess: false });
  if (error) return error;
  const [preparations, attempts, reviewItems, studySessions, xpEvents, studyDays, consents, subscriptions] = await Promise.all([
    db.preparation.findMany({
      where: { userId: user.id },
      include: { subjects: { include: { topics: true } }, materials: { select: { id: true, title: true, kind: true, role: true, status: true, createdAt: true } }, plans: { include: { sessions: true } } },
    }),
    db.attempt.findMany({ where: { userId: user.id }, include: { question: { select: { statement: true, type: true, correctAnswer: true } } } }),
    db.reviewItem.findMany({ where: { userId: user.id } }),
    db.studySession.findMany({ where: { userId: user.id } }),
    db.xpEvent.findMany({ where: { userId: user.id } }),
    db.studyDay.findMany({ where: { userId: user.id } }),
    db.guardianConsent.findMany({ where: { userId: user.id }, select: { guardianName: true, guardianEmail: true, grantedAt: true, createdAt: true } }),
    db.subscription.findMany({ where: { userId: user.id } }),
  ]);
  const { id, name, email, handle, birthDate, createdAt, timezone, xp, currentStreak, longestStreak, termsAcceptedAt, termsVersion } = user;
  const body = {
    exportedAt: new Date().toISOString(),
    user: { id, name, email, handle, birthDate, createdAt, timezone, xp, currentStreak, longestStreak, termsAcceptedAt, termsVersion },
    preparations,
    attempts,
    reviewItems,
    studySessions,
    xpEvents,
    studyDays,
    guardianConsents: consents,
    subscriptions,
  };
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json", "content-disposition": `attachment; filename="eduvia-${handle}-dados.json"` },
  });
}
