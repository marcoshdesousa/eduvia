"use client";
import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SessionLoader } from "./session-loader";

/** Antes de gerar a sessão: o aluno escolhe quanto tempo tem (e vê o convite para descansar, se for o caso). */
export function SessionStart({
  plannedId,
  header,
  options,
  suggested,
  rest,
}: {
  plannedId: string;
  header: { topic: string; subject: string; label: string };
  options: readonly number[];
  suggested: number;
  rest: React.ReactNode | null;
}) {
  const [showRest, setShowRest] = useState(!!rest);
  const [minutes, setMinutes] = useState(suggested);
  const [go, setGo] = useState(false);
  if (go) return <SessionLoader plannedId={plannedId} header={header} minutes={minutes} />;
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
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Duração da sessão">
            {options.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={minutes === m}
                onClick={() => setMinutes(m)}
                className={cn(
                  "rounded-lg border px-2 py-3 text-center font-semibold",
                  minutes === m ? "border-primary bg-primary/15 text-primary" : "border-border hover:bg-surface-2",
                )}
              >
                {m} min
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">A IA monta o texto e a quantidade de questões do tamanho do tempo escolhido.</p>
          <Button className="w-full" onClick={() => setGo(true)}>Começar sessão de {minutes} min</Button>
        </Card>
      )}
    </div>
  );
}
