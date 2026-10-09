"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { retakeSessionAction } from "@/app/actions/study";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MinutesPicker } from "./minutes-picker";
import { SessionLoader } from "./session-loader";

/**
 * Antes de começar (aula do dia, atrasada ou revisão): o aluno escolhe quanto tempo tem (e vê o convite para
 * descansar, se for o caso). Com `resume`, é uma aula aberta há muito tempo: escolhe o tempo de novo e recomeça.
 */
export function SessionStart({
  plannedId,
  header,
  options,
  suggested,
  rest,
  resume,
}: {
  plannedId: string;
  header: { topic: string; subject: string; label: string };
  options: readonly number[];
  suggested: number;
  rest: React.ReactNode | null;
  resume?: { sessionId: string };
}) {
  const router = useRouter();
  const [showRest, setShowRest] = useState(!!rest);
  const [minutes, setMinutes] = useState(suggested);
  const [go, setGo] = useState(false);
  const [pending, start] = useTransition();
  if (go && !resume) return <SessionLoader plannedId={plannedId} header={header} minutes={minutes} />;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-sm text-muted">{header.subject} · {header.label}</p>
        <h1 className="text-2xl font-bold">{header.topic}</h1>
      </div>
      {showRest ? (
        <div className="space-y-3">
          {rest}
          <Button variant="ghost" onClick={() => setShowRest(false)}>Continuar mesmo assim</Button>
        </div>
      ) : (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 font-semibold"><Clock size={18} className="text-primary" /> Quanto tempo você tem agora?</div>
          <MinutesPicker options={options} value={minutes} onChange={setMinutes} />
          <p className="text-sm text-muted">
            {resume
              ? "Você abriu esta aula há um tempo e não terminou. Escolha o tempo de agora: o cronômetro recomeça e você refaz as questões."
              : "A IA monta o texto e a quantidade de questões do tamanho do tempo escolhido."}
          </p>
          <Button
            className="w-full"
            disabled={pending}
            onClick={() =>
              resume
                ? start(async () => {
                    await retakeSessionAction(resume.sessionId, minutes);
                    router.refresh();
                  })
                : setGo(true)
            }
          >
            {pending ? "Abrindo..." : `Começar sessão de ${minutes} min`}
          </Button>
        </Card>
      )}
    </div>
  );
}
