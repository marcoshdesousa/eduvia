import Link from "next/link";
import { requireReadyUser } from "@/lib/session";
import { drawEssayTheme, drawPortuguesePrompt } from "@/lib/core/essay-themes";
import { EssayForm } from "./essay-form";

export const metadata = { title: "Nova redação" };

export default async function Page({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  await requireReadyUser();
  const portugues = (await searchParams).tipo === "portugues";
  const prompt = portugues ? drawPortuguesePrompt() : drawEssayTheme();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/redacao" className="text-sm text-muted hover:text-foreground">← Redação</Link>
      <h1 className="text-2xl font-bold">{portugues ? "Teste de português" : "Nova redação"}</h1>
      <EssayForm mode={portugues ? "portugues" : "redacao"} initial={prompt} />
    </div>
  );
}
