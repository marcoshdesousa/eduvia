import Link from "next/link";
import { db } from "@/lib/db";
import { requireReadyUser } from "@/lib/session";
import { drawEssayTheme, drawPortuguesePrompt } from "@/lib/core/essay-themes";
import { EssayForm } from "./essay-form";

export const metadata = { title: "Nova redação" };

export default async function Page({ searchParams }: { searchParams: Promise<{ tipo?: string; prep?: string }> }) {
  const user = await requireReadyUser();
  const sp = await searchParams;
  const portugues = sp.tipo === "portugues";
  const prep = sp.prep ? await db.preparation.findFirst({ where: { id: sp.prep, userId: user.id }, select: { id: true, title: true } }) : null;
  const prompt = portugues ? drawPortuguesePrompt() : drawEssayTheme();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/redacao" className="text-sm text-muted hover:text-foreground">← Redação</Link>
      <h1 className="text-2xl font-bold">{portugues ? "Teste de português" : "Nova redação"}</h1>
      {prep && <p className="text-sm text-muted">Redação da semana de <strong className="text-foreground">{prep.title}</strong></p>}
      <EssayForm mode={portugues ? "portugues" : "redacao"} initial={prompt} preparationId={prep?.id ?? null} />
    </div>
  );
}
