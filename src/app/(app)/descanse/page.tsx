import { requireReadyUser } from "@/lib/session";
import { restSuggestions } from "@/lib/rest";
import { RestCard } from "@/components/rest-card";

export const metadata = { title: "Descanse" };

/** Aberta quando um limite do dia é atingido ou a IA do aluno pede pausa. */
export default async function Page({ searchParams }: { searchParams: Promise<{ assunto?: string }> }) {
  const user = await requireReadyUser();
  const sp = await searchParams;
  const suggestions = await restSuggestions(user, sp.assunto ?? null);
  const paused = user.aiPausedUntil && user.aiPausedUntil > new Date() ? user.aiPausedUntil : null;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Hora de descansar</h1>
      <RestCard
        title={paused ? "Hora de uma pausa. Descanse um pouco! 🌿" : undefined}
        suggestions={suggestions}
        rechargeAt={paused ?? suggestions.resetAt}
      />
    </div>
  );
}
