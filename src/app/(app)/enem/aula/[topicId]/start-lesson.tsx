"use client";
import { useState, useTransition } from "react";
import { PlayCircle } from "lucide-react";
import { startEnemLessonAction } from "@/app/actions/enem";
import { Button } from "@/components/ui/button";

/** Botão "Começar aula": prepara a aula (texto + 10 questões do ENEM) e abre. */
export function StartLesson({ topicId }: { topicId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await startEnemLessonAction(topicId);
            if (r?.error) setError(r.error);
          })
        }
      >
        <PlayCircle size={18} /> {pending ? "Preparando a aula..." : "Começar aula"}
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
